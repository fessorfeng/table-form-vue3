import { createApp } from 'vue';
import App from './App.vue';

import router from './router';
import store from './store';

import ElementPlus from './plugins/element-plus/index';
import 'element-plus/packages/theme-chalk/src/base.scss';


// import lang from 'element-plus/lib/locale/lang/zh-cn';
// import 'dayjs/locale/zh-cn';
// import locale from 'element-plus/lib/locale';

// // 设置语言
// locale.use(lang);


createApp(App)
  .use(ElementPlus)
  .use(store).use(router)
  .mount('#app');
