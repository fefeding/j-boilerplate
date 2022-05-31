import { Context, EggAppConfig } from 'egg';
import '@jv/egg-jv-common';
import '@jv/jv-types';

/**
 * api请求拦截中间件
 */
export default (options: EggAppConfig) => {
    // const skipExt = [ '.png', '.jpeg', '.jpg', '.ico', '.gif' ];
    return async function (ctx: Context, next: any) {
        // 如果api请求，则走特殊逻辑
        // console.log(1111111, ctx.isApi);
        if (ctx.isApi) {
            await ctx.requestApi(next); // 调用framework中的api处理函数
            return;
        }
        await next();
    };
};
