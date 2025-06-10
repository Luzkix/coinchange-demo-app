// src/layouts/TradePageContent/TradePageContent.tsx
import React, { useState } from 'react';
import { Box, FormControlLabel, Switch, Theme, Typography } from '@mui/material';
import { tradePageContentStyles } from './styles';
import TradeSimpleForm from './TradeSimpleForm/TradeSimpleForm';
import { useTranslation } from 'react-i18next';
import { SxProps } from '@mui/material/styles';

const TradePageContent: React.FC = () => {
  const { t } = useTranslation(['tradePage']);
  const [isSimple, setIsSimple] = useState(true);

  return (
    <Box sx={tradePageContentStyles.container}>
      <Typography variant="h4" sx={tradePageContentStyles.title}>
        {isSimple
          ? t('switcher.simple') + ' / ' + t('switcher.exchange')
          : t('switcher.advanced') + ' / ' + t('switcher.exchange')}
      </Typography>
      <Box sx={tradePageContentStyles.switchRow}>
        <Typography sx={(isSimple && { color: 'silver' }) as SxProps<Theme>} color="primary">
          {t('switcher.advanced')}
        </Typography>
        <FormControlLabel
          sx={{ m: 0 }}
          label={''}
          control={
            <Switch
              checked={isSimple}
              onChange={(_, checked) => setIsSimple(checked)}
              color="primary"
            />
          }
        />
        <Typography sx={(!isSimple && { color: 'silver' }) as SxProps<Theme>} color="primary">
          {t('switcher.simple')}
        </Typography>
      </Box>

      {/* Display relevant form based on the switch */}
      {isSimple ? <TradeSimpleForm /> : <TradeSimpleForm />}
    </Box>
  );
};

export default TradePageContent;
