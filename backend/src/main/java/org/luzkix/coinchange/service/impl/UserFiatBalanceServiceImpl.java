package org.luzkix.coinchange.service.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.dao.UserFiatBalanceDao;
import org.luzkix.coinchange.model.FiatCurrency;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.model.UserFiatBalance;
import org.luzkix.coinchange.service.UserFiatBalanceService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
@Service
@RequiredArgsConstructor
public class UserFiatBalanceServiceImpl implements UserFiatBalanceService {
    private final UserFiatBalanceDao userFiatBalanceDao;

    @Override
    public List<UserFiatBalance> findByUser(User user) {
        return userFiatBalanceDao.findByUser(user);
    }

    @Override
    public UserFiatBalance findByUserAndCurrency(User user, FiatCurrency currency) {
        return userFiatBalanceDao.findByUserAndCurrency(user, currency).orElse(null);
    }

    @Override
    public void creditRegistrationBonus(User user, FiatCurrency currency, BigDecimal bonus) {
        UserFiatBalance fiatBalance = userFiatBalanceDao.findByUserAndCurrency(user, currency).orElse(new UserFiatBalance());
        fiatBalance.setFiatCurrency(currency);
        fiatBalance.setUser(user);
        fiatBalance.setBalance(bonus);
        userFiatBalanceDao.save(fiatBalance);
    }

    @Override
    public void createInitialZeroBalances(User user, List<FiatCurrency> currencies) {

        for(FiatCurrency currency : currencies) {
            UserFiatBalance fiatBalance = new UserFiatBalance();
            fiatBalance.setFiatCurrency(currency);
            fiatBalance.setUser(user);
            fiatBalance.setBalance(BigDecimal.ZERO);

            userFiatBalanceDao.save(fiatBalance);
        }
    }
}
