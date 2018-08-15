<template>
  <div class="role">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" style="margin: 10px 0" @click="showAddrole">添加角色</el-button>
     <!-- 增加角色 -->
    <el-dialog :visible.sync="showAdd" title="增加角色">
      <el-form
        :model="AddruleForm"
        :rules="rules"
        label-width="80px"
        ref="AddruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="AddruleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="AddruleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click="addrole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色权限 -->
    <el-dialog :visible.sync="showright" title="角色权限分配">
      <el-tree
        :data="rightslist"
        show-checkbox
        default-expand-all
        node-key="id"
        highlight-current
        ref="tree"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showright= fasle">取 消</el-button>
        <el-button type="primary" @click="updateRights">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog :visible.sync="editrole" title="编辑角色">
      <el-form
        :model="editruleForm"
        :rules="rules"
        label-width="80px"
        ref="editruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editruleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editruleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editrole=false">取 消</el-button>
        <el-button type="primary" @click="editroleForm">确 定</el-button>
      </div>
    </el-dialog>
    <el-table
      :data="rolelist"
      style="width: 100%;border-top:1px solid #eee">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-row v-if="props.row.children.length === 0">
              <el-col :span="24">暂无权限</el-col>
            </el-row>
            <el-row v-else v-for="level1 in props.row.children" :key="level1.id" class="level1">
               <!-- 一级 -->
              <el-col :span="4">
                <el-tag
                  closable
                  @close="delRight(props.row,level1.id)">
                  {{ level1.authName }}
                </el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
               <!-- 二级 -->
              <el-col :span="20">
                <el-row v-for="level2 in level1.children" :key="level2.id" class="level2">
                  <el-col :span="4">
                    <el-tag
                      type="success"
                      closable
                      @close="delRight(props.row,level2.id)">
                      {{ level2.authName }}
                    </el-tag>
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="20">
                    <span v-for="level3 in level2.children" :key="level3.id" class="level3">
                      <el-tag
                        type="warning"
                        closable
                        @close="delRight(props.row,level3.id)">
                        {{ level3.authName }}
                      </el-tag>
                    </span>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="#"
        type="index">
      </el-table-column>
      <el-table-column
        label="角色名称"
        prop="roleName">
      </el-table-column>
      <el-table-column
        label="描述"
        prop="roleDesc">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size="mini" @click="showEditorForm(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="deleteroleForm(scope.row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" plain size="mini" @click="showRightsDialog(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rolelist: [],
      showAdd: false,
      showright: false,
      editrole: false,
      AddruleForm: {
        roleName: '',
        roleDesc: ''
      },
      editruleForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      defaultId: [], // 默认选中的状态
      roleId: '',
      rightslist: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      rules: {
        roleName: {required: true, message: '请输入角色名称', trigger: 'blur'}
      }
    }
  },
  created () {
    this.fetchRolesList()
  },
  methods: {
    async fetchRolesList () {
      const ret = await this.axios.get(`roles`)
      const { meta, data } = ret.data
      if (meta.status === 200) {
        this.rolelist = data
      }
    },
    showAddrole () {
      this.showAdd = true
    },
    cancelAdd () {
      this.showAdd = false
      this.$refs.AddruleForm.resetFields()
    },
    addrole () { // 增加角色
      this.$refs.AddruleForm.validate(async valid => {
        if (valid) {
          const res = await this.axios.post('roles', this.AddruleForm)
          console.log(res)
          const {meta} = res.data
          if (meta.status === 201) {
            this.showAdd = false
            this.$message.success('创建角色成功')
            this.fetchRolesList()
            this.$refs.AddruleForm.resetFields()
          }
        }
      })
    },
    async delRight (role, rightId) { // 删除角色的指定权限
      const res = await this.axios.delete(`roles/${role.id}/rights/${rightId}`)
      const {meta, data} = res.data
      if (meta.status === 200) {
        role.children = data
        this.$message.success('删除成功')
      } else {
        this.$message.error(meta.msg)
      }
    },
    async showRightsDialog (scope) { // 角色权限分配弹窗
      console.log(scope)
      this.roleId = scope.id
      this.showright = true
      const res = await this.axios.get(`rights/tree`)
      console.log(res)
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.rightslist = data
      }
      scope.children.forEach(level1 => {
        level1.children.forEach(level2 => {
          level2.children.forEach(level3 => {
            this.defaultId.push(level3.id)
          })
        })
      })
      this.$refs.tree.setCheckedKeys(this.defaultId) // 设置对应角色默认选中的权限
    },
    async updateRights () { // 更新权限
      console.log(this.roleId)
      const arr = this.$refs.tree.getCheckedKeys()
      const arr2 = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...arr, ...arr2].join()
      console.log(rids)
      const res = await this.axios.post(`roles/${this.roleId}/rights`, {rids: rids})
      const {meta} = res.data
      console.log(res)
      if (meta.status === 200) {
        this.showright = false
        this.fetchRolesList()
      }
    },
    showEditorForm (scope) { // 渲染用户角色
      this.editrole = true
      this.editruleForm.roleName = scope.roleName
      this.editruleForm.roleDesc = scope.roleDesc
      this.editroleForm.id = scope.id
    },
    editroleForm () {
      // 编辑角色
      this.$refs.editruleForm.validate(async valid => {
        if (valid) {
          const res = await this.axios.put(`roles/${this.editroleForm.id}`, this.editruleForm)
          const {meta} = res.data
          if (meta.status === 200) {
            this.editrole = false
            this.$message.success('修改角色成功')
            this.fetchRolesList()
          }
        }
      })
    },
    async deleteroleForm (id) { // 删除角色
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(`roles/${id}`)
        const {meta} = res.data
        if (meta.status === 200) {
          this.fetchRolesList()
          this.$message.success('删除角色成功')
        }
      } catch (e) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    }
  }
}
</script>
<style lang="less">
 .el-breadcrumb{
    background:#eee;
    padding: 10px;
  }
  .el-col{
    margin-bottom:10px;
  }
  .el-tag--warning{
    margin-left:10px;
    margin-top:5px;
  }
  .el-form{
    > .el-row{
      border-bottom:1px dotted #ccc;
      margin-bottom:5px;
    }
  }
  .el-dialog{
    width: 40%;
  }
</style>
