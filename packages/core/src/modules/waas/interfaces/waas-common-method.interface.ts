import { IRequestConfig } from './request-config.interface';
import { WaasResponse } from './waas-response.class';

export interface IWaasCommonMethod {
  get<T>(config?: IRequestConfig): WaasResponse<T>;
  post<T>(config?: IRequestConfig): WaasResponse<T>;
  put<T>(config?: IRequestConfig): WaasResponse<T>;
  patch<T>(config?: IRequestConfig): WaasResponse<T>;
  delete<T>(config?: IRequestConfig): WaasResponse<T>;
}
