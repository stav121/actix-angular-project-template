use actix_web::{get, HttpResponse};

/// API Resource: /actuator/health_check \[GET\]
///
/// Check the status of the application.
///
/// # Returns
///
/// Http 200OK if the application is up and running.
#[tracing::instrument(name = "Checking the application health")]
#[get("/actuator/health_check")]
pub async fn health_check_handler() -> HttpResponse {
    HttpResponse::Ok().finish()
}
