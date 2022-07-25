import { CEtherContract } from "models/contracts/CEtherContract";
import { getProviderStore } from "App";

const ethTokenSymbol = "unETH";

export const isEther = async (token: any) => {
  const symbol = await CEtherContract(
    token,
    getProviderStore.currentProvider
  ).symbol();

  return symbol === ethTokenSymbol;
};
