package org.luzkix.coinchange.service;

import org.luzkix.coinchange.dto.projections.TotalFeesForCurrencyDto;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.FeeCategory;
import org.luzkix.coinchange.model.User;

import java.math.BigDecimal;
import java.util.List;

public interface FeesService {

    BigDecimal getTotalFeesConvertedToTargetCurrency(Currency targetCurrency, List<TotalFeesForCurrencyDto> allCurrenciesFees);
    BigDecimal calculateConversionRateForFees(BigDecimal conversionRate, User user);
    BigDecimal calculateConversionRateForFees(BigDecimal conversionRate, FeeCategory feeCategory);
    BigDecimal calculateConversionRateAfterFees(BigDecimal conversionRate, User user);
    BigDecimal calculateConversionRateAfterFees(BigDecimal conversionRate, FeeCategory feeCategory);
}
