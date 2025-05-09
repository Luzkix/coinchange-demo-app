import { OpenAPI as CoinbaseOpenAPI } from '../src/api-generated/coinbase/core/OpenAPI';
import { OpenAPI as CoinbaseExchangeOpenAPI } from '../src/api-generated/coinbase-exchange/core/OpenAPI';
import { OpenAPI as BackendOpenAPI } from '../src/api-generated/backend/core/OpenAPI';

/**
 * Dealing with CORS error (i.e. my app running on localhost is directly calling external api which leads to no 'Access-Control-Allow-Origin' header error
 * Solution: running proxy server which is calling Coinbase api - therefore BASE redirections needs to be setup.
 * Sets the base URLs for all API calls to use the proxy server
 * Should be called once at application startup
 * @param useProxy Whether to use the proxy server or direct API calls
 */
export function setApiBaseToProxyUrl(useProxy: boolean = true): void {
  if (useProxy) {
    // Using proxy server
    CoinbaseOpenAPI.BASE = 'http://localhost:5000/api-coinbase';
    CoinbaseExchangeOpenAPI.BASE = 'http://localhost:5000/api-coinbase-exchange';
    BackendOpenAPI.BASE = 'http://localhost:5000/api-backend';
  } else {
    // Direct calls (will be blocked by CORS, just for info)
    CoinbaseOpenAPI.BASE = 'https://api.coinbase.com';
    CoinbaseExchangeOpenAPI.BASE = 'https://api.exchange.coinbase.com';
    BackendOpenAPI.BASE = 'http://localhost:5000/api-backend';
  }
}
