/**
 * @description: 自定义插件
 * @author: xx
 * @date: 2018-08-29 10:17:59
 */

import dateFormat from './date'
import easyDateFormat from './easyDateFormat'
import loading from './loading'
import confirm from './confirm'
import hasPermission from './hasPermission'
import base64 from './base64'

const install = function (Vue) {
  if (install.installed) return
  install.installed = true
  Object.defineProperties(Vue.prototype, {
    $dateFormat: {
      get () {
        return dateFormat
      }
    },
    $easyDateFormat: {
      get () {
        return easyDateFormat
      }
    },
    $loading: {
      get () {
        return loading
      }
    },
    $confirm: {
      get () {
        return confirm
      }
    },
    $hasPermission: {
      get () {
        return hasPermission
      }
    },
    $base64: {
      get () {
        return base64
      }
    }
  })
}

export default {
  install
}
