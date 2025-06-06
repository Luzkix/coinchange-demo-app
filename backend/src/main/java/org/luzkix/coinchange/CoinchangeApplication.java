package org.luzkix.coinchange;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableCaching
@EnableScheduling
public class CoinchangeApplication {

	public static void main(String[] args) {
		SpringApplication.run(CoinchangeApplication.class, args);
	}

}
