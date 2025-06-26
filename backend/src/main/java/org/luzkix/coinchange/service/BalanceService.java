package org.luzkix.coinchange.service;

import org.luzkix.coinchange.config.CustomConstants;
import org.luzkix.coinchange.dto.projections.CurrencyBalanceDto;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.backendapi.model.BalancesResponseDto;

import java.math.BigDecimal;
import java.util.List;

public interface BalanceService {
    BalancesResponseDto getBalancesMappedToResponseDto(User user, CustomConstants.BalanceTypeEnum type);
    List<CurrencyBalanceDto> getCurrencyBalances(User user, CustomConstants.BalanceTypeEnum balanceType);
    void creditRegistrationBonus(User user, Currency currency, BigDecimal bonus);
}
