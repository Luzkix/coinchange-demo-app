package org.luzkix.coinchange.dao.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.dao.UserCryptoBalanceDao;
import org.luzkix.coinchange.model.CryptoCurrency;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.model.UserCryptoBalance;
import org.luzkix.coinchange.repository.UserCryptoBalanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserCryptoBalanceDaoImpl implements UserCryptoBalanceDao {
    private final UserCryptoBalanceRepository userCryptoBalanceRepository;

    @Override
    public List<UserCryptoBalance> findByUser(User user) {
        return userCryptoBalanceRepository.findByUser(user);
    }

    @Override
    public Optional<UserCryptoBalance> findByUserAndCurrency(User user, CryptoCurrency currency) {
        return userCryptoBalanceRepository.findByUserAndCryptoCurrency(user, currency);
    }
}
