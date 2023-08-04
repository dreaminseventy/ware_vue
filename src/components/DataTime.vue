<template>
    <!---
    <div>
      <span class="currentDate">
        <span slot="prefix" class="el-icon-timer"></span>
        {{dateFormat(date)}}
      </span>

    </div>-->
    <div>
        <h1>当前日期：{{ currentDate }}</h1>
        <h1>当前时间：{{ currentTime }}</h1>
    </div>

</template>

<script>

export default {
    name: "DataTime",
    data() {
        return {
            //date:new Date(),
            currentDate: '',
            currentTime: ''
        }
    },
    mounted(){
        //获取当前日期
        // let that= this;
        // this.timer = setInterval(function() {
        //     that.date = new Date().toLocaleString();
        // });
        // this.getTime();
        this.getCurrentDateTime();
        this.updateCurrentTime();
    },
    beforeDestroy: function() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
    methods:{
        updateCurrentTime() {
            setInterval(() => {
                const now = new Date();
                this.currentTime = now.toLocaleTimeString();
            }, 1000); // 每秒更新一次时间
        },
        getCurrentDateTime() {
            const now = new Date();
            this.currentDate = now.toLocaleDateString();
            this.currentTime = now.toLocaleTimeString();
        }
    }
}
</script>

<style scoped>
.currentDate{
    display: inline-block;
    vertical-align: text-bottom;
    width: 200px;
    height: 24px;
    line-height: 24px;
    color:#7D7D87;
    margin-left: 20px
}
</style>