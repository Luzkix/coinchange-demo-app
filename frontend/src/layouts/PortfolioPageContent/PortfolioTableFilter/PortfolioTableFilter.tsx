import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGeneralContext } from '../../../contexts/GeneralContext.tsx';
import { Box, Button, Switch, Typography } from '@mui/material';
import { portfolioTableFilterStyles } from './styles.ts';
import { SxProps } from '@mui/material/styles';
import { Theme } from '@mui/system';

interface PortfolioTableFilterProps {
  nonZeroBalances: boolean;
  setNonZeroBalances: (type: boolean) => void;
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
}

const PortfolioTableFilter: React.FC<PortfolioTableFilterProps> = ({
  nonZeroBalances,
  setNonZeroBalances,
  selectedCurrency,
  setSelectedCurrency,
}) => {
  const { t } = useTranslation(['portfolioPage']);
  const { supportedFiatCurrencies } = useGeneralContext();

  return (
    <Box sx={portfolioTableFilterStyles.filterContainer}>
      <Box sx={portfolioTableFilterStyles.tabsRow}>
        {supportedFiatCurrencies.map((currency) => (
          <Button
            key={currency}
            variant={selectedCurrency === currency ? 'contained' : 'outlined'}
            onClick={() => setSelectedCurrency(currency)}
            sx={
              [
                portfolioTableFilterStyles.tabButton,
                selectedCurrency === currency && portfolioTableFilterStyles.tabButtonActive,
              ] as SxProps<Theme>
            }
          >
            {currency}
          </Button>
        ))}
      </Box>
      <Box sx={portfolioTableFilterStyles.switchRow}>
        <Switch
          checked={nonZeroBalances}
          onChange={(e) => setNonZeroBalances(e.target.checked)}
          color="primary"
        />
        <Typography variant="body2" sx={portfolioTableFilterStyles.switchLabel}>
          {t('portfolioPage.hideZeroBalances')}
        </Typography>
      </Box>
    </Box>
  );
};

export default PortfolioTableFilter;
