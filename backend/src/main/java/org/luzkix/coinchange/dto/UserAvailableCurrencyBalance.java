package org.luzkix.coinchange.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.User;

import java.math.BigDecimal;

@AllArgsConstructor
@Getter
@Setter
public class UserAvailableCurrencyBalance {
    private User user;
    private Currency currency;
    private BigDecimal availableBalance;
}
