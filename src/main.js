import Vue from 'vue'
import App from './App.vue'
import router from './router'

// Element UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// Vant
import Vant from 'vant'
import 'vant/lib/index.css'

// 基础样式
import './assets/css/base.css'

Vue.use(ElementUI)
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
