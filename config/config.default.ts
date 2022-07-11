import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import * as path from 'path';
import devops from '../devops.config';
import fs = require('fs');

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;
    // 声明使用的adapter，在tars配置中进行覆盖
    config.adapter = 'jt';
    config.title = 'demo项目';
    // 部署目录名称
    config.prefix = devops.prefix || '';

    // override config from framework / plugin
    // use for cookie sign key, should change to your own and keep security
    // 不能有这个 ！！！会导致cookie签名出错
    // config.keys = appInfo.name + '_1609670925932_4291';

    config.security = {
        xframe: {
            enable: false,
        },
    };

    // 中间件
    config.middleware = [
        'api', // api请求规范
    ];

    // 指定前端资源目录
    const publicPath = devops.prefix ? `/${devops.prefix}/public/` : '/public/';
    config.static = {
        maxAge: 0,
        prefix: publicPath,
        dir: path.resolve(__dirname, '../app/public'),
        gzip: true,
    };

    // 模板引擎配置
    config.view = {
        defaultViewEngine: 'nunjucks',
        root: path.resolve(__dirname, '../app/view'),
        mapping: {
            '.html': 'nunjucks',
        },
    };
    const commonDomain = 'testoa.ciccjinteng.cn';
    config.jvCommon = {
        jvAppId: '26',
        skipLoginCheck: false,
        host: `http://${commonDomain}/account/`,
        defaultHost: `http://${commonDomain}/account`,
        main: {
            accessKey: 'jv.account.20191022',
            loginUrl: `http://${commonDomain}/account/sso/login`,
            logoutUrl: `http://${commonDomain}/account/logout`,
            systemUrl: `http://${commonDomain}/account`,
        },
    };

    // the return config will combines to EggAppConfig
    return config;
};
