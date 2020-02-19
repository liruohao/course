<template>
  <div class="newTimetable">
    <h4 style="margin-bottom: 10px">课程名称：{{ $route.query.cname }}</h4>
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
              <DatePicker v-model="courseItemVO.date" :disabled="tableMenuFlag === '3'" type="date"  style="width: 300px"></DatePicker>
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
    <Modal v-model="exportModelFlag" title="修改课堂作业" width="700">
      <Form ref="userVO"  :model="userVO" :rules="userVOFormRules" label-position="right" class="label-input-form">
        <Row>
          <Col>
            <FormItem label="课堂作业" prop="fileContent">
              <Input  v-model="userVO.fileContent" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入课堂作业"/>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="demo-drawer-footer">
        <Button @click="closeDrawer">取消</Button>
        <Button type="primary" @click="saveFiles('userVO', 2)">提交</Button>
      </div>
    </Modal>
    <Modal v-model="importModalshowflag" title="上传资料" footer-hide :z-index="1000" width="80%" class="modal-bg">
      <Form ref="fileVO"  :model="fileVO" :rules="fileVOFormRules"  label-position="right" class="label-input-form">
        <Row v-if="textFlag === '已结束'">
          <Col>
          <FormItem label="课堂作业" prop="fileContent">
            <Input  v-model="fileVO.fileContent" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入课堂作业"/>
          </FormItem>
          </Col>
        </Row>
        <Button type="primary" style="margin-bottom: 10px" @click="saveFiles('fileVO', 1)" v-if="textFlag === '已结束'">提交</Button>
        <div style="margin-bottom: 15px">上传文件</div>
      <Upload :action="importExcelUrl" ref="importfile" :show-upload-list="false" :max-size=10240 name="file" :data="fileData" style="margin-bottom: 15px" :on-success="fileSuccess">
        <Button icon="ios-cloud-upload-outline">选择文件</Button>
      </Upload>
      <div style="margin-bottom: 15px; line-height: 30px">已上传的资料</div>
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
      <Button type="error" @click="batchMenuDel" style="margin-bottom: 15px">批量删除</Button>
      <Table :columns="courseColumns" :data="courseList" height="400" border ref="selection" @on-selection-change="handleRowChange" ></Table>
<!--      <Page :total="total"-->
<!--      style="margin-top: 10px;  width: 100%;-->
<!--      height: 56px;-->
<!--      line-height: 56px;-->
<!--      padding: 0 15px;-->
<!--      box-sizing: border-box;"-->
<!--      show-elevator-->
<!--      show-sizer-->
<!--      show-total-->
<!--      :current="pageNo"-->
<!--      :page-size-opts="[10, 20, 30, 50]"-->
<!--      :page-size="pageSize"-->
<!--      @on-change="pageChange"-->
<!--      @on-page-size-change="pageSizeChange"/>-->
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'newTimetable',
  data () {
    return {
      exportModelFlag: false,
      textFlag: '',
      // 总数
      total: 0,
      // 当前页数
      pageNo: 1,
      // 单页数量
      pageSize: 10,
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
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '请选择',
                      content: '确定删除这些数据?',
                      onOk: () => {
                        this.$http.postData('course-file/batchDelete', {
                          ids: params.row.id
                        }, res => {
                          if (res.code === 'M0000') {
                            this.getFileByPage()
                            this.$Message.success('删除成功')
                          }
                        })
                      }})
                  }
                }
              }, '删除'),
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
              }, params.row.fileName === '' || params.row.fileName === null ? '修改' : '下载')
            ])
          }
        }
      ],
      courseText: {},
      courseList: [],
      fileVO: {
        fileContent: '',
        fileName: ''
      },
      fileVOFormRules: {
        fileContent: [{required: true, message: '课堂作业不能为空', trigger: 'blur'}]
      },
      fileData: {
        detailsId: '',
        fileType: '',
        fileContent: '',
        menuId: ''
      },
      importExcelUrl: '/course/course-file/fileUpload',
      importModalshowflag: false,
      userVOFormRules: {
        fileContent: [{required: true, message: '课堂作业不能为空', trigger: 'blur'}]
      },
      userVO: {
        fileContent: ''
      },
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
      categoryList: [
        {
          value: '未开始',
          label: '未开始'
        },
        {
          value: '已开始',
          label: '已开始'
        },
        {
          value: '已结束',
          label: '已结束'
        }
      ],
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
          title: '目录章节名称',
          key: 'menuName'
        },
        {
          title: '任课老师',
          align: 'center',
          key: 'teacherName'
        },
        {
          title: '开始结束时间',
          key: 'time',
          width: '250'
        },
        {
          title: '目录章节简介',
          key: 'menuDescrip'
        },
        {
          title: '状态',
          key: 'menuState',
          align: 'center',
          render: (h, params) => {
            return h('Select', {
              props: {
                value: params.row.menuState,
                readonly: true,
                disabled: params.row.teacherId !== JSON.parse(sessionStorage.getItem('user')).id,
                transfer: true
              },
              on: {
                'on-change': (val) => {
                  params.row.menuState = val
                  this.textFlag = val
                  this.data9[params.index].menuState = val
                  this.saveUser(params.row)
                  this.fileData.menuId = params.row.id
                  this.getFileByPage()
                }
              }
            }, this.categoryList.map((opt) => {
              return h('Option', {
                props: {
                  value: opt.value,
                  label: opt.label,
                  disabled: opt.value === '未开始'
                }
              })
            }))
          }
        },

        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 250,
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
                    disabled: params.row.teacherId !== JSON.parse(sessionStorage.getItem('user')).id || (params.row.menuState !== '未开始' && params.row.menuState !== '')
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
                    type: 'primary',
                    size: 'small',
                    disabled: params.row.teacherId !== JSON.parse(sessionStorage.getItem('user')).id
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.fileVO.fileContent = ''
                      this.importModalshowflag = true
                      this.fileData.detailsId = JSON.parse(this.$route.query.row).id
                      this.fileData.fileType = '资料'
                      this.fileData.fileContent = this.userVO.fileContent
                      this.fileData.menuId = params.row.id
                      this.textFlag = params.row.menuState
                      this.getFileByPage()
                    }
                  }
                },
                '上传资料'
              )
            ])
          }
        }
      ],
      data9: []
    }
  },
  methods: {
    fileSuccess (response) {
      if (response.code === 'M0000') {
        this.$Message.success('上传成功！')
        this.getFileByPage()
      } else {
        this.$Message.warning(response.msg)
      }
    },
    getFileByPage () {
      this.$http.get('course-file/getFileByPage', {
        page: this.pageNo,
        pageSize: 99999,
        menuId: this.fileData.menuId,
        fileName: this.fileVO.fileName
      }, res => {
        this.courseList = res.data
        // this.total = res.data.total
      })
    },
    pageChange (page) {
      this.pageNo = page
      this.getFileByPage()
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize
      this.getFileByPage()
    },
    saveFiles (name, flag) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.courseText.fileContent = this.userVO.fileContent
          if (flag === 2) {
            this.$http.put('course-file/updateCourseFile', this.courseText, res => {
              if (res.code === 'M0000') {
                this.$refs['userVO'].resetFields()
                this.exportModelFlag = false
                this.$Message.success('修改成功')
              } else {
                this.$Message.warning(res.msg)
              }
            })
          } else {
            this.saveFile()
          }
        } else {
          this.$Message.error('请正确填写表单')
        }
      })
    },
    saveFile () {
      this.fileData.detailsId = JSON.parse(this.$route.query.row).id
      this.fileData.fileType = '课堂作业'
      this.fileData.fileContent = this.fileVO.fileContent
      this.$http.post('course-file/addCourseTask', this.fileData, res => {
        if (res.code === 'M0000') {
          this.$Message.success('发布成功')
          this.$refs['fileVO'].resetFields()
          this.getFileByPage()
        }
      })
    },
    saveUserInfo (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.post('sys-user-address/addSysUserAddress', {
            userId: JSON.parse(sessionStorage.getItem('user')).id,
            address: this.userVO.address,
            receiver: this.userVO.receiver,
            teleNumber: this.userVO.teleNumber
          }, res => {
            if (res.code === 'M0000') {
              this.closeDrawer()
              this.information = res.data
              this.$Message.success('新增成功')
            } else {
              this.$Message.warning(res.msg)
            }
          })
        } else {
          this.$Message.error('请正确填写表单')
        }
      })
    },

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
    saveUser (row) {
      this.$http.put('course-menu/updateCourseMenu', row, res => {
        if (res.code === 'M0000') {
          if (row.menuState === '已结束') {
            this.$Message.success('课程已结束，请去发布课堂作业')
          }
          this.getMenuByList()
          this.$Message.success('修改成功！')
        } else {
          this.$Message.warning(res.msg)
        }
      })
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
      this.$refs['userVO'].resetFields()
      this.exportModelFlag = false
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
    // 批量删除
    batchMenuDel () {
      if (this.clickMenuList.length > 0) {
        let userIds = []
        for (let i = 0; i < this.clickMenuList.length; i++) {
          let userId = this.clickMenuList[i].id
          userIds.push(userId)
        }
        let userIdsStr = userIds.join(',')
        this.$Modal.confirm({
          title: '请选择',
          content: '确定删除这些数据?',
          onOk: () => {
            this.$http.postData('course-file/batchDelete', {
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
  .newTimetable {
    width: 100%;
    height: 100%;
    padding: 12px;
    background: #ffffff;
  }
  .modal-bg{
    .ivu-modal-body{
      max-height: 500px;
      min-height: 300px;
      overflow-y: auto;
    }
  }
</style>
