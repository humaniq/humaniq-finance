export type tCompoundLensContract = {
  [key: number]: string;
  allocated: string;
  balance: string;
};

export type tAccountLiquidity = {
  [key: number]: string;
};

export type ProviderMessage = {
  type: string;
  message: unknown;
};

export type ConnectInfo = {
  chainId: string;
};
