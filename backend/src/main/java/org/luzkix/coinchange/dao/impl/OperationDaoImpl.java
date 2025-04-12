package org.luzkix.coinchange.dao.impl;

import org.luzkix.coinchange.model.Operation;
import org.luzkix.coinchange.dao.OperationDao;
import org.luzkix.coinchange.repository.OperationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class OperationDaoImpl implements OperationDao {

    @Autowired
    private OperationRepository operationRepository;

    @Override
    public Operation findByName(String name) {
        return operationRepository.findByName(name);
    }
}
