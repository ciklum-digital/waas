export enum RequestEventEnum {
  request = 'request', // before send request
  success = 'success', // response status is 2xx
  error = 'error', // response status is 4xx
  failure = 'failure', // all other response status
  cancel = 'cancel', // request is canceled
}
