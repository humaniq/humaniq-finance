import { CEtherContract } from "models/contracts/CEtherContract";
import { CErc20Contract } from "models/contracts/CErc20Contract";
import { MAX_UINT_256 } from "models/constants/constants";
import { getProviderStore } from "App";

export class Token {
  token: any;
  cToken: any;
  account: any;
  contract: any;
  isEther: any;

  constructor(token: any, cToken?: any, account?: string, isEth?: boolean) {
    this.token = token;
    this.cToken = cToken;
    this.account = account;
    this.isEther = isEth;
    this.contract = isEth
      ? CEtherContract(token, getProviderStore.provider)
      : CErc20Contract(token, getProviderStore.provider);
  }

  approve = () => {
    const contract = this.isEther
      ? CEtherContract(this.token, getProviderStore.signer)
      : CErc20Contract(this.token, getProviderStore.signer);
    return contract
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
