import { Provide, Inject } from '@midwayjs/core';
import { IUserOptions } from '../interface';
import { Context } from '@midwayjs/koa';
@Provide()
export class UserService {
    @Inject()
    ctx: Context;
    async getUser(options: IUserOptions) {
        // return {
        //   uid: options.uid,
        //   username: 'mockedName',
        //   phone: '12345678901',
        //   email: 'xxx.xxx@xxx.com',
        // };
        return this.ctx.currentSession;
    }
}
