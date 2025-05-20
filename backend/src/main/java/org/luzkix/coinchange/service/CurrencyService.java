package org.luzkix.coinchange.service;

import org.luzkix.coinchange.model.Currency;

import java.util.List;

public interface CurrencyService {
    Currency saveCurrency(Currency currency);
    Currency activateCurrency(Long id);
    Currency deactivateCurrency(Long id);
    Currency findByCode(String code);
    List<Currency> findAll();
    List<Currency> findAllActive();
    List<Currency> findAllActiveByType(Currency.CurrencyTypeEnum type);
}
