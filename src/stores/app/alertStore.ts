import { makeAutoObservable } from "mobx";
import React from "react";

export enum ALERT_TYPE {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

export class AlertStore {
  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  displayAlert = false;
  alertMessage = "";
  alertType: ALERT_TYPE = ALERT_TYPE.SUCCESS;

  alertClick = () => {
    this.displayAlert = true;
  };

  alertClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    this.displayAlert = false;
  };
}
