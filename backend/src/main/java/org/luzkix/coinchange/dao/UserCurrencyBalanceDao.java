package org.luzkix.coinchange.dao;

import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.model.UserCurrencyBalance;

import java.util.List;
import java.util.Optional;

public interface UserCurrencyBalanceDao {
    List<UserCurrencyBalance> findByUser(User user);
    Optional<UserCurrencyBalance> findByUserAndCurrency(User user, Currency currency);
    UserCurrencyBalance save(UserCurrencyBalance balance);
}
