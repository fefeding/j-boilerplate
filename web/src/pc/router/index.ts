import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
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
            icon: 'jt-icon-common',
            isNavMenu: true,
        },
        component: () => import('web/src/pc/pages/home/index.vue'),
    },
    {
        path: '/example',
        meta: {
            title: '示例',
            icon: 'jt-icon-pm-operate',
            isNavMenu: true,
        },
        component: () => import('../pages/Container.vue'),
        children: [
            {
                path: '/example/example1',
                meta: {
                    title: '示例1',
                },
                component: () => import('web/src/pc/pages/home/example.vue'),
            },
        ],
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
