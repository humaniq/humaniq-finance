import { tAccountLiquidity } from "models/contracts/types";
import { ComptrollerContract } from "models/contracts/ComptrollerContract";
import { getProviderStore } from "App";

export class Comptroller {
  account: string;
  contract: any;

  constructor(account: string) {
    this.account = account;
    this.contract = ComptrollerContract(
      getProviderStore.currentNetwork.comptrollerAddress,
      getProviderStore.currentProvider
    );
  }

  waitForTransaction = (transactionHash: string) => {
    return getProviderStore.currentProvider.waitForTransaction(transactionHash);
  };

  getAllMarkets = async (): Promise<string[]> => {
    const contractSig = this.contract.connect(getProviderStore.currentProvider)
    return contractSig.getAllMarkets();
  };

  enterMarkets = async (token: any) => {
    const contractSig = this.contract.connect(getProviderStore.signer)
    return contractSig.enterMarkets(token, {from: this.account});
  };

  exitMarket = (cToken: any) => {
    const contractSig = this.contract.connect(getProviderStore.signer)
    return contractSig.exitMarket(cToken, {from: this.account});
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

  mintGuardianPaused = (cToken: any) => {
    return this.contract.mintGuardianPaused(cToken);
  };

  borrowGuardianPaused = (cToken: any) => {
    return this.contract.borrowGuardianPaused(cToken);
  };
}
