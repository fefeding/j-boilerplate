// 事件总线
import EventEmitter from '@/base/EventEmitter';

const bus = new EventEmitter();

export default bus;

export enum EventName {
    /**
     * 事件名
     */
    eventCustName = 'event-cust-name',
}
