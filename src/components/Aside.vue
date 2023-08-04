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
       <el-menu-item index="/Home">
           <i class="el-icon-s-home"></i>
           <span>首页</span>
       </el-menu-item>
        <el-menu-item index="/first">
            <i class="el-icon-check"></i>
            <span>导航一</span>
        </el-menu-item>
        <el-menu-item index="/second">
            <i class="el-icon-close"></i>
            <span>导航二</span>
        </el-menu-item>
    </el-menu>
</template>

<script>
export default {
    name: "wareAside",

    props:{
          isCollapse:Boolean
    }
}
</script>

<style scoped>
</style>