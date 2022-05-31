import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
    // @WARN: 这里为测试环境部署配置, 如果要进行生产环境配置, 请使用 tars 服务配置功能进行覆盖
    const config: PowerPartial<EggAppConfig> = {};

    // 测试环境数据库配置
    config.mysql = { clients: [] };

    // 测试环境es配置
    config.esConfig = { host: [] };

    return config;
};
