package org.luzkix.coinchange.service.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.openapi.coinbaseexchangeclient.client.ApiCoinStatsApi;
import org.luzkix.coinchange.openapi.coinbaseexchangeclient.model.CoinStats;
import org.luzkix.coinchange.service.CoinbaseExchangeService;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CoinbaseExchangeServiceImpl implements CoinbaseExchangeService {

    private final ApiCoinStatsApi apiCoinStatsApi;

    /**
     * Returns CoinStats for particular product (e.g. BTC-USD)
     */
    @Override
    @Cacheable(value = "coinStats", key = "#productId") //applied caching mechanism.
    public Optional<CoinStats> getCoinStats(String productId) {
        try {
            Mono<CoinStats> coinStatsMono = apiCoinStatsApi.getCoinStats(productId);
            // Blocking Mono since we require synchronous result (this is common for service layer)
            return Optional.ofNullable(coinStatsMono.block());
        } catch (Exception ex) {
            return Optional.empty();
        }
    }
}
