package org.luzkix.coinchange.service;

import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.FeeCategory;
import org.luzkix.coinchange.model.User;

import java.math.BigDecimal;

public interface FeesService {

    BigDecimal getTotalFeesInTargetCurrency(Currency targetCurrency);
    BigDecimal getTotalFeesInTargetCurrencyForUser(User user, Currency targetCurrency);
    BigDecimal calculateConversionRateForFees(BigDecimal conversionRate, User user);
    BigDecimal calculateConversionRateForFees(BigDecimal conversionRate, FeeCategory feeCategory);
    BigDecimal calculateConversionRateAfterFees(BigDecimal conversionRate, User user);
    BigDecimal calculateConversionRateAfterFees(BigDecimal conversionRate, FeeCategory feeCategory);
}
