// src/layouts/TradePageContent/TradeSimpleForm/AmountInput/AmountInput.tsx
import React from 'react';
import { Box, FormControl, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import { amountInputStyles } from './styles';
import { useTranslation } from 'react-i18next';
import { CurrencyResponseDto } from '../../../../api-generated/backend';

interface AmountInputProps {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  currency: CurrencyResponseDto | null;
  balance: number;
  error?: string | null;
  readOnly?: boolean;
  disabled?: boolean;
  listedCurrencies: { currency: CurrencyResponseDto; balance: number }[];
  onCurrencyChange: (currency: CurrencyResponseDto | null) => void;
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
            value={currency?.code || ''}
            onChange={(e) => {
              const selectedCode = e.target.value;
              const selectedCurrency =
                listedCurrencies.find((listed) => listed.currency.code === selectedCode)
                  ?.currency || null;
              onCurrencyChange(selectedCurrency);
            }}
            sx={amountInputStyles.currencySelect}
            renderValue={(selectedCode) => {
              const listedCurrency = listedCurrencies.find(
                (listed) => listed.currency.code === selectedCode,
              );
              return listedCurrency ? listedCurrency.currency.code : selectedCode;
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
            {listedCurrencies.map((listedCurrency) => (
              <MenuItem key={listedCurrency.currency.code} value={listedCurrency.currency.code}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>{listedCurrency.currency.code}</span>
                  <Typography variant="caption" color="text.secondary">
                    <span>{listedCurrency.balance}</span>
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
