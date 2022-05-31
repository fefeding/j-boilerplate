// This file is created by egg-ts-helper@1.30.3
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportBase from '../../../app/service/base';
import ExportEsBase from '../../../app/service/esBase';
import ExportTest from '../../../app/service/Test';

declare module 'egg' {
  interface IService {
    base: AutoInstanceType<typeof ExportBase>;
    esBase: AutoInstanceType<typeof ExportEsBase>;
    test: AutoInstanceType<typeof ExportTest>;
  }
}
