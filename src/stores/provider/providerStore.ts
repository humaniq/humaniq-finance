import {makeAutoObservable, runInAction} from "mobx"
import {Logger} from "utils/logger"
import {ConnectInfo, ProviderMessage} from "models/contracts/types"
import WalletConnectProvider from "@walletconnect/web3-provider"
import {ethers, Signer} from "ethers"
import {EVM_NETWORKS, EVM_NETWORKS_NAMES, rpc} from "constants/network"

export enum PROVIDERS {
  WEB3 = "WEB3",
  WC = "WC",
}

export class ProviderStore {
  initialized = false
  currentAccount?: string | null = null
  hasProvider = false
  chainId: number = EVM_NETWORKS[EVM_NETWORKS_NAMES.BSC].chainID
  networkId: number = EVM_NETWORKS[EVM_NETWORKS_NAMES.BSC].networkID
  signer: Signer
  currentProvider: any // ethers.providers.Web3Provider | WalletConnectProvider
  connectDialog = false
  disconnectDialog = false
  connectedProvider: PROVIDERS
  currentNetworkName = EVM_NETWORKS_NAMES.BSC
  isConnecting = false

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true})
  }

  get currentNetwork() {
    return this.networks[this.currentNetworkName]
  }

  get networks() {
    return EVM_NETWORKS
  }

  get isConnectionSupported() {
    return (this.chainId === EVM_NETWORKS[EVM_NETWORKS_NAMES.BSC_TESTNET].chainID && this.networkId === EVM_NETWORKS[EVM_NETWORKS_NAMES.BSC_TESTNET].networkID)
      || (this.chainId === EVM_NETWORKS[EVM_NETWORKS_NAMES.BSC].chainID && this.networkId === EVM_NETWORKS[EVM_NETWORKS_NAMES.BSC].networkID)
  }

  setProvider = async (type: PROVIDERS) => {
    try {
      switch (type) {
        case PROVIDERS.WC:
          const provider = new WalletConnectProvider({rpc})
          const result = await provider.enable()
          runInAction(() => {
            this.currentAccount = result[0]
          })
          this.currentProvider = new ethers.providers.Web3Provider(provider)
          this.initProvider()
          break
        case PROVIDERS.WEB3:
        default:
          this.currentProvider = new ethers.providers.Web3Provider(
            window.ethereum
          )
          this.initProvider()
          await this.connect()
      }
      this.connectedProvider = type
      localStorage.setItem("connected", type)
      runInAction(() => {
        this.connectDialog = false
      })
    } catch (e) {
      Logger.error("ERROR", e)
    }
  }

  init = async () => {
    this.initialized = true
    const provider = localStorage.getItem("connected")
    if (provider) {
      await this.setProvider(provider as PROVIDERS)
    }
  }

  initProvider = () => {
    if (!this.currentProvider) return

    const {provider: ethereum} = this.currentProvider

    ethereum.on("accountsChanged", this.handleAccountsChange)
    ethereum.on("disconnect", this.handleDisconnect)
    ethereum.on("message", this.handleMessage)
    ethereum.on("chainChanged", this.handleChainChange)
    ethereum.on("connect", this.handleChainChange)

    this.signer = this.currentProvider.getSigner()
  }

  removeListeners = () => {
    if (!this.currentProvider) return

    const {provider: ethereum} = this.currentProvider

    ethereum.removeListener(
      "accountsChanged",
      this.handleAccountsChange
    )
    ethereum.removeListener("disconnect", this.handleDisconnect)
    ethereum.removeListener("message", this.handleMessage)
    ethereum.removeListener("chainChanged", this.handleChainChange)
    ethereum.removeListener("connect", this.handleChainChange)
  }

  handleAccountsChange = (accounts: string[]) => {
    if (this.currentAccount && accounts[0] !== this.currentAccount) {
      this.currentAccount = accounts[0]
    }
  }

  handleDisconnect = () => {
    this.currentAccount = null
  }

  handleMessage = (message: ProviderMessage) => {
    // handle message
    console.info("message", message);
  }

  handleChainChange = async (chainId: string) => {
    if (parseInt(chainId, 16) === this.currentNetwork.chainID) return;
    this.chainId = parseInt(chainId, 16);
    await this.init();
  }

  handleConnect = (connectInfo: ConnectInfo) => {
  }

  personalMessageRequest = (message: any): any => {
    if (!this.currentProvider) return null

    return this.currentProvider.request({
      method: "personal_sign",
      params: [
        `0x${Buffer.from(message, "utf-8").toString("hex")}`,
        this.currentAccount
      ]
    })
  }

  connect = async () => {
    try {
      this.isConnecting = true

      const [chainId, networkId] = await Promise.all<string>([
        await window.ethereum.request({
          method: "eth_chainId"
        }),
        await window.ethereum.request({
          method: "net_version"
        })
      ])

      this.chainId = +chainId
      this.networkId = +networkId

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      }) as string[]

      runInAction(() => {
        if (accounts) {
          this.currentAccount = accounts[0]
        }
      })
    } catch (e) {
      Logger.info("ERROR", e)
    } finally {
      this.isConnecting = false
    }
  }

  disconnect = () => {
    this.currentAccount = null
    this.disconnectDialog = false
    try {
      localStorage.removeItem("connected")
      localStorage.removeItem("walletconnect")
    } catch (e) {
      Logger.error("ERROR", e)
    }
  }

  toggleConnectDialog = () => {
    this.connectDialog = !this.connectDialog
  }

  toggleDisconnectDialog = () => {
    this.disconnectDialog = !this.disconnectDialog
  }
}

export const ETHProvider = new ProviderStore()
