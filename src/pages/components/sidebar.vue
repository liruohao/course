<!--  左边栏 -->
<!-- type 为当前大模块的name-->
<template>
  <div id="side-bar">
    <div class="side-bar-left">
      <div class="content">
        <Menu theme="dark" accordion :active-name="$route.meta.name"  @on-select="handleOpenChange" :open-names="[$route.meta.parentName]" v-if="activeFlag">
          <MenuItem name="Curriculum" style="margin-left: -2px;padding-left: 12px" v-if="roleFlag === '1'">
            <img src="../../assets/imgs/家(1).png" alt="">
            <span class="menu-span">考研课程</span>
          </MenuItem>
          <MenuItem name="School" style="margin-left: -2px;padding-left: 12px"  v-if="roleFlag === '1'">
            <img src="../../assets/imgs/学校.png" alt="">
            <span class="menu-span">高校查询</span>
          </MenuItem>
          <Submenu name="2"  v-if="roleFlag === '1'">
            <template slot="title">
              <img src="../../assets/imgs/课程.png" alt="">
              <span class="menu-span">我的课程</span>
            </template>
            <MenuItem name="AllCourses" class="menu-border">全部课程</MenuItem>
            <MenuItem name="KeToday" class="menu-border">今日课程</MenuItem>
            <MenuItem name="AllOrders" class="menu-border">全部订单</MenuItem>
          </Submenu>
          <MenuItem name="DataDownload" style="margin-left: -2px;padding-left: 12px"  v-if="roleFlag === '1'">
            <img src="../../assets/imgs/下载.png" alt="">
            <span class="menu-span">资料下载</span>
          </MenuItem>
          <MenuItem name="User" style="margin-left: -2px;padding-left: 12px"  v-if="roleFlag === '2'">
            <img src="../../assets/imgs/用户.png" alt="">
            <span class="menu-span">用户管理</span>
          </MenuItem>
          <MenuItem name="OpenClass" style="margin-left: -2px;padding-left: 12px"  v-if="roleFlag === '2'">
            <img src="../../assets/imgs/课程.png" alt="">
            <span class="menu-span">课程管理</span>
          </MenuItem>
          <!--<MenuItem name="Timetable" style="margin-left: -2px;padding-left: 12px"  v-if="roleFlag === '2'">-->
            <!--<img src="../../assets/imgs/排课表.png" alt="">-->
            <!--<span class="menu-span">课表管理</span>-->
          <!--</MenuItem>-->
          <MenuItem name="TeacherHome" style="margin-left: -2px;padding-left: 12px"  v-if="roleFlag === '0'">
            <img src="../../assets/imgs/首页.png" alt="">
            <span class="menu-span">教学管理</span>
          </MenuItem>
          <Submenu name="1"  v-if="roleFlag === '2'">
            <template slot="title">
              <img src="../../assets/imgs/统计.png" alt="">
              <span class="menu-span">销售统计</span>
            </template>
            <MenuItem name="UserStatistics" class="menu-border">用户统计</MenuItem>
            <MenuItem name="SalesRecords" class="menu-border">销售统计</MenuItem>
          </Submenu>
          <MenuItem name="Personal" style="margin-left: -2px;padding-left: 12px">
            <img src="../../assets/imgs/个人中心.png" alt="">
            <span class="menu-span">个人中心</span>
          </MenuItem>
        </Menu>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'side-bar',
  data () {
    return {
      activeFlag: true,
      roleFlag: sessionStorage.getItem('role')
    }
  },
  methods: {
    // 展开子菜单时跳转到第一个子菜单
    handleOpenChange (name) {
      this.$router.push({
        name: name
      })
    },
    // 是否拥有该页面权限
    hasPermission (nav) {
      let has = false
      this.getMenuList.map((navItem) => {
        if (navItem.href && navItem.href === nav.path) {
          has = true
          return false
        }
      })
      return has
    }
  },
  components: {},
  props: {
    personalMenu: {
      type: Array
    }
  },
  computed: {
    activeName () {
      return this.$route.meta.parentName
    }
  },
  watch: {
    personalMenu: {
      deep: true,
      handler (newVal, oldVal) {
        this.activeFlag = false
        setTimeout(() => {
          this.activeFlag = true
        })
      }
    },
    activeName (val) {
      if (val === 'Personal') {
        this.activeFlag = false
        setTimeout(() => {
          this.activeFlag = true
        })
      }
    }
  },
  mounted () {
    console.log(sessionStorage.getItem('role'))
  }
}
</script>

<style lang="less">
  @import '~styles/mixins';
  @import '~styles/style';
  #side-bar{
    height: 100%;
    float: left;
    position: absolute;
    left:0;
    top: 0;
    .side-bar-left{
      width: 220px;
      height: 100%;
      background-color: rgba(255, 255, 255, 10%);
      float: left;
      overflow: hidden;
      border-radius: 5px;
      .content{
        border-radius: 4px;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
        }
        .ivu-menu{
          width: 215px !important;
          height: 100%;
          .un-select();
          &.ivu-menu-light{
            background: transparent;
          }
          &::after{
            display: none !important;
          }
          .ivu-menu-item{
            padding: 14px 12px;
            .flex();
            img{
              width: 20px;
              height: 20px;
              margin-right: 8px;
            }
            padding-left: 15px !important;
          }
          .ivu-menu-item-selected{
            &::after{
              display: none !important;
            }
          }
          .ivu-menu-item:not(.ivu-menu-item-active){
          }
        }
        .ivu-menu-submenu{
          .ivu-menu-submenu-title{
            padding: 14px 5px 14px 12px;
            white-space: nowrap;
            .flex();
            img{
              margin-right: 8px;
              width: 20px;
              height: 20px;
            }
          }
          .ivu-menu-item:not(.ivu-menu-item-active){
          }
        }
        .ivu-dropdown .ivu-select-dropdown {
          overflow: visible;
          max-height: none;
          max-width: initial;
        }
        .ivu-select-dropdown{
          z-index: 1001;
        }
        .ivu-menu-submenu-title-icon{
          display: none;
        }
        .ivu-menu-light{
          background:transparent;
        }
        .ivu-menu-vertical.ivu-menu-light:after{
          background: transparent;
        }
        .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
          background: transparent;
        }
      }
    }
  }
</style>
