package org.luzkix.coinchange.controller;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum;
import org.luzkix.coinchange.exceptions.InvalidInputDataException;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.backendapi.api.FeeApi;
import org.luzkix.coinchange.openapi.backendapi.model.TotalFeesResponseDto;
import org.luzkix.coinchange.service.CurrencyService;
import org.luzkix.coinchange.service.FeesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequiredArgsConstructor
public class FeeController extends GenericController implements FeeApi {

    private final CurrencyService currencyService;
    private final FeesService feesService;

    @Override
    public ResponseEntity<TotalFeesResponseDto> getTotalFees(String targetCurrencyCode) {

        Currency targetCurrency = currencyService.findByCode(targetCurrencyCode).orElse(null);
        if (targetCurrency == null) throw new InvalidInputDataException("Wrong input data - targetCurrencyCode was not found in database!", ErrorBusinessCodeEnum.ENTITY_NOT_FOUND);
        BigDecimal totalFees = feesService.getTotalFeesInTargetCurrency(targetCurrency);

        TotalFeesResponseDto responseDto = new TotalFeesResponseDto();
        responseDto.setCurrencyCode(targetCurrencyCode);
        responseDto.setTotalFees(totalFees);

        return ResponseEntity.status(201).body(responseDto);
    }

    @Override
    public ResponseEntity<TotalFeesResponseDto> getTotalFeesForUser(String targetCurrencyCode) {
        User user = getUserFromAuthentication();
        Currency targetCurrency = currencyService.findByCode(targetCurrencyCode).orElse(null);
        if (targetCurrency == null) throw new InvalidInputDataException("Wrong input data - targetCurrencyCode was not found in database!", ErrorBusinessCodeEnum.ENTITY_NOT_FOUND);
        BigDecimal totalFees = feesService.getTotalFeesInTargetCurrencyForUser(user, targetCurrency);

        TotalFeesResponseDto responseDto = new TotalFeesResponseDto();
        responseDto.setCurrencyCode(targetCurrencyCode);
        responseDto.setTotalFees(totalFees);

        return ResponseEntity.status(201).body(responseDto);
    }
}