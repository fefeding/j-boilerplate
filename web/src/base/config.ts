// 基础配置，主要用于表示系统间的差异
import { JV } from 'proto/JvSvr';

const config = window.__INITIAL_STATE__.config;
const prefix = config.prefix || '';
export default {
    ...config,
    prefix,
    // api的根URL
    baseURL: `/${prefix}`,
    // xhr的超时时间
    timeout: 3e4,
    logUrl: `/${prefix}/api/monitor/log`,
};

export const CustomerType = {
    [JV.ECustomerType.Alloc]: '配客',
    [JV.ECustomerType.P]: '潜客',
    [JV.ECustomerType.Formal]: '管客',
};
