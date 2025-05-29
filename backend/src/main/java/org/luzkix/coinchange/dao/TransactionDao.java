package org.luzkix.coinchange.dao;

import org.luzkix.coinchange.dto.projections.TotalFeesForCurrencyDto;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.Transaction;
import org.luzkix.coinchange.model.Transaction.TransactionTypeEnum;
import org.luzkix.coinchange.model.User;

import java.util.List;
import java.util.Optional;

public interface TransactionDao {

    Transaction save(Transaction transaction);

    Optional<Transaction> findById(Long id);

    List<Transaction> findByUser(User user);

    List<Transaction> findByUserAndSoldCurrencies(User user, List<Currency> currencies);

    List<Transaction> findByUserAndBoughtCurrencies(User user, List<Currency> currencies);

    List<Transaction> findByTransactionType(TransactionTypeEnum transactionType);

    List<Transaction> findByUserAndTransactionType(User user, TransactionTypeEnum transactionType);

    List<Transaction> findProcessed();

    List<Transaction> findByUserAndProcessed(User user);

    List<Transaction> findCancelled();

    List<Transaction> findByUserAndCancelled(User user);

    List<Transaction> findProcessing();

    List<Transaction> findByUserAndProcessing(User user);

    List<TotalFeesForCurrencyDto> getTotalConvertedFeesForProcessedTransactions();

    List<TotalFeesForCurrencyDto> getTotalConvertedFeesForProcessedTransactionsAndUser(User user);

    List<TotalFeesForCurrencyDto> getTotalFeesInTransactionFeeCurrencyForNotProcessedTransactions();
    List<TotalFeesForCurrencyDto> getTotalFeesInTransactionFeeCurrencyForNotProcessedTransactionsAndUser(User user);
}
