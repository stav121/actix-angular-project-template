FROM rust:1.100-slim-trixie AS builder
LABEL maintainer="Stavros Grigoriou <unix121@protonmail.com>"

RUN apt-get update -y \
      && apt-get install -y --no-install-recommends pkg-config libssl-dev \
      && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Build the dependencies first so they are cached between source changes
RUN USER=root cargo init --lib --name api
COPY Cargo.toml Cargo.lock ./
RUN mkdir -p src && echo "fn main() {}" > src/main.rs \
      && cargo build --release --locked \
      && rm -rf src

# Copy the source code, migrations and the offline query data
COPY src src
COPY migrations migrations
COPY .sqlx .sqlx
# FIXME: Update the configuration to production
COPY configuration-prod.yaml configuration.yaml

# Build the application without a database connection
ENV SQLX_OFFLINE=true

RUN touch src/lib.rs src/main.rs && cargo build --release --locked

FROM debian:trixie-slim AS runtime

RUN apt-get update -y \
      && apt-get install -y --no-install-recommends openssl ca-certificates \
      && apt-get clean -y \
      && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/api /
COPY --from=builder /app/configuration.yaml /

USER 1001

EXPOSE 8000

ENTRYPOINT ["./api"]
