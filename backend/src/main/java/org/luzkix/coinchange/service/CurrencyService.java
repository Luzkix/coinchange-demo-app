package org.luzkix.coinchange.service;

import org.luzkix.coinchange.model.Currency;

import java.util.List;
import java.util.Optional;

public interface CurrencyService {
    Currency activateCurrency(Long id);
    Currency deactivateCurrency(Long id);
    List<Currency> findAllActive();
    List<Currency> findAllActiveByType(Currency.CurrencyTypeEnum type);
    Optional<Currency> findByCode(String code);

}
