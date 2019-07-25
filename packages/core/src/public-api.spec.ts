import { WaasService } from './public-api';

describe('Check export', () => {
  it('should returns "object"', () => {
    expect(new WaasService(null, { basePath: '', hooks: {} })).toBeDefined();
  });
});
