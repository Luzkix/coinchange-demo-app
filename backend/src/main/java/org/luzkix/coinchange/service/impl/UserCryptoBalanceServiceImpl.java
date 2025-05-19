package org.luzkix.coinchange.service.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.dao.UserCryptoBalanceDao;
import org.luzkix.coinchange.model.CryptoCurrency;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.model.UserCryptoBalance;
import org.luzkix.coinchange.service.UserCryptoBalanceService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserCryptoBalanceServiceImpl implements UserCryptoBalanceService {
    private final UserCryptoBalanceDao userCryptoBalanceDao;

    @Override
    public List<UserCryptoBalance> findByUser(User user) {
        return userCryptoBalanceDao.findByUser(user);
    }

    @Override
    public UserCryptoBalance findByUserAndCurrency(User user, CryptoCurrency currency) {
        return userCryptoBalanceDao.findByUserAndCurrency(user, currency).orElse(null);
    }
}
