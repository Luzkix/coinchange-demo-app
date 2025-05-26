package org.luzkix.coinchange.service;

import org.luzkix.coinchange.openapi.coinbaseexchangeclient.model.CoinStats;

import java.util.Optional;

public interface CoinStatsService {
    /**
     * Return actual CoinStats for the productId (e.g. BTC-USD).
     * @param productId "BTC-USD"
     * @return Optional<CoinStats>
     */
    Optional<CoinStats> getCoinStats(String productId);
}
