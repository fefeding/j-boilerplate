import { RouteLocationRaw } from 'vue-router';
import router from '@/pc/router';
import config from '@/base/config';

function jump(to: RouteLocationRaw, method: 'push' | 'replace') {
    if (window.top === window) {
        return router[method](to);
    }

    const fullPath = config.prefix + router.resolve(to).fullPath;
    window.open(fullPath);
}

function push(to: RouteLocationRaw) {
    return jump(to, 'push');
}

function replace(to: RouteLocationRaw) {
    return jump(to, 'replace');
}

function getProxy(url: string) {
    return config.prefix + `/api/util/proxy?url=${encodeURIComponent(url)}`;
}

export default {
    push,
    replace,
    getProxy,
};
