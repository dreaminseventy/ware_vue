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
    component: ()=>import('../components/WareIndex.vue'),
    children:[
      {
        path: '/Home',
        name: 'Home',
        meta:{
          title:'首页'
          },
        component: ()=>import('../components/Home.vue')
      },
      {
        path: '/User',
        name: 'User',
        meta:{
          title:'用户操作页面'
        },
        component: ()=>import('../components/user/UserManage.vue')
      },
      {
        path: '/Admin',
        name: 'Admin',
        meta:{
          title:'管理员管理页面'
        },
        component: ()=>import('@/components/admin/AdminManage.vue')
      }
    ]
  }
]
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

const router = new VueRouter({
  mode:'history',
  routes
})

export default router;
