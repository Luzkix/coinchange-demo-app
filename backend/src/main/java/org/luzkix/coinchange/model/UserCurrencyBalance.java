package org.luzkix.coinchange.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(
        name = "user_currency_balances",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "currency_id"})
)
public class UserCurrencyBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private User user;

    @ManyToOne(optional = false)
    private Currency currency;

    @Column(nullable = false, precision = 20, scale = 8)
    private BigDecimal balance;

    @Column(name = "updated_at", nullable = false, insertable = false, updatable = false) //this field is filled automatically by database trigger, not by java
    private OffsetDateTime updatedAt;
}
