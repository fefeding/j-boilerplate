import { Context, EggAppConfig } from 'egg';
import '@jv/egg-jv-common';
import '@jv/jv-types';

/**
 * 鉴权中间件
 */
export default (options: EggAppConfig) => {
    return async function (ctx: Context, next: any) {
        await next();
    };
};
