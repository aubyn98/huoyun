import axios from 'axios'
import qs from 'qs'
import {
  Loading,
  Message
} from 'element-ui'
const baseURL = process.env.NODE_ENV !== 'production' ? 'http://172.16.1.249:5000/' : './'
// const baseURL2 = process.env.NODE_ENV !== 'production' ? 'http://192.168.8.252:7001/' : location.href.match(/^(http:\/\/(.*)\/)#/)[1]
let loadingInstance1 = null; let loadingInstance2 = null

const instance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  timeout: 5000,
  transformRequest: (data) => {
    loadingInstance1 = Loading.service({
      fullscreen: true,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
      text: '拼命加载中...'
    })
    return data
  },
  transformResponse: (data) => {
    loadingInstance1.close()
    return JSON.parse(data)
  }
})
const instance2 = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  timeout: 5000
})
const instance3 = axios.create({
  baseURL: baseURL,
  methods: 'post',
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  timeout: 5000
  /* onUploadProgress: e => {
    this.progress = ((e.loaded / e.total) * 100) | 0;
  } */
})
const instance4 = axios.create({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  timeout: 5000,
  transformRequest: (data) => {
    loadingInstance2 = Loading.service({
      fullscreen: true,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
      text: '拼命加载中...'
    })
    return data
  },
  transformResponse: (data) => {
    loadingInstance2.close()
    return JSON.parse(data)
  }
})
const $req = (url, data, options) => {
  return new Promise(resolve => {
    const obj = {
      method: 'post',
      url: url
    }
    if (options) {
      const keyArr = Object.keys(options)
      keyArr.forEach(item => {
        obj[item] = options[item]
      })
    }
    obj.method === 'post' ? obj.data = qs.stringify(data) : obj.params = data
    instance(obj).then(res => {
      resolve(res.data)
    }).catch((e) => {
      loadingInstance1.close()
      Message.error('未能与请求服务器连接！')
    })
  })
}
const $req2 = (url, data, options) => {
  return new Promise(resolve => {
    const obj = {
      method: 'post',
      url: url
    }
    if (options) {
      const keyArr = Object.keys(options)
      keyArr.forEach(item => {
        obj[item] = options[item]
      })
    }
    obj.method === 'post' ? obj.data = qs.stringify(data) : obj.params = data
    instance2(obj).then(res => {
      resolve(res.data)
    })
  })
}

const $reqFile = (url, data) => {
  const formData = new FormData()
  Object.keys(data).forEach(key => {
    formData.append(key, data[key])
  })
  return new Promise(resolve => {
    instance3.post(url, formData).then(res => {
      resolve(res)
    })
  })
}
const $remoteMethod = (query, url, key, cb) => {
  $req2(url, {}, {
    method: 'get'
  }).then(res => {
    if (res && res.res) {
      const list = res.res.filter(item => {
        return item[key].toLowerCase()
          .indexOf(query.toLowerCase()) > -1
      })
      cb(list)
    } else {
      const list = []
      cb(list)
    }
  })
}
const $querySearchAsync = (str, cb, url, key, cb2) => {
  $req2(url, {}, {
    method: 'get'
  }).then(res => {
    if (res && res.res) {
      res.res.forEach(item => {
        item.value = item[key]
      })
      var results = str ? res.res.filter(item => {
        // item.value.includes(str.toUpperCase()) || item.value.includes(str.toLowerCase())
        if (item.value.startsWith(str)) {
          return item
        }
      }) : res.res
      cb(results)
      if (cb2) {
        cb2(JSON.parse(JSON.stringify(results)), results.length >= 1 && str)
      }
    }
  })
}
const $querySearchAsync2 = (str, cb, url, key, key2, cb2) => {
  $req2(url, {}, {
    method: 'get'
  }).then(res => {
    if (res && res.res) {
      res.res.forEach(item => {
        item.value = item[key]
      })
      var results = str ? res.res.filter(item => {
        // item.value.includes(str.toUpperCase()) || item.value.includes(str.toLowerCase())
        if (item[key2].startsWith(str.toUpperCase()) || item[key2].startsWith(str.toLowerCase()) || item.value.startsWith(str)) {
          return item
        }
      }) : res.res
      cb(results)
      if (cb2) {
        cb2(JSON.parse(JSON.stringify(results)), results.length >= 1 && str)
      }
    }
  })
}
const $reqPrint = (url, data, options) => {
  return new Promise((resolve, reject) => {
    const obj = {
      method: 'post',
      url: url
    }
    if (options) {
      const keyArr = Object.keys(options)
      keyArr.forEach(item => {
        obj[item] = options[item]
      })
    }
    obj.method === 'post' ? obj.data = qs.stringify(data) : obj.params = data
    instance4(obj).then(res => {
      resolve(res.data)
      if (res.data.status === 1) {
        options.that.$message({
          message: res.data.msg,
          type: 'success'
        })
      } else {
        options.that.$message.error('打印调用失败！')
      }
    }).catch((e) => {
      reject(e)
      loadingInstance2.close()
      options.that.$message.error('打印中转器监听端口失败！')
    })
  })
}
const $postPrint = ({ type, data, method, that }) => {
  return new Promise((resolve, reject) => {
    $req(
      `/print/${type}`,
      { ...data, type, method },
      { method: 'get' }
    ).then(res => {
      let postURL = that.$store.state.printPostUrl
      if (localStorage.getItem('IP')) {
        postURL = localStorage.getItem('IP')
      }
      if (res.status === 1) {
        $reqPrint(postURL + ':5001', {
          httpStr: res.url
        }, { that }).then(res => {
          resolve(res)
        }).catch((e) => {
          reject(e)
        })
      } else {
        reject(res)
        that.$message.error('打印调用失败！')
      }
    }).catch((e) => {
      reject(e)
    })
  })
}
export default {
  install(Vue) {
    Vue.prototype.$baseURL = baseURL
    // Vue.prototype.$baseURL2 = baseURL2
    Vue.prototype.$axios = axios
    Vue.prototype.$qs = qs
    Vue.prototype.$req = $req
    Vue.prototype.$req2 = $req2
    Vue.prototype.$reqFile = $reqFile
    Vue.prototype.$querySearchAsync = $querySearchAsync
    Vue.prototype.$querySearchAsync2 = $querySearchAsync2
    Vue.prototype.$remoteMethod = $remoteMethod
    Vue.prototype.$postPrint = $postPrint
  },
  $req,
  $req2,
  $reqFile,
  $querySearchAsync
}
