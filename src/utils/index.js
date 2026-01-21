/**
 * 格式化时间
 */
export const formatTime = (date, hasNoS) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  var time = [hour, minute]
  if (!hasNoS) {
    time.push(second)
  }
  return [year, month, day].map(formatNumber).join('-') + ' ' + time.map(formatNumber).join(':')
}

/**
 * 格式化日期
 */
export const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

/**
 * 格式化数字（补零）
 */
export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 获取指定天数后的日期
 */
export const GetDateStr = function (AddDayCount, date, hasTime) {
  var dd = date ? new Date(date.replace(/\.|-/g, '/')) : new Date()
  dd.setDate(dd.getDate() + AddDayCount)
  if (hasTime) {
    return formatTime(dd, true)
  } else {
    return formatDate(dd)
  }
}

/**
 * 深拷贝
 */
export const copy = function (obj) {
  var newobj = obj.constructor === Array ? [] : {}
  if (typeof obj !== 'object') {
    return
  }
  for (var i in obj) {
    newobj[i] = typeof obj[i] === 'object' ? copy(obj[i]) : obj[i]
  }
  return newobj
}

/**
 * 函数节流
 */
export const throttle = function (fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }
  let _lastTime = null
  return function () {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)
      _lastTime = _nowTime
    }
  }
}

/**
 * 下划线转驼峰
 */
export const toHump = function (name) {
  return name.replace(/_(\w)/g, function (all, letter) {
    return letter.toUpperCase()
  })
}

/**
 * 身份证号码验证
 */
export const isCardID = function (id) {
  var format =
    /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/
  if (!format.test(id)) {
    return '身份证号码不合规'
  }
  var year = id.substr(6, 4),
    month = id.substr(10, 2),
    date = id.substr(12, 2),
    time = Date.parse(month + '-' + date + '-' + year),
    now_time = Date.parse(new Date()),
    dates = new Date(year, month, 0).getDate()
  if (time > now_time || date > dates) {
    return '出生日期不合规'
  }
  var c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2)
  var b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2')
  var id_array = id.split('')
  var sum = 0
  for (var k = 0; k < 17; k++) {
    sum += parseInt(id_array[k]) * parseInt(c[k])
  }
  if (id_array[17].toUpperCase() != b[sum % 11].toUpperCase()) {
    return '身份证校验码不合规'
  }
  return true
}

/**
 * 生成 UUID
 */
export const getUuid = function uuid() {
  var s = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = '-'
  var uuid = s.join('')
  return uuid
}

/**
 * 获取 URL 参数
 */
export const getUrlParam = function (name) {
  const regex = new RegExp(`[?&]${name}=([^&#]*)`)
  const result = regex.exec(window.location.href)
  return result ? decodeURIComponent(result[1]) : null
}

// 初始化 sign
const sign = getUrlParam('sign')
if (sign) {
  sessionStorage.setItem('sign', sign)
}

export default {
  formatTime,
  formatDate,
  formatNumber,
  GetDateStr,
  copy,
  throttle,
  toHump,
  isCardID,
  getUuid,
  getUrlParam
}
