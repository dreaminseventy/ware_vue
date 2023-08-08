import vue from 'vue'
import Vuex from 'vuex'
import router , {resetRouter} from "../router";
vue.use(Vuex)
    //
function addNewRoute(menuList) {
    resetRouter();
    menuList.forEach(menu => {
        let childRoute = {
            path: '/' + menu.menuclick,
            name: menu.menuname,
            meta: {
                title: menu.menuname
            },
            component: () => import('@/components/' + menu.menucomponent)
        }
        router.addRoute('WareIndex', childRoute)
        //console.log("当前在路由中的路由"+JSON.stringify(router.options.routes))
    })

}
export default new Vuex.Store({
    state:{
        menu:[]
    },
    mutations:{
        setMenu(state,menuList){
            state.menu = menuList;
            addNewRoute(menuList)
        },
        setRoute(menuList){
            addNewRoute(menuList);
        }
    },
    getters:{
        getMenu(state){
            return state.menu
        }
    }
})
