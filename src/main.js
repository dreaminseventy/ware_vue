import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import VueRouter from "vue-router";
import './assets/global.css'
import axios from "axios";

Vue.prototype.$axios=axios;
Vue.prototype.$http="http://localhost:8090"
Vue.use(ElementUI,{size:'small'});
Vue.use(VueRouter)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
