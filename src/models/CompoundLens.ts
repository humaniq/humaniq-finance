import { URLS } from "constants/api";
import { CompoundLensContract } from "models/contracts/CompoundLensContract";
import { getProviderStore } from "App";

export class CompoundLens {
  account: string;
  contract: any;

  constructor(account: string) {
    this.account = account;
    this.contract = CompoundLensContract(
      URLS.COMPOUNDLENS_ADDRESS,
      getProviderStore.provider
    );
  }

  getBalanceAll = (cTokens: any) => {
    return this.contract.cTokenBalancesAll(cTokens, this.account);
  };

  getcTokenData = (cToken: any) => {
    return this.contract.cTokenMetadata(cToken).then((data: any) => {
      // remove unnecessary keys from response
      const result: any = {};
      const dataObject = Object.assign({}, data); // convert array to object
      const neededKeys = Object.keys(dataObject).slice(data.length); // remove first half of keys
      neededKeys.forEach((key) => (result[key] = data[key]));
      return result;
    });
  };

  getUnderlyingPriceAll(cTokens: any[]) {
      return this.contract.cTokenUnderlyingPriceAll(cTokens);
  }

  getCompoundBalance(ersdlToken: any) {
    return this.contract.getCompBalance(
      ersdlToken,
      URLS.COMPTROLLER_ADDRESS,
      this.account
    );
  }
}