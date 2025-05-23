package org.luzkix.coinchange.service.impl;

import org.luzkix.coinchange.config.security.jwt.JwtProvider;
import org.luzkix.coinchange.dao.RoleDao;
import org.luzkix.coinchange.dao.UserDao;
import org.luzkix.coinchange.exceptions.CustomInternalErrorException;
import org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum;
import org.luzkix.coinchange.exceptions.InvalidInputDataException;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.Operation;
import org.luzkix.coinchange.model.Role;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.backendapi.model.*;
import org.luzkix.coinchange.service.CurrencyService;
import org.luzkix.coinchange.service.UserCurrencyBalanceService;
import org.luzkix.coinchange.service.UserService;
import org.luzkix.coinchange.utils.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import static org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum.INVALID_USER_ROLE;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private RoleDao roleDao;

    @Autowired
    private CurrencyService currencyService;

    @Autowired
    private UserCurrencyBalanceService userCurrencyBalanceService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtProvider jwtProvider;

    @Override
    public User findUserById(Long userId) {
        return userDao.findById(userId);
    }

    @Override
    public UserLoginResponseDto createUser(UserRegistrationRequestDto registrationDto) {
        // Check if the user already exists
        User user = userDao.findActiveUserByUsernameOrEmail(registrationDto.getUsername(), registrationDto.getEmail());
        if (Objects.nonNull(user)) throw new InvalidInputDataException(ErrorBusinessCodeEnum.USER_ALREADY_EXISTS.getMessage(), ErrorBusinessCodeEnum.USER_ALREADY_EXISTS);

        //encode password
        String encodedPassword = passwordEncoder.encode(registrationDto.getPassword());
        registrationDto.setPassword(encodedPassword);

        // Assign role 'USER' to the new user
        Set<Role> roles = new HashSet<>();
        Role userRole = roleDao.findByName(Role.RoleEnum.USER.getName()).orElse(null);
        if (userRole == null) {
            throw new CustomInternalErrorException("Default role " + Role.RoleEnum.USER.getName() +" not found in database.", INVALID_USER_ROLE);
        }
        roles.add(userRole);

        //create user
        user = createAndSaveUser(registrationDto,roles);

        //create initial zero balances for each fiat currency
        List<Currency> allCurrencies = currencyService.findAllActive();
        userCurrencyBalanceService.createInitialZeroFiatBalances(user,allCurrencies);

        //give user a bonus of 100K USD for registration
        Currency usdCurrency = allCurrencies.stream().filter(a -> a.getCode().equals("USD")).findFirst().orElse(null);
        if(usdCurrency != null) {
            userCurrencyBalanceService.creditRegistrationBonus(user, usdCurrency, BigDecimal.valueOf(100000L));
        }

        // Prepare response DTO
        UserLoginResponseDto responseDto = prepareUserLoginResponseDto(user);

        // Prepare JWT token
        responseDto.setJwtToken(jwtProvider.generateToken(user.getId()));

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
        responseDto.setJwtToken(jwtProvider.generateToken(user.getId()));

        return responseDto;
    }

    @Override
    public RefreshTokenResponseDto refreshToken(User user) {
        return new RefreshTokenResponseDto().jwtToken(jwtProvider.generateToken(user.getId()));
    }

    //PRIVATE METHODS
    private User createAndSaveUser (UserRegistrationRequestDto registrationDto, Set<Role> roles) {
        User user = new User();

        user.setUsername(registrationDto.getUsername());
        user.setEmail(registrationDto.getEmail());
        user.setPassword(registrationDto.getPassword());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setValidTo(LocalDateTime.of(2100, 1, 1, 0, 0));
        user.setRoles(roles);

        return userDao.save(user);
    }

    private UserLoginResponseDto prepareUserLoginResponseDto(User user) {
        return new UserLoginResponseDto()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .createdAt(DateUtils.convertToSystemOffsetDateTime(user.getCreatedAt()))
                .updatedAt(DateUtils.convertToSystemOffsetDateTime(user.getUpdatedAt()))
                .validTo(DateUtils.convertToSystemOffsetDateTime(user.getValidTo()))
                .roles(getRolesForResponseDto(user));
    }

    private boolean passwordsAreMatching(String plainTextPassword, String encodedPassword) {
        // Compares the plain-text password with the encoded password from the database
        return passwordEncoder.matches(plainTextPassword, encodedPassword);
    }

    private List<RoleDto> getRolesForResponseDto(User user) {
        List<RoleDto> roles = new ArrayList<>();
        for (Role role : user.getRoles()) {
            RoleDto userRole = new RoleDto();
            userRole.setRoleName(role.getName());

            List<String> userOperations = new ArrayList<>();
            for (Operation userOperation : role.getOperations()) {
                userOperations.add(userOperation.getName());
            }
            userRole.setOperations(userOperations);
            roles.add(userRole);
        }
        return roles;
    }

}
