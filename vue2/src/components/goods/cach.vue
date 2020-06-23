<template>
    <div>
       <el-breadcrumb >
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品列表</el-breadcrumb-item>

</el-breadcrumb>
<el-card>
    <el-row>
        <el-col>
            <el-button type="primary" @click="addshop">添加分类</el-button>
        </el-col>
    </el-row>
    <tree-table class="a" :data="cachlist" :columns="columns"
    :selection-type="false" :expand-type="false" show-index 
    index-text="#" border :show-row-hover="false">
          <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted ===false" style="color:red;"></i>
            <i class="el-icon-error" v-else style="color:red;"></i>
          </template>
          <template slot="order" slot-scope="scope">
            <el-tag v-if="scope.row.cat_level ===0">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level ===1" style="color:green">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
           <template slot="opt" slot-scope="scope">
             <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
             <el-button type="warning" icon="el-icon-search" size="mini">删除</el-button>
          </template>
    </tree-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
       
      :page-sizes="[1, 4, 7, 8]"
      :page-size="querInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
<el-dialog
  title="添加分类"
  :visible.sync="adddialogVisible"
  width="50%" @close="Closed"
   >
  <el-form :model="addruleForm" :rules="addFormrules" ref="addruleref" label-width="100px" class="demo-ruleForm">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addruleForm.cat_name"></el-input>
  </el-form-item>
   <el-form-item label="父级分类" >
    <el-cascader
    v-model="selectedKeys"
    :options="parentCateList"
    expand-trigger="hover"
    :props="cascaderProps"
    @change="parentCateChanged" clearable change-on-select></el-cascader>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="adddialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
         cachlist:[],
         querInfo:{
             type:3,
             pagenum:1,
             pagesize:5
         },
         total:0,
         columns:[{
             label:'分类名称',
             prop:'cat_name'
         },
        
          {
             label:'是否有效',
             type:'template',
             template:'isok'
         },
          {
             label:'排序',
             type:'template',
             template:'order'
         },
         {
             label:'操作',
             type:'template',
             template:'opt'
         }
         ],
         adddialogVisible:false,
         addruleForm:{
         cat_name:'',
         cat_pid:0,
         cat_level:0
         },
         addFormrules:{
          cat_name:[
              {required:true,message:'请输入分类名称',trigger:'blur'}
          ]
         },
        
         parentCateList:[],
          cascaderProps:{
              value:'cat_id',
              label:'cat_name',
              children:'children'
          },
          selectedKeys:[]
        }
    },
    created(){
     this.getcachlist()
    },
    methods:{
     async   getcachlist(){
       const {data:res} = await this.$http.get('categories',{
           params:this.querInfo
       })
       if(res.meta.status !==200){
           return this.$message.error('获取列表失败')
       }
       this.cachlist = res.data.result
       this.total = res.data.total
        },
        handleSizeChange(newsize){
          this.querInfo.pagesize = newsize
          this.getcachlist()
        },
        handleCurrentChange(newPage){
            this.querInfo.pagenum = newPage
            this.getcachlist()
        },
        addshop(){
            this.gettlist()
            this.adddialogVisible =true
        },
     async   gettlist(){
       const {data:res}=   await this.$http.get('categories',{
           params:{type:2}
       })
       if(res.meta.status !==200){
           return this.$message.error('获取父级分类数据失败')

       }
        this.parentCateList = res.data
        },
        parentCateChanged(){
          console.log(this.selectedKeys)
          if(this.selectedKeys.length >0){
              this.addruleForm.cat_pid =this.selectedKeys[this.selectedKeys.length - 1]
              this.addruleForm.cat_level = this.selectedKeys.length
              return
          }else{
              this.addruleForm.cat_pid = 0 
              this.addruleForm.cat_level = 0
          }
        },
        addCate(){
             this.$refs.addruleref.validate(async valid =>{
                 if(!valid) return
                 const {data:res} = await this.$http.post('categories',this.addruleForm)
                 if(res.meta.status !==201){
                      return this.$message.error('添加分类失败')
                 }
                 this.$message.success('添加分类成功')
                 this.getcachlist()
                 this.adddialogVisible = false
             })
        },
        Closed(){
            this.$refs.addruleref.resetFields()
            this.selectedKeys = []
            this.addruleForm.cat_level = 0
            this.addruleForm.cat_pid = 0
        }
    }
}
</script>
<style scoped>
.a{
    margin-top: 15px;
}
.el-cascader{
    width: 100%
}
</style>