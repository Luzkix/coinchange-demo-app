package org.luzkix.coinchange.service.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.config.CustomConstants;
import org.luzkix.coinchange.dto.CurrencyBalanceDto;
import org.luzkix.coinchange.dto.projections.CurrencyUsageDto;
import org.luzkix.coinchange.exceptions.CustomInternalErrorException;
import org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.Transaction;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.service.BalanceService;
import org.luzkix.coinchange.service.CurrencyService;
import org.luzkix.coinchange.service.TransactionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class BalanceServiceImpl implements BalanceService {
    private final TransactionService transactionService;
    private final CurrencyService currencyService;

    @Value("${fee.default-conversion-currency}")
    private String defaultCurrencyCodeForFeeConversion;

    @Override
    public List<CurrencyBalanceDto> getCurrencyBalances(User user, CustomConstants.BalanceTypeEnum balanceType) {
        // Collecting of all sold/bought currencies registered in Transaction table for the user.
        List<CurrencyUsageDto> currencyUsages = transactionService.findUniqueCurrenciesUsedByUser(user);
        Set<Currency> allCurrencies = new HashSet<>();
        for (CurrencyUsageDto usage : currencyUsages) {
            allCurrencies.add(usage.getSoldCurrency());
            allCurrencies.add(usage.getBoughtCurrency());
        }

        // Calculate available balance for each currency
        List<CurrencyBalanceDto> result = new ArrayList<>();
        for (Currency currency : allCurrencies) {
            BigDecimal balance = balanceType.name().equals(CustomConstants.BalanceTypeEnum.AVAILABLE.name()) ?
                    calculateAvailableBalanceForCurrency(user, currency) :
                    calculateTotalBalanceForCurrency(user, currency);
            result.add(new CurrencyBalanceDto(currency, balance));
        }

        return result;
    }

    @Override
    public void creditRegistrationBonus(User user, Currency currency, BigDecimal bonus) {
        List<Transaction> allTransactions = transactionService.findAll();

        //creating registration bonus transaction only for new users
        if (allTransactions.isEmpty()) {
            Currency defaultCurrencyForFeeConversion = currencyService.findByCode(defaultCurrencyCodeForFeeConversion)
                    .orElseThrow(() -> new CustomInternalErrorException("Default currency for fee conversion with code " + defaultCurrencyCodeForFeeConversion + "was  not found", ErrorBusinessCodeEnum.ENTITY_NOT_FOUND));
            LocalDateTime now = LocalDateTime.now();

            Transaction bonusTransaction = new Transaction();
            bonusTransaction.setUser(user);
            bonusTransaction.setSoldCurrency(currency);
            bonusTransaction.setBoughtCurrency(currency);
            bonusTransaction.setAmountSold(BigDecimal.ZERO);
            bonusTransaction.setAmountBought(bonus);
            bonusTransaction.setTransactionFeeCurrency(currency);
            bonusTransaction.setTransactionFeeAmount(BigDecimal.ZERO);
            bonusTransaction.setConvertedFeeCurrency(defaultCurrencyForFeeConversion);
            bonusTransaction.setConvertedFeeAmount(BigDecimal.ZERO);
            bonusTransaction.setFeeCategory(user.getFeeCategory());
            bonusTransaction.setConversionRate(BigDecimal.ONE);
            bonusTransaction.setTransactionTypeEnum(Transaction.TransactionTypeEnum.DEPOSIT);
            bonusTransaction.setCreatedAt(now);
            bonusTransaction.setProcessedAt(now);
            bonusTransaction.setNote(CustomConstants.REGISTRATION_BONUS);

            transactionService.save(bonusTransaction);
        }
    }

    //PRIVATE METHODS
    private BigDecimal calculateAvailableBalanceForCurrency(User user, Currency currency) {
        // note: each transaction in Transaction table leads to increase/decrease of available balance based on whether the currency is bought/sold
        // and also based on the state of transaction (whether it is already processed or not yet processed, or cancelled)
        BigDecimal decrease = transactionService.sumSoldAmountForCurrencyNotCancelled(user, currency)
                .orElse(BigDecimal.ZERO);
        BigDecimal increase = transactionService.sumBoughtAmountForCurrencyProcessed(user, currency)
                .orElse(BigDecimal.ZERO);
        BigDecimal cancelledIncrease = transactionService.sumSoldAmountForCurrencyCancelled(user, currency)
                .orElse(BigDecimal.ZERO);

        return increase.add(cancelledIncrease).subtract(decrease);
    }

    private BigDecimal calculateTotalBalanceForCurrency(User user, Currency currency) {
        // note: total balance should also include amount of sold currencies in pending state (i.e. not yet processed)
        BigDecimal availableBalance = calculateAvailableBalanceForCurrency(user, currency);
        BigDecimal increaseForPendingSoldTransactions = transactionService.sumSoldAmountForCurrencyPending(user, currency)
                .orElse(BigDecimal.ZERO);
        return availableBalance.add(increaseForPendingSoldTransactions);
    }
}
