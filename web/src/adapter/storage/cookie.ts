import { SerializedStorage } from './base';
import { get, set, remove } from 'js-cookie';
const now = Date.now();
const expires = now * 1000 * 3600 * 24 * 365 * 10;

export default new SerializedStorage({
    getItem(key) {
        return get(key) || null;
    },
    setItem(key, val) {
        set(key, val, { expires: expires });
    },
    removeItem(key) {
        remove(key);
    },
    key: () => '',
    length: 0,
    clear() {
        // noop
    },
});
