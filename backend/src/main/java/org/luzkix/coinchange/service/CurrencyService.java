package org.luzkix.coinchange.service;

import org.luzkix.coinchange.model.Currency;

import java.util.List;

public interface CurrencyService {
    Currency activateCurrency(Long id);
    Currency deactivateCurrency(Long id);
    List<Currency> findAllActive();
    List<Currency> findAllActiveByType(Currency.CurrencyTypeEnum type);

}
