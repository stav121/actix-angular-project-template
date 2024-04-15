# actix-angular-project-template
![GitHub Repo stars](https://img.shields.io/github/stars/stav121/actix-angular-project-template?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/stav121/actix-angular-project-template?style=for-the-badge)
![GitHub commit activity](https://img.shields.io/github/commit-activity/y/stav121/actix-angular-project-template?style=for-the-badge)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/stav121/actix-angular-project-template/build-docker?style=for-the-badge)

🦀 Project template that uses Actix Web and Angular with JWT security

<hr>

### Description

Boilerplate Actix Web (Rust) and Angular project that already contains a JWT security implementation in both backend and
Angular, in order to speed up the early stages of development of a full stack project.

This application is already dockerized.

<hr>

### Try it out!

Checkout the repository and start it using `docker-compose`.

```bash
git clone https://github.com/stav121/actix-angular-project-template

docker-compose up -d
```

Navigate to: `https://localhost:4200/`

<hr>

### Stack

<table>
    <tbody>
        <tr>
            <th align="start">Database</th>
            <td>PostgreSQL</td>
        </tr>
        <tr>
            <th align="start">SQL Toolkit</th>
            <td>SQLx</td>
        </tr>
        <tr>
            <th align="start">Backend Framework</th>
            <td>Actix Web</td>
        </tr>
        <tr>
            <th align="start">Frontend Framework</th>
            <td>Angular</td>
        </tr>
        <tr>
            <th align="start">Secrurity</th>
            <td>JWT</td>
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

<hr>

### Author

Stavros Grigoriou ([stav121](https://github.com/stav121))
