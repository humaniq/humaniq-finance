import { action, makeAutoObservable } from "mobx";
import { Logger } from "../../utils/logger";
import { ApiService } from "../../services/apiService/apiService";
import { getProviderStore } from "../../App";

class Store {
  api: ApiService;

  constructor() {
    makeAutoObservable(this);
    this.api = new ApiService();
    this.api.init();
  }

  @action
  onSubmit = async () => {
    const timeStamp = new Date().getTime();
    const request = `ADDRESS ${getProviderStore.currentAccount} UPDATE PERSONAL INFO TIMESTAMP ${timeStamp}`;

    try {
      const result = await getProviderStore.personalMessageRequest(request);

      if (result) {
        // proceed
      }
    } catch (e) {
      Logger.info(e);
    }
  };
}

export const SomeStore = new Store();
