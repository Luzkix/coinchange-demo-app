package org.luzkix.coinchange.service.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.dao.CurrencyDao;
import org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum;
import org.luzkix.coinchange.exceptions.InvalidInputDataException;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.service.CurrencyService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CurrencyServiceImpl implements CurrencyService {
    private final CurrencyDao currencyDao;


    @Override
    public Currency activateCurrency(Long id) {
        Currency currency = currencyDao.findById(id)
                .orElseThrow(() -> new InvalidInputDataException("Currency with id " + id + "was  not found", ErrorBusinessCodeEnum.ENTITY_NOT_FOUND));
        currency.setActive(true);
        return currencyDao.save(currency);
    }

    @Override
    public Currency deactivateCurrency(Long id) {
        Currency currency = currencyDao.findById(id)
                .orElseThrow(() -> new InvalidInputDataException("Currency with id " + id + "was  not found", ErrorBusinessCodeEnum.ENTITY_NOT_FOUND));
        currency.setActive(false);
        return currencyDao.save(currency);
    }

    @Override
    public List<Currency> findAllActive() {
        return currencyDao.findAllActive();
    }

    @Override
    public List<Currency> findAllActiveByType(Currency.CurrencyTypeEnum type) {
        return currencyDao.findAllActiveByType(type);
    }

    @Override
    public Optional<Currency> findByCode(String code) {
        return currencyDao.findByCode(code);
    }
}
