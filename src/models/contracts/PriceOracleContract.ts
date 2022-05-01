import { AbiItem } from "web3-utils";

const abi: AbiItem[] | AbiItem = [
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

// Here is just only abi because we haven't created auction yet.
export default (address?: string) => {
  return new window.web3.eth.Contract(abi, address);
};
