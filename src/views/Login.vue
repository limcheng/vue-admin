<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">舟山游客统计系统</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <el-button type="warning" class="reset" @click.native.prevent="handleReset2">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { requestLogin } from '../api/api';
  import axios from 'axios';
  //import NProgress from 'nprogress'
  export default {
    //inject: ['reload'],
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: sessionStorage.getItem("userName") || '',
          checkPass: sessionStorage.getItem("pwd") || ''
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
//       remember() {
//         if(this.checked){
//           sessionStorage.setItem('reusername', this.ruleForm2.account)
//           sessionStorage.setItem('repassword', this.ruleForm2.checkPass)
//           console.log(this.checked)
//         }else {
//           sessionStorage.setItem('reusername', '')
//           sessionStorage.setItem('repassword', '')
//         }
//       },
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            //NProgress.start();
            var loginParams = { username: this.ruleForm2.account, password: this.ruleForm2.checkPass };
            //console.info(requestLogin)
            //axios.post(`http://120.79.9.157:8080/workReport/Admin/login`, loginParams).then(data=>{console.log(data)})
            requestLogin(loginParams).then(res => {
              var that = this
              that.logining = false;
              let user = '';
              let { msg, code, data } = res;
              console.log(res)
              user = data
              if (code !== 200) {
                that.$message({
                  message: msg,
                  type: 'error'
                });
              } else {
                //console.log(data.role)
                sessionStorage.setItem('code', code);
                sessionStorage.setItem('user', JSON.stringify(user));
                sessionStorage.setItem('userName', loginParams.username);
                sessionStorage.setItem('pwd', loginParams.password);
                sessionStorage.setItem('areaId', data.area);
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('role', data.role);
                //this.$router.push({ path: '/Report' });
                that.$router.push({ path: '/Main' });
                console.log(data.token)
                axios.defaults.headers.post['Authorization'] = data.token;
                axios.defaults.headers.common['Authorization'] = data.token;
              }
            }).then(() => {
              this.$router.push({ path: '/Main' });
            });
          } else {
            console.log('error submit!!');
            return false;
          }
       });
      }
    },
    mounted() {
      //this.reload();
      sessionStorage.setItem("url","https://www.dingguangroup.com/test/workReport/Report/export")
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
    .reset {
      margin: 20px 0 0 0;
      width: 100%;
    }
  }
</style>