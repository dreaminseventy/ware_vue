<template>
    <div style="display: flex;line-height: 60px">
        <div><i :class="headIcon" style="font-size: 20px;line-height: 60px" @click="collapse"></i></div>
        <div style="flex: 1;text-align: center;font-size: 25px"><span>欢迎来到仓库管理系统</span></div>
        <span style="padding-right: 30px;font-size: 12px">王小虎</span>
    <el-dropdown>
        <i class="el-icon-arrow-down" style="margin-right: 15px;font-size: 20px;line-height: 60px"></i>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="toUser">个人资料</el-dropdown-item>
            <el-dropdown-item @click.native="logOut">退出登录</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
    </div>
</template>

<script>
export default {
    name: "wareHeader",
    methods:{
        toUser(){
            console.log("to_user")
        },
        logOut(){
            console.log("log_out")
        },
        collapse(){
            this.$emit('doCollapse')
        }
    },
    props:{
        headIcon:String
    }

}
</script>

<style scoped>

</style>