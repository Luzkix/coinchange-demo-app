package org.luzkix.coinchange.dto.projections;

import org.luzkix.coinchange.model.Currency;

import java.math.BigDecimal;

public interface TotalFeesForCurrencyDto {
    Currency getCurrency(); //currency used for grouping of the fees (USD, BTC...)
    BigDecimal getTotalFees(); //sum of the fees for the currency (e.g. 2,01 (USD), 3,24 (BTC)...)
}
