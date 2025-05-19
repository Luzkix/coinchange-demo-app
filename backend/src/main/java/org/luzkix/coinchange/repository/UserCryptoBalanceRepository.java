package org.luzkix.coinchange.repository;

import org.luzkix.coinchange.model.CryptoCurrency;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.model.UserCryptoBalance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserCryptoBalanceRepository extends JpaRepository<UserCryptoBalance, Long> {
    List<UserCryptoBalance> findByUser(User user);
    Optional<UserCryptoBalance> findByUserAndCryptoCurrency(User user, CryptoCurrency cryptoCurrency);
}
