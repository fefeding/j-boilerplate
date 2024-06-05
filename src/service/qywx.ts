import { Provide, Inject } from '@midwayjs/core';
import { HttpService } from '@midwayjs/axios';

@Provide()
export class QYWXService {
    @Inject()
    httpService: HttpService;

    async send(key: string, data: any) {
        const headers = {
            'Content-Type': 'application/json',
        };
        const res = await this.httpService.post(
            `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${key}`,
            data,
            {
                headers,
            }
        );
        return res.data;
    }
}
