import { IRequestConfigExecute } from './request-config-execute.interface';

export interface IWaasHooks {
  before?: ((config: IRequestConfigExecute) => IRequestConfigExecute)[]
    | ((data: IRequestConfigExecute) => IRequestConfigExecute);
  after?: ((config: any) => any)[] | ((config: any) => any);
}
