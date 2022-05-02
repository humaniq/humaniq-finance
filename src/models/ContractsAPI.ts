import CEtherContract from "models/contracts/CEtherContract";

const ethTokenSymbol = "unETH";

export const isEther = async (token: any) => {
  const symbol = await CEtherContract(token).methods.symbol().call();

  return symbol === ethTokenSymbol;
};
