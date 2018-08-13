<template>
<div class="home">
  <el-container>
  <el-header>
    <div class="logo">
      <img src="../assets/22.jpg" alt="">
      E得网
    </div>
    <div class="logout">欢迎登陆 {{username}}<a href="javascript:;" @click="logout">退出</a></div>
    <div class="title">商品管理系统</div>
  </el-header>
  <el-container>
    <el-aside width="200px">
      <el-menu
        default-active="user"
        router
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#545c64"
        unique-opened
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>用户管理</span>
          </template>
          <el-menu-item index="user">
            <i class="el-icon-menu"></i>
            <span>用户列表</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>权限管理</span>
          </template>
          <el-menu-item index="role">
            <i class="el-icon-menu"></i>
            <span>角色列表</span>
          </el-menu-item>
          <el-menu-item index="Authorization">
            <i class="el-icon-menu"></i>
            <span>权限列表</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-main>
        <transition name="slide">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</el-container>
</div>
</template>
<script>
export default {
  data () {
    return {
      username: localStorage.getItem('username')
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    logout () {
      this.$confirm('哈哈' + this.username + '，您确定退出么?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '退出成功!',
          duration: 1000
        })
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        this.$router.push('login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '退出取消',
          duration: 1000
        })
      })
    }
  }
}
</script>
<style lang="less">
  .home{
    height: 100%;
    > .el-container{
      height: 100%;
    }
    .el-header{
      height: 60px;
      background:#C5161D;
      line-height: 60px;
      .logo{
        float: left;
        height:60px;
        width: 200px;
        color:#fff;
        font-size: 18px;
        font-weight: bold;
        text-align: left;
        img{
          height: 100%;
          vertical-align: middle;
        }
      }
      .logout{
        float: right;
        font-weight: bold;
        font-size: 14px;
        color:#fff;
        a{
          margin-left: 10px;
          color:darkorange;
          text-decoration: none;
          outline-style: none;
        }
      }
      .title{
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        overflow: hidden;
        color: #fff
      }
    }
    .el-aside{
      background: #545c64;
      .el-submenu{
        width: 200px;
      }
    }
    .el-main{
      background: #fff;
    }
  }
</style>
