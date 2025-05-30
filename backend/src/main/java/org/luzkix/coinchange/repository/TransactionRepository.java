package org.luzkix.coinchange.repository;

import org.luzkix.coinchange.dto.projections.CurrencyUsageDto;
import org.luzkix.coinchange.dto.projections.TotalFeesForCurrencyDto;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.Transaction;
import org.luzkix.coinchange.model.Transaction.TransactionTypeEnum;
import org.luzkix.coinchange.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUser(User user);

    List<Transaction> findByUserAndSoldCurrencyIn(User user, List<Currency> currencies);

    List<Transaction> findByUserAndBoughtCurrencyIn(User user, List<Currency> currencies);

    List<Transaction> findByTransactionTypeEnum(TransactionTypeEnum transactionType);

    List<Transaction> findByUserAndTransactionTypeEnum(User user, TransactionTypeEnum transactionType);

    List<Transaction> findByProcessedAtIsNotNull();

    List<Transaction> findByUserAndProcessedAtIsNotNull(User user);

    List<Transaction> findByCancelledAtIsNotNull();

    List<Transaction> findByUserAndCancelledAtIsNotNull(User user);

    List<Transaction> findByProcessedAtIsNullAndCancelledAtIsNull();

    List<Transaction> findByUserAndProcessedAtIsNullAndCancelledAtIsNull(User user);

    @Query("""
        SELECT
            t.convertedFeeCurrency AS currency,
            SUM(t.convertedFeeAmount) AS totalFees
        FROM Transaction t
        WHERE t.processedAt IS NOT NULL
            AND t.convertedFeeAmount IS NOT NULL
            AND t.convertedFeeAmount <> 0
        GROUP BY t.convertedFeeCurrency
    """)
    List<TotalFeesForCurrencyDto> getTotalConvertedFeesForProcessedTransactions();

    @Query("""
        SELECT
            t.convertedFeeCurrency AS currency,
            SUM(t.convertedFeeAmount) AS totalFees
        FROM Transaction t
        WHERE t.user = :user
            AND t.processedAt IS NOT NULL
            AND t.convertedFeeAmount IS NOT NULL
            AND t.convertedFeeAmount <> 0
        GROUP BY t.convertedFeeCurrency
    """)
    List<TotalFeesForCurrencyDto> getTotalConvertedFeesForProcessedTransactionsAndUser(@Param("user") User user);

    @Query("""
        SELECT
            t.transactionFeeCurrency AS currency,
            SUM(t.transactionFeeAmount) AS totalFees
        FROM Transaction t
        WHERE t.processedAt IS NULL
            AND t.cancelledAt IS NULL
            AND t.transactionFeeAmount IS NOT NULL
            AND t.transactionFeeAmount <> 0
        GROUP BY t.transactionFeeCurrency
    """)
    List<TotalFeesForCurrencyDto> getTotalFeesInTransactionFeeCurrencyForNotProcessedTransactions();

    @Query("""
        SELECT
            t.transactionFeeCurrency AS currency,
            SUM(t.transactionFeeAmount) AS totalFees
        FROM Transaction t
        WHERE t.user = :user
            AND t.processedAt IS NULL
            AND t.cancelledAt IS NULL
            AND t.transactionFeeAmount IS NOT NULL
            AND t.transactionFeeAmount <> 0
        GROUP BY t.transactionFeeCurrency
    """)
    List<TotalFeesForCurrencyDto> getTotalFeesInTransactionFeeCurrencyForNotProcessedTransactionsAndUser(@Param("user") User user);

    @Query("""
        SELECT t.soldCurrency as soldCurrency, t.boughtCurrency as boughtCurrency
        FROM Transaction t
        WHERE t.user = :user
        GROUP BY t.soldCurrency, t.boughtCurrency
    """)
    List<CurrencyUsageDto> findUniqueCurrenciesUsedByUser(@Param("user") User user);

    @Query("""
        SELECT COALESCE(SUM(t.amountSold), 0)
        FROM Transaction t
        WHERE t.user = :user
          AND t.soldCurrency = :currency
          AND (t.processedAt IS NOT NULL OR (t.processedAt IS NULL AND t.cancelledAt IS NULL))
    """)
    Optional<BigDecimal> sumSoldAmountForCurrencyNotCancelled(@Param("user") User user, @Param("currency") Currency currency);

    @Query("""
        SELECT COALESCE(SUM(t.amountBought), 0)
        FROM Transaction t
        WHERE t.user = :user
          AND t.boughtCurrency = :currency
          AND t.processedAt IS NOT NULL
    """)
    Optional<BigDecimal> sumBoughtAmountForCurrencyProcessed(@Param("user") User user, @Param("currency") Currency currency);

    @Query("""
        SELECT COALESCE(SUM(t.amountSold), 0)
        FROM Transaction t
        WHERE t.user = :user
          AND t.soldCurrency = :currency
          AND t.processedAt IS NULL
          AND t.cancelledAt IS NOT NULL
    """)
    Optional<BigDecimal> sumSoldAmountForCurrencyCancelledPending(@Param("user") User user, @Param("currency") Currency currency);
}
