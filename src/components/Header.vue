<template>
    <div style="display: flex;line-height: 60px">
        <div><i :class="headIcon" style="font-size: 20px;line-height: 60px" @click="collapse"></i></div>
        <div style="flex: 1;text-align: center;font-size: 25px"><span>欢迎来到仓库管理系统</span></div>
        <span style="padding-right: 30px;font-size: 12px">{{user.name}}</span>
    <el-dropdown>
        <i class="el-icon-arrow-down" style="margin-right: 15px;font-size: 20px;line-height: 60px"></i>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="toUser">个人中心</el-dropdown-item>
            <el-dropdown-item @click.native="logOut">退出登录</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
    </div>
</template>

<script>
export default {
    name: "wareHeader",
    data(){
        return{
            user:JSON.parse(sessionStorage.getItem('User'))
        }
    },
    methods:{
        //跳转到个人页面
        toUser(){
            console.log("to_user")
            this.$router.push("/Home")
        },
        //退出登录
        logOut(){
            //console.log("log_out")
            this.$confirm('确定要退出登录吗o(TヘTo)',{
                confirmButtonText:'确定',
                type:'warning',
                center:true,//文字居中
                showCancelButton:true,//是否显示取消按钮
                showClose:true,//是否显示右上角的x
                closeOnClickModal:true//是否可以点击空白处关闭
            }).then(()=>{
                this.$message({
                    showClose: true,
                    message: '成功退出了( •̀ ω •́ )y',
                    type: 'success'
                });
                this.$router.push("/")
                sessionStorage.clear()
                }).catch(()=>{
                this.$message({
                    showClose: true,
                    message: '你已取消了退出o(>ω< )o',
                    type: 'info'
                });
                })

        },
        collapse(){
            this.$emit('doCollapse')
        }
    },
    props:{
        headIcon:String
    },
    created() {
        this.$router.push('/Home')
    }

}
</script>

<style scoped>

</style>