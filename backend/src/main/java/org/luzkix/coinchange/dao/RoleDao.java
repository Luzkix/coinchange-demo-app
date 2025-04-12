package org.luzkix.coinchange.dao;

import org.luzkix.coinchange.model.Role;

public interface RoleDao {
    Role findByName(String name);
}
