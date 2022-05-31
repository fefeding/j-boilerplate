import { Service } from 'egg';

/**
 * User Service
 */
export default class User extends Service {
    /**
     * 用户信息
     */
    async user() {
        // todo
        return Object.assign(
            {
                companyCode: 'cicc',
            },
            (this.ctx.currentSession && this.ctx.currentSession.user) || {}
        );
    }
}
