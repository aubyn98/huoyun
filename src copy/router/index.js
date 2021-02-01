import Vue from 'vue'
import VueRouter from 'vue-router'
import Work from '@/views/work.vue'
import Login from '@/views/login.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/work',
    name: 'Work',
    component: Work,
    meta: { isLogin: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  const needLogin = to.matched.some(item => item.meta.isLogin)
  const isLogin = JSON.parse(sessionStorage.getItem('account')) && JSON.parse(sessionStorage.getItem('account')).isLogin
  if (needLogin && !isLogin) {
    next({ name: 'Login' })
    return
  }
  if (to.path === '/login' && isLogin) {
    next({ name: 'Work' })
    return
  }
  next()
})
export default router
