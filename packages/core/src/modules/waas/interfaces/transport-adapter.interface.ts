import { IRequestConfigExecute } from './request-config-execute.interface';
import { WaasResponse } from './waas-response.class';

export interface ITransportAdapter {
  executeRequest<T>(config: IRequestConfigExecute): WaasResponse<T>;
}
