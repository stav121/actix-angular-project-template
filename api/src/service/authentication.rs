use crate::config::app_settings::Settings;
use crate::domain::user::AuthUser;
use crate::middleware::auth::TokenClaims;
use crate::model::request::auth::LoginRequest;
use crate::model::response::ErrorCode;
use crate::model::response::ErrorCode::{AUTH001, AUTH002};
use argon2::{Argon2, PasswordHash, PasswordVerifier};
use chrono::{DateTime, Utc};
use jsonwebtoken::{encode, EncodingKey, Header};
use secrecy::ExposeSecret;
use sqlx::PgPool;

#[doc = r#"Login the user that matches the provided credentials.
Identificiation is done by matching the email or username of the user.

Errors:

ErrorCode::AUTH001 -> The provided user was not found.
ErrorCode::AUTH002 -> The user's password does not match.
ErrorCode::INTERNAL001 -> Any other error.
"#]
pub async fn login_user(
    data: LoginRequest,
    settings: &Settings,
    pool: &PgPool,
) -> Result<String, ErrorCode> {
    // Fetch the user from the database
    let user: Option<AuthUser> = match AuthUser::find_by_identifier(&data.identifier, pool).await {
        Ok(r) => r,
        Err(c) => return Err(c),
    };

    // User not found
    if user.is_none() {
        return Err(AUTH001);
    }

    // Verify the user's password
    let is_password_valid: bool = user.to_owned().map_or(false, |u| {
        let parsed_hash: PasswordHash = PasswordHash::new(&u.password).unwrap();
        Argon2::default()
            .verify_password(data.password.as_bytes(), &parsed_hash)
            .map_or(false, |_| true)
    });

    // Invalid password
    if !is_password_valid {
        return Err(AUTH002);
    }

    let user = user.unwrap();

    // Create a JWT for the user
    let now: DateTime<Utc> = Utc::now();
    let iat: usize = now.timestamp() as usize;
    let exp: usize = (now + chrono::Duration::minutes(settings.jwt.max_age)).timestamp() as usize;
    let role: String = user.role.to_owned();
    let claims: TokenClaims = TokenClaims {
        sub: user.user_id.to_string(),
        exp,
        iat,
        role,
    };

    let token: String = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(settings.jwt.secret.expose_secret().as_ref()),
    )
    .unwrap();

    // Update the last login date
    match user.update_last_login(pool).await {
        Ok(_) => Ok(token),
        Err(c) => Err(c),
    }
}
