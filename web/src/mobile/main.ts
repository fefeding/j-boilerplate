import { createApp } from 'vue';

//mobile
import Vant from 'vant';
import 'vant/lib/index.css';
import mRouter from '@/mobile/router';
import mApp from '@/mobile/pages/App.vue';

//common
import 'dayjs/locale/zh-cn';
import store from '@/store/index';
import 'web/asset/icons/font/iconfont';
import ajax from '@/adapter/ajax';

const app = createApp(mApp);
app.use(mRouter).use(store).use(Vant).mount('#app');

//共同的属性
app.config.globalProperties.$ajax = ajax.axiosInstance;

// app.use(store)
