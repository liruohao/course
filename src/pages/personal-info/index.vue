<!-- 个人信息 -->
<template>
  <div class="personal-info">
    <panel-header :tabs="tabsList" @activated="showComponent" :active="active"></panel-header>
    <panel-content>
      <components :is="active"></components>
    </panel-content>
  </div>
</template>

<script>
import PersonalData from './components/PersonalData'
import AddressData from './components/addressData'
import AccountSecurity from './components/AccountSecurity'
export default {
  name: 'personal-info',
  data () {
    return {
      active: 'PersonalData',
      tabsList: [{
        title: '个人资料',
        name: 'PersonalData'
      }, {
        title: '修改密码',
        name: 'AccountSecurity'
      },
      {
        title: '修改收货地址',
        name: 'AddressData'
      }]
    }
  },
  methods: {
    /**
     * @description: 切换组件side-bar-left
     * @author: xx
     * @date: 2018-08-30 14:00:36
     */
    showComponent (name) {
      this.active = name
    }
  },
  components: {
    PersonalData,
    AccountSecurity,
    AddressData
  },
  mounted () {
    console.log(sessionStorage.getItem('role'))
    if (sessionStorage.getItem('role') !== '2') {
      this.tabsList = [{
        title: '个人资料',
        name: 'PersonalData'
      }, {
        title: '修改密码',
        name: 'AccountSecurity'
      }]
    }
  }
}
</script>
<style lang="less" scoped>
  .personal-info{
    height: 100%;
  }
</style>
