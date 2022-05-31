/// <reference path="./typings/index.d.ts" />
/// <reference path="./typings/app/service/index.d.ts" />
/// <reference path="./typings/app/middleware/index.d.ts" />
/// <reference path="./typings/app/controller/index.d.ts" />
/// <reference path="./app/web/index.d.ts" />

import 'egg';

declare module 'egg' {
    interface Context {}
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
