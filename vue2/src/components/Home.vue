<template>
    
       
    
    <el-container class="home-container">
        <el-header>
            <div>
                
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="loginout">退出</el-button>
            </el-header>
    <el-container>
        <el-aside :width="isCollapse ? '64px' : '200px'">
            <div class="toggle-button" @click="toggle">|||</div>
            <el-menu background-color="#545c64" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router
            :default-active="activePath">
      <el-submenu :index="item.id +''" v-for="item in menulist " :key="item.id">
        <template slot="title">
          <i :class="iconsObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        
        
        <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id"
        @click="saveNavState('/'+subitem.path)">
            <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{subitem.authName}}</span>
        </template>
        </el-menu-item>
      </el-submenu>
      
    </el-menu>
        </el-aside>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
    </el-container>
</template>
<script>
export default {
    name:"home",
    data(){
        return{
            menulist:[],
            iconsObj:{
                '125':'iconfont icon-yonghuming',
                '103':'iconfont icon-weibiaoti--',
                '101':'iconfont icon-icon-test',
                '102':'iconfont icon-dianpu',
                '145':'iconfont icon-tongji',
            },
            isCollapse:false,
            activePath:''
        }
    },
    created(){
     this.getMenuList()
     this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods:{
        loginout(){
            this.$router.push("/login");
        },
     async   getMenuList(){
            const{ data: res} = await this.$http.get('menus')
            if(res.meta.status !==200) return this.$message.error(res.meta.msg)
            this.menulist = res.data
            console.log(res)
        },
         toggle(){
       this.isCollapse = !this.isCollapse
    },
    saveNavState(activePath){
         window.sessionStorage.setItem('avtivePath',activePath)
         this.activePath = activePath;
    }
    },
   
}
</script>
<style scoped>
.home-container{
    height: 100%;
}
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    
}
.el-aside{
    background-color: #333744;
  
}
.el-main{
    background-color: #eaedf1;
}
.iconfont{
    margin-right: 10px
}
.el-menu{
      border-right: none;
  }
.toggle-button{
     background-color: #4a5064;
     font-size: 10px;
     line-height: 24px;
     color: #fff;
     text-align: center;
     letter-spacing: 0.2em
  }
</style>