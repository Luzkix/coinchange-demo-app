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
import { DefaultPageSizeOptionsEnum } from '../../../constants/configVariables.ts';
import { Link } from 'react-router-dom';
import CoinHeader from '../CoinHeader/CoinHeader.tsx';
import cssStyles from './CoinsTable.module.css';
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
  userBalance?: number; //field to be conditionally displayed only in PortfolioPage table
}

interface CoinsDataGridProps {
  data: CoinsTableRowData[];
  selectedCurrency: string;
  isPortfolioPage?: boolean;
}

const CoinsTable: React.FC<CoinsDataGridProps> = ({ data, selectedCurrency, isPortfolioPage }) => {
  const { t, i18n } = useTranslation(['cryptocurrenciesPage']);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: DefaultPageSizeOptionsEnum._10,
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
      renderCell: (params: GridRenderCellParams<any, CoinsTableRowData>) => {
        // POUZE PRO PORTFOLIOPAGE
        // najdi řádek s měnou která je rovna 'selectedCurrency' a jehož userBalance > 0.
        // action button na nákup chceme zobrazit pouze pokud má uživatel u vybrané selected currency (což bude soldCurrency) zůstatek > 0
        const balanceRow = params.api
          .getAllRowIds() // 1. Získej všechny ID řádků
          .map((id) => params.api.getRow(id)) // 2. Načti data každého řádku
          .find(
            (row: CoinsTableRowData | null) =>
              row != null &&
              row.coinSymbol === selectedCurrency && // 3. Vyber řádek se stejným symbolem měny
              (row.userBalance ?? 0) > 0, // 4. Ujisti se, že userBalance > 0
          );

        debugger;
        const canTrade = isPortfolioPage
          ? params.row.isTradeable && balanceRow != null
          : params.row.isTradeable;

        return (
          <Box sx={coinsTableStyles.actionsCell}>
            {canTrade && (
              <Button
                component={Link}
                to={`${ROUTES.TRADE}?${SEARCHPARAM_SOLD_CURRENCY}=${selectedCurrency}&${SEARCHPARAM_BOUGHT_CURRENCY}=${params.row.coinSymbol}`}
                variant="contained"
                size="small"
                sx={coinsTableStyles.tradeButton}
              >
                {t('table.trade')}
              </Button>
            )}
          </Box>
        );
      },
      sortable: true,
      // Chci řadit podle jiného sloupce -> klíčové je použít 3. a 4. argument (cellParams1, cellParams2)
      sortComparator: (_v1, _v2, cellParams1, cellParams2) => {
        const row1 = cellParams1.api.getRow(cellParams1.id);
        const row2 = cellParams2.api.getRow(cellParams2.id);
        const a = row1?.isTradeable ? 1 : 0;
        const b = row2?.isTradeable ? 1 : 0;
        return b - a; // true bude nahoře
      },
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
        getRowId={(row) => row.id}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={Object.values(DefaultPageSizeOptionsEnum).filter(
          (value) => typeof value === 'number',
        )}
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
