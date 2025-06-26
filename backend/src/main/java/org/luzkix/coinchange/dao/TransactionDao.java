package org.luzkix.coinchange.dao;

import org.luzkix.coinchange.dto.projections.CurrencyBalanceDto;
import org.luzkix.coinchange.dto.projections.CurrencyUsageDto;
import org.luzkix.coinchange.dto.projections.TotalFeesForCurrencyDto;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.Transaction;
import org.luzkix.coinchange.model.Transaction.TransactionTypeEnum;
import org.luzkix.coinchange.model.User;

import java.util.List;
import java.util.Optional;

public interface TransactionDao {

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

    List<CurrencyUsageDto> findUniqueCurrenciesUsedByUser(User user);

    List<CurrencyBalanceDto> getAvailableBalancesForAllUsedCurrenciesByUser(User user);
    List<CurrencyBalanceDto> getTotalBalancesForAllUsedCurrenciesByUser(User user);
}
