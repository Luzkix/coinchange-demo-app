import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTranslation } from 'react-i18next';
import { coinsDataGridStyles } from './styles';
import { useGeneralContext } from '../../../contexts/GeneralContext';
import { Languages } from '../../../constants/customConstants';
import { CoinHeader } from '../CoinHeader';
import { SUPPORTED_CURRENCIES } from '../../../constants/configVariables.ts';

export enum FilterType {
  ALL = 'all',
  TRADABLE = 'tradable',
  NEW = 'new',
  GAINERS = 'gainers',
  LOSERS = 'losers',
}

interface CustomToolbarProps {
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  currency: string;
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
}

const filterOptions = [
  { label: 'All assets', value: FilterType.ALL },
  { label: 'Tradable', value: FilterType.TRADABLE },
  { label: 'New', value: FilterType.NEW },
  { label: 'Gainers', value: FilterType.GAINERS },
  { label: 'Losers', value: FilterType.LOSERS },
];

const CustomToolbar: React.FC<CustomToolbarProps> = ({
  filterType,
  setFilterType,
  currency,
  selectedCurrency,
  setSelectedCurrency,
}) => {
  const { t } = useTranslation('cryptocurrenciesPage');

  // Stav pro menu filtrů
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);

  // Stav pro menu měny
  const [currencyAnchorEl, setCurrencyAnchorEl] = useState<null | HTMLElement>(null);

  // Otevření menu filtrů
  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  // Zavření menu filtrů
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  // Výběr filtru
  const handleFilterSelect = (value: FilterType) => {
    setFilterType(value);
    handleFilterClose();
  };

  // Otevření menu měny
  const handleCurrencyClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCurrencyAnchorEl(event.currentTarget);
  };

  // Zavření menu měny
  const handleCurrencyClose = () => {
    setCurrencyAnchorEl(null);
  };

  // Label aktuálního filtru podle hodnoty
  const currentFilterLabel =
    filterOptions.find((opt) => opt.value === filterType)?.label || 'All assets';

  // Handler pro výběr měny
  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
    setCurrencyAnchorEl(null);
  };

  return (
    <Box sx={coinsDataGridStyles.toolbar}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {/* Filtry */}
        <Button
          variant="outlined"
          onClick={handleFilterClick}
          sx={coinsDataGridStyles.filterButton}
          endIcon={filterAnchorEl ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        >
          {t(currentFilterLabel.toLowerCase().replace(' ', ''), currentFilterLabel)}
        </Button>
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          {filterOptions.map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => handleFilterSelect(option.value)}
              selected={filterType === option.value}
            >
              {t(option.label.toLowerCase().replace(' ', ''), option.label)}
            </MenuItem>
          ))}
        </Menu>

        {/* Měna */}
        <Button
          variant="outlined"
          onClick={handleCurrencyClick}
          sx={coinsDataGridStyles.filterButton}
          endIcon={filterAnchorEl ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        >
          {selectedCurrency}
        </Button>
        <Menu
          anchorEl={currencyAnchorEl}
          open={Boolean(currencyAnchorEl)}
          onClose={handleCurrencyClose}
        >
          {SUPPORTED_CURRENCIES.map((curr) => (
            <MenuItem
              key={curr}
              onClick={() => handleCurrencySelect(curr)}
              selected={selectedCurrency === curr}
            >
              {curr}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
};

export interface CoinRowData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange: number;
  volume: number;
  isTradable: boolean;
  isNew: boolean;
  fullData: any;
}

interface CoinsDataGridProps {
  data: CoinRowData[];
  isLoading: boolean;
  currency: string;
}

const CoinsDataGrid: React.FC<CoinsDataGridProps> = ({ data, isLoading, currency }) => {
  const { t } = useTranslation('cryptocurrenciesPage');
  const { language } = useGeneralContext();

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const [selectedCurrency, setSelectedCurrency] = useState(currency);

  // Synchronizace s nadřazenou měnou při změně jazyka
  useEffect(() => {
    setSelectedCurrency(currency);
  }, [currency]);

  const [filterType, setFilterType] = useState(FilterType.ALL);

  const filteredData = React.useMemo(() => {
    switch (filterType) {
      case FilterType.TRADABLE:
        return data.filter((coin) => coin.isTradable);
      case FilterType.NEW:
        return data.filter((coin) => coin.isNew);
      case FilterType.GAINERS:
        return [...data].sort((a, b) => b.priceChange - a.priceChange);
      case FilterType.LOSERS:
        return [...data].sort((a, b) => a.priceChange - b.priceChange);
      default:
        return data;
    }
  }, [data, filterType]);

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
          {params.row.isTradable && (
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
      <CustomToolbar
        filterType={filterType}
        setFilterType={setFilterType}
        currency={currency}
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

export default CoinsDataGrid;
