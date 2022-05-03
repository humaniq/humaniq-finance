import { ContractInterface, ethers } from "ethers";

const abi: ContractInterface = [
  {
    constant: true,
    inputs: [
      { internalType: "contract CToken", name: "cToken", type: "address" },
    ],
    name: "getUnderlyingPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "isPriceOracle",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

export const PriceOracleContract = (address: string, provider: any) =>
  new ethers.Contract(address, abi, provider);
