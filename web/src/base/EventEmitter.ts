/**
 * javascript 实现订阅发布模式
 * https://www.jianshu.com/p/ea671156baf5
 */

export interface CallBack {
    (...args: any[]): void;
}

export default class EventEmitter {
    // 定义存放事件订阅的存储变量
    listeners: Record<string, CallBack[]> = {};
    constructor() {}

    on(type: string, cb: CallBack): this {
        let cbs = this.listeners[type];
        if (!cbs) {
            // 判断是否已经有订阅
            cbs = [];
        }
        // 订阅一则事件
        cbs.push(cb);
        this.listeners[type] = cbs;
        return this;
    }

    emit(type: string, ...args: any[]): this {
        const cbs = this.listeners[type];
        if (Array.isArray(cbs)) {
            for (let i = 0; i < cbs.length; i++) {
                const cb = cbs[i];
                if (typeof cb === 'function') {
                    // 触发一则事件
                    cb(...args);
                }
            }
        }
        return this;
    }

    off(type: string, cb: CallBack): this {
        const cbs = this.listeners[type];
        if (!cbs) {
            return this;
        }
        if (cb) {
            // 如果有回调，则取消订阅该回调
            this.listeners[type] = cbs.filter((eMap: CallBack) => eMap !== cb);
        } else {
            // 否则取消订阅整个事件
            delete this.listeners[type];
        }
        return this;
    }
}
