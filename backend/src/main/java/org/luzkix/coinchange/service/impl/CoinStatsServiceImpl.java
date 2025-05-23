package org.luzkix.coinchange.service.impl;

import org.luzkix.coinchange.exceptions.CustomInternalErrorException;
import org.luzkix.coinchange.openapi.coinbaseexchangeclient.client.ApiCoinStatsApi;
import org.luzkix.coinchange.openapi.coinbaseexchangeclient.model.CoinStats;
import org.luzkix.coinchange.service.CoinStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Optional;

import static org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum.EXTERNAL_API_ERROR;

@Service
public class CoinStatsServiceImpl implements CoinStatsService {

    private final ApiCoinStatsApi apiCoinStatsApi;

    @Autowired
    public CoinStatsServiceImpl(ApiCoinStatsApi apiCoinStatsApi) {
        this.apiCoinStatsApi = apiCoinStatsApi;
    }

    /**
     * Returns CoinStats for particular product (e.g. BTC-USD) with applied caching mechanism.
     */
    @Override
    @Cacheable(value = "coinStats", key = "#productId")
    public Optional<CoinStats> getCoinStats(String productId) {
        try {
            Mono<CoinStats> coinStatsMono = apiCoinStatsApi.getCoinStats(productId);
            // Blocking Mono since we require synchronous result (this is common for service layer)
            return Optional.ofNullable(coinStatsMono.block());
        } catch (Exception ex) {
            throw new CustomInternalErrorException(ex.getMessage(), EXTERNAL_API_ERROR);
        }
    }
}
