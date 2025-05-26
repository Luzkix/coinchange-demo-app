package org.luzkix.coinchange.dao.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.dao.CurrencyDao;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.repository.CurrencyRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CurrencyDaoImpl implements CurrencyDao {
    private final CurrencyRepository currencyRepository;

    @Override
    public Currency save(Currency currency) {
        return currencyRepository.save(currency);
    }

    @Override
    public Optional<Currency> findByCode(String code) {
        return currencyRepository.findByCode(code);
    }

    @Override
    public Optional<Currency> findById(Long id) {
        return currencyRepository.findById(id);
    }

    @Override
    public List<Currency> findAll() {
        return currencyRepository.findAll();
    }

    @Override
    public List<Currency> findAllActive() {
        return currencyRepository.findByIsActiveTrue();
    }

    @Override
    public List<Currency> findAllActiveByType(Currency.CurrencyTypeEnum type) {
        return currencyRepository.findByIsActiveTrueAndType(type);
    }
}
