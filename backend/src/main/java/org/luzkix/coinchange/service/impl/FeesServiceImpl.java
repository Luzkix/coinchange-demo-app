package org.luzkix.coinchange.service.impl;

import org.luzkix.coinchange.dto.projections.TotalFeesForCurrencyDto;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.FeeCategory;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.service.CurrencyConversionService;
import org.luzkix.coinchange.service.FeesService;
import org.luzkix.coinchange.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class FeesServiceImpl implements FeesService {

    private CurrencyConversionService currencyConversionService;
    private TransactionService transactionService;

    @Autowired // @Lazy used from reason that CurrencyConversionService and FeesService are using each other
    public void setCurrencyConversionService(@Lazy CurrencyConversionService currencyConversionService, TransactionService transactionService) {
        this.currencyConversionService = currencyConversionService;
        this.transactionService = transactionService;
    }

    @Override
    public BigDecimal getTotalFeesInTargetCurrency(Currency targetCurrency) {
        List<TotalFeesForCurrencyDto> allCurrenciesFees = transactionService.getTotalConvertedFeesForProcessedTransactions();
        return getTotalFeesConvertedToTargetCurrency(targetCurrency,allCurrenciesFees);
    }

    @Override
    public BigDecimal getTotalFeesInTargetCurrencyForUser(User user, Currency targetCurrency) {
        List<TotalFeesForCurrencyDto> allCurrenciesFees = transactionService.getTotalConvertedFeesForProcessedTransactionsAndUser(user);
        return getTotalFeesConvertedToTargetCurrency(targetCurrency,allCurrenciesFees);
    }

    @Override
    public BigDecimal calculateConversionRateForFees(BigDecimal conversionRate, User user) {
        return conversionRate.multiply(user.getFeeCategory().getFeeRate());
    }

    @Override
    public BigDecimal calculateConversionRateForFees(BigDecimal conversionRate, FeeCategory feeCategory) {
        return conversionRate.multiply(feeCategory.getFeeRate());
    }

    @Override
    public BigDecimal calculateConversionRateAfterFees(BigDecimal conversionRate, User user) {
        return conversionRate.subtract(calculateConversionRateForFees(conversionRate, user));
    }

    @Override
    public BigDecimal calculateConversionRateAfterFees(BigDecimal conversionRate, FeeCategory feeCategory) {
        return conversionRate.subtract(calculateConversionRateForFees(conversionRate, feeCategory));
    }

    //PRIVATE METHODS
    public BigDecimal getTotalFeesConvertedToTargetCurrency(Currency targetCurrency, List<TotalFeesForCurrencyDto> allCurrenciesFees) {
        //1.detecting unique currencies used in allCurrenciesFees and loading their current conversion rate to targetCurrency
        Set<Currency> uniqueCurrencies = new HashSet<>();
        for (TotalFeesForCurrencyDto currencyFee : allCurrenciesFees) {
            uniqueCurrencies.add(currencyFee.getCurrency());
        }

        Map<Currency, BigDecimal> currenciesWithTargetConversionRates = new HashMap<>();
        for(Currency currency : uniqueCurrencies) {
            currenciesWithTargetConversionRates.put(currency, currencyConversionService.getMarketConversionRate(currency,targetCurrency));
        }

        //2. calculating totalFeesInTargetCurrency using previously created map with loaded target conversion rates
        BigDecimal totalFeesInTargetCurrency = BigDecimal.ZERO;
        for(TotalFeesForCurrencyDto fee : allCurrenciesFees) {
            BigDecimal targetCurrencyConversionRate = currenciesWithTargetConversionRates.get(fee.getCurrency());
            BigDecimal targetCurrencyFee = fee.getTotalFees().multiply(targetCurrencyConversionRate);
            totalFeesInTargetCurrency = totalFeesInTargetCurrency.add(targetCurrencyFee);
        }

        return totalFeesInTargetCurrency;
    }
}
