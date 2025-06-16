package org.luzkix.coinchange.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.config.security.jwt.JwtProvider;
import org.luzkix.coinchange.dao.RoleDao;
import org.luzkix.coinchange.dao.UserDao;
import org.luzkix.coinchange.exceptions.CustomInternalErrorException;
import org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum;
import org.luzkix.coinchange.exceptions.InvalidInputDataException;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.*;
import org.luzkix.coinchange.openapi.backendapi.model.*;
import org.luzkix.coinchange.service.BalanceService;
import org.luzkix.coinchange.service.CurrencyService;
import org.luzkix.coinchange.service.FeeCategoryService;
import org.luzkix.coinchange.service.UserService;
import org.luzkix.coinchange.utils.DateUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import static org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum.INVALID_USER_ROLE;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserDao userDao;

    private final RoleDao roleDao;

    private final CurrencyService currencyService;

    private final FeeCategoryService feeCategoryService;

    private final BalanceService balanceService;

    private final PasswordEncoder passwordEncoder;

    private final JwtProvider jwtProvider;

    @Override
    public User findUserById(Long userId) {
        return userDao.findById(userId);
    }

    @Override
    @Transactional
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

        //give user a bonus of 100K EUR for registration
        List<Currency> allCurrencies = currencyService.findAllActive();
        Currency bonusCurrency = allCurrencies.stream().filter(a -> a.getCode().equals("EUR")).findFirst().orElse(null);
        if(bonusCurrency != null) {
            balanceService.creditRegistrationBonus(user, bonusCurrency, BigDecimal.valueOf(100000L));
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

    @Override
    @Transactional
    public UserLoginResponseDto updateUser(UserUpdateRequestDto updateRequest, User user) {
        User existingUser = null;

        // Checking if the values from updateRequest already belongs to any active user ->if so, throw an error
            // checking username
        if(Objects.nonNull(updateRequest.getUsername())) {
            existingUser = userDao.findActiveUserByUsername(updateRequest.getUsername());
            if (Objects.nonNull(existingUser)) throw new InvalidInputDataException(String.format("User already exists for requested username %s", updateRequest.getUsername()), ErrorBusinessCodeEnum.USER_ALREADY_EXISTS);
            user.setUsername(updateRequest.getUsername());
        }

            // checking email
        if(Objects.nonNull(updateRequest.getEmail())) {
            existingUser = userDao.findActiveUserByEmail(updateRequest.getEmail());
            if (Objects.nonNull(existingUser)) throw new InvalidInputDataException(String.format("User already exists for requested email %s", updateRequest.getEmail()), ErrorBusinessCodeEnum.USER_ALREADY_EXISTS);
            user.setEmail(updateRequest.getEmail());
        }

            // checking password
        if(Objects.nonNull(updateRequest.getPassword())) {
            String encodedPassword = passwordEncoder.encode(updateRequest.getPassword());
            user.setPassword(encodedPassword);
        }

        // Save updated user
        user = userDao.save(user);

        // Prepare response DTO
        UserLoginResponseDto responseDto = prepareUserLoginResponseDto(user);

        // Prepare new JWT token
        responseDto.setJwtToken(jwtProvider.generateToken(user.getId()));

        return responseDto;
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

        FeeCategory baseFeeCategory = feeCategoryService.findByCategory(FeeCategory.FeeCategoryEnum.F)
                .orElseThrow(() -> new CustomInternalErrorException(
                        String.format("Application could not assign fee category '%s' when creating new user - such category does not exist in database!", FeeCategory.FeeCategoryEnum.F),
                        ErrorBusinessCodeEnum.EXTERNAL_API_ERROR
                ));
        user.setFeeCategory(baseFeeCategory);

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
                .roles(getRolesForResponseDto(user))
                .feeCategory(new FeeCategoryResponseDto()
                        .feeCategory(user.getFeeCategory().getCategory().name())
                        .feeRate(user.getFeeCategory().getFeeRate())
                );
    }

    private boolean passwordsAreMatching(String plainTextPassword, String encodedPassword) {
        // Compares the plain-text password with the encoded password from the database
        return passwordEncoder.matches(plainTextPassword, encodedPassword);
    }

    private List<RoleResponseDto> getRolesForResponseDto(User user) {
        List<RoleResponseDto> roles = new ArrayList<>();
        for (Role role : user.getRoles()) {
            RoleResponseDto userRole = new RoleResponseDto();
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
