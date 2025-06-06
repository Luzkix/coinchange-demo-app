CREATE TABLE currencies (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(10) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    type VARCHAR(1) NOT NULL -- 'F' = fiat, 'C' = crypto
);

ALTER TABLE currencies
ADD CONSTRAINT chk_currency_type CHECK (type IN ('F', 'C'));