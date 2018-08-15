<template>
  <div class="categories">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 15px;">
      <el-button type="success" plain>添加分类</el-button>
    </div>
    <el-table
    :data="catelist"
    border
    style="width: 100%">
    <el-table-tree-column
        fixed
        prop="cat_name"
        label="分类名称"
        parent-key="cat_pid"
        child-key="children"
        tree-key="cat_id"
        level-key="cat_level"
        width="320"
        :indent-size="20">
        <template slot-scope="scope">
          <span>{{ scope.row.cat_name }}</span>
        </template>
    </el-table-tree-column>
    <el-table-column
      label="是否有效"
      width="180">
      <template slot-scope="scope">
        <span v-if="scope.row.cat_deleted">无效</span>
        <span v-else>有效</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="cat_level"
      label="排序">
    </el-table-column>
    <el-table-column
      prop="address"
      label="操作">
      <template slot-scope="scope">
        <el-button size="small" plain type="primary" icon="el-icon-edit" @click="editcate(scope.row)"></el-button>
        <el-button size="small" plain type="danger" icon="el-icon-delete"></el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pagenum"
    :page-size="10"
    layout="total, prev, pager, next"
    :total="total">
  </el-pagination>
</div>
</template>
<script>
export default {
  data () {
    return {
      catelist: [],
      pagesize: 5,
      pagenum: 1,
      total: 10,
      defaultProps: {
        children: 'children',
        label: 'cat_name'
      }
    }
  },
  methods: {
    async getcatelist () {
      const res = await this.axios.get('categories', {
        params: {
          pagesize: this.pagesize,
          pagenum: this.pagenum,
          type: 3
        }
      })
      console.log(res)
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.catelist = data
        this.total = data.length
      }
    },
    editcate (scope) {
      console.log(scope)
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getcatelist()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      console.log(this.pagenum)
      this.getcatelist()
    }
  },
  created () {
    this.getcatelist()
  }
}
</script>
<style lang="less">
.el-breadcrumb{
    background:#eee;
    padding: 10px;
  }
  .input-with-select{
    width: 300px;
    margin: 15px auto;
  }
  .el-table{
    margin-top:10px;
  }
  .el-dialog{
    width: 40%;
  }
</style>
