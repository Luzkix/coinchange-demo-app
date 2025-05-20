package org.luzkix.coinchange.service;

import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.backendapi.model.PortfolioResponseDto;

public interface PortfolioService {
    PortfolioResponseDto getPortfolio(User user);

}
