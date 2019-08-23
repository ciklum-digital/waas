import { IRequestConfigInternal, IWaasHooks, toArray } from '../interfaces';
import { WaasEventEmitter } from './waas-event-emitter.class';

export interface PathElement {
  path: string;
  variables: string[];
}

export class WaasServiceTreeNode extends WaasEventEmitter {
  path: string;
  variables: string[] = [];
  parentNode: WaasServiceTreeNode = null;
  children: { [key: string]: WaasServiceTreeNode } = {};
  hooks: IWaasHooks = { after: [], before: [] };

  constructor(parent: WaasServiceTreeNode = null) {
    super(parent);
    this.parentNode = parent;
  }

  static isVariable(path: string): boolean {
    return (path || '').indexOf(':') === 0;
  }

  static parsePath(path: string): PathElement[] {
    const temp = path.split('/');
    const parts = [];
    temp.filter(item => item !== '').forEach((p) => {
      if (WaasServiceTreeNode.isVariable(p)) {
        return parts[parts.length - 1].variables.push(p.substring(1));
      }
      parts.push({ path: p, variables: [] });
    });

    return parts;
  }

  build(path: string): WaasServiceTreeNode {
    const parts = WaasServiceTreeNode.parsePath(path);

    return this.buildPath(parts);
  }

  eval(cfg: IRequestConfigInternal): IRequestConfigInternal {
    let config = cfg;
    let url = this.variables
      .map(param => (config.params || {})[param])
      .reduce((curr, next) => {
        if (next === null || next === undefined) {
          return curr;
        }

        return `${curr || ''}/${next}`;
      });
    url = (!!this.parentNode ? '/' : '') + this.path + url;

    config.hooks.before = [...toArray(this.hooks.before), ...toArray(config.hooks.before)];
    config.hooks.after = [...toArray(this.hooks.after), ...toArray(config.hooks.after)];
    if (this.parentNode !== null) {
      config = this.parentNode.eval(config);
    }
    config.url = (config.url || '') + url;

    return config;
  }

  private buildPath(parts: PathElement[]): WaasServiceTreeNode {
    if (parts.length === 0) {
      return this;
    }
    const part = parts.shift();
    let node = this.getChild(part.path);
    if (node === null) {
      node = this.createChild(part);
    }

    return node.buildPath(parts);
  }

  private getChild(path: string): WaasServiceTreeNode {
    const result = this.children[path];

    return !!result ? result : null;
  }

  private createChild(part: PathElement): WaasServiceTreeNode {
    const result = new WaasServiceTreeNode(this);
    result.path = part.path;
    result.variables = part.variables;

    return result;
  }
}
