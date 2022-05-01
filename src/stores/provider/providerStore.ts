import { makeAutoObservable, runInAction } from "mobx";
import { Logger } from "utils/logger";
import { renderShortAddress } from "utils/address";
import { t } from "i18next";
import Web3 from "web3";
import { hexToDecimal } from "utils/textUtils";
import { ConnectInfo, ProviderMessage } from "models/contracts/types";

export class ProviderStore {
  initialized = false;
  currentAccount?: string | null = null;
  hasProvider = false;

  chainId: any;
  networkId: any;
  accounts: any;

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  get walletConnected() {
    return this.currentAccount;
  }

  get getAccount() {
    return renderShortAddress(this.currentAccount) || t("wallet.notConnected");
  }

  init = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      this.hasProvider = true;
      this.addListeners();
    }
    this.initialized = true;
  };

  addListeners = () => {
    if (!window.ethereum) return;
    window.ethereum.on("accountsChanged", this.handleAccountsChanged);
    window.ethereum.on("disconnect", this.handleDisconnect);
    window.ethereum.on("message", this.handleMessage);
    window.ethereum.on("chainChanged", this.handleChainChange);
    window.ethereum.on("connect", this.handleChainChange);
  };

  removeListeners = () => {
    if (!window.ethereum) return;
    window.ethereum.removeListener(
      "accountsChanged",
      this.handleAccountsChanged
    );
    window.ethereum.removeListener("disconnect", this.handleDisconnect);
    window.ethereum.removeListener("message", this.handleMessage);
    window.ethereum.removeListener("chainChanged", this.handleChainChange);
    window.ethereum.removeListener("connect", this.handleChainChange);
  };

  handleAccountsChanged = (accounts: string[]) => {
    if (accounts[0] !== this.currentAccount) {
      this.currentAccount = accounts[0];
    }
  };

  handleDisconnect = () => {
    this.currentAccount = null;
  };

  handleMessage = (message: ProviderMessage) => {
    // handle message
  };

  handleChainChange = (chainId: string) => {};

  handleConnect = (connectInfo: ConnectInfo) => {};

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
    if (!window.ethereum) return;

    try {
      this.chainId = hexToDecimal(
        await window.ethereum.request({
          method: "eth_chainId",
        })
      );

      this.networkId = hexToDecimal(
        await window.ethereum.request({
          method: "net_version",
        })
      );

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      runInAction(() => {
        this.currentAccount = accounts[0];
      });
    } catch (e) {
      Logger.info("ERROR", e);
    }
  };

  disconnect = () => {
    this.currentAccount = null;
  };
}

export const ETHProvider = new ProviderStore();
