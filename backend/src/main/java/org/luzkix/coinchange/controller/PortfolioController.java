package org.luzkix.coinchange.controller;

import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.backendapi.api.PortfolioApi;
import org.luzkix.coinchange.openapi.backendapi.model.PortfolioResponseDto;
import org.luzkix.coinchange.service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PortfolioController extends GenericController implements PortfolioApi {

    @Autowired
    private PortfolioService portfolioService;

    @Override
    public ResponseEntity<PortfolioResponseDto> getPortfolio() {
        User user = getUserFromAuthentication();

        PortfolioResponseDto portfolio = portfolioService.getPortfolio(user);

        return ResponseEntity.status(201).body(portfolio);
    }
}