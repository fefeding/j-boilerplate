import { Service } from 'egg';

/**
 * User Service
 */
export default class User extends Service {
    /**
     * 用户信息
     */
    user() {
        const userInfo: any = (this.ctx.currentSession && this.ctx.currentSession.user) || {};
        return Object.assign({}, userInfo, {
            companyCode: 'jv',
            name: userInfo.userId || userInfo.name,
            userId: '' + userInfo.staffId,
        });
    }
}
