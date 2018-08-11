<template>
  <div class="usertable">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="seacherFn"></el-button>
      </el-input>
       <el-button type="success" plain>添加用户</el-button>
    </div>
    <el-table
    :data="userList"
    stripe
    style="width: 100%">
    <el-table-column
      prop="username"
      label="姓名"
      width="200">
    </el-table-column>
    <el-table-column
      prop="email"
      label="邮箱"
      width="200">
    </el-table-column>
    <el-table-column
      prop="mobile"
      label="电话"
      width="200">
    </el-table-column>
    <el-table-column
      label="用户操作"
      width="200">
      <template slot-scope="scope">
        <el-switch
          v-model="scope.row.mg_state"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column
      label="状态">
      <template slot-scope="scope">
        <el-button size="small" plain type="primary" icon="el-icon-edit"></el-button>
        <el-button size="small" plain type="danger" icon="el-icon-delete"></el-button>
        <el-button size="small" plain type="success" icon="el-icon-check">角色分配</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pagenum"
    :page-sizes="[2, 4, 6, 8]"
    :page-size="2"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
  </el-pagination>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      userList: [],
      total: 10
    }
  },
  methods: {
    getList () {
      axios.get('http://localhost:8888/api/private/v1/users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        },
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      }).then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.userList = res.data.data.users
          this.total = res.data.data.total
        }
      })
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      console.log(this.pagenum)
      this.getList()
    },
    seacherFn () {
       this.getList()
    }
  },
  created () {
    this.getList()
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
</style>
