package org.luzkix.coinchange.dto.projections;

import org.luzkix.coinchange.model.Currency;

public interface CurrencyUsageDto {
    Currency getSoldCurrency();
    Currency getBoughtCurrency();
}