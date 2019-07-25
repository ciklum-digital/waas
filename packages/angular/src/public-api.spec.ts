import { publicApi } from './public-api';

describe('Public Api', () => {
  it('should returns "null"', () => {
    expect(publicApi()).toBe(null);
  });
});
