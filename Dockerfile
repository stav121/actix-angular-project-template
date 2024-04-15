FROM rust:1.75.0 AS runtime
MAINTAINER Stavros Grigoriou <unix121@protonmail.com>

RUN apt-get update -y \
      && apt install -y --no-install-recommends openssl ca-certificates \
      && apt-get autoremove -y \
      && apt-get clean -y \
      && rm -rf /var/lib/apt/lists/*

COPY api/migrations/* migrations/
COPY api/.env.docker .env

# Migrate the database
RUN cargo install sqlx-cli --version=0.6.3

ENTRYPOINT ["sqlx", "migrate", "run"]
