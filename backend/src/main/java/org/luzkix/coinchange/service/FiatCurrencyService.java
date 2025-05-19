package org.luzkix.coinchange.service;

import org.luzkix.coinchange.model.FiatCurrency;

import java.util.List;

public interface FiatCurrencyService {
    FiatCurrency saveCurrency(FiatCurrency currency);
    FiatCurrency activateCurrency(Long id);
    FiatCurrency deactivateCurrency(Long id);
    FiatCurrency findByCode(String code);
    List<FiatCurrency> findAll();
    List<FiatCurrency> findAllActive();
}
