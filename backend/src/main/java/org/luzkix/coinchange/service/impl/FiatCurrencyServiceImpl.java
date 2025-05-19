package org.luzkix.coinchange.service.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.dao.FiatCurrencyDao;
import org.luzkix.coinchange.model.FiatCurrency;
import org.luzkix.coinchange.service.FiatCurrencyService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FiatCurrencyServiceImpl implements FiatCurrencyService {
    private final FiatCurrencyDao fiatCurrencyDao;

    @Override
    public FiatCurrency saveCurrency(FiatCurrency currency) {
        return fiatCurrencyDao.saveCurrency(currency);
    }

    @Override
    public FiatCurrency activateCurrency(Long id) {
        return fiatCurrencyDao.activateCurrency(id);
    }

    @Override
    public FiatCurrency deactivateCurrency(Long id) {
        return fiatCurrencyDao.deactivateCurrency(id);
    }

    @Override
    public FiatCurrency findByCode(String code) {
        return fiatCurrencyDao.findByCode(code).orElse(null);
    }

    @Override
    public List<FiatCurrency> findAll() {
        return fiatCurrencyDao.findAll();
    }

    @Override
    public List<FiatCurrency> findAllActive() {

        return fiatCurrencyDao.findAllActive();
    }
}
