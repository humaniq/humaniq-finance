import {ContractInterface, ethers} from "ethers"

const abi: ContractInterface = [ {
  "name": "transfer",
  "type": "function",
  "inputs": [
    {
      "name": "_to",
      "type": "address"
    },
    {
      "type": "uint256",
      "name": "_tokens"
    }
  ],
  "constant": false,
  "outputs": [],
  "payable": false
} ]

export const ERC20Contract = (address: string, provider: any) => new ethers.Contract(address, abi, provider)