<template>
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
            currentDate: '',
            currentTime: ''
        }
    },
    mounted(){
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