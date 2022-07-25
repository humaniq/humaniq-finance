import * as addrs from "@/config/env";

export default [
  {
    name: "ETH",
    apy: "9,98",
    token: addrs.CETHER_ADDRESS,
    cToken: addrs.CETHER_ADDRESS,
  },
  {
    name: "eRSDL",
    apy: "20,12",
    token: addrs.ERSDL_ADDRESS,
    cToken: addrs.CERSDL_ADDRESS,
  },
  {
    name: "BAT",
    apy: "20,65",
    token: addrs.BAT_ADDRESS,
    cToken: addrs.CBAT_ADDRESS,
  },
  {
    name: "DAI",
    apy: "21.16",
    token: addrs.DAI_ADDRESS,
    cToken: addrs.CDAI_ADDRESS,
  },
  {
    name: "REP",
    apy: "10,99",
    token: addrs.REP_ADDRESS,
    cToken: addrs.CREP_ADDRESS,
  },
  {
    name: "USDC",
    apy: "54,21",
    token: addrs.USDC_ADDRESS,
    cToken: addrs.CUSDC_ADDRESS,
  },
  {
    name: "ZRX",
    apy: "2,12",
    token: addrs.ZRX_ADDRESS,
    cToken: addrs.CZRX_ADDRESS,
  },
];
