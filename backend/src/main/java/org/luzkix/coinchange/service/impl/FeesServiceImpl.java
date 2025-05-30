package org.luzkix.coinchange.service.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.dto.projections.TotalFeesForCurrencyDto;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.service.CurrencyConversionService;
import org.luzkix.coinchange.service.FeesService;
import org.luzkix.coinchange.service.TransactionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeesServiceImpl implements FeesService {

    private final TransactionService transactionService;
    private final CurrencyConversionService currencyConversionService;

    @Value("${fee.default-conversion-currency}")
    private String defaultCurrencyCodeForFeeConversion;

    @Override
    public BigDecimal getTotalFeesConvertedToTargetCurrency(Currency targetCurrency, List<TotalFeesForCurrencyDto> allCurrenciesFees) {
        BigDecimal totalFeesInTargetCurrency = BigDecimal.ZERO;
        for(TotalFeesForCurrencyDto fee : allCurrenciesFees) {
            BigDecimal targetCurrencyConversionRate = currencyConversionService.getConversionRate(fee.getCurrency(),targetCurrency);
            BigDecimal targetCurrencyFee = fee.getTotalFees().multiply(targetCurrencyConversionRate);
            totalFeesInTargetCurrency = totalFeesInTargetCurrency.add(targetCurrencyFee);
        }

        return totalFeesInTargetCurrency;
    }
}
