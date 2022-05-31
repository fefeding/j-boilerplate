import { Context, EggAppConfig } from 'egg';

export default (options: EggAppConfig) => {
    return async function access(ctx: Context, next: any) {
        await next();
    };
};
