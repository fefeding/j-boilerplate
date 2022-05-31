<template>
    <el-aside class="jt-layout-aside-nav" :class="{ 'is-collapse': collapse }" :width="collapse ? '80px' : '240px'">
        <i class="jt-icon-test-flag" v-if="env !== 'prod'"></i>
        <header>
            <div class="jt-site-title">
                <i class="jt-icon-logo-text" v-show="!collapse"></i>
                <i class="jt-icon-logo" v-show="collapse"></i>
            </div>
        </header>
        <JtAsideNavMenus :collapse="collapse" />
        <div class="user-wrap">
            <div class="user-icon-wrap">
                <i class="jt-icon-person"></i>
                <span v-show="!collapse">{{ loginUser.userid }}</span>
            </div>
            <div class="user-icon-wrap">
                <i class="jt-icon-logout"></i>
                <span @click="logout" v-show="!collapse">登出</span>
            </div>
        </div>
        <el-button @click="changeMenu" class="fold-btn" type="text">
            <i v-show="!collapse" class="jt-icon-fold"></i>
            <i v-show="collapse" class="jt-icon-unfold"></i>
        </el-button>
    </el-aside>
</template>

<script lang="ts">
import { post } from '@/adapter/ajax';
import { defineComponent } from 'vue';
import JtAsideNavMenus from './NavMenus.vue';

export default defineComponent({
    name: 'JtAsideNav',
    props: {
        collapse: Boolean,
    },
    components: {
        JtAsideNavMenus,
    },
    data() {
        return {
            siteName: '内容管理系统',
            env: 'dev',
            loginUser: '',
        };
    },
    mounted() {
        /**
         * 左上角测试标志控制
         */
        this.env = window.__INITIAL_STATE__.jvCommon.env;
        this.loginUser = window.__INITIAL_STATE__.loginUser;
    },
    methods: {
        changeMenu(): void {
            this.$emit('update:collapse', !this.collapse);
            if (localStorage) {
                localStorage.setItem('collapse', JSON.stringify(this.collapse));
            }
        },
        async onExitClick(): Promise<void> {
            console.log('cms exit;');
        },
        // 退出登录
        async logout() {
            console.log('?');

            const res = await post({
                url: '/api/login/logout',
                method: 'post',
                data: {
                    id: this.loginUser.staffId,
                },
            });
            if (res) {
                location.reload();
            }
        },
    },
});
</script>

<style scoped lang="scss">
$jv-ptc: #deb385;
.jt-layout-aside-nav {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: linear-gradient(343deg, #070709 0%, #2f3137 100%);
    overflow: hidden;

    .jt-icon-test-flag {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
    }
    .jt-site-title {
        padding: 36px 0 54px 24px;
        text-align: left;
        background: transparent;
    }
    .jt-aside-nav__btn-group {
        .jt-aside-nav__user-btn {
            padding: 0;
            border-color: transparent;
            background-color: transparent;
        }
        .jt-aside-nav__user-btn,
        .jt-aside-nav__fold-btn {
            display: block;
            margin: 15px 26px;
            padding-right: 20px;
        }
    }
    .user-wrap {
        z-index: 1;
        font-size: 28px;
        color: $jv-ptc;
        text-align: left;
        margin-bottom: 25px;
        .user-icon-wrap {
            font-size: 16px;
            display: flex;
            padding: 14px 40px 15px 40px;
            text-align: center;
            // width: 29px;
            height: 29px;
            line-height: 26px;
            border-bottom: 1px solid rgba(222, 179, 133, 0.1);
            span {
                // width: 68%;
                margin-left: 20px;
                cursor: pointer;
            }
        }
        .user-icon-wrap:nth-child(1) {
            border-top: 1px solid rgba(222, 179, 133, 0.1);
        }
        .jv-icon-user {
            display: block;
        }
    }
    .fold-btn {
        text-align: center;
        // position: fixed;
        bottom: 10px;
        color: $jv-ptc;
        z-index: 1;
        font-size: 28px;
    }
}

// 收起状态
.jt-layout-aside-nav.is-collapse {
    .el-menu {
        & > li {
            margin-bottom: 12px;
        }
    }
    .user-icon-wrap {
        padding: 14px 40px 15px 25px;
        display: block;
    }
    // 菜单栏收起状态
    .el-menu--collapse {
        .el-menu-item,
        .el-submenu {
            height: 64px;
            line-height: 1;
            margin-bottom: 24px;
            padding: 0 !important;
        }

        .submenu-title,
        .menu-content-collapse {
            height: 64px;
            line-height: 1;
            display: block;
            box-sizing: border-box;
        }

        .el-menu-item,
        .el-submenu {
            opacity: 0.7;

            &.is-active,
            &.is-opened,
            &:hover {
                opacity: 1;
            }
        }

        .el-menu-item.is-active::before,
        .el-submenu.is-active::before {
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

        .el-submenu__title {
            & * {
                vertical-align: unset;
            }

            height: 64px;
            line-height: 1;
        }

        .menu-content-collapse,
        .el-submenu__title {
            padding: 10px 0 5px !important;
            text-align: center;
            background: transparent;

            .menu-text.title {
                font-size: 14px;
                color: #deb385;
                line-height: 21px;
                margin: 0;
            }
        }
    }
}
</style>
<style lang="scss">
.jt-aside-nav__user-popper.el-popper.is-light {
    padding: 15px 24px;
    background: rgb(43, 43, 43);
    box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.36);
    border: none;

    &[data-popper-placement^='right'] .el-popper__arrow {
        border-right-color: rgb(43, 43, 43);
        &::before,
        &::after {
            background: rgb(43, 43, 43);
            border-color: rgb(43, 43, 43);
        }
    }

    .el-button {
        padding: 0;
        opacity: 0.7;
        font-size: 16px;
        color: #deb385;
        font-weight: 400;
    }

    .el-button:hover {
        opacity: 1;
    }
    .user-btn {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .el-button:not(:last-child) {
            margin-left: 10px;
            margin-bottom: 15px;
        }
    }
}
</style>
