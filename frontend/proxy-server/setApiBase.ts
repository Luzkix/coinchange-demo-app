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
    // Using proxy server which runs on port 5000. Used automatically by vite for "dev" script
    BackendOpenAPI.BASE = 'http://localhost:5000';
  } else {
    // Direct calls without proxy to be used for building docker image. Used automatically by vite for "build" script
    BackendOpenAPI.BASE = '';
  }
}
