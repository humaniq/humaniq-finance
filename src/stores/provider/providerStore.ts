import {makeAutoObservable, runInAction} from "mobx"
import {Logger} from "utils/logger"
import WalletConnectProvider from "@walletconnect/web3-provider"
import {ethers, Signer} from "ethers"
import {EVM_NETWORKS, EVM_NETWORKS_NAMES, rpc} from "constants/network"

export enum PROVIDERS {
  WEB3 = "WEB3",
  WC = "WC",
}

export const WALLET_TYPE_CONNECTED = "wallet_connected_type_savy"

export class ProviderStore {
  initialized = false
  currentAccount?: string | null = null
  hasProvider = false
  chainId: number
  signer: Signer
  currentProvider: any
  connectDialog = false
  disconnectDialog = false
  connectedProvider: PROVIDERS
  currentNetworkName = EVM_NETWORKS_NAMES.BSC
  isConnecting = false
  notSupportedNetwork = false

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
    return Boolean(
      Object.values(EVM_NETWORKS).find(item => item.chainID === this.chainId)
    )
  }

  hideSupportedNetworkDialog = () => {
    this.notSupportedNetwork = false
  }

  setProvider = async (type: PROVIDERS) => {
    try {
      switch (type) {
        case PROVIDERS.WC:
          const provider = new WalletConnectProvider({rpc})
          const result = await provider.enable()
          this.currentAccount = result[0]
          this.currentProvider = new ethers.providers.Web3Provider(provider)
          this.initProvider()
          await this.connectWC()
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
      localStorage.setItem(WALLET_TYPE_CONNECTED, type)
      this.connectDialog = false
    } catch (e) {
      Logger.error("ERROR", e)
    }
  }

  init = async () => {
    this.initialized = true
    const provider = localStorage.getItem(WALLET_TYPE_CONNECTED)
    if (provider) {
      await this.setProvider(provider as PROVIDERS)
    }
  }

  initProvider = () => {
    if (!this.currentProvider) return

    const {provider} = this.currentProvider

    provider.on("accountsChanged", this.handleAccountsChange)
    provider.on("disconnect", this.handleDisconnect)
    provider.on("chainChanged", this.handleChainChange)

    this.signer = this.currentProvider.getSigner()
  }

  removeListeners = () => {
    if (!this.currentProvider) return

    const {provider} = this.currentProvider

    provider?.removeListeners()
  }

  handleAccountsChange = async (accounts: string[]) => {
    if (this.currentAccount === accounts[0]) return
    this.currentAccount = accounts[0]
  }

  handleDisconnect = () => {
    this.currentAccount = null
  }

  handleChainChange = async (info: any) => {
    let chainId: any
    if (typeof info === 'object') {
      chainId = +info.chainId
    } else {
      chainId = +info
    }

    if (chainId !== this.chainId) {
      window.location.reload()
    }
  }

  connectWC = async () => {
    if (!this.currentProvider || this.currentProvider?.provider.currentAccount)
      return

    if (this.isConnecting) return

    this.isConnecting = true

    try {
      let chainId = this.chainId

      if (!chainId) {
        chainId = await this.currentProvider.provider.request({
          method: "eth_chainId"
        })
      }

      const chain = Object.values(EVM_NETWORKS).find(item => item.chainID === chainId)

      runInAction(() => {
        if (chain) {
          this.notSupportedNetwork = false
          this.chainId = chain.chainID
          this.currentNetworkName = chain.name
        } else {
          // not supported
          this.chainId = chainId
          this.notSupportedNetwork = true
          this.initialized = false
          this.currentProvider.provider.onDisconnect()
          this.currentProvider = null
        }
      })
    } catch (e) {
      Logger.info("ERROR", e)
    } finally {
      runInAction(() => {
        this.isConnecting = false
      })
    }
  }

  connect = async () => {
    if (!this.currentProvider || this.currentProvider?.provider.currentAccount)
      return

    if (this.isConnecting) return

    this.isConnecting = true

    try {
      const chainId = await this.currentProvider.provider.request({
        method: "eth_chainId"
      })

      const chain = Object.values(EVM_NETWORKS).find(item => item.chainID === +chainId)

      if (chain) {
        this.notSupportedNetwork = false

        this.chainId = chain.chainID
        this.currentNetworkName = chain.name

        const accounts = await this.currentProvider.provider.request({
          method: "eth_requestAccounts"
        }) as string[]

        runInAction(() => {
          this.currentAccount = accounts[0]
        })
      } else {
        // not supported
        runInAction(() => {
          this.chainId = +chainId
          this.notSupportedNetwork = true
          this.initialized = false
        })
      }
    } catch (e) {
      Logger.info("ERROR", e)
    } finally {
      runInAction(() => this.isConnecting = false)
    }
  }

  disconnect = async () => {
    this.currentAccount = null
    this.disconnectDialog = false
    try {
      localStorage.removeItem(WALLET_TYPE_CONNECTED)
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

export const EVMProvider = new ProviderStore()
