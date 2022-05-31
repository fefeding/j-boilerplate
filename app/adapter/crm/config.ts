import { Service } from 'egg';

/**
 * ConfigService Service
 */
export default class ConfigService extends Service {
    /**
     * 获取所有适配的配置
     */
    all() {
        return this.config.adapterConfig?.crm || {};
    }
}
