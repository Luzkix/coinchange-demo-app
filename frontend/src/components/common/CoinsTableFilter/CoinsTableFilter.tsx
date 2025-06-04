import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CoinsFilterTypeEnum } from '../../../constants/customEnums.ts';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { coinsTableFilterStyles } from './styles.ts';
import { useGeneralContext } from '../../../contexts/GeneralContext.tsx';

interface CoinsTableFilterProps {
  coinsFilterType: CoinsFilterTypeEnum;
  setCoinsFilterType: (type: CoinsFilterTypeEnum) => void;
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
}

const CoinsTableFilter: React.FC<CoinsTableFilterProps> = ({
  coinsFilterType,
  setCoinsFilterType,
  selectedCurrency,
  setSelectedCurrency,
}) => {
  const { t } = useTranslation(['cryptocurrenciesPage']);
  const { supportedFiatCurrencies } = useGeneralContext();

  // Constants + state for managing 'coins filter type' menu
  const [coinFilterTypeAnchorEl, setCoinFilterTypeAnchorEl] = useState<null | HTMLElement>(null);
  const handleCoinFilterTypeClick = (event: React.MouseEvent<HTMLElement>) => {
    setCoinFilterTypeAnchorEl(event.currentTarget);
  };
  const handleCoinFilterTypeClose = () => {
    setCoinFilterTypeAnchorEl(null);
  };
  const handleCoinFilterTypeSelect = (type: CoinsFilterTypeEnum) => {
    setCoinsFilterType(type);
    handleCoinFilterTypeClose();
  };

  // Constants + state for managing 'Currency' filter menu
  const [currencyAnchorEl, setCurrencyAnchorEl] = useState<null | HTMLElement>(null);
  const handleCurrencyClick = (event: React.MouseEvent<HTMLElement>) => {
    setCurrencyAnchorEl(event.currentTarget);
  };
  const handleCurrencyClose = () => {
    setCurrencyAnchorEl(null);
  };
  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
    setCurrencyAnchorEl(null);
  };

  return (
    <Box sx={coinsTableFilterStyles.filterContainer}>
      {/* Dropdown for filters */}
      <Button
        variant="outlined"
        onClick={handleCoinFilterTypeClick}
        sx={coinsTableFilterStyles.filterButton}
        endIcon={coinFilterTypeAnchorEl ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      >
        {t('tableFilter.' + coinsFilterType)}
      </Button>
      <Menu
        anchorEl={coinFilterTypeAnchorEl}
        open={Boolean(coinFilterTypeAnchorEl)}
        onClose={handleCoinFilterTypeClose}
        sx={coinsTableFilterStyles.menu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {Object.values(CoinsFilterTypeEnum).map((filterValue) => (
          <MenuItem
            key={filterValue}
            onClick={() => handleCoinFilterTypeSelect(filterValue)}
            selected={coinsFilterType === filterValue}
          >
            {t('tableFilter.' + filterValue)}
          </MenuItem>
        ))}
      </Menu>

      {/* Dropdown for currency */}
      <Button
        variant="outlined"
        onClick={handleCurrencyClick}
        sx={coinsTableFilterStyles.filterButton}
        endIcon={currencyAnchorEl ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      >
        {selectedCurrency}
      </Button>
      <Menu
        anchorEl={currencyAnchorEl}
        open={Boolean(currencyAnchorEl)}
        onClose={handleCurrencyClose}
        sx={coinsTableFilterStyles.menu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {supportedFiatCurrencies.map((supportedCurrency) => (
          <MenuItem
            key={supportedCurrency}
            onClick={() => handleCurrencySelect(supportedCurrency)}
            selected={selectedCurrency === supportedCurrency}
          >
            {supportedCurrency}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default CoinsTableFilter;
