package org.luzkix.coinchange.dao.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.dao.UserFiatBalanceDao;
import org.luzkix.coinchange.model.FiatCurrency;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.model.UserFiatBalance;
import org.luzkix.coinchange.repository.UserFiatBalanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class UserFiatBalanceDaoImpl implements UserFiatBalanceDao {
    private final UserFiatBalanceRepository userFiatBalanceRepository;

    @Override
    public List<UserFiatBalance> findByUser(User user) {
        return userFiatBalanceRepository.findByUser(user);
    }

    @Override
    public Optional<UserFiatBalance> findByUserAndCurrency(User user, FiatCurrency currency) {
        return userFiatBalanceRepository.findByUserAndFiatCurrency(user, currency);
    }

    @Override
    public UserFiatBalance save(UserFiatBalance balance) {
        return userFiatBalanceRepository.save(balance);
    }
}
