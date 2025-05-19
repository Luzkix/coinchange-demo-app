package org.luzkix.coinchange.dao;

import org.luzkix.coinchange.model.FiatCurrency;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.model.UserFiatBalance;

import java.util.List;
import java.util.Optional;

public interface UserFiatBalanceDao {
    List<UserFiatBalance> findByUser(User user);
    Optional<UserFiatBalance> findByUserAndCurrency(User user, FiatCurrency currency);
    UserFiatBalance save(UserFiatBalance balance);
}
