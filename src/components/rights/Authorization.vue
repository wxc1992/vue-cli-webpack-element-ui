<template>
  <div class="author">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      :data="tableData"
      height="500"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="100">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="名称"
        width="300">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="300">
      </el-table-column>
      <el-table-column
        prop="level"
        label="层次">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-else-if="scope.row.level === '1'">二级</span>
          <span v-else>三级</span>
      </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      pageSize: 1,
      pageNum: 1,
      tableData: []
    }
  },
  methods: {
    async getAuthorlist () {
      const res = await this.axios.get(`rights/list`)
      const {data, meta} = res.data
      console.log(res)
      if (meta.status === 200) {
        this.tableData = data
      }
    }
  },
  created () {
    this.getAuthorlist()
  }
}
</script>
<style lang="less">
 .el-breadcrumb{
    background:#eee;
    padding: 10px;
  }
</style>
