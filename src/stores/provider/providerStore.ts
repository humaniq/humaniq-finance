import {makeAutoObservable} from "mobx"
import {Logger} from "utils/logger"
import {ProviderMessage} from "models/contracts/types"
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
  networkId: number
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
    return (this.chainId === EVM_NETWORKS[EVM_NETWORKS_NAMES.BSC_TESTNET].chainID)
      || (this.chainId === EVM_NETWORKS[EVM_NETWORKS_NAMES.BSC].chainID)
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

    const {provider: ethereum} = this.currentProvider

    ethereum.on("accountsChanged", this.handleAccountsChange)
    ethereum.on("disconnect", this.handleDisconnect)
    ethereum.on("message", this.handleMessage)
    ethereum.on("chainChanged", this.handleChainChange)

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
  }

  handleAccountsChange = async (accounts: string[]) => {
    this.currentAccount = accounts[0]
    this.isConnecting = true
    setTimeout(() => this.isConnecting = false, 0)
  }

  handleDisconnect = () => {
    this.currentAccount = null
  }

  handleMessage = (message: ProviderMessage) => {
    // handle message
  }

  handleChainChange = async (info: any) => {
    let chainId: any
    if (typeof info === 'object') {
      chainId = parseInt(info.chainId, 16)
    } else {
      chainId = parseInt(info, 16)
    }

    if (chainId === this.chainId) return

    const chain = Object.values(EVM_NETWORKS).find(item => item.chainID === chainId)

    if (chain) {
      this.notSupportedNetwork = false
      this.chainId = chain.chainID
      this.networkId = chain.networkID
      this.currentNetworkName = chain.name
      await this.init()
    } else {
      // not supported chain
      this.chainId = chainId
      this.notSupportedNetwork = true
      this.initialized = false
    }
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
    if (!this.currentProvider || this.currentProvider?.provider.currentAccount)
      return

    try {
      this.isConnecting = true

      const chainId = await window.ethereum.request({
        method: "eth_chainId"
      })

      const chain = Object.values(EVM_NETWORKS).find(item => item.chainID === +chainId)

      if (chain) {
        this.notSupportedNetwork = false

        this.chainId = chain.chainID
        this.networkId = chain.networkID
        this.currentNetworkName = chain.name

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts"
        }) as string[]

        this.currentAccount = accounts[0]
      } else {
        // not supported
        this.chainId = chainId
        this.notSupportedNetwork = true
        this.initialized = false
      }
    } catch (e) {
      Logger.info("ERROR", e)
    } finally {
      this.isConnecting = false
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
