package org.luzkix.coinchange.controller;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.config.CustomConstants;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.backendapi.api.BalanceApi;
import org.luzkix.coinchange.openapi.backendapi.model.BalancesResponseDto;
import org.luzkix.coinchange.service.BalanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class BalanceController extends GenericController implements BalanceApi {

    private final BalanceService balanceService;

    @Override
    public ResponseEntity<BalancesResponseDto> getBalances(String type) {
        User user = getUserFromAuthentication();

        BalancesResponseDto responseDto = balanceService.getBalancesMappedToResponseDto(user, CustomConstants.BalanceTypeEnum.valueOf(type));

        return ResponseEntity.status(201).body(responseDto);
    }
}