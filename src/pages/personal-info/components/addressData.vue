<comment>
    # 地址管理
</comment>
<template>
    <div class="addressData">
        <Button type="primary" title="新增" @click="openAddAddressModal">新增</Button>
        <Button type="error" title="批量删除" @click="batchAddressDel">批量删除</Button>
      <Table style="margin-top: 15px" :columns="addressColumns" :data="addressList" border ref="selection" @on-selection-change="handleRowChange" ></Table>
      <Modal v-model="exportModelFlag" :title="modelTitle" width="700">
        <Form ref="userVO"  :model="userVO" :rules="userVOFormRules" label-position="right" class="label-input-form" v-show="this.usersType === '1'">
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
                      content: `您确认要删除 <span style="color: #E4393C">${params.row.uname}</span> 吗？`,
                      onOk: () => {
                        this.addressDel(params.row.id)
                      }})
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      addressList: [],
      clickCourseList: []
    }
  },
  props: {},
  watch: {},
  methods: {
    saveUserInfo (name) {
      this.$refs[name].validate((valid) => {
        if (this.usersType === '1') {
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
                  this.$Message.success('新增成功')
                } else {
                  this.$Message.warning(res.msg)
                }
              })
            } else {
              if (this.clickUserList.length === 0) {
                return this.$Message.warning('请选收货地址')
              }
            }
          } else {
            this.$Message.error('请正确填写表单')
          }
        } else {
          if (this.clickUserList.length === 0) {
            return this.$Message.warning('请选收货地址')
          }
        }
      })
    },
    closeDrawer () {
      this.$refs['userVO'].resetFields()
      this.exportModelFlag = false
    },
    // 表格复选框点击
    handleRowChange (selection) {
      this.clickCourseList = selection
    },
    openAddAddressModal () {},
    batchAddressDel () {},
    getAddressByList () {
      this.$http.get('sys-user-address/getAddressByList', {
        userId: JSON.parse(sessionStorage.getItem('user')).id
      }, res => {
        this.addressList = res.data
      })
    },
    addressEdit (row) {},
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
