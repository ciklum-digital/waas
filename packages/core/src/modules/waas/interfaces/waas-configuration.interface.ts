import { IWaasHooks } from './waas-hooks.interface';

export interface IWaasConfiguration {
  basePath: string;
  hooks?: IWaasHooks;
}
