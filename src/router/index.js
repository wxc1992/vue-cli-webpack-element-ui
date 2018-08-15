import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import User from '@/components/user/Users'
import Role from '@/components/rights/Role'
import Authorization from '@/components/rights/Authorization'
import categories from '@/components/categories/categories'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/users',
          name: 'users',
          component: User
        },
        {
          path: '/roles',
          name: 'roles',
          component: Role
        },
        {
          path: '/rights',
          name: 'rights',
          component: Authorization
        },
        {
          path: '/categories',
          name: 'categories',
          component: categories
        }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})
export default router
