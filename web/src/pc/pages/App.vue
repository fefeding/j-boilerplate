<script setup lang="ts">
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import { ref } from 'vue';
import JtHeader from '@/pc/components/layout/Header.vue';
import JtFooter from '@/pc/components/layout/Footer.vue';
import JtAsideNav from '@/pc/components/layout/AsideNav/AsideNav.vue';
import JtContent from '@/pc/components/layout/Content.vue';
import config from '@/base/config';
import { useRoute } from 'vue-router';
console.log('config', config);
const collapse = ref(false);
const route = useRoute();
</script>

<template>
    <div>
        <el-config-provider :locale="zhCn">
            <JtHeader />
            <JtFooter />
            <JtAsideNav v-if="!route.meta.leftNavHidden" id="jt-aside-nav" v-model:collapse="collapse" />
            <JtContent
                id="jt-content"
                :class="`${collapse ? 'aside-nav-collapse' : ''} ${
                    !route.meta.leftNavHidden ? 'is-nofull-width' : 'is-full-width'
                }`"
            />
        </el-config-provider>
    </div>
</template>

<style lang="scss" scoped>
#jt-aside-nav {
    position: fixed;
    height: 100vh;
}
#jt-content {
    width: calc(100vw - 240px);
    margin-left: 240px;
    background-image: linear-gradient(-16deg, #070709 0%, #2f3137 65%);
    &.aside-nav-collapse {
        width: calc(100vw - 80px);
        margin-left: 80px;
    }
}

.is-full-width {
    width: 100vw !important;
    margin-left: 0px !important;
    background-image: none !important;
}

.is-nofull-width {
    width: calc(100vw - 240px);
    background-image: linear-gradient(-16deg, #070709 0%, #2f3137 65%);
}
</style>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

body {
    margin: 0;
}
</style>
