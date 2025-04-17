export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  iconColor: string;
}

export const dummyCryptoAssets: CryptoAsset[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 1850704.6,
    priceChange: -0.48,
    iconColor: '#F7931A',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 34386.79,
    priceChange: -3.4,
    iconColor: '#627EEA',
  },
  {
    id: 'tether',
    name: 'Tether',
    symbol: 'USDT',
    price: 22.0,
    priceChange: 0.01,
    iconColor: '#26A17B',
  },
  {
    id: 'xrp',
    name: 'XRP',
    symbol: 'XRP',
    price: 46.06,
    priceChange: -1.23,
    iconColor: '#000000',
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    price: 2808.36,
    priceChange: -0.64,
    iconColor: '#14F195',
  },
  {
    id: 'usdc',
    name: 'USDC',
    symbol: 'USDC',
    price: 22.0,
    priceChange: 0.0,
    iconColor: '#2775CA',
  },
];
