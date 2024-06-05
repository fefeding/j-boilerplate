import { Inject, Controller, Get, Query, Provide } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user';

@Provide()
@Controller('/api')
export class APIController {
    @Inject()
    ctx: Context;

    @Inject()
    userService: UserService;

    @Get('/get_user')
    async getUser(@Query('uid') uid) {
        const user = await this.userService.getUser({ uid });
        return user;
    }

    @Get('/get_noLogin_user')
    async getUserNoLogin(@Query('uid') uid) {
        const user = await this.userService.getUser({ uid });
        return user;
    }
}
