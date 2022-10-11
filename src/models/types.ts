export type BorrowSupplyItem = {
  cToken: any;
  exchangeRateCurrent: any;
  supplyRatePerBlock: any;
  borrowRatePerBlock: any;
  reserveFactorMantissa: any;
  totalBorrows: any;
  totalReserves: any;
  totalSupply: any;
  totalCash: any;
  isListed: any;
  collateralFactorMantissa: any;
  underlyingAssetAddress: any;
  cTokenDecimals: any;
  underlyingDecimals: any;
  token: any;
  symbol: any;
  name: any;
  cName: any;
  exchangeRateStored: any;
  liquidity: any;
  isEnteredTheMarket: any;
  supplyAllowed: any;
  borrowAllowed: any;
  underlyingPrice: any;
  tokenBalance: any;
  tokenAllowance: any;
  borrowBalance: any;
  supplyBalance: any;
  balanceOf: any;
  earnedUsd: any;
  earnedUnderlying: any;
  balance: any;
  supply: any;
  borrow: any;
  supplyApy: any;
  borrowApy: any;
  tokenUsdValue: any;
  fiatBalance: any;
  fiatSupply: any;
  fiatBorrow: any;
  supplyDistributionApy: any;
  borrowDistributionApy: any;
};

export type CoinGeckoCostResponse = {
  [k: string]: any
}

export type FinanceCostResponse = {
  status: string
  payload: any
}

export type FinanceCurrency = {
  currency: string
  price: number
  source: string
  time: string
}
