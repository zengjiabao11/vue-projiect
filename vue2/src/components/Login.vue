<template>
  <div class="Login">
    <div class="login-box">
      <div class="avatar-box">
         <img src="../assets/logo.png">
         
      </div>
      <el-form ref="Loginformref" :model="Loginform" :rules="Loginformrules" label-width="0px" class="login_form">
         <el-form-item prop="username">
           <el-input prefix-icon="iconfont icon-yonghuming" v-model="Loginform.username"></el-input>
         </el-form-item>

            <el-form-item prop="password">
           <el-input prefix-icon="iconfont icon-mima" v-model="Loginform.password" type="password"></el-input>
         </el-form-item>

        <el-form-item class="btns">
           <el-button type="primary" @click="login">登陆</el-button>
           <el-button type="info" @click="resset">重置</el-button>
         </el-form-item>
         </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data(){
    return{
      Loginform:{
        username:'admin',
        password:'123456'
      },
      Loginformrules:{
        username:[ 
        {required:true,message:"请输入登录名称",trigger:"blur"},
        {min:3,max:10,message:"长度在 3 到 10个字符",trigger:"blur"}
        ],
        password:[
          {required:true,message:"请输入密码",trigger:"blur"},
          {min:6,max:10,message:"长度在 6 到 10个字符",trigger:"blur" }
        ]
      }
    }
    
  },
  methods:{
    resset(){
      this.$refs.Loginformref.resetFields();
    },
    login(){
       this.$refs.Loginformref.validate(async valid =>{
         if(!valid) return;
      const { data: res} =  await  this.$http.post("login",this.Loginform);
       if(res.meta.status !==200) return this.$message.error("登陆失败")
         this.$message.success("登陆成功");
        window.sessionStorage.setItem("token",res.data.token)  ;
        this.$router.push("/home")     })
    }
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Login{
    background-color: #2b4b6b;
    height: 100%;
}
.login-box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top:50%;
    transform: translate(-50%,-50%)
}
.avatar-box{
    height: 130px;
    width: 130px;
     border:1px solid #eee;
     border-radius: 50%;
     padding: 10px;
     box-shadow: 0 0 10px #ddd;
     position: absolute;
     left:50%;
     transform: translate(-50%,-50%);
     background-color: #fff;
}
img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
}
.btns{
  display: flex;
  justify-content: flex-end
}
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box
}
</style>
