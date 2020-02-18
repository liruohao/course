<!-- 账号安全 -->
<template>
  <div class="account-security">
    <div class="container">
      <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="120">
        <FormItem label="新密码" prop="passwd">
          <Input type="password" v-model="formCustom.passwd" :style="{width:6+'rem'}"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="passwdCheck">
          <Input type="password" v-model="formCustom.passwdCheck" :style="{width:6+'rem'}"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formCustom')" style="margin-left: 1rem">保存</Button>
          <Button @click="handleReset('formCustom')" style="margin-left: 0.3rem">重置</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'account-security',
  data () {
    const validatePassOld = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入您的密码'))
      } else {
        this.verificationPasswordBefore().then(res => {
          if (res !== '原始密码正确') {
            callback(new Error('密码有误，请重新输入！'))
          } else {
            callback()
          }
        }, e => {})
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入您的新密码'))
      } else {
        let tel = /^.*[^\d].*$/
        let tel2 = /^.{6,20}$/
        let tel3 = /^\S*$/
        if (!value.match(tel)) {
          return callback(new Error('不能为纯数字，且密码长度为6-20位'))
        } else if (!value.match(tel2)) {
          return callback(new Error('不能为纯数字，且密码长度为6-20位'))
        } else if (!value.match(tel3)) {
          return callback(new Error('密码不能有空格'))
        } else if (value === this.formCustom.passwordOld) {
          return callback(new Error('新密码不能与旧密码一致'))
        }
      }callback()
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码！'))
      } else if (value !== this.formCustom.passwd) {
        callback(new Error('确认密码与新密码不符，请重新输入新密码和确认密码！'))
      } else {
        let tel = /^.*[^\d].*$/
        let tel2 = /^.{6,20}$/
        let tel3 = /^\S*$/
        if (!value.match(tel)) {
          return callback(new Error('不能为纯数字，且密码长度为6-20位'))
        } else if (!value.match(tel2)) {
          return callback(new Error('不能为纯数字，且密码长度为6-20位'))
        } else if (!value.match(tel3)) {
          return callback(new Error('密码不能有空格'))
        }
      }callback()
    }

    return {
      formCustom: {
        passwordOld: '',
        passwd: '',
        passwdCheck: ''
      },
      msg: '',
      ruleCustom: {
        passwordOld: [
          { required: true, validator: validatePassOld, trigger: 'blur' }
        ],
        passwd: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        passwdCheck: [
          { required: true, validator: validatePassCheck, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 验证旧密码是否正确
    verificationPasswordBefore () {
      return new Promise((resolve, reject) => {
        this.$http.get('verificationPasswordBefore', {
          password_before: this.$base64(this.formCustom.passwordOld)
        }, {
          _this: this
        }, res => {
          resolve(res.message)
        }, e => {
          reject(e)
        })
      })
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let obj = JSON.parse(sessionStorage.getItem('user'))
          obj.password = this.formCustom.passwd
          this.$http.put('sys-user/updateUser', obj, res => {
            if (res.code === 'M0000') {
              this.$Message.success('密码重置为123456a!')
              this.$router.push('/')
            } else {
              this.$Message.warning(res.msg)
            }
          })
          this.$http.put('sys-user/updateUser', this.userInfo, res => {
            if (res.code === 'M0000') {
              this.$Message.success('修改信息成功！')
              sessionStorage.setItem('user', JSON.stringify(res.data))
            } else {
              this.$Message.warning(res.msg)
            }
          })
        } else {
        }
      })
    },
    // 用户退出登录
    userLoginOut () {
      this.$http.get('logout',
        {},
        {_this: this,
          loading: 'loading'},
        res => {
          this.$store.commit('logout')
          this.$router.push('/sign_in')
        })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    // 错误提示
    error () {
      this.$Message.error('This is an error tip')
    }
  }
}
</script>

<style lang="less">
  .account-security{
    width: 100%;
    height: 100%;
    .container{
      margin: 2rem 7rem;
    }
  }
</style>
