use actix_web::HttpResponse;
use serde_json::json;

#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
pub enum ErrorCode {
    #[doc = "Username already exists"]
    REG001,
    #[doc = "Email already exists"]
    REG002,

    #[doc = "The user was not found"]
    AUTH001,
    #[doc = "The user's password is wrong"]
    AUTH002,

    #[doc = "Generic internal server error"]
    INTERNAL001,
}

#[doc = "Application specific error model, used for better error tracking"]
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct ErrorResponse {
    pub code: ErrorCode,
}

impl ErrorResponse {
    #[doc = "Create a new error response"]
    pub fn new(code: ErrorCode) -> Self {
        Self { code }
    }

    #[doc = "Build an error response from the provided error code, mapping each error to the \
             matching Http status code"]
    pub fn build(code: ErrorCode) -> HttpResponse {
        match code {
            ErrorCode::REG001 | ErrorCode::REG002 => HttpResponse::Conflict(),
            ErrorCode::AUTH001 => HttpResponse::NotFound(),
            ErrorCode::AUTH002 => HttpResponse::BadRequest(),
            _ => HttpResponse::InternalServerError(),
        }
        .json(json!(ErrorResponse::new(code)))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::http::StatusCode;

    #[test]
    fn error_codes_map_to_http_status() {
        let cases = [
            (ErrorCode::REG001, StatusCode::CONFLICT),
            (ErrorCode::REG002, StatusCode::CONFLICT),
            (ErrorCode::AUTH001, StatusCode::NOT_FOUND),
            (ErrorCode::AUTH002, StatusCode::BAD_REQUEST),
            (ErrorCode::INTERNAL001, StatusCode::INTERNAL_SERVER_ERROR),
        ];

        for (code, status) in cases {
            assert_eq!(ErrorResponse::build(code).status(), status);
        }
    }
}
