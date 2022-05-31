// 前端监控。
import { is, isPlantObject } from '@/base/util';
import config from '@/base/config';

async function report(type = '', msg = '') {
    // 这里不能用单例，因为建立链接要时间，迅速修改src可能导致前面的没报
    new Image().src = `${config.prefix ? config.prefix : ''}${config.logUrl}?type=${type}&msg=${msg}`;
}

function formatLog(args: any[]) {
    return args
        .map(item => {
            if (isPlantObject(item)) {
                return JSON.stringify(dataClean(item));
            } else if (Array.isArray(item)) {
                return `[${item.map((o: any) => JSON.stringify(dataClean(o))).join(',')}]`;
            } else if (item instanceof Error) {
                return [item.name, item.message, item.stack].join(',');
            } else if ('' + item === '[object Object]') {
                return is(item);
            }
            return item;
        })
        .join(encodeURIComponent('\t'));
}
// 日志上下文
let logList: string[] = [];
// 白名单日志
export function log(...args: any) {
    try {
        report('info', formatLog(args));
        // 调这里的时候，logList可能还没初始化。
        logList = logList || [];
        logList.push(formatLog(args));
        console.info(...args);
    } catch (e) {
        console.error(e);
    }
}

// 日志(不管是不是白名单都要报)
// 目前没有这个功能，先占位
export function logAll(...args: any) {
    try {
        report('info', formatLog(args));
        // 调这里的时候，logList可能还没初始化。
        logList = logList || [];
        logList.push(formatLog(args));
        console.info(...args);
    } catch (e) {
        console.error(e);
    }
}

export function warn(...args: any) {
    report('warn', formatLog(args));
}
/**
 * 异常上报
 * @param label 标识，sentry的title
 * @param error 异常对象
 */
export function error(error: Error | any) {
    try {
        let logStr = '';
        try {
            // 调这里的时候，logList可能还没初始化。
            logList = logList || [];
            logStr = JSON.stringify(logList).replace(/\\+"|"/g, `'`);
        } catch (e) {
            logStr = e.stack || e.message || 'log stringify error';
        }
        error = typeof error === 'string' ? new Error(error) : error;
        if (error instanceof Error) {
            // // 报aegis主要考虑离线日志
            // window.AegisInstance.report(error);
            // if (window.Raven) {
            //     // 报sentry主要考虑它的上下文日志和告警比较完善
            //     window.Raven.captureException(error);
            // }
            logStr += error.stack || error.message || error.name;
            console.error(error);
        } else {
            logStr += error.msg || '';
        }
        report('error', logStr);
    } catch (e) {
        console.error(e);
    }
    logList = [];
}

const xhrMap: any = {};
// 只处理回包情况，不能处理循环引用的情况。
/**
 * 把敏感信息
 * @param obj 普通对象，不能存在循环引用
 */
function dataClean(obj: Record<string, any>) {
    const sensitiveKeyReg = /tel_no|id_code|signature|nonceStr|account_id|bank_acc|pwd|address|name|token|public_key/;
    const jsonReg = /^\{.*\}$/;
    if (!isPlantObject(obj)) {
        return JSON.stringify({
            type: is(obj),
        });
    }
    const rsp: Record<string, any> = Object.assign({}, obj);
    for (const key of Object.keys(obj)) {
        const val = obj[key];
        const valType = typeof val;
        if (val && valType === 'object') {
            rsp[key] = dataClean(val);
            continue;
        }
        if (sensitiveKeyReg.test(key)) {
            rsp[key] = `${valType}(${((val || '') + '').length})`;
        } else if (valType === 'string' && jsonReg.test(val)) {
            try {
                const tmp = JSON.parse(val);
                rsp[key] = JSON.stringify(dataClean(tmp));
            } catch (e) {
                // 这里不能logAll，避免死循环
            }
        }
    }
    return rsp;
}
