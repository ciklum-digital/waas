import { IRequestConfig } from './request-config.interface';
import { IWaasHooks } from './waas-hooks.interface';

export interface IRequestConfigInternal extends IRequestConfig {
  method?: string;
  hooks?: IWaasHooks;
  url?: string;
}
