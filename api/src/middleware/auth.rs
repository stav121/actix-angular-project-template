use crate::server::AppState;
use actix_web::dev::Payload;
use actix_web::error::ErrorUnauthorized;
use actix_web::{http, web, FromRequest, HttpMessage, HttpRequest};
use jsonwebtoken::{decode, DecodingKey, Validation};
use secrecy::ExposeSecret;
use std::fmt;
use std::future::ready;

#[doc = "Token claims supported for the JWT"]
#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct TokenClaims {
    pub sub:  String,
    pub iat:  usize,
    pub exp:  usize,
    pub role: String,
}

#[doc = "Error response"]
#[derive(Debug, serde::Serialize)]
struct ErrorResponse {
    status:  String,
    message: String,
}

impl fmt::Display for ErrorResponse {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", serde_json::to_string(&self).unwrap())
    }
}

#[derive(Debug)]
pub struct AuthDetails {
    pub user_id: i64,
    pub role:    String,
}

impl FromRequest for AuthDetails {
    type Error = actix_web::Error;
    type Future = std::future::Ready<Result<Self, Self::Error>>;

    #[doc = "Intercept the request to authorize the user that made the call"]
    fn from_request(req: &HttpRequest, _: &mut Payload) -> Self::Future {
        let data: &web::Data<AppState> = req.app_data::<web::Data<AppState>>().unwrap();

        // Parse the token from the cookie
        let token: Option<String> = req
            .cookie(&data.settings.jwt.cookie_name)
            .map(|c| c.value().to_string())
            .or_else(|| {
                req.headers()
                    .get(http::header::AUTHORIZATION)
                    .map(|h| h.to_str().unwrap().split_at(7).1.to_string())
            });

        if token.is_none() {
            return ready(Err(ErrorUnauthorized(ErrorResponse {
                status:  "fail".to_string(),
                message: "No token provided".to_string(),
            })));
        }

        let claims = match decode::<TokenClaims>(
            &token.unwrap(),
            &DecodingKey::from_secret(data.settings.jwt.secret.expose_secret().as_ref()),
            &Validation::default(),
        ) {
            Ok(c) => c.claims,
            Err(_) => {
                return ready(Err(ErrorUnauthorized(ErrorResponse {
                    status:  "fail".to_string(),
                    message: "Invalid token".to_string(),
                })));
            }
        };

        // Retrieve the user's id and role
        let user_id: i64 = claims.sub.as_str().parse::<i64>().unwrap();
        let role: String = claims.role.to_owned();
        req.extensions_mut().insert::<i64>(user_id.to_owned());

        ready(Ok(AuthDetails { user_id, role }))
    }
}
