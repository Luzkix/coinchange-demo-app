package org.luzkix.coinchange.service;

import org.luzkix.coinchange.model.Currency;

import java.math.BigDecimal;

public interface CurrencyConversionRateService {
    /**
     * Provides most recent conversion rate for provided pair of currencies.
     * @return BigDecimal
     */
    BigDecimal getConversionRate(Currency soldCurrency, Currency boughtCurrency);
}
