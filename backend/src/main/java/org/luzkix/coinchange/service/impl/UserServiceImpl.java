package org.luzkix.coinchange.service.impl;

import org.luzkix.coinchange.dao.UserDao;
import org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum;
import org.luzkix.coinchange.exceptions.UnprocessableEntityException;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.uiapi.model.LoginResponseDto;
import org.luzkix.coinchange.openapi.uiapi.model.UserRegistrationRequestDto;
import org.luzkix.coinchange.service.UserService;
import org.luzkix.coinchange.utils.DatesUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public LoginResponseDto createUser(UserRegistrationRequestDto registrationDto) {
        // Validate input data
        validateUserRegistrationData(registrationDto);

        // Check if the user already exists
        if (userDao.existsByUsernameOrEmailWithActiveAccount(registrationDto.getUsername(), registrationDto.getEmail())) {
            throw new UnprocessableEntityException("Username or email already exists for live user account!", ErrorBusinessCodeEnum.USER_ALREADY_EXISTS);
        }

        //encode password
        String encodedPassword = passwordEncoder.encode(registrationDto.getPassword());
        registrationDto.setPassword(encodedPassword);

        //create user
        User user = userDao.createUser(registrationDto);

        return new LoginResponseDto()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .createdAt(DatesUtils.convertToSystemOffsetDateTime(user.getCreatedAt()))
                .updatedAt(DatesUtils.convertToSystemOffsetDateTime(user.getUpdatedAt()))
                .validTo(DatesUtils.convertToSystemOffsetDateTime(user.getValidTo()));
    }

    private void validateUserRegistrationData(UserRegistrationRequestDto registrationDto) {
        if (registrationDto.getUsername() == null || registrationDto.getUsername().trim().isEmpty()) {
            throw new UnprocessableEntityException("Username must not be null or empty.", ErrorBusinessCodeEnum.INVALID_USERNAME);
        }
        if (registrationDto.getEmail() == null || !registrationDto.getEmail().matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            throw new UnprocessableEntityException("Invalid email format.", ErrorBusinessCodeEnum.INVALID_EMAIL_FORMAT);
        }
        if (registrationDto.getPassword() == null || registrationDto.getPassword().length() < 4) {
            throw new UnprocessableEntityException("Password must be at least 4 characters long.", ErrorBusinessCodeEnum.INVALID_PASSWORD_FORMAT);
        }
    }


    private boolean verifyPassword(String rawPassword, String encodedPassword) {
        // Compares the plain-text password with the encoded password from the database
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
