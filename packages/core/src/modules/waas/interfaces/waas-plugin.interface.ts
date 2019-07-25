import { WaasResponse } from './waas-response.class';
import { IRequestConfigExecute } from './request-config-execute.interface';
import { IWaasService } from './waas-service.interface';

export interface IWaasPlugin {
  init(waas: IWaasService): IWaasPlugin;
  executeRequest<T>(config: IRequestConfigExecute): WaasResponse<T> | void;
}
