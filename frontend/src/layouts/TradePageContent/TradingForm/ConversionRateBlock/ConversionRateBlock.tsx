import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { conversionInfoStyles } from './styles';
import { useTranslation } from 'react-i18next';
import { CurrencyResponseDto } from '../../../../api-generated/backend';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { amountInputStyles } from '../AmountInput/styles.ts';
import CustomTextField from '../../../../components/common/CustomTextField/CustomTextField.tsx';
import { NUMBER_BIGGER_THEN_ZERO_REGEX } from '../../../../constants/customConstants.ts';
import { CustomCircularProgress } from '../../../../components/common/CustomCircularProgress/CustomCircularProgress.tsx';

interface ConversionRateBlockProps {
  isSimpleTrading: boolean;
  soldCurrency: CurrencyResponseDto | null;
  boughtCurrency: CurrencyResponseDto | null;
  rate: number;
  marketRate: number;
  remainingTimeInPercent: number | undefined;
  isError: boolean;
  onUserRateChange?: (val: string) => void;
  isUserRateError?: boolean | undefined;
}

const ConversionRateBlock: React.FC<ConversionRateBlockProps> = ({
  isSimpleTrading,
  soldCurrency,
  boughtCurrency,
  rate,
  marketRate,
  remainingTimeInPercent,
  isError,
  onUserRateChange,
  isUserRateError,
}) => {
  const { t } = useTranslation('tradePage');

  const [isReversedRate, setIsReversedRate] = useState(true);

  const reversedRate = rate ? 1 / rate : 0;
  const reversedMarketRate = marketRate ? 1 / marketRate : 0;
  const displayedCurrenciesReversed =
    soldCurrency && boughtCurrency ? soldCurrency?.code + '/' + boughtCurrency?.code : '';
  const displayedCurrenciesOriginal =
    soldCurrency && boughtCurrency ? boughtCurrency?.code + '/' + soldCurrency?.code : '';

  const [userRate, setUserRate] = useState('');
  const handleUserRateChange = (userRate: string) => {
    setUserRate(userRate);

    //always converting to standardRate before sending into onUserRateChange function
    onUserRateChange && onUserRateChange(convertToOriginalRateFormat(userRate));
  };

  const convertToOriginalRateFormat = (userRate: string) => {
    if (userRate == '' || userRate == '0') return userRate;

    if (isReversedRate) {
      return (1 / Number(userRate)).toString();
    } else return userRate;
  };

  const handleSwapRateFormat = () => {
    if (isReversedRate) {
      setIsReversedRate(false);
    } else setIsReversedRate(true);

    //  in advancedTrading set userRate to '' when swapping rates
    if (!isSimpleTrading) {
      handleUserRateChange('');
    }
  };

  useEffect(() => {
    if (userRate != '') handleUserRateChange('');
  }, [boughtCurrency, soldCurrency]);

  const displayConversionRateSimpleTrading = (): string => {
    if (isReversedRate) {
      return reversedRate > 1
        ? reversedRate.toFixed(3)
        : reversedRate == 0
          ? reversedRate.toFixed(0)
          : reversedRate.toFixed(8);
    } else {
      return rate > 1 ? rate.toFixed(3) : rate == 0 ? rate.toFixed(0) : rate.toFixed(8);
    }
  };

  const displayConversionRateAdvancedTrading = (): string => {
    if (isReversedRate) {
      return reversedMarketRate > 1
        ? reversedMarketRate.toFixed(3)
        : reversedMarketRate == 0
          ? reversedMarketRate.toFixed(0)
          : reversedMarketRate.toFixed(8);
    } else {
      return marketRate > 1
        ? marketRate.toFixed(3)
        : marketRate == 0
          ? marketRate.toFixed(0)
          : marketRate.toFixed(8);
    }
  };

  const onMarketRateClick = () => {
    // Advanced trading: When user clicks on displayed market rate
    // current value will be entered into the field where user defines the required exchange rate (in same format as displayed on the screen)
    handleUserRateChange(displayConversionRateAdvancedTrading());
  };

  return (
    <>
      <Box sx={conversionInfoStyles.container}>
        {isError ? (
          <Typography color="error">{t('form.rateError')}</Typography>
        ) : (
          <Box sx={conversionInfoStyles.container}>
            <Typography sx={{ textAlign: 'center' }}>
              {isSimpleTrading ? t('form.bookedRate') : t('form.marketRate')}{' '}
            </Typography>
            <IconButton onClick={handleSwapRateFormat} sx={conversionInfoStyles.iconSwitchRates}>
              <SwapHorizIcon />
            </IconButton>
            {isSimpleTrading && (
              <Box sx={{ textAlign: 'center' }}>
                <b>
                  {displayConversionRateSimpleTrading() + ' '}
                  {isReversedRate && displayedCurrenciesReversed}
                  {!isReversedRate && displayedCurrenciesOriginal}
                </b>
              </Box>
            )}
            {!isSimpleTrading && (
              <Button
                variant="text"
                disableRipple
                onClick={onMarketRateClick}
                onMouseOver={(e) => (e.currentTarget.style.background = '#e3f2fd')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                //disabled={marketRate == 0}
                sx={conversionInfoStyles.marketRateButton}
              >
                <b>
                  {displayConversionRateAdvancedTrading() + ' '}
                  {isReversedRate && displayedCurrenciesReversed}
                  {!isReversedRate && displayedCurrenciesOriginal}
                </b>
              </Button>
            )}

            {isSimpleTrading && <CustomCircularProgress percentLeft={remainingTimeInPercent} />}
          </Box>
        )}
      </Box>

      {/*For Advanced Trading display field to enter custom conversion rate*/}
      {!isSimpleTrading && (
        <Box sx={conversionInfoStyles.container}>
          <Typography sx={{ ...amountInputStyles.label, mb: '2' }}>
            {t('form.requestedRate')}
          </Typography>
          <CustomTextField
            value={userRate}
            onChange={(e) => handleUserRateChange(e.target.value)}
            required={true}
            type="number"
            fullWidth={false}
            placeholder={displayConversionRateAdvancedTrading()}
            isExternalError={isUserRateError}
            customRegex={NUMBER_BIGGER_THEN_ZERO_REGEX}
            validateErrorMessage={t('errors:message.zeroOrNegativeNumberError')}
          />
        </Box>
      )}
    </>
  );
};

export default ConversionRateBlock;
