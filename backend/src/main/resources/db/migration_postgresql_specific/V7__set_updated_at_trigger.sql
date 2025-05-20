-- PostgreSQL only!
-- Database function for updating the field 'updated_at'
CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger calling the function set_updated_at() before each UPDATE of the table (== no need to deal with updated_at in java)
CREATE TRIGGER trg_set_updated_at
    BEFORE UPDATE ON user_currency_balances
    FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();