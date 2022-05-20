export const BASE_URL = "";

export enum GAS_PRICE_SPEED {
  FASTEST = 'FASTEST',
  FAST = 'FAST',
  SAFE_LOW = 'SAFE_LOW'
}

export const GAS_FEE = "https://ethgasstation.info/api/ethgasAPI.json"

export const URLS = {
  API_URL: "https://ledger-api-dev.unfederalreservetesting.com",
  NETWORK: "rinkeby",
  CHAIN_ID: 4,
  NETWORK_ID: 4,
  INFURA_ID: "93cfeb59a6d04664a46bfef10b8d772e",
  REQUIRED_APPROVED_TRANSACTIONS: 1,
  COMPTROLLER_ADDRESS: "0x44abc8395f35b6290af32601234fe11954808011",
  COMPOUNDLENS_ADDRESS: "0x3E419553fa0477e6D3B0dBB6d88d270cA29bca1e",
  ETHERSCAN_API_KEY: "URM3S7N8RENJXU4B6GVCTYT19NP529F3K9",
  ETHERSCAN_URL: `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=URM3S7N8RENJXU4B6GVCTYT19NP529F3K9`,
};

export const rpc = {
  1: "https://mainnet.infura.io/v3/c306191fe58d401b900a38911b8a43c9",
  3: "https://ropsten.infura.io/v3/c306191fe58d401b900a38911b8a43c9",
  4: "https://rinkeby.infura.io/v3/c306191fe58d401b900a38911b8a43c9",
  5: "https://goerli.infura.io/v3/c306191fe58d401b900a38911b8a43c9",
  97: "https://data-seed-prebsc-1-s1.binance.org:8545",
  56: "https://bsc-dataseed.binance.org",
};