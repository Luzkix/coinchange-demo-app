package org.luzkix.coinchange.service.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.config.CustomConstants;
import org.luzkix.coinchange.dto.projections.CurrencyBalanceDto;
import org.luzkix.coinchange.exceptions.CustomInternalErrorException;
import org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum;
import org.luzkix.coinchange.model.Currency;
import org.luzkix.coinchange.model.Transaction;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.backendapi.model.BalancesResponseDto;
import org.luzkix.coinchange.openapi.backendapi.model.CurrencyBalanceResponseDto;
import org.luzkix.coinchange.openapi.backendapi.model.CurrencyResponseDto;
import org.luzkix.coinchange.service.BalanceService;
import org.luzkix.coinchange.service.CurrencyService;
import org.luzkix.coinchange.service.TransactionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static org.luzkix.coinchange.utils.DateUtils.convertToSystemOffsetDateTime;

@Service
@RequiredArgsConstructor
public class BalanceServiceImpl implements BalanceService {
    private final TransactionService transactionService;
    private final CurrencyService currencyService;

    @Value("${fee.default-conversion-currency}")
    private String defaultCurrencyCodeForFeeConversion;

    @Override
    public BalancesResponseDto getBalancesMappedToResponseDto(User user, CustomConstants.BalanceTypeEnum type) {
        List<CurrencyBalanceResponseDto> currenciesBalances = getCurrencyBalances(user, type)
                .stream()
                .map(currencyBalance -> {
                    CurrencyResponseDto currency = new CurrencyResponseDto();
                    currency.setId(currencyBalance.getCurrency().getId());
                    currency.setCode(currencyBalance.getCurrency().getCode());
                    currency.setName(currencyBalance.getCurrency().getName());
                    currency.setColor(currencyBalance.getCurrency().getColor());
                    currency.setIsActive(currencyBalance.getCurrency().isActive());
                    currency.setType(currencyBalance.getCurrency().getType().getTypeValue());

                    CurrencyBalanceResponseDto responseDto = new CurrencyBalanceResponseDto();
                    responseDto.setCurrency(currency);
                    responseDto.setBalance(currencyBalance.getBalance());
                    responseDto.setCalculatedAt(convertToSystemOffsetDateTime(LocalDateTime.now()));

                    return responseDto;
                })
                .collect(Collectors.toList());

        // Return as BalancesResponseDto
        BalancesResponseDto responseDto = new BalancesResponseDto();
        responseDto.setCurrenciesBalances(currenciesBalances);
        responseDto.setUserName(user.getUsername());

        return responseDto;
    }

    @Override
    public List<CurrencyBalanceDto> getCurrencyBalances(User user, CustomConstants.BalanceTypeEnum balanceType) {

        return balanceType.name().equals(CustomConstants.BalanceTypeEnum.AVAILABLE.name())
                ? transactionService.getAvailableBalancesForAllUsedCurrenciesByUser(user)
                : transactionService.getTotalBalancesForAllUsedCurrenciesByUser(user);

    }

    @Override
    public void creditRegistrationBonus(User user, Currency currency, BigDecimal bonus) {
        List<Transaction> allTransactions = transactionService.findByUser(user);

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
            bonusTransaction.setConversionRateAfterFees(BigDecimal.ONE);
            bonusTransaction.setTransactionTypeEnum(Transaction.TransactionTypeEnum.DEPOSIT);
            bonusTransaction.setCreatedAt(now);
            bonusTransaction.setProcessedAt(now);
            bonusTransaction.setNote(CustomConstants.REGISTRATION_BONUS);

            transactionService.save(bonusTransaction);
        }
    }
}
