export const BASE_URL = "";

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

function handleError(response: any) {
  if (!response.ok) throw new Error(response);

  return response.json();
}

export function getGasFee() {
  return fetch(URLS.ETHERSCAN_URL)
    .then(handleError)
    .then((json) => json.result.ProposeGasPrice) // response in GWei
    .catch((err) => console.error(err));
}

export function getTotalEarned(account: any) {
  const url = `${URLS.API_URL}/profits?addr=${account}`;

  return fetch(url)
    .then(handleError)
    .catch((err) => console.error(err));
}

export function getMarketDetails() {
  const url = `${URLS.API_URL}/all_markets`;

  return fetch(url)
    .then(handleError)
    .catch((err) => console.error(err));
}
