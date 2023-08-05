import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// //解决报错
// const originalPush = VueRouter.prototype.push
// const originalReplace = VueRouter.prototype.replace
// // push
// VueRouter.prototype.push = function push (location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err)
// }
// // replace
// VueRouter.prototype.replace = function push (location, onResolve, onReject) {
//   if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
//   return originalReplace.call(this, location).catch(err => err)
// }

const constantRoutes = [
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
      }
    ]
  }
]
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}



const createRouter = ()=>new VueRouter({
  routes: constantRoutes
});

const router = createRouter();
export function  resetRouter(){
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;
