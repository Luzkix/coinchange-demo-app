package org.luzkix.coinchange.repository;

import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.model.UserCurrencyBalance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserCurrencyBalanceRepository extends JpaRepository<UserCurrencyBalance, Long> {
    List<UserCurrencyBalance> findByUser(User user);
    Optional<UserCurrencyBalance> findByUserAndCurrency(User user, Currency currency);
}
