package org.luzkix.coinchange.service;

import org.luzkix.coinchange.openapi.coinbaseclient.model.CoinPairResponse;

import java.util.List;
import java.util.Optional;

public interface CoinbaseService {
    /**
     * Return actual CoinPairResponse for the productId (e.g. BTC-USD) and other parameters.
     * @return Optional<CoinPairResponse>
     */
    Optional<CoinPairResponse> getListOfCoinsWithTradingDetails(Integer limit, Integer offset, String productType, List<String> productIds, String productsSortOrder);
}
