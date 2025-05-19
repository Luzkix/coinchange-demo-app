CREATE TABLE user_crypto_balance (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGSERIAL NOT NULL REFERENCES users(id),
    crypto_currency_id BIGSERIAL NOT NULL REFERENCES crypto_currency(id),
    balance DECIMAL(38,18) NOT NULL DEFAULT 0,
    UNIQUE(user_id, crypto_currency_id)
);
