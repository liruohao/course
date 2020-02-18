<template>
  <div class="panel-header">
    <ul class="tabs">
      <li v-for="(item, index) in tabs"
          :key="index"
          :class="{ 'active border-right': active === item.name}"
          @click="activated(item.name, item.title)">{{ item.title}}</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'panel-header',
  methods: {
    // 组件切换
    activated (name, title) {
      this.$emit('activated', name, title)
    }
  },
  props: {
    tabs: {
      type: Array,
      required: true
    },
    active: String
  },
  computed: {
    ...mapGetters(['getItemList'])
  }
}
</script>

<style lang="less" scoped>
  @import '~styles/style';
  .panel-header{
    height: 0.9rem;
    padding: 0.1rem 0 0 0.8rem;
    box-sizing: border-box;
    border-bottom: 1px solid #CCCDCE;
    background: #F0F0F0;
    .tabs{
      li{
        float: left;
        height: 0.8rem;
        line-height: 0.8rem;
        text-align: center;
        padding: 0 20px;
        cursor: pointer;
        user-select: none;
        &.active{
          background: #ffffff;
          border-top: 1px solid #CCCCCC;
          border-left: 1px solid #CFCFCF;
          box-sizing: border-box;
          color: #3391CE;
        }
        &::before{
          height: calc(~'100% + 1px');
          top: -1px;
        }
      }
    }
  }
</style>
