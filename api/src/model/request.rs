#[doc = "Requests related to user registration"]
pub mod registration {
    #[doc = "User registration request"]
    #[derive(Debug, serde::Deserialize)]
    pub struct RegistrationRequest {
        pub username: String,
        pub email: String,
        pub password: String,
    }
}

#[doc = "Requests related to user authentication"]
pub mod auth {
    #[doc = "Login request"]
    #[derive(Debug, serde::Deserialize)]
    pub struct LoginRequest {
        #[doc = "The user's identifier, email or username"]
        pub identifier: String,
        pub password: String,
    }
}
