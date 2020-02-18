/**
 * @description: 自定义全局组件
 * @date: 2018-09-10 14:41:16
 */

import PanelHeader from './panel/PanelHeader'
import PanelContent from './panel/PanelContent'
import Loading from './loading'
import TableToolsBar from './tableToolsBar'

const install = function (Vue) {
  Vue.component('PanelHeader', PanelHeader)
  Vue.component('PanelContent', PanelContent)
  Vue.component('loading', Loading)
  Vue.component('tableToolsBar', TableToolsBar)
}

export default {
  install
}
