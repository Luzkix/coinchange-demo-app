package org.luzkix.coinchange.config;

import org.luzkix.coinchange.openapi.coinbaseclient.client.ApiCoinPairApi;
import org.luzkix.coinchange.openapi.coinbaseclient.invoker.ApiClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class CoinbaseApiClientConfig {
    //registering ApiCoinPairApi as a bean to be able to autowire it in service class
    @Bean
    public ApiClient coinbaseApiClient() {
        //allows to process large responses up to 16MB (previously it was crashing because default was 256Kb)
        WebClient custom = ApiClient.buildWebClientBuilder()
                .codecs(cfg -> cfg.defaultCodecs().maxInMemorySize(16 * 1024 * 1024))
                .build();
        return new ApiClient(custom);
    }

    @Bean
    public ApiCoinPairApi apiCoinPairApi(ApiClient coinbaseApiClient) {
        return new ApiCoinPairApi(coinbaseApiClient);
    }
}
