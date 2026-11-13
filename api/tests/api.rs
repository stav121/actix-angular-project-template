//! End-to-end tests for the HTTP API.
//!
//! Each test gets its own throwaway database from `#[sqlx::test]`, which needs `DATABASE_URL`
//! to point at a running PostgreSQL server (see `.env`). Migrations are applied automatically.

use api::config::app_settings::{AppSettings, DatabaseSettings, JwtSettings, Settings};
use api::server::run;
use reqwest::StatusCode;
use serde_json::{Value, json};
use sqlx::PgPool;
use std::net::TcpListener;

const PASSWORD: &str = "Sup3r-secret";

struct TestApp {
    address: String,
    client: reqwest::Client,
}

impl TestApp {
    async fn spawn(pool: PgPool) -> Self {
        let listener = TcpListener::bind("127.0.0.1:0").expect("Failed to bind random port");
        let port = listener.local_addr().unwrap().port();

        let settings = Settings {
            application: AppSettings {
                host: "127.0.0.1".into(),
                port,
                cors_location: "http://localhost:4200".into(),
                api_prefix: "/api".into(),
            },
            jwt: JwtSettings {
                secret: "test_secret".into(),
                expires_in: "15m".into(),
                max_age: 15,
                cookie_domain: "localhost".into(),
                cookie_name: "auth-token".into(),
            },
            // Unused: the server receives the test pool directly.
            database: DatabaseSettings {
                username: "user".into(),
                password: "password".into(),
                port: 5432,
                host: "localhost".into(),
                database_name: "db".into(),
            },
        };

        let server = run(listener, settings, pool)
            .await
            .expect("Failed to start server");
        tokio::spawn(server);

        Self {
            address: format!("http://127.0.0.1:{port}/api"),
            client: reqwest::Client::new(),
        }
    }

    async fn register(&self, username: &str, email: &str) -> reqwest::Response {
        self.client
            .post(format!("{}/auth/register", self.address))
            .json(&json!({"username": username, "email": email, "password": PASSWORD}))
            .send()
            .await
            .unwrap()
    }

    async fn login(&self, identifier: &str, password: &str) -> reqwest::Response {
        self.client
            .post(format!("{}/auth/login", self.address))
            .json(&json!({"identifier": identifier, "password": password}))
            .send()
            .await
            .unwrap()
    }

    async fn token_for(&self, identifier: &str) -> String {
        let body: Value = self.login(identifier, PASSWORD).await.json().await.unwrap();
        body["token"].as_str().unwrap().to_string()
    }
}

async fn error_code(response: reqwest::Response) -> String {
    let body: Value = response.json().await.unwrap();
    body["code"].as_str().unwrap().to_string()
}

#[sqlx::test]
async fn health_check_returns_ok(pool: PgPool) {
    let app = TestApp::spawn(pool).await;

    let response = app
        .client
        .get(format!("{}/actuator/health_check", app.address))
        .send()
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
}

#[sqlx::test]
async fn register_creates_user_with_default_role(pool: PgPool) {
    let app = TestApp::spawn(pool.clone()).await;

    let response = app.register("alice", "alice@example.com").await;

    assert_eq!(response.status(), StatusCode::OK);
    let body: Value = response.json().await.unwrap();
    assert_eq!(body["username"], "alice");
    assert_eq!(body["email"], "alice@example.com");
    assert_eq!(body["role"], "USER");
    assert!(body.get("password").is_none());

    let stored: String =
        sqlx::query_scalar("SELECT password FROM app_user WHERE username = 'alice'")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert!(
        stored.starts_with("$argon2"),
        "password must be stored hashed"
    );
}

#[sqlx::test]
async fn register_rejects_duplicate_username(pool: PgPool) {
    let app = TestApp::spawn(pool).await;
    app.register("alice", "alice@example.com").await;

    let response = app.register("ALICE", "other@example.com").await;

    assert_eq!(response.status(), StatusCode::CONFLICT);
    assert_eq!(error_code(response).await, "REG001");
}

#[sqlx::test]
async fn register_rejects_duplicate_email(pool: PgPool) {
    let app = TestApp::spawn(pool).await;
    app.register("alice", "alice@example.com").await;

    let response = app.register("bob", "Alice@Example.com").await;

    assert_eq!(response.status(), StatusCode::CONFLICT);
    assert_eq!(error_code(response).await, "REG002");
}

#[sqlx::test]
async fn register_with_invalid_username_returns_internal_error(pool: PgPool) {
    let app = TestApp::spawn(pool).await;

    // The database only accepts alphanumeric characters and underscores.
    let response = app.register("not valid!", "alice@example.com").await;

    assert_eq!(response.status(), StatusCode::INTERNAL_SERVER_ERROR);
    assert_eq!(error_code(response).await, "INTERNAL001");
}

#[sqlx::test]
async fn login_with_username_or_email_sets_cookie_and_returns_token(pool: PgPool) {
    let app = TestApp::spawn(pool.clone()).await;
    app.register("alice", "alice@example.com").await;

    for identifier in ["alice", "alice@example.com"] {
        let response = app.login(identifier, PASSWORD).await;

        assert_eq!(response.status(), StatusCode::OK);
        let cookie = response
            .cookies()
            .find(|c| c.name() == "auth-token")
            .expect("auth cookie must be set");
        let cookie_value = cookie.value().to_string();
        let body: Value = response.json().await.unwrap();
        assert_eq!(body["token"], cookie_value);
    }

    let last_login: Option<chrono::DateTime<chrono::Utc>> =
        sqlx::query_scalar("SELECT last_login FROM app_user WHERE username = 'alice'")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert!(last_login.is_some());
}

#[sqlx::test]
async fn login_with_unknown_user_returns_not_found(pool: PgPool) {
    let app = TestApp::spawn(pool).await;

    let response = app.login("nobody", PASSWORD).await;

    assert_eq!(response.status(), StatusCode::NOT_FOUND);
    assert_eq!(error_code(response).await, "AUTH001");
}

#[sqlx::test]
async fn login_with_wrong_password_returns_bad_request(pool: PgPool) {
    let app = TestApp::spawn(pool).await;
    app.register("alice", "alice@example.com").await;

    let response = app.login("alice", "wrong-password").await;

    assert_eq!(response.status(), StatusCode::BAD_REQUEST);
    assert_eq!(error_code(response).await, "AUTH002");
}

#[sqlx::test]
async fn profile_returns_logged_in_user(pool: PgPool) {
    let app = TestApp::spawn(pool).await;
    app.register("alice", "alice@example.com").await;
    let token = app.token_for("alice").await;

    let response = app
        .client
        .get(format!("{}/auth/profile", app.address))
        .bearer_auth(token)
        .send()
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
    let body: Value = response.json().await.unwrap();
    assert_eq!(body["username"], "alice");
    assert_eq!(body["role"], "USER");
}

#[sqlx::test]
async fn profile_accepts_token_from_cookie(pool: PgPool) {
    let app = TestApp::spawn(pool).await;
    app.register("alice", "alice@example.com").await;
    let token = app.token_for("alice").await;

    let response = app
        .client
        .get(format!("{}/auth/profile", app.address))
        .header(reqwest::header::COOKIE, format!("auth-token={token}"))
        .send()
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
}

#[sqlx::test]
async fn profile_rejects_missing_or_invalid_token(pool: PgPool) {
    let app = TestApp::spawn(pool).await;
    let url = format!("{}/auth/profile", app.address);

    let missing = app.client.get(&url).send().await.unwrap();
    assert_eq!(missing.status(), StatusCode::UNAUTHORIZED);

    let invalid = app
        .client
        .get(&url)
        .bearer_auth("not-a-jwt")
        .send()
        .await
        .unwrap();
    assert_eq!(invalid.status(), StatusCode::UNAUTHORIZED);

    // Used to panic the worker: header shorter than the "Bearer " prefix.
    let short = app
        .client
        .get(&url)
        .header(reqwest::header::AUTHORIZATION, "abc")
        .send()
        .await
        .unwrap();
    assert_eq!(short.status(), StatusCode::UNAUTHORIZED);
}

#[sqlx::test]
async fn logout_clears_auth_cookie(pool: PgPool) {
    let app = TestApp::spawn(pool).await;
    app.register("alice", "alice@example.com").await;
    let token = app.token_for("alice").await;

    let response = app
        .client
        .post(format!("{}/auth/logout", app.address))
        .bearer_auth(token)
        .send()
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::NO_CONTENT);
    let cookie = response
        .cookies()
        .find(|c| c.name() == "auth-token")
        .expect("logout must reset the auth cookie");
    assert_eq!(cookie.value(), "");
}
