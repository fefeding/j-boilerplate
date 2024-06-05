import { Controller, Get, Inject, Provide } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import devopsConfig from '../config/devops.config';

@Provide()
@Controller('/')
export class HomeController {
    @Inject()
    ctx: Context;

    @Get('/*')
    async home(): Promise<string> {
        return getDefaultTemplate(this.ctx);
    }

    @Get('/')
    async defaultToHome() {
        return getDefaultTemplate(this.ctx);
    }
}

function getDefaultTemplate(ctx: Context) {
    // 前端端口，如果为空，说明就是开发环境了
    const viteTarget = process.env.VITE_PORT;
    const config = ctx.app.getConfig();
    return ctx.render('index.html', {
        data: {
            config: {
                prefix: config.koa.globalPrefix,
            },
            user: ctx.currentSession.user,
            jvCommon: config?.jvCommon,
            title: devopsConfig.siteTitle,
        },
        title: devopsConfig.siteTitle,
        viteTarget: viteTarget ? `http://127.0.0.1:${viteTarget}` : '',
    });
}
