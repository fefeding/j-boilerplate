import { Controller } from 'egg';
import { decorators } from '@jv/egg-jv-common';
import devops from '../../devops.config';

export default class HomeController extends Controller {
    @decorators.checkApiLogin(false)
    @decorators.checkApiToken(false)
    public async test() {
        return this.ctx.adapter.user.user();
    }

    @decorators.checkApiLogin(true)
    @decorators.checkApiToken(false)
    public async index() {
        const { ctx, app } = this;
        // console.log('ctx.app.config.coreMiddleware', ctx.app.config.coreMiddleware);
        let isOpera = ctx.ua.indexOf('Opera') > -1; //判断是否Opera浏览器
        let isIE = ctx.ua.indexOf('compatible') > -1 && ctx.ua.indexOf('MSIE') > -1 && !isOpera;
        let isIE11 = ctx.ua.indexOf('Trident') > -1 && ctx.ua.indexOf('rv:11.0') > -1;
        let isChrome = ctx.ua.indexOf('Chrome') > -1 && ctx.ua.indexOf('Safari') > -1; //判断Chrome浏览器
        let isFirefox = ctx.ua.indexOf('Firefox') > -1; //判断是否Firefox浏览器
        let isSafari = ctx.ua.indexOf('Safari') > -1 && ctx.ua.indexOf('Chrome') === -1; //判断是否Safari浏览器

        ctx.set('Access-Control-Allow-Origin', '*');
        let notSupport = false;
        if (isIE || isIE11) {
            notSupport = true;
        } else if (isChrome) {
            let version = ctx.ua.split('Chrome/')[1].split('.')[0];
            if (Number(version) < 49) {
                notSupport = true;
            }
        } else if (isOpera) {
            let version = ctx.ua.split('Opera/')[1].split('.')[0];
            if (Number(version) < 36) {
                notSupport = true;
            }
        } else if (isFirefox) {
            let version = ctx.ua.split('Firefox/')[1].split('.')[0];
            if (Number(version) < 18) {
                notSupport = true;
            }
        } else if (isSafari) {
            let version = ctx.ua.split('Safari/')[1].split('.')[0];
            if (Number(version) < 10) {
                notSupport = true;
            }
        }

        if (notSupport) {
            return ctx.render('upgrade.html', {
                content: '当前浏览器内核版本过低.请下载其他浏览器',
            });
        }

        let template = 'index.html';
        const config = app.config;
        if (config?.assets?.devServer?.command === 'vite') {
            template = 'dev.ejs';
        }

        console.log(ctx.headers['user-agent'], '用户头');
        const userAgent = ctx.headers['user-agent'];
        const mobileReg = /\s+Mobile/i;
        template = mobileReg.test(userAgent) ? 'mobile.html' : 'index.html';

        console.log('template', template);
        await ctx.render(template, {
            data: {
                config: { ...devops, adapter: config.adapter },
                loginUser: ctx.adapter.user.user(),
                jvCommon: this.app.config.jvCommon,
                env: app.config.env,
            },
        });
    }
}
