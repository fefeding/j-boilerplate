import Adapter from '../adapter/adapterInterface';

export interface IAwaitToFunc {
    <T = any, E = any>(p: Promise<T>): Promise<{ data: T; err: E }>;
}
/**
 * 处理 Promise 的异常情况
 *
 * const { data, err } = await awaitTo(promise);
 */
export const awaitTo: IAwaitToFunc = p => {
    // export function awaitTo<T = any, E = any>(p: Promise<T>): Promise<{ data: T; err: E }> {
    return p.then(
        data => {
            return Promise.resolve({ data, err: null });
        },
        err => {
            return Promise.resolve({ err, data: null });
        }
    );
};
declare module 'egg' {
    interface Context {
        $awaitTo: IAwaitToFunc;
    }
}

export default {
    $awaitTo: awaitTo,
};
