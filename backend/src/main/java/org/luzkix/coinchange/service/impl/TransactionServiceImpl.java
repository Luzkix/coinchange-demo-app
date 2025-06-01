package org.luzkix.coinchange.service.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.dao.TransactionDao;
import org.luzkix.coinchange.dto.projections.CurrencyUsageDto;
import org.luzkix.coinchange.dto.projections.TotalFeesForCurrencyDto;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.Transaction;
import org.luzkix.coinchange.model.Transaction.TransactionTypeEnum;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.service.TransactionService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionDao transactionDao;

    @Override
    public Transaction save(Transaction transaction) {
        return transactionDao.save(transaction);
    }

    @Override
    public List<Transaction> findAll() {
        return transactionDao.findAll();
    }

    @Override
    public Optional<Transaction> findById(Long id) {
        return transactionDao.findById(id);
    }

    @Override
    public List<Transaction> findByUser(User user) {
        return transactionDao.findByUser(user);
    }

    @Override
    public List<Transaction> findByUserAndSoldCurrencies(User user, List<Currency> currencies) {
        return transactionDao.findByUserAndSoldCurrencies(user, currencies);
    }

    @Override
    public List<Transaction> findByUserAndBoughtCurrencies(User user, List<Currency> currencies) {
        return transactionDao.findByUserAndBoughtCurrencies(user, currencies);
    }

    @Override
    public List<Transaction> findByTransactionType(TransactionTypeEnum transactionType) {
        return transactionDao.findByTransactionType(transactionType);
    }

    @Override
    public List<Transaction> findByUserAndTransactionType(User user, TransactionTypeEnum transactionType) {
        return transactionDao.findByUserAndTransactionType(user, transactionType);
    }

    @Override
    public List<Transaction> findProcessed() {
        return transactionDao.findProcessed();
    }

    @Override
    public List<Transaction> findByUserAndProcessed(User user) {
        return transactionDao.findByUserAndProcessed(user);
    }

    @Override
    public List<Transaction> findCancelled() {
        return transactionDao.findCancelled();
    }

    @Override
    public List<Transaction> findByUserAndCancelled(User user) {
        return transactionDao.findByUserAndCancelled(user);
    }

    @Override
    public List<Transaction> findProcessing() {
        return transactionDao.findProcessing();
    }

    @Override
    public List<Transaction> findByUserAndProcessing(User user) {
        return transactionDao.findByUserAndProcessing(user);
    }

    @Override
    public List<TotalFeesForCurrencyDto> getTotalConvertedFeesForProcessedTransactions() {
        return transactionDao.getTotalConvertedFeesForProcessedTransactions();
    }

    @Override
    public List<TotalFeesForCurrencyDto> getTotalConvertedFeesForProcessedTransactionsAndUser(User user) {
        return transactionDao.getTotalConvertedFeesForProcessedTransactionsAndUser(user);
    }

    @Override
    public List<TotalFeesForCurrencyDto> getTotalFeesInTransactionFeeCurrencyForNotProcessedTransactions() {
        return transactionDao.getTotalFeesInTransactionFeeCurrencyForNotProcessedTransactions();
    }

    @Override
    public List<TotalFeesForCurrencyDto> getTotalFeesInTransactionFeeCurrencyForNotProcessedTransactionsAndUser(User user) {
        return transactionDao.getTotalFeesInTransactionFeeCurrencyForNotProcessedTransactionsAndUser(user);
    }

    @Override
    public List<CurrencyUsageDto> findUniqueCurrenciesUsedByUser(User user) {
        return transactionDao.findUniqueCurrenciesUsedByUser(user);
    }

    @Override
    public Optional<BigDecimal> sumSoldAmountForCurrencyNotCancelled(User user, Currency currency) {
        return transactionDao.sumSoldAmountForCurrencyNotCancelled(user, currency);
    }

    @Override
    public Optional<BigDecimal> sumSoldAmountForCurrencyPending(User user, Currency currency) {
        return transactionDao.sumSoldAmountForCurrencyPending(user, currency);
    }

    @Override
    public Optional<BigDecimal> sumBoughtAmountForCurrencyProcessed(User user, Currency currency) {
        return transactionDao.sumBoughtAmountForCurrencyProcessed(user, currency);
    }
}
