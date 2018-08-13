<template>
  <div class="role">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      :data="rolelist"
      style="width: 100%">
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
                  closable>
                  {{ level1.authName }}
                </el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
               <!-- 二级 -->
              <el-col :span="20">
                <el-tag
                  closable>
                  {{ level1.authName }}
                </el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <el-col :span="20">
              <el-row v-for="level2 in level1.children" :key="level2.id" class="level2">
                <el-col :span="4">
                  <el-tag
                    type="success"
                    closable>
                    {{ level2.authName }}
                  </el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>

                <!-- 三级 -->
                <el-col :span="20">
                  <span v-for="level3 in level2.children" :key="level3.id" class="level3">
                    <el-tag
                      type="warning"
                      closable>
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
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
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
      rolelist: []
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
    }
  }
}
</script>
<style lang="less">
 .el-breadcrumb{
    background:#eee;
    padding: 10px;
  }
</style>
