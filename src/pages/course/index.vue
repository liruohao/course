<template>
  <div class="course">
    <Form :model="formItem" :label-width="100" inline>
      <FormItem label="班级名称：">
        <Input v-model="formItem.name" clearable/>
      </FormItem>
      <FormItem label="管理老师：">
        <Input v-model="formItem.teacher"/>
      </FormItem>
      <FormItem label="班级代码：">
        <Input v-model="formItem.courseNumber"/>
      </FormItem>
      <FormItem label="置顶状态：">
        <Select v-model="formItem.validFlag" clearable style="width: 150px">
          <Option value="0">置顶</Option>
          <Option value="1">非置顶</Option>
        </Select>
      </FormItem>
      <Button type="primary">查询</Button>
      <Button type="primary" @click="resetSearch">重置</Button>
    </Form>
    <div style="margin-bottom: 10px">
      <Button type="primary" title="新增" @click="openAddCourseModal">新增</Button>
      <Button type="error" title="批量删除" @click="batchCourseDel">批量删除</Button>
    </div>
    <Table :columns="courseColumns" :data="courseList" border ref="selection" @on-selection-change="handleRowChange" ></Table>
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
    <Drawer :title="courseTitle" :mask-closable="false" v-model="showCourseModal"  width="500"  :styles="styles" @on-close="closeDrawer">
      <div>
        <Form ref="courseVO"  :model="courseVO" :rules="courseVOFormRules" label-position="right" class="label-input-form">
          <Row>
            <Col span="24">
              <Row>
                <Col>
                  <FormItem label="班级名称" prop="name">
                    <Input  v-model="courseVO.name"  :disabled="coursesType === 3" placeholder="请输入课程名称"/>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem  label="管理老师" prop="teacher">
                    <Select v-model="courseVO.teacher" multiple  :disabled="coursesType === 3">
                      <Option value="0">王子龙</Option>
                      <Option value="1">谢利龙</Option>
                      <Option value="2">古桥时</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="班级代码" prop="courseNumber">
                    <Input  v-model="courseVO.courseNumber"  :disabled="coursesType === 3" placeholder="请输入课程代码"/>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="开售结束时间" prop="time" class="laws-info-item">
                    <DatePicker type="daterange" v-model="courseVO.time"  placeholder="开售时间为0时，结束时间为24时" style="width: 100%"></DatePicker>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="授课时间" prop="classTime" class="laws-info-item">
                    <DatePicker type="daterange" v-model="courseVO.classTime"  placeholder="请选择授课时间" style="width: 100%"></DatePicker>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="价格" prop="money" class="laws-info-item">
                    <InputNumber :min="1" v-model="courseVO.money" placeholder="请输入价格" style="width: 100%"></InputNumber>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="是否置顶" prop="validFlag" class="laws-info-item">
                    <Select v-model="courseVO.validFlag" :disabled="coursesType === 3">
                      <Option value="0">置顶</Option>
                      <Option value="1">非置顶</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="课程简介" class="laws-info-item">
                    <Input v-model="courseVO.introduce" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="coursesType === 3 ? '' : '请输入课程简介'" :disabled="coursesType === 3"></Input>
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button @click="closeDrawer">取消</Button>
        <Button type="primary" @click="saveCourseInfo('courseVO')">提交</Button>
      </div>
    </Drawer>

    <Drawer title="管理子课程" :mask-closable="false" v-model="courseModal"  width="800"  :styles="styles" @on-close="closeCourseDrawer">
        <Form :model="courseItemVO" :label-width="90" inline ref="courseItemVO" label-position="left">
          <Row>
            <Col span="24">
              <FormItem label="主课程名称" prop="name">
                <Input  v-model="courseItemVO.name" disabled style="width: 300px"/>
              </FormItem>
            </Col>
          </Row>
        </Form>
      <h4>子课程列表：</h4>
      <Button type="primary" @click="smAdd"  style="margin: 10px 0">新建</Button>
      <Table :columns="courseItemColumns" :data="courseItemList" border ref="selection" @on-selection-change="handleCourseItemChange" ></Table>
      <Page :total="courseTotal"
            style="margin-top: 10px;  width: 100%;
      height: 56px;
      line-height: 56px;
      padding: 0 15px;
      box-sizing: border-box;"
            show-elevator
            show-sizer
            show-total
            :current="coursePage"
            :page-size-opts="[10, 20, 30, 50]"
            :page-size="coursePageSize"
            @on-change="coursePageChange"
            @on-page-size-change="coursePageSizeChange"/>
      <div class="demo-drawer-footer">
      </div>
    </Drawer>

    <Drawer :title="smTitle" :mask-closable="false" v-model="smModal"  width="500"  :styles="styles" @on-close="closeSmDrawer">
      <Form ref="smVO"  :model="smVO" :rules="smVOFormRules" label-position="right" class="label-input-form">
        <Row>
          <Col span="24">
            <Row>
              <Col>
                <FormItem label="课程" prop="name">
                  <Input  v-model="smVO.name"  :disabled="courseType === 3" placeholder="请输入课程名称"/>
                </FormItem>
              </Col>
              <Col>
                <FormItem  label="任课老师" prop="teacher">
                  <Select v-model="smVO.teacher" multiple  :disabled="courseType === 3">
                    <Option value="0">王子龙</Option>
                    <Option value="1">谢利龙</Option>
                    <Option value="2">古桥时</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col>
                <FormItem label="开售结束时间" prop="time" class="laws-info-item">
                  <DatePicker type="daterange" v-model="smVO.time"  placeholder="开售时间为0时，结束时间为24时" style="width: 100% " :disabled="courseType === 3"></DatePicker>
                </FormItem>
              </Col>
              <Col>
                <FormItem label="授课时间" prop="classTime" class="laws-info-item">
                  <DatePicker type="daterange" v-model="smVO.classTime"  placeholder="请选择授课时间" style="width: 100%" :disabled="courseType === 3"></DatePicker>
                </FormItem>
              </Col>
              <Col>
                <FormItem label="价格" prop="money" class="laws-info-item">
                  <InputNumber :min="1" v-model="smVO.money" placeholder="请输入价格" style="width: 100%" :disabled="courseType === 3"></InputNumber>
                </FormItem>
              </Col>
              <Col>
                <FormItem label="班级代码" prop="courseNumber">
                  <Input  v-model="smVO.courseNumber"  :disabled="courseType === 3" placeholder="请输入课程代码"/>
                </FormItem>
              </Col>
              <Col>
                <FormItem label="课程简介" class="laws-info-item">
                  <Input v-model="smVO.introduce" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="courseType === 3 ? '' : '请输入课程简介'" :disabled="courseType === 3"></Input>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>

      <div class="demo-drawer-footer">
        <Button @click="cleanCourseValue2">取消</Button>
        <Button type="primary" @click="saveCourseInfo2('smVO')">提交</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
export default {
  name: 'course',
  data () {
    return {
      smVOFormRules: {
        teacher: [
          {required: true, type: 'array', message: '管理老师不能为空', trigger: 'change'}
        ],
        name: [{required: true, message: '课程名称不能为空', trigger: 'blur'},
          {type: 'string', max: 20, message: '最多输入20位', trigger: 'blur'}],
        validFlag: [
          {required: true, message: '置顶状态不能为空', trigger: 'change'}
        ],
        courseNumber: [
          {required: true, message: '课程代码不能为空', trigger: 'blur'}
        ],
        time: [
          {required: true, type: 'array', message: '开售结束时间不能为空', trigger: 'change'}
        ],
        classTime: [
          {required: true, type: 'array', message: '授课时间不能为空', trigger: 'change'}
        ],
        money: [
          {required: true, type: 'number', message: '价格不能为空', trigger: 'change'}
        ]
      },
      smVO: {
        name: '',
        introduce: '',
        validFlag: '',
        teacher: [],
        courseNumber: '',
        time: '',
        classTime: '',
        money: ''
      },
      smTitle: '',
      smModal: false,
      courseTotal: 0,
      coursePage: 1,
      coursePageSize: 10,
      courseItemColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '课程名称',
          align: 'center',
          key: 'name'
        },
        {
          title: '任课老师',
          align: 'center',
          key: 'teacher'
        },
        {
          title: '班级代码',
          align: 'center',
          key: 'courseNumber'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 200,
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
                    this.showCourse2(params.row)
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.courseEdit2(params.row)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '提示',
                      content: `您确认要删除 <span style="color: #E4393C">${params.row.name}</span> 吗？`,
                      onOk: () => {
                        this.courseDel2(params.row.usid)
                      }})
                  }
                }
              }, '删除')
            ])
          }
        }

      ],
      courseItemList: [
        {
          name: '英语',
          introduce: 'xxxxxxxxxxxxx',
          validFlag: '0',
          teacher: ['0'],
          courseNumber: 'ABCD'
        }
      ],
      courseItemVO: {
        name: ''
      },
      courseModal: false,
      // 总数
      total: 0,
      // 当前页数
      pageNo: 1,
      // 单页数量
      pageSize: 10,
      formItem: {
        name: '',
        teacher: '',
        validFlag: '',
        courseNumber: ''
      },
      courseVOFormRules: {
        teacher: [
          {required: true, type: 'array', message: '管理老师不能为空', trigger: 'change'}
        ],
        name: [{required: true, message: '课程名称不能为空', trigger: 'blur'},
          {type: 'string', max: 20, message: '最多输入20位', trigger: 'blur'}],
        validFlag: [
          {required: true, message: '置顶状态不能为空', trigger: 'change'}
        ],
        courseNumber: [
          {required: true, message: '课程代码不能为空', trigger: 'blur'}
        ],
        time: [
          {required: true, type: 'array', message: '开售结束时间不能为空', trigger: 'change'}
        ],
        classTime: [
          {required: true, type: 'array', message: '授课时间不能为空', trigger: 'change'}
        ],
        money: [
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
        name: '',
        introduce: '',
        validFlag: '',
        teacher: '',
        courseNumber: '',
        time: [],
        classTime: [],
        money: ''
      },
      coursesType: '',
      courseType: '',
      courseColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '班级名称',
          align: 'center',
          key: 'name'
        },
        {
          title: '管理老师',
          align: 'center',
          key: 'teacher'
        },
        {
          title: '班级代码',
          align: 'center',
          key: 'courseNumber'
        },
        {
          title: '置顶',
          align: 'center',
          width: 80,
          key: 'validFlag',
          render: (h, params) => {
            // let _this = this
            let texts = ''
            if (params.row.validFlag === '0') {
              texts = '置顶'
            } else {
              texts = '非置顶'
            }
            return h('div', {
              props: {}
            }, texts)
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
                    this.subTask(params.row)
                  }
                }
              }, '管理子课程'),
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.courseEdit(params.row)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '提示',
                      content: `您确认要删除 <span style="color: #E4393C">${params.row.name}</span> 吗？`,
                      onOk: () => {
                        this.courseDel(params.row.usid)
                      }})
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      courseList: [
        {
          name: '寒假系统班',
          introduce: 'xxxxxxxxxxxxx',
          validFlag: '0',
          teacher: ['0'],
          courseNumber: 'ABCD'
        }
      ],
      clickCourseList: []
    }
  },
  methods: {
    closeCourseDrawer () {},
    closeSmDrawer () {},
    // 重置
    resetSearch () {
      for (let i in this.formItem) {
        this.formItem[i] = ''
      }
    },
    pageChange (page) {
      this.pageNo = page
    },
    coursePageChange (page) {
      this.coursePage = page
    },
    pageSizeChange (pageSize) {
    },
    coursePageSizeChange (pageSize) {
    },
    // 删除用户信息
    courseDel () {
      this.$Message.success('删除成功')
    },
    courseDel2 () {
      this.$Message.success('删除成功')
    },
    // 编辑课程信息
    courseEdit (row) {
      this.coursesType = 2
      this.showCourseModal = true
      this.courseTitle = '编辑班级信息'
      this.courseVO = JSON.parse(JSON.stringify(row))
    },
    courseEdit2 (row) {
      this.courseType = 2
      this.smTitle = '编辑课程信息'
      this.smVO = JSON.parse(JSON.stringify(row))
      this.smModal = true
    },
    // 保存用户信息
    saveCourseInfo (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // 更新
          if (this.coursesType === 2) {
          } else {
            // 新增
            this.$Message.success('保存成功！')
          }
          this.closeDrawer()
        } else {
          this.$Message.error('请正确填写表单')
        }
      })
    },
    // 保存用户信息
    saveCourseInfo2 (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // 更新
          if (this.courseType === 2) {
          } else {
            // 新增
            this.$Message.success('保存成功！')
          }
          this.closeDrawer2()
        } else {
          this.$Message.error('请正确填写表单')
        }
      })
    },
    // 查看子课程
    subTask (row) {
      this.courseModal = true
      this.courseItemVO = JSON.parse(JSON.stringify(row))
    },
    // 查看用户信息
    showCourse (row) {
      this.coursesType = 3
      this.showCourseModal = true
      this.courseVO = JSON.parse(JSON.stringify(row))
      this.courseTitle = '查看班级信息'
    },
    showCourse2 (row) {
      this.courseType = 3
      this.smModal = true
      this.smVO = JSON.parse(JSON.stringify(row))
      this.smTitle = '查看课程信息'
    },
    // 表格复选框点击
    handleRowChange (selection) {
      this.clickCourseList = selection
    },
    handleCourseItemChange (selection) {
      this.courseList = selection
    },
    // 批量删除
    batchCourseDel () {
      if (this.clickCourseList.length > 0) {
        let courseIds = []
        for (let i = 0; i < this.clickCourseList.length; i++) {
          let courseId = this.clickCourseList[i].usid
          courseIds.push(courseId)
        }
        // let courseIdsStr = courseIds.join(',')
        this.$Modal.confirm({
          title: '请选择',
          content: '确定删除这些数据?',
          onOk: () => {
            this.$Message.success('删除成功')
          }})
      } else {
        this.$Message.error('请选择一条数据进行删除')
      }
    },
    // 打开新增
    openAddCourseModal () {
      this.showCourseModal = true
      if (this.$refs['courseVO'] !== undefined) {
        this.$refs['courseVO'].resetFields()
        for (let i in this.courseVO) {
          this.courseVO[i] = ''
        }
      }
      this.coursesType = 1
      this.courseTitle = '新增班级信息'
    },
    smAdd () {
      this.smModal = true
      if (this.$refs['smVO'] !== undefined) {
        this.$refs['smVO'].resetFields()
        for (let i in this.smVO) {
          this.smVO[i] = ''
        }
      }
      this.courseType = 1
      this.smTitle = '新增课程信息'
    },
    // 关闭弹窗
    closeDrawer () {
      this.showCourseModal = false
      this.cleanCourseValue()
    },
    closeDrawer2 () {
      this.smModal = false
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
    cleanCourseValue2 () {
      this.smModal = false
      this.$nextTick(() => {
        if (this.$refs['smVO'] !== undefined) {
          this.$refs['smVO'].resetFields()
          for (let i in this.smVO) {
            this.smVO[i] = ''
          }
        }
      })
    }
  },
  components: {},
  props: {},
  computed: {},
  watch: {},
  mounted () {
  }
}
</script>

<style lang="less">
  .course {
    background: #FFFFFF;
    padding: 12px;
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
