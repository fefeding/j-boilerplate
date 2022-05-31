/* eslint-disable */
import axios, { AxiosRequestConfig } from 'axios';
import { axios as axiosInstance } from '@jv/egg-jv-common';
import config from '@/base/config';

import Qs from 'qs';

const CancelToken = axios.CancelToken;
const ajaxMap = new Map(); // 存着所有cancal对象的函数
// const dateMap = new Map(); // 存着所有时间，方便节流

axiosInstance.baseURL = config.baseURL;

//分配独一无二的id
function getuuid(url, method, data) {
    return Qs.stringify(Object.assign({}, { url, method }, data));
}

axiosInstance.interceptors.request.use(config => {
    const uuid = getuuid(config.url, config.method, config.data);
    if (ajaxMap.has(uuid)) {
        // 取消当前请求
        ajaxMap.get(uuid)('$proxy:重复发请求,操作取消');
    } else {
        config.cancelToken = new CancelToken(cancel => {
            ajaxMap.set(uuid, cancel);
        });
    }
    // console.log(ajaxMap,'请求开始')
    return config;
});

axiosInstance.interceptors.response.use(c => {
    const config = c.config;
    const uuid = getuuid(config.url, config.method, JSON.parse(config.data));
    // 响应回来后删掉ajaxMap里面的
    ajaxMap.delete(uuid);
    // console.log('响应回来',ajaxMap)
    return c;
});

export interface AjaxPromise<T = any> extends Promise<T> {
    cancel(): void;
}

export async function request(options: AxiosRequestConfig) {
    const cancelToken = axios.CancelToken.source();
    // requestApi默认是POST方法
    const response: any = await axiosInstance.requestApi(options);
    // 给req加上cancel方法
    Object.defineProperty(response, 'cancel', {
        value: () => {
            cancelToken.cancel();
        },
        enumerable: false,
    });

    if (!response || response.ret === undefined) {
        console.error('请求异常');
        throw response;
    }
    if (response.ret !== 0) {
        console.error(response.msg || '操作失败');
        throw response;
    }
    return response as AjaxPromise;
}

export function abort(msg = '$proxy:切换路由，操作取消') {
    //abort掉全部请求
    for (const params of ajaxMap.entries()) {
        const key = params[0];
        const cancel = params[1];
        cancel(msg);
        ajaxMap.delete(key);
    }
}

export function get(options: AxiosRequestConfig) {
    return request({
        method: 'GET',
        ...options,
    });
}
export function post(options: AxiosRequestConfig) {
    return request({
        method: 'POST',
        ...options,
    });
}

export default {
    axiosInstance,
    abort,
    // request,
    // get,
    // post,
};
