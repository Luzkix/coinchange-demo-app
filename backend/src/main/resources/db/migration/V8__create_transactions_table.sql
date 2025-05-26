CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    sold_currency_id BIGINT NOT NULL REFERENCES currencies(id),
    bought_currency_id BIGINT NOT NULL REFERENCES currencies(id),
    amount_sold DECIMAL(20,8) NOT NULL,
    amount_bought DECIMAL(20,8) NOT NULL,
    transaction_fee_currency_id BIGINT NOT NULL REFERENCES currencies(id),
    transaction_fee_amount DECIMAL(20,8) NOT NULL,
    price_of_bought_currency DECIMAL(20,8) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- 'DEPOSIT', 'WITHDRAWAL', 'CONVERSION'
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    processed_at TIMESTAMP WITHOUT TIME ZONE,
    cancelled_at TIMESTAMP WITHOUT TIME ZONE,
    external_reference VARCHAR(100),
    note VARCHAR(255)
);

ALTER TABLE transactions
    ADD CONSTRAINT chk_transaction_type CHECK (transaction_type IN ('DEPOSIT', 'WITHDRAWAL', 'CONVERSION'));
