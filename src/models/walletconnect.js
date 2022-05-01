/* eslint-disable */
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { WalletLink } from "walletlink";
import { URLS } from "constants/api";

const INITIAL_STATE = {
  web3: null,
  provider: null,
  connected: false,
  pendingRequest: false,
  chainId: 4,
  ethAccount: "",
  totalBorrow: 0,
  totalSupply: 0,
  netApy: 0,
};

const setConnectWalletModal = () => {
  store.dispatch("modal/setConnectWalletModal");
};

setState(INITIAL_STATE);

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      chainId: URLS.CHAIN_ID,
      networkId: URLS.NETWORK_ID,
      infuraId: URLS.INFURA_ID,
    },
  },
  "custom-walletlink": {
    display: {
      logo: "/wallet.svg",
      name: "WalletLink",
      description: "Scan with WalletLink to connect",
    },
    options: {
      chainId: URLS.CHAIN_ID,
      networkUrl: `https://${URLS.NETWORK}.infura.io/v3/${URLS.INFURA_ID}`,
    },
    package: WalletLink,
    connector: async (_, options) => {
      const { appName, networkUrl, chainId } = options;
      const walletLink = new WalletLink({
        appName,
      });
      const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
      await provider.enable();
      return provider;
    },
  },
};

const initWeb3 = (provider) => {
  const web3 = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: "chainId",
        call: "eth_chainId",
        outputFormatter: web3.utils.hexToNumber,
      },
    ],
  });

  window.web3 = web3;

  return web3;
};

export const web3Modal = new Web3Modal({
  network: URLS.NETWORK,
  cacheProvider: true,
  providerOptions,
});

export const isMetaMaskInjected = web3Modal.providerController.providers.find(
  (provider) => provider.name === "MetaMask"
);

export const onConnect = async () => {
  try {
    const provider = await web3Modal.connect();

    await subscribeProvider(provider);

    const web3 = initWeb3(provider);

    const chainId = await web3.eth.chainId();
    const networkId = await web3.eth.net.getId();
    const network = await web3.eth.net.getNetworkType();

    const accounts = await web3.eth.getAccounts();
    handleAccountChanged(accounts);

    await setState({
      web3,
      provider,
      connected: true,
      chainId,
      networkId,
      network,
    });
  } catch (e) {
    console.log("wallet connect closed");
    await web3Modal.clearCachedProvider();
    localStorage.removeItem("walletconnect");
  }
};

const subscribeProvider = async (provider) => {
  if (!provider.on) {
    return;
  }

  provider.on("disconnect", resetApp);
  provider.on("accountsChanged", handleAccountChanged);
  provider.on("chainChanged", handleChainChanged);
};

const handleChainChanged = (id) => {
  const { chainId } = state;

  if (chainId !== id) {
    window.location.reload();
  }
};

const handleAccountChanged = (accounts) => {
  const { ethAccount } = state;
  const account = (accounts && accounts[0]) || null;
  if (!account) {
    store.dispatch("modal/closeModal");
  }

  if (ethAccount !== account) {
    setState({ ethAccount: account });
  }
};

export const resetApp = async () => {
  if (web3 && web3.currentProvider && web3.currentProvider.close) {
    await web3.currentProvider.close();
  }
  store.dispatch("modal/closeModal");
  await web3Modal.clearCachedProvider();
  localStorage.removeItem("walletconnect");

  const { web3, ...initial } = INITIAL_STATE;
  setState(initial);
};

const start = () => {
  if (web3Modal.cachedProvider) {
    onConnect();
  } else {
    setConnectWalletModal();
  }
};

start();
