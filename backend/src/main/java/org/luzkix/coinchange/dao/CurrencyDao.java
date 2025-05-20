package org.luzkix.coinchange.dao;

import org.luzkix.coinchange.model.Currency;

import java.util.List;
import java.util.Optional;

public interface CurrencyDao {
    Currency saveCurrency(Currency currency);
    Currency activateCurrency(Long id);
    Currency deactivateCurrency(Long id);
    Optional<Currency> findByCode(String code);
    List<Currency> findAll();
    List<Currency> findAllActive();
    List<Currency> findAllActiveByType(Currency.CurrencyTypeEnum type);

}
