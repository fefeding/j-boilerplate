/**
 * 异步加载JS
 * @param src 异步记载js的地址
 */
function loadJs(src: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = () => {
            resolve(true);
        };
        script.onerror = e => {
            reject(e);
        };
        script.src = src;
        document.getElementsByTagName('body')[0].appendChild(script);
    });
}

/**
 * 判断页面中是否已经加载对应的js
 * @param src 对应的js地址
 */
function isHadLoadJs(src: string): Element | null {
    return document.querySelector(`script[src='${src}']`);
}

export { isHadLoadJs, loadJs };
