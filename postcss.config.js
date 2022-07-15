// px转rem配置
const pxtorem = require('postcss-pxtorem');

module.exports = {
    plugins: [
        pxtorem({
            rootValue: 20,
            propList: ['*'],
            exclude: file => {
                // @NOTE: 只有移动端页面需要px2rem, 这里判断可能不准确, 请自行修改
                return !file.includes('mobile');
            },
        }),
    ],
};
