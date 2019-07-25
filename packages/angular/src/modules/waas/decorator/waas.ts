import { IWaasChildService } from '@waas/core';

import { NgWaasService } from '../ng-waas-service.service';
import { WaasModule } from '../waas.module';

export function Waas(alias: string) {
  return function(target: any, key: string) {
    let service: IWaasChildService;
    Object.defineProperty(target, key, {
      configurable: false,
      get: () => {
        if (!!service) {
          return service;
        }
        const serviceWaas = WaasModule.injector.get<NgWaasService>(NgWaasService);
        service = serviceWaas.service(alias);

        return service;
      },
    });
  };
}
