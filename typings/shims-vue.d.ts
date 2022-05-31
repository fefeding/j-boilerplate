/* eslint-disable */
import { AxiosStatic } from 'axios';
import { IMessage } from 'element-plus/packages/message/src/types';
import { ElMessageBox } from 'element-plus/packages/message-box/src/message-box.type';
declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $ajax: AxiosStatic;
        $message: IMessage;
        $messageBox: ElMessageBox;
    }
}
