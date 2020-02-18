<template>
    <div class="login">
      <div class="login-form" @keyup.enter="signin">
      <div class="login-form-title">{{loginTitle}}</div>
      <div class="login-form-wrapper">
        <div class="login-form-content">
          <div class="login-form-select" v-if="loginFlag === '0'">
            <Select v-model="role" placeholder="请选择您的角色">
              <Option v-for="item in roleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="login-form-input">
            <Input v-model="username" :placeholder="loginFlag === '0' ? '账号': '请输入账号'" :maxlength="20" clearable/>
          </div>
          <div class="login-form-input" v-if="loginFlag === '1'">
            <Input v-model="uname" placeholder="请输入用户名" :maxlength="20" clearable />
          </div>
          <div class="login-form-input">
            <Input v-model="password" type="password" placeholder="请输入密码" :maxlength="30" clearable onkeydown="if(event.keyCode==32) return false"/>
          </div>
          <div class="login-form-input phone" v-if="loginFlag === '1'">
            <Input v-model="phone"  placeholder="请输入手机号" :maxlength="11" clearable onkeydown="if(event.keyCode==32) return false"/>
          </div>
          <div class="login-form-control">
            <span @click="registerClick(1)" title="点我注册" v-if="loginFlag === '0'">还没注册</span>
            <span  v-if="loginFlag === '1'"></span>
            <span @click="registerClick(0)" title="点我登录"  v-if="loginFlag === '1'">已有账号</span>
            <span @click="contactManager" v-if="loginFlag === '0'"><Icon type="md-help-circle" :size="15" title="还没注册?"/>忘记密码</span>
          </div>
          <div class="login-form-submit" @click="signin">{{loginFlag === '0' ? '登&nbsp;&nbsp;&nbsp;&nbsp;录': '注&nbsp;&nbsp;&nbsp;&nbsp;册'}}</div>
        </div>
      </div>
    </div>
    </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      loginTitle: '欢迎登陆考研帮',
      loginFlag: '0', // 0为登录 1未注册
      isRemember: false,
      username: '',
      password: '',
      role: '',
      uname: '',
      phone: '',
      roleList: [
        {
          label: '老师',
          value: '0'
        },
        {
          label: '学生',
          value: '1'
        },
        {
          label: '管理员',
          value: '2'
        }
      ]
    }
  },
  methods: {
    signin () {
      if (this.username === '') {
        this.$Message.warning('账号不能为空')
        return false
      }
      if (this.password === '') {
        this.$Message.warning('密码不能为空')
        return false
      }
      if (this.password !== '' && this.loginFlag === '1') {
        if (this.password.length < 6) {
          this.$Message.warning('密码不能低于6位')
          return false
        }
      }
      if (this.role === '' && this.loginFlag === '0') {
        this.$Message.warning('请选择您的角色')
        return false
      }
      if (this.phone === '' && this.loginFlag === '1') {
        this.$Message.warning('请输入手机号')
        return false
      }
      if (this.phone !== '') {
        let tel = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
        if (!this.phone.match(tel)) {
          return this.$Message.warning('手机格式不正确')
        }
      }
      if (this.loginFlag === '0') {
        let role = ''
        switch (this.role) {
          case '0':
            role = '2'
            break
          case '1':
            role = '1'
            break
          case '2':
            role = '3'
            break
        }
        this.$http.get('sys-user/login', {
          account: this.username,
          password: this.password,
          userRole: role
        }, res => {
          if (res.code === 'M0000') {
            switch (this.role) {
              case '0':
                this.$router.push('/teacher')
                break
              case '1':
                this.$router.push('/home')
                break
              case '2':
                this.$router.push('/home2')
                break
            }
            this.$Message.success('登录成功')
            sessionStorage.setItem('role', this.role)
            sessionStorage.setItem('user', JSON.stringify(res.data))
          } else {
            this.$Message.warning(res.msg)
          }
        })
      } else {
        let obj = {}
        obj.account = this.username
        obj.password = this.password
        obj.mobilePhone = this.phone
        obj.uname = this.uname
        this.$http.postData('sys-user/addUser', obj, res => {
          if (res.code === 'M0000') {
            this.$Message.success('注册成功，请登录')
          } else {
            this.$Message.warning(res.msg)
          }
        })
        this.loginFlag = '0'
      }
    },
    // 点我注册 登录
    registerClick (flag) {
      if (flag === 0) {
        this.loginTitle = '欢迎登陆考研帮'
        this.loginFlag = '0'
      } else {
        this.loginTitle = '欢迎注册考研帮'
        this.loginFlag = '1'
      }
    },
    // 忘记密码
    contactManager () {
      this.$Message.warning('请联系管理员')
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
  @import '~styles/mixins';
  @import '~styles/style';
    .login {
      height: 100%;
      background: url("~assets/imgs/login2.png") no-repeat center;
      background-size: 100% 100%;
      position: relative;
      .login-form{
        width: 26.5vw;
        height: 70vh;
        border-radius: 8px;
        background: rgba(255,255,255, .35);
        position: absolute;
        top: 45%;
        left: 80%;
        margin-top: -27.6vh;
        margin-left: -13.25vw;
        transition: box-shadow 0.3s linear;
        padding: 6.5vh 0;
        box-shadow: rgba(0,0,0,.25) 0 0 5px;
        .login-form-title{
          text-align: center;
          font-size: 30px;
          color: #FFF;
          position: relative;
          .un-select();
        }
        .login-form-wrapper{
          height: 33.8vh;
          margin-top: 25px;
          .flex();
          justify-content: center;
          .login-form-content{
            width: 22vw;
            height: 100%;
            border-top: 1px solid #FFF;
            padding-top: 4.5vh;
            .login-form-select{
              height: 6.25vh;
              margin-bottom: 14px;
              .ivu-select{
                width: 100%;
                height: 100%;
                .ivu-select-selection{
                  height: 100%;
                  border-radius: 70px;
                  background: #EEF8FA;
                  padding: 6.5px 27px 0 36px;
                }
                .ivu-select-selected-value{
                  font-size: 16px;
                }
              }
            }
            .login-form-input{
              height: 6.25vh;
              margin-bottom: 14px;
              &:nth-child(2){
                .ivu-input{
                  /*background-image: url("~assets/imgs/user.png") !important;*/
                }
              }
              &:last-child {
                margin-bottom: 0;
              }
              .ivu-input-wrapper{
                height: 100%;
                .flex();
                align-items: center;
                .ivu-input-icon{
                  right: 15px;
                }
                .ivu-input{
                  height: inherit;
                  border-radius: 70px;
                  background: #EEF8FA;
                  font-size: 16px;
                  padding: 0 25px 0 30px;
                  /*background-image: url("~assets/imgs/password.png");*/
                  background-repeat: no-repeat;
                  background-position: 18px center;
                  background-size: 18px;
                  border: 1px solid transparent;
                }
              }
            }
            .login-form-control{
              margin-top: 2.5vh;
              padding: 0 5px;
              .flex();
              justify-content: space-between;
              &>span{
                .flex();
                align-items: center;
                color: #FFF;
                /*&:hover{*/
                  /*cursor: pointer;*/
                  /*color: rgba(248,181,81,1);*/
                  /*.ivu-icon{*/
                    /*color: rgba(248,181,81,1);*/
                  /*}*/
                /*}*/
                &:first-child{
                  justify-content: flex-start;
                  cursor: pointer;
                }
                &:last-child{
                  cursor: pointer;
                  justify-content: flex-end;
                }
                &.isRemember{
                  color: rgba(248,181,81,1) !important;
                }
              }
            }
            .login-form-submit{
              height: 5.5vh;
              line-height: 5.5vh;
              border-radius: 70px;
              text-align: center;
              background: rgba(248,181,81,1);
              color: #FFF;
              font-size: 20px;
              margin-top: 2.2vh;
              position: relative;
              &::before{
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 70px;
                background: rgba(255,255,255,.25);
                display: none;
              }
              &:hover{
                cursor: pointer;
                &::before{
                  display: block;
                }
              }
            }
          }
        }
      }
    }

</style>
