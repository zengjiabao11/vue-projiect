import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/user/users.vue'
import Right from '../components/power/Right.vue'
import Roles from '../components/power/Roles.vue'
import cach from '../components/goods/cach.vue'
import params from '../components/goods/params.vue'
import list from '../components/goods/list.vue'
import add from '../components/goods/add.vue'
import order from '../components/orders/order.vue'
import reports from '../components/report/reports.vue'
Vue.use(VueRouter)

const routes = [
  {path:'/',redirect:'/login'},
  {
    path: '/login', 
    name: 'Login',
    component: Login
  },
  {path:'/home', component:Home, 
  redirect:'/welcome',children:[
    {path:'/welcome',component:welcome},
    {path:'/users',component:users},
    {path:'/rights',component:Right},
    {path:'/roles',component:Roles},
    {path:'/categories',component:cach},
    {path:'/params',component:params},
    {path:'/goods',component:list},
    {path:'/goods/add',component:add},
    {path:'/orders',component:order},
    {path:'/reports',component:reports}
 
  ]},
  
]

const router = new VueRouter({
  routes
})

export default router
