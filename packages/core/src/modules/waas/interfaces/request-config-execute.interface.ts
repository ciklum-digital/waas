import { IRequestConfig } from './request-config.interface';

export interface IRequestConfigExecute extends IRequestConfig {
  method?: string;
  before: (data: IRequestConfigExecute) => IRequestConfigExecute;
  after: (data: any) => any;
  url?: string;
}
