import axios from 'axios'

/**
 * 导入XX目录下所有文件默认数据
 * 1. store 下模块的default 默认导出的数据（对象）
 *  不需要 `import app from './modules/app'`
 *  自动导入所有 vuex modules下的文件模块
 *  set './app.js' => 'app'
 * 2. route 下模块的default 默认导出的数据（数组）
 *  不需要 `import a from './modules/a' import a from './modules/b'`
 *  自动导入所有路由modules下的文件模块
 *  再把a 和 b 合并成一个数组
 */
const fileNameRE = /(^.*\/)|(\.js$)/g
export const importAll = (modulesContext) => {
  const chunks = modulesContext.keys().reduce((chunks, key) => {
    return Object.assign(chunks, {
      [key.replace(fileNameRE, '')]: modulesContext(key).default
    })
  }, {})
  const result = Object.keys(chunks).reduce((modules, key) => {
    if (!Array.isArray(chunks[key])) {
      return chunks
    }
    modules.push(...chunks[key])
    return modules
  }, [])
  return result
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime (time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject (url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength (str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray (actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param (json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj (url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text (val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge (target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass (element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime (type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce (func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr (arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString () {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass (ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass (ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

/*
 *图片压缩 以及转base64
 */
export function ImgBase64 (file) {
  const type = file.type
  const reader = new FileReader()
  const img = new Image()
  const width = 1024 // image resize   压缩后的宽
  const quality = 0.8 // image quality  压缩质量
  const canvas = document.createElement('canvas')
  const drawer = canvas.getContext('2d')
  reader.readAsDataURL(file)
  reader.onload = () => {
    img.src = reader.result
  }
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const ratio = parseFloat(img.width / width)
      canvas.width = ratio > 1 ? width : img.width
      canvas.height = ratio > 1 ? width * (img.height / img.width) : img.width * (img.height / img.width)
      drawer.drawImage(img, 0, 0, canvas.width, canvas.height)
      let base64 = canvas.toDataURL(type, quality) // 这里就拿到了压缩后的base64图片
      base64 = base64 && base64.split('base64,')[1]
      resolve(base64)
    }
    img.onerror = () => {
      reject(new Error('请检查图片是否正常'))
    }
  })
}

/*
 * 动态创建a标签实现文件路经的下载
 * @src 文件下载路径
 * @filename {String} filename 想要保存的文件名称
 */
export function downLoad (src, filename) {
  const link = document.createElement('a')
  const body = document.querySelector('body')
  link.href = src
  link.download = filename || ''
  // fix Firefox
  link.style.display = 'none'
  body.appendChild(link)
  link.click()
  body.removeChild(link)
}

/**
 * 获取 blob
 * @param  {String} url 目标文件地址
 * @return {Promise}
 */
export function getBlob (url) {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    // xhr.setRequestHeader('Authorization', getToken())
    xhr.responseType = 'blob'
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response)
      }
    }
    xhr.send()
  })
}

/**
 * 保存
 * @param  {Blob} blob
 * @param  {String} filename 想要保存的文件名称
 */
export function saveAs (blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename)
  } else {
    const link = document.createElement('a')
    const body = document.querySelector('body')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename || ''
    // fix Firefox
    link.style.display = 'none'
    body.appendChild(link)
    link.click()
    body.removeChild(link)
    window.URL.revokeObjectURL(link.href)
  }
}

/**
 * 获取相邻元素
 * @param $el 参考物元素
 * @param type 类型，上一个(1)or下一个(0)
 * @return 返回查找到的元素Dom对象，无则返回null
 */
export function getNearEle ($el, type) {
  type = type === 1 ? 'previousSibling' : 'nextSibling'
  let nearEle = $el[type]
  while (nearEle) {
    if (nearEle.nodeType === 1) {
      return nearEle
    }
    nearEle = nearEle[type]
    if (!nearEle) {
      break
    }
  }
  return null
}

/**
 * 给节点加一个CSS类
 * @param $el dom节点
 * @param className
 */
export function addClass ($el, className = 'v-modal') {
  if ($el && ($el.className.trim() === '' || `${$el.className}`.indexOf(`${className}`) !== -1)) {
    $el.setAttribute('class', className)
  }
}

/**
 * 串联加载指定的脚本
 * 串联加载[异步]逐个加载，每个加载完成后加载下一个
 * 全部加载完成后执行回调
 * @param array|string 指定的脚本们
 * @param function 成功后回调的函数
 * @return array 所有生成的脚本元素对象数组
 */
export function seriesLoadScripts (scripts, callback) {
  if (typeof (scripts) !== 'object') scripts = [scripts]
  var HEAD = document.getElementsByTagName('head').item(0) || document.documentElement
  var s = new Array([])
  var last = scripts.length - 1
  var recursiveLoad = function (i) { // 递归
    s[i] = document.createElement('script')
    s[i].setAttribute('type', 'text/javascript')
    s[i].onload = s[i].onreadystatechange = function () { // Attach handlers for all browsers
      if (!0 || this.readyState === 'loaded' || this.readyState === 'complete') {
        this.onload = this.onreadystatechange = null
        this.parentNode.removeChild(this)
        if (i !== last) recursiveLoad(i + 1)
        else if (typeof (callback) === 'function') callback()
      }
    }
    s[i].setAttribute('src', scripts[i])
    HEAD.appendChild(s[i])
  }
  recursiveLoad(0)
}

// 获取json文件
export const getJson = function (url) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: url,
      dataType: 'json',
      crossDomain: true,
      cache: false
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

// 拷贝json文件
export const copeJsonData = function (data) {
  return data && JSON.parse(JSON.stringify(data))
}
