import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/set-quantity',
    name: 'SetQuantity',
    component: () => import('@/views/SetQuantity.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/preview-quantity',
    name: 'PreviewQuantity',
    component: () => import('@/views/PreviewQuantity.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/set-img',
    name: 'SetImg',
    component: () => import('@/views/SetImg.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/fast-set-img',
    name: 'FastSetImg',
    component: () => import('@/views/FastSetImg.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/group-img',
    name: 'GroupImg',
    component: () => import('@/views/GroupImg.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/price',
    name: 'Price',
    component: () => import('@/views/Price.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/set-logistics',
    name: 'SetLogistics',
    component: () => import('@/views/SetLogistics.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/aidc',
    name: 'Aidc',
    component: () => import('@/views/Aidc.vue'),
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫 - 检查登录状态
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)

  if (requiresAuth && !token) {
    // 需要登录但未登录，跳转到登录页
    next('/login')
  } else if (to.path === '/login' && token) {
    // 已登录但访问登录页，跳转到首页
    next('/')
  } else {
    next()
  }
})

export default router
