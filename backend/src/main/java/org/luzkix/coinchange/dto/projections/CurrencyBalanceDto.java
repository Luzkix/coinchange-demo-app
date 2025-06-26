package org.luzkix.coinchange.dto.projections;

import org.luzkix.coinchange.model.Currency;

import java.math.BigDecimal;

public interface CurrencyBalanceDto {
    Currency getCurrency(); //currency used for grouping of the balances (USD, BTC...)
    BigDecimal getBalance(); //calculated balance for the currency (e.g. 2,01 (USD), 3,24 (BTC)...)
}
