<comment>
    # 地址管理
</comment>
<template>
    <div class="addressData">
        <Button type="primary" title="新增" @click="openAddAddressModal">新增</Button>
        <Button type="error" title="批量删除" @click="batchAddressDel">批量删除</Button>
      <Table style="margin-top: 15px" :columns="addressColumns" :data="addressList" border ref="selection" @on-selection-change="handleRowChange" ></Table>
      <Modal v-model="exportModelFlag" :title="modelTitle" width="700">
        <Form ref="userVO"  :model="userVO" :rules="userVOFormRules" label-position="right" class="label-input-form">
          <Row>
            <Col>
              <FormItem label="收货人" prop="receiver">
                <Input  v-model="userVO.receiver" placeholder="请输入收货人"/>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem label="联系电话" prop="teleNumber">
                <Input  v-model="userVO.teleNumber" placeholder="请输入联系电话"/>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem label="地址" prop="address">
                <Input  v-model="userVO.address" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入地址"/>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div class="demo-drawer-footer">
          <Button @click="closeDrawer">取消</Button>
          <Button type="primary" @click="saveUserInfo('userVO')">提交</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
export default {
  name: 'addressData',
  components: {},
  data () {
    return {
      userVO: {
        address: '',
        teleNumber: '',
        receiver: '',
        usersType: ''
      },
      userVOFormRules: {
        teleNumber: [{required: true, type: 'string', validator: this.checkMobilePhone, trigger: 'blur'}],
        receiver: [{required: true, message: '收货人不能为空', trigger: 'blur'}],
        address: [{required: true, message: '地址不能为空', trigger: 'blur'}]
      },
      exportModelFlag: false,
      modelTitle: '',
      addressColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '收货人',
          align: 'center',
          key: 'receiver'
        },
        {
          title: '联系电话',
          align: 'center',
          key: 'teleNumber'
        },
        {
          title: '收货地址',
          align: 'center',
          key: 'address'
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
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.addressEdit(params.row)
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
                      content: `您确认要删除这条数据吗？`,
                      onOk: () => {
                        this.menuDel(params.row.id)
                      }})
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      addressList: [],
      clickMenuList: [],
      usersType: ''
    }
  },
  props: {},
  watch: {},
  methods: {
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
    saveUserInfo (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.usersType === '1') {
            this.$http.post('sys-user-address/addSysUserAddress', {
              userId: JSON.parse(sessionStorage.getItem('user')).id,
              address: this.userVO.address,
              receiver: this.userVO.receiver,
              teleNumber: this.userVO.teleNumber
            }, res => {
              if (res.code === 'M0000') {
                this.closeDrawer()
                this.getAddressByList()
                this.$Message.success('新增成功')
              } else {
                this.$Message.warning(res.msg)
              }
            })
          } else {
            this.$http.put('sys-user-address/updateSysUserAddress', {
              userId: JSON.parse(sessionStorage.getItem('user')).id,
              address: this.userVO.address,
              receiver: this.userVO.receiver,
              teleNumber: this.userVO.teleNumber,
              id: this.userVO.id
            }, res => {
              if (res.code === 'M0000') {
                this.closeDrawer()
                this.getAddressByList()
                this.$Message.success('编辑成功')
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
    closeDrawer () {
      this.$refs['userVO'].resetFields()
      this.exportModelFlag = false
    },
    // 删除
    menuDel (id) {
      let ids = []
      ids.push(id)
      this.$http.postData('sys-user-address/batchDelete', {ids: ids}, res => {
        if (res.code === 'M0000') {
          this.getAddressByList()
          this.$Message.success('删除成功')
        }
      })
    },
    // 表格复选框点击
    handleRowChange (selection) {
      this.clickMenuList = selection
    },
    openAddAddressModal () {
      this.usersType = '1'
      this.$refs['userVO'].resetFields()
      this.modelTitle = '新增收货地址'
      this.exportModelFlag = true
    },
    batchAddressDel () {
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
            this.$http.postData('sys-user-address/batchDelete', {
              ids: userIdsStr
            }, res => {
              if (res.code === 'M0000') {
                this.getAddressByList()
                this.$Message.success('删除成功')
              }
            })
          }})
      } else {
        this.$Message.error('请选择一条数据进行删除')
      }
    },
    getAddressByList () {
      this.$http.get('sys-user-address/getAddressByList', {
        userId: JSON.parse(sessionStorage.getItem('user')).id
      }, res => {
        this.addressList = res.data
      })
    },
    addressEdit (row) {
      this.usersType = '2'
      this.userVO = JSON.parse(JSON.stringify(row))
      this.$refs['userVO'].resetFields()
      this.modelTitle = '编辑收货地址'
      this.exportModelFlag = true
    },
    addressDel (id) {}
  },
  computed: {},
  mounted () {
    this.getAddressByList()
  }
}
</script>

<style lang="less">
    .addressData {
    }
</style>
