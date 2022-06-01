import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { formatRoute } from "utils/network";
import BuildUrl from "build-url"
import {BASE_URL} from "constants/network"

export interface ApiServiceResponse<T> extends AxiosResponse<T> {
  isOk: boolean;
}

export class ApiService {
  protected axios: AxiosInstance;

  init = (baseURL: string = BASE_URL, headers = {}) => {
    this.axios = axios.create({ baseURL, headers });

    this.axios.interceptors.response.use(
      function (response) {
        return { ...response, isOk: true };
      },
      function (error) {
        return Promise.resolve({ ...error, isOk: false }); // Promise.reject(error);
      }
    );
  };

  get = <T>(path: string, params?: BuildUrl.BuildUrlOptions, config?: AxiosRequestConfig) => {
    return this.axios.get(BuildUrl(path, params), config) as Promise<
      ApiServiceResponse<T>
      >;
  }

  post = <T>(
    path: string,
    body?: any,
    params?: any,
    config?: AxiosRequestConfig
  ) =>
    this.axios.post(
      params ? formatRoute(path, params) : path,
      body,
      config
    ) as Promise<ApiServiceResponse<T>>;

  put = <T>(
    path: string,
    body?: any,
    params?: any,
    config?: AxiosRequestConfig
  ) =>
    this.axios.put(
      params ? formatRoute(path, params) : path,
      body,
      config
    ) as Promise<ApiServiceResponse<T>>;
}