// src/layouts/TradePageContent/TradeSimpleForm/AmountInput/AmountInput.tsx
import React from 'react';
import { Box, FormControl, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import { amountInputStyles } from './styles';
import { useTranslation } from 'react-i18next';

interface AmountInputProps {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  currency: string;
  balance: number;
  error?: string | null;
  readOnly?: boolean;
  disabled?: boolean;
  listedCurrencies: { code: string; name: string; balance: number }[];
  onCurrencyChange: (code: string) => void;
}

const AmountInput: React.FC<AmountInputProps> = ({
  label,
  value,
  onChange,
  currency,
  balance,
  error,
  readOnly,
  disabled,
  listedCurrencies,
  onCurrencyChange,
}) => {
  const { t } = useTranslation(['tradePage']);

  return (
    <Box sx={amountInputStyles.container}>
      <Typography sx={amountInputStyles.label}>{label}</Typography>
      <Box sx={amountInputStyles.inputRow}>
        <FormControl sx={{ flex: 2 }}>
          <OutlinedInput
            type="number"
            value={value}
            onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            placeholder={readOnly ? '' : `max: ${balance}`}
            disabled={readOnly}
            inputProps={{ min: 0, step: 'any' }}
            error={!!error}
            sx={amountInputStyles.input}
          />
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <Select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            sx={amountInputStyles.currencySelect}
            renderValue={(selected) => {
              const selectedCurrency = listedCurrencies.find((c) => c.code === selected);
              return selectedCurrency ? selectedCurrency.code : selected;
            }}
            disabled={!!disabled ? disabled : false}
            displayEmpty
          >
            <MenuItem disabled dense sx={{ fontWeight: 600, opacity: 0.7, px: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '180px',
                  gap: 3,
                }}
              >
                <span>{t('form.currency')}</span>
                <span>{t('form.balance')}</span>
              </Box>
            </MenuItem>
            {listedCurrencies.map((c) => (
              <MenuItem key={c.code} value={c.code}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>{c.code}</span>
                  <Typography variant="caption" color="text.secondary">
                    {c.balance}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Typography
        sx={amountInputStyles.balanceInfo}
      >{`${t('form.availableBalance')}: ${balance}`}</Typography>
      {error && <Typography sx={amountInputStyles.error}>{error}</Typography>}
    </Box>
  );
};

export default AmountInput;
