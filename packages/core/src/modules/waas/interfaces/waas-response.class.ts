import { Observable } from 'rxjs';

import { RequestEventEnum } from './request-event.enum';
import { IWaasEventEmitter } from './waas-event-emitter.interface';

export class WaasResponse<T> extends Observable<T> implements IWaasEventEmitter<WaasResponse<T>> {
  private events: { [key: string]: ((data: any) => void)[] } = {};

  on(event: RequestEventEnum, callback: (data: any) => void): WaasResponse<T> {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);

    return this;
  }

  cancel() {}

  call(event: RequestEventEnum, data?: any) {
    const events = this.events[event] || [];
    events.forEach(callback => callback(data));
  }
}
