<template>
    <el-container style="height: 100%; border: 1px solid #eee">
        <el-aside :width="aside_width" style="height: 100%; margin-left: -1px">
            <WareAside :isCollapse="isCollapse"></WareAside>
        </el-aside>

        <el-container  style="height: 100%">
            <el-header style="text-align: right; font-size: 12px;border-bottom: #000000 1px solid">
                <WareHeader @doCollapse="doCollapse" :headIcon="headIcon"></WareHeader>
            </el-header>
            <el-main style="height: 100%">
            <!--<WareMain></WareMain>-->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import WareAside from "@/components/Aside.vue";
import WareHeader from "@/components/Header.vue";
//import WareMain from "@/components/Main.vue";

export default {
    name: "WareIndex",
    components: { WareHeader, WareAside},//WareMain,
    data(){
        return{
            isCollapse:false,
            aside_width:"13%",
            headIcon:"el-icon-s-fold"
        }
    },
    methods:{
        doCollapse(){
            this.isCollapse = !this.isCollapse
            if(!this.isCollapse){
                this.aside_width ="13%"
                this.headIcon = "el-icon-s-fold"
            }
            else {
                this.aside_width = "4.5%"
                this.headIcon = "el-icon-s-unfold"
            }
        }
    }
}
</script>

<style scoped>
.el-header {
    //background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
}

.el-aside {
    color: #333;
}


</style>