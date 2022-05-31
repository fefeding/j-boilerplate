/// <reference path="./index.d.ts" />
/* eslint-disable @typescript-eslint/no-var-requires */
// 给TAF调用的入口文件

const egg = require('egg');
const tarsConfig = require('@jv/egg-jv-common/lib/tarsConfig');
const _ = require('lodash');

const options = {
    env: 'prod',
    port: process.env.PORT || 7001,
    host: process.env.IP || '127.0.0.1',
    workers: 1
};

async function start(options) {
    let startConfig;

    try {
        // 加载启动配置
        startConfig = await tarsConfig.loadAndWatchConfig('StartConfig.json', {
            format: 'JSON'
        });
    } catch (e) {
        console.log(e);
    }
    const app = await egg.start(_.merge({}, options, startConfig));

    try {
        // 加载基础服务配置
        const commonConf = await tarsConfig.loadAndWatchConfig('CommonWebServer.json', {
            format: 'JSON',
            // 被动更新配置
            configPushed: conf => {
                if (app && app.config) {
                    // 合并tars配置
                    app.config.jvCommon = _.merge({}, app.config.jvCommon, conf);
                }
            }
        });
        // 合并tars配置
        app.config.jvCommon = _.merge(app.config.jvCommon, commonConf);
        console.log('app.config.jvCommon', app.config.jvCommon);
        const mergeConfig = await tarsConfig.loadAndWatchConfig('MergeConfig.json', {
            format: 'JSON',
            // 被动更新配置
            configPushed: conf => {
                if (app && app.config) {
                    _.merge(app.config, conf);
                }
            }
        });
        _.merge(app.config, mergeConfig);
        console.log('app.config', app.config);
    } catch (e) {
        console.log(e);
    }

    /*
    app.config.coreMiddleware = [
        'meta',
        'siteFile',
        'notfound',
        'static',
        'bodyParser',
        'overrideMethod',
        'session',
        'securities',
        'i18n',
        'passportJvAuth',
        'jvLog',
        'serverProxy'
    ];
    */
    app.listen(options.port, options.host);
    console.log(`server listen at ${options.host}:${options.port}`);
}

start(options);

//egg.startCluster(options);
