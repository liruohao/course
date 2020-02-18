/**
 * @author liruohao
 * @date 2019/6/21
 * @Description: Base64加密 + 反转
 */
export default (item) => {
  let Base64 = require('js-base64').Base64
  let password = Base64.encode(item)
  let code = password.split('').reverse().join('')
  return code
}
