/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const SpritesmithPlugin = require('webpack-spritesmith');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const devops = require('./devops.config');

// const fsExt = require('fs-extra');

let port = '';
if (process.argv && process.argv.indexOf('--port') !== -1) {
    port = process.argv[process.argv.indexOf('--port') + 1];
}

function resolve(src) {
    return path.resolve(__dirname, src);
}
const publicPath = devops.prefix ? `/${devops.prefix}/public/` : '/public/';
module.exports = {
    //自动保存lint格式
    lintOnSave: process.env.NODE_ENV !== 'production',
    runtimeCompiler: true,
    outputDir: path.resolve(__dirname, './app/public'),
    publicPath: process.env.NODE_ENV === 'production' ? `${publicPath}` : `http://127.0.0.1:${port}/public/`,
    pages: {
        pc: {
            entry: path.resolve(__dirname, 'web/src/pc/main.ts'),
            template: path.resolve(__dirname, 'web/public/pc.html'),
            filename: path.resolve(__dirname, './app/view', 'index.html'),
            title: devops.title,
            // 以下待查
            minify: false,
            inject: true,
            // 让 html plugin 把文件输出到硬盘中, egg 可以用输出的 html 作为模板
            alwaysWriteToDisk: true,
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'pc'],
        },
        mobile: {
            entry: path.resolve(__dirname, 'web/src/mobile/main.ts'),
            template: path.resolve(__dirname, 'web/public/mobile.html'),
            filename: path.resolve(__dirname, './app/view', 'mobile.html'),
            title: devops.title,
            // 以下待查
            minify: false,
            inject: true,
            // 让 html plugin 把文件输出到硬盘中, egg 可以用输出的 html 作为模板
            alwaysWriteToDisk: true,
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'mobile'],
        },
    },
    configureWebpack: {
        resolve: {
            modules: ['node_modules', 'spritesmith-generated'],
            alias: {
                '@': path.resolve(__dirname, 'web/src'),
                '@typings': path.resolve(__dirname, 'typings'),
                web: path.resolve(__dirname, 'web'),
                proto: path.resolve(__dirname, 'proto'),
                app: path.resolve(__dirname, 'app'),
                config: path.resolve(__dirname, 'config'),
            },
        },
        plugins: [
            new SpritesmithPlugin({
                src: {
                    cwd: path.resolve(__dirname, 'web/asset/icons'),
                    glob: '*.png',
                },
                target: {
                    image: path.resolve(__dirname, 'web/asset/images/sprite.png'),
                    css: path.resolve(__dirname, 'web/asset/css/sprite.scss'),
                },
                apiOptions: {
                    cssImageRef: '../images/sprite.png',
                },
            }),
        ],
    },

    chainWebpack: config => {
        config.module
            .rule('iconfont')
            .test(/iconfont\.ts/)
            .use('vue-style-loader')
            .loader('vue-style-loader')
            .end()
            .use('css-loader')
            .loader('css-loader')
            .options({
                url: false,
            })
            .end()
            .use('webfonts-loader')
            .loader('webfonts-loader')
            .options({
                //以下路径不生效，引用的是全局publicPath
                // publicPath:
                //     process.env.NODE_ENV === 'production' ? `${publicPath}` : `http://127.0.0.1:${port}/public/`,
            })
            .end();

        if (process.env.NODE_ENV !== 'production') {
            config.plugin('html-disk').after('html').use(HtmlWebpackHarddiskPlugin);
        }

        // config.plugins.delete('prefetch');
        // config.plugins.delete('prefetch-index');
        //todo：splitChunks多页面打包有点bug，待修复
        config.optimization.set('splitChunks', {
            chunks: 'initial', // 必须三选一： "initial" | "all"(推荐) | "async" (默认就是async)
            // minSize: 1e4, // 最小尺寸，30000
            // maxSize: 3e5,
            // minChunks: 2, // 最小 chunk ，默认1
            // maxAsyncRequests: 5, // 最大异步请求数， 默认5
            // maxInitialRequests: 3, // 最大初始化请求书，默认3
            // automaticNameDelimiter: '~', // 打包分隔符
            cacheGroups: {
                libs: {
                    name: 'chunk-libs',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: 'initial', // 只打包初始时依赖的第三方
                },
                elementUI: {
                    name: 'element-ui', // 单独将 elementUI 拆包
                    priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
                    test: /[\\/]node_modules[\\/]element-plus[\\/]/,
                    chunks: 'initial', // 只打包初始时依赖的第三方
                },
                vant: {
                    name: 'vant-ui', // 单独将 vantUI 拆包
                    priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
                    test: /[\\/]node_modules[\\/]vant[\\/]/,
                    chunks: 'initial', // 只打包初始时依赖的第三方
                },
                commons: {
                    name: 'chunk-commons',
                    test: /[\\/]web[\\/]src[\\/]/, // 可自定义拓展你的规则
                    minChunks: 2, // 最小共用次数
                    priority: 30,
                    reuseExistingChunk: true,
                },
            },
        });
        // console.log('webpack', config.toConfig());
        // fsExt.writeFileSync('webpack.json', JSON.stringify(config.toConfig(), null, 2));
    },
    devServer: {
        host: '0.0.0.0',
        // host: 'localhost',
        historyApiFallback: true,
        // disableHostCheck: true,
        allowedHosts: ['127.0.0.1'],
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        },
    },
};
