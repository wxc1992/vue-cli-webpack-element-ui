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
      <el-form
        :model="AddruleForm"
        :rules="Addrules"
        label-width="70px"
        ref="AddruleForm">
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
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
      <!-- 编辑用户 -->
    <el-dialog :visible.sync="showedit">
      <el-form
        :model="editoruleForm"
        :rules="Addrules"
        label-width="70px"
        ref="editoruleForm">
        <el-form-item label="用户名">
          <el-tag type="info">{{editoruleForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editoruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editoruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="canceledit">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色分配 -->
    <el-dialog title="角色分配" :visible.sync="showrole">
      <el-form :model="roleForm">
        <el-form-item label="用户名">
          <el-tag type="info">{{roleForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表" label-width="70px">
          <el-select v-model="roleForm.roleId" placeholder="请选择角色列表">
            <el-option v-for="item in rolesList" :label="item.roleName" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showrole = false">取 消</el-button>
        <el-button type="primary" @click="asignRole">确 定</el-button>
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
        <el-button size="small" plain type="primary" icon="el-icon-edit" @click="editForm(scope.row)"></el-button>
        <el-button size="small" plain type="danger" icon="el-icon-delete" @click="deluser(scope.row.id)"></el-button>
        <el-button size="small" plain type="success" icon="el-icon-check" @click="rightsFn(scope.row)">角色分配</el-button>
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
      showedit: false,
      showrole: false,
      AddruleForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editoruleForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      roleForm: {
        roleId: -1,
        username: '',
        userId: -1
      },
      rolesList: [],
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
          { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的手机格式', trigger: 'blur' }
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
    cancelAdd () {
      this.showAdd = false
      this.$refs['AddruleForm'].resetFields()
    },
    addUser () {
      this.$refs.AddruleForm.validate(async valid => {
        if (valid) {
          const res = await this.axios.post('users', this.AddruleForm)
          const {meta: {status}} = res.data
          if (status === 201) {
            this.showAdd = false
            this.total++
            this.pagenum = Math.ceil(this.total / this.pagesize)
            this.getList()
          } else {
            this.$message.success(res.data.meta.msg)
          }
        } else {
          this.$message({
            type: 'info',
            message: '验证无效'
          })
          return false
        }
      })
    },
    editForm (scope) {
      console.log(scope.mobile)
      this.showedit = true
      this.editoruleForm.username = scope.username
      this.editoruleForm.email = scope.email
      this.editoruleForm.mobile = scope.mobile
      this.editoruleForm.id = scope.id
    },
    async editUser () {
      const {id, email, mobile} = this.editoruleForm
      const res = await this.axios.put(`/users/${id}`, {
        email,
        mobile
      })
      console.log(res)
      const {meta: {status}} = res.data
      if (status === 200) {
        this.showedit = false
        this.getList()
        this.$message.success('修改成功')
        this.$refs.editoruleForm.resetFields()
      } else {
        this.$message.error(res.data.meta.msg)
      }
    },
    canceledit () {
      this.showedit = false
      this.$refs.editoruleForm.resetFields()
    },
    async getrole () { // 获取所有的角色列表
      const res = await this.axios.get('roles')
      console.log(res)
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.rolesList = data
      }
    },
    async rightsFn (scope) { // 弹窗出现 根据用户的id获得用户对应的角色roleId
      console.log(scope)
      this.getrole() // 获取所有的角色列表
      this.showrole = true
      this.roleForm.username = scope.username
      this.roleForm.userId = scope.id
      const res = await this.axios.get(`users/${this.roleForm.userId}`)
      const {meta, data} = res.data
      if (meta.status === 200) {
        if (data.rid === -1) {
          this.roleForm.roleId = ''
        } else {
          this.roleForm.roleId = data.rid
        }
      }
    },
    async asignRole () {
      if (this.roleForm.roleId === '') {
        return
      }
      const res = await this.axios.put(`users/${this.roleForm.userId}/role`, {rid: this.roleForm.roleId})
      const {meta} = res.data
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.showrole = false
        this.getList()
      }
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
