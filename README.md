# actix-angular-project-template
[![GitHub License](https://img.shields.io/github/license/stav121/actix-angular-project-template?style=for-the-badge&color=yellow)](https://github.com/stav121/actix-angular-project-template/blob/main/LICENSE)
![GitHub Repo stars](https://img.shields.io/github/stars/stav121/actix-angular-project-template?style=for-the-badge&color=blue)
![GitHub forks](https://img.shields.io/github/forks/stav121/actix-angular-project-template?style=for-the-badge&color=teal)
![GitHub commit activity](https://img.shields.io/github/commit-activity/y/stav121/actix-angular-project-template?style=for-the-badge&color=orange)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/stav121/actix-angular-project-template/build-docker.yml?style=for-the-badge)

🦀 Project template that uses Actix Web and Angular with JWT security

<hr>

### Description

Boilerplate Actix Web (Rust) and Angular project that already contains a JWT security implementation in both backend and
Angular, in order to speed up the early stages of development of a full stack project.

This application is already dockerized.

This project is designed to be an easy base for any full stack project you might like.

<hr>

### Try it out!

Checkout the repository and start it using Docker Compose.

```bash
git clone https://github.com/stav121/actix-angular-project-template

cd actix-angular-project-template
docker compose up -d
```

Navigate to: `http://localhost:4200/`

From there, you can register a new user and login to preview the security features.

<hr>

### Stack

<table>
    <tbody>
        <tr>
            <th align="start">Database</th>
            <td>PostgreSQL 18</td>
        </tr>
        <tr>
            <th align="start">SQL Toolkit</th>
            <td>SQLx 0.9</td>
        </tr>
        <tr>
            <th align="start">Backend Framework</th>
            <td>Actix Web 4 (Rust 2024 edition)</td>
        </tr>
        <tr>
            <th align="start">Frontend Framework</th>
            <td>Angular 22 (with PrimeNG 22)</td>
        </tr>
        <tr>
            <th align="start">Security</th>
            <td>Json Web Token (JWT)</td>
        </tr>
    </tbody>
</table>

<hr>

### Existing endpoints

<table>
    <thead>
        <tr>
            <th>Endpoint</th>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>/actuator/health_check</td>
            <td>GET</td>
            <td>Check if the application is up and running</td>
        </tr>
        <tr>
            <td>/auth/login</td>
            <td>POST</td>
            <td>Login a user with the provided credentials, sets up a Cookie for authentication</td>
        </tr>
        <tr>
            <td>/auth/register</td>        
            <td>POST</td>        
            <td>Register a new user</td>        
        </tr>
        <tr>
            <td>/auth/logout</td>
            <td>POST</td>
            <td>Logout the logged in user, remove the authentication Cookie from the user interface</td>
        </tr>
        <tr>
            <td>/auth/profile</td>
            <td>GET</td>
            <td>Retrieve the full profile of the logged in user</td>
        </tr>
    </tbody>
</table>

<hr>

### Existing roles

There are two roles defined in the database, <strong>USER</strong> and <strong>ADMIN</strong>.

When signing up a new user, by default the <strong>USER</strong> role is assigned.

<hr>

### Configuration

The API reads `configuration.yaml` (`configuration-prod.yaml` inside the Docker image). Any value can be overridden
with an environment variable that starts with `APP__` and uses `__` between keys, for example:

```bash
APP__JWT__SECRET=change_me
APP__DATABASE__HOST=db
```

Set at least `APP__JWT__SECRET` before deploying anywhere other than your own machine.

Database migrations in `api/migrations` are applied by the API when it starts.

<hr>

### Development

Requirements: Rust 1.94 or later, Node.js 24.15 or later (26 recommended) and a running PostgreSQL server. The quickest way to get the database is
`docker compose up -d db`.

Backend:

```bash
cd api
cargo run            # start the API on http://localhost:8000
cargo test           # unit and integration tests, needs DATABASE_URL (see api/.env)
cargo fmt --check
cargo clippy --all-targets -- -D warnings
```

The SQL queries are checked at compile time. After changing a query or a migration, refresh the offline query data
used by the Docker build and commit the `.sqlx` directory:

```bash
cargo install sqlx-cli --no-default-features --features postgres,native-tls
cargo sqlx prepare -- --all-targets
```

Frontend:

```bash
cd ui
npm ci
npm start            # dev server on http://localhost:4200
npm test             # unit tests (Vitest), runs once and exits
```

<hr>

### PrimeNG license

From version 22, PrimeNG is distributed under the [PrimeUI License](https://primeui.dev/licenses) instead of MIT.
It is free for individuals, non-profits, non-commercial open source projects and small organizations (see the license
for the exact limits); other organizations need a commercial license. Without a license key, PrimeNG shows an
"Invalid PrimeUI License" notice on the page.

Put your key in `PRIMEUI_LICENSE` in `ui/src/environments/environment.ts` (production and Docker builds) and
`ui/src/environments/environment.development.ts` (`npm start`).

<hr>

### Upgrading from an older checkout

PostgreSQL 18 cannot read the data volume created by the previous PostgreSQL 16 setup. If you ran an older version of
this template, remove the old volume before starting (this deletes the stored users):

```bash
docker compose down -v
```

<hr>

### Contributions

If you like this project and wish to contribute, feel free to make a Pull Request directly to the `main` branch.

<hr>

### Author

Stavros Grigoriou ([stav121](https://github.com/stav121))
