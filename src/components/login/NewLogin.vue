<template>
<div class="body-box">
    <div class="main-box">
        <div :class="['container', 'container-register', { 'is-txl': isLogin }]">
            <el-form :rules="rules1"
                     :model="registerForm"
                     ref="registerForm">
                <h2 class="title">Create Account</h2>
                <span class="text">Sign up using any number you think of</span>
                <el-form-item prop="account">
                <el-input  type="text" placeholder="Account" @keyup.enter.native="register" v-model="registerForm.account"/>
                </el-form-item>
                <el-form-item prop="name">
                <el-input type="text" placeholder="Name" @keyup.enter.native="register" v-model="registerForm.name"/>
                </el-form-item>
                <el-form-item prop="password">
                <el-input  type="password" placeholder="Password" @keyup.enter.native="register" v-model="registerForm.password"/>
                </el-form-item>
                <el-form-item prop="sex">
                <el-radio-group v-model="registerForm.sex" style="margin-top: 15px">
                        <el-radio label="1">男</el-radio>
                        <el-radio label="2">女</el-radio>
                        <el-radio label="3">沃尔玛购物袋</el-radio>
                </el-radio-group>
                </el-form-item>
                <div class="primary-btn" @click="register" >立即注册</div>
            </el-form>
        </div>
        <div
                :class="['container', 'container-login', { 'is-txl is-z200': isLogin }]"
        >
            <el-form
                :model="loginForm"
                ref="loginForm" :rules="rules">
                <h2 class="title">Sign in to System</h2>
                <span class="text">Use your account to log in</span>
                <el-form-item label="账号" prop="account">
                    <el-input type="text" v-model="loginForm.account"
                              @keyup.enter.native="login"
                    ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="text" v-model="loginForm.password" show-password
                              @keyup.enter.native="login"
                    ></el-input>
                </el-form-item>
                <div class="primary-btn" @click="login">立即登录</div>
            </el-form>
        </div>
        <div :class="['switch', { login: isLogin }]">
            <div class="switch__circle"></div>
            <div class="switch__circle switch__circle_top"></div>
            <div class="switch__container">
                <h2>{{ isLogin ? 'Hello Friend !' : 'Welcome Back !' }}</h2>
                <p>
                    {{
                    isLogin
                        ? 'Enter your personal details and start journey with us'
                        : 'To keep connected with us please login with your personal info'
                    }}
                </p>
                <div class="primary-btn" @click="isLogin = !isLogin">
                    {{ isLogin ? '立即注册' : '立即登录' }}
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'NewLogin',
    data() {
        //用于对账户是否以存在进行查询
        let checkDuplicate =(rule,value,callbacke)=>{
            if(this.registerForm.id){
                return callbacke
            }
            this.$axios.get(this.$http+'/user/findByAccount?account='+this.registerForm.account).then(res=>res.data).then(res=>{
                console.log(res)
                if (res.code!==200){
                    return callbacke
                }else {
                    return callbacke(new Error('账号已存在'))
                }
            })
        };
        return {
            isLogin: true,
            registerForm: {
                account: '',
                name: '',
                password: '',
                sex: '3',
                roleId:0,
            },
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
            },
            rules1: {
                account: [
                    {required: true, message: '请输入账号', trigger: 'blur'},
                    {min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'},
                    {validator:checkDuplicate,trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'}
                ],
                name: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    {min: 1, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'},
                ],
            }

        }
    },
    methods: {
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
        register(){
        //console.log(this.form)
        this.$axios.post(this.$http+"/user/save ", this.registerForm).then(res=>res.data).then(res=>{
            //console.log(res)
                if (res.code===200){
                    this.$message({
                    showClose: true,
                    message: '注册成功( •̀ ω •́ )y',
                    type: 'success'
                });
                }
                else {
                    this.$message({
                    showClose: true,
                    message: '注册失败，请重试(っ °Д °;)っ',
                    type: 'error'
                });
                }
            })
        },
    },
}
</script>

<style lang="scss" scoped>
//动态背景
.body-box{
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(-45deg, #ffecec, #fffeed, #e9fdf7, #fbe9ff, #ffecf5);
    background-size: 200%,200%;
    animation: gradient 5s ease infinite;
}
@keyframes gradient {
    0% {
        background-position: 0 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0 50%;
    }
}
.el-input ::v-deep .el-input__inner {
    width: 350px;
    height: 40px;
    margin: 4px 0;
    padding-left: 25px;
    font-size: 13px;
    letter-spacing: 0.15px;
    border: none;
    outline: none;
    // font-family: 'Montserrat', sans-serif;
    background-color: #ecf0f3;
    transition: 0.25s ease;
    border-radius: 8px;
    box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9;
    &::placeholder {
        color: #a0a5a8;
    }
}


.main-box {
  position: relative;
  width: 1100px;
  min-width: 1000px;
  min-height: 600px;
  height: 65%;
    margin-left: 250px;
    margin-top: 70px;
  //padding: 25px;
  background-color: #ecf0f3;
  box-shadow: 10px 10px 10px #d1d9e6, -10px -10px 10px #f9f9f9;
  border-radius: 12px;
  overflow: hidden;
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    width: 600px;
    height: 100%;
    padding: 25px;
    background-color: #ecf0f3;
    transition: all 1.25s;
    form {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100%;
      height: 100%;
      color: #a0a5a8;
      .title {
        font-size: 34px;
        font-weight: 700;
        line-height: 3;
        color: #181818;
      }
      .text {
        margin-top: 30px;
        margin-bottom: 12px;
      }
      .form__input {
        width: 350px;
        height: 40px;
        margin: 4px 0;
        padding-left: 25px;
        font-size: 13px;
        letter-spacing: 0.15px;
        border: none;
        outline: none;
        // font-family: 'Montserrat', sans-serif;
        background-color: #ecf0f3;
        transition: 0.25s ease;
        border-radius: 8px;
        box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9;
        &::placeholder {
          color: #a0a5a8;
        }
      }
    }
  }
  .container-register {
    z-index: 100;
    left: calc(100% - 600px);
  }
  .container-login {
    left: calc(100% - 600px);
    z-index: 0;
  }
  .is-txl {
    left: 0;
    transition: 1.25s;
    transform-origin: right;
  }
  .is-z200 {
    z-index: 200;
    transition: 1.25s;
  }
  .switch {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 430px;
    padding: 15px;
    z-index: 200;
    transition: 1.25s;
    background-color: #ecf0f3;
    overflow: hidden;
    box-shadow: 4px 4px 10px #d1d9e6, -4px -4px 10px #f9f9f9;
    color: #a0a5a8;
    .switch__circle {
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background-color: #ecf0f3;
      box-shadow: inset 8px 8px 12px #d1d9e6, inset -8px -8px 12px #f9f9f9;
      bottom: -60%;
      left: -60%;
      transition: 1.25s;
    }
    .switch__circle_top {
      top: -30%;
      left: 60%;
      width: 300px;
      height: 300px;
    }
    .switch__container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: absolute;
      width: 400px;
      padding: 50px 55px;
      transition: 1.25s;
      h2 {
        font-size: 34px;
        font-weight: 700;
        line-height: 3;
        color: #181818;
      }
      p {
        font-size: 14px;
        letter-spacing: 0.25px;
        text-align: center;
        line-height: 1.6;
      }
    }
  }
  .login {
    left: calc(100% - 460px);
    .switch__circle {
      left: 0;
    }
  }
  .primary-btn {
    width: 180px;
    height: 50px;
    border-radius: 25px;
    margin-top: 30px;
    text-align: center;
    line-height: 50px;
    font-size: 14px;
    letter-spacing: 2px;
    background-color: #4b70e2;
    color: #f9f9f9;
    cursor: pointer;
    box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;
    &:hover {
      box-shadow: 4px 4px 6px 0 rgb(255 255 255 / 50%),
      -4px -4px 6px 0 rgb(116 125 136 / 50%),
      inset -4px -4px 6px 0 rgb(255 255 255 / 20%),
      inset 4px 4px 6px 0 rgb(0 0 0 / 40%);
    }
  }
}
</style>

