package org.luzkix.coinchange.service;

import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.model.UserCurrencyBalance;

import java.math.BigDecimal;
import java.util.List;

public interface UserCurrencyBalanceService {
    List<UserCurrencyBalance> findByUser(User user);
    UserCurrencyBalance findByUserAndCurrency(User user, Currency currency);
    void creditRegistrationBonus(User user, Currency currency, BigDecimal bonus);
    void createInitialZeroFiatBalances(User user, List<Currency> currencies);
}
