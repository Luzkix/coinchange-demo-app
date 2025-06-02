package org.luzkix.coinchange.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.luzkix.coinchange.config.CustomConstants;
import org.luzkix.coinchange.config.security.jwt.JwtProvider;
import org.luzkix.coinchange.dto.ConversionRateTokenPayloadDto;
import org.luzkix.coinchange.dto.CurrencyBalanceDto;
import org.luzkix.coinchange.exceptions.CustomInternalErrorException;
import org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum;
import org.luzkix.coinchange.exceptions.InvalidInputDataException;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.Transaction;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.coinbaseexchangeclient.model.CoinStats;
import org.luzkix.coinchange.service.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CurrencyConversionServiceImpl implements CurrencyConversionService {

    private final CoinbaseExchangeService coinbaseExchangeService;
    private final JwtProvider jwtProvider;
    private final CurrencyService currencyService;
    private final FeesService feesService;
    private final TransactionService transactionService;
    private final BalanceService balanceService;

    @Value("${fee.default-conversion-currency}")
    private String currencyCodeForFeeConversion;

    @Override
    public BigDecimal getMarketConversionRate(Currency soldCurrency, Currency boughtCurrency) {
        //if both sold and bought currencies are FIAT type, use logic for FIAT conversions
        if (soldCurrency.getType() == Currency.CurrencyTypeEnum.FIAT && boughtCurrency.getType() == Currency.CurrencyTypeEnum.FIAT) {
            return getFiatConversionRate(soldCurrency, boughtCurrency);
        }
        //else use logic for crypto-fiat conversions
        else return getCryptoFiatConversionRate(soldCurrency, boughtCurrency);
    }

    @Override
    @Transactional
    public Transaction convertCurrenciesUsingSimpleTrading(String verificationToken, BigDecimal soldCurrencyAmount, User user) {
        //1. parse and validate verificationToken
        ConversionRateTokenPayloadDto conversionDetails = jwtProvider.parseConversionRateToken(verificationToken);
        if (OffsetDateTime.now().isAfter(conversionDetails.getValidTo())) throw new InvalidInputDataException(
                String.format("Validity of conversion rate already expired. ValidTo: %s / CurrentTime: %s", conversionDetails.getValidTo(), OffsetDateTime.now()),
                ErrorBusinessCodeEnum.CONVERSION_RATE_EXPIRED);

        Currency soldCurrency = currencyService.findByCode(conversionDetails.getSoldCurrencyCode())
                .orElseThrow(() -> new InvalidInputDataException("Currency with code " + conversionDetails.getSoldCurrencyCode() + "was  not found", ErrorBusinessCodeEnum.ENTITY_NOT_FOUND));

        //2. check available balance
        if (!isAvailableBalanceSufficient(user, soldCurrency, soldCurrencyAmount)) throw new InvalidInputDataException("Amount of " + soldCurrency.getCode() + " to be sold exceeds available balance!", ErrorBusinessCodeEnum.INSUFFICIENT_BALANCE);

        Currency boughtCurrency = currencyService.findByCode(conversionDetails.getBoughtCurrencyCode())
                .orElseThrow(() -> new InvalidInputDataException("Currency with code " + conversionDetails.getBoughtCurrencyCode() + "was  not found", ErrorBusinessCodeEnum.ENTITY_NOT_FOUND));

        Currency convertedFeeCurrency = currencyService.findByCode(currencyCodeForFeeConversion)
                .orElseThrow(() -> new InvalidInputDataException("Currency for fees conversion with code " + currencyCodeForFeeConversion + "was  not found", ErrorBusinessCodeEnum.ENTITY_NOT_FOUND));

        BigDecimal requestedConversionRate = conversionDetails.getMarketConversionRate();
        boolean isAdvancedTrading = false;

        //3. prepare conversion transaction
        return prepareConversionTransaction(
                user,
                soldCurrency,
                boughtCurrency,
                convertedFeeCurrency,
                soldCurrencyAmount,
                requestedConversionRate,
                isAdvancedTrading
                );
    }

    @Override
    @Transactional
    public Transaction convertCurrenciesUsingAdvancedTrading(String soldCurrencyCode,
                                                             String boughtCurrencyCode,
                                                             BigDecimal userSelectedConversionRate,
                                                             BigDecimal soldCurrencyAmount,
                                                             User user) {
        Currency soldCurrency = currencyService.findByCode(soldCurrencyCode)
                .orElseThrow(() -> new InvalidInputDataException("Currency with code " + soldCurrencyCode + "was  not found", ErrorBusinessCodeEnum.ENTITY_NOT_FOUND));

        //1. check available balance
        if (!isAvailableBalanceSufficient(user, soldCurrency, soldCurrencyAmount)) throw new InvalidInputDataException("Amount of " + soldCurrency.getCode() + " to be sold exceeds available balance!", ErrorBusinessCodeEnum.INSUFFICIENT_BALANCE);

        Currency boughtCurrency = currencyService.findByCode(boughtCurrencyCode)
                .orElseThrow(() -> new InvalidInputDataException("Currency with code " + boughtCurrencyCode + "was  not found", ErrorBusinessCodeEnum.ENTITY_NOT_FOUND));

        Currency convertedFeeCurrency = currencyService.findByCode(currencyCodeForFeeConversion)
                .orElseThrow(() -> new InvalidInputDataException("Currency for fees conversion with code " + currencyCodeForFeeConversion + "was  not found", ErrorBusinessCodeEnum.ENTITY_NOT_FOUND));

        boolean isAdvancedTrading = true;

        //3. prepare conversion transaction
        return prepareConversionTransaction(
                user,
                soldCurrency,
                boughtCurrency,
                convertedFeeCurrency,
                soldCurrencyAmount,
                userSelectedConversionRate,
                isAdvancedTrading
        );
    }

    @Override
    @Transactional
    public Transaction checkAndConvertPendingTransaction(Transaction transaction) {
        Currency soldCurrency = transaction.getSoldCurrency();
        Currency boughtCurrency = transaction.getBoughtCurrency();
        BigDecimal requestedConversionRateAfterFees = transaction.getConversionRateAfterFees();

        try{
            BigDecimal currentMarketConversionRate = getMarketConversionRate(soldCurrency,boughtCurrency);
            BigDecimal currentConversionRateAfterFees = feesService.calculateConversionRateAfterFees(currentMarketConversionRate, transaction.getFeeCategory());

            // if markerRate is lower than requested rate, skip the loop
            if (currentConversionRateAfterFees.compareTo(requestedConversionRateAfterFees) < 0 ) return null; //cannot process the transaction

            // else process the transaction
            transaction.setProcessedAt(LocalDateTime.now());

            // and convert collected fees into default FIAT currency for fees based on current market conversion rate
            BigDecimal conversionRateForFeesConversion = getMarketConversionRate(transaction.getTransactionFeeCurrency(),transaction.getConvertedFeeCurrency());
            BigDecimal  convertedFeeAmount = transaction.getTransactionFeeAmount().multiply(conversionRateForFeesConversion);
            transaction.setConvertedFeeAmount(convertedFeeAmount);

            transactionService.save(transaction);
            log.info("Processed pending transaction with id {}. Sold {}, Bought {}, market conversion rate {}",
                    transaction.getId(), soldCurrency.getCode(), boughtCurrency.getCode(), currentMarketConversionRate);
        } catch (Error e) {
            throw new CustomInternalErrorException(
                    "Unknown error while processing pending transaction!",
                    ErrorBusinessCodeEnum.CONVERSION_TRANSACTION_FAILURE
            );
        }

        return transaction;
    }

    //PRIVATE METHODS
    private BigDecimal getFiatConversionRate(Currency soldCurrency, Currency boughtCurrency) {
        if (soldCurrency.getCode().equals(boughtCurrency.getCode())) {
            return BigDecimal.ONE;
        } else if (soldCurrency.getCode().equals("EUR") && boughtCurrency.getCode().equals("USD")) {
            return getFiatConversionRateEurToUsd();
        } else if (soldCurrency.getCode().equals("USD") && boughtCurrency.getCode().equals("EUR")) {
            return getFiatConversionRateUsdToEur();
        } else return null;
    }

    private BigDecimal getCryptoFiatConversionRate(Currency soldCurrency, Currency boughtCurrency) {
        if (soldCurrency.getCode().equals(boughtCurrency.getCode())) {
            return BigDecimal.ONE;
        } else if (soldCurrency.getType() == Currency.CurrencyTypeEnum.FIAT && boughtCurrency.getType() == Currency.CurrencyTypeEnum.CRYPTO) {
            //Case1: soldCurrency == FIAT and boughtCurrency == CRYPTO: reverse adjustments necessary
            return getCryptoFiatConversionRateReversed(soldCurrency, boughtCurrency);
        } else {
            //Case2: both currencies are crypto OR soldCurrency == CRYPTO and boughtCurrency == FIAT: simplest case, return value from coinbaseApi as is without adjustments
            return getCryptoFiatConversionRateDirect(soldCurrency, boughtCurrency);
        }
    }

    /**
     * Returns current conversion rate for EUR-USD.
     * @return BigDecimal or error if conversion rate could not be loaded
     */
    private BigDecimal getFiatConversionRateEurToUsd() {
        CoinStats eurUsdStats = coinbaseExchangeService.getCoinStats(CustomConstants.EUR_USD_ID).orElse(null);

        if (eurUsdStats == null) throw new CustomInternalErrorException(
                String.format("Conversion rate could not be loaded for fiat currencies pair: %s ", CustomConstants.EUR_USD_ID),
                ErrorBusinessCodeEnum.EXTERNAL_API_ERROR);

        return new BigDecimal(eurUsdStats.getLast());
    }

    /**
     * Returns current conversion rate for USD-EUR.
     * @return BigDecimal or error if conversion rate could not be loaded
     */
    private BigDecimal getFiatConversionRateUsdToEur() {
        CoinStats eurUsdStats = coinbaseExchangeService.getCoinStats(CustomConstants.EUR_USD_ID).orElse(null);

        if (eurUsdStats == null) throw new CustomInternalErrorException(
                String.format("Conversion rate could not be loaded for fiat currencies pair: %s ", CustomConstants.EUR_USD_ID),
                ErrorBusinessCodeEnum.EXTERNAL_API_ERROR);

        return BigDecimal.ONE.divide(
                new BigDecimal(eurUsdStats.getLast()),
                CustomConstants.BIGDECIMAL_SCALE,
                RoundingMode.HALF_UP
        );
    }

    /**
     * Returns current conversion rate for fiat-crypto pair. Note: conversion rates received from coinbase were reversed to return correct conversion rate result
     * @return BigDecimal or error if conversion rate could not be loaded
     */
    private BigDecimal getCryptoFiatConversionRateReversed(Currency soldFiatCurrency, Currency boughtCryptoCurrency) {
        //1. get reversed currencyPairStats (coinbase only supports crypto-fiat pairs, not fiat-crypto)
        String procuctId = boughtCryptoCurrency.getCode() + "-" + soldFiatCurrency.getCode();
        CoinStats reversedPairStats = coinbaseExchangeService.getCoinStats(procuctId).orElse(null);

        if (reversedPairStats == null) throw new CustomInternalErrorException(
                String.format("Conversion rate could not be loaded for currency pair: %s ", procuctId),
                ErrorBusinessCodeEnum.EXTERNAL_API_ERROR);

        //2. return calculated reversed value of conversion rate
        return BigDecimal.ONE.divide(
                new BigDecimal(reversedPairStats.getLast()),
                CustomConstants.BIGDECIMAL_SCALE,
                RoundingMode.HALF_UP
        );
    }

    /**
     * Returns current conversion rate for crypto-crypto or crypto-fiat directly without any adjustments.
     * @return BigDecimal or error if conversion rate could not be loaded
     */
    private BigDecimal getCryptoFiatConversionRateDirect(Currency soldCurrency, Currency boughtCurrency) {
        String procuctId = soldCurrency.getCode() + "-" + boughtCurrency.getCode();
        CoinStats currencyPairStats = coinbaseExchangeService.getCoinStats(procuctId).orElse(null);

        if (currencyPairStats == null) throw new CustomInternalErrorException(
                String.format("Conversion rate could not be loaded for currency pair: %s ", procuctId),
                ErrorBusinessCodeEnum.EXTERNAL_API_ERROR);

        return new BigDecimal(currencyPairStats.getLast());
    }


    private Transaction prepareConversionTransaction(User user,
                                                     Currency soldCurrency,
                                                     Currency boughtCurrency,
                                                     Currency convertedFeeCurrency,
                                                     BigDecimal soldCurrencyAmount,
                                                     BigDecimal requestedConversionRate,
                                                     boolean isAdvancedTrading) {

        Transaction transaction = new Transaction();
        LocalDateTime now = LocalDateTime.now();

        try {
            if (isAdvancedTrading) {
                BigDecimal currentMarketConversionRate = getMarketConversionRate(soldCurrency,boughtCurrency);
                if (currentMarketConversionRate.compareTo(requestedConversionRate) >= 0) {
                    // if currentMarketConversionRate >= requested conversionRate, replace conversionRate for currentMarketConversionRate and process transaction
                    requestedConversionRate = currentMarketConversionRate;
                    transaction.setProcessedAt(now);
                } else {
                    // if currentMarketConversionRate is lower then requested conversionRate, mark transaction as pending (== processedAt is null)
                    transaction.setProcessedAt(null);
                }
            } else {
                // if not advanced trading, the transaction is processed immediately based on conversionRate
                transaction.setProcessedAt(now);
            }

            BigDecimal conversionRateForFees = feesService.calculateConversionRateForFees(requestedConversionRate, user);
            BigDecimal conversionRateAfterFees = feesService.calculateConversionRateAfterFees(requestedConversionRate, user);

            BigDecimal boughtCurrencyAmount = soldCurrencyAmount.multiply(conversionRateAfterFees);
            BigDecimal transactionFeeAmountInBoughtCurrency = soldCurrencyAmount.multiply(conversionRateForFees);

            BigDecimal convertedFeeAmount = null;
            if (transaction.getProcessedAt() != null) {
                // collected fees in bought currency are converted into default FIAT currency for fees (e.g. EUR) only when transaction is being processed (i.e. has processedAt filled), not for pending transactions with null processedAt
                BigDecimal conversionRateForFeesConversion = getMarketConversionRate(boughtCurrency,convertedFeeCurrency);
                convertedFeeAmount = transactionFeeAmountInBoughtCurrency.multiply(conversionRateForFeesConversion);
            }

            transaction.setUser(user);
            transaction.setSoldCurrency(soldCurrency);
            transaction.setBoughtCurrency(boughtCurrency);
            transaction.setAmountSold(soldCurrencyAmount);
            transaction.setAmountBought(boughtCurrencyAmount);
            transaction.setTransactionFeeCurrency(boughtCurrency);
            transaction.setTransactionFeeAmount(transactionFeeAmountInBoughtCurrency);
            transaction.setConvertedFeeCurrency(convertedFeeCurrency);
            transaction.setConvertedFeeAmount(convertedFeeAmount);
            transaction.setFeeCategory(user.getFeeCategory());
            transaction.setConversionRateAfterFees(conversionRateAfterFees);
            transaction.setTransactionTypeEnum(Transaction.TransactionTypeEnum.CONVERSION);
            transaction.setCreatedAt(now);

            transactionService.save(transaction);

            log.info("Prepared conversion transaction with id {} and state {}. Sold {}, amount sold {}, bought {}, amount bought {}, applied conversion rate {}, ",
                    transaction.getId(),
                    transaction.getProcessedAt() != null? "PROCESSED" : transaction.getCancelledAt() != null? "CANCELLED" : "PENDING",
                    soldCurrency.getCode(), soldCurrencyAmount, boughtCurrency.getCode(), boughtCurrencyAmount, requestedConversionRate);
        } catch (Error e) {
            throw new CustomInternalErrorException(
                    "Unknown error while preparing currency conversion transaction!",
                    ErrorBusinessCodeEnum.CONVERSION_TRANSACTION_FAILURE
            );
        }

        return transaction;
    }

    private boolean isAvailableBalanceSufficient(User user, Currency soldCurrency, BigDecimal soldCurrencyAmount) {
        List<CurrencyBalanceDto> balances = balanceService.getCurrencyBalances(user, CustomConstants.BalanceTypeEnum.AVAILABLE);
        for (CurrencyBalanceDto balance : balances) {
            if (balance.getCurrency().getId().equals(soldCurrency.getId())) {
                if (balance.getAvailableBalance().compareTo(soldCurrencyAmount) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
}
