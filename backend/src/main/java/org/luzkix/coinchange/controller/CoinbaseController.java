package org.luzkix.coinchange.controller;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.exceptions.CustomInternalErrorException;
import org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum;
import org.luzkix.coinchange.openapi.backendapi.api.ApiCoinbaseApi;
import org.luzkix.coinchange.openapi.backendapi.model.CoinPairDto;
import org.luzkix.coinchange.openapi.backendapi.model.CoinPairResponseDto;
import org.luzkix.coinchange.openapi.backendapi.model.CoinStatsResponseDto;
import org.luzkix.coinchange.openapi.coinbaseclient.model.CoinPair;
import org.luzkix.coinchange.openapi.coinbaseclient.model.CoinPairResponse;
import org.luzkix.coinchange.openapi.coinbaseexchangeclient.model.CoinStats;
import org.luzkix.coinchange.service.CoinbaseExchangeService;
import org.luzkix.coinchange.service.CoinbaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class CoinbaseController extends GenericController implements ApiCoinbaseApi {

    private final CoinbaseService coinbaseService;
    private final CoinbaseExchangeService coinbaseExchangeService;

    @Override
    public ResponseEntity<CoinPairResponseDto> getListOfCoinsWithTradingDetails(Integer limit, Integer offset, String productType, List<String> productIds, String productsSortOrder) {
        Optional<CoinPairResponse> coinbaseResponse = coinbaseService.getListOfCoinsWithTradingDetails(limit, offset, productType, productIds, productsSortOrder);

        CoinPairResponseDto responseDto = new CoinPairResponseDto();

        if (coinbaseResponse.isPresent()) {
            CoinPairResponse coinbaseData = coinbaseResponse.get();

            responseDto.setNumProducts(coinbaseData.getNumProducts());

            List<CoinPairDto> mappedProducts = coinbaseData.getProducts().stream()
                    .map(this::mapCoinPairToCoinPairDto)
                    .collect(Collectors.toList());

            responseDto.setProducts(mappedProducts);
        } else {
            // Pokud není odpověď k dispozici, nastavit prázdné hodnoty
            responseDto.setNumProducts(0);
            responseDto.setProducts(new ArrayList<>());
        }

        return ResponseEntity.status(201).body(responseDto);
    }

    private CoinPairDto mapCoinPairToCoinPairDto(CoinPair coinPair) {
        CoinPairDto dto = new CoinPairDto();

        // Mapování všech povinných vlastností
        dto.setProductId(coinPair.getProductId());
        dto.setBaseCurrencyId(coinPair.getBaseCurrencyId());
        dto.setQuoteCurrencyId(coinPair.getQuoteCurrencyId());
        dto.setBaseDisplaySymbol(coinPair.getBaseDisplaySymbol());
        dto.setQuoteDisplaySymbol(coinPair.getQuoteDisplaySymbol());
        dto.setBaseName(coinPair.getBaseName());
        dto.setPrice(coinPair.getPrice());
        dto.setPricePercentageChange24h(coinPair.getPricePercentageChange24h());
        dto.setVolume24h(coinPair.getVolume24h());
        dto.setVolumePercentageChange24h(coinPair.getVolumePercentageChange24h());

        // Mapování volitelných vlastností (nullable)
        dto.setQuoteName(coinPair.getQuoteName());
        dto.setApproximateQuote24hVolume(coinPair.getApproximateQuote24hVolume());
        dto.setIsDisabled(coinPair.getIsDisabled());
        dto.setNew(coinPair.getNew());
        dto.setStatus(coinPair.getStatus());
        dto.setProductType(coinPair.getProductType());

        return dto;
    }
    @Override
    public ResponseEntity<CoinStatsResponseDto> getCoinStats(String productId) {
        Optional<CoinStats> coinbaseResponse = coinbaseExchangeService.getCoinStats(productId);

        CoinStatsResponseDto responseDto = new CoinStatsResponseDto();

        if (coinbaseResponse.isPresent()) {
            CoinStats coinbaseData = coinbaseResponse.get();

            responseDto.setHigh(coinbaseData.getHigh());
            responseDto.setLast(coinbaseData.getLast());
            responseDto.setLow(coinbaseData.getLow());
            responseDto.setOpen(coinbaseData.getOpen());
            responseDto.setVolume(coinbaseData.getVolume());
            responseDto.setVolume30day(coinbaseData.getVolume30day());

        } else {
            throw new CustomInternalErrorException("Coin stats could not be loaded", ErrorBusinessCodeEnum.EXTERNAL_API_ERROR);
        }

        return ResponseEntity.status(201).body(responseDto);
    }
}