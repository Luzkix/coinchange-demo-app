package org.luzkix.coinchange.repository;

import org.luzkix.coinchange.dto.projections.TotalFeesForCurrencyDto;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.Transaction;
import org.luzkix.coinchange.model.Transaction.TransactionTypeEnum;
import org.luzkix.coinchange.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

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
}
