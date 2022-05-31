// This file is created by egg-ts-helper@1.30.3
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAccess from '../../../app/middleware/access';
import ExportApi from '../../../app/middleware/api';
import ExportAuth from '../../../app/middleware/auth';
import ExportGlobal from '../../../app/middleware/global';

declare module 'egg' {
  interface IMiddleware {
    access: typeof ExportAccess;
    api: typeof ExportApi;
    auth: typeof ExportAuth;
    global: typeof ExportGlobal;
  }
}
