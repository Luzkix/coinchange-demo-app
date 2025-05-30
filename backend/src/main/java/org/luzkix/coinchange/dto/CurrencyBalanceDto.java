package org.luzkix.coinchange.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.luzkix.coinchange.model.Currency;

import java.math.BigDecimal;

@AllArgsConstructor
@Getter
@Setter
public class CurrencyBalanceDto {
    private Currency currency;
    private BigDecimal availableBalance;
}
