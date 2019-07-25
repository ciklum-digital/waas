import { RequestEventEnum, IWaasEventEmitter } from '../interfaces';

export class WaasEventEmitter implements IWaasEventEmitter<WaasEventEmitter> {
  private events: {[key: string]: ((data: any) => void)[]} = {};

  constructor(private parent: IWaasEventEmitter<WaasEventEmitter> = null) {}

  on(event: RequestEventEnum, callback: (data: any) => void): WaasEventEmitter {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);

    return this;
  }

  call(event: RequestEventEnum, data?: any) {
    const events = this.events[event] || [];
    events.forEach(callback => callback(data));
    if (!!this.parent) {
      this.parent.call(event, data);
    }
  }
}
