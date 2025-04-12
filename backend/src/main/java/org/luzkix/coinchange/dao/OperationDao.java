package org.luzkix.coinchange.dao;

import org.luzkix.coinchange.model.Operation;

public interface OperationDao {
    Operation findByName(String name);
}
