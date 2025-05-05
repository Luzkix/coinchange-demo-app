import React, { useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Button, Typography } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTranslation } from 'react-i18next';
import { coinsTableStyles } from './styles';
import { useGeneralContext } from '../../../contexts/GeneralContext';
import { Languages } from '../../../constants/customConstants';
import { CoinHeader } from '../CoinHeader';
import { DEFAUL_PAGE_SIZE_OPTIONS } from '../../../constants/configVariables.ts';
import { Link } from 'react-router-dom';
import ROUTES from '../../../constants/routes.ts';

export interface CoinsTableRowData {
  id: string;
  coinSymbol: string;
  coinName: string;
  price: number;
  priceChange24: number;
  volume24: number;
  isTradeable: boolean;
  isNew: boolean;
  fullCoinPairData: any;
}

interface CoinsDataGridProps {
  data: CoinsTableRowData[];
  selectedCurrency: string;
}

const CoinsTable: React.FC<CoinsDataGridProps> = ({ data, selectedCurrency }) => {
  const { t } = useTranslation(['cryptocurrenciesPage']);
  const { language } = useGeneralContext();

  const [paginationModel, setPaginationModel] = useState({
    pageSize: DEFAUL_PAGE_SIZE_OPTIONS[0],
    page: 0,
  });

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat(
      Languages[language]?.languageCountryCode || Languages.EN.languageCountryCode,
      {
        style: 'currency',
        currency: selectedCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    ).format(value);
  };

  const formatVolume = (value: number) => {
    return new Intl.NumberFormat(
      Languages[language]?.languageCountryCode || Languages.EN.languageCountryCode,
      {
        style: 'currency',
        currency: selectedCurrency,
        notation: 'compact',
        maximumFractionDigits: 2,
      },
    ).format(value);
  };

  const columns: GridColDef[] = [
    {
      field: 'coinName',
      headerName: t('table.coinName'),
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <CoinHeader
          coinSymbol={params.row.coinSymbol}
          coinName={params.row.coinName}
          size="small"
        />
      ),
      sortable: true,
      filterable: true,
      sortComparator: (a, b) => a.localeCompare(b),
    },
    {
      field: 'price',
      headerName: t('table.price'),
      minWidth: 150,
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
      field: 'priceChange24',
      headerName: t('table.priceChange24'),
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<any, CoinsTableRowData>) => {
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
      field: 'volume24',
      headerName: t('table.volume24'),
      minWidth: 150,
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
      headerName: t('table.actions'),
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<any, CoinsTableRowData>) => (
        <Box sx={coinsTableStyles.actionsCell}>
          {params.row.isTradeable && (
            <Button
              component={Link}
              to={ROUTES.SIGNIN}
              variant="contained"
              size="small"
              sx={coinsTableStyles.tradeButton}
            >
              {t('table.trade')}
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
    <Box sx={coinsTableStyles.gridContainer}>
      <DataGrid
        rows={data}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={DEFAUL_PAGE_SIZE_OPTIONS}
        disableRowSelectionOnClick
        disableColumnMenu
        sx={{
          ...coinsTableStyles.dataGrid,
          height: 'auto',
        }}
      />
    </Box>
  );
};

export default CoinsTable;
