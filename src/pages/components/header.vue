<!-- 公共头 -->
<template>
  <header class="home-header">
    <div class="home-text"><Icon type="md-basket" style="margin-right: 5px"/>考研小助手</div>
    <!--<div class="home-nav">-->
      <!--<img src="../../assets/imgs/列表.png" alt="">-->
      <!--<Button shape="circle" icon="ios-search"></Button>-->
    <!--</div>-->
    <div class="header-right">
      <div class="user-info" @click="userInfoVisible = !userInfoVisible">
        <Dropdown
          trigger="custom"
          :visible="userInfoVisible"
          @on-click="userInfoOpen"
          @on-clickoutside="userInfoVisible = false"
        >
          <Badge count="0">
            <img :src="userAvator">
          </Badge>
          <div class="time-box-wrapper">
            <div class="time-box" ><span class="left-contents">欢迎您,{{user.uname}}<Icon type="ios-arrow-down"></Icon></span></div>
            <div class="time-box" >{{ currentTime }}</div>
          </div>
          <DropdownMenu slot="list">
            <DropdownItem name="personal">个人中心</DropdownItem>
            <DropdownItem name="logout">退出</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'home-header',
  data () {
    return {
      currentTime: '', // 当前时间
      username: '',
      userInfoVisible: false, // 用户信息下拉菜单
      user: JSON.parse(sessionStorage.getItem('user'))
    }
  },
  methods: {
    /**
       * @Description: 路由跳转
       */
    routeClick () {
      this.$store.commit('setTypeFlag', '/')
      this.$router.push({
        path: '/'
      })
    },
    /**
       * @description: 获取当前时间
       */
    getTime () {
      this.currentTime = this.$dateFormat(new Date(), 'yyyy-MM-dd')
    },

    /**
       * @description: 用户菜单栏点击
       */
    userInfoOpen (name) {
      switch (name) {
        case 'personal':
          this.$router.push({
            name: 'Personal'
          })
          break
        case 'logout':
          this.$Modal.confirm({
            title: '提示',
            content: '您确认要退出吗？',
            onOk: () => {
              this.$router.push('/')
              this.$Message.success('退出成功')
            },
            onCancel: () => {}
          })
          break
      }
    }
  },
  props: {
    isCollapsed: Boolean
  },
  computed: {
    // 用户头像
    userAvator () {
      return require('../../assets/imgs/avator_default.png')
    }
  },
  mounted () {
    this.getTime()
  }
}
</script>

<style lang="less">
  @import '~styles/style';
  @import '~styles/mixins';
  .home-header{
    width: 100%;
    height: 7.8%;
    color: #000;
    background: #FFFFFF;
    max-height: 80px;
    .un-select();
    .flex();
    .left-contents{
      .ellipsis()
    }
    align-items: center;
    font-size: 15px;
    font-weight: bold;
    position: relative;
    .home-text{
      padding-left: 15px;
      width: 200px;
      color: #000;
    }
    .logo{
      height: 86.6%;
      width: 200px;
      background: #DDE;
      // 此处更换为中汽研的LOGO时需要将此处的样式去掉
      /*background-size: 100%;*/
      cursor: pointer;
      &.GQ{
        background-size: 100%;
        width: 300px !important;
        height: 90% !important;
      }
    }
    .menu-icon{
      transition: all .3s linear;
      height: 100%;
      .flex();
      align-items: center;
      margin-right: 30px;
    }
    .home-nav{
      width: 150px;
      height: 100%;
      .flex();
      justify-content: center;
      align-items: center;
      img{
        width: 32px;
        height: 32px;
        margin-right: 15px;
        cursor: pointer;
      }
    }
    .header-right{
      height: 100%;
      position: absolute;
      top: 0;
      right: 10px;
      .flex();
      justify-content: flex-end;
      .search-box{
        .flex();
        width: 100px;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;
        &::before{
          content: '';
          display: none;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background: rgba(255,255,255,.15);
        }
        &:hover{
          &::before{
            display: block;
          }
        }
      }
      .time-box{
        /*height: 100%;*/
        width: 165px;
        .flex();
        align-items: center;
        justify-content: center;
      }
      .user-info{
        width: 220px;
        cursor: pointer;
        font-weight: normal;
        .flex();
        align-items: center;
        justify-content: center;
        position: relative;
        &::before{
          content: '';
          display: none;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background: rgba(255,255,255,.15);
        }
        &:hover{
          &::before{
            display: block;
          }
        }
        .ivu-badge{
          margin-right: 9px;
          .ivu-badge-count{
            top: -2px;
            z-index: inherit;
          }
          img{
            width: 40px;
            height: 40px;
            margin-right: 4.5%;
          }
        }
        .ivu-dropdown{
          .ivu-dropdown-rel{
            .flex();
          }
        }
      }
    }
  }
</style>
