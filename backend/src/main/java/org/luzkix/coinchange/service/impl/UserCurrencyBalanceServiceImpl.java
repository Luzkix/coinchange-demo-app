package org.luzkix.coinchange.service.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.dao.UserCurrencyBalanceDao;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.model.UserCurrencyBalance;
import org.luzkix.coinchange.service.UserCurrencyBalanceService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserCurrencyBalanceServiceImpl implements UserCurrencyBalanceService {
    private final UserCurrencyBalanceDao userCurrencyBalanceDao;

    @Override
    public List<UserCurrencyBalance> findByUser(User user) {
        return userCurrencyBalanceDao.findByUser(user);
    }

    @Override
    public UserCurrencyBalance findByUserAndCurrency(User user, Currency currency) {
        return userCurrencyBalanceDao.findByUserAndCurrency(user, currency).orElse(null);
    }

    @Override
    public void creditRegistrationBonus(User user, Currency currency, BigDecimal bonus) {
        UserCurrencyBalance currencyBalance = userCurrencyBalanceDao.findByUserAndCurrency(user, currency).orElse(new UserCurrencyBalance());
        currencyBalance.setCurrency(currency);
        currencyBalance.setUser(user);
        currencyBalance.setBalance((currencyBalance.getBalance() == null ? BigDecimal.ZERO : currencyBalance.getBalance()).add(bonus));
        userCurrencyBalanceDao.save(currencyBalance);
    }

    @Override
    public void createInitialZeroFiatBalances(User user, List<Currency> currencies) {
        currencies.stream()
                .filter(currency -> currency.getType() == Currency.CurrencyTypeEnum.FIAT)
                .forEach(currency -> {
                    Optional<UserCurrencyBalance> existing = userCurrencyBalanceDao.findByUserAndCurrency(user, currency);
                    UserCurrencyBalance fiatCurrencyBalance = existing.orElseGet(UserCurrencyBalance::new);
                    fiatCurrencyBalance.setCurrency(currency);
                    fiatCurrencyBalance.setUser(user);
                    fiatCurrencyBalance.setBalance(BigDecimal.ZERO);
                    userCurrencyBalanceDao.save(fiatCurrencyBalance);
                });
    }
}
