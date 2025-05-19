package org.luzkix.coinchange.dao.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.dao.FiatCurrencyDao;
import org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum;
import org.luzkix.coinchange.exceptions.InvalidInputDataException;
import org.luzkix.coinchange.model.FiatCurrency;
import org.luzkix.coinchange.repository.FiatCurrencyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FiatCurrencyDaoImpl implements FiatCurrencyDao {
    private final FiatCurrencyRepository fiatCurrencyRepository;

    @Override
    public FiatCurrency saveCurrency(FiatCurrency currency) {
        return fiatCurrencyRepository.save(currency);
    }

    @Override
    public FiatCurrency activateCurrency(Long id) {
        FiatCurrency currency = fiatCurrencyRepository.findById(id)
                .orElseThrow(() -> new InvalidInputDataException("Currency with id " + id + "was  not found", ErrorBusinessCodeEnum.ENTITY_NOT_FOUND));
        currency.setActive(true);
        return fiatCurrencyRepository.save(currency);
    }

    @Override
    public FiatCurrency deactivateCurrency(Long id) {
        FiatCurrency currency = fiatCurrencyRepository.findById(id)
                .orElseThrow(() -> new InvalidInputDataException("Currency with id " + id + "was  not found", ErrorBusinessCodeEnum.ENTITY_NOT_FOUND));
        currency.setActive(false);
        return fiatCurrencyRepository.save(currency);
    }

    @Override
    public Optional<FiatCurrency> findByCode(String code) {
        return fiatCurrencyRepository.findByCode(code);
    }

    @Override
    public List<FiatCurrency> findAll() {
        return fiatCurrencyRepository.findAll();
    }

    @Override
    public List<FiatCurrency> findAllActive() {
        return fiatCurrencyRepository.findByIsActiveTrue();
    }
}
