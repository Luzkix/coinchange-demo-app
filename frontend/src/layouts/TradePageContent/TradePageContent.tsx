// src/layouts/TradePageContent/TradePageContent.tsx
import React, { Suspense, useState } from 'react';
import { Box, CircularProgress, FormControlLabel, Switch, Theme, Typography } from '@mui/material';
import { tradePageContentStyles } from './styles';
import TradingForm from './TradingForm/TradingForm.tsx';
import { useTranslation } from 'react-i18next';
import { SxProps } from '@mui/material/styles';
import { useSearchParams } from 'react-router-dom';
import {
  SEARCHPARAM_BOUGHT_CURRENCY,
  SEARCHPARAM_SOLD_CURRENCY,
} from '../../constants/customConstants.ts';
import ContentBoxLarge from '../../components/ui/ContentBoxLarge/ContentBoxLarge.tsx';
import CryptocurrenciesTableContent from '../CryptocurrenciesPageContent/CryptocurrenciesTableContent/CryptocurrenciesTableContent.tsx';

const TradePageContent: React.FC = () => {
  const { t } = useTranslation(['tradePage']);
  const [isSimpleTrading, setIsSimpleTrading] = useState(true);

  // reading out query parameters from hyperlink
  const [searchParams] = useSearchParams();
  const soldCurrencyCode = searchParams.get(SEARCHPARAM_SOLD_CURRENCY);
  const boughtCurrencyCode = searchParams.get(SEARCHPARAM_BOUGHT_CURRENCY);

  return (
    <ContentBoxLarge>
      <Box sx={tradePageContentStyles.container}>
        <Box sx={tradePageContentStyles.sideColumn}>
          <Box sx={tradePageContentStyles.form}>
            <Typography variant="h4" sx={tradePageContentStyles.formTitle}>
              {isSimpleTrading
                ? t('switcher.simple') + ' / ' + t('switcher.exchange')
                : t('switcher.advanced') + ' / ' + t('switcher.exchange')}
            </Typography>
            <Box sx={tradePageContentStyles.switchRow}>
              <Typography
                sx={(isSimpleTrading && { color: 'silver' }) as SxProps<Theme>}
                color="primary"
              >
                {t('switcher.advanced')}
              </Typography>
              <FormControlLabel
                sx={{ m: 0 }}
                label={''}
                control={
                  <Switch
                    checked={isSimpleTrading}
                    onChange={(_, checked) => setIsSimpleTrading(checked)}
                    color="primary"
                  />
                }
              />
              <Typography
                sx={(!isSimpleTrading && { color: 'silver' }) as SxProps<Theme>}
                color="primary"
              >
                {t('switcher.simple')}
              </Typography>
            </Box>

            <TradingForm
              isSimpleTrading={isSimpleTrading}
              initialSoldCurrencyCode={soldCurrencyCode}
              initialBoughtCurrencyCode={boughtCurrencyCode}
            />
          </Box>
        </Box>

        <Box sx={tradePageContentStyles.mainColumn}>
          <Suspense fallback={<CircularProgress />}>
            <CryptocurrenciesTableContent />
          </Suspense>
        </Box>
      </Box>
    </ContentBoxLarge>
  );
};

export default TradePageContent;
