package org.luzkix.coinchange.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@AllArgsConstructor
@Getter
public class ConversionRateTokenPayloadDto {
    private String soldCurrencyCode;
    private String boughtCurrencyCode;
    private BigDecimal marketConversionRate;
    private OffsetDateTime validTo;
}
