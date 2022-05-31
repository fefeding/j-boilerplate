import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
    // static: true,
    // nunjucks: {
    //   enable: true,
    //   package: 'egg-view-nunjucks',
    // },
    assets: {
        enable: true,
        package: 'egg-view-assets',
        env: ['local'],
    },
    nunjucks: {
        enable: true,
        package: 'egg-view-nunjucks',
    },
    log: {
        enable: true,
        package: '@jv/egg-jv-log',
    },
    vuessr: {
        enable: false,
        package: 'egg-view-vue-ssr',
    },
};

export default plugin;
