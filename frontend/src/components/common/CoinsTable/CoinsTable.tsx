import React, { useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Button, Typography } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTranslation } from 'react-i18next';
import { coinsDataGridStyles } from './styles';
import { useGeneralContext } from '../../../contexts/GeneralContext';
import { Languages } from '../../../constants/customConstants';
import { CoinHeader } from '../CoinHeader';
import { CoinsFilterType } from '../../../constants/customEnums.ts';
import CoinsTableFilter from './CoinsTableFilter';

export interface CoinRowData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange: number;
  volume: number;
  isTradeable: boolean;
  isNew: boolean;
  fullData: any;
}

interface CoinsDataGridProps {
  data: CoinRowData[];
  isLoading: boolean;
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
}

const CoinsTable: React.FC<CoinsDataGridProps> = ({
  data,
  isLoading,
  selectedCurrency,
  setSelectedCurrency,
}) => {
  const { t } = useTranslation('cryptocurrenciesPage');
  const { language } = useGeneralContext();

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const [coinsFilterType, setCoinsFilterType] = useState(CoinsFilterType.ALL);

  const filteredData = React.useMemo(() => {
    switch (coinsFilterType) {
      case CoinsFilterType.TRADEABLE:
        return data.filter((coin) => coin.isTradeable);
      case CoinsFilterType.NEW:
        return data.filter((coin) => coin.isNew);
      case CoinsFilterType.GAINERS:
        return [...data].sort((a, b) => b.priceChange - a.priceChange);
      case CoinsFilterType.LOSERS:
        return [...data].sort((a, b) => a.priceChange - b.priceChange);
      default:
        return data;
    }
  }, [data, coinsFilterType]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat(Languages[language]?.languageCountryCode || 'en-US', {
      style: 'currency',
      currency: selectedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatVolume = (value: number) => {
    return new Intl.NumberFormat(Languages[language]?.languageCountryCode || 'en-US', {
      style: 'currency',
      currency: selectedCurrency,
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(value);
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('asset', 'Asset'),
      flex: 1,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => (
        <CoinHeader coinSymbol={params.row.symbol} coinName={params.row.name} size="small" />
      ),
      sortable: true,
      filterable: true,
      sortComparator: (a, b) => a.localeCompare(b),
    },
    {
      field: 'price',
      headerName: t('price', 'Price'),
      width: 130,
      valueFormatter: (value) => {
        if (typeof value === 'number') {
          return formatPrice(value);
        }
        return formatPrice(0);
      },
      type: 'number',
      align: 'right',
      headerAlign: 'right',
    },
    {
      field: 'priceChange',
      headerName: t('change', 'Change'),
      width: 130,
      renderCell: (params: GridRenderCellParams<any, CoinRowData>) => {
        const value = typeof params.value === 'number' ? params.value : 0;
        const isPositive = value > 0;
        const isNegative = value < 0;
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              color: isPositive ? 'success.main' : isNegative ? 'error.main' : 'text.secondary',
            }}
          >
            {isPositive && <ArrowDropUpIcon />}
            {isNegative && <ArrowDropDownIcon />}
            <Typography variant="body2">{Math.abs(value).toFixed(2)}%</Typography>
          </Box>
        );
      },
      type: 'number',
      align: 'right',
      headerAlign: 'right',
    },
    {
      field: 'volume',
      headerName: t('volume', 'Volume'),
      width: 140,
      valueFormatter: (value) => {
        if (typeof value === 'number') {
          return formatVolume(value);
        }
        return formatVolume(0);
      },
      type: 'number',
      align: 'right',
      headerAlign: 'right',
    },
    {
      field: 'actions',
      headerName: t('actions', 'Actions'),
      width: 150,
      renderCell: (params: GridRenderCellParams<any, CoinRowData>) => (
        <Box sx={coinsDataGridStyles.actionsCell}>
          {params.row.isTradeable && (
            <Button variant="contained" size="small" sx={coinsDataGridStyles.tradeButton}>
              {t('trade', 'Trade')}
            </Button>
          )}
        </Box>
      ),
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
    },
  ];

  return (
    <Box sx={coinsDataGridStyles.gridContainer}>
      <CoinsTableFilter
        coinsFilterType={coinsFilterType}
        setCoinsFilterType={setCoinsFilterType}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
      />
      <DataGrid
        rows={filteredData}
        columns={columns}
        loading={isLoading}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 30, 50]}
        disableRowSelectionOnClick
        disableColumnMenu
        sx={{
          ...coinsDataGridStyles.dataGrid,
          height: 'auto',
        }}
      />
    </Box>
  );
};

export default CoinsTable;
