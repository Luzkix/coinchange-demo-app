-- Insert admin user
INSERT INTO users (username, email, password, created_at, updated_at, valid_to)
VALUES ('admin', 'admin@gmail.com', '$2a$12$aTwNldwZin.sSExjRWV8Tu2Ji7XYDJHBPlRMnADe67nqb1GLiEDVu', NOW(), NOW(), '2100-01-01 00:00:00');

-- Assign ADMIN role to the admin user
INSERT INTO user_roles (user_id, role_id)
SELECT id, (SELECT id FROM roles WHERE name = 'ADMIN')
FROM users WHERE username = 'admin';