package org.luzkix.coinchange.dao.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.dao.CryptoCurrencyDao;
import org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum;
import org.luzkix.coinchange.exceptions.InvalidInputDataException;
import org.luzkix.coinchange.model.CryptoCurrency;
import org.luzkix.coinchange.repository.CryptoCurrencyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CryptoCurrencyDaoImpl implements CryptoCurrencyDao {
    private final CryptoCurrencyRepository cryptoCurrencyRepository;

    @Override
    public CryptoCurrency saveCurrency(CryptoCurrency currency) {
        return cryptoCurrencyRepository.save(currency);
    }

    @Override
    public CryptoCurrency activateCurrency(Long id) {
        CryptoCurrency currency = cryptoCurrencyRepository.findById(id)
                .orElseThrow(() -> new InvalidInputDataException("Currency with id " + id + "was  not found", ErrorBusinessCodeEnum.ENTITY_NOT_FOUND));
        currency.setActive(true);
        return cryptoCurrencyRepository.save(currency);
    }

    @Override
    public CryptoCurrency deactivateCurrency(Long id) {
        CryptoCurrency currency = cryptoCurrencyRepository.findById(id)
                .orElseThrow(() -> new InvalidInputDataException("Currency with id " + id + "was  not found", ErrorBusinessCodeEnum.ENTITY_NOT_FOUND));
        currency.setActive(false);
        return cryptoCurrencyRepository.save(currency);
    }

    @Override
    public Optional<CryptoCurrency> findByCode(String code) {
        return cryptoCurrencyRepository.findByCode(code);
    }

    @Override
    public List<CryptoCurrency> findAll() {
        return cryptoCurrencyRepository.findAll();
    }

    @Override
    public List<CryptoCurrency> findAllActive() {
        return cryptoCurrencyRepository.findByIsActiveTrue();
    }
}
