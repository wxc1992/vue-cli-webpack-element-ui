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
        :default-active="$route.path.slice(1)"
        router
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#545c64"
        unique-opened
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-submenu :index="l1.path" v-for="l1 in menuList" :key="l1.id">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>{{l1.authName}}</span>
          </template>
          <el-menu-item :index="l2.path" v-for="l2 in l1.children" :key="l2.id">
            <i class="el-icon-menu"></i>
            <span>{{l2.authName}}</span>
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
      username: localStorage.getItem('username'),
      menuList: []
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
    },
    async getMenu () {
      const res = await this.axios.get('menus')
      // console.log(res)
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.menuList = data
      }
    }
  },
  created () {
    this.getMenu()
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
