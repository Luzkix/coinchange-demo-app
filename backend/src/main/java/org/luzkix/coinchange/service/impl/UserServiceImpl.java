package org.luzkix.coinchange.service.impl;

import org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum;
import org.luzkix.coinchange.exceptions.InvalidInputDataException;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.uiapi.model.UserLoginRequestDto;
import org.luzkix.coinchange.openapi.uiapi.model.UserLoginResponseDto;
import org.luzkix.coinchange.openapi.uiapi.model.UserRegistrationRequestDto;
import org.luzkix.coinchange.repository.UserDao;
import org.luzkix.coinchange.service.UserService;
import org.luzkix.coinchange.utils.DateUtils;
import org.luzkix.coinchange.utils.JwtTokenUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenUtils jwtTokenUtils;

    @Override
    public UserLoginResponseDto createUser(UserRegistrationRequestDto registrationDto) {
        // Check if the user already exists
        User user = userDao.findActiveUserByUsernameOrEmail(registrationDto.getUsername(), registrationDto.getEmail());
        if (Objects.nonNull(user)) throw new InvalidInputDataException(ErrorBusinessCodeEnum.USER_ALREADY_EXISTS.getMessage(), ErrorBusinessCodeEnum.USER_ALREADY_EXISTS);

        //encode password
        String encodedPassword = passwordEncoder.encode(registrationDto.getPassword());
        registrationDto.setPassword(encodedPassword);

        //create user
        user = userDao.createUser(registrationDto);

        // Prepare response DTO
        UserLoginResponseDto responseDto = prepareUserLoginResponseDto(user);

        // Prepare JWT token
        responseDto.setJwtToken(jwtTokenUtils.generateToken(user.getId()));

        return responseDto;
    }

    @Override
    public UserLoginResponseDto logUser(UserLoginRequestDto userLoginDto) {
        // Get user based on username/email
        User user = userDao.findActiveUserByUsernameOrEmail(userLoginDto.getUsernameOrEmail(), userLoginDto.getUsernameOrEmail());
        if (user == null)
            throw new InvalidInputDataException(ErrorBusinessCodeEnum.USER_NOT_FOUND.getMessage(), ErrorBusinessCodeEnum.USER_NOT_FOUND);

        // Check user password
        if(!passwordsAreMatching(userLoginDto.getPassword(),user.getPassword()))
            throw new InvalidInputDataException(ErrorBusinessCodeEnum.INCORRECT_PASSWORD.getMessage(), ErrorBusinessCodeEnum.INCORRECT_PASSWORD);

        // Prepare response DTO
        UserLoginResponseDto responseDto = prepareUserLoginResponseDto(user);

        // Prepare JWT token
        responseDto.setJwtToken(jwtTokenUtils.generateToken(user.getId()));

        return responseDto;
    }


    //PRIVATE METHODS
    private UserLoginResponseDto prepareUserLoginResponseDto(User user) {
        return new UserLoginResponseDto()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .createdAt(DateUtils.convertToSystemOffsetDateTime(user.getCreatedAt()))
                .updatedAt(DateUtils.convertToSystemOffsetDateTime(user.getUpdatedAt()))
                .validTo(DateUtils.convertToSystemOffsetDateTime(user.getValidTo()));
    }

    private boolean passwordsAreMatching(String plainTextPassword, String encodedPassword) {
        // Compares the plain-text password with the encoded password from the database
        return passwordEncoder.matches(plainTextPassword, encodedPassword);
    }

}
