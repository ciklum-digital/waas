import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule,
  platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IRequestConfigExecute, RequestEventEnum } from '@waas/core';

import { HttpTransportAdapterService } from './http-transport-adapter.service';
import { WaasModule } from './waas.module';

describe('HttpTransportAdapterService', () => {
  let http: HttpTestingController;
  let adapter: HttpTransportAdapterService;

  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
      platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [WaasModule, HttpClientModule, HttpClientTestingModule]
    });
    http = TestBed.get(HttpTestingController);
    const client = TestBed.get(HttpClient);
    adapter = new HttpTransportAdapterService(client);
  });

  it('should be created', () => {
    expect(adapter).toBeTruthy();
  });

  it('should make GET request', () => {
    const url = 'api/testing';
    const data = {method: 'GET', url, before: (data1: IRequestConfigExecute) => data1, after: (data1) => data1};
    adapter.executeRequest(data).subscribe(() => {});
    const req = http.expectOne(url);
    req.flush({data: 'some data'});
    expect(req.request.method).toBe('GET');
  });

  it('should return response with meta', (done) => {
    const url = 'api/testing';
    const headers = {Authorization: 'Basic'};
    const params = {id: '15'};
    const status = 200;
    const statusText = 'Ok';

    const data = {
      method: 'GET', headers, params, url, before: (data1: IRequestConfigExecute) => data1, after: (data1) => data1
    };
    adapter.executeRequest(data)
      .subscribe(response => {
        expect(response).toEqual({data: 'some data'});
        done();
      });
    const req = http.expectOne('api/testing?id=15');
    req.flush({data: 'some data'}, {statusText, status});
  });

  it('should cancel request', () => {
    const url = 'api';
    const data = {method: 'GET', url, before: (data1: IRequestConfigExecute) => data1, after: (data1) => data1};
    const httpRequest = adapter.executeRequest(data);
    httpRequest.subscribe();
    const req = http.expectOne(url);
    httpRequest.cancel();
    expect(req.cancelled).toBeTruthy();
  });

  it('should check event request', () => {
    const url = 'api/testing';
    const obj = {callback: () => {}};
    const spy = spyOn(obj, 'callback');
    const data = {method: 'GET', url, before: (data1: IRequestConfigExecute) => data1, after: (data1) => data1};
    adapter.executeRequest(data)
      .on(RequestEventEnum.request, () => obj.callback())
      .subscribe(() => {});
    const req = http.expectOne(url);
    req.flush({data: 'some data'});
    expect(spy).toHaveBeenCalled();
  });

  it('should check event success', () => {
    const url = 'api/testing';
    const obj = {callback: () => {}};
    const spy = spyOn(obj, 'callback');
    const data = {method: 'GET', url, before: (data1: IRequestConfigExecute) => data1, after: (data1) => data1};
    adapter.executeRequest(data)
      .on(RequestEventEnum.success, () => obj.callback())
      .subscribe(() => {});
    const req = http.expectOne(url);
    req.flush({data: 'some data'});
    expect(spy).toHaveBeenCalled();
  });

  it('should check event error', () => {
    const url = 'api/testing';
    const obj = {callback: () => {}};
    const spy = spyOn(obj, 'callback');
    const data = {method: 'GET', url, before: (data1: IRequestConfigExecute) => data1, after: (data1) => data1};
    adapter.executeRequest(data)
      .on(RequestEventEnum.error, () => obj.callback())
      .subscribe(() => {}, err => { expect(err.id).toBe(10); });
    const req = http.expectOne(url);
    req.flush({id: 10}, {status: 400, statusText: 'not found'});
    expect(spy).toHaveBeenCalled();
  });

  it('should check event failure', () => {
    const url = 'api/testing';
    const obj = {callback: () => {}};
    const spy = spyOn(obj, 'callback');
    const data = {method: 'GET', url, before: (data1: IRequestConfigExecute) => data1, after: (data1) => data1};
    adapter.executeRequest(data)
      .on(RequestEventEnum.failure, () => obj.callback())
      .subscribe(() => {}, err => { expect(err.id).toBe(10); });
    const req = http.expectOne(url);
    req.flush({id: 10}, {status: 500, statusText: 'not found'});
    expect(spy).toHaveBeenCalled();
  });

  it('should check value for event failure', (done) => {
    const url = 'api/testing';
    const obj = {callback: () => {}};
    const data = {method: 'GET', url, before: (data1: IRequestConfigExecute) => data1, after: (data1) => data1};
    adapter.executeRequest(data)
      .on(RequestEventEnum.failure, () => obj.callback())
      .subscribe(() => {}, err => {
        expect(err.id).toBe(10);
        done();
      });
    const req = http.expectOne(url);
    req.flush({id: 10}, {status: 500, statusText: 'not found'});
  });

  it('should check event cancel', () => {
    const url = 'api';
    const obj = {callback: () => {}};
    const spy = spyOn(obj, 'callback');
    const data = {method: 'GET', url, before: (data1: IRequestConfigExecute) => data1, after: (data1) => data1};
    const httpRequest = adapter.executeRequest(data)
      .on(RequestEventEnum.cancel, obj.callback);
    httpRequest.subscribe(() => {});
    http.expectOne(url);
    httpRequest.cancel();
    expect(spy).toHaveBeenCalled();
  });
});
