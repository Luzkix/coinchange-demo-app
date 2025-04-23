import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { CoinsDataService, CoinsMap } from '../services/dataServices/CoinsDataService';
import { DEFAULT_COINS_REFRESH_INTERVAL } from '../constants/configVariables.ts';

interface CoinsDataContextType {
  coinsData: CoinsMap;
  isLoading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
}

// Create context with default values
const CoinsDataContext = createContext<CoinsDataContextType>({
  coinsData: new Map(),
  isLoading: false,
  error: null,
  lastUpdated: null,
});

// Hook to use coins data context
export const useCoinsDataContext = () => useContext(CoinsDataContext);

interface CoinsDataContextProviderProps {
  children: ReactNode;
  refreshInterval?: number; // in milliseconds
}

/**
 * Provider component that fetches and manages coins data
 * Updates coins data at specified interval
 */
export const CoinsDataContextProvider: React.FC<CoinsDataContextProviderProps> = ({
  children,
  refreshInterval = DEFAULT_COINS_REFRESH_INTERVAL, // 10 seconds by default
}) => {
  const [coinsData, setCoinsData] = useState<CoinsMap>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Initial fetch
  useEffect(() => {
    updateCoinsData();
  }, []);

  // Function to fetch and update data
  const updateCoinsData = async () => {
    try {
      setIsLoading(true);
      const data = await CoinsDataService.fetchCoinsData();
      setCoinsData(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching coins data'));
      console.error('Failed to fetch coins data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Set up interval for periodic updates
  useEffect(() => {
    const intervalId = setInterval(updateCoinsData, refreshInterval);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  const value = {
    coinsData,
    isLoading,
    error,
    lastUpdated,
  };

  return <CoinsDataContext.Provider value={value}>{children}</CoinsDataContext.Provider>;
};
