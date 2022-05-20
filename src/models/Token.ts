import { CEtherContract } from "models/contracts/CEtherContract";
import { CErc20Contract } from "models/contracts/CErc20Contract";
import { MAX_UINT_256 } from "models/constants/constants";
import { getProviderStore } from "App";

export class Token {
  token: any;
  cToken: any;
  account: any;
  contract: any;

  constructor(token: any, cToken?: any, account?: string, isEth?: boolean) {
    this.token = token;
    this.cToken = cToken;
    this.account = account;
    this.contract = isEth
      ? CEtherContract(token, getProviderStore.currentProvider)
      : CErc20Contract(token, getProviderStore.currentProvider);
  }

  approve = () => {
    const contractSig = this.contract.connect(getProviderStore.signer)
    return contractSig
      .approve(this.cToken, MAX_UINT_256)
      .send({ from: this.account });
  };

  allowance = () => {
    return this.contract.allowance(this.account, this.cToken);
  };

  getDecimals = () => {
    return this.contract.decimals();
  };

  getSymbol = () => {
    return this.contract.symbol();
  };

  getName = () => {
    return this.contract.name();
  };
}