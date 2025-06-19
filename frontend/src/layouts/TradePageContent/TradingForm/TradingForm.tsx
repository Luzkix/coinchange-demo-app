import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { tradingFormStyles } from './styles';
import { useGeneralContext } from '../../../contexts/GeneralContext';
import AmountInput from './AmountInput/AmountInput';
import ConversionRateBlock from './ConversionRateBlock/ConversionRateBlock.tsx';
import FeeInfo from './FeeInfo/FeeInfo';
import TradeSuccessMessage from './TradeSuccessMessage/TradeSuccessMessage';
import {
  createFetchBalancesOptions,
  createFetchMarketConversionRateOptions,
} from '../../../constants/customQueryOptions.ts';
import { BalanceTypeEnum, CurrencyTypeEnum } from '../../../constants/customEnums.ts';
import { useConvertBySimpleTrading } from '../../../hooks/useConvertBySimpleTrading.ts';
import {
  type CurrencyBalanceResponseDto,
  CurrencyResponseDto,
} from '../../../api-generated/backend';
import { DEFAULT_ERROR_REFETCH_INTERVAL } from '../../../constants/configVariables.ts';
import { useProcessApiError } from '../../../hooks/useProcessApiError.ts';
import { isApiError } from '../../../services/utils/errorUtils.ts';
import { useConvertByAdvancedTrading } from '../../../hooks/useConvertByAdvancedTrading.ts';

interface TradingFormProps {
  isSimpleTrading: boolean;
}

const TradingForm: React.FC<TradingFormProps> = ({ isSimpleTrading }) => {
  const { t } = useTranslation(['tradePage', 'errors']);
  const { supportedFiatCurrencies, supportedCryptoCurrencies, addErrorPopup } = useGeneralContext();
  const processApiError = useProcessApiError();
  const processName = TradingForm.name;
  const { mutate: convertCurrenciesSimple, isPending: isConvertingSimple } =
    useConvertBySimpleTrading();
  const { mutate: convertCurrenciesAdvanced, isPending: isConvertingAdvanced } =
    useConvertByAdvancedTrading();

  const {
    data: balancesData,
    refetch: refetchBalancesData,
    isLoading: isBalancesLoading,
    error: balancesError,
    isError: isBalancesErrorResult,
  } = useQuery({
    ...createFetchBalancesOptions(BalanceTypeEnum.AVAILABLE),
    refetchInterval: (query) =>
      query.state.status === 'error' ? DEFAULT_ERROR_REFETCH_INTERVAL : false,
  });

  const allCurrencies = useMemo(() => {
    return [...supportedFiatCurrencies, ...supportedCryptoCurrencies];
  }, [supportedFiatCurrencies, supportedCryptoCurrencies]);

  const [availableBalances, setAvailableBalances] = useState<CurrencyBalanceResponseDto[]>([]);
  useEffect(() => {
    if (balancesData?.currenciesBalances) {
      setAvailableBalances(balancesData.currenciesBalances);
    }
  }, [balancesData]);

  const [soldCurrency, setSoldCurrency] = useState<CurrencyResponseDto | null>(null);
  const [boughtCurrency, setBoughtCurrency] = useState<CurrencyResponseDto | null>(null);
  const [soldAmount, setSoldAmount] = useState('');
  const [userRate, setUserRate] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const soldCurrencyBalance =
    availableBalances.find((balanceDto) => balanceDto.currency.code === soldCurrency?.code)
      ?.balance ?? 0;
  const boughtCurrencyBalance =
    availableBalances.find((balanceDto) => balanceDto.currency.code === boughtCurrency?.code)
      ?.balance ?? 0;

  const {
    data: marketConversionRateData,
    refetch: refetchMarketConversionRate,
    error: marketConversionRateError,
  } = useQuery({
    ...createFetchMarketConversionRateOptions(soldCurrency?.code ?? '', boughtCurrency?.code ?? ''),
    enabled: !!(soldCurrency && boughtCurrency),
  });

  const feeRate = marketConversionRateData?.feeRate ?? 0;
  const marketConversionRate = marketConversionRateData?.marketConversionRate ?? 0;
  const conversionRateValidTo = marketConversionRateData?.validTo
    ? new Date(marketConversionRateData.validTo)
    : null;
  const verificationToken = marketConversionRateData?.verificationToken ?? '';

  const finalConversionRate = isSimpleTrading
    ? marketConversionRate * (1 - feeRate)
    : Number(userRate) * (1 - feeRate);
  const finalFeeRate = isSimpleTrading
    ? marketConversionRate * feeRate
    : Number(userRate) * feeRate;

  const boughtAmount =
    soldAmount && !isNaN(Number(soldAmount)) ? Number(soldAmount) * finalConversionRate : 0;
  const feeAmount =
    soldAmount && !isNaN(Number(soldAmount)) ? Number(soldAmount) * finalFeeRate : 0;

  const [isSoldAmountError, setIsSoldAmountError] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    if (!soldAmount) {
      setIsSoldAmountError(true);
    } else if (Number(soldAmount) <= 0) {
      setIsSoldAmountError(true);
    } else if (Number(soldAmount) > soldCurrencyBalance) {
      setIsSoldAmountError(true);
    } else {
      setIsSoldAmountError(undefined);
    }
  }, [soldAmount, soldCurrencyBalance]);

  const [isUserRateError, setIsUserRateError] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    if (userRate == '' || userRate == '0') {
      setIsUserRateError(true);
    } else if (Number(userRate) <= 0) {
      setIsUserRateError(true);
    } else {
      setIsUserRateError(undefined);
    }
  }, [userRate]);

  const [secondsLeftForUsingConversionRate, setSecondsLeftForUsingConversionRate] =
    useState<number>(0);

  useEffect(() => {
    if (!conversionRateValidTo) return;
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((conversionRateValidTo.getTime() - now) / 1000));
      setSecondsLeftForUsingConversionRate(diff);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [conversionRateValidTo]);

  useEffect(() => {
    // If secondsLeftForUsingConversionRate reaches 0 and currencies are selected, re-fetch conversion rate automatically
    if (secondsLeftForUsingConversionRate === 0 && !!(soldCurrency && boughtCurrency)) {
      refetchMarketConversionRate();
    }
  }, [secondsLeftForUsingConversionRate, soldCurrency, boughtCurrency, soldAmount]);

  const handleSoldCurrencyChange = (soldCurr: CurrencyResponseDto | null) => {
    if (soldCurr == boughtCurrency || soldCurr?.type == CurrencyTypeEnum.CRYPTO) {
      setBoughtCurrency(null);
    }

    if (soldCurrency != null) setSoldAmount(''); //resetting sold amount only when switching from one currency to another
    setSoldCurrency(soldCurr);
  };

  const handleSwap = () => {
    if (boughtCurrencyBalance > 0) {
      setSoldCurrency(boughtCurrency);
      setBoughtCurrency(soldCurrency);
      setSoldAmount('');
    }
  };

  const handleUserRateChange = (userRate: string) => {
    setUserRate(userRate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSimpleTrading) {
      if (
        !soldAmount ||
        Number(soldAmount) <= 0 ||
        Number(soldAmount) > soldCurrencyBalance ||
        !verificationToken
      )
        return;

      convertCurrenciesSimple(
        {
          soldCurrencyAmount: Number(soldAmount),
          verificationToken,
        },
        {
          onSuccess: (result) => {
            setSoldAmount('');
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
            refetchMarketConversionRate();

            if (result?.currenciesBalances) {
              setAvailableBalances(result.currenciesBalances);
            } else refetchBalancesData();
          },
        },
      );
    }
    if (!isSimpleTrading) {
      if (
        !soldAmount ||
        Number(soldAmount) <= 0 ||
        Number(soldAmount) > soldCurrencyBalance ||
        !verificationToken ||
        !soldCurrency?.code ||
        !boughtCurrency?.code ||
        (!userRate && Number(userRate) <= 0)
      )
        return;

      convertCurrenciesAdvanced(
        {
          soldCurrencyCode: soldCurrency.code,
          boughtCurrencyCode: boughtCurrency.code,
          userSelectedConversionRate: Number(userRate),
          soldCurrencyAmount: Number(soldAmount),
        },
        {
          onSuccess: (result) => {
            setSoldAmount('');
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
            refetchMarketConversionRate();

            if (result?.currenciesBalances) {
              setAvailableBalances(result.currenciesBalances);
            } else refetchBalancesData();
          },
        },
      );
    }
  };

  //ERRORS HANDLING
  const [isBalancesError, setIsBalancesError] = useState<boolean>(false);

  useEffect(() => {
    //Note: behem loadingu pri refetchi se na chvili zmeni stav pro isBalancesErrorResult na false a pak zpet na true,
    // coz vedlo k zobrazeni erroru pri kazdem refetchi. Kontrola na !isBalancesLoading toto resi.
    if (!isBalancesLoading && isBalancesErrorResult) {
      setIsBalancesError(isBalancesErrorResult);
    }
  }, [isBalancesErrorResult]);

  useEffect(() => {
    // Zobrazí chybovou hlášku jen napoprvé, když se detekuje error (tzn při změně stavu isError z false na true)
    if (isBalancesError && isApiError(balancesError)) {
      setAvailableBalances([]);
      processApiError(balancesError, processName);
    } else if (isBalancesError && !!balancesError) {
      //not ApiError
      addErrorPopup(t('errors:message.fetchBalancesError'));
    }
  }, [isBalancesError]);

  useEffect(() => {
    if (isApiError(marketConversionRateError)) {
      processApiError(marketConversionRateError, processName);
    } else if (marketConversionRateError) {
      //not ApiError
      addErrorPopup(t('errors:message.fetchConversionRateError'));
    }
  }, [marketConversionRateError]);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={tradingFormStyles.form}>
      {(balancesError || allCurrencies.length == 0) && (
        <Alert severity="error" sx={{ fontWeight: 700 }}>
          {t('errors:common.genericErrorTitle')}
        </Alert>
      )}

      <AmountInput
        isSoldAmount={true}
        label={t('tradePage:form.soldAmount')}
        value={soldAmount}
        onChange={setSoldAmount}
        currency={soldCurrency}
        balance={soldCurrencyBalance}
        isSoldAmountError={isSoldAmountError}
        listedCurrencies={allCurrencies
          .map((currency) => {
            const foundBalance = availableBalances.find(
              (balanceDto) => balanceDto.currency.code === currency.code && balanceDto.balance > 0,
            );
            return foundBalance ? { currency: currency, balance: foundBalance.balance } : null;
          })
          .filter(
            (
              listedCurrency,
            ): listedCurrency is { currency: CurrencyResponseDto; balance: number } =>
              !!listedCurrency,
          )}
        onCurrencyChange={handleSoldCurrencyChange}
        onBalanceClick={() => setSoldAmount(String(soldCurrencyBalance))}
      />

      <ConversionRateBlock
        isSimpleTrading={isSimpleTrading}
        soldCurrency={soldCurrency}
        boughtCurrency={boughtCurrency}
        rate={finalConversionRate}
        marketRate={marketConversionRate}
        secondsLeft={secondsLeftForUsingConversionRate}
        isError={!!marketConversionRateError}
        onUserRateChange={handleUserRateChange}
        isUserRateError={isUserRateError}
      />

      <Button
        sx={tradingFormStyles.swapButton}
        variant="outlined"
        onClick={handleSwap}
        disabled={boughtCurrencyBalance <= 0}
      >
        ↔
      </Button>
      <AmountInput
        isSoldAmount={false}
        label={t('tradePage:form.boughtAmount')}
        value={Number(boughtAmount).toFixed(8)} //zobrazujeme zaokrouhledne cislo na 8 desetinnych mist ve string formatu
        currency={boughtCurrency}
        balance={boughtCurrencyBalance}
        readOnly
        disabled={false}
        listedCurrencies={allCurrencies
          .filter((currency) => currency.code !== soldCurrency?.code) //nezobrazuju v nabídce soldCurrency
          .filter((currency) => {
            //pokud je jako soldCurrency CRYPTO a nikoli FIAT, nabidni pouze fiat meny (nepodporujeme konverze crypto-crypto)
            const soldCurrencyIsCrypto = soldCurrency?.type === CurrencyTypeEnum.CRYPTO;
            return soldCurrencyIsCrypto ? currency.type === CurrencyTypeEnum.FIAT : true;
          })
          .map((currency) => {
            const found = availableBalances.find(
              (balanceDto) => balanceDto.currency.code === currency.code,
            );
            return {
              currency: currency,
              balance: found ? found.balance : 0,
            };
          })}
        onCurrencyChange={setBoughtCurrency}
      />

      <FeeInfo feeAmount={feeAmount} boughtCurrency={boughtCurrency} />
      <Button
        sx={tradingFormStyles.submitButton}
        variant="contained"
        color="primary"
        type="submit"
        disabled={
          !!marketConversionRateError ||
          !!balancesError ||
          isSoldAmountError ||
          isConvertingSimple ||
          isConvertingAdvanced ||
          !soldAmount ||
          (!isSimpleTrading && (!userRate || isUserRateError))
        }
        fullWidth
      >
        {isConvertingSimple ? (
          <CircularProgress size={24} />
        ) : (
          t('tradePage:form.exchange', { currency: boughtCurrency })
        )}
      </Button>
      {showSuccess && <TradeSuccessMessage />}
    </Box>
  );
};

export default TradingForm;
