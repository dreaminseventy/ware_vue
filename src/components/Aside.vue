<template>
    <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            default-active ="/Home"
            style="height: 100%"
            :collapse="isCollapse"
            :collapse-transition = "false"
            router
    >
        <el-menu-item index="/Home">
            <i class="el-icon-s-home"></i>
            <span>首页</span>
        </el-menu-item>

        <el-menu-item :index="'/'+item.menuclick" v-for="(item,i) in menu" :key="i" >
          <i :class="item.menuicon"></i>
            <span slot="title">{{item.menuname}}</span>
        </el-menu-item>

    </el-menu>
</template>

<script>
export default {
    name: "wareAside",
    data(){
      return{
          // menu:[
          //     {
          //       menuClick:'Home',
          //       menuName: '首页',
          //       menuIcon: 'el-icon-s-home',
          //     },
          //     {
          //         menuClick:'Admin',
          //         menuName:'管理员管理',
          //         menuIcon:'el-icon-s-custom'
          //     },
          //     {
          //         menuClick:'User',
          //         menuName:'用户管理',
          //         menuIcon:'el-icon-user-solid'
          //     }
          // ]
      }
    },
    computed:{
        "menu":{
            get(){
                return this.$store.state.menu
            }
        }
    },
    created () {
        //在页面加载时读取sessionStorage里的状态信息
        if (sessionStorage.getItem("Menu") ) {
            this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("Menu"))))
        }

        //在页面刷新时将vuex里的信息保存到sessionStorage里
        window.addEventListener("beforeunload",()=>{
            sessionStorage.setItem("Menu",JSON.stringify(this.$store.state))
        })
    },

    props:{
          isCollapse:Boolean
    }
}
</script>

<style scoped>
</style>