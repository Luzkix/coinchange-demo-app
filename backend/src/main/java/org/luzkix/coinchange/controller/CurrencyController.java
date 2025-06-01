package org.luzkix.coinchange.controller;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.config.CustomConstants;
import org.luzkix.coinchange.config.security.jwt.JwtProvider;
import org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum;
import org.luzkix.coinchange.exceptions.InvalidInputDataException;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.Transaction;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.backendapi.api.CurrencyApi;
import org.luzkix.coinchange.openapi.backendapi.model.*;
import org.luzkix.coinchange.service.BalanceService;
import org.luzkix.coinchange.service.CurrencyConversionService;
import org.luzkix.coinchange.service.CurrencyService;
import org.luzkix.coinchange.utils.DateUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class CurrencyController extends GenericController implements CurrencyApi {

    private final JwtProvider jwtProvider;
    private final CurrencyService currencyService;
    private final CurrencyConversionService currencyConversionService;
    private final BalanceService balanceService;

    @Value("${conversion.validity}")
    private Long conversionRateValidity;

    @Override
    public ResponseEntity<List<CurrencyResponseDto>> getSupportedCurrencies() {
        List<Currency> currencies = currencyService.findAllActive();
        List<CurrencyResponseDto> response = currencies.stream()
                .map(currency -> {
                    CurrencyResponseDto dto = new CurrencyResponseDto();
                    dto.setId(currency.getId());
                    dto.setName(currency.getName());
                    dto.setCode(currency.getCode());
                    dto.setIsActive(currency.isActive());
                    dto.setType(currency.getType().getTypeValue());
                    return dto;
                })
                .toList();

        return ResponseEntity.status(201).body(response);
    }

    @Override
    public ResponseEntity<List<CurrencyResponseDto>> getSupportedCurrenciesForType(String type) {
        List<Currency> currencies = currencyService.findAllActiveByType(Currency.CurrencyTypeEnum.fromValue(type));
        List<CurrencyResponseDto> response = currencies.stream()
                .map(currency -> {
                    CurrencyResponseDto dto = new CurrencyResponseDto();
                    dto.setId(currency.getId());
                    dto.setName(currency.getName());
                    dto.setCode(currency.getCode());
                    dto.setIsActive(currency.isActive());
                    dto.setType(currency.getType().getTypeValue());
                    return dto;
                })
                .toList();

        return ResponseEntity.status(201).body(response);
    }

    @Override
    public ResponseEntity<CurrencyConversionRateResponseDto> getMarketConversionRate(String soldCurrencyCode, String boughtCurrencyCode) {
        User user = getUserFromAuthentication();

        Currency soldCurrency = currencyService.findByCode(soldCurrencyCode).orElse(null);
        Currency boughtCurrency = currencyService.findByCode(boughtCurrencyCode).orElse(null);

        if (soldCurrency == null || boughtCurrency == null) throw new InvalidInputDataException(
                String.format("Sold or bought currency codes not found in database: %s, %s", soldCurrency, boughtCurrency),
                ErrorBusinessCodeEnum.ENTITY_NOT_FOUND);

        BigDecimal marketConversionRate = currencyConversionService.getMarketConversionRate(soldCurrency, boughtCurrency);

        CurrencyConversionRateResponseDto response = new CurrencyConversionRateResponseDto();
        response.setSoldCurrencyId(soldCurrency.getId());
        response.setSoldCurrencyCode(soldCurrency.getCode());
        response.setBoughtCurrencyId(boughtCurrency.getId());
        response.setBoughtCurrencyCode(boughtCurrency.getCode());
        response.setFeeRate(user.getFeeCategory().getFeeRate());
        response.setMarketConversionRate(marketConversionRate);

        // Returns time which is x seconds later than actual time
        OffsetDateTime validTo =DateUtils.convertToSystemOffsetDateTime(
                                        DateUtils.addSecondsToLocalDateTime(
                                                LocalDateTime.now(), conversionRateValidity));

        response.setValidTo(validTo);

        // Creation of verification token which is expected to be sent back from frontend when making final request to convert currencies.
        // Conversion will then be performed based on the data stored in this token to prevent unwanted manipulations with key data (such as e.g. conversionRate).
        String verificationToken = jwtProvider.generateConversionRateToken(
                soldCurrency.getCode(),
                boughtCurrency.getCode(),
                marketConversionRate,
                validTo
        );

        response.setVerificationToken(verificationToken);

        return ResponseEntity.status(201).body(response);
    }

    @Override
    public ResponseEntity<BalancesResponseDto> convertCurrenciesUsingSimppleTrading(SimpleTradingConversionRequestDto requestDto) {
        User user = getUserFromAuthentication();

        Transaction transaction = currencyConversionService.convertCurrenciesUsingSimpleTrading(
                requestDto.getVerificationToken(),
                requestDto.getSoldCurrencyAmount(),
                user);

        BalancesResponseDto responseDto = balanceService.getBalancesMappedToResponseDto(user, CustomConstants.BalanceTypeEnum.AVAILABLE);

        return ResponseEntity.status(201).body(responseDto);
    }

    @Override
    public ResponseEntity<BalancesResponseDto> convertCurrenciesUsingAdvancedTrading(AdvancedTradingConversionRequestDto requestDto) {
        User user = getUserFromAuthentication();

        Transaction transaction = currencyConversionService.convertCurrenciesUsingAdvancedTrading(
                requestDto.getSoldCurrencyCode(),
                requestDto.getBoughtCurrencyCode(),
                requestDto.getUserSelectedConversionRate(),
                requestDto.getSoldCurrencyAmount(),
                user);

        BalancesResponseDto responseDto = balanceService.getBalancesMappedToResponseDto(user, CustomConstants.BalanceTypeEnum.AVAILABLE);

        return ResponseEntity.status(201).body(responseDto);
    }
}