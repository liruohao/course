<template>
  <div class="user">
    <Form :model="formItem" :label-width="100" inline>
      <FormItem label="人员姓名：">
        <Input v-model="formItem.uname" clearable/>
      </FormItem>
      <FormItem label="系统账号：">
        <Input v-model="formItem.account"/>
      </FormItem>
      <FormItem label="角色：">
        <Select v-model="formItem.userRole" clearable style="width: 150px">
          <Option value="1">学生</Option>
          <Option value="2">老师</Option>
          <Option value="3">超级管理员</Option>
        </Select>
      </FormItem>
      <FormItem label="状态：">
        <Select v-model="formItem.validFlag" clearable style="width: 150px">
          <Option value="0">正常</Option>
          <Option value="1">禁用</Option>
        </Select>
      </FormItem>
      <Button type="primary" @click="getUserByPage">查询</Button>
      <Button type="primary" @click="resetSearch">重置</Button>
    </Form>
    <div style="margin-bottom: 10px">
      <Button type="primary" title="新增" @click="openAddUserModal">新增</Button>
      <Button type="error" title="批量删除" @click="batchUserDel">批量删除</Button>
      <Button type="primary" title="导出用户信息">导出用户信息</Button>
    </div>
    <Table :columns="userColumns" :data="userList" border ref="selection" @on-selection-change="handleRowChange"></Table>
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
    <Drawer :title="userTitle" :mask-closable="false" v-model="showUserModal"  width="500"  :styles="styles" @on-close="closeDrawer">
      <div>
        <Form ref="userVO"  :model="userVO" :rules="userVOFormRules" label-position="right" class="label-input-form">
          <Row>
            <Col span="24">
              <Row>
                <Col>
                </Col>
                <Col>
                  <FormItem label="人员姓名" prop="uname">
                    <Input  v-model="userVO.uname"  :disabled="usersType === 3" placeholder="请输入人员姓名"/>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem  label="系统账号" prop="account">
                    <Input :disabled="usersType === 3" v-model="userVO.account" placeholder="请输入系统账号"/>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="用户密码" prop="password" v-if="showPWD">
                    <Input type="password" v-model="userVO.password" :disabled="usersType === 3" placeholder="请输入用户密码"/>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="再次输入密码" prop="passwordCheck" v-if="showPWD">
                    <Input type="password" v-model="userVO.passwordCheck" :disabled="usersType === 3" placeholder="请再次输入密码"/>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="角色" prop="userRole" class="laws-info-item">
                    <Select v-model="userVO.userRole" :disabled="usersType === 3">
                      <Option value="1">学生</Option>
                      <Option value="2">老师</Option>
                      <Option value="3">超级管理员</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col v-if="userVO.userRole === '2'">
                  <FormItem label="主讲课程" prop="mainCourse" class="laws-info-item">
                    <Input v-model="userVO.mainCourse"  type="textarea" :autosize="{minRows: 2,maxRows: 5}"  :disabled="usersType === 3" placeholder="请填写主讲课程"/>
                  </FormItem>
                </Col>
                <Col v-if="userVO.userRole === '2'">
                  <FormItem label="讲课简历" prop="resume" class="laws-info-item">
                    <Input v-model="userVO.resume"  type="textarea" :autosize="{minRows: 2,maxRows: 5}"  :disabled="usersType === 3" placeholder="请填写讲课简历"/>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="手机号码" prop="mobilePhone" class="laws-info-item">
                    <Input v-model="userVO.mobilePhone"  :disabled="usersType === 3" placeholder="请输入手机号"/>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="电子邮件" prop="email" class="laws-info-item">
                    <Input v-model="userVO.email"  :disabled="usersType === 3" placeholder="请输入电子邮箱"/>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="用户状态" prop="validFlag" class="laws-info-item">
                    <Select v-model="userVO.validFlag" :disabled="usersType === 3">
                      <Option value="0">正常</Option>
                      <Option value="1">禁用</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="demo-drawer-footer" v-if="usersType !== 3">
        <Button @click="closeDrawer">取消</Button>
        <Button type="primary" @click="saveUserInfo('userVO')">提交</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
export default {
  name: 'user',
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入您的密码！'))
      } else {
        let tel = /^.*[^\d].*$/
        let tel2 = /^.{6,20}$/
        let tel3 = /^\S*$/
        if (!value.match(tel)) {
          return callback(new Error('密码不能为纯数字！'))
        } else if (!value.match(tel2)) {
          return callback(new Error('密码长度为6-20位'))
        } else if (!value.match(tel3)) {
          return callback(new Error('密码不能有空格'))
        }
      }callback()
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('再次输入密码不能为空！'))
      } else if (value !== this.userVO.password) {
        callback(new Error('再次输入密码与用户密码不匹配！'))
      } else {
        let tel = /^.*[^\d].*$/
        let tel2 = /^.{6,20}$/
        let tel3 = /^\S*$/
        if (!value.match(tel)) {
          return callback(new Error('密码不能为纯数字'))
        } else if (!value.match(tel2)) {
          return callback(new Error('密码长度为6-20位'))
        } else if (!value.match(tel3)) {
          return callback(new Error('密码不能有空格'))
        }
      }callback()
    }
    return {
      showPWD: true,
      // 总数
      total: 0,
      // 当前页数
      pageNo: 1,
      // 单页数量
      pageSize: 10,
      formItem: {
        uname: '',
        userRole: '',
        validFlag: '',
        account: ''
      },
      userVOFormRules: {
        account: [
          {required: true, type: 'string', validator: this.checkUsername2, trigger: 'blur'},
          {type: 'string', min: 2, message: '最少输入2位', trigger: 'blur'},
          {type: 'string', max: 20, message: '最多输入20位', trigger: 'blur'}
        ],
        uname: [{required: true, message: '人员姓名不能为空', trigger: 'blur'},
          {type: 'string', max: 20, message: '最多输入20位', trigger: 'blur'}],
        mobilePhone: [{
          required: true, type: 'string', validator: this.checkMobilePhone, trigger: 'blur'
        }],
        mainCourse: [
          {
            required: true, message: '主讲课程不能为空', trigger: 'blur'
          }
        ],
        resume: [
          {
            required: true, message: '讲课简历不能为空', trigger: 'blur'
          }
        ],
        email: [
          {required: true, message: '邮箱不能为空', trigger: 'blur'},
          {type: 'string', max: 50, message: '最多输入50位', trigger: 'blur'},
          {type: 'email', message: '电子邮箱格式不正确', trigger: 'blur'}],
        userRole: [
          {required: true, message: '角色不能为空', trigger: 'change'}
        ],
        validFlag: [
          {required: true, message: '用户状态不能为空', trigger: 'change'}
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        passwordCheck: [
          { required: true, validator: validatePassCheck, trigger: 'blur' }]
      },
      userTitle: '',
      showUserModal: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      // 用户信息
      userVO: {
        uname: '',
        password: '',
        passwordCheck: '',
        userRole: '',
        mobilePhone: '',
        email: '',
        validFlag: '',
        account: '',
        mainCourse: '',
        resume: ''
      },
      usersType: '',
      userColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '人员姓名',
          align: 'center',
          key: 'uname'
        },
        {
          title: '系统账号',
          align: 'center',
          key: 'account'
        },
        {
          title: '角色',
          align: 'center',
          key: 'userRole',
          render: (h, params) => {
            // let _this = this
            let texts = ''
            if (params.row.userRole === '1') {
              texts = '学生'
            } else if (params.row.userRole === '2') {
              texts = '老师'
            } else if (params.row.userRole === '3') {
              texts = '超级管理员'
            }
            return h('div', {
              props: {}
            }, texts)
          }
        },
        {
          title: '状态',
          align: 'center',
          width: 80,
          key: 'validFlag',
          render: (h, params) => {
            // let _this = this
            let texts = ''
            if (params.row.validFlag === '0') {
              texts = '正常'
            } else {
              texts = '禁用'
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
                    this.showUser(params.row)
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
                    this.resetPassword(params.row)
                  }
                }
              }, '重置密码'),
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
                    this.userEdit(params.row)
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
                      content: `您确认要删除 <span style="color: #E4393C">${params.row.uname}</span> 吗？`,
                      onOk: () => {
                        this.userDel(params.row.id)
                      }})
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      userList: [],
      clickUserList: []
    }
  },
  methods: {
    // 重置
    resetSearch () {
      for (let i in this.formItem) {
        this.formItem[i] = ''
      }
      this.getUserByPage()
    },
    pageChange (page) {
      this.pageNo = page
    },
    pageSizeChange (pageSize) {
    },
    // 删除用户信息
    userDel (id) {
      let ids = []
      ids.push(id)
      this.$http.postData('sys-user/batchDelete', {ids: ids}, res => {
        if (res.code === 'M0000') {
          this.getUserByPage()
          this.$Message.success('删除成功')
        }
      })
    },
    // 编辑用户信息
    userEdit (row) {
      this.showPWD = false
      this.usersType = 2
      this.showUserModal = true
      this.userTitle = '编辑用户信息'
      this.userVO = JSON.parse(JSON.stringify(row))
      this.showUserModal = true
    },
    // 保存用户信息
    saveUserInfo (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // 更新
          let obj = JSON.parse(JSON.stringify(this.userVO))
          obj.validFlag = Number(obj.validFlag)
          if (this.usersType === 2) {
            this.$http.put('sys-user/updateUser', obj, res => {
              if (res.code === 'M0000') {
                this.getUserByPage()
                this.$Message.success('修改用户成功！')
                this.closeDrawer()
              } else {
                this.$Message.warning(res.msg)
              }
            })
          } else {
            this.$http.postData('sys-user/addUser', obj, res => {
              if (res.code === 'M0000') {
                this.getUserByPage()
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
    // 重置密码
    resetPassword (row) {
      let obj = JSON.parse(JSON.stringify(row))
      obj.validFlag = Number(obj.validFlag)
      obj.password = '123456a'
      this.$http.put('sys-user/updateUser', obj, res => {
        if (res.code === 'M0000') {
          this.$Message.success('密码重置为123456a!')
        } else {
          this.$Message.warning(res.msg)
        }
      })
    },
    // 查看用户信息
    showUser (row) {
      this.showPWD = false
      this.usersType = 3
      this.showUserModal = true
      this.userTitle = '查看用户信息'
      this.userVO = JSON.parse(JSON.stringify(row))
    },
    // 系统账户验证
    checkUsername2 (rule, value, callback) {
      let reg = /^(?=.*[a-zA-Z])/
      if (value === '' || value == null) {
        return callback(new Error('系统账号不能为空'))
      } else {
        if (!value.match(reg)) {
          return callback(new Error('至少包含1个字母'))
        } else {
          let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{} %【】‘；：”“'。，、？]") // eslint-disable-line
          setTimeout(() => {
            if (pattern.test(value) === true) {
              return callback(new Error('不能包含特殊字符'))
            } else {
              callback()
            }
          })
        }
      }
    },
    // 验证手机号码
    checkMobilePhone (rule, value, callback) {
      if (!value) {
        return callback(new Error('手机号码不能为空'))
      }
      let tel = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
      if (!value.match(tel)) {
        return callback(new Error('手机格式不正确'))
      } else {
        callback()
      }
    },
    // 表格复选框点击
    handleRowChange (selection) {
      this.clickUserList = selection
    },
    // 批量删除
    batchUserDel () {
      if (this.clickUserList.length > 0) {
        let userIds = []
        for (let i = 0; i < this.clickUserList.length; i++) {
          let userId = this.clickUserList[i].id
          userIds.push(userId)
        }
        let userIdsStr = userIds.join(',')
        this.$Modal.confirm({
          title: '请选择',
          content: '确定删除这些数据?',
          onOk: () => {
            this.$http.postData('sys-user/batchDelete', {
              ids: userIdsStr
            }, res => {
              if (res.code === 'M0000') {
                this.getUserByPage()
                this.$Message.success('删除成功')
              }
            })
          }})
      } else {
        this.$Message.error('请选择一条数据进行删除')
      }
    },
    // 打开新增
    openAddUserModal () {
      this.showUserModal = true
      if (this.$refs['userVO'] !== undefined) {
        this.$refs['userVO'].resetFields()
        for (let i in this.userVO) {
          this.userVO[i] = ''
        }
      }
      this.usersType = 1
      this.showPWD = true
      this.userTitle = '新增用户信息'
    },
    // 关闭弹窗
    closeDrawer () {
      this.showUserModal = false
      this.cleanUserValue()
    },
    // 清除弹窗内容
    cleanUserValue () {
      this.showUserModal = false
      this.$nextTick(() => {
        if (this.$refs['userVO'] !== undefined) {
          this.$refs['userVO'].resetFields()
          for (let i in this.userVO) {
            this.userVO[i] = ''
          }
        }
      })
    },
    // 分页查询
    getUserByPage () {
      this.$http.get('sys-user/getUserByPage', {
        page: this.pageNo,
        pageSize: this.pageSize,
        uname: this.formItem.uname,
        account: this.formItem.account,
        userRole: this.formItem.userRole,
        validFlag: this.formItem.validFlag === '' ? '' : Number(this.formItem.validFlag)
      }, res => {
        res.data.records.map((item) => {
          item.validFlag = item.validFlag.toString()
        })
        this.userList = res.data.records
        this.total = res.data.total
      })
    }
  },
  components: {},
  props: {},
  computed: {},
  watch: {},
  mounted () {
    this.getUserByPage()
  }
}
</script>

<style lang="less">
  .user {
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
