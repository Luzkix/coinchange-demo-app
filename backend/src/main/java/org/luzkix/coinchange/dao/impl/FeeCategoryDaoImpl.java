package org.luzkix.coinchange.dao.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.dao.FeeCategoryDao;
import org.luzkix.coinchange.model.FeeCategory;
import org.luzkix.coinchange.model.FeeCategory.FeeCategoryEnum;
import org.luzkix.coinchange.repository.FeeCategoryRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class FeeCategoryDaoImpl implements FeeCategoryDao {

    private final FeeCategoryRepository feeCategoryRepository;

    @Override
    public Optional<FeeCategory> findByCategory(FeeCategoryEnum category) {
        return feeCategoryRepository.findByCategory(category);
    }

    @Override
    public FeeCategory save(FeeCategory feeCategory) {
        return feeCategoryRepository.save(feeCategory);
    }
}
