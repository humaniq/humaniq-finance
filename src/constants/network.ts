export const BASE_URL = ""
export const COINGECKO_API_URL = "https://api.coingecko.com/api/v3"
export const API_FINANCE = "https://apifinance.humaniq.com/api/v1"

export const FINANCE_ROUTES = {
  GET_PRICES: "/prices/list"
}

export const COINGECKO_ROUTES = {
  GET_TOKEN_PRICE: '/simple/price'
}

export const rpc = {
  4: "https://rinkeby.infura.io/v3/c306191fe58d401b900a38911b8a43c9",
  97: "https://data-seed-prebsc-1-s1.binance.org:8545",
  56: "https://bsc-dataseed.binance.org"
}

export enum NATIVE_COIN {
  ETHEREUM = 'ethereum',
  BINANCECOIN = 'binancecoin'
}

export enum NATIVE_COIN_SYMBOL {
  ETH = "eth",
  BNB = "bnb"
}

export enum EVM_NETWORKS_NAMES {
  BSC = 'bsc',
  BSC_TESTNET = 'bcs testnet'
}

export enum NETWORK_TYPE {
  PRODUCTION = "production",
  TEST = "test"
}

export interface EVM_NETWORK {
  name: EVM_NETWORKS_NAMES
  chainID: number
  networkID: number,
  type: EVM_NETWORKS_NAMES,
  env: NETWORK_TYPE
  nativeCoin: NATIVE_COIN
  nativeSymbol: NATIVE_COIN_SYMBOL
  comptrollerAddress: string
  compoundLensAddress: string
}

export const EVM_NETWORKS: {[key: string]: EVM_NETWORK} = {
  [EVM_NETWORKS_NAMES.BSC]: {
    name: EVM_NETWORKS_NAMES.BSC,
    chainID: 56,
    networkID: 56,
    type: EVM_NETWORKS_NAMES.BSC,
    env: NETWORK_TYPE.PRODUCTION,
    nativeCoin: NATIVE_COIN.BINANCECOIN,
    nativeSymbol: NATIVE_COIN_SYMBOL.BNB,
    comptrollerAddress: "0x44abc8395f35b6290af32601234fe11954808011",
    compoundLensAddress: "0x3E419553fa0477e6D3B0dBB6d88d270cA29bca1e"
  },
  [EVM_NETWORKS_NAMES.BSC_TESTNET]: {
    name: EVM_NETWORKS_NAMES.BSC_TESTNET,
    chainID: 97,
    networkID: 97,
    type: EVM_NETWORKS_NAMES.BSC_TESTNET,
    env: NETWORK_TYPE.TEST,
    nativeCoin: NATIVE_COIN.BINANCECOIN,
    nativeSymbol: NATIVE_COIN_SYMBOL.BNB,
    comptrollerAddress: "0x2A776F95f6c5B9dd90c35A751ad1625540f586b0",
    compoundLensAddress: "0xf4E9f10ED605E243edD2a4207D814fEE09bA1288"
  },
}
