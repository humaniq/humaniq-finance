import { makeAutoObservable } from "mobx";
import {TRANSACTION_STATUS} from "components/transaction-message/TransactionMessage"

export class TransactionStore {
  transactionMessageVisible = false
  transactionMessageStatus = TRANSACTION_STATUS.PENDING
  transactionMessage = ""

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
  }
}

export const transactionStore = new TransactionStore();
