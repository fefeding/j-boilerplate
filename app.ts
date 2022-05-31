// app.js

import path = require('path');
class AppBootHook {
    app!: any;
    constructor(app) {
        this.app = app;
    }

    async didLoad() {
        const app = this.app;
        // 所有的配置已经加载完毕
        // 可以用来加载应用自定义的文件，启动自定义的服务
        // 例如：加载自定义的目录
        console.log('app.config.adapter', app.config.adapter);
        // 载入到 app.adapterClass
        const opt = {
            call: true,
            caseStyle: 'lower',
            fieldClass: 'adapterClass',
            directory: app.loader
                .getLoadUnits()
                .map(unit => path.join(unit.path, `app/adapter/${app.config.adapter || 'jt'}`)),
        };
        const adapterPaths = opt.directory;
        app.loader.loadToContext(adapterPaths, 'adapter', opt);
    }
}

module.exports = AppBootHook;
