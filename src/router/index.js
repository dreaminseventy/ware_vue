import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: ()=>import('../components/Login.vue')
  },
  {
    path: '/WareIndex',
    name: 'WareIndex',
    component: ()=>import('../components/WareIndex.vue')
  }
]

const router = new VueRouter({
  mode:'history',
  routes
})

export default router;
