<template>
  <div class="teacherHome">
    <Form :model="formItem" :label-width="100" inline>
      <FormItem label="课程名称：">
        <Input v-model="formItem.cname" clearable/>
      </FormItem>
      <FormItem label="课程代码：">
        <Input v-model="formItem.courseCode"/>
      </FormItem>
      <Button type="primary" @click="getCourseDetailsByPage">查询</Button>
      <Button type="primary" @click="resetSearch">重置</Button>
    </Form>
    <Table :columns="courseColumns" :data="courseList" border ref="selection" @on-selection-change="handleRowChange" ></Table>
    <Drawer :title="courseTitle" :mask-closable="false" v-model="showCourseModal"  width="500"  :styles="styles" @on-close="closeDrawer">
      <div>
        <Form ref="courseVO"  :model="courseVO" :rules="courseVOFormRules" label-position="right" class="label-input-form">
          <Row>
            <Col span="24">
              <Row>
                <Col>
                  <FormItem label="课程名称" prop="cname">
                    <Input  v-model="courseVO.cname"  :disabled="coursesType === 3" placeholder="请输入课程名称"/>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem  label="任课老师" prop="teacher">
                    <Select v-model="courseVO.teacher" clearable  multiple  :disabled="coursesType === 3">
                      <Option v-for="item in teacherList" :value="item.id" :key="item.id">{{ item.uname }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="课程代码" prop="courseCode">
                    <Input  v-model="courseVO.courseCode"  :disabled="coursesType === 3" placeholder="请输入课程代码"/>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="授课时间" prop="classTime" class="laws-info-item">
                    <DatePicker type="daterange" v-model="courseVO.classTime"  placeholder="请选择授课时间" style="width: 100%"  :disabled="coursesType === 3" @on-change="classTimeChange"></DatePicker>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="听课须知" class="laws-info-item"  prop="tips">
                    <Input v-model="courseVO.tips" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="coursesType === 3 ? '' : '请输入听课须知'" :disabled="coursesType === 3"></Input>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="课程简介" class="laws-info-item"  prop="cdescript">
                    <Input v-model="courseVO.cdescript" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="coursesType === 3 ? '' : '请输入课程简介'" :disabled="coursesType === 3"></Input>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="课题介绍" class="laws-info-item" prop="remarks">
                    <Input v-model="courseVO.remarks" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="coursesType === 3 ? '' : '请输入课题介绍'" :disabled="coursesType === 3"></Input>
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="demo-drawer-footer" v-if="coursesType !== 3">
        <Button @click="closeDrawer">取消</Button>
        <Button type="primary" @click="saveCourseInfo('courseVO')">提交</Button>
      </div>
    </Drawer>
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
  name: 'teacherHome',
  data () {
    return {
      teacherList: [],
      courseModal: false,
      // 总数
      total: 0,
      // 当前页数
      pageNo: 1,
      // 单页数量
      pageSize: 10,
      formItem: {
        cname: '',
        teacher: '',
        isTop: '',
        courseCode: ''
      },
      courseVOFormRules: {
        teacher: [
          {required: true, type: 'array', message: '任课老师不能为空', trigger: 'change'}
        ],
        cname: [{required: true, message: '课程名称不能为空', trigger: 'blur'},
          {type: 'string', max: 20, message: '最多输入20位', trigger: 'blur'}],
        isTop: [
          {required: true, message: '置顶状态不能为空', trigger: 'change'}
        ],
        tips: [
          {required: true, message: '听课须知不能为空', trigger: 'change'}
        ],
        cdescript: [
          {required: true, message: '课程简介不能为空', trigger: 'change'}
        ],
        remarks: [
          {required: true, message: '课题介绍不能为空', trigger: 'change'}
        ],
        courseCode: [
          {required: true, message: '课程代码不能为空', trigger: 'blur'}
        ],
        time: [
          {required: true, type: 'array', message: '开售结束时间不能为空', trigger: 'change'}
        ],
        classTime: [
          {required: true, type: 'array', message: '授课时间不能为空', trigger: 'change'}
        ],
        coursePrise: [
          {required: true, type: 'number', message: '价格不能为空', trigger: 'change'}
        ]
      },
      courseTitle: '',
      showCourseModal: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      // 用户信息
      courseVO: {
        tips: '',
        cname: '',
        cdescript: '',
        isTop: '',
        teacher: '',
        courseCode: '',
        time: [],
        classTime: [],
        startTime: null,
        endTime: null,
        sellTime: null,
        endSellTime: null,
        coursePrise: '',
        remarks: ''
      },
      index: 1,
      coursesType: '',
      courseType: '',
      courseColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '课程名称',
          align: 'center',
          key: 'cname'
        },
        {
          title: '任课老师',
          align: 'center',
          key: 'teacherNames'
        },
        {
          title: '课程代码',
          align: 'center',
          key: 'courseCode'
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
                    this.showCourse(params.row)
                  }
                }
              }, '查看'),
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
                    this.timetableClick(params.row)
                  }
                }
              }, '课表管理')
            ])
          }
        }
      ],
      courseList: [],
      clickCourseList: []
    }
  },
  methods: {
    timeChange (val) {
      this.courseVO.sellTime = val[0]
      this.courseVO.endSellTime = val[1]
    },
    classTimeChange (val) {
      this.courseVO.startTime = val[0]
      this.courseVO.endTime = val[1]
    },
    // 课表管理
    timetableClick (row) {
      this.$router.push({
        name: 'NewTimetable',
        query: {
          id: row.id,
          cname: row.cname,
          teacherIds: row.teacherIds,
          teacherNames: row.teacherNames,
          row: JSON.stringify(row)
        }
      })
    },
    // 重置
    resetSearch () {
      for (let i in this.formItem) {
        this.formItem[i] = ''
      }
    },
    pageChange (page) {
      this.pageNo = page
      this.getCourseDetailsByPage()
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize
      this.getCourseDetailsByPage()
    },
    // 删除
    courseDel (id) {
      let ids = []
      ids.push(id)
      this.$http.postData('course-details/batchDelete', {ids: ids}, res => {
        if (res.code === 'M0000') {
          this.getCourseDetailsByPage()
          this.$Message.success('删除成功')
        }
      })
      this.$Message.success('删除成功')
    },
    // 编辑课程信息
    courseEdit (row) {
      this.coursesType = 2
      this.showCourseModal = true
      this.courseTitle = '编辑课程信息'
      this.courseVO = JSON.parse(JSON.stringify(row))
    },
    // 保存用户信息
    saveCourseInfo (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let obj = JSON.parse(JSON.stringify(this.courseVO))
          obj.teacherIds = obj.teacher.join(',')
          obj.isTop = Number(obj.isTop)
          obj.time = null
          obj.classTime = null
          // 更新
          if (this.coursesType === 2) {
            this.$http.put('course-details/updateCourseDetails', obj, res => {
              if (res.code === 'M0000') {
                this.getCourseDetailsByPage()
                this.$Message.success('修改成功！')
                this.closeDrawer()
              } else {
                this.$Message.warning(res.msg)
              }
            })
          } else {
            // 新增
            this.$http.post('course-details/addCourseDetails', obj, res => {
              if (res.code === 'M0000') {
                this.getCourseDetailsByPage()
                this.$Message.success('保存成功！')
                this.closeDrawer()
              } else {
                this.$Message.warning(res.msg)
              }
            })
          }
        } else {
          this.$Message.error('请正确填写表单')
        }
      })
    },
    // 查看用户信息
    showCourse (row) {
      this.coursesType = 3
      this.showCourseModal = true
      this.courseVO = JSON.parse(JSON.stringify(row))
      this.courseTitle = '查看课程信息'
    },
    // 表格复选框点击
    handleRowChange (selection) {
      this.clickCourseList = selection
    },
    // 关闭弹窗
    closeDrawer () {
      this.showCourseModal = false
      this.cleanCourseValue()
    },
    // 清除弹窗内容
    cleanCourseValue () {
      this.showCourseModal = false
      this.$nextTick(() => {
        if (this.$refs['courseVO'] !== undefined) {
          this.$refs['courseVO'].resetFields()
          for (let i in this.courseVO) {
            this.courseVO[i] = ''
          }
        }
      })
    },
    getUserTeacher () {
      this.$http.get('sys-user/getUserByPage', {
        page: 1,
        pageSize: 9999,
        userRole: '2'
      }, res => {
        this.teacherList = res.data.records
      })
    },
    getCourseDetailsByPage () {
      this.$http.get('course-details/getCourseDetailsByPage', {
        page: this.pageNo,
        pageSize: this.pageSize,
        cName: this.formItem.cname,
        teacherIds: JSON.parse(sessionStorage.getItem('user')).id,
        courseCode: this.formItem.courseCode,
        isTop: this.formItem.isTop === '' ? '' : Number(this.formItem.isTop)
      }, res => {
        res.data.records.map((item) => {
          item.time = []
          item.time.push(this.$dateFormat(new Date(item.sellTime), 'yyyy-MM-dd'))
          item.time.push(this.$dateFormat(new Date(item.endSellTime), 'yyyy-MM-dd'))
          item.classTime = []
          item.classTime.push(this.$dateFormat(new Date(item.startTime), 'yyyy-MM-dd'))
          item.classTime.push(this.$dateFormat(new Date(item.endTime), 'yyyy-MM-dd'))
          item.teacher = item.teacherIds.split(',')
          item.isTop = item.isTop.toString()
        })
        this.courseList = res.data.records
        this.total = res.data.total
      })
    }

  },
  components: {},
  props: {},
  computed: {},
  watch: {},
  mounted () {
    this.getUserTeacher()
    this.getCourseDetailsByPage()
  }
}
</script>

<style lang="less">
  .teacherHome {
    background: #FFFFFF;
    .label-input-form{
      .ivu-form-item{
        margin-right: 0;
        input{
          width: 100%;
          padding-right: 7px;
        }
      }
    }
  }
</style>
