package org.luzkix.coinchange.controller;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.config.CustomConstants;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.backendapi.api.BalanceApi;
import org.luzkix.coinchange.openapi.backendapi.model.BalancesResponseDto;
import org.luzkix.coinchange.openapi.backendapi.model.CurrencyBalanceResponseDto;
import org.luzkix.coinchange.openapi.backendapi.model.CurrencyResponseDto;
import org.luzkix.coinchange.service.BalanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static org.luzkix.coinchange.utils.DateUtils.convertToSystemOffsetDateTime;

@RestController
@RequiredArgsConstructor
public class BalanceController extends GenericController implements BalanceApi {

    private final BalanceService balanceService;

    @Override
    public ResponseEntity<BalancesResponseDto> getBalances(String type) {
        User user = getUserFromAuthentication();

        // Get all currencyBalances for user and map to DTO
        List<CurrencyBalanceResponseDto> currenciesBalances = balanceService.getCurrencyBalances(user, CustomConstants.BalanceTypeEnum.valueOf(type))
                .stream()
                .map(currencyBalance -> {
                    CurrencyResponseDto currency = new CurrencyResponseDto();
                    currency.setId(currencyBalance.getCurrency().getId());
                    currency.setCode(currencyBalance.getCurrency().getCode());
                    currency.setName(currencyBalance.getCurrency().getName());
                    currency.setIsActive(currencyBalance.getCurrency().isActive());
                    currency.setType(currencyBalance.getCurrency().getType().getTypeValue());

                    CurrencyBalanceResponseDto responseDto = new CurrencyBalanceResponseDto();
                    responseDto.setCurrency(currency);
                    responseDto.setBalance(currencyBalance.getAvailableBalance());
                    responseDto.setCalculatedAt(convertToSystemOffsetDateTime(LocalDateTime.now()));

                    return responseDto;
                })
                .collect(Collectors.toList());

        // Return as BalancesResponseDto
        BalancesResponseDto responseDto = new BalancesResponseDto();
        responseDto.setCurrenciesBalances(currenciesBalances);

        return ResponseEntity.status(201).body(responseDto);
    }
}