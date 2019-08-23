import { IWaasHooks } from './waas-hooks.interface';

export interface IServiceRegistration {
  path: string;
  alias?: string;
  hooks?: IWaasHooks;
}
