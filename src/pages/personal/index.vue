<!-- 个人资料 -->
<template>
  <div class="personal-data">
    <div class="user-avator">
      <div class="img-warpper">
        <img :src="userAvator" style="width: 100%;height: 100%">
      </div>
      <!--<input type="file" accept="image/*" v-show="false" ref="avatorUploadBtn" id="avatorUploadBtn" @change="uploadAvator" >-->
      <!--<Button type="primary" long @click="chooseAvator" style="margin-top: 5px">修改头像</Button>-->
      <!--<div class="tips"><span class="require">*</span> 图片大小不能超过2M</div>-->
    </div>
    <div class="user-info-form">
      <Form ref="userInfo" :model="userInfo" :rules="userInfoRules" :label-width="80" class="label-input-form">
        <FormItem label="账号" prop="account" class="user-info-item">
          <Input v-model="userInfo.account" disabled :title="userInfo.account"></Input>
        </FormItem>
        <FormItem label="姓 名" prop="uName" class="user-info-item">
          <Input v-model="userInfo.uName" disabled></Input>
        </FormItem>
        <FormItem label="任职部门" prop="orgName" class="user-info-item">
          <Input v-model="userInfo.orgName" disabled></Input>
        </FormItem>
        <FormItem label="办公电话" prop="officePhone" class="user-info-item">
          <Input v-model="userInfo.officePhone" clearable :maxlength="100"></Input>
        </FormItem>
        <FormItem label="个人邮箱" prop="email" class="user-info-item">
          <Input v-model="userInfo.email" clearable :maxlength="100" :title="userInfo.email"></Input>
        </FormItem>
        <FormItem label="手机号码" prop="mobilePhone" class="user-info-item">
          <Input v-model="userInfo.mobilePhone" :maxlength="11" clearable></Input>
        </FormItem>
        <FormItem label="传 真" prop="faxAddress" class="user-info-item">
          <Input v-model="userInfo.faxAddress" clearable></Input>
        </FormItem>
        <FormItem label="个性签名" prop="signature" class="user-info-item">
          <Input v-model.trim="userInfo.signature" type="textarea" :autosize="{minRows: 1,maxRows: 5}" style="width: 256px"  clearable ></Input>
        </FormItem>
      </Form>
      <Button type="primary" long @click="saveUserInfo('userInfo')" style="width: 200px">保存修改</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'personal-data',
  data () {
    return {
      userInfo: JSON.parse(sessionStorage.getItem('user')),
      loading: false,
      userAvator: require('../../assets/imgs/avator_default.png'),
      userInfoRules: {
        account: [
          {required: true, message: '账号不能为空', trigger: 'blur'},
          {type: 'string', max: 100, message: '最多输入100位', trigger: 'blur'}
        ],
        orgName: [
          // {required: true, message: '任职部门不能为空', trigger: 'blur'},
          {type: 'string', max: 100, message: '最多输入100位', trigger: 'blur'}
        ],
        officePhone: [
          {type: 'string', validator: this.checkOfficePhone, trigger: 'blur'}
        ],
        email: [
          {required: true, message: '邮箱不能为空', trigger: 'blur'},
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        mobilePhone: [
          {required: true, message: '手机号不能为空', trigger: 'blur'},
          { validator: this.verify.checkMobilePhone, trigger: 'blur' }
        ],
        faxAddress: [
          {type: 'number', validator: this.verify.checkFaxAddress, trigger: 'blur'}
        ],
        signature: [
          {
            type: 'string', max: 100, message: '个性签名输入上限为100'
          }]
      }
    }
  },
  methods: {
    // 选取图片
    chooseAvator () {
      document.getElementById('avatorUploadBtn').click()
    },
    /**
       * @description: 头像上传
       * @author: xx
       * @date: 2018-08-30 16:06:06
       */
    error (msg) {
      this.$Message.error(msg)
    },
    // // 个性签名字数统计
    // errorSignature () {
    //   if (this.userInfo.signature.length > 100) {
    //     this.error('最多输入100个字')
    //   }
    // },
    // 上传图片
    uploadAvator () {
      // let avator = this.$refs.avatorUploadBtn.files[0]
      let flileSize = this.$refs.avatorUploadBtn.files[0].size
      // console.log(flileSize)
      if (flileSize / 1024 > 2000) {
        this.error('上传图片大于2M，请重新上传')
        $('#avatorUploadBtn').val('')
      }
    },
    // 保存用户信息
    saveUserInfo (name) {
      // if (this.userInfo.userPic === null || this.userInfo.userPic === '') {
      //   return this.error('请先上传头像')
      // }
      this.$refs[name].validate((valid) => {
        if (valid) {
        } else {}
      })
    },
    // 验证办公电话
    checkOfficePhone (rule, value, callback) {
      let tel2 = /^[0-9\-\\(\\)（）x]+$/
      if (value === null || value === '') {
        callback()
      } else if (!tel2.test(value)) {
        return callback(new Error('办公电话格式不正确'))
      } else {
        callback()
      }
    }
  },
  computed: {
  },
  watch: {
  },
  mounted () {
    console.log(JSON.parse(sessionStorage.getItem('user')))
    this.userAvator = require('../../assets/imgs/avator_default.png')
  }
}
</script>

<style lang="less">
  .personal-data{
    background: #FFFFFF;
    width: 100%;
    height: 100%;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    .user-avator{
      width: 200px;
      height: 220px;
      box-sizing: border-box;
      margin: 80px 0 0 50px;
      float: left;
      .img-warpper{
        width: 100%;
        height: 220px;
        background: #DDD;
        border: 1px solid #DDD;
      }
      .btn-avator{
        width: 100%;
        height: 36px;
        line-height: 36px;
        margin-top: 20px;
      }
      .tips{
        padding-top: 5px;
      }
    }
    .user-info-form{
      width: 800px;
      min-height: 400px;
      margin-left: 100px;
      position: absolute;
      left: 250px;
      margin-top: 80px;
      padding-bottom: 10px;
      .save{
        width: 4.24rem;
        height: 0.72rem;
        line-height: 0.72rem;
        margin: 0.5rem 0 0 0.2rem;
        border-radius: 4px;
        position: relative;
      }
      .user-info-item{
        margin-bottom: 20px;
        vertical-align: top;
        zoom: 1;
        .ivu-input{
          width: 256px;
        }
        &:last-child{
          .ivu-input{
            width: 400px;
          }
        }
      }
    }
    .require{
      color: #FF0000;
    }
    textarea{
      min-height: 32px !important;
    }
  }
</style>
