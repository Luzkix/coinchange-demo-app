// src/layouts/TradePageContent/TradePageContent.tsx
import React, { useState } from 'react';
import { Box, FormControlLabel, Switch, Theme, Typography } from '@mui/material';
import { tradePageContentStyles } from './styles';
import TradingForm from './TradingForm/TradingForm.tsx';
import { useTranslation } from 'react-i18next';
import { SxProps } from '@mui/material/styles';

const TradePageContent: React.FC = () => {
  const { t } = useTranslation(['tradePage']);
  const [isSimpleTrading, setIsSimpleTrading] = useState(true);

  return (
    <Box sx={tradePageContentStyles.container}>
      <Typography variant="h4" sx={tradePageContentStyles.title}>
        {isSimpleTrading
          ? t('switcher.simple') + ' / ' + t('switcher.exchange')
          : t('switcher.advanced') + ' / ' + t('switcher.exchange')}
      </Typography>
      <Box sx={tradePageContentStyles.switchRow}>
        <Typography sx={(isSimpleTrading && { color: 'silver' }) as SxProps<Theme>} color="primary">
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

      <TradingForm isSimpleTrading={isSimpleTrading} />
    </Box>
  );
};

export default TradePageContent;
