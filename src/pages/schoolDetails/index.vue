<template>
    <div class="schoolDetails">
      <div style="width: 100%;height: 200px;"></div>
      <iframe  id="processResultMsg"  :src="iframeSrc"  name="processResultMsg" style="width: 100%;height:115%;margin-top: -22%"></iframe>
    </div>
</template>

<script>
export default {
  name: 'schoolDetails',
  data () {
    return {
      iframeSrc: ''
    }
  },
  methods: {},
  components: {},
  props: {},
  computed: {},
  watch: {},
  mounted () {
    this.iframeSrc = `https://souky.eol.cn/HomePage/index_${this.$route.query.type}.html`
  }
}
</script>

<style lang="less">
    .schoolDetails {
      overflow: hidden !important;
    }
</style>
