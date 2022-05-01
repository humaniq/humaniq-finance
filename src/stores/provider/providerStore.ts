import { makeAutoObservable } from "mobx";
import { Logger } from "utils/logger";
import { renderShortAddress } from "utils/address";
import { t } from "i18next";
import Web3 from "web3";
import Web3Modal from "web3modal";
import { URLS } from "constants/api";
import { WalletLink } from "walletlink";
import WalletConnectProvider from "@walletconnect/web3-provider";

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
    connector: async (_: any, options: any) => {
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

export const web3Modal = new Web3Modal({
  network: URLS.NETWORK,
  cacheProvider: true,
  providerOptions,
});

export class ProviderStore {
  initialized = false;
  currentAccount?: string | null = null;
  hasProvider = false;

  web3: any;
  provider: any;
  chainId: any;
  networkId: any;
  network: any;
  accounts: any;

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  initWeb3 = (provider: any) => {
    const web3 = new Web3(provider);

    web3.eth.extend({
      methods: [
        {
          name: "chainId",
          call: "eth_chainId",
          outputFormatter: web3.utils.hexToNumber,
        },
      ],
    } as any);

    window.web3 = web3;

    return web3;
  };

  onConnect = async () => {
    try {
      const provider = await web3Modal.connect();

      await this.subscribeProvider(provider);

      const web3: any = this.initWeb3(provider);

      const chainId = await web3.eth.chainId();
      const networkId = await web3.eth.net.getId();
      const network = await web3.eth.net.getNetworkType();

      const accounts = await web3.eth.getAccounts();
      this.handleAccountChanged(accounts);

      this.web3 = web3;
      this.provider = provider;
      this.chainId = chainId;
      this.networkId = networkId;
      this.network = network;
    } catch (e) {
      console.log("wallet connect closed");
      await web3Modal.clearCachedProvider();
      localStorage.removeItem("walletconnect");
    }
  };

  subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return;
    }

    provider.on("disconnect", this.resetApp);
    provider.on("accountsChanged", this.handleAccountChanged);
    provider.on("chainChanged", this.handleChainChanged);
  };

  start = async () => {
    // if (web3Modal.cachedProvider) {
    //   await this.onConnect();
    // } else {
    //   await this.onConnect();
    // }
    this.initialized = true;
  };

  get walletConnected() {
    return this.currentAccount;
  }

  get getAccount() {
    return renderShortAddress(this.currentAccount) || t("wallet.notConnected");
  }

  init = async () => {
    if (window.ethereum) {
      this.hasProvider = true;

      window.ethereum.on("accountsChanged", (accounts: any) => {
        this.currentAccount = accounts[0];
      });

      window.ethereum.on("disconnect", () => {
        this.currentAccount = null;
      });

      window.ethereum.on("connect", (accounts: any) => {
        this.currentAccount = accounts[0];
      });

      window.ethereum.on("message", (payload: any) => {
        Logger.info("message", payload);
      });
      //
      // try {
      //   const accounts = await window.ethereum.request({
      //     method: "eth_requestAccounts",
      //   });
      //   this.currentAccount = accounts[0];
      // } catch (e) {
      //   Logger.info("ERROR", e);
      // }
    }
    this.initialized = true;
  };

  personalMessageRequest = (message: any): any => {
    if (!window.ethereum) return null;

    return window.ethereum.request({
      method: "personal_sign",
      params: [
        `0x${Buffer.from(message, "utf-8").toString("hex")}`,
        this.currentAccount,
      ],
    });
  };

  connect = async () => {
    if (!window.ethereum || window.ethereum?.currentAccount) return;

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      this.currentAccount = accounts[0];
    } catch (e) {
      Logger.info("ERROR", e);
    }
  };

  disconnect = () => {
    this.currentAccount = null;
  };

  handleChainChanged = (id: any) => {
    if (this.chainId !== id) {
      window.location.reload();
    }
  };

  handleAccountChanged = (accounts: any) => {
    const account = (accounts && accounts[0]) || null;
    if (!account) {
      this.currentAccount = null;
    }

    if (this.currentAccount !== account) {
      this.currentAccount = account;
    }
  };

  resetApp = async () => {
    if (
      this.web3 &&
      this.web3.currentProvider &&
      this.web3.currentProvider.close
    ) {
      await this.web3.currentProvider.close();
    }
    await web3Modal.clearCachedProvider();
    localStorage.removeItem("walletconnect");
  };
}

export const ETHProvider = new ProviderStore();
