import {makeAutoObservable, runInAction} from "mobx"
import {Logger} from "utils/logger"
import {ConnectInfo, ProviderMessage} from "models/contracts/types"
import WalletConnectProvider from "@walletconnect/web3-provider"
import {rpc} from "constants/api"
import {ethers} from "ethers"

export enum PROVIDERS {
  WEB3 = "WEB3",
  WC = "WC",
}

export class ProviderStore {
  initialized = false
  currentAccount?: string | null = null
  hasProvider = false
  chainId: number = 4
  networkId: number = 4

  signer: any
  currentProvider: any

  connectDialog = false
  disconnectDialog = false
  connectedProvider: PROVIDERS

  isConnecting = false

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true})
  }

  get isConnectionSupported() {
    return this.chainId === 4 && this.networkId === 4
  }

  setProvider = async (type: PROVIDERS) => {
    try {
      switch (type) {
        case PROVIDERS.WC:
          const provider = new WalletConnectProvider({rpc})
          const result = await provider.enable()
          this.currentAccount = result[0]
          this.currentProvider = provider
          this.initProvider()
          break
        case PROVIDERS.WEB3:
        default:
          this.currentProvider = new ethers.providers.Web3Provider(window.ethereum)
          this.initProvider()
          await this.connect()
      }
      this.connectedProvider = type
      localStorage.setItem("connected", type)
      this.connectDialog = false
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

    this.currentProvider.on("accountsChanged", this.handleAccountsChange)
    this.currentProvider.on("disconnect", this.handleDisconnect)
    this.currentProvider.on("message", this.handleMessage)
    this.currentProvider.on("chainChanged", this.handleChainChange)
    this.currentProvider.on("connect", this.handleChainChange)

    this.signer = this.currentProvider.getSigner()
  }

  removeListeners = () => {
    if (!this.currentProvider) return

    this.currentProvider.removeListener(
      "accountsChanged",
      this.handleAccountsChange
    )
    this.currentProvider.removeListener("disconnect", this.handleDisconnect)
    this.currentProvider.removeListener("message", this.handleMessage)
    this.currentProvider.removeListener("chainChanged", this.handleChainChange)
    this.currentProvider.removeListener("connect", this.handleChainChange)
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
  }

  handleChainChange = (chainId: string) => {
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