package org.luzkix.coinchange.service.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.model.Transaction;
import org.luzkix.coinchange.service.CurrencyConversionService;
import org.luzkix.coinchange.service.JobsService;
import org.luzkix.coinchange.service.TransactionService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobsServiceImpl implements JobsService {
    private final TransactionService transactionService;
    private final CurrencyConversionService currencyConversionService;

    @Scheduled(fixedDelayString = "${checkPendingTransactionsInterval}") // interval defined in application.properties (note: @Value annotation cant be used here for reading out variable from application.properties since it is read out later than @Scheduled annotation needs)
    public void scheduledJobsTo15sec() {
        checkAndProcessPendingTransactionsJob();
    }

    @Override
    public  List<Transaction> checkAndProcessPendingTransactionsJob() {
        List<Transaction> pendingTransactions = transactionService.findPending();
        List<Transaction> processedTransactions = new ArrayList<>();

        for (Transaction transaction : pendingTransactions) {

            Transaction processedTransaction = currencyConversionService.checkAndConvertPendingTransaction(transaction);

            if (processedTransaction != null) processedTransactions.add(transaction);
        }
        return processedTransactions;
    }
}
