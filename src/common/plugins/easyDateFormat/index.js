/**
 * @description: 简单日期转换
 * @date: 2018/11/01 10:40:26
 */
export default (date, time) => {
  let year = new Date(date).getFullYear()
  let month = new Date(date).getMonth() + 1
  let day = new Date(date).getDate()
  if (time !== undefined) {
    let hour = new Date(date).getHours()
    let minute = new Date(date).getMinutes()
    let second = new Date(date).getSeconds()
    return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) + ' ' + hour < 10 ? '0' + hour : hour + ':' + minute < 10 ? '0' + minute : minute + ':' + second < 10 ? '0' + second : second
  } else {
    return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day)
  }
}
