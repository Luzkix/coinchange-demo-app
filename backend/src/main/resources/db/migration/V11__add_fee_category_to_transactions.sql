ALTER TABLE transactions
    ADD COLUMN fee_category_id BIGINT NOT NULL DEFAULT 1 REFERENCES fee_categories(id);
