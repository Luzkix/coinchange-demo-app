CREATE TABLE fee_categories (
    id BIGSERIAL PRIMARY KEY,
    category VARCHAR(1) NOT NULL,
    fee DECIMAL(5,2) NOT NULL,
    CONSTRAINT chk_fee_category CHECK (category IN ('A','B','C','D','E','F')),
    CONSTRAINT uq_fee_category UNIQUE (category)
);

INSERT INTO fee_categories (category, fee) VALUES
    ('F', 0.50),
    ('E', 0.40),
    ('D', 0.30),
    ('C', 0.20),
    ('B', 0.10),
    ('A', 0.00);
