package org.luzkix.coinchange.service;

import org.luzkix.coinchange.dto.projections.CurrencyUsageDto;
import org.luzkix.coinchange.dto.projections.TotalFeesForCurrencyDto;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.Transaction;
import org.luzkix.coinchange.model.Transaction.TransactionTypeEnum;
import org.luzkix.coinchange.model.User;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface TransactionService {

    Transaction save(Transaction transaction);

    List<Transaction> findAll();

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

    List<Transaction> findPending();

    List<Transaction> findByUserAndPending(User user);

    List<TotalFeesForCurrencyDto> getTotalConvertedFeesForProcessedTransactions();

    List<TotalFeesForCurrencyDto> getTotalConvertedFeesForProcessedTransactionsAndUser(User user);

    List<TotalFeesForCurrencyDto> getTotalFeesInTransactionFeeCurrencyForNotProcessedTransactions();

    List<TotalFeesForCurrencyDto> getTotalFeesInTransactionFeeCurrencyForNotProcessedTransactionsAndUser(User user);
    List<CurrencyUsageDto> findUniqueCurrenciesUsedByUser(User user);
    Optional<BigDecimal> sumSoldAmountForCurrencyNotCancelled(User user, Currency currency);
    Optional<BigDecimal> sumSoldAmountForCurrencyPending(User user, Currency currency);
    Optional<BigDecimal> sumBoughtAmountForCurrencyProcessed(User user, Currency currency);
    Transaction cancelPendingTransaction(Long id);
}
