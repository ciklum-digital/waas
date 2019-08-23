import { toArray } from './utils';
import { IWaasHooks } from './waas-hooks.interface';

export function normalizeHooks(hooks: IWaasHooks): IWaasHooks {
  return {
    before: toArray((hooks || {}).before),
    after: toArray((hooks || {}).after),
  };
}
