<template>
    <div>
        <div class="jt-layout-main-content">
            <div class="breadcrumb-wrap">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :key="item.key" v-for="item in breadcrumb">
                        {{ item.meta.title }}
                        <el-tag type="warning" size="mini" v-if="item.meta && item.meta.breadcrumbTag">{{
                            item.meta.breadcrumbTag
                        }}</el-tag>
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="pt-20 box-border">
                <suspense>
                    <router-view />
                </suspense>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue';
// import { menuConfig } from '@/router/config';
import { useRoute, useRouter } from 'vue-router';
interface BreadcrumbItem {
    key: string;
    name: string;
    //eslint-disable-next-line
    meta: Record<string, any>;
}

export default defineComponent({
    name: 'JtContent',
    props: {},
    setup() {
        const route = useRoute();
        const router = useRouter();
        const routes = router.getRoutes();
        const navMenus = reactive([
            ...routes.filter(route => {
                return route.meta.isNavMenu;
            }),
        ]);
        const breadcrumb = computed((): Array<BreadcrumbItem> => {
            //借用ref保红线的解决方法
            // let router: any = this.$router;
            // const routerList = router.options.routes;
            /**hack結束 */
            let currentPath = route.path;
            function computedRouters(menu): Array<BreadcrumbItem> {
                let breadcrumbList: Array<BreadcrumbItem> = [];
                for (let i = 0; i < menu.length; i++) {
                    let menuItem = menu[i];
                    if (menuItem.path === '/') {
                        //不匹配根目录
                        continue;
                    }
                    let regexp = new RegExp(`^${menuItem.path}/`);
                    if (regexp.test(`${currentPath}/`)) {
                        breadcrumbList.push({ key: menuItem.path, name: menuItem.name, meta: menuItem.meta });
                        if (currentPath !== menuItem.path) {
                            breadcrumbList = breadcrumbList.concat(computedRouters(menuItem.children));
                        }
                        break;
                    }
                }
                return breadcrumbList;
            }
            return computedRouters(navMenus);
        });

        return {
            breadcrumb,
        };
    },
});
</script>

<style lang="scss">
// 面包屑
.breadcrumb-wrap {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eaeaea;
    & > .el-breadcrumb {
        .el-breadcrumb__item {
            font-size: 20px;
            color: #8e929a;
            text-align: justify;
            line-height: 20px;
            .el-tag {
                height: 22px;
                padding: 0px 7px;
                font-size: 14px;
                color: #df8a30;
                transform: translateY(-4px);
            }
        }
        .el-breadcrumb__inner {
            color: #8e929a;
        }
        .el-breadcrumb__item:last-child .el-breadcrumb__inner {
            font-weight: bold;
            color: #1e2536;
            &:hover {
                font-weight: bold;
                color: #1e2536;
            }
        }
    }
}

.jt-layout-main-content {
    box-sizing: border-box;
    height: 100%;
    min-height: 100vh;
    padding: 36px 40px;
    border-radius: 10px 0 0 10px;
    background: #fdfdfd;
}
</style>
