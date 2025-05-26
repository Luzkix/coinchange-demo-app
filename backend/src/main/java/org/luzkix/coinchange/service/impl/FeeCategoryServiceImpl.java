package org.luzkix.coinchange.service.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.dao.FeeCategoryDao;
import org.luzkix.coinchange.model.FeeCategory;
import org.luzkix.coinchange.model.FeeCategory.FeeCategoryEnum;
import org.luzkix.coinchange.service.FeeCategoryService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FeeCategoryServiceImpl implements FeeCategoryService {

    private final FeeCategoryDao feeCategoryDao;

    @Override
    public Optional<FeeCategory> findByCategory(FeeCategoryEnum category) {
        return feeCategoryDao.findByCategory(category);
    }

    @Override
    public FeeCategory save(FeeCategory feeCategory) {
        return feeCategoryDao.save(feeCategory);
    }
}
