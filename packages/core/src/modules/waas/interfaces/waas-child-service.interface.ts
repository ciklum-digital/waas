import { IWaasCommonMethod } from './waas-common-method.interface';
import { IWaasEventEmitter } from './waas-event-emitter.interface';

export interface IWaasChildService extends IWaasEventEmitter<IWaasChildService>, IWaasCommonMethod {
}
