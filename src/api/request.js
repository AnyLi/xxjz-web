import axios from 'axios'
import router from '@/router'

// 从环境变量读取配置
export const baseURL = process.env.VUE_APP_API_BASE_URL
export const staticURL = process.env.VUE_APP_STATIC_URL

const instance = axios.create({
  baseURL,
  timeout: 10000
})

// 请求拦截器 - 添加 Token
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理 401
instance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response && error.response.status === 401) {
      // Token 过期或无效，清除本地存储并跳转登录页
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export function get(url, params) {
  return new Promise((resolve, reject) => {
    instance
      .get(url, { params: params })
      .then(res => {
        if (res.data.code != 200) {
          return reject(res.data.msg)
        }
        resolve(res.data)
      })
      .catch(err => {
        reject(err.response?.data || err)
      })
  })
}

export function post(url, data) {
  return new Promise((resolve, reject) => {
    instance
      .post(url, data, {
        headers: {
          'content-type': 'application/json'
        }
      })
      .then(res => {
        if (res.data.code != 200) {
          return reject(res.data.msg)
        }
        resolve(res.data)
      })
      .catch(err => {
        reject(err.response?.data || err)
      })
  })
}

// 登录接口
export function login(phone, password) {
  return post('user/login', { phone, password })
}

// 登出
export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

// 获取当前用户信息
export function getUser() {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

// 检查是否已登录
export function isLoggedIn() {
  return !!localStorage.getItem('token')
}

export default instance
