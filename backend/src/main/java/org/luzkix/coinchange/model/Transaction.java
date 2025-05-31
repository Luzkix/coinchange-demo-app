package org.luzkix.coinchange.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "sold_currency_id")
    private Currency soldCurrency;

    @ManyToOne(optional = false)
    @JoinColumn(name = "bought_currency_id")
    private Currency boughtCurrency;

    @Column(nullable = false, precision = 20, scale = 8)
    private BigDecimal amountSold;

    @Column(nullable = false, precision = 20, scale = 8)
    private BigDecimal amountBought;

    @ManyToOne(optional = false)
    @JoinColumn(name = "transaction_fee_currency_id")
    private Currency transactionFeeCurrency;

    @Column(nullable = false, precision = 20, scale = 8)
    private BigDecimal transactionFeeAmount;

    @ManyToOne(optional = false)
    @JoinColumn(name = "converted_fee_currency_id", nullable = false)
    private Currency convertedFeeCurrency;

    @Column(name = "converted_fee_amount", precision = 20, scale = 8)
    private BigDecimal convertedFeeAmount;

    @ManyToOne(optional = false)
    @JoinColumn(name = "fee_category_id", nullable = false)
    private FeeCategory feeCategory;

    @Column(nullable = false, precision = 20, scale = 10)
    private BigDecimal conversionRateAfterFees;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 20)
    private TransactionTypeEnum transactionTypeEnum;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime processedAt;

    private LocalDateTime cancelledAt;

    @Column(length = 100)
    private String externalReference;

    @Column(length = 255)
    private String note;

    public enum TransactionTypeEnum {
        DEPOSIT,
        WITHDRAWAL,
        CONVERSION
    }
}
