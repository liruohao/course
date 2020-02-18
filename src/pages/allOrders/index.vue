<template>
  <div class="allOrders">
    <Form :model="formItem" :label-width="100" inline>
      <FormItem label="订单名称：">
        <Input v-model="formItem.courseName" clearable/>
      </FormItem>
      <Button type="primary" @click="getPurchaseByPage">查询</Button>
    </Form>
    <Table border ref="currentRowTable" :columns="columns" :data="data"></Table>
    <!--<Page :total="total"-->
          <!--style="margin-top: 10px;  width: 100%;-->
      <!--height: 56px;-->
      <!--line-height: 56px;-->
      <!--padding: 0 15px;-->
      <!--box-sizing: border-box;"-->
          <!--show-elevator-->
          <!--show-sizer-->
          <!--show-total-->
          <!--:current="pageNo"-->
          <!--:page-size-opts="[10, 20, 30, 50]"-->
          <!--:page-size="pageSize"-->
          <!--@on-change="pageChange"-->
          <!--@on-page-size-change="pageSizeChange"/>-->

  </div>
</template>

<script>
export default {
  name: 'allOrders',
  data () {
    return {
      // 总数
      total: 0,
      // 当前页数
      pageNo: 1,
      // 单页数量
      pageSize: 10,
      formItem: {
        courseName: '',
        type: ''
      },
      columns: [
        {
          type: 'index',
          width: 80,
          title: '序号',
          align: 'center'
        },
        {
          title: '订单名称',
          key: 'courseName'
        },
        {
          title: '购买时间',
          key: 'time'
        },
        {
          title: '价格',
          key: 'money'
        },
        {
          title: '收货地址',
          key: 'purAddress'
        }
      ],
      data: []
    }
  },
  methods: {
    resetSearch () {},
    pageChange (page) {
      this.pageNo = page
    },
    pageSizeChange (pageSize) {
    },
    getPurchaseByPage () {
      this.$http.get('course-purchase/getPurchaseByPage', {
        courseName: this.formItem.courseName,
        page: this.pageNo,
        pageSize: this.pageSize
      }, res => {
        res.data.map((item) => {
          item.time = this.$dateFormat(new Date(item.createdTime), 'yyyy-MM-dd hh:mm:ss')
          item.money = ''
          this.$http.get('course-details/getCourseDetailsById', {
            id: item.detailsId
          }, res => {
            item.money = res.data.coursePrise
          })
        })
        this.data = res.data
      })
    }
  },
  components: {},
  props: {},
  computed: {},
  watch: {},
  mounted () {
    this.getPurchaseByPage()
  }
}
</script>

<style lang="less">
  .allOrders {
    background: #FFFFFF;
    padding: 12px;
  }
</style>
