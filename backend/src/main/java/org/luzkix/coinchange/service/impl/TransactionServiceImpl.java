package org.luzkix.coinchange.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.luzkix.coinchange.dao.TransactionDao;
import org.luzkix.coinchange.dto.projections.CurrencyBalanceDto;
import org.luzkix.coinchange.dto.projections.CurrencyUsageDto;
import org.luzkix.coinchange.dto.projections.TotalFeesForCurrencyDto;
import org.luzkix.coinchange.exceptions.CustomInternalErrorException;
import org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum;
import org.luzkix.coinchange.exceptions.InvalidInputDataException;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.Transaction;
import org.luzkix.coinchange.model.Transaction.TransactionTypeEnum;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.service.TransactionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
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
    public List<Transaction> findPending() {
        return transactionDao.findPending();
    }

    @Override
    public List<Transaction> findByUserAndPending(User user) {
        return transactionDao.findByUserAndPending(user);
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
    public List<CurrencyUsageDto> findUniqueCurrenciesUsedByUser(User user) {
        return transactionDao.findUniqueCurrenciesUsedByUser(user);
    }

    @Override
    public List<CurrencyBalanceDto> getAvailableBalancesForAllUsedCurrenciesByUser(User user) {
        return transactionDao.getAvailableBalancesForAllUsedCurrenciesByUser(user);
    }

    @Override
    public List<CurrencyBalanceDto> getTotalBalancesForAllUsedCurrenciesByUser(User user) {
        return transactionDao.getTotalBalancesForAllUsedCurrenciesByUser(user);
    }

    @Override
    @Transactional
    public void cancelPendingTransaction(Long id) {
        Transaction transaction = transactionDao.findById(id).orElseThrow(() ->
                new InvalidInputDataException("Transaction with id " + id + "was  not found", ErrorBusinessCodeEnum.ENTITY_NOT_FOUND));

        if (!(transaction.getCancelledAt() == null && transaction.getProcessedAt() == null)) throw new CustomInternalErrorException(
                String.format("Transaction with id %d cannot be cancelled! It was already processed or cancelled", id),
                ErrorBusinessCodeEnum.CANCELLATION_TRANSACTION_FAILURE);

        try{
            transaction.setCancelledAt(LocalDateTime.now());
            transactionDao.save(transaction);

            log.info("Cancelling transaction with id {}. Cancelled at {}",
                    transaction.getId(), transaction.getCancelledAt());
        } catch (Error e) {
            throw new CustomInternalErrorException(
                    "Unknown error while saving cancelling transaction!",
                    ErrorBusinessCodeEnum.CANCELLATION_TRANSACTION_FAILURE
            );
        }
    }
}
