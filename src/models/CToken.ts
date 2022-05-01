import CEtherContract from "models/contracts/CEtherContract";
import CErc20Contract from "models/contracts/CErc20Contract";

export class Ctoken {
  cToken: any;
  account: any;
  isEther: boolean;
  methods: any;

  constructor(cToken: any, account: any, isEth: boolean) {
    this.cToken = cToken;
    this.account = account;
    this.isEther = isEth;
    this.methods = isEth
      ? CEtherContract(cToken).methods
      : CErc20Contract(cToken).methods;
  }

  supply = (value: any, gas: any) => {
    const params: any = { from: this.account };
    if (this.isEther) {
      params.value = value;
      params.gas = gas;

      return this.methods.mint().send(params);
    }

    return this.methods.mint(value).send(params);
  };

  getEstimateGas = (method: any, value: any) => {
    return this.methods[method]().estimateGas({ from: this.account, value });
  };

  borrow = (value: any) => {
    return this.methods.borrow(value).send({ from: this.account });
  };

  repayBorrow = (value: any) => {
    if (this.isEther) {
      return this.methods.repayBorrow().send({
        from: this.account,
        value,
      });
    }
    return this.methods.repayBorrow(value).send({ from: this.account });
  };

  withdraw = (value: any) => {
    return this.methods.redeemUnderlying(value).send({ from: this.account });
  };

  supplyRatePerBlock = () => {
    return this.methods.supplyRatePerBlock().call();
  };

  borrowRatePerBlock = () => {
    return this.methods.borrowRatePerBlock().call();
  };

  getDecimals = () => {
    return this.methods.decimals().call();
  };

  balanceOfUnderlying = () => {
    return this.methods.balanceOfUnderlying(this.account).call();
  };

  borrowBalanceCurrent = () => {
    return this.methods.borrowBalanceCurrent(this.account).call();
  };

  getExchangeRate = () => {
    return this.methods.exchangeRateStored().call();
  };

  getCash = () => {
    return this.methods.getCash().call();
  };
}
