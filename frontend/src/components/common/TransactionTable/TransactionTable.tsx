import React, { useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { transactionTableStyles } from './styles';
import { DefaultPageSizeOptionsEnum } from '../../../constants/configVariables.ts';
import { TransactionResponseDto } from '../../../api-generated/backend';
import { convertOffsetDateTimeToFormatedString } from '../../../services/utils/dateUtils.ts';

interface TransactionTableGridProps {
  data: TransactionResponseDto[];
  pendingOnly: boolean;
  handleCancelTransaction: (transactionId: number) => void;
}

const TransactionTable: React.FC<TransactionTableGridProps> = ({
  data,
  pendingOnly,
  handleCancelTransaction,
}) => {
  const { t } = useTranslation(['cryptocurrenciesPage', 'transactionTable']);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: DefaultPageSizeOptionsEnum._10,
    page: 0,
  });

  const columns: GridColDef[] = [
    //dont display transactionId column for pendingOnly table
    ...(!pendingOnly
      ? ([
          {
            field: 'transactionId',
            headerName: t('transactionTable:columns.transactionId'),
            flex: 1,
            minWidth: 52,
            type: 'number',
            align: 'left',
            headerAlign: 'left',
            sortable: true,
            filterable: true,
            sortComparator: (a: number, b: number) => a - b, //sortComparator pro razeni cisel
          },
        ] as GridColDef[])
      : []),

    {
      field: 'soldCurrencyCode',
      headerName: t('transactionTable:columns.soldCurrencyCode'),
      flex: 1,
      minWidth: 120,
      type: 'string',
      align: 'left',
      headerAlign: 'left',
      sortable: true,
      filterable: true,
      sortComparator: (a, b) => a.localeCompare(b),
    },

    {
      field: 'boughtCurrencyCode',
      headerName: t('transactionTable:columns.boughtCurrencyCode'),
      flex: 1,
      minWidth: 140,
      type: 'string',
      align: 'left',
      headerAlign: 'left',
      sortable: true,
      filterable: true,
      sortComparator: (a, b) => a.localeCompare(b),
    },

    {
      field: 'amountSold',
      headerName: t('transactionTable:columns.amountSold'),
      flex: 1,
      minWidth: 150,
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      sortable: true,
      filterable: true,
      sortComparator: (a: number, b: number) => a - b,
    },

    {
      field: 'amountBought',
      headerName: t('transactionTable:columns.amountBought'),
      flex: 1,
      minWidth: 150,
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      sortable: true,
      filterable: true,
      sortComparator: (a: number, b: number) => a - b,
    },

    {
      field: 'conversionRateAfterFeesDeduction',
      headerName: t('transactionTable:columns.conversionRateAfterFeesDeduction'),
      flex: 1,
      minWidth: 160,
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      sortable: true,
      filterable: true,
      sortComparator: (a: number, b: number) => a - b,
      renderCell: (params) => {
        const rate = params.row.conversionRateAfterFeesDeduction;
        const soldCurrency = params.row.soldCurrencyCode;
        const boughtCurrency = params.row.boughtCurrencyCode;
        if (rate == null || soldCurrency == null || boughtCurrency == null) return '';
        return `${rate} ${boughtCurrency}/${soldCurrency}`;
      },
    },

    {
      field: 'transactionFeeInBoughtCurrency',
      headerName: t('transactionTable:columns.transactionFeeInBoughtCurrency'),
      flex: 1,
      minWidth: 120,
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      sortable: true,
      filterable: true,
      sortComparator: (a: number, b: number) => a - b,
      renderCell: (params) => {
        const fee = params.row.transactionFeeInBoughtCurrency;
        const currency = params.row.boughtCurrencyCode;
        if (fee == null || currency == null) return '';
        return `${fee} ${currency}`;
      },
    },

    //dont display feeCategory column for pendingOnly table
    ...(!pendingOnly
      ? ([
          {
            field: 'feeCategory',
            headerName: t('transactionTable:columns.feeCategory'),
            flex: 1,
            minWidth: 130,
            type: 'string',
            align: 'left',
            headerAlign: 'left',
            sortable: true,
            filterable: true,
            sortComparator: (a, b) => a.localeCompare(b),
          },
        ] as GridColDef[])
      : []),

    {
      field: 'feeRate',
      headerName: t('transactionTable:columns.feeRate'),
      flex: 1,
      minWidth: 110,
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      sortable: true,
      filterable: true,
      sortComparator: (a: number, b: number) => a - b,
      valueFormatter: (value) => {
        return `${(value * 100).toFixed(1)}%`;
      },
    },

    //dont display transactionType column for pendingOnly table
    ...(!pendingOnly
      ? ([
          {
            field: 'transactionType',
            headerName: t('transactionTable:columns.transactionType'),
            flex: 1,
            minWidth: 130,
            type: 'string',
            align: 'left',
            headerAlign: 'left',
            sortable: true,
            filterable: true,
            sortComparator: (a, b) => a.localeCompare(b),
          },
        ] as GridColDef[])
      : []),

    {
      field: 'createdAt',
      headerName: t('transactionTable:columns.createdAt'),
      flex: 1,
      minWidth: 160,
      type: 'string',
      align: 'left',
      headerAlign: 'left',
      sortable: true,
      filterable: true,
      sortComparator: (a, b) => a.localeCompare(b),
      valueFormatter: (value) => {
        return convertOffsetDateTimeToFormatedString(value);
      },
    },

    //dont display processedAt column for pendingOnly table
    ...(!pendingOnly
      ? ([
          {
            field: 'processedAt',
            headerName: t('transactionTable:columns.processedAt'),
            flex: 1,
            minWidth: 160,
            type: 'string',
            align: 'left',
            headerAlign: 'left',
            sortable: true,
            filterable: true,
            sortComparator: (a, b) => a.localeCompare(b),
            valueFormatter: (value: string | undefined) => {
              return !!value ? convertOffsetDateTimeToFormatedString(value) : '';
            },
          },
        ] as GridColDef[])
      : []),

    //dont display cancelledAt column for pendingOnly table
    ...(!pendingOnly
      ? ([
          {
            field: 'cancelledAt',
            headerName: t('transactionTable:columns.cancelledAt'),
            flex: 1,
            minWidth: 160,
            type: 'string',
            align: 'left',
            headerAlign: 'left',
            sortable: true,
            filterable: true,
            sortComparator: (a, b) => a.localeCompare(b),
            valueFormatter: (value: string | undefined) => {
              return !!value ? convertOffsetDateTimeToFormatedString(value) : '';
            },
          },
        ] as GridColDef[])
      : []),

    //dont display note column for pendingOnly table
    ...(!pendingOnly
      ? ([
          {
            field: 'note',
            headerName: t('transactionTable:columns.note'),
            minWidth: 150,
            type: 'string',
            align: 'left',
            headerAlign: 'left',
            sortable: true,
            filterable: true,
            sortComparator: (a, b) => a.localeCompare(b),
            valueFormatter: (value: string | undefined) => {
              return !!value ? value : '';
            },
          },
        ] as GridColDef[])
      : []),

    {
      field: 'actions',
      headerName: t('cryptocurrenciesPage:table.actions'),
      flex: 1,
      minWidth: 100,
      renderCell: (params: GridRenderCellParams<any, TransactionResponseDto>) => (
        <Box sx={transactionTableStyles.actionsCell}>
          {params.row.processedAt == null && params.row.cancelledAt == null && (
            <Button
              onClick={() => handleCancelTransaction(params.row.transactionId)}
              variant="contained"
              size="small"
              sx={transactionTableStyles.tradeButton}
            >
              {t('transactionTable:common.cancelTransaction')}
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
    <Box sx={transactionTableStyles.gridContainer}>
      <DataGrid
        rows={data}
        rowHeight={30}
        columns={columns}
        columnHeaderHeight={36}
        getRowId={(row) => row.transactionId}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={Object.values(DefaultPageSizeOptionsEnum).filter(
          (value) => typeof value === 'number',
        )}
        disableRowSelectionOnClick
        disableColumnMenu
        showToolbar={!pendingOnly}
        sx={{
          ...transactionTableStyles.dataGrid,
          height: 'auto',
        }}
        localeText={{
          paginationRowsPerPage: t('table.rowsPerPage'),
        }}
        initialState={
          pendingOnly
            ? {
                sorting: {
                  sortModel: [
                    { field: 'createdAt', sort: 'desc' }, // výchozí řazení podle transactionId sestupně
                  ],
                },
              }
            : {
                sorting: {
                  sortModel: [
                    { field: 'transactionId', sort: 'desc' }, // výchozí řazení podle transactionId sestupně
                  ],
                },
              }
        }
      />
    </Box>
  );
};

export default TransactionTable;
