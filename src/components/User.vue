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
       <el-button type="success" plain @click="showAddFrom">添加用户</el-button>
    </div>
      <!-- 增加用户 -->
    <el-dialog :visible.sync="showAdd">
      <el-form :model="AddruleForm" :rules="Addrules"  label-width="70px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="AddruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="AddruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="AddruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="AddruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
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
          inactive-color="#ff4949"
          @change="changeStatus(scope.row)">
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column
      label="状态">
      <template slot-scope="scope">
        <el-button size="small" plain type="primary" icon="el-icon-edit"></el-button>
        <el-button size="small" plain type="danger" icon="el-icon-delete" @click="deluser(scope.row.id)"></el-button>
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
export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      userList: [],
      total: 10,
      showAdd: false,
      AddruleForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      Addrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
        ],
        mobile: [
          { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的邮箱格式', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getList () {
      this.axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
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
    },
    changeStatus (row) {
      this.axios.put(`users/${row.id}/state/${row.mg_state}`)
        .then(res => {
          const { meta: {status} } = res.data
          if (status === 200) {
            this.$message.success('权限修改成功')
          } else {
            this.$message.error('权限修改失败')
          }
        })
    },
    deluser (id) {
      this.$confirm('您真的要删掉我么?', '愤怒的提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(`users/${id}`).then(res => {
          const {meta: {status}} = res.data
          if (status === 200) {
            if (this.userList.length === 1) {
              this.pagesize--
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showAddFrom () {
      this.showAdd = true
    },
    addUser () {

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
  .el-dialog{
    width: 40%;
  }
</style>
