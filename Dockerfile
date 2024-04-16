FROM rust:1.75.0 AS runtime
MAINTAINER Stavros Grigoriou <unix121@protonmail.com>

COPY api/migrations/* migrations/
COPY api/.env.docker .env

# Migrate the database
RUN cargo install sqlx-cli --version=0.6.3

ENTRYPOINT ["sqlx", "migrate", "run"]
