CREATE TABLE fee_categories (
    id BIGSERIAL PRIMARY KEY,
    category VARCHAR(1) NOT NULL,
    fee_rate DECIMAL(5,4) NOT NULL,
    CONSTRAINT chk_fee_category CHECK (category IN ('A','B','C','D','E','F')),
    CONSTRAINT uq_fee_category UNIQUE (category)
);

INSERT INTO fee_categories (category, fee_rate) VALUES
    ('F', 0.005),
    ('E', 0.004),
    ('D', 0.003),
    ('C', 0.002),
    ('B', 0.001),
    ('A', 0.000);
