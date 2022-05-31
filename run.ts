import crossEnv from 'cross-env';
import path from 'path';

let argv = process.argv.slice(2);

// 指定vue构建配置文件路径
const configFilePath = path.resolve(__dirname, 'vue.config.js');
argv.unshift(`VUE_CLI_SERVICE_CONFIG_PATH=${configFilePath}`);

crossEnv(argv);
