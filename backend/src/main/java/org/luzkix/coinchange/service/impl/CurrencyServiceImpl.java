package org.luzkix.coinchange.service.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.dao.CurrencyDao;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.service.CurrencyService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CurrencyServiceImpl implements CurrencyService {
    private final CurrencyDao currencyDao;

    @Override
    public Currency saveCurrency(Currency currency) {
        return currencyDao.saveCurrency(currency);
    }

    @Override
    public Currency activateCurrency(Long id) {
        return currencyDao.activateCurrency(id);
    }

    @Override
    public Currency deactivateCurrency(Long id) {
        return currencyDao.deactivateCurrency(id);
    }

    @Override
    public Currency findByCode(String code) {
        return currencyDao.findByCode(code).orElse(null);
    }

    @Override
    public List<Currency> findAll() {
        return currencyDao.findAll();
    }

    @Override
    public List<Currency> findAllActive() {
        return currencyDao.findAllActive();
    }

    @Override
    public List<Currency> findAllActiveByType(Currency.CurrencyTypeEnum type) {
        return currencyDao.findAllActiveByType(type);
    }
}
