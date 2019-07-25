import { TestBed, inject } from '@angular/core/testing';
import { BrowserDynamicTestingModule,
  platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

import { NgWaasService, WaasServiceConfig, WaasTransportAdapter } from './ng-waas-service.service';
import { factoryWaasService } from './waas.module';

describe('NgWaasService', () => {
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      providers: [
        {
          provide: WaasServiceConfig,
          useValue: {},
        },
        {
          provide: WaasTransportAdapter,
          useValue: {},
        },
        {
          provide: NgWaasService,
          deps: [WaasTransportAdapter, WaasServiceConfig],
          useFactory: factoryWaasService,
        },
      ],
    });
  });

  it('should be created', inject([NgWaasService], (service: NgWaasService) => {
    expect(service).toBeTruthy();
  }));
});
