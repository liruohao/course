/**
 * @description: 通用正则验证方法
 * @date: 2018-09-04 11:29:05
 */
export default {
  // 验证Email
  checkEmail (nullTips, errTips) {
    return (rule, value, callback) => {
      if (!value) {
        return callback(new Error(nullTips || '不能为空'))
      }
      let pattern = new RegExp('^([a-z0-9A-Z]+[-|\\.|_]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$')
      if (pattern.test(value) === false) {
        return callback(new Error(errTips || '邮箱格式不正确'))
      } else {
        callback()
      }
    }
  },
  validateStandardItem (rule, value, callback) {
    if (!value) {
      return callback(new Error('条目号不能为空'))
    }
    let testval = /^[\u4E00-\u9FA5A-Za-z0-9.]+$/
    if (!value.match(testval)) {
      return callback(new Error('只能为字母、数字、汉字或小数点'))
    } else {
      callback()
    }
  },
  // 验证动态内容
  validateContent (rule, value, callback) {
    if (value === '<p>请输入内容</p>' || value === '') {
      return callback(new Error('动态内容不能为空'))
    } else {
      callback()
    }
  },
  // 验证手机号码
  checkMobilePhone (rule, value, callback) {
    if (!value) {
      return callback(new Error('手机号码不能为空'))
    }
    let tel = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
    if (!value.match(tel)) {
      return callback(new Error('手机格式不正确'))
    } else {
      callback()
    }
  },
  // 验证手机号码2
  checkMobilePhone2 (rule, value, callback) {
    let tel = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
    if (value === '') {
      callback()
    } else if (!value.match(tel)) {
      return callback(new Error('手机格式不正确'))
    }callback()
  },
  // 验证办公电话
  checkOfficePhone (rule, value, callback) {
    let tel2 = /^[0-9\-\\(\\)（）x]+$/
    if (value === null || value === '') {
      callback()
    } else if (!tel2.test(value)) {
      return callback(new Error('办公电话格式不正确'))
    } else {
      callback()
    }
  },
  // 验证个人中心传真
  checkFaxAddress (rule, value, callback) {
    let tel = /^\d{1,100}$/
    if (value === null || value === '') {
      callback()
    } else if (!value.match(tel)) {
      return callback(new Error('输入上限为100，且必须为数字'))
    } else {
      callback()
    }
  },
  checkOnlyNumber (rule, value, callback) {
    let tel = /^\d{1,2}$/
    if (value === null || value === '') {
      callback()
    } else if (!value.match(tel)) {
      return callback(new Error('仅能输入不大于两位的数字'))
    } else {
      callback()
    }
  },
  // 验证特殊字符（非必填）
  checkSpecialCharacter (rule, value, callback) {
    if (value === '') {
      callback()
    } else {
      let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{} %【】\\s‘；：”“'。，、？]") // eslint-disable-line
      setTimeout(() => {
        if (pattern.test(value) === true) {
          return callback(new Error('不能包含特殊字符'))
        } else {
          callback()
        }
      })
    }
  },
  // 验证url
  checkUrl (rule, value, callback) {
    if (value === '') {
      callback()
    } else {
      let pattern = new RegExp (/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/i) // eslint-disable-line
      setTimeout(() => {
        if (pattern.test(value) === false) {
          return callback(new Error('链接网址格式错误'))
        } else {
          callback()
        }
      })
    }
    callback()
  },
  // 验证特殊字符无长度限制（必填）
  checkSpecialCharacter2 (rule, value, callback) {
      let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\]<>/?~！@#￥……&*（）——|{} %【】\\s‘；：”“'。，、？]") // eslint-disable-line
    setTimeout(() => {
      if (pattern.test(value) === true) {
        return callback(new Error('不能包含特殊字符'))
      } else {
        callback()
      }
    })
  },
  // 验证标准法规属性管理字符长度与非空
  checkCharacter (rule, value, callback) {
    if (value === '') {
      return callback(new Error('选项不能为空'))
    } else {
      let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{} %【】\\s‘；：”“'。，、？]") // eslint-disable-line
      setTimeout(() => {
        if (pattern.test(value) === true) {
          return callback(new Error('不能包含特殊字符'))
        } callback()
      })
    }
  },
  // 验证标准法规属性管理字符长度与非空
  checkCharacter2 (rule, value, callback) {
    if (value === '') {
      return callback(new Error('描述不能为空'))
    } else {
      let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{} % \\s【】‘；：”“'。，、？]") // eslint-disable-line
      setTimeout(() => {
        if (pattern.test(value) === true) {
          return callback(new Error('不能包含特殊字符'))
        } callback()
      })
    }
  },
  // 验证动态信息管理动态标题
  checkInformation (rule, value, callback) {
    if (value === '') {
      return callback(new Error('动态标题不能为空'))
    } else {
      let pattern = new RegExp("[`~!@#$^&*=|{}':;',\\[\\].<>/?~！@#￥……&*——|{}%【】‘；：”“'。，、？]")// eslint-disable-line
      setTimeout(() => {
        if (pattern.test(value) === true) {
          return callback(new Error('不能包含特殊字符'))
        } callback()
      })
    }
  },
  // 验证动态信息管理动态标题
  checkInformationTestItemStand (rule, value, callback) {
    if (value === '') {
      return callback(new Error('动态标题不能为空'))
    } else {
      let pattern = new RegExp("[`~!@#$^&*=|{}':;',\\[\\]<>?~！@#￥……&*——|{}%【】‘；：”“'。，、？]")// eslint-disable-line
      setTimeout(() => {
        if (pattern.test(value) === true) {
          return callback(new Error('不能包含特殊字符'))
        } callback()
      })
    }
  },
  // 验证账号
  checkUsername (nullTips, errTips) {
    return (rule, value, callback) => {
      if (!value) {
        return callback(new Error(nullTips || '不能为空'))
      }
      let pattern = /\w{3,15}$/
      setTimeout(() => {
        if (pattern.test(value) === false) {
          return callback(new Error(errTips || '只能由3-15位的数字、字母组成'))
        } else {
          callback()
        }
      }, 1000)
    }
  },
  validateStandardNum (rule, value, callback) {
    let testval = /^\d+(\.\d+)*$/
    let pattern1 = /\w{1,100}$/
    let pattern2 = /\w{0,100}$/ // 验证代替标准号，和被代替标准号，因为非必填项，所以长度可能是0
    if (rule.field === 'standNumber') {
      if (!value) {
        return callback(new Error('标准编号不能为空'))
      } else if (!value.match(testval)) {
        return callback(new Error('1到100字符数字，支持“数字.数字”'))
      } else if (!value.match(pattern1) && rule.field === 'standNumber') {
        return callback(new Error('1到100字符数字，支持“数字.数字”'))
      } else {
        callback()
      }
    } else {
      if (value) {
        if (!value.match(testval)) {
          return callback(new Error('100以内字符，支持“数字.数字”'))
        } else if (!value.match(pattern2) && rule.field !== 'standNumber') {
          return callback(new Error('100以内字符，支持“数字.数字”'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
  },
  // 验证排序序号
  validateStandarOrder (rule, value, callback) {
    if (!value) {
      return callback(new Error('排序序号不能为空'))
    }
    let tel = /^[0-9]*$/
    if (!value.match(tel)) {
      return callback(new Error('请输入100以内的正整数'))
    } else {
      if (value > 0 && value < 100) {
        callback()
      } else {
        return callback(new Error('请输入100以内的正整数'))
      }
    }
  },
  validStandNumInCompile2 (rule, value, callback) {
    let pattern = /^\d+$/
    setTimeout(() => {
      if (!pattern.test(value)) {
        return callback(new Error('仅能输入正整数'))
      } else {
        callback()
      }
    })
  },
  valiateEnName (rule, value, callback) {
    let reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/
    if (value === '' || value == null) {
      callback()
    } else {
      if (value.match(reg)) {
        return callback(new Error('英文名称不能输入中文'))
      } else {
        /* let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{} %【】‘；：”“'。，、？]") // eslint-disable-line
        setTimeout(() => {
          if (pattern.test(value) === true) {
            return callback(new Error('不能包含特殊字符'))
          } else {
            callback()
          }
        }) */
        callback()
      }
    }
  },
  valiateStandYear (rule, value, callback) {
    let reg = /^\d{4}$/
    if (value.match(reg)) {
      callback()
    } else {
      return callback(new Error('输入正确的年份'))
    }
  },
  // 验证特殊字符,但不包括半角分号（非必填） gaoyan
  checkSpecialCharacterOftags (rule, value, callback) {
    if (value === '') {
      callback()
    } else {
      let pattern = new RegExp("[`~!@#$^&*=|{}':',\\[\\].<>/?~！@#￥……&*——|{}%【】‘：”“'。，、？]")// eslint-disable-line
      setTimeout(() => {
        if (pattern.test(value) === true) {
          return callback(new Error('不能包含特殊字符'))
        } callback()
      })
    }
  },
  // syt 系统账户验证
  checkUsername2 (rule, value, callback) {
    let reg = /^(?=.*[a-zA-Z])/
    if (value === '' || value == null) {
      return callback(new Error('系统账号不能为空'))
    } else {
      if (!value.match(reg)) {
        return callback(new Error('至少包含1个字母'))
      } else {
        let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{} %【】‘；：”“'。，、？]") // eslint-disable-line
        setTimeout(() => {
          if (pattern.test(value) === true) {
            return callback(new Error('不能包含特殊字符'))
          } else {
            callback()
          }
        })
      }
    }
  },
  // 验证企业标准台账标准编号,仅能输入英文，数字，点，/，-
  validStandNumInCompile (rule, value, callback) {
    if (value === '') {
      callback()
    } else {
      let pattern = /^[a-zA-Z0-9//]*$/
      setTimeout(() => {
        if (!value.match(pattern)) {
          return callback(new Error('仅能输入英文，数字，/'))
        } callback()
      })
    }
  },
  valiCategory (rule, value, callback) {
    if (value != null && value.length > 20) {
      return callback(new Error('多选择项不能超过20个'))
    } else {
      callback()
    }
  }
}
