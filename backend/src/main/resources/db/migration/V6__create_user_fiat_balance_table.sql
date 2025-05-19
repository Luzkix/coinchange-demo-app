CREATE TABLE user_fiat_balance (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGSERIAL NOT NULL REFERENCES users(id),
    fiat_currency_id BIGSERIAL NOT NULL REFERENCES fiat_currency(id),
    balance DECIMAL(20,8) NOT NULL DEFAULT 0,
    UNIQUE(user_id, fiat_currency_id)
);
