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
      ? CEtherContract(cToken, getProviderStore.signer)
      : CErc20Contract(cToken, getProviderStore.signer);
  }

  supply = (value: any, gas: any) => {
    const params: any = { from: this.account };
    if (this.isEther) {
      params.value = value;
      params.gas = gas;

      return this.contract.mint(params);
    }
    return this.contract.mint(value, params);
  };

  getEstimateGas = (method: any, value: any) => {
    return this.contract[method]().estimateGas({ from: this.account, value });
  };

  borrow = (value: any) => {
    return this.contract.borrow(value).send({ from: this.account });
  };

  repayBorrow = (value: any) => {
    if (this.isEther) {
      return this.contract.repayBorrow().send({
        from: this.account,
        value,
      });
    }
    return this.contract.repayBorrow(value).send({ from: this.account });
  };

  withdraw = (value: any) => {
    return this.contract.redeemUnderlying(value).send({ from: this.account });
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
