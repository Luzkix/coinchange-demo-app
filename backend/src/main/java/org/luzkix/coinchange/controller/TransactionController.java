package org.luzkix.coinchange.controller;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.model.Transaction;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.backendapi.api.TransactionApi;
import org.luzkix.coinchange.openapi.backendapi.model.TransactionResponseDto;
import org.luzkix.coinchange.service.TransactionService;
import org.luzkix.coinchange.utils.DateUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class TransactionController extends GenericController implements TransactionApi {

    private final TransactionService transactionService;

    @Override
    public ResponseEntity<List<TransactionResponseDto>> cancelPendingTransaction(Long id) {
        User user = getUserFromAuthentication();

        transactionService.cancelPendingTransaction(id);

        List<Transaction> pendingTransactions = transactionService.findByUserAndPending(user);
        List<TransactionResponseDto> responseDto = convertTransactionsIntoResponseDto(pendingTransactions);

        return ResponseEntity.status(201).body(responseDto);
    }

    @Override
    public ResponseEntity<List<TransactionResponseDto>> getAllPendingTransactionsByUser() {
        User user = getUserFromAuthentication();

        List<Transaction> pendingTransactions = transactionService.findByUserAndPending(user);
        List<TransactionResponseDto> responseDto = convertTransactionsIntoResponseDto(pendingTransactions);

        return ResponseEntity.status(201).body(responseDto);
    }

    @Override
    public ResponseEntity<List<TransactionResponseDto>> getAllTransactionsByUser() {
        User user = getUserFromAuthentication();

        List<Transaction> pendingTransactions = transactionService.findByUser(user);
        List<TransactionResponseDto> responseDto = convertTransactionsIntoResponseDto(pendingTransactions);

        return ResponseEntity.status(201).body(responseDto);
    }


    // PRIVATE METHODS
    private List<TransactionResponseDto> convertTransactionsIntoResponseDto(List<Transaction> pendingTransactions) {
        return pendingTransactions.stream()
                .map(tr -> new TransactionResponseDto()
                        .transactionId(tr.getId())
                        .userId(tr.getUser().getId())
                        .soldCurrencyCode(tr.getSoldCurrency().getCode())
                        .boughtCurrencyCode(tr.getBoughtCurrency().getCode())
                        .amountSold(tr.getAmountSold())
                        .amountBought(tr.getAmountBought())
                        .conversionRateAfterFeesDeduction(tr.getConversionRateAfterFees())
                        .transactionFeeInBoughtCurrency(tr.getTransactionFeeAmount())
                        .feeCategory(tr.getFeeCategory().getCategory().name())
                        .feeRate(tr.getFeeCategory().getFeeRate())
                        .transactionType(tr.getTransactionTypeEnum().name())
                        .createdAt(DateUtils.convertToSystemOffsetDateTime(tr.getCreatedAt()))
                )
                .toList();
    }
}