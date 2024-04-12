FROM rust:1.75.0 AS runtime

WORKDIR /app

RUN apt-get update -y \
      && apt install -y --no-install-recommends openssl ca-certificates \
      && apt-get autoremove -y \
      && apt-get clean -y \
      && rm -rf /var/lib/apt/lists/*

COPY . .

RUN mv configuration-prod.yaml configuration.yaml
RUN mv .env.docker .env

ENV SQLX_OFFLINE true

#RUN cargo install sqlx-cli --version=0.6.3
#RUN sqlx migrate run
#RUN cargo install bunyan
RUN cargo build --release
RUN chmod +x run.sh

EXPOSE 8000

ENTRYPOINT ["./target/release/api"]
