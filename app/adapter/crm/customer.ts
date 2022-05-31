import { Service } from 'egg';

/**
 * Customer Service
 */
export default class Customer extends Service {
    /**
     * sayHi to you
     * @param name - your name
     */
    async sayHi(name) {
        return `hi crm${name}, ${this.config.adapter}`;
    }
}
