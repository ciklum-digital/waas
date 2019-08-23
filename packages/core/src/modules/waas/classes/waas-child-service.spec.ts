import { WaasChildService } from './waas-child-service.class';

describe('WaasChildService', () => {
  it('should create WaasChildService instance', () => {
    const srv: any = {};
    const obj = new WaasChildService(null, srv);
    expect(obj).toBeDefined();
  });
});
