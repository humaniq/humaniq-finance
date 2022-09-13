export const BASE_URL = ""
export const API_FINANCE = "https://apifinance.humaniq.com/api/v1"

export const FINANCE_ROUTES = {
  GET_PRICES: "/prices/list"
}

export const rpc = {
  97: "https://data-seed-prebsc-1-s1.binance.org:8545",
  56: "https://rpc.ankr.com/bsc"
}

export enum NATIVE_COIN {
  ETHEREUM = 'ethereum',
  BINANCECOIN = 'binancecoin'
}

export enum SCAN_URL {
  BSC = 'https://bscscan.com/tx/',
  BSC_TESTNET = 'https://testnet.bscscan.com/tx/'
}

export enum NATIVE_COIN_SYMBOL {
  ETH = "eth",
  BNB = "bnb"
}

export enum EVM_NETWORKS_NAMES {
  BSC = 'bsc',
  BSC_TESTNET = 'bsc_Testnet',
  DEFAULT = 'bsc'
}

export enum NETWORK_TYPE {
  PRODUCTION = "production",
  TEST = "test"
}

export interface EVM_NETWORK {
  name: EVM_NETWORKS_NAMES
  scanUrl: SCAN_URL
  chainID: number
  networkID: number,
  type: EVM_NETWORKS_NAMES,
  env: NETWORK_TYPE
  nativeCoin: NATIVE_COIN
  nativeSymbol: NATIVE_COIN_SYMBOL
  comptrollerAddress: string
  compoundLensAddress: string
  bUSDAddress: string
  wBGLAddress: string
  svBUSDAddress: string
  svWBGLAddress: string
  BUSDSymbol: string;
  WBGLSymbol: string;
}

export const EVM_NETWORKS: {[key: string]: EVM_NETWORK} = {
  [EVM_NETWORKS_NAMES.BSC]: {
    name: EVM_NETWORKS_NAMES.BSC,
    scanUrl: SCAN_URL.BSC,
    chainID: 56,
    networkID: 56,
    type: EVM_NETWORKS_NAMES.BSC,
    env: NETWORK_TYPE.PRODUCTION,
    nativeCoin: NATIVE_COIN.BINANCECOIN,
    nativeSymbol: NATIVE_COIN_SYMBOL.BNB,
    comptrollerAddress: "0xc95837ef82a69a4EAd0df8602adA0b4073064c95",
    compoundLensAddress: "0x00e119B7Dd5F55c3e409004e66ffE4eCCcbA2Ea7",
    bUSDAddress: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    wBGLAddress: "0x2bA64EFB7A4Ec8983E22A49c81fa216AC33f383A",
    svBUSDAddress: "0x24A2b865bB33A72Eec48F9Afe55002538d994766",
    svWBGLAddress: "0xbC2f008e41ECAb2a8B0a3d61F694dd3a6cA3DC99",
    BUSDSymbol: "BUSD",
    WBGLSymbol: "WBGL"
  },
  [EVM_NETWORKS_NAMES.BSC_TESTNET]: {
    name: EVM_NETWORKS_NAMES.BSC_TESTNET,
    scanUrl: SCAN_URL.BSC_TESTNET,
    chainID: 97,
    networkID: 97,
    type: EVM_NETWORKS_NAMES.BSC_TESTNET,
    env: NETWORK_TYPE.TEST,
    nativeCoin: NATIVE_COIN.BINANCECOIN,
    nativeSymbol: NATIVE_COIN_SYMBOL.BNB,
    comptrollerAddress: "0x2A776F95f6c5B9dd90c35A751ad1625540f586b0",
    compoundLensAddress: "0xf4E9f10ED605E243edD2a4207D814fEE09bA1288",
    bUSDAddress: "0x915D6CA12CE5FeC533e6aD0dDdee9C04C4e9470d",
    wBGLAddress: "0xE7465b00430F35a4A859C4750E8Cfee063c90ffF",
    svBUSDAddress: "0xBF4B3a1535547596561063679B032948015a38FB",
    svWBGLAddress: "0xf1dF61070AdeE4d20FFA71e4Ab1A0A68f1884d42",
    BUSDSymbol: "BUSD",
    WBGLSymbol: "TWBGL"
  },
  [EVM_NETWORKS_NAMES.DEFAULT]: {
    name: EVM_NETWORKS_NAMES.BSC,
    scanUrl: SCAN_URL.BSC,
    chainID: 56,
    networkID: 56,
    type: EVM_NETWORKS_NAMES.BSC,
    env: NETWORK_TYPE.PRODUCTION,
    nativeCoin: NATIVE_COIN.BINANCECOIN,
    nativeSymbol: NATIVE_COIN_SYMBOL.BNB,
    comptrollerAddress: "0xc95837ef82a69a4EAd0df8602adA0b4073064c95",
    compoundLensAddress: "0x00e119B7Dd5F55c3e409004e66ffE4eCCcbA2Ea7",
    bUSDAddress: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    wBGLAddress: "0x2bA64EFB7A4Ec8983E22A49c81fa216AC33f383A",
    svBUSDAddress: "0x24A2b865bB33A72Eec48F9Afe55002538d994766",
    svWBGLAddress: "0xbC2f008e41ECAb2a8B0a3d61F694dd3a6cA3DC99",
    BUSDSymbol: "BUSD",
    WBGLSymbol: "WBGL"
  },
}
