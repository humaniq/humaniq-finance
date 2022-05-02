import FaucetNonStandardToken from "models/contracts/FaucetNonStandardTokenContract";
import FaucetContract from "models/contracts/FaucetContract";

export class FaucetToken {
  token: any;
  cToken: any;
  account: any;
  methods: any;

  constructor(token: any, cToken: any, account: any, isNonStandart: boolean) {
    this.token = token;
    this.cToken = cToken;
    this.account = account;
    this.methods = isNonStandart
      ? FaucetNonStandardToken(this.token).methods
      : FaucetContract(this.token).methods;
  }

  allocateTo = (value: any) => {
    return this.methods
      .allocateTo(this.account, value)
      .send({ from: this.account });
  };
}
