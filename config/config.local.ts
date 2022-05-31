import { EggAppConfig, PowerPartial } from 'egg';
import * as path from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';

export default () => {
    const isLocalConfigExist = fs.existsSync(path.resolve(__dirname, 'local.ts'));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const localConfig: PowerPartial<EggAppConfig> = isLocalConfigExist ? require('./local').default : {};
    const local = localConfig.local || {};

    const config: PowerPartial<EggAppConfig> = {};

    config.assets = {
        devServer: {
            autoPort: true,
            debug: true,
            command: 'npm run dev:vue -- --port {port}',
            // command: 'vite',
        },
    };

    // 这个正式环境需要放tars配置
    config.tars = {
        client: {
            locator: 'tars.tarsregistry.QueryObj@tcp -h 10.233.64.6 -p 17890',
            timeout: 300000,
        },
    };
    // 开发数据库配置
    config.mysql = { clients: [] };

    // 开发es配置
    config.esConfig = { host: [] };

    return _.merge(config, local);
};
