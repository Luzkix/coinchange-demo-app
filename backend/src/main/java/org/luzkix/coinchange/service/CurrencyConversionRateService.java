package org.luzkix.coinchange.service;

import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.backendapi.model.CurrencyConversionRateResponseDto;

public interface CurrencyConversionRateService {
    /**
     * Provides most recent conversion rate for provided pair of currencies.
     * @return CurencyRateResponseDto
     */
    CurrencyConversionRateResponseDto getConversionRate(User user, String soldCurrency, String boughtCurrency);
}
