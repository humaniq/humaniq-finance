import { URLS } from "constants/api";
import { tAccountLiquidity } from "models/contracts/types";
import { ComptrollerContract } from "models/contracts/ComptrollerContract";
import { getProviderStore } from "App";

export class Comptroller {
  account: string;
  contract: any;

  constructor(account: string) {
    this.account = account;
    this.contract = ComptrollerContract(
      URLS.COMPTROLLER_ADDRESS,
      getProviderStore.provider
    );
  }

  waitForTransaction = (transactionHash: string) => {
    return getProviderStore.provider.waitForTransaction(transactionHash);
  };

  getAllMarkets = async (): Promise<string[]> => {
    return this.contract.getAllMarkets();
  };

  enterMarkets = (params: any) => {
    return this.contract.enterMarkets(params);
  };

  exitMarket = (cToken: any) => {
    return this.contract.exitMarket(cToken);
  };

  checkMembership = (cToken: any) => {
    return this.contract.checkMembership(this.account, cToken);
  };

  getAccountLiquidity = async (): Promise<tAccountLiquidity> => {
    return this.contract.getAccountLiquidity(this.account);
  };

  getHypotheticalAccountLiquidity = (
    cToken: any,
    redeemTokens: any,
    borrowAmount: any
  ) => {
    return this.contract.getHypotheticalAccountLiquidity(
      this.account,
      cToken,
      redeemTokens,
      borrowAmount
    );
  };

  claimRewards = (tokens: any) => {
    return this.contract.claimRewards(this.account, tokens);
  };

  getCompSpeeds = (cToken: any) => {
    return this.contract.compSpeeds(cToken);
  };

  mintGuardianPaused = (data: any) => {
    return this.contract.mintGuardianPaused(data.cToken);
  };

  borrowGuardianPaused = (data: any) => {
    return this.contract.borrowGuardianPaused(data.cToken);
  };
}
