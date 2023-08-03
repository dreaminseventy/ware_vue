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
                  <el-form-item label="密码" prop="account">
                      <el-input type="text" v-model="loginForm.password"
                                autocomplete="off" size="small" show-password
                                @keyup.enter.native="login"
                      ></el-input>
                  </el-form-item>
                  <el-form-item label="账号" prop="account">
                      <el-button type="primary" @click="login"
                                 :disabled="login_disabled">确定</el-button>
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
                if(valid){
                    this.$axios.post(this.$http+"/user/login",this.loginForm).then(res=>res.data).then(res=>{
                        //console.log((res))
                        if (res.code===200){
                            //存储
                            sessionStorage.setItem('CurUser',JSON.stringify(res.data))
                            this.$router.replace('/WareIndex')
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
                                type: 'danger'
                            });
                            return false;
                        }
                    });
                }else {
                    this.login_disabled=false;
                    this.$message({
                        showClose: true,
                        message: '登录失败，请重试(っ °Д °;)っ',
                        type: 'danger'
                    });
                    return false;
                }
            });
        }
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