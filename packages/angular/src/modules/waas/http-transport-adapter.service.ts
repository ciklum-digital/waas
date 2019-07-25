import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { IRequestConfigExecute, ITransportAdapter, WaasResponse } from '@waas/core';

import { HttpWaasResponse } from './http-waas-response';

export class HttpTransportAdapterService implements ITransportAdapter {
  constructor(private http: HttpClient) {}

  executeRequest<T>(cfg: IRequestConfigExecute): WaasResponse<T> {
    const config = cfg.before(cfg);
    const url = config.url;
    const headers = new HttpHeaders(config.headers);
    const params = new HttpParams({ fromObject: config.params });
    const req = new HttpRequest<T>(config.method, url, config.body, { headers, params });

    return new HttpWaasResponse<T>(this.http.request(req), config.after);
  }
}
