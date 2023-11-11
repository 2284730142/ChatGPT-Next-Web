import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export interface AxiosConfig {
  retry?: number;
  retryDelay?: number;
}

export class Axios {
  private static _instance: Axios;
  private static _axios: AxiosInstance;
  private static _defaultConfig: AxiosRequestConfig & AxiosConfig;

  constructor(config?: AxiosRequestConfig & AxiosConfig) {
    if (Axios._instance) {
      return Axios._instance;
    }
    console.log(`正在初始化axios实例，初始化配置 数据内容`, config);
    Axios._instance = this;
    Axios._defaultConfig = {
      timeout: 3 * 60 * 1000,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      ...config,
    };
    Axios._axios = axios.create(Axios._defaultConfig);
    Axios._axios.interceptors.request.use((config: any) => {
      // todo 添加日志等操作
      return config;
    });
    Axios._axios.interceptors.response.use((response: any) => {
      // todo 添加日志等操作
      return response;
    });
    return Axios._instance;
  }

  public static get instance(): Axios {
    return new Axios();
  }

  public static async request<T>(
    options: AxiosRequestConfig & AxiosConfig,
  ): Promise<AxiosResponse<T>> {
    if (!Axios._instance) {
      throw new Error(
        "需要先在全局进行初始化实例 new Axios(config) 并传入默认配置后再进行请求操作",
      );
    }
    const {
      retry = 1,
      retryDelay = 1000,
      timeout = 3 * 60 * 1000,
      ..._options
    } = options;
    let retryCount = 0;
    const cancelTokenSource = axios.CancelToken.source();
    const timeoutId = setTimeout(
      () => cancelTokenSource.cancel("timeout"),
      timeout,
    );
    const callApi = async (): Promise<AxiosResponse<T>> => {
      try {
        const response = await Axios._axios.request({
          ..._options,
          cancelToken: cancelTokenSource.token,
        });
        clearTimeout(timeoutId);
        return response;
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (axios.isCancel(err)) {
          throw err;
        }
        if (retryCount < retry) {
          retryCount++;
          console.log(
            `在${retryDelay}ms之后重新尝试请求结果，次数：${retryCount}`,
          );
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          return callApi();
        }
        console.error(`已超过最大重试次数: ${err.message}`);
        throw err;
      }
    };

    return callApi();
  }

  public static async get<T>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ url, method: "GET", params, ...config });
  }

  public static async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ url, method: "POST", data, ...config });
  }

  public static async getJson<T>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.get<T>(url, params, {
      ...config,
      responseType: "json",
    });
    return response.data;
  }

  public static async postJson<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.post<T>(url, data, {
      ...config,
      responseType: "json",
    });
    return response.data;
  }
}
