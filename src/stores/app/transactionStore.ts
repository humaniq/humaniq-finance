import {makeAutoObservable} from "mobx"

export enum TRANSACTION_STATUS {
  IDLE = "idle",
  PENDING = "pending",
  SUCCESS = "success",
  ERROR = "error",
}

export type TRANSACTION_STEP = {
  firstStep: {
    message?: string
    visible: boolean
    status?: TRANSACTION_STATUS
  }
  secondStep: {
    message?: string
    visible: boolean
    status?: TRANSACTION_STATUS
  },
  errorMessage?: string
}

export class TransactionStore {
  transactionMessageVisible = false
  transactionMessageStatus: TRANSACTION_STEP = {
    firstStep: {
      visible: true
    },
    secondStep: {
      visible: true
    },
  }

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true})
  }

  clear = () => {
    this.transactionMessageStatus = {
      firstStep: {
        visible: true
      },
      secondStep: {
        visible: true
      },
    }
  }
}

export const transactionStore = new TransactionStore()
