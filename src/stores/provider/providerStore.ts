import {makeAutoObservable, runInAction} from "mobx"
import {Logger} from "utils/logger"
import {ConnectInfo, ProviderMessage} from "models/contracts/types"
import {ethers} from "ethers"

export class ProviderStore {
  initialized = false
  currentAccount?: string | null = null
  hasProvider = false

  chainId: number
  networkId: number
  signer: any
  provider: any

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true})
  }

  init = async () => {
    if (window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum)
      this.signer = this.provider.getSigner()
      this.hasProvider = true
      this.addListeners()
    }
    this.initialized = true
  }

  addListeners = () => {
    if (!window.ethereum) return

    window.ethereum.on("accountsChanged", this.handleAccountsChange)
    window.ethereum.on("disconnect", this.handleDisconnect)
    window.ethereum.on("message", this.handleMessage)
    window.ethereum.on("chainChanged", this.handleChainChange)
    window.ethereum.on("connect", this.handleChainChange)
  }

  removeListeners = () => {
    if (!window.ethereum) return

    window.ethereum.removeListener(
      "accountsChanged",
      this.handleAccountsChange
    )
    window.ethereum.removeListener("disconnect", this.handleDisconnect)
    window.ethereum.removeListener("message", this.handleMessage)
    window.ethereum.removeListener("chainChanged", this.handleChainChange)
    window.ethereum.removeListener("connect", this.handleChainChange)
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
    if (!window.ethereum) return null

    return window.ethereum.request({
      method: "personal_sign",
      params: [
        `0x${Buffer.from(message, "utf-8").toString("hex")}`,
        this.currentAccount
      ]
    })
  }

  connect = async () => {
    if (!window.ethereum) return

    try {
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
    }
  }

  disconnect = () => {
    this.currentAccount = null
  }
}

export const ETHProvider = new ProviderStore()