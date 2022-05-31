import { Service, Context } from 'egg';
import { FindConsultDataReq, ConsultDataRsp } from '@jv/jv-models/ic-center/consult';

interface ConsultData {
    consultId: number;
}

export default class HelperAdapter extends Service {
    constructor(ctx: Context) {
        super(ctx);
        const config = ctx.app.config;
        this.opt.tarsConfig = {
            servant: config.tars.tarsServant.icCenterServant,
            client: config.tars ? config.tars.client : null,
        };
    }

    opt: {
        baseURL?: string;
        tarsConfig?: {
            servant: any;
            client: any;
        };
    } = {};

    /**
     * 获取投顾信息
     */
    async getConsult(): Promise<ConsultData> {
        const { $awaitTo } = this.ctx;
        console.log('getConsult begin');

        const param = new FindConsultDataReq();
        const userInfo: any = (this.ctx.currentSession && this.ctx.currentSession.user) || {};

        param.staffId = String(userInfo.staffId);
        param.corId = String(userInfo.companyId);

        const request = this.ctx.helper.curl<FindConsultDataReq, ConsultDataRsp>({
            ...this.opt,
            data: param,
        });

        const { data, err } = await $awaitTo<ConsultDataRsp, Error>(request);
        console.log('getConsult', param, data);

        if (err) {
            this.ctx.logger.error(
                'ICMidConsultService.geConsult: error [msg] %s',
                err.message,
                'this.opt',
                this.opt,
                '请求失败'
            );
            const res: any = { consultId: -1 };
            return res;
        }

        return {
            consultId: data?.data?.consultId,
        };
    }
}
