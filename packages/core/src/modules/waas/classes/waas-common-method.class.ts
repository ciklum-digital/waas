import {
  IRequestConfig, IRequestConfigExecute, IRequestConfigInternal, ITransportAdapter, IWaasCommonMethod, IWaasPlugin,
  normalizeHooks, RequestEventEnum, toArray, WaasResponse,
} from '../interfaces';
import { WaasServiceTreeNode } from './waas-service-tree-node.class';

export class WaasCommonMethod implements IWaasCommonMethod {
  protected plugins: IWaasPlugin[] = [];

  constructor(protected transport: ITransportAdapter, protected node: WaasServiceTreeNode) {}

  static convertToInternal(config: IRequestConfig, method: string): IRequestConfigInternal {
    return { method, ...config };
  }

  get<T>(config: IRequestConfig = {}): WaasResponse<T> {
    return this.executeRequest(WaasCommonMethod.convertToInternal(config, 'GET'));
  }

  patch<T>(config: IRequestConfig = {}): WaasResponse<T> {
    return this.executeRequest(WaasCommonMethod.convertToInternal(config, 'PATCH'));
  }

  post<T>(config: IRequestConfig = {}): WaasResponse<T> {
    return this.executeRequest(WaasCommonMethod.convertToInternal(config, 'POST'));
  }

  put<T>(config: IRequestConfig = {}): WaasResponse<T> {
    return this.executeRequest(WaasCommonMethod.convertToInternal(config, 'PUT'));
  }

  delete<T>(config: IRequestConfig = {}): WaasResponse<T> {
    return this.executeRequest(WaasCommonMethod.convertToInternal(config, 'DELETE'));
  }

  protected executeRequest<T>(config: IRequestConfigInternal): WaasResponse<T> {
    const cfg = this.updateConfig(config);
    let result = this.executePlugins<T>(cfg);
    result = (result instanceof WaasResponse) ? result : this.transport.executeRequest<T>(cfg);
    result.on(RequestEventEnum.request, () => this.node.call(RequestEventEnum.request))
      .on(RequestEventEnum.cancel, () => this.node.call(RequestEventEnum.cancel))
      .on(RequestEventEnum.error, () => this.node.call(RequestEventEnum.error))
      .on(RequestEventEnum.failure, () => this.node.call(RequestEventEnum.failure))
      .on(RequestEventEnum.success, () => this.node.call(RequestEventEnum.success));

    return result;
  }

  private updateConfig(cfg: IRequestConfigInternal = {}): IRequestConfigExecute {
    cfg.hooks = normalizeHooks(cfg.hooks);
    const config = this.node.eval(cfg);
    const result = {
      url: config.url,
      method: config.method,
      body: config.body,
      headers: config.headers,
      params: config.params,
    } as IRequestConfigExecute;
    result.after = (data: any) => {
      let d = data;
      toArray(config.hooks.after).forEach(fn => d = fn(d));

      return d;
    };
    result.before = (data: IRequestConfigExecute) => {
      let d = data;
      toArray(config.hooks.before).forEach(fn => d = fn(d));

      return d;
    };

    return result;
  }

  private executePlugins<T>(config: IRequestConfigExecute): WaasResponse<T> | void {
    if (this.plugins.length === 0) {
      return;
    }
    for (const plugin of this.plugins) {
      const res = plugin.executeRequest<T>(config);
      if (res instanceof WaasResponse) {
        return res;
      }
    }

    return;
  }
}
