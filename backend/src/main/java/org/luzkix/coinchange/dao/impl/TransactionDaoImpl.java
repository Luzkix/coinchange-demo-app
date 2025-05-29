package org.luzkix.coinchange.dao.impl;

import org.luzkix.coinchange.dao.TransactionDao;
import org.luzkix.coinchange.dto.projections.TotalFeesForCurrencyDto;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.Transaction;
import org.luzkix.coinchange.model.Transaction.TransactionTypeEnum;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class TransactionDaoImpl implements TransactionDao {

    private final TransactionRepository transactionRepository;

    @Autowired
    public TransactionDaoImpl(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public Transaction save(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    @Override
    public Optional<Transaction> findById(Long id) {
        return transactionRepository.findById(id);
    }

    @Override
    public List<Transaction> findByUser(User user) {
        return transactionRepository.findByUser(user);
    }

    @Override
    public List<Transaction> findByUserAndSoldCurrencies(User user, List<Currency> currencies) {
        return transactionRepository.findByUserAndSoldCurrencyIn(user, currencies);
    }

    @Override
    public List<Transaction> findByUserAndBoughtCurrencies(User user, List<Currency> currencies) {
        return transactionRepository.findByUserAndBoughtCurrencyIn(user, currencies);
    }

    @Override
    public List<Transaction> findByTransactionType(TransactionTypeEnum transactionType) {
        return transactionRepository.findByTransactionTypeEnum(transactionType);
    }

    @Override
    public List<Transaction> findByUserAndTransactionType(User user, TransactionTypeEnum transactionType) {
        return transactionRepository.findByUserAndTransactionTypeEnum(user, transactionType);
    }

    @Override
    public List<Transaction> findProcessed() {
        return transactionRepository.findByProcessedAtIsNotNull();
    }

    @Override
    public List<Transaction> findByUserAndProcessed(User user) {
        return transactionRepository.findByUserAndProcessedAtIsNotNull(user);
    }

    @Override
    public List<Transaction> findCancelled() {
        return transactionRepository.findByCancelledAtIsNotNull();
    }

    @Override
    public List<Transaction> findByUserAndCancelled(User user) {
        return transactionRepository.findByUserAndCancelledAtIsNotNull(user);
    }

    @Override
    public List<Transaction> findProcessing() {
        return transactionRepository.findByProcessedAtIsNullAndCancelledAtIsNull();
    }

    @Override
    public List<Transaction> findByUserAndProcessing(User user) {
        return transactionRepository.findByUserAndProcessedAtIsNullAndCancelledAtIsNull(user);
    }

    @Override
    public List<TotalFeesForCurrencyDto> getTotalConvertedFeesForProcessedTransactions() {
        return transactionRepository.getTotalConvertedFeesForProcessedTransactions();
    }

    @Override
    public List<TotalFeesForCurrencyDto> getTotalConvertedFeesForProcessedTransactionsAndUser(User user) {
        return transactionRepository.getTotalConvertedFeesForProcessedTransactionsAndUser(user);
    }

    @Override
    public List<TotalFeesForCurrencyDto> getTotalFeesInTransactionFeeCurrencyForNotProcessedTransactions() {
        return transactionRepository.getTotalFeesInTransactionFeeCurrencyForNotProcessedTransactions();
    }

    @Override
    public List<TotalFeesForCurrencyDto> getTotalFeesInTransactionFeeCurrencyForNotProcessedTransactionsAndUser(User user) {
        return transactionRepository.getTotalFeesInTransactionFeeCurrencyForNotProcessedTransactionsAndUser(user);
    }
}
