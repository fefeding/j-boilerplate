/// <reference path="./typings/index.d.ts" />
/// <reference path="./typings/app/service/index.d.ts" />
/// <reference path="./typings/app/middleware/index.d.ts" />
/// <reference path="./typings/app/controller/index.d.ts" />
/// <reference path="./app/web/index.d.ts" />

import Adapter from '../app/adapter/adapterInterface';
import 'egg';

declare module 'egg' {
    interface Application {
        /**
         * 初始化DB状态， 0=无状态,1=初始化中，2=已完成
         */
        __initDBState: 0 | 1 | 2;
    }
    interface Context {
        adapter: Adapter;
    }
    interface IHelper {
        /**
         * 请求demo服务接口
         * @param this helper对象
         * @param data 请求参数
         */
        requestDemoServer<req, res>(data: req): Promise<res>;
        getBaseURL(tarsConfig: any): Promise<string>;
    }
    interface EggAppConfig {
        adapter: 'jt' | 'crm';
        jvCommon: {
            // 在account中注册的id
            jvAppId: string;
            host: string;
            defaultHost?: string;
            main?: {
                accessKey?: string;
                loginUrl?: string;
                logoutUrl?: string;
                systemUrl?: string;
            };
            // 忽略的路径，不走登录鉴权
            ignoreHost?: string[] | RegExp[];
            // 是否跳过登录验证，默认不跳过
            skipLoginCheck?: boolean;
            // 环境
            env?: 'test' | 'prod';
        };
        tars: {
            client: {
                // 主控地址
                locator?: string;
                // 超时设置
                timeout?: number;
            };
            // 相关tars服务
            tarsServant?: Record<
                string,
                {
                    setName: string;
                    objName: string;
                }
            >;
        };
    }
}
