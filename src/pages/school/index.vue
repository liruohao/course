<template>
    <div class="school">
      <Form :model="formItem" :label-width="100" inline>
        <FormItem label="所属省份：">
          <Input v-model="formItem.city"/>
        </FormItem>
        <FormItem label="学校名称：">
          <Input v-model="formItem.schoolName"/>
        </FormItem>
        <FormItem label="院校属性：">
          <Select v-model="formItem.schoolProperty" clearable style="width: 150px">
            <Option value="985">985</Option>
            <Option value="211">211</Option>
            <Option value="一本院校">一本院校</Option>
            <Option value="二本院校">二本院校</Option>
          </Select>
        </FormItem>
        <FormItem label="院校类型：">
          <Select v-model="formItem.schoolType" clearable style="width: 150px">
            <Option value="综合类">综合类</Option>
            <Option value="理工类">理工类</Option>
            <Option value="艺术类">艺术类</Option>
            <Option value="体育类">体育类</Option>
            <Option value="财经类">财经类</Option>
            <Option value="政法类">政法类</Option>
            <Option value="语言类">语言类</Option>
            <Option value="医药类">医药类</Option>
            <Option value="农林类">农林类</Option>
            <Option value="军事类">军事类</Option>
            <Option value="民族类">民族类</Option>
            <Option value="师范类">师范类</Option>
          </Select>
        </FormItem>
        <Button type="primary" @click="getSchoolByPage">查询</Button>
        <Button type="primary" @click="resetSearch">重置</Button>
      </Form>
      <Table border ref="currentRowTable" :columns="columns3" :data="data1"></Table>
      <Page :total="total"
            style="margin-top: 10px;  width: 100%;
      height: 56px;
      line-height: 56px;
      padding: 0 15px;
      box-sizing: border-box;"
            show-elevator
            show-sizer
            show-total
            :current="pageNo"
            :page-size-opts="[10, 20, 30, 50]"
            :page-size="pageSize"
            @on-change="pageChange"
            @on-page-size-change="pageSizeChange"/>
    </div>
</template>

<script>
export default {
  name: 'school',
  data () {
    return {
      formItem: {
        city: '',
        schoolName: '',
        schoolProperty: '',
        schoolType: ''
      },
      // 总数
      total: 0,
      // 当前页数
      pageNo: 1,
      // 单页数量
      pageSize: 10,
      columns3: [
        {
          type: 'index',
          width: 80,
          title: '序号',
          align: 'center'
        },
        {
          title: '学校名称',
          key: 'schoolName'
        },
        {
          title: '院校属性',
          key: 'schoolProperty'
        },
        {
          title: '院校类型',
          key: 'schoolType'
        },
        {
          title: '所在城市',
          key: 'city'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 400,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.$router.push({
                      name: 'SchoolDetails',
                      query: {
                        type: params.row.remarks
                      }
                    })
                  }
                }
              }, '查看高校信息')
            ])
          }
        }

      ],
      data1: []
    }
  },
  methods: {
    // 重置
    resetSearch () {
      for (let i in this.formItem) {
        this.formItem[i] = ''
      }
    },
    pageChange (page) {
      this.pageNo = page
      this.getSchoolByPage()
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize
      this.getSchoolByPage()
    },
    getSchoolByPage () {
      this.$http.get('sys-school/getSchoolByPage', {
        city: this.formItem.city,
        schoolName: this.formItem.schoolName,
        schoolProperty: this.formItem.schoolProperty,
        schoolType: this.formItem.schoolType,
        page: this.pageNo,
        pageSize: this.pageSize
      }, res => {
        this.data1 = res.data.records
        this.total = res.data.total
      })
    }
  },
  components: {},
  props: {},
  computed: {},
  watch: {},
  mounted () {
    this.getSchoolByPage()
  }
}
</script>

<style lang="less">
    .school {
      background: #FFFFFF;
      padding: 12px;
      iframe{
        .top{
          display: none;
        }
      }
    }
</style>
