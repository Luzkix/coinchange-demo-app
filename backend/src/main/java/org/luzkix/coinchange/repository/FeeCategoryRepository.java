package org.luzkix.coinchange.repository;

import org.luzkix.coinchange.model.FeeCategory;
import org.luzkix.coinchange.model.FeeCategory.FeeCategoryEnum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FeeCategoryRepository extends JpaRepository<FeeCategory, Long> {
    Optional<FeeCategory> findByCategory(FeeCategoryEnum category);
}
