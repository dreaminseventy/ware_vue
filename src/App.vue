<template>
  <div id="app">
   <router-view></router-view>
  </div>
</template>

<style>
#app{
    width: 100%;
    height: 100%;
    position: absolute;

}


</style>
<script>

export default {
    name: "APP",
    components: {},
    data(){
        return{
            user:JSON.parse(sessionStorage.getItem("User"))
        }
    },
    mounted() {
        // 刷新后跳转到首页面
        if(this.user&&this.user.account)
        this.$router.push("/Home");
        //刷新后回到顶部
        window.addEventListener("beforeunload", () => {
            window.scroll(0, 0);
        });
    },
    // beforeMount () {
    //     //在页面加载时读取sessionStorage里的状态信息
    //     if (sessionStorage.getItem("Menu") ) {
    //         this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("Menu"))))
    //     }
    //
    //     //在页面刷新时将vuex里的信息保存到sessionStorage里
    //     window.addEventListener("beforeunload",()=>{
    //         sessionStorage.setItem("Menu",JSON.stringify(this.$store.state))
    //     })
    // },
    // watch:{
    //     '$store.state.menu':{
    //         handler(val,old){
    //             console.log(111)
    //             if(!old && this.user&&this.user.account)
    //             this.$store.commit('setRoute',val)
    //         }
    //     },
    //     immediate:true
    // }
}

</script>