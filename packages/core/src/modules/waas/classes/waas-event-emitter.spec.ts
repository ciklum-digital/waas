import { RequestEventEnum } from '../interfaces';
import { WaasEventEmitter } from './waas-event-emitter.class';

class TestEmitter extends WaasEventEmitter {
  constructor(parent: WaasEventEmitter = null) {
    super(parent);
  }

  executeCall(event: RequestEventEnum) {
    this.call(event);
  }
}

describe('WaasEventEmitter', () => {
  it('should create WaasEventEmitter instance', () => {
    const obj = new WaasEventEmitter();
    expect(obj).toBeDefined();
  });

  it('should call event', () => {
    const event = { test: () => {} };
    const spy = spyOn(event, 'test');
    const obj = new TestEmitter();
    obj.on(RequestEventEnum.request, () => event.test());
    obj.executeCall(RequestEventEnum.request);
    expect(spy).toHaveBeenCalled();
  });

  it('should call parent event', () => {
    const event = { test: () => {} };
    const spy = spyOn(event, 'test');
    const obj = new TestEmitter();
    const objChild = new TestEmitter(obj);
    obj.on(RequestEventEnum.request, () => event.test());
    objChild.executeCall(RequestEventEnum.request);
    expect(spy).toHaveBeenCalled();
  });
});
