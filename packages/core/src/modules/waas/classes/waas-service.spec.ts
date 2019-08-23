import { WaasService } from './waas-service.class';

const urlbookAuthor = '/book/author';

describe('WaasService', () => {
  it('should create WaasService instance', () => {
    const obj = new WaasService(null, { basePath: '/api' });
    expect(obj).toBeDefined();
  });

  it('should register service', () => {
    const obj = new WaasService(null, { basePath: '/api' });
    const spy = spyOn(console, 'warn');
    obj.registration({
      path: '/book',
    }).registration({
      path: urlbookAuthor,
    }).registration({
      path: urlbookAuthor,
    });
    expect(obj).toBeDefined();
    expect(spy).toHaveBeenCalled();
  });

  it('should return service', () => {
    const obj = new WaasService(null, { basePath: '/api' });
    obj.registration({
      path: '/book',
    }).registration({
      path: urlbookAuthor,
    }).registration({
      path: '/book/author/test',
      alias: 'test',
    });
    expect(obj.service('book')).toBeDefined();
    expect(obj.service('book-author')).toBeDefined();
    expect(obj.service('test')).toBeDefined();
  });
});
