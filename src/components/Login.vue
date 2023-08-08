<template>
  <div class="loginBody">
      <div class="loginDiv">
          <div class="login-content">
              <h1 class="login-title">用户登录</h1>
              <el-form :model="loginForm" label-width="100px"
                       :rules="rules" ref="loginForm">
                    <el-form-item label="账号" prop="account">
                        <el-input type="text" v-model="loginForm.account"
                                  autocomplete="off" size="small"
                                  @keyup.enter.native="login"
                        ></el-input>
                    </el-form-item>
                  <el-form-item label="密码" prop="password">
                      <el-input type="text" v-model="loginForm.password"
                                autocomplete="off" size="small" show-password
                                @keyup.enter.native="login"
                      ></el-input>
                  </el-form-item>
                  <el-form-item >
                      <el-button type="primary" @click="login"
                                 :disabled="login_disabled">登录</el-button>
                  </el-form-item>
              </el-form>
          </div>
      </div>
  </div>
</template>

<script>


export default {
    name: "Login",
    data(){
        return{
            login_disabled:false,
            loginForm:{
                account:'',
                password:''
            },
            rules:{
                account:[
                    {required:true,message:'请输入账号',trigger:'blur'}
                ],
                password:[
                    {required:true,message:'请输入密码',trigger:'blur'}
                ]
            }
        }
    },
    methods:{
        login(){
            this.login_disabled=true;
            this.$refs.loginForm.validate((valid)=>{
                if(valid){//valid成功为true
                    //去后台数据库验证用户名和密码
                    this.$axios.post(this.$http+"/user/login",this.loginForm).then(res=>res.data).then(res=>{
                        //console.log(res)
                        //验证是否启用
                        if (res.code===200){
                            if(res.data.isValid!=='Y')
                            {
                                this.login_disabled=false;
                                this.$message({
                                    showClose: true,
                                    message: '该用户已被禁用(っ °Д °;)っ',
                                    type: 'error'
                                });
                                return false;
                            }
                            //存储
                            sessionStorage.setItem('User',JSON.stringify(res.data))
                            //console.log("1111"+res.data)
                            this.user = res.data
                            //跳转到主页
                            this.$router.replace('/Home')
                            this.$message({
                                showClose: true,
                                message: '登录成功~( •̀ ω •́ )y',
                                type: 'success'
                            });
                        }
                        else {
                            this.login_disabled=false;
                            this.$message({
                                showClose: true,
                                message: '登录失败，用户名或密码错误，请重试(っ °Д °;)っ',
                                type: 'error'
                            });
                            return false;
                        }
                    });
                }else {
                    this.login_disabled=false;
                    return false;
                }
            });
        },
    }
    
}
</script>

<style scoped>
.loginBody{
    position:absolute;
    width: 100%;
    height: 100%;
    background-color: #42b983;
}
.loginDiv{
    position: absolute;
    top:50%;
    left: 50%;
    margin-top: -200px;
    margin-left: -200px;
    width: 450px;
    height: 330px;
    background: #fff;
    border-radius: 5%;
}
.login-title{
    margin: 20px 0;
    text-align: center;
}
.login-content{
    width: 400px;
    height: 250px;
    position: absolute;
    top:25px;
    left: 25px;
}
</style>