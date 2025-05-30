package org.luzkix.coinchange.service;

import org.luzkix.coinchange.dto.UserAvailableCurrencyBalance;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.User;

import java.math.BigDecimal;
import java.util.List;

public interface UserCurrencyBalanceService {
    List<UserAvailableCurrencyBalance> getUserAvailableCurrencyBalances(User user);

    void creditRegistrationBonus(User user, Currency currency, BigDecimal bonus);
}
