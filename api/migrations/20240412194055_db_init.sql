-----------------------------------------------------------------
-- Description: Basic migration that creates roles for the users
-- of the application and the basic user schema.
--
-- @author: Stavros Grigoriou <unix121@protonmail.com>
-----------------------------------------------------------------

-------------------
-- Table: user_role
-------------------
CREATE TABLE user_role
(
    role_id    VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT user_role_role_id_pk PRIMARY KEY (role_id)
);

COMMENT ON TABLE user_role IS 'Available roles of the application';
COMMENT ON COLUMN user_role.role_id IS 'The role name - pk';
COMMENT ON COLUMN user_role.created_at IS 'The date the role was created';

-- Insert the basic role: USER
INSERT INTO user_role (role_id)
VALUES ('USER'),
       ('ADMIN');

------------------
-- Table: app_user
------------------
CREATE TABLE app_user
(
    user_id    BIGSERIAL    NOT NULL,
    username   VARCHAR(50)  NOT NULL UNIQUE CHECK (username ~ '^[a-zA-Z0-9_]*$'),
    email      VARCHAR(255) NOT NULL,
    password   VARCHAR(100) NOT NULL,
    role       VARCHAR(20)  NOT NULL DEFAULT 'USER',
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT app_user_user_id_pk PRIMARY KEY (user_id)
);

COMMENT ON TABLE app_user IS 'Application user list';
COMMENT ON COLUMN app_user.user_id IS 'The id of the user - pk';
COMMENT ON COLUMN app_user.username IS 'The username of the user, only alphanumeric and underscore are allowed';
COMMENT ON COLUMN app_user.email IS 'The email of the user';
COMMENT ON COLUMN app_user.password IS 'The password of the user (encrypted)';
COMMENT ON COLUMN app_user.role IS 'The role of the user, default USER';
COMMENT ON COLUMN app_user.last_login IS 'The date the user was last logged in';
COMMENT ON COLUMN app_user.created_at IS 'The date the user was created';

CREATE UNIQUE INDEX app_user_email_unique_idx ON app_user (LOWER(email));
CREATE UNIQUE INDEX app_user_username_unique_idx ON app_user (LOWER(username));