import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 重定向根路径到打印页面
    {
      path: '/',
      redirect: '/print'
    },
    {
      path: '/print',
      name: 'print',
      component: () => import('../views/Print.vue')
    },
    {
      path: '/scan',
      name: 'scan',
      component: () => import('../views/Scan.vue')
    },
  ]
})

export default router
