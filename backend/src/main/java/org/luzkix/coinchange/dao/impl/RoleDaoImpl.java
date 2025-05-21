package org.luzkix.coinchange.dao.impl;

import org.luzkix.coinchange.dao.RoleDao;
import org.luzkix.coinchange.model.Role;
import org.luzkix.coinchange.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class RoleDaoImpl implements RoleDao {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public Optional<Role> findByName(String name) {
        return roleRepository.findByName(name);
    }

    @Override
    public Optional<Role> findById(Long id) {
        return roleRepository.findById(id);
    }

    @Override
    public Role save(Role role) {
        return null;
    }
}
