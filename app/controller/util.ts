import { Controller } from 'egg';
import { decorators } from '@jv/egg-jv-common';


export default class UtilController extends Controller {
    @decorators.checkApiLogin(true)
    @decorators.checkApiToken(false)
    public async proxy() {
        const { ctx } = this;

        let { url } = ctx.query || {};
        const body = ctx.body || {};

        url = url || body.url;
        console.log('url', url);
        // ctx.proxyRequest(url);
        const { headers, status, data, res } = await ctx.curl(url);

        for (const key of Object.keys(headers)) {
            ctx.set(key, headers[key] + '');
        }

        ctx.status = status;
        if (data) {
            let body = data;
            if (!Buffer.isBuffer(body) && typeof body !== 'string') {
              // body: json
              body = JSON.stringify(body);
              ctx.length = Buffer.byteLength(body);
            }
            ctx.respond = false;
            ctx.res.flushHeaders();
            ctx.res.end(body);
          } else {
            ctx.respond = false;
            ctx.res.flushHeaders();
            res.pipe(ctx.res);
          }
        // return rsp;
    }
}
