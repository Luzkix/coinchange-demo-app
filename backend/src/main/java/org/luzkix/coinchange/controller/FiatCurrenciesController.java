package org.luzkix.coinchange.controller;

import org.luzkix.coinchange.model.FiatCurrency;
import org.luzkix.coinchange.openapi.backendapi.api.FiatCurrenciesApi;
import org.luzkix.coinchange.openapi.backendapi.model.FiatCurrencyDto;
import org.luzkix.coinchange.service.FiatCurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class FiatCurrenciesController extends GenericController implements FiatCurrenciesApi {

    @Autowired
    private FiatCurrencyService fiatCurrencyService;

    @Override
    public ResponseEntity<List<FiatCurrencyDto>> getSupportedFiatCurrencies() {
        List<FiatCurrency> currencies = fiatCurrencyService.findAllActive();
        List<FiatCurrencyDto> response = currencies.stream()
                .map(currency -> {
                    FiatCurrencyDto dto = new FiatCurrencyDto();
                    dto.setName(currency.getName());
                    dto.setCode(currency.getCode());
                    return dto;
                })
                .toList();

        return ResponseEntity.status(201).body(response);
    }
}