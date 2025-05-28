package org.luzkix.coinchange.controller;

import org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum;
import org.luzkix.coinchange.exceptions.InvalidInputDataException;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.backendapi.api.CurrenciesApi;
import org.luzkix.coinchange.openapi.backendapi.model.CurrencyConversionRateResponseDto;
import org.luzkix.coinchange.openapi.backendapi.model.CurrencyResponseDto;
import org.luzkix.coinchange.service.CurrencyConversionRateService;
import org.luzkix.coinchange.service.CurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
public class CurrenciesController extends GenericController implements CurrenciesApi {

    @Autowired
    private CurrencyService currencyService;

    @Autowired
    private CurrencyConversionRateService currencyConversionRateService;

    @Override
    public ResponseEntity<List<CurrencyResponseDto>> getSupportedCurrencies() {
        List<Currency> currencies = currencyService.findAllActive();
        List<CurrencyResponseDto> response = currencies.stream()
                .map(currency -> {
                    CurrencyResponseDto dto = new CurrencyResponseDto();
                    dto.setId(currency.getId());
                    dto.setName(currency.getName());
                    dto.setCode(currency.getCode());
                    dto.setIsActive(currency.isActive());
                    dto.setType(currency.getType().getTypeValue());
                    return dto;
                })
                .toList();

        return ResponseEntity.status(201).body(response);
    }

    @Override
    public ResponseEntity<List<CurrencyResponseDto>> getSupportedCurrenciesForType(String type) {
        List<Currency> currencies = currencyService.findAllActiveByType(Currency.CurrencyTypeEnum.fromValue(type));
        List<CurrencyResponseDto> response = currencies.stream()
                .map(currency -> {
                    CurrencyResponseDto dto = new CurrencyResponseDto();
                    dto.setId(currency.getId());
                    dto.setName(currency.getName());
                    dto.setCode(currency.getCode());
                    dto.setIsActive(currency.isActive());
                    dto.setType(currency.getType().getTypeValue());
                    return dto;
                })
                .toList();

        return ResponseEntity.status(201).body(response);
    }

    @Override
    public ResponseEntity<CurrencyConversionRateResponseDto> getConversionRate(String soldCurrencyCode, String boughtCurrencyCode) {
        User user = getUserFromAuthentication();

        Currency soldCurrency = currencyService.findByCode(soldCurrencyCode).orElse(null);
        Currency boughtCurrency = currencyService.findByCode(boughtCurrencyCode).orElse(null);

        if (soldCurrency == null || boughtCurrency == null) throw new InvalidInputDataException(
                String.format("Sold or bought currency codes not found in database: %s, %s", soldCurrency, boughtCurrency),
                ErrorBusinessCodeEnum.ENTITY_NOT_FOUND);

        BigDecimal conversionRate = currencyConversionRateService.getConversionRate(soldCurrency, boughtCurrency);

        CurrencyConversionRateResponseDto response = new CurrencyConversionRateResponseDto();
        response.setSoldCurrencyId(soldCurrency.getId());
        response.setSoldCurrencyCode(soldCurrency.getCode());
        response.setBoughtCurrencyId(boughtCurrency.getId());
        response.setBoughtCurrencyCode(boughtCurrency.getCode());
        response.setFeePercentage(user.getFeeCategory().getFee());
        response.setConversionRate(conversionRate);

        return ResponseEntity.status(201).body(response);
    }
}