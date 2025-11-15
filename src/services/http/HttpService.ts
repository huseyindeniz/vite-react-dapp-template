import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import log from 'loglevel';

import { IHttpService } from '@/core/features/app/types/IHttpService';

import { HttpServiceConfig } from './types/HttpServiceConfig';

export class HttpService implements IHttpService {
  private axiosInstance: AxiosInstance;

  private constructor(config: HttpServiceConfig) {
    // Create axios instance with base configuration
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    // Register request interceptors
    if (config.requestInterceptors) {
      config.requestInterceptors.forEach(interceptor => {
        this.axiosInstance.interceptors.request.use(
          interceptor,
          config.requestErrorInterceptor
        );
      });
    }

    // Register response interceptors
    if (config.responseInterceptors) {
      config.responseInterceptors.forEach(interceptor => {
        this.axiosInstance.interceptors.response.use(
          interceptor,
          config.responseErrorInterceptor
        );
      });
    }
  }

  /**
   * Factory method to create HttpService instance with configuration
   */
  static create(config: HttpServiceConfig): HttpService {
    return new HttpService(config);
  }

  /**
   * HTTP GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error, 'GET', url);
      throw error;
    }
  }

  /**
   * HTTP POST request
   */
  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error, 'POST', url);
      throw error;
    }
  }

  /**
   * HTTP PUT request
   */
  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error, 'PUT', url);
      throw error;
    }
  }

  /**
   * HTTP PATCH request
   */
  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error, 'PATCH', url);
      throw error;
    }
  }

  /**
   * HTTP DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error, 'DELETE', url);
      throw error;
    }
  }

  /**
   * Default error handler - logs errors
   * Can be overridden by responseErrorInterceptor in config
   */
  private handleError(error: unknown, method: string, url: string): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      log.error(`HTTP ${method} ${url} failed:`, {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        message: axiosError.message,
      });
    } else {
      log.error(`HTTP ${method} ${url} failed:`, error);
    }
  }
}
