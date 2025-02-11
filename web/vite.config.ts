import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import * as path from 'path';
import * as fs from 'fs';
//@ts-ignore
import devopsConfig from '../src/config/devops.config';
// const isDev = process.env.NODE_ENV !== 'production';
const urlPrefix = `${devopsConfig.prefixUrl}`;
const viewDir = path.resolve(__dirname, './view');
// https://vitejs.dev/config/
const config = defineConfig({
    plugins: [vue(), vueJsx()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '#': fileURLToPath(new URL('../', import.meta.url)),
        },
    },
    build: {
        assetsDir: 'public',
        outDir: 'dist',
        rollupOptions: {
            input: getViewInputs(viewDir),
        },
    },
    base: urlPrefix,
    server: {
        host: '0.0.0.0',
        port: +`${process.env.VITE_PORT}` || 5173,
        cors: true,
    },
});
export default config;

/**
 * 获取指定目录下的所有.html文件，并返回一个对象，该对象将每个文件名（不带.html扩展名）映射到其完整路径。
 * @param dir 指定的目录
 * @returns 返回文件名到路径的映射对象
 */
function getViewInputs(dir: string): { [key: string]: string } {
    const entries = fs.readdirSync(dir);
    const htmlFiles = entries.filter(filename => filename.endsWith('.html'));
    const inputObj: { [key: string]: string } = {};

    for (const file of htmlFiles) {
        const name = path.basename(file, '.html'); // 获取文件名，不包括扩展名
        inputObj[name] = path.resolve(dir, file);
    }

    // input: {
    //   index: resolve(__dirname, "./view/index.html"),
    //   mobile: resolve(__dirname, "./view/mobile.html"),
    // }
    return inputObj;
}
