<template>
    <router-view></router-view>
</template>
<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from 'vue';

const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';

const setFontSize = () => {
    const html = document.getElementsByTagName('html')[0];
    const width = window.innerWidth || window.screen?.availWidth;
    const fontSize = (width / 375) * 10;
    html.style.fontSize = fontSize + 'px';
};

onMounted(() => {
    setFontSize();
    try {
        window.addEventListener(resizeEvt, setFontSize, false);
        document.addEventListener('DOMContentLoaded', setFontSize, false);
    } catch (e) {
        console.log(e);
    }
});

onBeforeUnmount(() => {
    window.removeEventListener(resizeEvt, setFontSize, false);
    document.removeEventListener('DOMContentLoaded', setFontSize, false);
    document.documentElement.style.fontSize = '';
});
</script>
