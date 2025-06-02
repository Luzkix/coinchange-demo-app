package org.luzkix.coinchange.service;

import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.Transaction;
import org.luzkix.coinchange.model.User;

import java.math.BigDecimal;

public interface CurrencyConversionService {
    /**
     * Provides most recent conversion rate for provided pair of currencies.
     * @return BigDecimal
     */
    BigDecimal getMarketConversionRate(Currency soldCurrency, Currency boughtCurrency);

    Transaction convertCurrenciesUsingSimpleTrading(String verificationToken, BigDecimal soldCurrencyAmount, User user);

    Transaction convertCurrenciesUsingAdvancedTrading(String soldCurrencyCode,
                                                      String boughtCurrencyCode,
                                                      BigDecimal userSelectedConversionRate,
                                                      BigDecimal soldCurrencyAmount,
                                                      User user);

    Transaction checkAndConvertPendingTransaction(Transaction transaction);

}
