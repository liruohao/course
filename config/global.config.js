/**
 * @description: 接口url配置
 * @date: 2018/12/20 14:03:59
 */

const DEV_IP = 'localhost'
const DEV_INTERFACE_PORT = '8087'

// 生产环境配置
const PROD_IP = 'localhost'
const PROD_INTERFACE_PORT = '8087'

// 判断环境
const SERVER_IP = process.env.NODE_ENV === 'production' ? PROD_IP : DEV_IP
const INTERFACE_PORT = process.env.NODE_ENV === 'production' ? PROD_INTERFACE_PORT : DEV_INTERFACE_PORT

module.exports =  {
  serverUrl: 'http://' + SERVER_IP, // 服务器IP地址
  interfaceUrl: 'http://' + SERVER_IP + ':' + INTERFACE_PORT + '/course' // 服务器接口访问地址
}
