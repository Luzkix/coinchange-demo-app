package org.luzkix.coinchange.repository;

import org.luzkix.coinchange.model.Operation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OperationRepository extends JpaRepository<Operation, Long> {
    Operation findByName(String name);
}
