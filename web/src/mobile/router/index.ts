import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// import ComponentDemo from '@/components/componentDemo.vue';
import config from '@/base/config';
import { abort } from '@/adapter/ajax';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/index',
    },
    {
        path: '/index',
        meta: {
            title: '首页',
            isNavMenu: true,
        },
        component: () => import('web/src/mobile/pages/home/index.vue'),
    },
    //设置兜底路由
    {
        path: '/:w+',
        redirect: {
            path: '/index',
        },
    },
];

const router = createRouter({
    history: createWebHistory(config.prefix),
    routes,
});

// 切换路由abort所有请求
router.beforeEach((to, from, next) => {
    abort();
    next();
});

export default router;
