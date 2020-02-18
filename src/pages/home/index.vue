<template>
    <div class="home">
      <com-header></com-header>
      <div class="main">
        <side-bar ></side-bar>
        <div class="sub-container">
          <router-view></router-view>
        </div>
      </div>
    </div>
</template>

<script>
import ComHeader from '../components/header'
import SideBar from '../components/sidebar'

export default {
  name: 'home',
  data () {
    return {
      isCollapse: false,
      sideClose: false
    }
  },
  methods: {
    sideFlag () {
      this.isCollapse = !this.isCollapse
    }
  },
  components: {
    ComHeader,
    SideBar
  },
  props: {},
  computed: {},
  watch: {},
  mounted () {
  }
}
</script>

<style lang="less">
    .home{
      width: 100%;
      height: 100%;
      background: #f4f4f4;
    }
</style>
