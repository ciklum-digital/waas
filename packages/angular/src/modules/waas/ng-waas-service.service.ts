import { Inject, Injectable, InjectionToken } from '@angular/core';
import { IRequestConfig, IServiceRegistration, IWaasChildService, IWaasPlugin, IWaasService, RequestEventEnum,
  WaasResponse } from '@waas/core';

export const WaasServiceConfig = new InjectionToken('WAAS-SERVICE-CONFIG');
export const WaasTransportAdapter = new InjectionToken('WAAS-TRANSPORT-ADAPTER');

@Injectable()
export class NgWaasService implements IWaasService {
  constructor(@Inject('WAAS-SERVICE-CONFIG') config: any, @Inject('WAAS-TRANSPORT-ADAPTER') transport: any) { }

  get getBasePath(): string {
    return undefined;
  }

  call(event: RequestEventEnum) {
  }

  delete<T>(config?: IRequestConfig): WaasResponse<T> {
    return undefined;
  }

  get<T>(config?: IRequestConfig): WaasResponse<T> {
    return undefined;
  }

  on(event: RequestEventEnum, callback: (data: any) => void): IWaasService {
    return undefined;
  }

  patch<T>(config?: IRequestConfig): WaasResponse<T> {
    return undefined;
  }

  post<T>(config?: IRequestConfig): WaasResponse<T> {
    return undefined;
  }

  put<T>(config?: IRequestConfig): WaasResponse<T> {
    return undefined;
  }

  registration(service: IServiceRegistration): IWaasService {
    return undefined;
  }

  service(alias: string): IWaasChildService {
    return undefined;
  }

  addPlugins(plugins: IWaasPlugin[]) {
  }
}
