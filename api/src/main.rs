use api::config::app_settings::{Settings, get_configuration};
use api::config::logging::{create_logging_subscriber, init_sub};
use api::server::run;
use sqlx::PgPool;
use sqlx::postgres::PgPoolOptions;
use std::net::TcpListener;

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    // Initialize the logging subscriber of the application.
    let subscriber = create_logging_subscriber("api".into(), "info".into());
    init_sub(subscriber);

    // Load the application configuration
    let settings: Settings = get_configuration().expect("Failed to read app configuration");

    // Connect to the database
    let pg_pool: PgPool = PgPoolOptions::new().connect_lazy_with(settings.database.get_options());

    // Apply any pending database migrations before serving requests.
    sqlx::migrate!()
        .run(&pg_pool)
        .await
        .expect("Failed to run database migrations");

    // Configure the listener.
    let listener =
        TcpListener::bind(settings.application.get_addr()).expect("Failed to bind address");

    run(listener, settings, pg_pool).await?.await
}
