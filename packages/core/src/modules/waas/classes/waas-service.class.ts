import {
  IServiceRegistration, ITransportAdapter, IWaasChildService, IWaasConfiguration, IWaasPlugin, IWaasService,
  normalizeHooks, RequestEventEnum,
} from '../interfaces';
import { WaasChildService } from './waas-child-service.class';
import { WaasCommonMethod } from './waas-common-method.class';
import { WaasServiceTreeNode } from './waas-service-tree-node.class';

export class WaasService extends WaasCommonMethod implements IWaasService {
  private services: { [key: string]: WaasServiceTreeNode } = {};

  constructor(transport: ITransportAdapter, private configuration: IWaasConfiguration) {
    super(transport, new WaasServiceTreeNode());
    this.node.path = this.configuration.basePath;
    this.node.hooks = normalizeHooks(this.configuration.hooks);
  }

  get getBasePath(): string {
    return this.configuration.basePath;
  }

  static getAlias(service: IServiceRegistration): string {
    if (!!service.alias) {
      return service.alias;
    }
    const parts = service.path.split('/');

    return parts.reduce((prev, curr) => {
      if (curr.indexOf(':') === 0 || curr === '') {
        return prev;
      }

      return prev + (prev !== undefined ? prev : '') + curr.toLowerCase();
    });
  }

  on(event: RequestEventEnum, callback: (data: any) => void) {
    this.node.on(event, callback);

    return this;
  }

  call(event: RequestEventEnum) {
    this.node.call(event);
  }

  registration(service: IServiceRegistration): IWaasService {
    const alias = WaasService.getAlias(service);
    if (!!this.services[alias]) {
      console.warn(`WaasService alias "${alias} is defined"`);

      return this;
    }
    const node = this.node.build(service.path);
    node.hooks = normalizeHooks(service.hooks);
    this.services[alias] = node;

    return this;
  }

  service(alias: string): IWaasChildService {
    const node = this.services[alias];
    if (!node) {
      console.warn(`WaasService alias "${alias} is not defined"`);

      return null;
    }

    return new WaasChildService(node, this.transport, this.plugins);
  }

  addPlugins(plugins: IWaasPlugin[] = []) {
    this.plugins = [...this.plugins, ...plugins.map(plugin => plugin.init(this))];
  }
}
