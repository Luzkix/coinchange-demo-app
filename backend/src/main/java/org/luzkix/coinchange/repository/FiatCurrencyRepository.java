package org.luzkix.coinchange.repository;

import org.luzkix.coinchange.model.FiatCurrency;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FiatCurrencyRepository extends JpaRepository<FiatCurrency, Long> {
    Optional<FiatCurrency> findByCode(String code);
    List<FiatCurrency> findByIsActiveTrue();
}
