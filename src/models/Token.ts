import { CErc20Contract } from "models/contracts/CErc20Contract";
import { getProviderStore } from "App";
import {MAX_UINT_256} from "utils/common"

export class Token {
  token: any;
  cToken: any;
  account: any;
  contract: any;

  constructor(token: any, cToken?: any, account?: string) {
    this.token = token;
    this.cToken = cToken;
    this.account = account;
    this.contract = CErc20Contract(token, getProviderStore.currentProvider);
  }

  approve = () => {
    return this.contract
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
