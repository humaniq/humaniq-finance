import { FaucetNonStandardToken } from "models/contracts/FaucetNonStandardTokenContract";
import { FaucetContract } from "models/contracts/FaucetContract";
import { getProviderStore } from "App";

export class FaucetToken {
  token: any;
  cToken: any;
  account: any;
  contract: any;

  constructor(token: any, cToken: any, account: any, isNonStandart: boolean) {
    this.token = token;
    this.cToken = cToken;
    this.account = account;
    this.contract = isNonStandart
      ? FaucetNonStandardToken(this.token, getProviderStore.currentProvider)
      : FaucetContract(this.token, getProviderStore.currentProvider);
  }

  allocateTo = (value: any) => {
    const contractSig = this.contract.connect(getProviderStore.signer)
    return contractSig
      .allocateTo(this.account, value)
      .send({ from: this.account });
  };
}
