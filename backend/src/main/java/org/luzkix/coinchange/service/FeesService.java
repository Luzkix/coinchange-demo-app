package org.luzkix.coinchange.service;

import org.luzkix.coinchange.dto.projections.TotalFeesForCurrencyDto;
import org.luzkix.coinchange.model.Currency;

import java.math.BigDecimal;
import java.util.List;

public interface FeesService {

    BigDecimal getTotalFeesConvertedToTargetCurrency(Currency targetCurrency, List<TotalFeesForCurrencyDto> allCurrenciesFees);
}
