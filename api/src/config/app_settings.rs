use secrecy::{ExposeSecret, SecretString};
use sqlx::postgres::{PgConnectOptions, PgSslMode};

#[doc = "Application settings"]
#[derive(serde::Deserialize, Clone)]
pub struct Settings {
    pub application: AppSettings,
    pub jwt: JwtSettings,
    pub database: DatabaseSettings,
}

#[doc = "Settings for application (host, port, cors)"]
#[derive(serde::Deserialize, Clone)]
pub struct AppSettings {
    pub host: String,
    pub port: u16,
    pub cors_location: String,
    pub api_prefix: String,
}

#[doc = "Settings for JWT security"]
#[derive(serde::Deserialize, Clone)]
pub struct JwtSettings {
    pub secret: SecretString,
    pub expires_in: String,
    pub max_age: i64,
    pub cookie_domain: String,
    pub cookie_name: String,
}

#[doc = "Configuration for the database"]
#[derive(serde::Deserialize, Clone)]
pub struct DatabaseSettings {
    pub username: SecretString,
    pub password: SecretString,
    pub port: u16,
    pub host: String,
    pub database_name: String,
}

#[doc = r#"Function that deserializes the "configuration.yaml" into Settings.

Any value can be overridden with an environment variable prefixed with APP, using "__" as
the separator, e.g. APP__JWT__SECRET or APP__DATABASE__HOST."#]
pub fn get_configuration() -> Result<Settings, config::ConfigError> {
    let settings = config::Config::builder()
        .add_source(config::File::new(
            "configuration.yaml",
            config::FileFormat::Yaml,
        ))
        .add_source(
            config::Environment::with_prefix("APP")
                .prefix_separator("__")
                .separator("__")
                .try_parsing(true),
        )
        .build()?;

    settings.try_deserialize::<Settings>()
}

impl AppSettings {
    #[doc = "Retrieve the URL address of the application."]
    pub fn get_addr(&self) -> String {
        format!("{}:{}", self.host, self.port)
    }
}

impl DatabaseSettings {
    #[doc = "Retrieve the PgConnectOptions for the database"]
    pub fn get_options(&self) -> PgConnectOptions {
        PgConnectOptions::new()
            .database(&self.database_name)
            .host(&self.host)
            .username(self.username.expose_secret())
            .password(self.password.expose_secret())
            .port(self.port)
            .ssl_mode(PgSslMode::Prefer)
    }
}
