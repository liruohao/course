/**
 * @description: Vue状态管理器
 * @author: xx
 * @date: 2018-08-29 10:09:50
 */
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
Vue.use(Vuex)

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})
