// 用户
import Entity from '@/base/Entity';

export interface UserInfo {
    name?: string;
    alias?: string;
    email?: string;
    order?: number[];
    avatar?: string;
    enable?: number;
    errmsg?: string;
    gender?: string;
    mobile?: string;
    qrCode?: string;
    status: number;
    userId?: string;
    userid?: string;
    address?: string;
    errcode?: number;
    extattr: {
        // 座位等信息
        attrs: any[];
    };
    qr_code?: string;
    staffId: number;
    isleader: number;
    position?: string;
    companyId: number;
    telephone?: string;
    department: number[];
    createdDate?: string;
    hide_mobile?: number;
    updatedDate?: string;
    thumb_avatar?: string;
    main_department: number;
    external_profile?: {
        external_attr: any[];
        external_corp_name: string;
    };
    is_leader_in_dept?: any[];
    consultInformation?: any;
    companyCode: string;
}
export default class User extends Entity {
    state: UserInfo;
}

export const user = new User(window.__INITIAL_STATE__.loginUser);
