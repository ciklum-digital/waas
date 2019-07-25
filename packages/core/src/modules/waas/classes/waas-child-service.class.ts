import { ITransportAdapter, IWaasChildService, IWaasPlugin, RequestEventEnum } from '../interfaces';
import { WaasCommonMethod } from './waas-common-method.class';
import { WaasServiceTreeNode } from './waas-service-tree-node.class';

export class WaasChildService extends WaasCommonMethod implements IWaasChildService {
  constructor(node: WaasServiceTreeNode, transport: ITransportAdapter, plugins: IWaasPlugin[] = []) {
    super(transport, node);
    this.plugins = plugins;
  }

  on(event: RequestEventEnum, callback: (data: any) => void): IWaasChildService {
    this.node.on(event, callback);

    return this;
  }

  call(event: RequestEventEnum, data?: any) {
    this.node.call(event);
  }
}
