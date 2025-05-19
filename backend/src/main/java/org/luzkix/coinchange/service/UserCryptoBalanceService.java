package org.luzkix.coinchange.service;

import org.luzkix.coinchange.model.CryptoCurrency;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.model.UserCryptoBalance;

import java.util.List;

public interface UserCryptoBalanceService {
    List<UserCryptoBalance> findByUser(User user);
    UserCryptoBalance findByUserAndCurrency(User user, CryptoCurrency currency);
}
