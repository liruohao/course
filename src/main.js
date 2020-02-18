// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 全局样式文件
import 'styles/common.less'
// 样式重置
import 'styles/reset.css'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
// 自定义全局组件
import components from '@/common/components'
// jQuery
import $ from 'jquery'
// vuex
import store from './store'
// 自定义插件
import plugins from '@/common/plugins'
import axios from '@/common/axios'
import Echarts from 'echarts'
// 表单验证
import verify from '@/common/verify'
Vue.prototype.verify = verify
Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.use(ViewUI)
Vue.use(components)
Vue.use(Echarts)
Vue.prototype.$ = $
Vue.use(plugins)
Vue.prototype.$echarts = Echarts

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
