package org.luzkix.coinchange.config;

import org.luzkix.coinchange.openapi.coinbaseexchangeclient.client.ApiCoinStatsApi;
import org.luzkix.coinchange.openapi.coinbaseexchangeclient.invoker.ApiClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CoinbaseExchangeApiClientConfig {

    //registering ApiCoinStatsApi as a bean to be able to autowire it in service class
    @Bean
    public ApiClient coinbaseExchangeApiClient() {
        return new ApiClient();
    }

    @Bean
    public ApiCoinStatsApi apiCoinStatsApi(ApiClient coinbaseExchangeApiClient) {
        return new ApiCoinStatsApi(coinbaseExchangeApiClient);
    }
}
