package org.luzkix.coinchange.dao;

import org.luzkix.coinchange.model.FiatCurrency;

import java.util.List;
import java.util.Optional;

public interface FiatCurrencyDao {
    FiatCurrency saveCurrency(FiatCurrency currency);
    FiatCurrency activateCurrency(Long id);
    FiatCurrency deactivateCurrency(Long id);
    Optional<FiatCurrency> findByCode(String code);
    List<FiatCurrency> findAll();
    List<FiatCurrency> findAllActive();

}
