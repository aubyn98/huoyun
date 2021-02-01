import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './common/css/common.scss'
import './common/css/el-common.scss'
import './common/css/record.scss'
import './common/css/media.scss'
import format from './common/js/format'
import request from './common/js/request'
import py from './common/js/Convert_Pinyin'
import './common/js/Bluetooth'
import exportExcel from '@/components/myComponents'
Vue.prototype.py = py
Vue.use(exportExcel)
Vue.use(format)
Vue.use(request)
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
