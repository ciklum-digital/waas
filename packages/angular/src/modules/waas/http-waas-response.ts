import {
  HttpErrorResponse, HttpEventType, HttpResponse,
} from '@angular/common/http';
import { from, Observable, Subscription, throwError } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { RequestEventEnum, WaasResponse } from '@waas/core';

export class HttpWaasResponse<T> extends WaasResponse<T> {
  private subscription: Subscription;
  private readonly observable: Observable<any>;

  constructor(observable: Observable<any>, after: (data: any) => any) {
    super();
    this.observable = observable.pipe(filterEvent(this),
    catchError((err) => {
      let body;
      if (err instanceof HttpErrorResponse) {
        const status = err.status.toString();
        body = err.error;
        if (status.indexOf('4') === 0) {
          this.call(RequestEventEnum.error, err);
        } else {
          this.call(RequestEventEnum.failure, err);
        }
      } else {
        this.call(RequestEventEnum.failure, err);
      }

      return throwError(after(body));
    },
    ),
    filter(event => event instanceof HttpResponse),
    switchMap((response: HttpResponse<any>) => {
      return from(new Promise(((resolve) => {
        resolve(after(response.body));
      })));
    }),
  );
  }

  subscribe(...params: any[]): Subscription {
    this.subscription = this.observable.subscribe.apply(this.observable, params);

    return this.subscription;
  }

  pipe(...params: any[]): Observable<any> {
    return this.observable.pipe.apply(this.observable, params);
  }

  cancel() {
    if (!!this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
      this.call(RequestEventEnum.cancel);
    }
  }
}

function filterEvent(obj) {
  return filter((event: any) => {
    if (event.type === HttpEventType.Sent) {
      obj.call(RequestEventEnum.request, event);
    } else if (event.type === HttpEventType.Response) {
      const status = event.status.toString();
      if (status.indexOf('2') === 0) {
        obj.call(RequestEventEnum.success, event);
      }
      if (status.indexOf('4') === 0) {
        obj.call(RequestEventEnum.error, event);
      } else {
        obj.call(RequestEventEnum.failure, event);
      }
    }

    return true;
  },
  );
}
