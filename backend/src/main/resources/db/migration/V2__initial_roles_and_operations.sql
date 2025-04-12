-- Create table for roles
CREATE TABLE roles (
                       id BIGSERIAL PRIMARY KEY,
                       name VARCHAR(50) NOT NULL UNIQUE,
                       description VARCHAR(255)
);

-- Create table for operations
CREATE TABLE operations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- Create join table for users and roles
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Create join table for roles and operations
CREATE TABLE role_operations (
    role_id BIGINT NOT NULL,
    operation_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, operation_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (operation_id) REFERENCES operations(id) ON DELETE CASCADE
);

-- Insert roles
INSERT INTO roles (name, description) VALUES
    ('ADMIN', 'Administrator with access to all sections'),
    ('USER', 'Registered user with access to trading and personal account');

-- Insert operations
INSERT INTO operations (name, description) VALUES
    ('ACCESS_USER_SECTION', 'Access to user trading and account section'),
    ('ACCESS_ADMIN_SECTION', 'Access to admin settings section');

-- Map roles to operations
INSERT INTO role_operations (role_id, operation_id) VALUES
    (1, 1), -- ADMIN can ACCESS_USER_SECTION
    (1, 2), -- ADMIN can ACCESS_ADMIN_SECTION
    (2, 1); -- USER can ACCESS_USER_SECTION
