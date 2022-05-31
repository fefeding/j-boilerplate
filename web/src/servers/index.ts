import { post, AjaxPromise } from '@/adapter/ajax';

//前端单独处理请求，视图层再来拿
export default {
    Test(params: any) {
        return post({
            url: '/api/home/test',
            data: params,
        }) as AjaxPromise<any>;
    },
};
