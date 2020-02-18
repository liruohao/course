/**
 * @description: axios
 * @date: 2018/12/20 14:13:36
 */
import axios from 'axios'

// FormData格式处理
let formData = (data) => {
  let _formData = new FormData()
  for (let i in data) {
    _formData.append(i, data[i])
  }
  return _formData
}

axios.defaults.retry = 1
axios.defaults.retryDelay = 1000
axios.defaults.timeout = 5000
axios.defaults.headers['content-type'] = 'application/json'
// 请求拦截
axios.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error.response)
  })

export default {
  /**
   * @description: get请求
   * @date: 2018/12/20 14:22:36
   */
  get (url, params, thenFun, exeFun) {
    axios.get('/course/' + url + '?' + new Date().getTime(), {
      params: params
    }).then(res => {
      thenFun.call(this, res.data)
    }).catch(err => {
      exeFun.call(this, err)
    })
  },

  /**
   * @description: post请求(json格式提交)
   * @date: 2018/12/20 14:24:47
   */
  post (url, params, thenFun, exeFun) {
    axios.post('/course/' + url + '?' + new Date().getTime(), params).then(res => {
      thenFun.call(this, res.data)
    }).catch(err => {
      exeFun.call(this, err)
    })
  },

  /**
   * @description: post请求(formData格式提交)
   * @date: 2018/12/20 14:27:30
   */
  postData (url, params, thenFun, exeFun) {
    var _formData = formData(params)
    axios.post('/course/' + url + '?' + new Date().getTime(), _formData).then(res => {
      thenFun.call(this, res.data)
    }).catch(err => {
      exeFun.call(this, err)
    })
  },

  /**
   * @description: put请求(json格式提交)
   * @date: 2018/12/20 14:29:27
   */
  put (url, params, thenFun, exeFun) {
    axios.put('/course/' + url + '?' + new Date().getTime(), params).then(res => {
      thenFun.call(this, res.data)
    }).catch(err => {
      exeFun.call(this, err)
    })
  },

  /**
   * @description: put请求(formData格式提交)
   * @date: 2018/12/20 14:31:32
   */
  putData (url, params, thenFun, exeFun) {
    var _formData = formData(params)
    axios.put('/course/' + url, _formData).then(res => {
      thenFun.call(this, res.data)
    }).catch(err => {
      exeFun.call(this, err)
    })
  },

  /**
   * @description: delete请求
   * @date: 2018/12/20 14:32:58
   */
  delete (url, params, thenFun, exeFun) {
    axios.delete('/course/' + url + '?' + new Date().getTime(), {
      params: params
    }).then(res => {
      thenFun.call(this, res.data)
    }).catch(err => {
      exeFun.call(this, err)
    })
  },

  /**
   * @description: delete方法(根据id删除)
   * @date: 2018/12/20 14:33:46
   */
  deleteById (url, params, thenFun, exeFun) {
    axios.delete('/course/' + url + '?' + new Date().getTime()).then(res => {
      thenFun.call(this, res.data)
    }).catch(err => {
      exeFun.call(this, err)
    })
  },

  /**
   * @description: 文件上传
   * @date: 2019/04/11 11:08:58
   */
  uploadFile (url, params, thenFun, exeFun) {
    var _formData = formData(params)
    axios.post('/course/' + url + '?' + new Date().getTime(), _formData, {
      timeout: 0
    }).then(res => {
      thenFun.call(this, res.data)
    }).catch(err => {
      exeFun.call(this, err)
    })
  }
}
