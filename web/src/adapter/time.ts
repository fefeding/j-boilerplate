// 时间相关工具
import dayjs from 'dayjs';
/**
 * 获取年龄
 * @param birth 生日
 * @param current 当前时间
 */

export function getOld(birth: number | string, current?: number | string) {
    return dayjs(current ? getTime(current) : new Date()).diff(dayjs(getTime(birth)), 'year');
}
/**
 * 获取时间戳
 *
 * @param {string} val 后台返回的日期
 * @returns
 */
export function getTime(val?: number | string | Date): number {
    if (typeof val === 'number') {
        return new Date(val).getTime();
    }
    if (val) {
        if (val instanceof Date) {
            return val.getTime();
        }
        // 在IOS中Date对象不能处理'2018.02.23' '2018-02-23 20:20:00'这种形式的日志，可以处理'2018/02/23'
        return val ? new Date(val.replace(/[.-]/g, '/')).getTime() : Date.now();
    } else {
        return -1;
    }
}

/**
 * 获取时间戳
 *
 * @param {string} val 后台返回的日期
 * @returns
 */
export function format(val?: number | string | Date, template?: string): string {
    return dayjs(getTime(val)).format(template || 'M月D日');
}

export default {
    getOld,
    getTime,
    format,
};
