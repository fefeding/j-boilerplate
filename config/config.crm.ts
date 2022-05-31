import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
    const config: any = {};
    // 跳过登录中间件
    config.useMiddleware = false;
    config.adapter = 'crm';

    // 中间件
    config.middleware = [
        'auth', // 授权
        'api',
    ];

    console.log('config.crm load end');
    return config;
};
