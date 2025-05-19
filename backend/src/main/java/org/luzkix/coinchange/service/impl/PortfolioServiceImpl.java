package org.luzkix.coinchange.service.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum;
import org.luzkix.coinchange.exceptions.InvalidInputDataException;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.backendapi.model.*;
import org.luzkix.coinchange.service.PortfolioService;
import org.luzkix.coinchange.service.UserCryptoBalanceService;
import org.luzkix.coinchange.service.UserFiatBalanceService;
import org.luzkix.coinchange.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PortfolioServiceImpl implements PortfolioService {

    private final UserService userService;
    private final UserFiatBalanceService userFiatBalanceService;
    private final UserCryptoBalanceService userCryptoBalanceService;

    /**
     * Returns portfolio (fiat and crypto balances) for given username.
     */
    public PortfolioResponseDto getPortfolio(Long userId) {
        // Find user by userId
        User user = userService.findUserById(userId);
        if(user == null) throw new InvalidInputDataException("User with id " + userId + "was  not found", ErrorBusinessCodeEnum.ENTITY_NOT_FOUND);

        // Get all fiat balances for user and map to DTO
        List<UserFiatBalanceResponseDto> fiatBalances = userFiatBalanceService.findByUser(user)
                .stream()
                .map(fiatBalance -> {
                    FiatCurrencyDto fiatCurrencyDto = new FiatCurrencyDto();
                    fiatCurrencyDto.setCode(fiatBalance.getFiatCurrency().getCode());
                    fiatCurrencyDto.setName(fiatBalance.getFiatCurrency().getName());

                    UserFiatBalanceResponseDto responseDto = new UserFiatBalanceResponseDto();
                    responseDto.setCurrency(fiatCurrencyDto);
                    responseDto.setBalance(fiatBalance.getBalance());

                    return responseDto;
                })
                .collect(Collectors.toList());

        // Get all crypto balances for user and map to DTO
        List<UserCryptoBalanceResponseDto> cryptoBalances = userCryptoBalanceService.findByUser(user)
                .stream()
                .map(cryptoBalance -> {
                    CryptoCurrencyDto cryptoCurrencyDto = new CryptoCurrencyDto();
                    cryptoCurrencyDto.setCode(cryptoBalance.getCryptoCurrency().getCode());
                    cryptoCurrencyDto.setName(cryptoBalance.getCryptoCurrency().getName());

                    UserCryptoBalanceResponseDto responseDto = new UserCryptoBalanceResponseDto();
                    responseDto.setCurrency(cryptoCurrencyDto);
                    responseDto.setBalance(cryptoBalance.getBalance());

                    return responseDto;
                })
                .collect(Collectors.toList());

        // Return as PortfolioDto
        PortfolioResponseDto responseDto = new PortfolioResponseDto();
        responseDto.setFiatBalances(fiatBalances);
        responseDto.setCryptoBalances(cryptoBalances);

        return responseDto;
    }
}

