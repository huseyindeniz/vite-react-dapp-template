import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export interface HttpServiceConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  requestInterceptors?: Array<
    (
      config: InternalAxiosRequestConfig
    ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
  >;
  requestErrorInterceptor?: (error: unknown) => unknown;
  responseInterceptors?: Array<
    (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>
  >;
  responseErrorInterceptor?: (error: unknown) => unknown;
}
