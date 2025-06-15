import React from 'react';
import { Box, Button, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import { amountInputStyles } from './styles';
import { useTranslation } from 'react-i18next';
import { CurrencyResponseDto } from '../../../../api-generated/backend';
import CoinHeader from '../../../../components/common/CoinHeader/CoinHeader.tsx';

interface AmountInputProps {
  isSoldAmount: boolean;
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
  onBalanceClick?: () => void;
}

const AmountInput: React.FC<AmountInputProps> = ({
  isSoldAmount,
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
  onBalanceClick,
}) => {
  const { t } = useTranslation(['tradePage']);

  return (
    <Box sx={amountInputStyles.container}>
      <Typography sx={amountInputStyles.label}>{label}</Typography>
      <Box sx={amountInputStyles.inputRow}>
        <OutlinedInput
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          placeholder={readOnly ? '' : `max: ${balance}`}
          disabled={readOnly || currency == null}
          inputProps={{ min: 0, step: 'any' }}
          error={!!error}
          sx={
            !isSoldAmount && Number(value) > 0
              ? amountInputStyles.highlightedOutput
              : amountInputStyles.input
          }
        />
        <Select
          value={currency?.code || ''}
          onChange={(e) => {
            const selectedCode = e.target.value;
            const selectedCurrency =
              listedCurrencies.find((listed) => listed.currency.code === selectedCode)?.currency ||
              null;
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
          <MenuItem disabled dense sx={amountInputStyles.currencySelectFirstRowMenuItem}>
            <Box sx={amountInputStyles.currencySelectRowMenuItemBox}>
              <span>{t('form.currency')}</span>
              <span>{t('form.balance')}</span>
            </Box>
          </MenuItem>
          {listedCurrencies.map((listedCurrency) => (
            <MenuItem key={listedCurrency.currency.code} value={listedCurrency.currency.code}>
              <Box sx={amountInputStyles.currencySelectRowMenuItemBox}>
                <CoinHeader
                  coinName={listedCurrency.currency.name}
                  coinSymbol={listedCurrency.currency.code}
                  size={'small'}
                />
                <Typography variant="caption" color="text.secondary">
                  <span>{listedCurrency.balance}</span>
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box sx={amountInputStyles.balanceInfoWrapper}>
        <Button
          variant="text"
          disableRipple
          onClick={onBalanceClick}
          onMouseOver={(e) => (e.currentTarget.style.background = '#e3f2fd')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
          disabled={!isSoldAmount || currency == null}
          sx={amountInputStyles.balanceButton}
        >
          {`${t('form.availableBalance')}: ${balance}`}
        </Button>
      </Box>
      {error && <Typography sx={amountInputStyles.error}>{error}</Typography>}
    </Box>
  );
};

export default AmountInput;
