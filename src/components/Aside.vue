<template>
    <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            default-active ="/home"
            style="height: 100%"
            :collapse="isCollapse"
            :collapse-transition = "false"
            router
    >
        <el-menu-item :index="'/'+item.menuClick" v-for="(item,i) in menu" :key="i" >
          <i :class="item.menuIcon"></i>
            <span slot="title">{{item.menuName}}</span>
        </el-menu-item>

    </el-menu>
</template>

<script>
export default {
    name: "wareAside",
    data(){
      return{
          menu:[
              {
                menuClick:'Home',
                menuName: '首页',
                menuIcon: 'el-icon-s-home',
              },
              {
                  menuClick:'Admin',
                  menuName:'管理员管理',
                  menuIcon:'el-icon-s-custom'
              },
              {
                  menuClick:'User',
                  menuName:'用户管理',
                  menuIcon:'el-icon-user-solid'
              }
          ]
      }
    },

    props:{
          isCollapse:Boolean
    }
}
</script>

<style scoped>
</style>