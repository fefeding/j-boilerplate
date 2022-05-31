// 注意： 不支持SerializedStorage[name: string]: any, 即不可以使用类似localStorage.a代替localStorage.getItem('a')
// TODO: 增加写时安全，即写满之后删除最早的记录再尝试写入新的值
export class SerializedStorage implements Storage {
    adapter: Storage;

    getKey(key: string) {
        // 可以在子类中改写该方法
        return key;
    }

    constructor(adaptor: Storage) {
        this.adapter = adaptor;
    }

    setItem(key: string, value: any): void {
        return this.adapter.setItem(this.getKey(key), JSON.stringify(value));
    }

    getItem(key: string): any {
        const rawValue: string | null = this.adapter.getItem(this.getKey(key));
        try {
            return JSON.parse(rawValue as string);
        } catch (e) {
            return rawValue;
        }
    }

    hasProperty(key: string): boolean {
        return Object.prototype.hasOwnProperty.call(this.adapter, this.getKey(key));
    }

    hasItem(key: string) {
        return this.hasProperty(this.getKey(key));
    }

    removeItem(key: any) {
        this.adapter.removeItem(this.getKey(key));
    }

    clear() {
        this.adapter.clear();
    }

    key(index: number): any {
        return JSON.parse(this.adapter.key(index) as string);
    }

    get length(): number {
        return this.adapter.length;
    }
}
