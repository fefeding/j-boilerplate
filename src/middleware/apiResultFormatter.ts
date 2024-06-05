import { Middleware, IMiddleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';

// 校验api路径规则的
const apiReg = /^\/([^/]+\/)?api\//i;
@Middleware()
export class ApiResultFormatterMiddleware
    implements IMiddleware<Context, NextFunction>
{
    ignore(ctx: Context): boolean {
        // 下面的路由将忽略此中间件
        return ctx.path === '/' || /^\/([^/]+\/)?api\/cos\/get/.test(ctx.path);
    }

    resolve() {
        return async (ctx: Context, next: NextFunction) => {
            const isApi = apiReg.test(ctx.request.path);
            if (isApi) {
                try {
                    await next();
                    const res: any = ctx.body;
                    ctx.body = Object.assign(
                        {
                            ret: 0,
                            msg: 'success',
                            data: null,
                        },
                        typeof res?.ret === 'number' ? res : { data: res }
                    );
                } catch (err) {
                    console.error(err);
                    if (typeof err.ret === 'number') {
                        ctx.body = err;
                    } else {
                        ctx.body = {
                            ret: 1001,
                            msg: err.message,
                        };
                    }
                }
            } else {
                await next();
            }
        };
    }
}
