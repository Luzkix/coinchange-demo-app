package org.luzkix.coinchange.controller;

import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.openapi.backendapi.api.CurrenciesApi;
import org.luzkix.coinchange.openapi.backendapi.model.CurrencyResponseDto;
import org.luzkix.coinchange.service.CurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CurrenciesController extends GenericController implements CurrenciesApi {

    @Autowired
    private CurrencyService currencyService;

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
}