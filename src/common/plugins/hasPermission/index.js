/**
 * @description: 判断是否含有指定权限
 * @date: 2019/01/17 15:42:32
 */

import store from '@/store'
export default (permissionId) => {
  let flag = false
  const MENULIST = store.getters.getMenuList
  MENULIST.map((permissionItem) => {
    if (permissionItem.id === permissionId) {
      flag = true
    }
  })
  return flag
}
