package org.luzkix.coinchange.dao;

import org.luzkix.coinchange.model.CryptoCurrency;

import java.util.List;
import java.util.Optional;

public interface CryptoCurrencyDao {
    CryptoCurrency saveCurrency(CryptoCurrency currency);
    CryptoCurrency activateCurrency(Long id);
    CryptoCurrency deactivateCurrency(Long id);
    Optional<CryptoCurrency> findByCode(String code);
    List<CryptoCurrency> findAll();
    List<CryptoCurrency> findAllActive();

}
