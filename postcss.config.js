// px转rem配置
const pxtorem = require('postcss-pxtorem');

module.exports = {
    plugins: [
        pxtorem({
            rootValue: 20,
            propList: ['*'],
        }),
    ],
};
