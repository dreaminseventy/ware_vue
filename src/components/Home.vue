<template>
    <div>
      <el-descriptions :title='"欢迎您！"+user.name' :column="2"  border>
        <el-descriptions-item>
            <template slot="label">
                <i class="el-icon-s-custom"></i>
                账号
            </template>
            {{user.account}}
        </el-descriptions-item>
        <el-descriptions-item>
            <template slot="label">
                <i class="el-icon-mobile-phone"></i>
                手机号
            </template>
            {{user.phone}}
        </el-descriptions-item>
        <el-descriptions-item>
            <template slot="label">
                <i class="el-icon-user"></i>
                性别
            </template>
            <el-tag
                    :type="user.sex===1?'success':user.sex===2?'primary':'info'"
                    disable-transitions><i :class="user.sex===1?'el-icon-male':user.sex===2?'el-icon-female':'el-icon-s-goods'"></i>
                    {{user.sex===1?'男':user.sex===2?'女':'沃尔玛购物袋'}}
            </el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
            <template slot="label">
                <i class="el-icon-place"></i>
                权限
            </template>
            <el-tag
                    :type="user.roleId===0?'success':user.roleId===1?'warning':'danger'"
                    disable-transitions>
                {{user.roleId===0?'用户':user.roleId===1?'管理员':'超级管理员'}}
            </el-tag>
        </el-descriptions-item>
    </el-descriptions>
        <div style="position: absolute" >
          <data-time></data-time>
        </div>
    </div>
</template>

<script>
import DataTime from "@/components/DataTime.vue";

export default {
    name: "Home",
    components: {DataTime},
    data(){
        return{
            user:{}
        }
    },
    methods:{
        init(){
            this.user = JSON.parse(sessionStorage.getItem('User'))
            //console.log("22222:"+this.user)
            this.$axios.get(this.$http+"/menu/list?roleId="+this.user.roleId).then(res=>res.data).then(res=>{
                sessionStorage.setItem('Menu',JSON.stringify(res.data))
                //console.log(res)
                this.$store.commit('setMenu',res.data)
            })
        }
    },
    beforeMount() {
        this.init()
    }
}
</script>

<style scoped>

</style>