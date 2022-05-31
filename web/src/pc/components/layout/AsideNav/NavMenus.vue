<script setup lang="ts">
import { reactive } from 'vue';
import MenuTree from './MenuTree.vue';
import { useRouter } from 'vue-router';

defineProps({
    collapse: Boolean,
});

const router = useRouter();
const routes = router.getRoutes();
const navMenus = reactive([
    ...routes.filter(route => {
        return route.meta.isNavMenu;
    }),
]);
</script>

<template>
    <el-menu
        id="jt-layout-aside__navmenu"
        router
        size="small"
        :default-active="$route.path"
        :collapse-transition="false"
        :collapse="collapse"
        :unique-opened="true"
    >
        <MenuTree :list="navMenus" />
    </el-menu>
</template>

<style lang="scss">
#jt-layout-aside__navmenu {
    flex: 1;
    width: 100%;
    border-right: none;
    background: transparent;
    & > li {
        margin-bottom: 10px;

        .icon {
            color: #deb385;
            font-size: 28px;
        }
    }
    .el-sub-menu__title,
    .el-menu-item,
    .el-menu-item:hover,
    .el-menu-item:focus {
        border-right: none;
        background: transparent;
    }

    .el-menu-item,
    .el-sub-menu {
        opacity: 0.7;

        &.is-active,
        &:hover,
        &.is-opened {
            opacity: 1;
        }
    }

    .el-menu-item,
    .el-sub-menu__title {
        // padding: 0 30px 0 26px;
        height: 48px;
        display: block;
        line-height: 38px;
        font-size: 14px;
        font-weight: 500;
        text-align: left;
        color: #deb385;
        span {
            margin-left: 12px;
            margin-top: 4px;
            position: absolute;
        }
    }

    .el-menu--collapse > div > .el-sub-menu.is-active::before,
    .el-menu-item.is-active::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        box-sizing: border-box;
        border-left: 4px solid #deb385;
        background-image: linear-gradient(270deg, rgba(224, 180, 139, 0) 6%, rgba(247, 210, 171, 0.18) 100%);
        box-shadow: 0px 8px 8px 0px rgba(0, 0, 0, 0.1);
    }

    .el-menu-item div {
        margin-left: 6px;
    }

    .el-menu--inline {
        background: rgba(0, 0, 0, 0.24);

        .el-menu-item {
            padding: 0 46px 0 !important;
            margin: 0;
            border-bottom: 1px rgba(222, 179, 133, 0.2) solid;

            &:last-child {
                border-bottom: none;
            }
        }
    }

    .el-sub-menu__icon-arrow {
        font-size: 18px;
        color: #deb385;
        font-weight: 600;
        margin-right: 10px;
    }

    .el-sub-menu.is-opened > .el-sub-menu__title .el-sub-menu__icon-arrow {
        transform: rotateZ(180deg);
    }
}
.el-menu--vertical.jt-aside-sub-menu__popver {
    margin-top: 0px;

    &::before {
        display: block;
        content: '';
        position: absolute;
        left: -6px;
        top: 18px;
        transform: rotate(45deg);
        width: 14px;
        height: 14px;
        background: rgb(43, 43, 43);
    }

    .el-menu {
        overflow: hidden;
        margin: 0;
        padding: 8px 0;
        border-radius: 8px;
        background: rgb(43, 43, 43);
        box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.36);
    }

    .el-menu-item {
        box-sizing: border-box;
        width: 264px;
        height: 60px;
        line-height: 60px;
        border-bottom: 1px solid rgba(222, 179, 133, 0.08);
        font-size: 16px;
        font-weight: 400;
        color: rgba(222, 179, 133, 0.6);

        &:hover,
        &.is-active {
            background: inherit;
            color: #deb385;
        }
        &.is-active {
            font-weight: 600;
        }
    }
}
.el-menu--collapse .el-sub-menu__title span {
    height: 0;
    width: 0;
    overflow: hidden;
    visibility: hidden;
    display: inline-block;
}
.el-menu--collapse .el-sub-menu__icon-arrow {
    display: none;
}
.el-menu--collapse .el-sub-menu__title i:first-child {
    margin-left: 12px;
}

.el-menu:not(.el-menu--collapse) {
    width: 100% !important;
}
</style>
