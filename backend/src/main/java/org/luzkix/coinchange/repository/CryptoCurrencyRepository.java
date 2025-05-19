package org.luzkix.coinchange.repository;

import org.luzkix.coinchange.model.CryptoCurrency;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CryptoCurrencyRepository extends JpaRepository<CryptoCurrency, Long> {
    Optional<CryptoCurrency> findByCode(String code);
    List<CryptoCurrency> findByIsActiveTrue();
}
