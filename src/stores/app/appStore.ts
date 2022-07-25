import { makeAutoObservable } from "mobx";
import { AlertStore } from "./alertStore";

export class AppStore {
  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  alert = new AlertStore();
}

export const app = new AppStore();
