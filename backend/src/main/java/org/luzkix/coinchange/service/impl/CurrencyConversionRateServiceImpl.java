package org.luzkix.coinchange.service.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.config.CustomConstants;
import org.luzkix.coinchange.exceptions.CustomInternalErrorException;
import org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.openapi.coinbaseexchangeclient.model.CoinStats;
import org.luzkix.coinchange.service.CoinStatsService;
import org.luzkix.coinchange.service.CurrencyConversionRateService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class CurrencyConversionRateServiceImpl implements CurrencyConversionRateService {

    private final CoinStatsService coinStatsService;

    @Override
    public BigDecimal getConversionRate(Currency soldCurrency, Currency boughtCurrency) {
        //if both sold and bought currencies are FIAT type, use logic for FIAT conversions
        if (soldCurrency.getType() == Currency.CurrencyTypeEnum.FIAT && boughtCurrency.getType() == Currency.CurrencyTypeEnum.FIAT) {
            return getFiatConversionRate(soldCurrency, boughtCurrency);
        }
        //else use logic for crypto-fiat conversions
        else return getCryptoFiatConversionRate(soldCurrency, boughtCurrency);
    }

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
        CoinStats eurUsdStats = coinStatsService.getCoinStats(CustomConstants.EUR_USD_ID).orElse(null);

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
        CoinStats eurUsdStats = coinStatsService.getCoinStats(CustomConstants.EUR_USD_ID).orElse(null);

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
        CoinStats reversedPairStats = coinStatsService.getCoinStats(procuctId).orElse(null);

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
        CoinStats currencyPairStats = coinStatsService.getCoinStats(procuctId).orElse(null);

        if (currencyPairStats == null) throw new CustomInternalErrorException(
                String.format("Conversion rate could not be loaded for currency pair: %s ", procuctId),
                ErrorBusinessCodeEnum.EXTERNAL_API_ERROR);

        return new BigDecimal(currencyPairStats.getLast());
    }
}
