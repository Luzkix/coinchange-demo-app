package org.luzkix.coinchange.service.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.backendapi.model.CurrencyResponseDto;
import org.luzkix.coinchange.openapi.backendapi.model.PortfolioResponseDto;
import org.luzkix.coinchange.openapi.backendapi.model.UserCurrencyBalanceResponseDto;
import org.luzkix.coinchange.service.PortfolioService;
import org.luzkix.coinchange.service.UserCurrencyBalanceService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PortfolioServiceImpl implements PortfolioService {

    private final UserCurrencyBalanceService userCurrencyBalanceService;

    /**
     * Returns portfolio (all fiat and crypto balances) for given username.
     */
    public PortfolioResponseDto getPortfolio(User user) {
        // Get all currencyBalances for user and map to DTO
        List<UserCurrencyBalanceResponseDto> currenciesBalances = userCurrencyBalanceService.findByUser(user)
                .stream()
                .map(currencyBalance -> {
                    CurrencyResponseDto currency = new CurrencyResponseDto();
                    currency.setId(currencyBalance.getCurrency().getId());
                    currency.setCode(currencyBalance.getCurrency().getCode());
                    currency.setName(currencyBalance.getCurrency().getName());
                    currency.setIsActive(currencyBalance.getCurrency().isActive());
                    currency.setType(currencyBalance.getCurrency().getType().getTypeValue());

                    UserCurrencyBalanceResponseDto responseDto = new UserCurrencyBalanceResponseDto();
                    responseDto.setId(currencyBalance.getId());
                    responseDto.setCurrency(currency);
                    responseDto.setBalance(currencyBalance.getBalance());
                    responseDto.setUpdatedAt(currencyBalance.getUpdatedAt());

                    return responseDto;
                })
                .collect(Collectors.toList());

        // Return as PortfolioDto
        PortfolioResponseDto responseDto = new PortfolioResponseDto();
        responseDto.setCurrenciesBalances(currenciesBalances);

        return responseDto;
    }
}

