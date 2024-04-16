FROM rust:1.75.0 AS builder
MAINTAINER Stavros Grigoriou <unix121@protonmail.com>

WORKDIR /app

RUN USER=root cargo init

# Download the dependency code
COPY Cargo.toml Cargo.toml
RUN cargo fetch

# Copy the source code and configurations
COPY src src
COPY sqlx-data.json sqlx-data.json
# FIXME: Update the configuration to production
COPY configuration-prod.yaml configuration.yaml
COPY .env.docker .env

# Build the application
ENV SQLX_OFFLINE true

RUN cargo build --release

FROM bitnami/minideb:bookworm AS runtime

RUN apt-get update -y \
      && apt install -y --no-install-recommends openssl ca-certificates \
      && apt-get autoremove -y \
      && apt-get clean -y \
      && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/api /
COPY --from=builder /app/configuration.yaml /
COPY --from=builder /app/.env /

USER 1001

EXPOSE 8000

ENTRYPOINT ["./api"]
