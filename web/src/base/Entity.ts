// 实体
import EventEmitter, { CallBack } from './EventEmitter';

interface WatchCallBack {
    (newValue: Record<string, any>, oldVaule: Record<string, any>, key: string): void;
}

export default class Entity extends EventEmitter {
    // 状态
    state: Record<string, any> = {};

    constructor(data?: Record<string, any>) {
        super();
        this.state = new Proxy(data || {}, {
            set: (oTarget: any, sKey, vValue) => {
                if (oTarget[sKey] !== vValue) {
                    const oldValue = { ...oTarget };
                    oTarget[sKey] = vValue;
                    // 这里不传入this.state, 避免在update回调那里再修改state，造成死循环
                    this.emit('update', { ...oTarget }, oldValue, sKey);
                    // if (typeof sKey === 'string') {
                    //     this.emit(`update:${sKey}`, oTarget[sKey], oldValue[sKey]);
                    // }
                }
                return true;
            },
        });
    }
    watch(cb: WatchCallBack): CallBack {
        this.on('update', cb);
        return () => this.off('update', cb);
    }
    // 目前看，根据key监听暂时用不到
    // watch(cb: WatchCallBack): CallBack;
    // watch(key: string, cb: WatchCallBack): CallBack;
    // watch(keyOrCb: string | WatchCallBack, cb?: WatchCallBack): CallBack {
    //     if (typeof keyOrCb === 'string' && cb) {
    //         this.on(`update:${keyOrCb}`, cb);
    //         return () => this.off('update', cb);
    //     } else if (typeof keyOrCb === 'function') {
    //         this.on('update', keyOrCb);
    //         return () => this.off('update', keyOrCb);
    //     }
    //     return () => {};
    // }
}
