import { CEtherContract } from "models/contracts/CEtherContract";
import { CErc20Contract } from "models/contracts/CErc20Contract";
import { getProviderStore } from "App";

export class Ctoken {
  cToken: any;
  account: any;
  isEther: boolean;
  contract: any;

  constructor(cToken: any, account: any, isEth: boolean) {
    this.cToken = cToken;
    this.account = account;
    this.isEther = isEth;
    this.contract = isEth
      ? CEtherContract(cToken, getProviderStore.currentProvider)
      : CErc20Contract(cToken, getProviderStore.currentProvider);
  }

  supply = (value: any, gas: any) => {
    const params: any = { from: this.account };
    const contractSig = this.contract.connect(getProviderStore.signer)
    if (this.isEther) {
      params.value = value;
      params.gas = gas;

      return contractSig.mint(params);
    }
    return contractSig.mint(value, params);
  };

  getEstimateGas = (method: any, value: any) => {
    return this.contract[method]().estimateGas({ from: this.account, value });
  };

  borrow = (value: any) => {
    const contractSig = this.contract.connect(getProviderStore.signer)
    return contractSig.borrow(value).send({ from: this.account });
  };

  repayBorrow = (value: any) => {
    const contractSig = this.contract.connect(getProviderStore.signer)

    if (this.isEther) {
      return this.contract.repayBorrow().send({
        from: this.account,
        value,
      });
    }
    return contractSig.repayBorrow(value).send({ from: this.account });
  };

  withdraw = (value: any) => {
    const contractSig = this.contract.connect(getProviderStore.signer)
    return contractSig.redeemUnderlying(value).send({ from: this.account });
  };

  supplyRatePerBlock = () => {
    return this.contract.supplyRatePerBlock();
  };

  borrowRatePerBlock = () => {
    return this.contract.borrowRatePerBlock();
  };

  getDecimals = () => {
    return this.contract.decimals();
  };

  balanceOfUnderlying = () => {
    return this.contract.balanceOfUnderlying(this.account);
  };

  borrowBalanceCurrent = () => {
    return this.contract.borrowBalanceCurrent(this.account);
  };

  getExchangeRate = () => {
    return this.contract.exchangeRateStored();
  };

  getCash = () => {
    return this.contract.getCash();
  };

  getName = () => {
    return this.contract.name();
  };

  getTotalBorrows = () => {
    return this.contract.totalBorrows();
  };

  getTotalSupply = () => {
    return this.contract.totalSupply();
  };

  getExchangeRateStored = () => {
    return this.contract.exchangeRateStored();
  };

  estimateGas = (recipientAddress: any, amount: any) => {
    return this.contract.estimateGas.transfer(recipientAddress, amount)
  }
}