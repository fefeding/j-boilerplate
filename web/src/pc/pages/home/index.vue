<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue';
// import { user } from '@/domain/User';
// 使用proxy代替ctx，ctx生产不可用
const { proxy: ctx } = getCurrentInstance();
console.log(ctx);

//请求
// const appList = ctx.$ajax.requestApi({
//     url: "/api/apply/getAllSystem",
//     data: {
//         companyId: user.state.companyId,
//     },
// });

const cityOptions = ['上海', '北京', '广州', '深圳'];
const currentPagex = ref(1);
const handleSizeChange = () => {};
const handleCurrentChange = () => {};

const checkAll = ref(false);
const checkedCities = ref(['上海', '北京']);
const cities = ref(cityOptions);
const isIndeterminate = ref(true);

function handleCheckAllChange(val: string) {
    checkedCities.value = val ? cityOptions : [];
    isIndeterminate.value = false;
}
function handleCheckedCitiesChange(value: string[]) {
    let checkedCount = value.length;
    checkAll.value = checkedCount === cities.value.length;
    isIndeterminate.value = checkedCount > 0 && checkedCount < cities.value.length;
}
</script>

<template>
    <div class="home">
        <el-row>
            <el-button>默认按钮</el-button>
            <el-button type="primary">主要按钮</el-button>
            <el-button type="success">成功按钮</el-button>
            <el-button type="info">信息按钮</el-button>
            <el-button type="warning">警告按钮</el-button>
            <el-button type="danger">危险按钮</el-button>
        </el-row>
        <el-row>
            <el-button plain>朴素按钮</el-button>
            <el-button type="primary" plain>主要按钮</el-button>
            <el-button type="success" plain>成功按钮</el-button>
            <el-button type="info" plain>信息按钮</el-button>
            <el-button type="warning" plain>警告按钮</el-button>
            <el-button type="danger" plain>危险按钮</el-button>
        </el-row>
        <el-progress :text-inside="true" :stroke-width="26" :percentage="70"></el-progress>

        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
            >全选</el-checkbox
        >
        <div style="margin: 15px 0"></div>
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="city in cities" :label="city" :key="city">{{ city }}</el-checkbox>
        </el-checkbox-group>

        <div class="w-full mt-20">
            <el-pagination
                background
                v-model:currentPage="currentPagex"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="1000"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            >
            </el-pagination>
        </div>
    </div>
</template>
