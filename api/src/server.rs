use crate::config::app_settings::{AppSettings, Settings};
use crate::route::actuator::health_check_handler;
use crate::route::auth::{login_handler, logout_handler, profile_handler, register_user_handler};
use actix_cors::Cors;
use actix_web::dev::Server;
use actix_web::http::header;
use actix_web::middleware::Logger;
use actix_web::web::{scope, ServiceConfig};
use actix_web::{web, App, HttpServer};
use sqlx::{Pool, Postgres};
use std::net::TcpListener;

#[doc = "Application state"]
pub struct AppState {
    pub db:       Pool<Postgres>,
    pub settings: Settings,
}

#[doc = "Setup the service served by the application."]
fn get_config(conf: &mut ServiceConfig, settings: &AppSettings) {
    conf.service(
        scope(&settings.api_prefix)
            .service(health_check_handler)
            .service(register_user_handler)
            .service(login_handler)
            .service(logout_handler)
            .service(profile_handler),
    );
}

#[doc = "Create a runnable server instance."]
pub async fn run(
    tcp_listener: TcpListener,
    settings: Settings,
    pg_pool: Pool<Postgres>,
) -> Result<Server, std::io::Error> {
    let server = HttpServer::new(move || {
        // Configure CORS
        let cors = if &settings.application.cors_location != "*" {
            Cors::default()
                .allowed_origin(&settings.application.cors_location)
                .allowed_methods(vec!["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
                .allowed_headers(vec![
                    header::CONTENT_TYPE,
                    header::ACCEPT,
                    header::AUTHORIZATION,
                ])
                .supports_credentials()
        } else {
            Cors::default()
                .send_wildcard()
                .allowed_methods(vec!["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
                .allowed_headers(vec![
                    header::CONTENT_TYPE,
                    header::ACCEPT,
                    header::AUTHORIZATION,
                ])
                .supports_credentials()
        };

        // Configure the application
        App::new()
            .app_data(web::Data::new(AppState {
                db:       pg_pool.clone(),
                settings: settings.clone(),
            }))
            .configure(|c| get_config(c, &settings.application))
            .wrap(cors)
            .wrap(Logger::default())
    })
    .listen(tcp_listener)?
    .run();

    Ok(server)
}
