import qs from 'qs';

// 这里使用单例，是考虑到js是单线程的
let _link: ChildNode | null;

export function getLink(url: string): HTMLAnchorElement {
    if (!_link) {
        const div = document.createElement('div');
        div.innerHTML = '<a href=""/></a>';
        _link = div.firstChild;
    }
    _link && ((_link as HTMLAnchorElement).href = url);
    return _link as HTMLAnchorElement;
}

/**
 * 获取绝对地址
 * @param {string} url - 需要处理的url
 */
export function abs(url: string): string {
    return getLink(url).href;
}

/**
 *设置参数
 *
 * @export
 * @param {string} url
 * @param {(Record<string, string | number>)} param
 * @returns {string}
 */
export function setParam(url: string, param: Record<string, string | number>): string {
    const link = getLink(url);
    link.search = '?' + qs.stringify(Object.assign(qs.parse(link.search.substr(1)), param));
    return link.href;
}

export function getParam(url: string, key: string): string;
export function getParam(url: string, key?: string) {
    const link = getLink(url);
    const param = qs.parse(link.search.substr(1));
    return key ? param[key] : param;
}
