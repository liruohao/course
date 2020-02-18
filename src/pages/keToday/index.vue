<template>
  <div class="keToday">
    <!--<Form :model="formItem" :label-width="100" inline>-->
      <!--<FormItem label="订单名称：">-->
        <!--<Input v-model="formItem.courseName" clearable/>-->
      <!--</FormItem>-->
      <!--<Button type="primary" @click="getPurchaseByPage">查询</Button>-->
    <!--</Form>-->
    <Table border ref="currentRowTable" :columns="columns" :data="data"></Table>
    <Modal v-model="importModalshowflag" title="相关资料"  footer-hide :z-index="1000" width="80%" class="modal-bg">
      <Form ref="fileVO"  :model="fileVO" :rules="fileVOFormRules" label-position="right" class="label-input-form">
        <Row>
          <Col span="6">
            <FormItem label="文件名称">
              <Input  v-model="fileVO.fileName"  style="width: 200px" clearable  placeholder="请输入文件名称"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="">
              <Button type="primary" @click="getFileByPage" style="margin-bottom: 15px">查询</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Table :columns="courseColumns" :data="courseList" height="400" border ref="selection"></Table>
<!--      <Page :total="total"-->
<!--            style="margin-top: 10px;  width: 100%;-->
<!--      height: 56px;-->
<!--      line-height: 56px;-->
<!--      padding: 0 15px;-->
<!--      box-sizing: border-box;"-->
<!--            show-elevator-->
<!--            show-sizer-->
<!--            show-total-->
<!--            :current="pageNo"-->
<!--            :page-size-opts="[10, 20, 30, 50]"-->
<!--            :page-size="pageSize"-->
<!--            @on-change="pageChange"-->
<!--            @on-page-size-change="pageSizeChange"/>-->
    </Modal>
    <Modal v-model="exportModelFlag" footer-hide title="查看课堂作业" width="700">
      <p v-html="userVO.fileContent"></p>
    </Modal>

    <Modal v-model="assessFlag" title="填写评价" :z-index="1000" width="540">
      <Form ref="assess"  :model="assessVO" :rules="fileVOFormRules" label-position="right" class="label-input-form">
        <Row>
          <Col>
            <FormItem label="课程评分">
              <Rate show-text allow-half v-model="assessVO.valueCustomText">
                <span style="color: #f5a623">{{assessVO.valueCustomText }}分</span>
              </Rate>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="课程评语">
              <Input  v-model="assessVO.text" type="textarea" :autosize="{minRows: 2,maxRows: 5}"  clearable  placeholder="请输入课程评语"/>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="demo-drawer-footer">
        <Button @click="closeDrawer">取消</Button>
        <Button type="primary" @click="saveAssess()">提交</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
export default {
  name: 'keToday',
  data () {
    return {
      userVO: {
        fileContent: ''
      },
      courseId: '',
      assessVO: {
        valueCustomText: 5,
        text: ''
      },
      fileVOFormRules: {

      },
      assessFlag: false,
      fileVO: {
        fileContent: '',
        fileName: ''
      },
      courseColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '资料名称/课堂作业',
          align: 'center',
          key: 'fileName',
          render: (h, params) => {
            let text = ''
            if (params.row.fileName === null || params.row.fileName === '') {
              text = '课堂作业—' + params.row.fileContent
            } else {
              text = '资料—' + params.row.fileName
            }
            return h('div', {props: {}}, text)
          }
        },
        {
          title: '上传时间',
          align: 'center',
          key: 'updatedTime',
          render: (h, params) => {
            let typeShow = this.$dateFormat(new Date(params.row.updatedTime), 'yyyy-MM-dd hh:mm:ss')
            return h('div', {props: {}}, typeShow)
          }
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
                    if (params.row.fileName === '' || params.row.fileName === null) {
                      this.exportModelFlag = true
                      this.userVO.fileContent = params.row.fileContent
                      this.courseText = params.row
                    } else {
                      window.open('/course/course-file/downloadFile?fileId=' + params.row.id)
                    }
                  }
                }
              }, params.row.fileName === '' || params.row.fileName === null ? '查看' : '下载')

            ])
          }
        }
      ],
      exportModelFlag: false,
      courseText: '',
      courseList: [],
      menuId: '',
      fileName: '',
      importModalshowflag: false,
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
          title: '课程名称',
          align: 'center',
          key: 'name'
        },
        {
          title: '主讲老师',
          align: 'center',
          key: 'teacherName'
        },
        {
          title: '课程时间',
          align: 'center',
          width: '250',
          key: 'time'
        },
        {
          title: '状态',
          align: 'center',
          key: 'menuState'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 400,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.importModalshowflag = true
                      this.menuId = params.row.id
                      this.getFileByPage()
                    }
                  }
                },
                '下载相关资料'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: params.row.menuState !== '已结束'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.assessFlag = true
                      this.courseId = params.row.id
                    }
                  }
                },
                '填写课程评价'
              )
            ])
          }
        }
      ],
      data: []
    }
  },
  methods: {
    saveAssess () {
      this.$http.post('course-assess/addCourseAssess', {
        courseId: this.courseId,
        assessLevel: this.assessVO.valueCustomText.toString(),
        content: this.assessVO.text,
        userId: JSON.parse(sessionStorage.getItem('user')).id
      }, res => {
        if (res.code === 'M0000') {
          this.$Message.success('评价成功！')
          this.closeDrawer()
        } else {
          this.$Message.warning(res.msg)
        }
      })
    },
    closeDrawer () {
      this.assessVO.valueCustomText = 5
      this.assessVO.text = ''
      this.assessFlag = false
    },
    getFileByPage () {
      this.$http.get('course-file/getFileByPage', {
        page: this.pageNo,
        pageSize: this.pageSize,
        menuId: this.menuId,
        fileName: this.fileVO.fileName
      }, res => {
        this.courseList = res.data
        this.total = res.data.total
      })
    },
    resetSearch () {},
    pageChange (page) {
      this.pageNo = page
      this.getFileByPage()
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize
      this.getFileByPage()
    },
    getMenuByToday () {
      this.$http.get('course-menu/getMenuByToday', {
        userId: JSON.parse(sessionStorage.getItem('user')).id
      }, res => {
        res.data.map((item) => {
          if (item.menuState === null || item.menuState === '') {
            item.menuState = '未开始'
          }
          item.name = item.courseName + ' -' + item.menuName
          item.time = item.startTime.substring(0, 10) + ' ' + item.startTime.substring(11, item.startTime.length) + ' - ' + item.endTime.substring(11, item.endTime.length)
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
    this.getMenuByToday()
  }
}
</script>

<style lang="less">
  .keToday {
    background: #FFFFFF;
    padding: 12px;
  }
</style>
