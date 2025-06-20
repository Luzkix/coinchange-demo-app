import React, { useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Button, Typography } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTranslation } from 'react-i18next';
import { coinsTableStyles } from './styles';
import {
  Languages,
  SEARCHPARAM_BOUGHT_CURRENCY,
  SEARCHPARAM_SOLD_CURRENCY,
} from '../../../constants/customConstants';
import { DEFAUL_PAGE_SIZE_OPTIONS } from '../../../constants/configVariables.ts';
import { Link } from 'react-router-dom';
import CoinHeader from '../CoinHeader/CoinHeader.tsx';
import cssStyles from './CoinsTable.module.css';

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
  userBalance?: number; //field to be conditionally displayed only in PortfolioPage table
}

interface CoinsDataGridProps {
  data: CoinsTableRowData[];
  selectedCurrency: string;
}

const CoinsTable: React.FC<CoinsDataGridProps> = ({ data, selectedCurrency }) => {
  const { t, i18n } = useTranslation(['cryptocurrenciesPage']);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: DEFAUL_PAGE_SIZE_OPTIONS[0],
    page: 0,
  });

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat(
      Languages[i18n.language]?.languageCountryCode || Languages.EN.languageCountryCode,
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
      Languages[i18n.language]?.languageCountryCode || Languages.EN.languageCountryCode,
      {
        style: 'currency',
        currency: selectedCurrency,
        notation: 'compact',
        maximumFractionDigits: 2,
      },
    ).format(value);
  };

  const tableHasUserBalanceColumn = data.some(
    (row) => row.userBalance !== undefined && row.userBalance !== null,
  );

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

    //display userBalance column only if userBalance is not null or undefined
    ...(tableHasUserBalanceColumn
      ? ([
          {
            field: 'userBalance',
            headerName: t('table.userBalance'),
            minWidth: 150,
            type: 'number',
            align: 'right',
            headerAlign: 'right',
            cellClassName: (params) => (params.value > 0 ? cssStyles.userBalanceCell : ''),
          },
        ] as GridColDef[])
      : []),

    {
      field: 'price',
      headerName: tableHasUserBalanceColumn ? t('table.valueInCurrency') : t('table.price'),
      minWidth: 150,
      valueFormatter: (value) => formatPrice(value == null ? 0 : value),
      type: 'number',
      align: 'right',
      headerAlign: 'right',
      cellClassName: (params) =>
        tableHasUserBalanceColumn && params.value > 0 ? cssStyles.userBalanceCell : '',
    },

    //dont display priceChange24 and volume24 on portfolio page which is displaying userBalance instead
    ...(!tableHasUserBalanceColumn
      ? ([
          {
            field: 'priceChange24',
            headerName: t('table.priceChange24'),
            minWidth: 150,
            renderCell: (params: GridRenderCellParams<CoinsTableRowData>) => {
              const value: number = params.row.priceChange24 ?? 0;
              const isPositive = value > 0;
              const isNegative = value < 0;
              return (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    color: isPositive
                      ? 'success.main'
                      : isNegative
                        ? 'error.main'
                        : 'text.secondary',
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
            valueFormatter: (value) => formatVolume(value == null ? 0 : value),
            type: 'number',
            align: 'right',
            headerAlign: 'right',
          },
        ] as GridColDef[])
      : []),
    {
      field: 'actions',
      headerName: t('table.actions'),
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<any, CoinsTableRowData>) => (
        <Box sx={coinsTableStyles.actionsCell}>
          {params.row.isTradeable && (
            <Button
              component={Link}
              to={`/trade?${SEARCHPARAM_SOLD_CURRENCY}=${selectedCurrency}&${SEARCHPARAM_BOUGHT_CURRENCY}=${params.row.coinSymbol}`}
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
        localeText={{
          paginationRowsPerPage: t('table.rowsPerPage'),
        }}
      />
    </Box>
  );
};

export default CoinsTable;
