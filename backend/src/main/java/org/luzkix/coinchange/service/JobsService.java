package org.luzkix.coinchange.service;

import org.luzkix.coinchange.model.Transaction;

import java.util.List;

public interface JobsService {
    List<Transaction> checkAndProcessPendingTransactionsJob();
}
