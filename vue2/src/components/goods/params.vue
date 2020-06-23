<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert show-icon title="注意! 只允许为第三级分类设置相关参数" type="warning" :closable="false"></el-alert>
      <el-row class="aa">
        <el-col>
          <span>选择商品的分类:</span>
          <el-cascader
            v-model="selectedcatekeys"
            :options="catelist"
            expand-trigger="hover"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activename" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="adddialogVisible = true"
          >添加参数</el-button>
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
                <template slot-scope="scope">
                      <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i">
                          {{item}}
                      </el-tag>
                </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="edit(scope.row.attr_id)"
                >编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="adddialogVisible = true"
          >添加属性</el-button>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="edit(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="remove(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="'添加' + titletext"
      :visible.sync="adddialogVisible"
      width="50%"
      @close="dialogclose"
    >
      <el-form
        :model="addruleForm"
        :rules="addFormrules"
        ref="addFormref"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="活动名称" prop="attr_name">
          <el-input v-model="addruleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="'编辑' + titletext"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="editdialogclose"
    >
      <el-form
        :model="editruleForm"
        :rules="editFormrules"
        ref="editFormref"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="活动名称" prop="attr_name">
          <el-input v-model="editruleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editformto">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
    data(){
      return{
          catelist:[],
          selectedcatekeys:[],
           cateProps:{
                value:'cat_id',
              label:'cat_name',
              children:'children'
           },
           activename:'many',
           manyTableData:[],
           onlyTableData:[],
           adddialogVisible:false,
           addruleForm:{
               attr_name:''
                   
               
           },
           addFormrules:{
               attr_name:[
                   
                       {required:true,message:'请输入参数名称',trigger:'blur'}
                   
               ]
           },
           editdialogVisible:false,
           editform:[],
           editruleForm:{
               attr_name:''
           },
           editFormrules:{
               attr_name:[
                   
                       {required:true,message:'请输入参数名称',trigger:'blur'}
                   
               ]
           }
      }
      
      
    },
 created(){
     this.getcatelist()
 },
 
 methods:{
  handleChange(){
     this.getparamsdata()
     },
     async getcatelist(){
  const {data:res} = await this.$http.get('categories')
  if(res.meta.status !==200){
      return this.$message.error('获取商品分类失败')
  }
  this.catelist = res.data
     },
     handleTabClick(){
 this.getparamsdata()
 },
 async getparamsdata(){
         
    if(this.selectedcatekeys.length !==3){
          this.selectedcatekeys = []
          return
      }
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
          params:{sel:this.activename}
      })
      if(res.meta.status !==200){
          return this.$message.error('获取失败')
      }
      res.data.forEach(item =>{
          item.attr_vals = item.attr_vals.split('')
      })
         if(this.activename ==='many'){
             this.manyTableData = res.data
         }else{
             this.onlyTableData = res.data
         }
     },
     dialogclose(){
         this.$refs.addFormref.resetFields()
     },
     editdialogclose(){
            this.$refs.editFormref.resetFields()
     },
     add(){
         this.$refs.addFormref.validate(async valid =>{
             if(!valid) return
             const{data:res} =await this.$http.post(`categories/${this.cateId}/attributes`,{
                 attr_name:this.addruleForm.attr_name,
                 attr_sel:this.activename
             })
             if(res.meta.status !==201){
                 return this.$message.error('添加参数失败!')
             }
             this.$message.success('添加参数成功')
             this.getparamsdata()
             this.adddialogVisible = false
         })
     },
    async edit(attr_id){
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
            params:{attr_sel:this.activename}
        })
        if(res.meta.status !==200){
            return this.$message.error('获取参数信息失败')
        }
        this.editform = res.data
       this.editdialogVisible =true
     },
     editformto(){
          this.$refs.editFormref.validate(async valid =>{
              if(!valid) return
          const{data:res} = await    this.$http.put(`categories/${this.cateId}/attributes/${this.editform.attr_id}`,{
                  attr_name:this.editform.attr_name,attr_sel:this.activename
              })
              if(res.meta.status !==200){
                  return this.$message.error('获取信息失败')
              }
              this.$message.success('修改参数成功')
              this.getparamsdata()
              this.editdialogVisible = false
          })
      },
      async  remove(attr_id){
          const confirmresult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
        ).catch(err =>err)
        if(confirmresult !=='confirm'){
            return this.$message.info('已取消删除!')
        }
        const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
        if(res.meta.status !==200){
            return this.$message.error('删除删除失败')
        }
        this.$message.success('删除参数成功')
        this.getparamsdata()
          }
     


 },
 
 computed:{
     isBtnDisabled(){
         if(this.selectedcatekeys.length !==3){
             return true
         }
         return false
     },
     cateId(){
         if(this.selectedcatekeys.length ===3 ){
             return this.selectedcatekeys[2]
         }
         return null
     },
     titletext(){
         if(this.activename === 'many'){
             return '动态参数'
         }
         return '静态属性'
     }
    
 },
 
      
}
</script>
<style scoped>
.aa {
  margin: 15px 0;
}
</style>