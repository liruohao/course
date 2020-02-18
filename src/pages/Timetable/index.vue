<template>
  <div class="Timetable">
    <h4>课程名称：{{ $route.query.cname }}</h4>
    <Button type="primary" style="margin: 15px 0" @click="menuAdd">新增目录章节</Button>
    <Button type="error" title="批量删除" @click="batchMenuDel"  style="margin: 15px 0">批量删除</Button>
    <Table :columns="columns10" :data="data9" border ref="selection" @on-selection-change="handleRowChange" ></Table>
    <Drawer :title="tableTitle" :mask-closable="false" v-model="tableModal"  width="500"  :styles="styles" @on-close="closeDrawer">
      <Form :model="courseItemVO" :label-width="140" :rules="courseItemVORules" inline ref="courseItemVO" label-position="left">
        <Row>
          <Col span="24">
            <FormItem label="章节名称" prop="menuName">
              <Input  v-model="courseItemVO.menuName" :disabled="tableMenuFlag === '3'"  style="width: 300px"/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="开始时间(日期)" prop="date">
              <DatePicker v-model="courseItemVO.date"  :disabled="tableMenuFlag === '3'" type="date"  style="width: 300px"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="开始时间(时间)" prop="times">
              <TimePicker v-model="courseItemVO.times"  :disabled="tableMenuFlag === '3'" type="timerange"  placement="bottom-end" placeholder="Select time" style="width: 300px" @on-change="timeChange"></TimePicker>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem  label="任课老师" prop="teacherId">
              <Select v-model="courseItemVO.teacherId" :disabled="tableMenuFlag === '3'" style="width: 300px">
                  <Option v-for="item in teacherList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem  label="课题介绍" prop="menuDescrip">
              <Input type="textarea"  :disabled="tableMenuFlag === '3'"  v-model="courseItemVO.menuDescrip" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..." style="width: 300px"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="demo-drawer-footer" v-if=" tableMenuFlag !== '3'">
        <Button @click="closeDrawer">取消</Button>
        <Button type="primary" @click="saveMenuInfo('courseItemVO')">提交</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
export default {
  name: 'Timetable',
  data () {
    return {
      teacherList: [],
      courseItemVORules: {
        menuName: [
          {required: true, message: '章节名称不能为空', trigger: 'blur'}
        ],
        times: [
          {required: true, type: 'array', message: '开始时间(时间)不能为空', trigger: 'change'}
        ],
        date: [
          {required: true, type: 'date', message: '开始时间(日期)不能为空', trigger: 'blur'}
        ],
        teacherId: [
          {required: true, type: 'string', message: '任课老师不能为空', trigger: 'change'}
        ]
      },
      tableModal: false,
      tableTitle: '',
      itemList: [],
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      courseItemVO: {
        menuName: '',
        times: '',
        date: '',
        teacherId: '',
        menuDescrip: ''
      },
      tableMenuFlag: '',
      clickMenuList: [],
      columns10: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '目录章节名称',
          key: 'menuName'
        },
        {
          title: '开始结束时间',
          key: 'time'
        },
        {
          title: '目录章节简介',
          key: 'menuDescrip'
        },
        {
          title: '状态',
          key: 'menuState',
          align: 'center'
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
                      this.showMenu(params.row)
                    }
                  }
                },
                '查看'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'warning',
                    size: 'small',
                    disabled: params.row.menuState !== '未开始' && params.row.menuState !== ''
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.menuEdit(params.row)
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small',
                    disabled: params.row.menuState !== '未开始' && params.row.menuState !== ''
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '提示',
                        content: `您确认要删除 <span style="color: #E4393C">${params.row.menuName}</span> 吗？`,
                        onOk: () => {
                          this.menuDel(params.row.id)
                        }
                      })
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      data9: []
    }
  },
  methods: {
    // 查询
    getMenuByList () {
      this.$http.get('course-menu/getMenuByList', {
        courseId: this.$route.query.id
      }, res => {
        res.data.map((item) => {
          if (item.menuState === null || item.menuState === '') {
            item.menuState = '未开始'
          }
          item.time = item.startTime.substring(0, 10) + ' ' + item.startTime.substring(11, item.startTime.length) + ' - ' + item.endTime.substring(11, item.endTime.length)
        })
        this.data9 = res.data
      })
    },
    timeChange (val) {
      console.log(val)
    },
    // 提交
    saveMenuInfo (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let obj = {}
          obj.courseId = this.$route.query.id
          obj.menuDescrip = this.courseItemVO.menuDescrip
          obj.menuName = this.courseItemVO.menuName
          obj.startTime = this.$dateFormat(new Date(this.courseItemVO.date), 'yyyy-MM-dd') + ' ' + this.courseItemVO.times[0]
          obj.endTime = this.$dateFormat(new Date(this.courseItemVO.date), 'yyyy-MM-dd') + ' ' + this.courseItemVO.times[1]
          obj.teacherId = this.courseItemVO.teacherId
          // 新增

          if (this.tableMenuFlag === '1') {
            this.$http.post('course-menu/addCourseMenu', obj, res => {
              if (res.code === 'M0000') {
                this.getMenuByList()
                this.$Message.success('保存用户成功！')
                this.closeDrawer()
              } else {
                this.$Message.warning(res.msg)
              }
            })
          } else {
            obj.id = this.courseItemVO.id
            // 编辑
            this.$http.put('course-menu/updateCourseMenu', obj, res => {
              if (res.code === 'M0000') {
                this.getMenuByList()
                this.$Message.success('保存用户成功！')
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
    // 关闭弹窗
    closeDrawer () {
      this.tableModal = false
      this.cleanUserValue()
    },
    // 清除弹窗内容
    cleanUserValue () {
      this.tableModal = false
      this.$nextTick(() => {
        if (this.$refs['courseItemVO'] !== undefined) {
          this.$refs['courseItemVO'].resetFields()
          for (let i in this.courseItemVO) {
            this.courseItemVO[i] = ''
          }
        }
      })
    },
    // 新增目录
    menuAdd () {
      this.tableModal = true
      this.tableMenuFlag = '1'
      this.tableTitle = '新增目录章节信息'
    },
    // 查看
    showMenu (row) {
      this.tableModal = true
      this.tableMenuFlag = '3'
      this.tableTitle = '查看目录章节信息'
      row.date = row.startTime.substring(0, 10)
      this.courseItemVO = JSON.parse(JSON.stringify(row))
      this.courseItemVO.time = []
      this.courseItemVO.times = []
      this.courseItemVO.times = [this.courseItemVO.startTime.substring(11, this.courseItemVO.startTime.length), this.courseItemVO.endTime.substring(11, this.courseItemVO.endTime.length)]
    },
    // 编辑
    menuEdit (row) {
      this.tableModal = true
      this.tableMenuFlag = '2'
      this.tableTitle = '编辑目录章节信息'
      row.date = row.startTime.substring(0, 10)
      this.courseItemVO = JSON.parse(JSON.stringify(row))
      this.courseItemVO.times = []
      this.courseItemVO.times = [this.courseItemVO.startTime.substring(11, this.courseItemVO.startTime.length), this.courseItemVO.endTime.substring(11, this.courseItemVO.endTime.length)]
    },
    // 删除
    menuDel (id) {
      let ids = []
      ids.push(id)
      this.$http.postData('course-menu/batchDelete', {ids: ids}, res => {
        if (res.code === 'M0000') {
          this.getMenuByList()
          this.$Message.success('删除成功')
        }
      })
    },
    // 批量删除
    batchMenuDel () {
      if (this.clickMenuList.length > 0) {
        let userIds = []
        for (let i = 0; i < this.clickMenuList.length; i++) {
          if (this.clickMenuList[i].menuState !== '未开始' && this.clickMenuList[i].menuState !== '') {
            return this.$Message.warning('您选择课有开始或者结束的章节目录')
          }
          let userId = this.clickMenuList[i].id
          userIds.push(userId)
        }
        let userIdsStr = userIds.join(',')
        this.$Modal.confirm({
          title: '请选择',
          content: '确定删除这些数据?',
          onOk: () => {
            this.$http.postData('course-menu/batchDelete', {
              ids: userIdsStr
            }, res => {
              if (res.code === 'M0000') {
                this.getMenuByList()
                this.$Message.success('删除成功')
              }
            })
          }})
      } else {
        this.$Message.error('请选择一条数据进行删除')
      }
    },
    // 选择数据
    handleRowChange (selection) {
      this.clickMenuList = selection
    }
  },
  props: {},
  computed: {},
  watch: {},
  mounted () {
    let teacherIs = this.$route.query.teacherIds.split(',')
    let teacherNames = this.$route.query.teacherNames.split(',')
    teacherIs.map((item, teacherIndex) => {
      let obj = {}
      teacherNames.map((name, nameIndex) => {
        if (teacherIndex === nameIndex) {
          obj.id = item
          obj.name = name
          this.teacherList.push(obj)
        }
      })
    })
    this.getMenuByList()
  }
}
</script>

<style lang="less">
.Timetable {
  width: 100%;
  height: 100%;
  padding: 12px;
  background: #ffffff;
}
</style>
