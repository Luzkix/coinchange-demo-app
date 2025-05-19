package org.luzkix.coinchange.dao;

import org.luzkix.coinchange.model.CryptoCurrency;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.model.UserCryptoBalance;

import java.util.List;
import java.util.Optional;

public interface UserCryptoBalanceDao {
    List<UserCryptoBalance> findByUser(User user);
    Optional<UserCryptoBalance> findByUserAndCurrency(User user, CryptoCurrency currency);
}
