<template>
    <div>
     <el-breadcrumb >
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>

</el-breadcrumb>
<el-card>
    <el-row>
        <el-col>
            <el-button type="primary">添加角色</el-button>
        </el-col>
    </el-row>

    <el-table :data="Roleslist" border stripe>
        <el-table-column type="expand">
            <template slot-scope="scope">
                
            <el-row :class="['bdbottom',i1 === 0 ? 'bdtop':'']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                <el-col :span="5">
                    <el-tag>{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19">
                    <el-row :class="['bdtop']" v-for="(item2,i2) in item1.children" :key="item2.id">
                        <el-col :span="6" >
                         <el-tag type="success">{{item2.authName}}</el-tag>
                          <i class="el-icon-caret-right"></i>
                        </el-col>
                        <el-col :span="18">
                      <el-tag v-for="(item3,i3) in item2.children" :key="item3.id" closable @close="remove(scope.row,item3.id)">
                        {{item3.authName}}
                      </el-tag>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
             
            </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
         <template slot-scope ="scope">
           <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
           <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
           <el-button size="mini" type="warning" icon="el-icon-setting" @click="show(scope.row)">分配</el-button>
         </template>
        </el-table-column>
    </el-table>
</el-card>
 <el-dialog
  title="修改权限"
  :visible.sync="showdialogVisible"
  width="50%" @close="setRightClosed"
  >
  <el-tree :data="rightlist" :props="treeprops" show-checkbox default-expand-all node-key="id"
  :default-checked-keys="defKeys" ref="treeRef"  ></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="showdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="aliotRights">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
         Roleslist:[],
         showdialogVisible: false,
         rightlist:[],
         treeprops:{
             label:'authName',
             children:'children'
         },
         defKeys:[],
         roleId:''
        }
    },
    created(){
         this.getRoleslist()
    },
    methods:{
     async   getRoleslist(){
      const {data: res} = await this.$http.get('roles')
      if(res.meta.status !==200){
          return this.$message.error('获取角色列表失败')
      }
      this.Roleslist = res.data
      
         },
    async   remove(role,rigthId){
   const confirmresult = await this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
        ).catch(err => err)
        if(confirmresult !== 'confirm'){
            return this.$message.info('取消了删除!')
        }
        const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rigthId}`)
        if(res.meta.status !==200){
            return this.$message.error('删除失败')
        }
        role.children = res.data
      },
    async  show(role){
        this.roleId = role.id
          const {data:res} = await this.$http.get('rights/tree')
          if(res.meta.status !==200){
              return this.$message.error('获取权限数据失败')
          }
        this.rightlist = res.data
        this.getLeafKeys(role,this.defKeys)
        this.showdialogVisible = true
      },
      getLeafKeys(node,arr){
        if(!node.children){
            return arr.push(node.id)
        }
        node.children.forEach(item => this.getLeafKeys(item,arr))
      },
      setRightClosed(){
          this.defKeys = []
      },
    async  aliotRights(){
          const keys = [
              ...this.$refs.treeRef.getCheckedKeys(),
              ...this.$refs.treeRef.getHalfCheckedKeys()
          ]
          const idStr = keys.join(',')
          const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
          if(res.meta.status !==200){
              return this.$message.error('分配权限失败')
          }
          this.$message.success('分配权限成功')
          this.getRoleslist()
          this.showdialogVisible = false
      }
    }
}
</script>

<style scoped>
.el-tag{
    margin: 7px;
}
.bdtop{
    border-top:1px solid #eee;
}
.bdbottom{
    border: 1px solid #eee;
}
</style>