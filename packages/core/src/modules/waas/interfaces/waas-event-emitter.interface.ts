import { RequestEventEnum } from './request-event.enum';

export interface IWaasEventEmitter<T> {
  on(event: RequestEventEnum, callback: (data: any) => void): T;
  call(event: RequestEventEnum, data?: any);
}
