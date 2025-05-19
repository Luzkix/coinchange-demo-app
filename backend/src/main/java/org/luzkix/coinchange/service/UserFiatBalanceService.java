package org.luzkix.coinchange.service;

import org.luzkix.coinchange.model.FiatCurrency;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.model.UserFiatBalance;

import java.math.BigDecimal;
import java.util.List;

public interface UserFiatBalanceService {
    List<UserFiatBalance> findByUser(User user);
    UserFiatBalance findByUserAndCurrency(User user, FiatCurrency currency);
    void creditRegistrationBonus(User user, FiatCurrency currency, BigDecimal bonus);
    void createInitialZeroBalances(User user, List<FiatCurrency> currencies);
}
