interface SelectOption {
    label: string;
    value: number | string | PlainObject;
}

// plain object
type PlainObject<T = any> = { [key: string]: T };

// 暂停指定时间后再继续执行，默认暂停1000毫秒
export const sleep = (time = 1000): Promise<void> => new Promise(rs => setTimeout(rs, time));

/**
 * 计算一段字符串的字节长度，汉字作为3个字符计算
 * @see https://www.puritys.me/docs-blog/article-107-String-Length-%E4%B8%AD%E6%96%87%E5%AD%97%E4%B8%B2%E9%95%B7%E5%BA%A6.html
 * @see https://blog.caesarchi.com/2011/07/14/-e5-88-86-e4-ba-ab-javascript--e8-a8-88-e7-ae-97-e5-ad-97-e5-85-83-e9-95-b7-e5-ba-a6-count-string-length-by-javascript/
 *
 * 还有一种方案 @see http://www.alloyteam.com/2013/12/js-calculate-the-number-of-bytes-occupied-by-a-string/
 * @param s 需要计算长度的字符串
 * @returns 字符串的字节长度
 */
export const bytelen = (s: string): number => encodeURIComponent(s).replace(/%[A-F\d]{2}/g, 'U').length;

/**
 * 黑洞函数，用于阻塞异步流程的继续执行
 * @param [collapseTimeout] 多少秒后坍塌
 * @param [err] 坍塌后要抛出的错误
 * @param [context] 数据上下文
 */
export const blackhole = <T>(collapseTimeout?: number, err?: any /* = ERR.DEFAULT*/, context: any = {}): Promise<T> => {
    collapseTimeout = collapseTimeout || 0;
    // err = reasonable(err);
    return new Promise((resolve, reject) => {
        /* black hole, which never resolve or reject */
        if (collapseTimeout) {
            window.setTimeout(() => {
                reject({
                    ...err,
                    context,
                });
            }, collapseTimeout);
        }
    });
};

/**
 * 将字符串转换为JSON格式，兼容财付通middle框架的非正常json结构(某些包含 \x3f 等16进制转义字符)
 * @param data 需要进行格式转换的数据
 * @return 转换后的JSON数据
 */
export const parseJSON = (data = '{}'): Record<string, any> => {
    if (typeof data !== 'string') {
        return data || {};
    }
    data = data.trim();
    try {
        return JSON.parse(data) as Record<string, any>;
    } catch (e) {
        /* eslint-disable no-new-func */
        return new Function('return ' + data)();
        /* eslint-enable no-new-func */
    }
};

export function is(o: any): string {
    return Object.prototype.toString.call(o).slice(8, -1);
}

export function isPlantObject(o: any) {
    return is(o) === 'Object';
}

interface SelectOption {
    label: string;
    value: number | string | PlainObject;
}
//  枚举转 下拉列表
export const enumToList = (obj: PlainObject, isNumber: boolean = true): Array<SelectOption> => {
    let newArray: Array<SelectOption> = [];
    let num = 0;
    for (let i in obj) {
        newArray.push({
            label: obj[i],
            value: isNumber ? parseInt(i) : i,
        });
        num++;
    }
    return newArray.splice(0, num / 2);
};

//  根据数组中item的key值做降序排序
export const arraySortByKey = (array, key) => {
    array.sort((a, b) => {
        let value1 = a[key];
        let value2 = b[key];
        return value1.charCodeAt() - value2.charCodeAt();
    });
    return array;
};

/**
 * 对象是否为空对象
 * @param obj 任意变量
 * @returns
 */
export const isEmptyObject = (obj: PlainObject) => {
    // Object.keys()会遍历出自身的可枚举属性
    // Object.getOwnPropertyNames()会遍历出自身的所有属性
    return (
        isPlantObject(obj) &&
        Object.getOwnPropertyNames(obj).length === 0 &&
        Object.getOwnPropertySymbols(obj).length === 0
    );
};

// 选择今天以及今天之后的日期
export const disabledDate = (time: any) => {
    return time.getTime() > Date.now();
};

//  input规则 => 保留2位小数 只能输入数字
export const twoDecimalInput = event => {
    // 通过正则过滤小数点后两位
    event.target.value = event.target.value.match(/^\d*(\.?\d{0,2})/g)[0] || null;
};

//  查看字符串中是否包含表情
export function isEmojiCharacter(substring) {
    for (let i = 0; i < substring.length; i++) {
        let hs = substring.charCodeAt(i);
        if (0xd800 <= hs && hs <= 0xdbff) {
            if (substring.length > 1) {
                let ls = substring.charCodeAt(i + 1);
                let uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000;
                if (0x1d000 <= uc && uc <= 0x1f77f) {
                    return true;
                }
            }
        } else if (substring.length > 1) {
            let ls = substring.charCodeAt(i + 1);
            if (ls === 0x20e3) {
                return true;
            }
        } else {
            if (0x2100 <= hs && hs <= 0x27ff) {
                return true;
            } else if (0x2b05 <= hs && hs <= 0x2b07) {
                return true;
            } else if (0x2934 <= hs && hs <= 0x2935) {
                return true;
            } else if (0x3297 <= hs && hs <= 0x3299) {
                return true;
            } else if (
                hs === 0xa9 ||
                hs === 0xae ||
                hs === 0x303d ||
                hs === 0x3030 ||
                hs === 0x2b55 ||
                hs === 0x2b1c ||
                hs === 0x2b1b ||
                hs === 0x2b50
            ) {
                return true;
            }
        }
    }
}
