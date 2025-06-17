// src/layouts/TradePageContent/TradeSimpleForm/ConversionRateInfo/ConversionRateInfo.tsx
import React, { useState } from 'react';
import { Box, IconButton, OutlinedInput, Typography } from '@mui/material';
import { conversionInfoStyles } from './styles';
import { useTranslation } from 'react-i18next';
import { CurrencyResponseDto } from '../../../../api-generated/backend';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { amountInputStyles } from '../AmountInput/styles.ts';

interface ConversionInfoProps {
  isSimpleTrading: boolean;
  soldCurrency: CurrencyResponseDto | null;
  boughtCurrency: CurrencyResponseDto | null;
  rate: number;
  marketRate: number;
  secondsLeft: number;
  isError: boolean;
  onUserRateChange?: (val: string) => void;
  userRate: string;
}

const ConversionRateInfo: React.FC<ConversionInfoProps> = ({
  isSimpleTrading,
  soldCurrency,
  boughtCurrency,
  rate,
  marketRate,
  secondsLeft,
  isError,
  onUserRateChange,
  userRate,
}) => {
  const { t } = useTranslation('tradePage');

  const [isReversedRate, setIsReversedRate] = useState(true);

  const reversedRate = rate ? 1 / rate : 0;
  const reversedMarketRate = marketRate ? 1 / marketRate : 0;
  const displayedCurrenciesReversedRate =
    soldCurrency && boughtCurrency ? soldCurrency?.code + '/' + boughtCurrency?.code : '';
  const displayedCurrenciesOriginalRate =
    soldCurrency && boughtCurrency ? boughtCurrency?.code + '/' + soldCurrency?.code : '';

  const handleSwapReversedRate = () => {
    if (isReversedRate) {
      setIsReversedRate(false);
    } else setIsReversedRate(true);
  };

  const convertToStandardRate = (userRate: string) => {
    debugger;
    if (isReversedRate) {
      return (1 / Number(userRate)).toString();
    } else return userRate;
  };

  return (
    <>
      <Box sx={conversionInfoStyles.container}>
        {isError ? (
          <Typography color="error">{t('form.rateError')}</Typography>
        ) : (
          <>
            <Typography sx={{ textAlign: 'center' }}>
              {isSimpleTrading ? t('form.bookedRate') : t('form.marketRate')}{' '}
              <IconButton onClick={handleSwapReversedRate}>
                <SwapHorizIcon />
              </IconButton>
              {isSimpleTrading && (
                <b>
                  {isReversedRate &&
                    (reversedRate > 1
                      ? reversedRate.toFixed(3)
                      : reversedRate == 0
                        ? reversedRate.toFixed(0)
                        : reversedRate.toFixed(8))}
                  {!isReversedRate &&
                    (rate > 1
                      ? rate.toFixed(3)
                      : rate == 0
                        ? rate.toFixed(0)
                        : rate.toFixed(8))}{' '}
                  {isReversedRate && displayedCurrenciesReversedRate}
                  {!isReversedRate && displayedCurrenciesOriginalRate}
                </b>
              )}
              {!isSimpleTrading && (
                <b>
                  {isReversedRate &&
                    (reversedMarketRate > 1
                      ? reversedMarketRate.toFixed(3)
                      : reversedMarketRate == 0
                        ? reversedMarketRate.toFixed(0)
                        : reversedMarketRate.toFixed(8))}
                  {!isReversedRate &&
                    (marketRate > 1
                      ? marketRate.toFixed(3)
                      : marketRate == 0
                        ? marketRate.toFixed(0)
                        : marketRate.toFixed(8))}{' '}
                  {isReversedRate && displayedCurrenciesReversedRate}
                  {!isReversedRate && displayedCurrenciesOriginalRate}
                </b>
              )}
            </Typography>

            {isSimpleTrading && (
              <Typography sx={conversionInfoStyles.timer}>
                {secondsLeft > 0
                  ? `${t('form.validity')}: ${secondsLeft}s`
                  : `${t('form.validity')}: 0s`}
              </Typography>
            )}
          </>
        )}
      </Box>
      {!isSimpleTrading && (
        <Box
          sx={{
            ...amountInputStyles.container,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
          }}
        >
          <Typography sx={amountInputStyles.label}>{t('form.requestedRate')}</Typography>
          <OutlinedInput
            value={convertToStandardRate(userRate.toString())}
            onChange={onUserRateChange ? (e) => onUserRateChange(e.target.value) : undefined}
            placeholder={
              isReversedRate
                ? reversedMarketRate > 1
                  ? reversedMarketRate.toFixed(3)
                  : reversedMarketRate == 0
                    ? reversedMarketRate.toFixed(0)
                    : reversedMarketRate.toFixed(8)
                : marketRate > 1
                  ? marketRate.toFixed(3)
                  : marketRate == 0
                    ? marketRate.toFixed(0)
                    : marketRate.toFixed(8)
            }
            disabled={false}
            inputProps={{ min: 0, step: 'any' }}
            type="number"
          />
        </Box>
      )}
    </>
  );
};

export default ConversionRateInfo;
