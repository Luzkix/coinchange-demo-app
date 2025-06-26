package org.luzkix.coinchange.controller;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.config.CustomConstants;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.backendapi.api.BalanceApi;
import org.luzkix.coinchange.openapi.backendapi.model.BalancesResponseDto;
import org.luzkix.coinchange.service.BalanceService;
import org.luzkix.coinchange.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class BalanceController extends GenericController implements BalanceApi {

    private final BalanceService balanceService;
    private final UserService userService;

    @Override
    public ResponseEntity<BalancesResponseDto> getBalances(String type) {
        User user = getUserFromAuthentication();

        BalancesResponseDto responseDto = balanceService.getBalancesMappedToResponseDto(user, CustomConstants.BalanceTypeEnum.valueOf(type));

        return ResponseEntity.status(201).body(responseDto);
    }

    @Override
    public ResponseEntity<List<BalancesResponseDto>> getBalancesForAllUsers(String type) {
        List<User> users = userService.findAllActiveUsers();
        List<BalancesResponseDto> responseDto = new ArrayList<>();

        for(User user : users) {
            responseDto.add(balanceService.getBalancesMappedToResponseDto(user, CustomConstants.BalanceTypeEnum.valueOf(type)));
        }

        return ResponseEntity.status(201).body(responseDto);
    }
}