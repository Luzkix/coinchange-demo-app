package org.luzkix.coinchange.dao;

import org.luzkix.coinchange.model.Role;

import java.util.Optional;

public interface RoleDao {
    Optional<Role> findByName(String name);
    Optional<Role> findById(Long name);
    Role save(Role role);
}
