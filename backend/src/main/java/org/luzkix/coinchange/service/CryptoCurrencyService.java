package org.luzkix.coinchange.service;

import org.luzkix.coinchange.model.CryptoCurrency;

import java.util.List;

public interface CryptoCurrencyService {
    CryptoCurrency saveCurrency(CryptoCurrency currency);
    CryptoCurrency activateCurrency(Long id);
    CryptoCurrency deactivateCurrency(Long id);
    CryptoCurrency findByCode(String code);
    List<CryptoCurrency> findAll();
    List<CryptoCurrency> findAllActive();
}
