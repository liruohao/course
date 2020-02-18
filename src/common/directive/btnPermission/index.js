/**
 * @description: 按钮级权限
 * @date: 2018/11/11 17:20:49
 */

import Vue from 'vue'
import store from '@/store'

const btnPermission = Vue.directive('btnPermission', {
  bind (el, binding, vnode) {
    // 获取按钮权限
    let btnPermission = binding.value
    // 没有这个权限则移除
    if (!Vue.prototype.$_has(btnPermission)) {
      Vue.nextTick(() => {
        el.parentNode.removeChild(el)
      })
    }
  }
})
// 权限检查方法
Vue.prototype.$_has = function (value) {
  let has = false
  let menuList = store.getters.getMenuList
  if (menuList === '') {
    return false
  } else {
    menuList.map((menu) => {
      if (menu.id === value || value === undefined || value === '') {
        has = true
      }
    })
  }
  return has
}
export {
  btnPermission
}
