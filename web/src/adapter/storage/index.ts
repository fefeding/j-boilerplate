import { SerializedStorage } from './base';
import localStorage from './local';
import sessionStorage from './session';
import cookieStorage from './cookie';
export { sessionStorage, localStorage, cookieStorage };

interface UnionStorage {
    getItem: SerializedStorage['getItem'];
    setItem: SerializedStorage['setItem'];
    removeItem: SerializedStorage['removeItem'];
}

// 创建一个聚合存储，同时写同时读，
// 当读取到的值不一致时优先取创建时更靠前的不为null得的值
export const create = (stores: SerializedStorage[]): UnionStorage => {
    return {
        async getItem(key) {
            let data = null;
            for (const store of stores.reverse()) {
                const storeData = await store.getItem(key);
                if (storeData === null) {
                    continue;
                }
                data = storeData;
            }
            return data;
        },
        async setItem(key, value) {
            for (const store of stores) {
                await store.setItem(key, value);
            }
        },
        async removeItem(key) {
            for (const store of stores) {
                await store.removeItem(key);
            }
        },
    };
};

export default {
    create,
    session: sessionStorage,
    local: localStorage,
    cookie: cookieStorage,
};
