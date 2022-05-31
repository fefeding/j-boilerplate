import { createStore, createLogger } from 'vuex';

import products from './modules/products';

const debug = window.__INITIAL_STATE__.env !== 'prod';

//示例
export default createStore({
    modules: {
        products,
    },
    strict: debug,
    plugins: debug ? [createLogger()] : [],
});

//使用
// import { useStore } from 'vuex'
// const store = useStore()
