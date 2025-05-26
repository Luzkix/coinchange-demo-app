package org.luzkix.coinchange.service;

import org.luzkix.coinchange.openapi.backendapi.model.CurencyConversionRateResponseDto;

public interface CurrencyConversionRateService {
    /**
     * Provides most recent conversion rate for provided pair of currencies.
     * @return CurencyRateResponseDto
     */
    CurencyConversionRateResponseDto getConversionRate(String soldCurrency, String boughtCurrency);
}
