import { URLS } from "constants/api";
import CompoundLensContract from "models/contracts/CompoundLensContract";

export class CompoundLens {
  account: string;
  methods: any;

  constructor(account: string) {
    this.account = account;
    this.methods = CompoundLensContract(URLS.COMPOUNDLENS_ADDRESS).methods;
  }

  getBalanceAll = (cTokens: any) => {
    return this.methods.cTokenBalancesAll(cTokens, this.account).call();
  };

  getcTokenData = (cToken: any) => {
    return this.methods
      .cTokenMetadata(cToken)
      .call()
      .then((data: any) => {
        // remove unnecessary keys from response
        const result: any = {};
        const dataObject = Object.assign({}, data); // convert array to object
        const neededKeys = Object.keys(dataObject).slice(data.length); // remove first half of keys
        neededKeys.forEach((key) => (result[key] = data[key]));

        return result;
      });
  };

  getUnderlyingPriceAll(cTokens: any[]) {
    return this.methods.cTokenUnderlyingPriceAll(cTokens).call();
  }

  getCompoundBalance(ersdlToken: any) {
    return this.methods
      .getCompBalance(ersdlToken, URLS.COMPTROLLER_ADDRESS, this.account)
      .call();
  }
}
