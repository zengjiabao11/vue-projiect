<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getgoodslist">
            <el-button slot="append" icon="el-icon-search" @click="getgoodslist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpush">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="150px">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 20, 25]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      goodlist: [],
      total: 0
    };
  },
  created() {
    this.getgoodslist();
  },
  methods: {
    async getgoodslist() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }
      this.$message.success("获取商品列表成功");
      this.goodlist = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newsize){
       this.queryInfo.pagesize = newsize
       this.getgoodslist()
    },
    handleCurrentChange(newpage){
      this.queryInfo.pagenum = newpage
      this.getgoodslist()
    },
   async remove(id){
    const confirmrsult   = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
        ).catch(err =>err)
        if(confirmrsult !== 'confirm'){
          return this.$message.info('已取消删除!')
        }      
        const {data:res} = await this.$http.delete(`goods/${id}`)
        if(res.meta.status !==200){
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getgoodslist()
    },
    goAddpush(){
      this.$router.push('/goods/add')
    }
    
  }
};
</script>
<style scoped>
</style>