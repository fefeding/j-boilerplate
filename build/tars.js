/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const exec = require('child_process').exec;
const tars = require('@jv/tars2node-cli');
const globby = require('globby');
const args = require('yargs/yargs')(process.argv).argv;
const chalk = require('chalk');
const fsExt = require('fs-extra');

function run(cmd) {
    exec(cmd, function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        stderr && console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}
const source = '_Proto';
const dist = 'proto';
// const includeDir = ['FrontProto', 'FrontMiddleProto'];
const sourceDir = path.resolve(__dirname, '../', source);
const distDir = path.resolve(__dirname, '../', dist);
const branch = args.branch || 'master';

console.log(`正在检索分支${chalk.cyan(branch)}...`);
exec(
    `git clone -b ${branch} http://git.jintencent.com/java/infrastructure-mid-office/TarsProto.git ${sourceDir}`,
    async function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        stderr && console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        } else {
            console.log(sourceDir);
            const filepaths = globby.sync(['**/*.tars', '**/*.jce'], { cwd: sourceDir });
            console.log(filepaths);
            for (const file of filepaths) {
                // if (!includeDir.some(key => file.includes(key))) {
                //     continue;
                // }
                const fp = path.resolve(sourceDir, file);
                try {
                    const subDirList = file.split(/[/\\]/).slice(0, -1);
                    subDirList.unshift(distDir);
                    await tars.process(fp, 'ts', subDirList.join(path.sep), 'web', {
                        withReturn: true,
                        long: 'number',
                    });
                } catch (e) {
                    console.error('transform tars error', fp, e.message);
                }
            }

            fsExt.rmdirSync(sourceDir, { recursive: true });
            console.log('done');
        }
    }
);
