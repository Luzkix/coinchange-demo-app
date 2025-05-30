package org.luzkix.coinchange.service.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.backendapi.model.CurrencyResponseDto;
import org.luzkix.coinchange.openapi.backendapi.model.PortfolioResponseDto;
import org.luzkix.coinchange.openapi.backendapi.model.UserCurrencyBalanceResponseDto;
import org.luzkix.coinchange.service.PortfolioService;
import org.luzkix.coinchange.service.UserCurrencyBalanceService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static org.luzkix.coinchange.utils.DateUtils.convertToSystemOffsetDateTime;

@Service
@RequiredArgsConstructor
public class PortfolioServiceImpl implements PortfolioService {

    private final UserCurrencyBalanceService userCurrencyBalanceService;

    /**
     * Returns portfolio (all available fiat and crypto balances) for given username.
     */
    public PortfolioResponseDto getPortfolio(User user) {
        // Get all currencyBalances for user and map to DTO
        List<UserCurrencyBalanceResponseDto> currenciesBalances = userCurrencyBalanceService.getUserAvailableCurrencyBalances(user)
                .stream()
                .map(currencyBalance -> {
                    CurrencyResponseDto currency = new CurrencyResponseDto();
                    currency.setId(currencyBalance.getCurrency().getId());
                    currency.setCode(currencyBalance.getCurrency().getCode());
                    currency.setName(currencyBalance.getCurrency().getName());
                    currency.setIsActive(currencyBalance.getCurrency().isActive());
                    currency.setType(currencyBalance.getCurrency().getType().getTypeValue());

                    UserCurrencyBalanceResponseDto responseDto = new UserCurrencyBalanceResponseDto();
                    responseDto.setCurrency(currency);
                    responseDto.setBalance(currencyBalance.getAvailableBalance());
                    responseDto.setCalculatedAt(convertToSystemOffsetDateTime(LocalDateTime.now()));

                    return responseDto;
                })
                .collect(Collectors.toList());

        // Return as PortfolioDto
        PortfolioResponseDto responseDto = new PortfolioResponseDto();
        responseDto.setCurrenciesBalances(currenciesBalances);

        return responseDto;
    }
}

