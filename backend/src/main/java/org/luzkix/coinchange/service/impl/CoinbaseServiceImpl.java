package org.luzkix.coinchange.service.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.openapi.coinbaseclient.client.ApiCoinPairApi;
import org.luzkix.coinchange.openapi.coinbaseclient.model.CoinPairResponse;
import org.luzkix.coinchange.service.CoinbaseService;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CoinbaseServiceImpl implements CoinbaseService {

    private final ApiCoinPairApi apiCoinPairApi;

    /**
     * Returns CoinStats for particular product (e.g. BTC-USD)
     */
    @Override
    public Optional<CoinPairResponse> getListOfCoinsWithTradingDetails(Integer limit, Integer offset, String productType, List<String> productIds, String productsSortOrder) {
        try {
            Mono<CoinPairResponse> coinPairsMono = apiCoinPairApi.getListOfCoinsWithTradingDetails(limit, offset, productType, productIds, productsSortOrder);
            // Blocking Mono since we require synchronous result (this is common for service layer)
            return Optional.ofNullable(coinPairsMono.block());
        } catch (Exception ex) {
            return Optional.empty();
        }
    }
}
