import { URLS } from "constants/api";
import { providers } from "ethers";
import { tAccountLiquidity } from "models/contracts/types";
import ComptrollerContract from "models/contracts/ComptrollerContract";

export class Comptroller {
  account: string;
  methods: any;
  ethers: any;

  constructor(account: string) {
    this.account = account;
    this.methods = ComptrollerContract(URLS.COMPTROLLER_ADDRESS).methods;

    window.web3.eth.net.getNetworkType().then((n: string) => {
      const networkName = n.includes("main") ? "mainnet" : n;
      this.ethers = new providers.Web3Provider(
        window.web3.currentProvider,
        networkName
      );
    });
  }

  waitForTransaction = (transactionHash: string) => {
    return this.ethers.waitForTransaction(transactionHash);
  };

  getAllMarkets = async (): Promise<string[]> => {
    return this.methods.getAllMarkets().call();
  };

  enterMarkets = (params: any) => {
    return this.methods.enterMarkets(params).send({ from: this.account });
  };

  exitMarket = (cToken: any) => {
    return this.methods.exitMarket(cToken).send({ from: this.account });
  };

  checkMembership = (cToken: any) => {
    return this.methods
      .checkMembership(this.account, cToken)
      .call({ from: this.account });
  };

  getAccountLiquidity = async (): Promise<tAccountLiquidity> => {
    return this.methods.getAccountLiquidity(this.account).call();
  };

  getHypotheticalAccountLiquidity = (
    cToken: any,
    redeemTokens: any,
    borrowAmount: any
  ) => {
    return this.methods
      .getHypotheticalAccountLiquidity(
        this.account,
        cToken,
        redeemTokens,
        borrowAmount
      )
      .call();
  };

  claimRewards = (tokens: any) => {
    return this.methods
      .claimRewards(this.account, tokens)
      .send({ from: this.account });
  };

  getCompSpeeds = (cToken: any) => {
    return this.methods.compSpeeds(cToken).call();
  };
}
