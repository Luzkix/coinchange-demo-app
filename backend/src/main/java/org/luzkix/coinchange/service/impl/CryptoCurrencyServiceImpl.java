package org.luzkix.coinchange.service.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.dao.CryptoCurrencyDao;
import org.luzkix.coinchange.model.CryptoCurrency;
import org.luzkix.coinchange.service.CryptoCurrencyService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CryptoCurrencyServiceImpl implements CryptoCurrencyService {
    private final CryptoCurrencyDao cryptoCurrencyDao;

    @Override
    public CryptoCurrency saveCurrency(CryptoCurrency currency) {
        return cryptoCurrencyDao.saveCurrency(currency);
    }

    @Override
    public CryptoCurrency activateCurrency(Long id) {
        return cryptoCurrencyDao.activateCurrency(id);
    }

    @Override
    public CryptoCurrency deactivateCurrency(Long id) {
        return cryptoCurrencyDao.deactivateCurrency(id);
    }

    @Override
    public CryptoCurrency findByCode(String code) {
        return cryptoCurrencyDao.findByCode(code).orElse(null);
    }

    @Override
    public List<CryptoCurrency> findAll() {
        return cryptoCurrencyDao.findAll();
    }

    @Override
    public List<CryptoCurrency> findAllActive() {
        return cryptoCurrencyDao.findAllActive();
    }
}
