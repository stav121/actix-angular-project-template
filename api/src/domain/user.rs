use crate::model::response::ErrorCode;
use chrono::{DateTime, Utc};
use sqlx::PgPool;

#[doc = "User model used for authentication"]
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, sqlx::FromRow)]
pub struct AuthUser {
    pub user_id: i64,
    pub username: String,
    pub email: String,
    pub password: String,
    pub role: String,
}

#[doc = "User response that is generated from @app_user table"]
#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct UserResponse {
    pub user_id: i64,
    pub username: String,
    pub email: String,
    pub role: String,
    pub created_at: DateTime<Utc>,
}

impl AuthUser {
    #[doc = r#"Retrieve a user from @app_user by the provided identifier (email or username).
    In any error ErrorCode::INTERNAL001 is returned"#]
    pub async fn find_by_identifier(
        identifier: &str,
        pool: &PgPool,
    ) -> Result<Option<Self>, ErrorCode> {
        sqlx::query_as!(
            Self,
            r#"
            SELECT u.user_id,
                   u.username,
                   u.email,
                   u.password,
                   u.role
            FROM app_user u
            WHERE u.username ILIKE $1
               OR u.email ILIKE $1
            "#,
            identifier
        )
        .fetch_optional(pool)
        .await
        .map_err(|_| ErrorCode::INTERNAL001)
    }

    #[doc = "Update the user's last login with the current timestamp."]
    pub async fn update_last_login(&self, pool: &PgPool) -> Result<(), ErrorCode> {
        match sqlx::query!(
            r#"
            UPDATE app_user u
            SET last_login = NOW()
            WHERE u.user_id = $1
            "#,
            self.user_id
        )
        .execute(pool)
        .await
        .map_err(|_| ErrorCode::INTERNAL001)
        {
            Ok(_) => Ok(()),
            Err(c) => Err(c),
        }
    }
}

impl UserResponse {
    #[doc = "Retrieve a user by id, in case of any error ErrorCode::INTERNAL001 is returned"]
    pub async fn find_by_id(id: i64, pool: &PgPool) -> Result<Self, ErrorCode> {
        return sqlx::query_as!(
            Self,
            r#"
            SELECT u.user_id,
                   u.username,
                   u.email,
                   u.role,
                   u.created_at
            FROM app_user u
            WHERE u.user_id = $1
            "#,
            id
        )
        .fetch_one(pool)
        .await
        .map_err(|_| ErrorCode::INTERNAL001);
    }
}
