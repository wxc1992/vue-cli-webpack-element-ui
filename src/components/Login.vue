<template>
<div class="login_wrap">
  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="ruleForm">
    <el-row>
      <el-col :span="24"><div class="grid-content bg-purple-dark">商品管理系统</div></el-col>
    </el-row>
    <el-form-item label="用户名" prop="username">
      <el-input type="text" v-model="ruleForm.username" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="ruleForm.password" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitFn('ruleForm')">提交</el-button>
      <el-button @click="resetFn">重置</el-button>
    </el-form-item>
    </el-form>
  </div>
  </template>
<script>
export default {
  data () {
    return {
      ruleForm: {
        password: '',
        username: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'change' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    submitFn (ruleForm) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          this.axios.post('login', this.ruleForm).then(res => {
            console.log(res)
            if (res.data.meta.status === 200) {
              this.$message.success('恭喜你登陆成功')
              localStorage.setItem('token', res.data.data.token)
              localStorage.setItem('username', res.data.data.username)
              this.$router.push('home')
            } else {
              this.$message.error(res.data.meta.msg)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetFn () {
      this.$refs['ruleForm'].resetFields()
    }
  }
}
</script>
<style lang="less">
  .login_wrap{
    width: 100%;
    height:100%;
    background:#0882B4;
    overflow: hidden;
  }
  .el-form{
    margin:200px auto;
    background:#fff;
    width: 500px;
    height:300px;
    border-radius: 20px;
    padding:30px 50px 100px 50px;
    box-sizing: border-box;
    .el-button + .el-button{
        margin-left:100px;
    }
  }
   .grid-content{
        text-align: center;
        line-height: 50px;
      }
</style>
