package org.luzkix.coinchange.controller;

import org.luzkix.coinchange.model.CryptoCurrency;
import org.luzkix.coinchange.openapi.backendapi.api.CryptoCurrenciesApi;
import org.luzkix.coinchange.openapi.backendapi.model.CryptoCurrencyDto;
import org.luzkix.coinchange.service.CryptoCurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CryptoCurrenciesController extends GenericController implements CryptoCurrenciesApi {

    @Autowired
    private CryptoCurrencyService cryptoCurrencyService;

    @Override
    public ResponseEntity<List<CryptoCurrencyDto>> getSupportedCryptoCurrencies() {
        List<CryptoCurrency> currencies = cryptoCurrencyService.findAllActive();
        List<CryptoCurrencyDto> response = currencies.stream()
                .map(currency -> {
                    CryptoCurrencyDto dto = new CryptoCurrencyDto();
                    dto.setName(currency.getName());
                    dto.setCode(currency.getCode());
                    return dto;
                })
                .toList();

        return ResponseEntity.status(201).body(response);
    }
}