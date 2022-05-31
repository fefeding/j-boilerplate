import { JV } from 'proto/JvSvr';

// 公共结构体定义
export interface CustomerUserList {
    ret: number;
    msg?: string;
    list: { name: string; accountId: string }[];
    total: number;
}

export interface QRCode {
    qrCode: string;
}

export interface User {
    userId: string;
    name: string;
    companyCode: string;
}

export default interface Adapter {
    user: {
        // 获取用户信息
        user(): User;
        // 获取投顾二维码
        getQRCode(): Promise<QRCode>;
        // 鉴权
        auth(): Promise<{ ret: number; msg: string }>;
    };
    customer: {
        // 获取投顾的客户列表
        getUserList(customerType: JV.ECustomerType): Promise<CustomerUserList>;
    };
    config: {
        // 获取环境特有的所有配置数据ff
        all(): Record<string, any>;
    };
    // 工具方法，只在适配器内部使用
    helper: any;
}
