package org.luzkix.coinchange.dao.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.dao.UserCurrencyBalanceDao;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.model.UserCurrencyBalance;
import org.luzkix.coinchange.repository.UserCurrencyBalanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class UserCurrencyBalanceDaoImpl implements UserCurrencyBalanceDao {
    private final UserCurrencyBalanceRepository userCurrencyBalanceRepository;

    @Override
    public List<UserCurrencyBalance> findByUser(User user) {
        return userCurrencyBalanceRepository.findByUser(user);
    }

    @Override
    public Optional<UserCurrencyBalance> findByUserAndCurrency(User user, Currency currency) {
        return userCurrencyBalanceRepository.findByUserAndCurrency(user, currency);
    }

    @Override
    public UserCurrencyBalance save(UserCurrencyBalance balance) {
        return userCurrencyBalanceRepository.save(balance);
    }
}
