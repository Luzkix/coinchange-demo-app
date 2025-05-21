package org.luzkix.coinchange.dao;

import org.luzkix.coinchange.model.Currency;

import java.util.List;
import java.util.Optional;

public interface CurrencyDao {
    Currency save(Currency currency);
    Optional<Currency> findByCode(String code);
    Optional<Currency> findById(Long id);
    List<Currency> findAll();
    List<Currency> findAllActive();
    List<Currency> findAllActiveByType(Currency.CurrencyTypeEnum type);

}
