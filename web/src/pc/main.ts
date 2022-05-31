import { createApp } from 'vue';
// pc
import App from '@/pc/pages/App.vue';
import router from '@/pc/router';
import ElementPlus from 'element-plus';
import '@/pc/pages/App.css';
// 自定义element+主题色：#deb385（primary）
import 'web/asset/css/index.scss';

//common
import 'dayjs/locale/zh-cn';
import store from '@/store/index';
import 'web/asset/icons/font/iconfont';
import ajax from '@/adapter/ajax';

const app = createApp(App);
app.use(store).use(router).use(ElementPlus).mount('#app');

//共同的属性
app.config.globalProperties.$ajax = ajax.axiosInstance;

// app.use(store)
