import {
    Inject,
    Controller,
    All,
    Body,
    Config,
    MidwayConfig,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { QYWXService } from '../service/qywx';

@Controller('/api/qywx')
export class APIqywxController {
    @Inject()
    ctx: Context;

    @Inject()
    QYWXService: QYWXService;

    @Config('esIndex')
    $esIndex: MidwayConfig['esIndex'];

    @All('/send')
    async send(@Body() data) {
        const res = await this.QYWXService.send(
            '536f1cdf-fdb4-4beb-870a-2fdbc790ebc1',
            {
                msgtype: 'markdown',
                markdown: {
                    content:
                        '业务模块：<font color="warning">132例</font>\n告警时间：<font color="comment">用户反馈</font>\n告警内容：<font color="comment">117例</font>\nVIP用户反馈:<font color="comment">15例</font>\n 【[这是一个链接](http://work.weixin.qq.com/api/doc)】',
                },
            }
        );
        return res;
    }
}
