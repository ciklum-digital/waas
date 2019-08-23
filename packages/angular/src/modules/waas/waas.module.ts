import { HttpClientModule } from '@angular/common/http';
import { Inject, InjectionToken, Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { IServiceRegistration, IWaasConfiguration, WaasService } from '@waas/core';

import { NgWaasService, WaasServiceConfig, WaasTransportAdapter } from './ng-waas-service.service';

export const NG_WAAS_SERVICES = new InjectionToken('NG_WAAS_SERVICES');
export const NG_WAAS_SERVICES_TRANSPORT = new InjectionToken('NG_WAAS_SERVICES_TRANSPORT');
export const NG_WAAS_SERVICES_INIT_FUNCTION = new InjectionToken('NG_WAAS_SERVICES_INIT_FUNCTION');

export function factoryWaasService(transport, config, ...plugins) {
  const result = new WaasService(transport, config);
  result.addPlugins(plugins);

  return result;
}

const uniqServices = new Set();

@NgModule({})
export class WaasFeatureModule {
  constructor(waas: NgWaasService, @Inject(NG_WAAS_SERVICES) services: IServiceRegistration[][], injector: Injector,
              @Inject(NG_WAAS_SERVICES_INIT_FUNCTION) afterInit: Function[]) {
    let flatten = ([] as any[]).concat(...services);
    flatten = flatten.filter(item => !uniqServices.has(item.path));
    flatten.forEach((service) => {
      uniqServices.add(service.path);
      waas.registration(service);
    });
    setTimeout(() => {
      (afterInit || []).forEach((init) => {
        if (!!init && !uniqServices.has(init)) {
          uniqServices.add(init);
          init(injector);
        }
      });
    });

  }
}

export function factoryTransport(type: any, ...args) {
  return new type(...args);
}

@NgModule({
  imports: [HttpClientModule],
  declarations: [],
  exports: [],
})
export class WaasModule {
  static injector: Injector = undefined;

  constructor(private readonly injector: Injector) {
    WaasModule.injector = this.injector;
  }

  static forRoot(config: IWaasConfiguration, deps: any[], transport: any, plugins: any[] = [])
    : ModuleWithProviders {
    return {
      ngModule: WaasModule,
      providers: [
        {
          provide: WaasServiceConfig,
          useValue: config,
        },
        {
          provide: NG_WAAS_SERVICES_TRANSPORT,
          useValue: transport,
        },
        {
          provide: WaasTransportAdapter,
          deps: [NG_WAAS_SERVICES_TRANSPORT, ...deps],
          useFactory: factoryTransport,
        },
        {
          provide: NgWaasService,
          deps: [WaasTransportAdapter, WaasServiceConfig, ...plugins],
          useFactory: factoryWaasService,
        },
      ],
    };
  }

  static forFeature(services: IServiceRegistration[] = [], afterInit: Function = null): ModuleWithProviders {
    return {
      ngModule: WaasFeatureModule,
      providers: [
        {
          provide: NG_WAAS_SERVICES,
          multi: true,
          useValue: services,
        },
        {
          provide: NG_WAAS_SERVICES_INIT_FUNCTION,
          multi: true,
          useValue: afterInit,
        },
      ],
    };
  }
}
