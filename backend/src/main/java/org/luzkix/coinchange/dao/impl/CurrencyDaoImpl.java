package org.luzkix.coinchange.dao.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.dao.CurrencyDao;
import org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum;
import org.luzkix.coinchange.exceptions.InvalidInputDataException;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.repository.CurrencyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CurrencyDaoImpl implements CurrencyDao {
    private final CurrencyRepository currencyRepository;

    @Override
    public Currency saveCurrency(Currency currency) {
        return currencyRepository.save(currency);
    }

    @Override
    public Currency activateCurrency(Long id) {
        Currency currency = currencyRepository.findById(id)
                .orElseThrow(() -> new InvalidInputDataException("Currency with id " + id + "was  not found", ErrorBusinessCodeEnum.ENTITY_NOT_FOUND));
        currency.setActive(true);
        return currencyRepository.save(currency);
    }

    @Override
    public Currency deactivateCurrency(Long id) {
        Currency currency = currencyRepository.findById(id)
                .orElseThrow(() -> new InvalidInputDataException("Currency with id " + id + "was  not found", ErrorBusinessCodeEnum.ENTITY_NOT_FOUND));
        currency.setActive(false);
        return currencyRepository.save(currency);
    }

    @Override
    public Optional<Currency> findByCode(String code) {
        return currencyRepository.findByCode(code);
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
