import { IRequestConfigExecute, IRequestConfigInternal, ITransportAdapter, WaasResponse } from '../interfaces';
import { WaasCommonMethod } from './waas-common-method.class';
import { WaasServiceTreeNode } from './waas-service-tree-node.class';

describe('WaasCommonMethod', () => {
  let transport: ITransportAdapter;
  let instance: WaasCommonMethod;
  let node: WaasServiceTreeNode;

  beforeEach(() => {
    transport = {
      executeRequest<T>(config: IRequestConfigInternal): WaasResponse<T> {
        const res = { on: () => res } as any;

        return res;
      },
    };
    node = new WaasServiceTreeNode();
    node.variables = [];
    instance = new WaasCommonMethod(transport, node);
  });

  it('should create WaasCommonMethod instance', () => {
    const obj = new WaasCommonMethod(null, new WaasServiceTreeNode());
    const data = { before: (data1: IRequestConfigExecute) => data1, after: data1 => data1 };
    expect(transport.executeRequest(data)).toBeDefined();
    expect(obj).toBeDefined();
  });

  it('should create WaasCommonMethod get', () => {
    const spy = spyOn(instance, 'get');
    instance.get<any>({});
    expect(spy).toHaveBeenCalled();
  });

  it('should create WaasCommonMethod post', () => {
    const spy = spyOn(instance, 'post');
    instance.post<any>({});
    expect(spy).toHaveBeenCalled();
  });

  it('should create WaasCommonMethod put', () => {
    const spy = spyOn(instance, 'put');
    instance.put<any>({});
    expect(spy).toHaveBeenCalled();
  });

  it('should create WaasCommonMethod patch', () => {
    const spy = spyOn(instance, 'patch');
    instance.patch<any>({});
    expect(spy).toHaveBeenCalled();
  });

  it('should create WaasCommonMethod delete', () => {
    const spy = spyOn(instance, 'delete');
    instance.delete<any>({});
    expect(spy).toHaveBeenCalled();
  });
});
