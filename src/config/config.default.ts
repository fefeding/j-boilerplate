import { MidwayConfig, MidwayAppInfo } from '@midwayjs/core';
import * as path from 'path';
import devopsConfig from './devops.config';
export default (appInfo: MidwayAppInfo) => {
    const config = {
        // use for cookie sign key, should change to your own and keep security
        keys: appInfo.name + '_1641910879296_0605',
        koa: {
            // 全局路由前缀
            globalPrefix: `${devopsConfig.prefixUrl}`,
            port: Number(process.env.PORT) || 7001,
            hostname: process.env.IP || '127.0.0.1',
        },
        typeorm: {
            // dataSource: {
            //     default: {
            //         type: 'mysql',
            //         host: '',
            //         port: 3306,
            //         username: '',
            //         password: 'password',
            //         database: 'db_name',
            //         synchronize: false,
            //         // 或者扫描形式
            //         entities: ['**/model/**/*.entity{.ts,.js}'],
            //     },
            // },
        },
        view: {
            //默认view目录
            defaultViewEngine: 'nunjucks',
            mapping: {
                '.html': 'nunjucks',
            },
        },
        staticFile: {
            dirs: {
                default: {
                    prefix: `${devopsConfig.prefixUrl}/public`,
                    // 默认public目录
                    dir: path.join(__dirname, '../public'),
                },
            },
        },
        // 查看系统信息
        info: {
            infoPath: '/_sys_info',
        },
        axios: {
            default: {
                // 所有实例复用的配置
            },
            clients: {
                // 默认实例的配置
                default: {
                    // `headers` are custom headers to be sent
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    timeout: 1000, // default is `0` (no timeout)

                    // `withCredentials` indicates whether or not cross-site Access-Control requests
                    // should be made using credentials
                    withCredentials: false, // default
                },
            },
        },
        bodyParser: {
            formLimit: '30mb',
            jsonLimit: '30mb',
        },
    } as MidwayConfig;
    return config;
};
