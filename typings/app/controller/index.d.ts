// This file is created by egg-ts-helper@1.30.3
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHome from '../../../app/controller/home';
import ExportMonitor from '../../../app/controller/monitor';
import ExportUtil from '../../../app/controller/util';

declare module 'egg' {
  interface IController {
    home: ExportHome;
    monitor: ExportMonitor;
    util: ExportUtil;
  }
}
