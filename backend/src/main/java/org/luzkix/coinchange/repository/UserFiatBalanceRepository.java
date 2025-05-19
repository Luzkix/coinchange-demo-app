package org.luzkix.coinchange.repository;

import org.luzkix.coinchange.model.FiatCurrency;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.model.UserFiatBalance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserFiatBalanceRepository extends JpaRepository<UserFiatBalance, Long> {
    List<UserFiatBalance> findByUser(User user);
    Optional<UserFiatBalance> findByUserAndFiatCurrency(User user, FiatCurrency fiatCurrency);
}
