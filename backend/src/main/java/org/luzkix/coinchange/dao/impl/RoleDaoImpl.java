package org.luzkix.coinchange.dao.impl;

import org.luzkix.coinchange.model.Role;
import org.luzkix.coinchange.dao.RoleDao;
import org.luzkix.coinchange.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class RoleDaoImpl implements RoleDao {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public Role findByName(String name) {
        return roleRepository.findByName(name);
    }
}
