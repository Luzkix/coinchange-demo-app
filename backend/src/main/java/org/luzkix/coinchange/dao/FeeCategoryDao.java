package org.luzkix.coinchange.dao;

import org.luzkix.coinchange.model.FeeCategory;
import org.luzkix.coinchange.model.FeeCategory.FeeCategoryEnum;

import java.util.Optional;

public interface FeeCategoryDao {
    Optional<FeeCategory> findByCategory(FeeCategoryEnum category);
    FeeCategory save(FeeCategory feeCategory);
}
