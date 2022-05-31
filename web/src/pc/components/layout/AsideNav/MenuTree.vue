<script setup lang="ts">
import type { PropType } from 'vue';
const props = defineProps({
    list: {
        //eslint-disable-next-line
        type: Array as PropType<any[]>,
        default: () => {
            return [];
        },
    },
});
console.log(props);
</script>

<template>
    <div>
        <template v-for="item in list">
            <template v-if="!item.children?.length > 0">
                <el-menu-item :index="item.path" :key="item.path" v-show="!(item.meta && item.meta.hidden)">
                    <i :class="item.meta.icon"></i>
                    <template #title>
                        <span>{{ item.meta.title }}</span>
                    </template>
                </el-menu-item>
            </template>
            <el-sub-menu v-else :key="item.path" :index="item.path" v-show="!(item.meta && item.meta.hidden)">
                <template #title>
                    <i :class="item.meta.icon"></i>
                    <span>{{ item.meta.title }}</span>
                </template>
                <MenuTree :list="item.children"></MenuTree>
            </el-sub-menu>
        </template>
    </div>
</template>
