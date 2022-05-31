import { Controller } from 'egg';
import { decorators } from '@jv/egg-jv-common';

enum LogType {
    info = 'info',
    warn = 'warn',
    error = 'error',
}

export default class MonitorController extends Controller {
    @decorators.checkApiLogin(false)
    @decorators.checkApiToken(false)
    public async log() {
        const { ctx } = this;
        let { msg, type } = ctx.query || {};
        const body = ctx.body || {};
        msg = msg || body.msg;
        type = type || body.type;
        if (msg) {
            ctx.log[type in LogType ? type : LogType.info](msg);
        }

        return '';
    }
}
