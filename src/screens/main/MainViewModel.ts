import { makeAutoObservable, makeObservable } from "mobx";
import { renderShortAddress } from "../../utils/address";
import { t } from "i18next";

export class MainViewModel {
  tokenList = [
    {
      id: 0,
      title: "Wrapped Bitcoin",
      coin: "WBTC",
      amountUSD: "$200",
      amountCOIN: "0.0047",
    },
    {
      id: 1,
      title: "Binance USD",
      coin: "BUSD",
      amountUSD: "$100",
      amountCOIN: "100",
    },
    {
      id: 2,
      title: "Binance USD",
      coin: "BUSD",
      amountUSD: "$100",
      amountCOIN: "100",
    },
    {
      id: 3,
      title: "Binance USD",
      coin: "BUSD",
      amountUSD: "$100",
      amountCOIN: "100",
    },
  ];

  borrowList = [
    {
      id: 0,
      title: "Wrapped Bitcoin",
      coin: "WBTC",
      amountUSD: "$200",
      amountCOIN: "0.0047",
    },
    {
      id: 1,
      title: "Binance USD",
      coin: "BUSD",
      amountUSD: "$100",
      amountCOIN: "100",
    },
    {
      id: 2,
      title: "Binance USD",
      coin: "BUSD",
      amountUSD: "$100",
      amountCOIN: "100",
    },
    {
      id: 3,
      title: "Binance USD",
      coin: "BUSD",
      amountUSD: "$100",
      amountCOIN: "100",
    },
  ];

  constructor() {
    makeAutoObservable(this);
  }

  currentAddress?: string = "0xCA112f9Dec9790EAAd4F678901196BeEaaEB4C60";

  get getFormattedAddress() {
    return renderShortAddress(this.currentAddress) || t("wallet.notConnected");
  }
}
