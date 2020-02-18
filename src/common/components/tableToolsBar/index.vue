<!-- 表格工具栏 -->
<template>
  <div class="table-tools-bar">
  <transition enter-active-class="animated slideInDown" leave-active-class="animated slideOutUp" :duration="1000">
    <div class="advanced-search" v-if="isAdvancedSearch">
      <div class="advanced-search-content">
        <div class="close-btn" @click="close">&times;</div>
        <slot name="content"></slot>
      </div>
      <div class="advanced-search-footer">
        <Button type="primary" icon="ios-search" @click="advancedSearch"  style="margin-right: 5px">高级搜索</Button>
        <Button type="primary" icon="md-refresh" @click="reset">清空查询</Button>
      </div>
    </div>
  </transition>
    <div class="tools-bar-wrapper">
      <slot name="left"></slot>
      <slot name="right"></slot>
    </div>
    <Divider />
  </div>
</template>

<script>
export default {
  name: 'table-tools-bar',
  data () {
    return {
      isAdvancedSearch: this.value
    }
  },
  methods: {
    // 重置
    reset () {
      this.$emit('reset')
    },
    // 高级搜索
    advancedSearch () {
      this.$emit('search')
      this.$emit('input', false)
    },
    // 关闭
    close () {
      this.$emit('toggleSearch')
      this.$emit('input', false)
    }
  },
  props: {
  // 是否为高级搜索
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value (val) {
      this.isAdvancedSearch = val
    },
    '$route': {
      deep: true,
      handler (val) {
        if (val) {
          this.$emit('input', false)
        }
      }
    }
  }
}
</script>

<style lang="less">
  @import '~styles/mixins';
  @import '~styles/style';
  .table-tools-bar{
    .advanced-search{
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(255,255,255,.95);
      border-bottom: 1px solid #DDD;
      z-index: 100;
      .advanced-search-content{
        width: 100%;
        position: relative;
        padding: 30px 30px 15px 15px;
        .close-btn{
          line-height: 40px;
          font-size: 40px;
          text-align: center;
          position: absolute;
          top: 5px;
          right: 10px;
          z-index: 100;
          &:hover{
            color: #3391CE;
            cursor: pointer;
          }
        }
      }
      .advanced-search-footer{
        width: 100%;
        padding: 8px 20px;
        .flex();
        justify-content: flex-end;
      }
    }
    .tools-bar-wrapper{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.1rem;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      padding-top: 0.1rem;
      &>div{
        &>div{
          display: inline-block;
          margin-right: 0.2rem;
        }
      }
      .ivu-input-wrapper{
        width: auto;
        min-width: 150px;
        margin-right: 0.1rem;
      }
      .label-select-content{
        min-width: 150px;
        /*width: auto !important;*/
      }
      .label-input-content{
        min-width: 150px;
        /*width: auto !important;*/
      }
    }
    .ivu-form-item{
      margin-bottom: 0;
    }
  }
</style>
