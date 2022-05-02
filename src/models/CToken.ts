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

      return this.contract.mint().send(params);
    }

    return this.contract.mint(value).send(params);
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
    const contract = this.isEther
      ? CEtherContract(this.cToken, getProviderStore.provider)
      : CErc20Contract(this.cToken, getProviderStore.provider);
    return contract.supplyRatePerBlock();
  };

  borrowRatePerBlock = () => {
    const contract = this.isEther
      ? CEtherContract(this.cToken, getProviderStore.provider)
      : CErc20Contract(this.cToken, getProviderStore.provider);
    return contract.borrowRatePerBlock();
  };

  getDecimals = () => {
    const contract = this.isEther
      ? CEtherContract(this.cToken, getProviderStore.provider)
      : CErc20Contract(this.cToken, getProviderStore.provider);
    return contract.decimals();
  };

  balanceOfUnderlying = () => {
    const contract = this.isEther
      ? CEtherContract(this.cToken, getProviderStore.provider)
      : CErc20Contract(this.cToken, getProviderStore.provider);
    return contract.balanceOfUnderlying(this.account);
  };

  borrowBalanceCurrent = () => {
    const contract = this.isEther
      ? CEtherContract(this.cToken, getProviderStore.provider)
      : CErc20Contract(this.cToken, getProviderStore.provider);
    return contract.borrowBalanceCurrent(this.account);
  };

  getExchangeRate = () => {
    const contract = this.isEther
      ? CEtherContract(this.cToken, getProviderStore.provider)
      : CErc20Contract(this.cToken, getProviderStore.provider);
    return contract.exchangeRateStored();
  };

  getCash = () => {
    const contract = this.isEther
      ? CEtherContract(this.cToken, getProviderStore.provider)
      : CErc20Contract(this.cToken, getProviderStore.provider);
    return contract.getCash();
  };

  getName = () => {
    const contract = this.isEther
      ? CEtherContract(this.cToken, getProviderStore.provider)
      : CErc20Contract(this.cToken, getProviderStore.provider);
    return contract.name();
  };

  getTotalBorrows = () => {
    const contract = this.isEther
      ? CEtherContract(this.cToken, getProviderStore.provider)
      : CErc20Contract(this.cToken, getProviderStore.provider);
    return contract.totalBorrows();
  };

  getTotalSupply = () => {
    const contract = this.isEther
      ? CEtherContract(this.cToken, getProviderStore.provider)
      : CErc20Contract(this.cToken, getProviderStore.provider);
    return contract.totalSupply();
  };

  getExchangeRateStored = () => {
    const contract = this.isEther
      ? CEtherContract(this.cToken, getProviderStore.provider)
      : CErc20Contract(this.cToken, getProviderStore.provider);
    return contract.exchangeRateStored();
  };
}
