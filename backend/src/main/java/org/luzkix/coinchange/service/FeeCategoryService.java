package org.luzkix.coinchange.service;

import org.luzkix.coinchange.model.FeeCategory;
import org.luzkix.coinchange.model.FeeCategory.FeeCategoryEnum;

import java.util.Optional;

public interface FeeCategoryService {
    Optional<FeeCategory> findByCategory(FeeCategoryEnum category);
    FeeCategory save(FeeCategory feeCategory);
}
