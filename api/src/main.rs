use api::config::app_settings::{get_configuration, Settings};
use api::config::logging::{create_logging_subscriber, init_sub};
use api::server::run;
use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;
use std::net::TcpListener;

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    // Initialize the logging subscriber of the application.
    let subscriber = create_logging_subscriber("api".into(), "info".into());
    init_sub(subscriber);

    if std::env::var_os("RUST_LOG").is_none() {
        std::env::set_var("RUST_LOG", "actix_web=info");
    }

    // Load the application configuration
    let settings: Settings = get_configuration().expect("Failed to read app configuration");

    // Connect to the database
    let pg_pool: PgPool = PgPoolOptions::new().connect_lazy_with(settings.database.get_options());

    // Configure the listener.
    let listener =
        TcpListener::bind(settings.application.get_addr()).expect("Failed to bind address");

    run(listener, settings, pg_pool).await?.await
}
