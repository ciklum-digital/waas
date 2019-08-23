import { IWaasPlugin } from './waas-plugin.interface';
import { IServiceRegistration } from './service-registration.interface';
import { IWaasChildService } from './waas-child-service.interface';
import { IWaasCommonMethod } from './waas-common-method.interface';
import { IWaasEventEmitter } from './waas-event-emitter.interface';

export interface IWaasService extends IWaasEventEmitter<IWaasService>, IWaasCommonMethod {
  getBasePath: string;
  service(alias: string): IWaasChildService;
  registration(service: IServiceRegistration): IWaasService;
  addPlugins(plugins: IWaasPlugin[]);
}
