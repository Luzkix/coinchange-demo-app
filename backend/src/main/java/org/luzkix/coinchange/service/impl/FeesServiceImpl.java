package org.luzkix.coinchange.service.impl;

import org.luzkix.coinchange.dto.projections.TotalFeesForCurrencyDto;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.service.CurrencyConversionService;
import org.luzkix.coinchange.service.FeesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class FeesServiceImpl implements FeesService {

    private CurrencyConversionService currencyConversionService;

    @Autowired // @Lazy used from reason that CurrencyConversionService and FeesService are using each other
    public void setCurrencyConversionService(@Lazy CurrencyConversionService currencyConversionService) {
        this.currencyConversionService = currencyConversionService;
    }

    @Override
    public BigDecimal getTotalFeesConvertedToTargetCurrency(Currency targetCurrency, List<TotalFeesForCurrencyDto> allCurrenciesFees) {
        BigDecimal totalFeesInTargetCurrency = BigDecimal.ZERO;
        for(TotalFeesForCurrencyDto fee : allCurrenciesFees) {
            BigDecimal targetCurrencyConversionRate = currencyConversionService.getMarketConversionRate(fee.getCurrency(),targetCurrency);
            BigDecimal targetCurrencyFee = fee.getTotalFees().multiply(targetCurrencyConversionRate);
            totalFeesInTargetCurrency = totalFeesInTargetCurrency.add(targetCurrencyFee);
        }

        return totalFeesInTargetCurrency;
    }

    @Override
    public BigDecimal calculateConversionRateForFees(BigDecimal conversionRate, User user) {
        return conversionRate.multiply(user.getFeeCategory().getFeeRate());
    }

    @Override
    public BigDecimal calculateConversionRateAfterFees(BigDecimal conversionRate, User user) {
        return conversionRate.subtract(calculateConversionRateForFees(conversionRate, user));
    }
}
