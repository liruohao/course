<template>
  <div class="newOrder">
    <div class="main_hd course_container">
      <div class="part_hd address_hd">
        <div class="title">收货信息</div>
        <div class="address_con">
          <p class="user-mes-wrap">
            <span class="user-nickname">{{information.receiver}}</span>
            <span class="user-tel">{{information.teleNumber}}</span>
            <span id="user-address" class="address-common-text user-address" title="">{{information.address}}</span>
          </p>
          <div class="address-action-box show">
            <p id="add-new-address" class="add-new-address show" @click="add">新增收货地址</p>
            <span data-id="" id="modify-address" class="modify-address" @click="select">修改地址</span>
            <span id="change-address" class="change-address ">切换地址</span>
          </div>
        </div>
      </div>

      <div class="part_hd commodity_hd">
        <div class="title">商品信息</div>
        <div class="commodity_con">
          <div class="commodity_item j-commodity-item" data-id="3984" data-count="1">
            <div class="commodity_name">{{courseList.cname}}
            </div>
            <div class="clearfix">
              <div class="float_left">
                <div class="commodity_num">x 1</div>
              </div>
              <div class="float_right">
                <div class="commodity_money"><span>RMB</span>{{courseList.coursePrise}}</div>
              </div>
            </div>
          </div>
          <div class="commodity_total">
            合计：1件商品，共计 {{courseList.coursePrise}} 元
          </div>
        </div>
      </div>

      <div class="part_hd cost_hd">
        <div class="title">费用明细</div>
        <div class="cost_con">
          <div class="cost_item"><span class="cost_label">商品总金额：</span><span class="cost_value">{{courseList.coursePrise}}</span><span class="cost_rmb">元</span></div>
          <!---->
          <div class="cost_item">
            <span class="cost_label">实付总金额：</span>
            <span class="cost_value">
              <span class="j-cost-practical-amount needUnit">
                <em>{{courseList.coursePrise}}</em>
              </span>
            </span>
            <span class="cost_rmb">元</span>
          </div>
        </div>
      </div>
    </div>
    <div class="buy_hd" id="foot_bottom" style="position: relative;">
      <div class="buy_con course_container clearfix">
        <div class="buy_btn float_right" id="j-buy-btn" @click="payResult">
          提交订单
        </div>
        <div class="buy_intro float_right">
          <div class="price_intro">
            <span class="label">实付：</span>
            <span class="price_unit">RMB</span>

            <span class="price_value j-cost-practical-amount">
                                    <em>{{courseList.coursePrise}}</em>
                    </span>
          </div>
        </div>
      </div>
    </div>
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
      <Table :columns="userColumns" :data="userList" border ref="selection" @on-selection-change="handleRowChange" v-if="this.usersType === '2'"></Table>
      <div class="demo-drawer-footer">
        <Button @click="closeDrawer">取消</Button>
        <Button type="primary" @click="saveUserInfo('userVO')">提交</Button>
    </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'newOrder',
  data () {
    return {
      information: {
        address: '',
        teleNumber: '',
        receiver: ''
      },
      courseList: [],
      clickUserList: [],
      exportModelFlag: false,
      modelTitle: '',
      usersType: '',
      userVO: {
        address: '',
        teleNumber: '',
        receiver: ''
      },
      userColumns: [
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
        }
      ],
      userList: [],
      userVOFormRules: {
        teleNumber: [{required: true, type: 'string', validator: this.checkMobilePhone, trigger: 'blur'}],
        receiver: [{required: true, message: '收货人不能为空', trigger: 'blur'}],
        address: [{required: true, message: '地址不能为空', trigger: 'blur'}]
      }
    }
  },
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
    // 表格复选框点击
    handleRowChange (selection) {
      this.clickUserList = selection
    },
    add () {
      this.usersType = '1'
      this.$refs['userVO'].resetFields()
      this.modelTitle = '新增收货地址'
      this.exportModelFlag = true
    },
    select () {
      this.usersType = '2'
      this.modelTitle = '修改收货地址'
      this.exportModelFlag = true
      this.getAddressByList()
    },
    closeDrawer () {
      this.$refs['userVO'].resetFields()
      this.exportModelFlag = false
    },
    saveUserInfo (name) {
      if (this.usersType === '1') {
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
                  this.information = res.data
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
        })
      } else {
        if (this.clickUserList.length === 0) {
          return this.$Message.warning('请选收货地址')
        } else if (this.clickUserList.length > 1) {
          return this.$Message.warning('最多选择一条')
        }
        console.log(this.clickUserList)
        this.information = this.clickUserList[0]
        this.exportModelFlag = false
        this.$Message.success('修改成功')
      }
    },
    getAddressByList () {
      this.$http.get('sys-user-address/getAddressByList', {
        userId: JSON.parse(sessionStorage.getItem('user')).id
      }, res => {
        this.userList = res.data
        if (res.data.length !== 0) {
          this.information = res.data[0]
        }
      })
    },
    payResult () {
      if (this.information.address === '') {
        return this.$Message.warning('请先添加地址')
      } else {
        let obj = {
          detailsId: JSON.parse(this.$route.query.row).id,
          userId: JSON.parse(sessionStorage.getItem('user')).id,
          purAddress: this.information.address,
          purUser: this.information.receiver,
          purTel: this.information.teleNumber
        }
        this.$http.postData('course-purchase/addCoursePurchase', obj, res => {
          if (res.code === 'M0000') {
            this.$router.push('/home')
            this.$Message.success('购买成功')
          }
        })
      }
    }
  },
  components: {},
  props: {},
  computed: {},
  watch: {},
  mounted () {
    this.getAddressByList()
    this.courseList = JSON.parse(this.$route.query.row)
  }
}
</script>

<style lang="less">
.newOrder {
@charset "UTF-8";*{-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-tap-highlight-color:transparent}body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,textarea,button,p,blockquote,th,td{margin:0;padding:0}body{font-family:Arial,"PingFang SC","Microsoft YaHei",SimSun,sans-serif;font-size:12px;-webkit-font-smoothing:antialiased}ul,ol,dl,dt,dd,li{list-style:none}a{text-decoration:none}input[type=text],input[type=submit]{outline:0}input::-ms-clear,::-ms-reveal{display:none}input:focus::-webkit-contacts-auto-fill-button{opacity:0;pointer-events:none}.container{width:982px;margin:0 auto;z-index:1;position:relative}.course_container{width:1120px;margin:0 auto;z-index:3;position:relative;box-sizing:border-box}body.bg_grey{background-color:#f9f9f9}.font_dark{color:#333}.font_mid_grey{color:#999}.font_light_grey{color:#999}.box_sizing{box-sizing:border-box}.clearfix:before,.clearfix:after{display:table;content:""}.clearfix:after{clear:both}.float_left{float:left}.float_right{float:right}#j_top_bar.fixed{width:100%;position:fixed;z-index:99999}#nav_head{background:#fff;height:80px;width:100%;margin-bottom:0;z-index:15;position:relative;min-width:1039px}.nav_head_con{height:100%;margin:0 auto;position:relative;background:#fff;border-bottom:1px solid #e2e2e4}#logo{display:inline-block;height:80px;width:116px;margin:0;vertical-align:middle}.nav_head_logo{width:116px;height:80px;padding:15px 0;display:inline-block;box-sizing:border-box}.nav_head_logo_img{width:116px}.nav_head_con .nav_activity{position:absolute;bottom:0;left:140px;line-height:0}.openday{position:absolute;top:5px;left:169px;width:354px;height:66px;display:inline-block}.openday img{width:354px;height:66px}.nav_head_course{font-size:14px;box-sizing:border-box;margin:0 auto;height:100%;display:inline-block;position:relative}.course_list{height:80px;line-height:80px;display:inline-block;margin-right:13px}.course_list li{height:80px;float:left;position:relative;text-align:center;box-sizing:border-box}.course_list a{padding:0 20px;color:#000;display:inherit;transition:all .3s ease}.head_nav_hint_line{position:absolute;bottom:0;left:0;width:100%;height:0}.nav_curr .head_nav_hint_line{height:4px;background-color:#f5d220;border-radius:2px}.nav_curr a{color:#f5d220;font-weight:500;position:relative;z-index:1}.my_hover a{color:#f5d220;font-weight:500}.head_nav_item.my a{font-size:12px;color:#666;padding-right:30px}.head_nav_item.my .myc_split_icon{position:absolute;height:12px;width:0;border-right:#ccc 1px solid;top:33px;right:-1px}.head_nav_item a:hover{color:#f5d220;font-weight:500}.nav_head_login{font-size:15px;color:#000;cursor:pointer;padding-right:20px;display:inline-block;height:100%;transition:all .3s ease}.not_login{line-height:80px}.nav_head_login_box{position:relative;color:#666;font-size:12px}.nav_head_login a{font-size:12px;color:#666;transition:all 150ms ease}.nav_head_login a:hover{color:#f5d220}.has_logged_on a{position:relative;display:inline-block;line-height:80px;height:80px;width:100%}.has_logged_on a span{max-width:60px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;display:inline-block;text-align:right}.head_hint_setpwd{width:6px;height:6px;border-radius:25px;background-color:#ec3c3c;position:absolute;right:0;top:31px}.myc_drop_down_icon,.nav_head_login .drop_down{position:absolute;top:37px;right:14px;border:#ccc 0 solid;border-top-width:5px;border-left:transparent 4px solid;border-right:transparent 4px solid}.my_hover .myc_drop_down_icon,.nav_curr .myc_drop_down_icon,.nav_head_login a:hover .drop_down{border-top-color:#f5d220}.drop_down{position:absolute;top:35px;right:7px}.nav_head_login .drop_down{right:-16px}.hn_xia{content:'';position:absolute;width:7px;height:7px;box-sizing:border-box;display:inline-block;border-top:1px solid #000;border-left:1px solid #000;-webkit-transform:rotate(-135deg);-moz-transform:rotate(-135deg);-ms-transform:rotate(-135deg);-o-transform:rotate(-135deg);transform:rotate(-135deg)}.has_logged_on_click{height:80px;box-sizing:border-box}.has_logged_on_click a,.has_logged_on_hover a.head_user_center{color:#f5d220;font-weight:500}.has_logged_on_click .hn_xia,.has_logged_on_hover .hn_xia{border-top:1px solid #f5d220;border-left:1px solid #f5d220}.user_center_slide_down_menu{position:absolute;top:80px;left:-39px;border:1px solid rgba(0,0,0,.07);background-color:#fff;padding:6px 0;border-radius:4px;width:140px;text-align:center;display:none}.user_center_slide_down_menu li{height:48px;line-height:48px;font-size:14px;box-sizing:border-box}.user_center_slide_down_menu li a{width:100%;height:100%;display:inline-block;box-sizing:border-box;position:relative}.head_sethint_setpwd{width:6px;height:6px;border-radius:25px;background-color:#ec3c3c;position:absolute;right:39px;top:14px}.mycourse_slide_down_menu{width:140px;position:absolute;top:80px;right:8px;border:1px solid rgba(0,0,0,.07);background-color:#fff;padding:6px 0;border-radius:4px}.mycourse_slide_down_menu li{width:118px;height:48px;line-height:48px;font-size:14px;position:relative;padding-left:42px;box-sizing:border-box}.mycourse_slide_down_menu li a{position:absolute;top:0;left:0;width:100%;height:100%;display:inline-block;padding-left:43px;color:#493a4f;box-sizing:border-box;-webkit-transition:all 150ms ease;-moz-transition:all 150ms ease;-o-transition:all 150ms ease;transition:all 150ms ease}.mycourse_slide_down_menu a:hover{color:#f5d220}.new_lesson_today{position:absolute;top:74%;right:0;transform:scale(0);transition:all 200ms linear}.new_lesson_today.hover{transform:scale(1);-moz-transition-timing-function:cubic-bezier(0.37,.74,.15,1.65);-o-transition-timing-function:cubic-bezier(0.37,.74,.15,1.65);-webkit-transition-timing-function:cubic-bezier(0.37,.74,.15,1.65);transition-timing-function:cubic-bezier(0.37,.74,.15,1.65)}.new_lesson_today img{width:151px}#foot_bottom{width:100%;height:60px;background:#000;z-index:4;min-width:1120px}.foot_bottom_con{margin:0 auto;display:block;line-height:60px}.foot_bottom_con a{color:rgba(255,255,255,.3);margin-left:20px}.foot_bottom_con span{display:inline-block;margin-right:10px;vertical-align:middle}.foot_bottom_con span:last-child{margin-right:0}.foot_bottom_con img{margin-right:6px}.foot_act{height:12px;margin-top:24px}.foot_act a,.foot_act .service{border-right:1px solid rgba(255,255,255,.2);display:inline-block;height:100%;line-height:12px;position:relative;padding:0 10px 0 30px;box-sizing:border-box;margin-left:10px}.foot_act .service{padding-left:24px;border:0;color:rgba(255,255,255,.3);border-right:1px solid rgba(255,255,255,.2)}.foot_act a:first-child{margin-left:0}.foot_act a:hover{color:rgba(255,255,255,.6)}.foot_act a div,.service div{width:20px;height:15px;line-height:12px;position:absolute;top:-1px;left:0}a.wechat{position:relative}a.wechat span{z-index:2}.wechat_code{position:absolute;top:-140px;left:-20px;height:130px;width:124px;transition:all .3s ease;opacity:0;visibility:hidden}a.contactus{border-right:0;padding-left:23px}div.qq{background:url(https://static.kaochong.com/base/kc-main/static/imgs/ic_bottom_service_e6fa609.png) no-repeat;opacity:.3}.hover div.qq{background:url(https://static.kaochong.com/base/kc-main/static/imgs/ic_bottom_service_e6fa609.png) no-repeat;opacity:.6}div.weibo{background:url(https://static.kaochong.com/base/kc-main/static/imgs/ic_bottom_wb_f28a5c9.png) no-repeat;opacity:.3}.hover div.weibo{background:url(https://static.kaochong.com/base/kc-main/static/imgs/ic_bottom_wb_f28a5c9.png) no-repeat;opacity:.6}div.weixin{background:url(https://static.kaochong.com/base/kc-main/static/imgs/ic_bottom_wx_026065f.png) no-repeat;opacity:.3}.hover div.weixin{background:url(https://static.kaochong.com/base/kc-main/static/imgs/ic_bottom_wx_026065f.png) no-repeat;opacity:.6}div.us{background:url(https://static.kaochong.com/base/kc-main/static/imgs/ic_bottom_user_a3a0e47.png) no-repeat;opacity:.3}.hover div.us{background:url(https://static.kaochong.com/base/kc-main/static/imgs/ic_bottom_user_a3a0e47.png) no-repeat;opacity:.6}div.joinus{background:url(https://static.kaochong.com/base/kc-main/static/imgs/ic_bottom_joinus_45c6531.png) no-repeat;opacity:.3;background-size:90%}.hover div.joinus{background:url(https://static.kaochong.com/base/kc-main/static/imgs/ic_bottom_joinus_45c6531.png) no-repeat;opacity:.6;background-size:90%}.foot_copyright{color:rgba(255,255,255,.3)}.foot_copyright a{margin-left:0}.foot_copyright a .ps-img{display:inline-block;margin-right:4px;width:20px;height:20px;background:url(https://static.kaochong.com/base/kc-main/static/imgs/police_badge_d0289dc.png) no-repeat center / contain;vertical-align:middle}.moblie_top{background-color:#13131f;height:44px;position:relative;text-align:center;z-index:2}.back_btn_hd{position:absolute;top:0;left:0}.back_btn{color:#f5d220;display:inline-block;height:44px;text-align:center;box-sizing:border-box;line-height:44px;position:relative;padding:0 10px 0 26px;font-size:14px;z-index:999999999999999}.back_btn::before{content:'';position:absolute;top:16px;left:13px;width:12px;height:12px;box-sizing:border-box;display:inline-block;border-top:2px solid #f5d220;border-left:2px solid #f5d220;-webkit-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-ms-transform:rotate(-45deg);-o-transform:rotate(-45deg);transform:rotate(-45deg)}.back_btn.touch{background-color:#555}.moblie_top_title{display:inline-block;margin:0 auto;color:#f5d220;font-size:14px;line-height:44px}.class_notes_con{width:100%;text-align:center;color:#666}.download_link_con{height:726px}.file_link{padding-bottom:48px;width:100%;text-align:center;border-bottom:1px solid #efefef}.class_notes_con h1{margin:48px 0 14px;font-size:28px;line-height:28px;font-weight:400}.class_notes_con p{font-size:18px;line-height:18px}.class_notes_con .chrome_link{margin:0 auto;margin-top:36px}.chrome_link a{width:200px;height:44px;background-color:#f5c01d;color:#fff;text-align:center;line-height:44px;border-radius:25px;box-sizing:border-box;display:inline-block;font-size:18px;position:relative;padding-left:34px}.chrome_link a:hover{background-color:#dfa404}.chrome_link a.left_link{margin-right:72px}.chrome_link a span{display:inline-block;margin-right:12px;position:absolute}.chrome_link span.pc_link{left:48px;top:12px;width:19px;height:19px;background-image:url(https://static.kaochong.com/base/kc-main/static/imgs/mycourse/pc_07084a3.png);background-repeat:no-repeat}.chrome_link span.mac_link{left:44px;top:9px;width:18px;height:20px;background-image:url(https://static.kaochong.com/base/kc-main/static/imgs/mycourse/apple_d7bb124.png);background-repeat:no-repeat}.chrome_link span.and_link{left:42px;top:10px;width:18px;height:22px;background-image:url(https://static.kaochong.com/base/kc-main/static/imgs/mycourse/android_3a857f6.png);background-repeat:no-repeat}.chrome_link span.iphone_link{left:33px;width:18px;height:20px;background-image:url(https://static.kaochong.com/base/kc-main/static/imgs/mycourse/apple_d7bb124.png);background-repeat:no-repeat;top:9px}.chrome_link span.listen_link{left:29px;width:22px;height:20px;background-image:url(https://static.kaochong.com/base/kc-main/static/imgs/mycourse/xia_b68882c.png);background-repeat:no-repeat;top:11px}.class_notes_con img{margin:0 auto;max-width:90%;display:block}.class_notes_con area{outline:0}.mo_class_notes_con{border-bottom:12px solid #efeff4;background-color:#fff;width:100%;text-align:center;padding:24px 0;color:#666}.mo_class_notes_con h1{font-size:16px;font-weight:400;line-height:16px;margin-bottom:10px}.mo_class_notes_con p{font-size:10px;margin-bottom:24px;line-height:10px}.mo_class_notes_con .mo_file_link{width:100%;padding:0 30px;box-sizing:border-box}.mo_file_link a{width:125px;height:29px;background-color:#f5c01d;text-align:center;line-height:29px;box-sizing:border-box;border-radius:20px;color:#fff;position:relative;padding-left:20px}.mo_file_link span{position:absolute}.mo_file_link span.mo_iphone_link{width:14px;height:17px;top:4px;left:15px;background-image:url(https://static.kaochong.com/base/kc-main/static/imgs/mycourse/apple_d7bb124.png);background-repeat:no-repeat;background-size:cover}.mo_file_link span.mo_and_link{width:15px;height:17px;top:5px;left:21px;background-image:url(https://static.kaochong.com/base/kc-main/static/imgs/mycourse/android_3a857f6.png);background-repeat:no-repeat;background-size:cover}.mo_file_link span.mo_down_link{width:15px;height:14px;top:6px;left:15px;background-image:url(https://static.kaochong.com/base/kc-main/static/imgs/mycourse/xia_b68882c.png);background-repeat:no-repeat;background-size:cover}.cet_top_nav_m{background-color:#fff;border-bottom:1px solid #eee}.cet_m_container{padding:0 10px}.cet_m_logo{background-image:url(//xuanke-avatar-qd.oss-cn-qingdao.aliyuncs.com/kc_logo.png);background-repeat:no-repeat;background-size:contain;display:inline-block;line-height:44px;width:81px;height:44px;background-position:0 9px}.cet_m_logo.touch{background-color:#eee}.cet_m_nav_right{float:right}.cet_m_book{display:inline-block;line-height:44px;width:48px;height:44px;margin:0 7px;color:#4b3c56}.cet_m_person{display:inline-block;line-height:44px;width:48px;height:44px;margin:0 7px;color:#4b3c56}.public_mirror{position:fixed;top:0;left:0;right:0;width:100%;height:100%;background-color:rgba(0,0,0,.6);z-index:99}.code_pic{position:fixed;top:0;left:0;right:0;bottom:0;z-index:99}.code_pic_hd{width:86%;height:auto;position:relative;border-radius:10px;background-color:#fff;z-index:100;text-align:center;margin:110px auto 0;padding:35px 0 50px;box-sizing:border-box}.code_pic_title{color:#000;font-size:12px;line-height:22px;margin-bottom:25px}.code_pic_main_hd{width:230px;margin:0 auto}.code_pic_text_box{width:100%;height:36px;background:#f8f8f8;border-radius:18px;border:0;color:#aaa;margin-bottom:15px;padding-left:15px}.code_pic_btn_hd{width:100%;margin:0 auto 30px}.code_pic_wrap{position:relative;width:115px;line-height:30px;float:left;height:30px;margin-right:5px}.code_pic_img{width:116px;height:30px}.cantsee_btn{float:left;line-height:30px;color:#666;font-size:10px}.cantsee_btn.touch{background-color:#eee}.code_pic_ok_btn{display:inline-block;width:230px;height:36px;line-height:36px;font-size:12px;color:#000;background-color:#f5d220;border-radius:25px}.code_pic_wrong{text-align:left;color:#ec3c3c;position:absolute;bottom:28px;left:35px;display:none}.code_pic_close{position:absolute;top:15px;right:15px;width:10px;height:10px}#countdown_explain{position:fixed;top:0;left:0;width:100%;height:100%;text-align:center;z-index:110;display:none}#countdown_explain .explain_vertical{display:inline-block;height:100%;vertical-align:middle}#countdown_explain .explain{vertical-align:text-bottom;width:252px;border:1px solid #efeff4;display:inline-block;background:#fff;color:#4b3c56;padding:32px 0;border-radius:10px;box-shadow:0 3px 6px #c8c8c8}#countdown_explain .mo_explain{padding:36px 0;width:276px}#countdown_explain .explain p{line-height:14px}#countdown_explain .explain_login{margin-bottom:10px}#countdown_explain .mo_explain_login{margin-bottom:14px}#countdown_explain .explain_addr{margin-bottom:16px}#countdown_explain .mo_explain_addr{margin-bottom:18px}#countdown_explain .explain_count{color:#bababa}.gototop{position:fixed;bottom:63px;margin-left:1006px;z-index:9999}.course_gototop{position:fixed;bottom:63px;margin-left:1154px;z-index:9999}.gototop_png{position:relative;width:37px;height:38px;display:inline-block;cursor:pointer;background-color:#D8D6D6;border-radius:50%}.gototop_png::before{content:'';position:absolute;top:16px;left:13px;width:12px;height:12px;box-sizing:border-box;display:inline-block;border-top:2px solid #fff;border-left:2px solid #fff;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);-o-transform:rotate(45deg);transform:rotate(45deg)}.gototop_png:hover{background-color:#888}.mo_course_nav{width:100%;box-sizing:border-box;background-color:#fff;padding:0 14px}.mo_course_nav_box{width:100%;box-sizing:border-box}.mo_course_nav_fixed{position:fixed;top:0;left:0}.mo_course_type_list{width:100%;height:36px;line-height:36px;overflow:scroll;overflow-x:hidden;overflow-y:hidden}.mo_course_type_list li{width:25%;height:100%;box-sizing:border-box;text-align:center}.mo_course_type{display:inline-block;padding:0 8px;height:100%;box-sizing:border-box;color:#4b3c56}.mo_course_type_cur{border-bottom:2px solid #72657b;font-weight:700}.mo_more_btn{width:15px;vertical-align:middle;display:inline-block}.mo_more_line{width:100%;height:2px;background-color:#ffd308;margin-bottom:3px}.mo_loading_hd{display:inline-block;padding:120px 0}.loading{float:left;margin-right:5px;width:8px;height:8px;background-color:#f5d220;border-radius:50%;-webkit-animation:loader 600ms infinite alternate;-moz-animation:loader 600ms infinite alternate;animation:loader 600ms infinite alternate}.ii{animation-delay:200ms;-moz-animation-delay:200ms;-webkit-animation-delay:200ms}.iii{animation-delay:400ms;-moz-animation-delay:400ms;-webkit-animation-delay:400ms}@-webkit-keyframes loader{0%{opacity:.5;transform:scale(1)}100%{opacity:1;transform:scale(1.2)}}@-moz-keyframes loader{0%{opacity:.5;transform:scale(1)}100%{opacity:1;transform:scale(1.2)}}@keyframes loader{0%{opacity:.5;transform:scale(1)}100%{opacity:1;transform:scale(1.2)}}.nx_hd{width:120px;height:40px;display:inline-block;position:absolute;top:22px;left:130px}.nx_img{width:100%}.pop-con{position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999}.pop-con .bg{width:100%;height:100%;background:rgba(0,0,0,.2)}.pop-con .pop-box{position:absolute;top:50%;left:50%;width:430px;height:380px;margin:-190px 0 0 -215px;background:#fff;-webkit-border-radius:20px;-moz-border-radius:20px;border-radius:20px}.pop-con .content{padding:40px;text-align:center}.pop-con .title{font-size:20px}.pop-con .message{padding:30px 0}.pop-con .operate{display:inline-block;width:320px;height:40px;line-height:40px;background:#f5d220;color:#000;font-size:14px;border-radius:20px;cursor:pointer;text-align:center}.pop-con .operate.big{width:350px}.pop-con .operate.small{width:160px}.pop-con .operate.minor,.pop-con .operate.disable{background:#f4f4f4}.pop-con .operate.disable{color:#b2b2b2}.pop-con .close{position:absolute;right:20px;top:20px;font-size:24px;line-height:14px;color:#c4c4c4!important;cursor:pointer}.mo_hint_down_hd{width:100%;height:45px;box-sizing:border-box;background:#f5d220;display:block}.guidehint{margin:6px 0 0 35px;width:163px}.guidedown{margin:10px 26px 0 0;width:64px}.weibo_hint_hd{width:100%;height:100%;background:rgba(0,0,0,.4);position:fixed;top:0;left:0;z-index:100;display:none}.weibo_hint{position:absolute;top:15px;right:25px;width:156px}.mo_header_hd{width:100%}.mo_header_hd .mo_header{width:100%;height:.88rem;line-height:.88rem;text-align:center;color:#fd0;font-size:.3rem;background:#13131f;position:relative}.mo_header_hd .mo_header .mo_back_btn{position:absolute;left:0;top:0;padding:0 .2rem;width:1rem;font-size:.3rem;text-align:right;background:url(https://static.kaochong.com/base/kc-main/static/imgs/ic_header_back_10f70ad.png) no-repeat .3rem .25rem;background-size:.2rem;color:#fd0;display:block}.mo_header_hd .mo_header .mo_logo_hd{width:1.3rem;height:.88rem;margin-left:.2rem;vertical-align:middle;display:block}.mo_header_hd .mo_header .mo_logo_hd img{width:100%;vertical-align:middle}.mo_header_hd .mo_header .mo_personal_center{padding:0 .2rem;box-sizing:border-box;position:relative}.mo_header_hd .mo_header .mo_personal_center .m_hint_setpwd{position:absolute;top:.24rem;right:.12rem;width:.12rem;height:.12rem;border-radius:.5rem;background-color:#ec3c3c}.mo_header_hd .mo_header .mo_right_btn{position:absolute;right:0;top:0;padding:0 .2rem;font-size:.3rem;color:#fd0;display:block}.mo_header_hd .mo_header a{color:#fd0}.mo_header_hd .mo_hint_down_hd{width:100%;height:.9rem;box-sizing:border-box;background:#fd0;display:block}.mo_header_hd .mo_hint_down_hd .guidehint{margin:.12rem 0 0 .7rem;width:3.26rem}.mo_header_hd .mo_hint_down_hd .guidedown{margin:.2rem .52rem 0 0;width:1.28rem}.mo_header_hd .weibo_hint_hd{width:100%;height:100%;background:rgba(0,0,0,.4);position:fixed;top:0;left:0;z-index:100;display:none}.mo_header_hd .weibo_hint_hd .weibo_hint{position:absolute;top:.3rem;right:.5rem;width:3.12rem}.mo_login_box_interval{width:100%;height:40px}.mo_login_state{background-color:#FD0;color:#13131f;width:100%;height:40px;box-sizing:border-box;line-height:40px;font-size:14px;vertical-align:middle;text-align:center;display:inline-block;position:fixed;bottom:0;left:0;right:0;z-index:100;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mo_login_state.touch{background-color:#fbd512}
  .main_hd{margin-top:20px;margin-bottom:80px;padding-bottom:10px}.hide{display:none}.payment_list{height:161px;width:100%;background:#fff;box-sizing:border-box;margin-bottom:100px;padding:30px;border-radius:3px;border:1px solid #dbdbdb}.payment_list #order_pay_load,.payment_list #order_pay_loadi{position:relative;width:100%;height:101px}.payment_list .order_pay_loading{width:40px;height:40px;position:absolute;top:50%;left:50%;transform:translate3d(-50%,-50%,0);-webkit-transform:translate3d(-50%,-50%,0);-webkit-animation:rotate .8s linear infinite}@-webkit-keyframes rotate{0%{-webkit-transform:rotate(0deg)}10%{-webkit-transform:rotate(36deg)}20%{-webkit-transform:rotate(72deg)}30%{-webkit-transform:rotate(108deg)}40%{-webkit-transform:rotate(144deg)}50%{-webkit-transform:rotate(180deg)}60%{-webkit-transform:rotate(216deg)}70%{-webkit-transform:rotate(252deg)}80%{-webkit-transform:rotate(288deg)}90%{-webkit-transform:rotate(324deg)}100%{-webkit-transform:rotate(360deg)}}.payment_list .stage_item{display:inline-block;width:260px;margin-right:20px;border-radius:4px;height:101px;border:1px solid #dbdbdb;padding:20px 31px 21px 30px;font-size:14px;box-sizing:border-box}.payment_list .stage_item .left{float:left;width:58px;height:58px;border-radius:29px;border:1px solid #dbdbdb;color:#000;font-size:14px;line-height:58px;text-align:center}.payment_list .stage_item .left .left_count{color:#ff4c4c;font-size:30px}.payment_list .stage_item .right{float:left;padding-left:12px}.payment_list .stage_item .right .right_title{margin-bottom:10px;color:#323232;height:14px;line-height:14px}.payment_list .stage_item .right .right_money{color:#323232;height:14px;line-height:14px;margin-bottom:10px}.payment_list .stage_item .right .right_money span{color:#FF4C4C}.payment_list .stage_item .right .right_sev{height:14px;line-height:14px;font-size:12px;color:#6d6d6d}.payment_list .stage_curr{border:1px solid #f5d220;position:relative}.payment_list .stage_curr i{position:absolute;width:18px;height:18px;bottom:0;right:0;background:url(https://static.kaochong.com/base/kc-main/static/imgs/stage_curr_2e4321a.png) no-repeat;background-size:100% 100%}.part_hd{width:100%;margin-bottom:10px;padding:0 48px 40px;background:#FFF;border:1px solid #DBDBDB;border-radius:4px;box-sizing:border-box}.part_hd .title{font-size:20px;color:#000;letter-spacing:0;line-height:20px;border-left:4px solid #fcd100;padding-left:10px;margin:35px 0 37px -18px;height:20px}.part_hd .title .title-des{font-size:14px;color:#6d6d6d;margin-top:10px;line-height:12px;height:12px}.part_hd .discount_line{display:block;width:100%;height:1px;background-color:#eee;transform:translateX(-20px);-webkit-transform:translateX(-20px);-ms-transform:translateX(-20px)}.address_hd{position:relative;padding:40px 0 40px 30px}.address_hd .title{margin:0 0 32px}.address_hd .address_con{padding-left:44px}.address_hd .address_con .user-mes-wrap{line-height:1;margin-bottom:25px;font-size:14px}.address_hd .address_con .user-mes-wrap span{margin-right:20px}.address_hd .address_con .user-mes-wrap span.user-address{color:#6E6E6E;max-width:600px;display:inline-block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;vertical-align:bottom}.address_hd .address_con .user-mes-wrap span.add-user-address{color:#5791FF;cursor:pointer}.address_hd .address_con .address-time-part{font-size:14px}.address_hd .address_con .address-time-part .label{color:#6E6E6E}.address_hd .address_con .address-time-part .input_hd{margin-left:14px;display:inline-block;vertical-align:center}.address_hd .address_con .address-time-part .input_hd .address-time-select{width:300px;height:30px;color:#999;border:1px solid #DBDBDB;background-color:#fff;outline:0}.address_hd .address_con .address-time-part .address-time-tips{font-size:12px;color:#A8A8A8;margin-top:8px;line-height:1;padding-left:74px}.address_hd .address_con .address-time-part .address-time-tips.red{color:#FF161D}.address_hd .address_con .address-action-box{position:absolute;top:30px;right:48px;font-size:14px;color:#5791FF;text-align:right;display:none}.address_hd .address_con .address-action-box.show{display:block}.address_hd .address_con .address-action-box .add-new-address{line-height:1;margin-bottom:46px;cursor:pointer;opacity:0}.address_hd .address_con .address-action-box .add-new-address.show{opacity:1}.address_hd .address_con .address-action-box span{cursor:pointer;margin-left:20px}.address_hd .address_con .address-action-box span:first-child{margin-left:0}.address_hd .address_con .address-action-box .change-address{display:none}.address_hd .address_con .address-action-box .change-address.show{display:inline}.commodity_hd .commodity_con{width:100%;border:1px solid #DBDBDB;border-radius:2px;padding:0 30px;box-sizing:border-box}.commodity_hd .commodity_con .commodity_item{border-bottom:1px solid #DBDBDB;padding:30px 0}.commodity_hd .commodity_con .commodity_item .commodity_name{font-size:14px;color:#000;margin-bottom:12px}.commodity_hd .commodity_con .commodity_item .commodity_num{font-size:14px;color:#999}.commodity_hd .commodity_con .commodity_item .commodity_money{font-size:14px;color:#000}.commodity_hd .commodity_con .commodity_item .commodity_money span{font-size:10px;margin-right:4px}.commodity_hd .commodity_con .commodity_total{width:100%;height:58px;line-height:58px;font-size:14px;color:#999;text-align:right}.coupon_hd{padding-bottom:10px}.coupon_hd .no_coupon_hint{font-size:16px;color:#999;margin-left:20px}.coupon_hd .coupon_hint{font-size:12px;color:#FF6B16;margin-left:10px}.coupon_hd .coupon_hint em{font-style:normal}.coupon_hd .coupon_con{width:100%;box-sizing:border-box;height:120px;padding-top:4px;overflow-y:scroll;margin-bottom:30px}.coupon_hd .coupon_con .coupon_item{width:345px;height:103px;background-image:url(https://static.kaochong.com/base/kc-main/static/imgs/bg_orderdetail_preferential_juan_afdabf8.png);background-repeat:no-repeat;background-size:cover;margin-bottom:7px;display:inline-block;box-shadow:0 2px 8px 0 rgba(200,198,196,.3);border-radius:5px;margin-right:16px;cursor:pointer}.coupon_hd .coupon_con .coupon_item .coupon_price{width:112px;text-align:center;line-height:103px;font-size:36px;color:#fff}.coupon_hd .coupon_con .coupon_item .coupon_price .unit{font-size:24px}.coupon_hd .coupon_con .coupon_item .coupon_intro{width:200px;height:103px;box-sizing:border-box;margin-left:15px}.coupon_hd .coupon_con .coupon_item .coupon_intro .coupon_top{border-bottom:2px solid #ECECEC;padding:17px 0 10px;position:relative}.coupon_hd .coupon_con .coupon_item .coupon_intro .coupon_top .coupon_title{font-size:14px;color:#323232;line-height:16px;margin-bottom:8px}.coupon_hd .coupon_con .coupon_item .coupon_intro .coupon_top .coupon_expire{font-size:12px;color:#FF4C4C;line-height:16px}.coupon_hd .coupon_con .coupon_item .coupon_intro .coupon_top .coupon_time{font-size:12px;color:#A8A8A8;line-height:16px}.coupon_hd .coupon_con .coupon_item .coupon_intro .coupon_top .red{color:#FF4C4C}.coupon_hd .coupon_con .coupon_item .coupon_intro .coupon_top .coupon_select{width:15px;height:15px;border-radius:50%;border:1px solid #ececec;position:absolute;top:32.5px;right:0}.coupon_hd .coupon_con .coupon_item .coupon_intro .coupon_bottom{vertical-align:middle;display:table-cell;height:37.5px}.coupon_hd .coupon_con .coupon_item .coupon_intro .coupon_bottom .coupon_scope{width:200px;font-size:10px;color:#CCC;line-height:14px}.coupon_hd .coupon_con .selected .coupon_select{background-image:url(https://static.kaochong.com/base/kc-main/static/imgs/bg_mylesson_group_learned_c1256dc.png);background-size:cover;background-repeat:no-repeat}.cost_hd .cost_con{width:100%;box-sizing:border-box}.cost_hd .cost_con .cost_item{color:#6E6E6E;line-height:30px;font-size:0}.cost_hd .cost_con .cost_item .common-cost{display:inline-block;width:85px;font-size:14px;text-align:right}.cost_hd .cost_con .cost_item .cost_label{display:inline-block;width:85px;font-size:14px;text-align:right}.cost_hd .cost_con .cost_item .cost_label i{font-style:normal}.cost_hd .cost_con .cost_item .cost_value{display:inline-block;width:85px;font-size:14px;text-align:right;width:59px}.cost_hd .cost_con .cost_item .cost_value .cost_rmb{font-size:14px}.cost_hd .cost_con .cost_item .cost_value .j-cost-practical-amount.needUnit em{font-style:normal}.cost_hd .cost_con .cost_item .cost_rmb{font-size:14px}.pay_hd .part_hint{font-size:20px;color:#000;letter-spacing:0;text-align:right;line-height:30px}.pay_hd .part_hint .label{font-size:14px;color:#6E6E6E}.pay_hd .part_hint .unit{font-size:14px;margin-right:4px}.pay_hd .pay_con{width:100%;border-top:1px solid #dbdbdb;padding-top:61px}.pay_hd .pay_con .pay_item{width:70px;margin-right:120px;display:inline-block;position:relative;cursor:pointer;box-sizing:border-box;vertical-align:top}.pay_hd .pay_con .pay_item .hint{position:absolute;top:0;right:-78px;background:#F33730;border-radius:9px;color:#fff;height:18px;line-height:18px;padding:0 7px;box-sizing:border-box}.pay_hd .pay_con .pay_item .zhifubao_hint{background:#1AACEB}.pay_hd .pay_con .pay_item .pay_img{width:70px;height:70px;background-repeat:no-repeat;background-size:cover;border-radius:50%;margin-bottom:19px;opacity:1}.pay_hd .pay_con .pay_item .zhifubao{background-image:url(https://static.kaochong.com/base/kc-main/static/imgs/ic_paytype_zhifubao_3f9960e.png)}.pay_hd .pay_con .pay_item .weixin{background-image:url(https://static.kaochong.com/base/kc-main/static/imgs/ic_paytype_wechat_d9a467a.png)}.pay_hd .pay_con .pay_item .creditpay{background-image:url(https://static.kaochong.com/base/kc-main/static/imgs/ic_payment_credit_8c3b1ac.png)}.pay_hd .pay_con .pay_item .baitiao{background-image:url(https://static.kaochong.com/base/kc-main/static/imgs/ic_payment_baitiao_a4c56aa.png)}.pay_hd .pay_con .pay_item .jingdong{background-image:url(https://static.kaochong.com/base/kc-main/static/imgs/ic_pay_jingdong_5d0e249.png)}.pay_hd .pay_con .pay_item .pay_name{font-size:12px;color:#313131;margin-bottom:10px;width:100%;text-align:center}.pay_hd .pay_con .pay_item .pay_state{width:16px;height:16px;border-radius:50%;border:1px solid #e5e5e5;display:flex;justify-content:center;align-items:center;text-align:center;margin:0 auto;box-sizing:border-box}.pay_hd .pay_con .curr .pay_state{border:1px solid #fcd100}.pay_hd .pay_con .curr .pay_state i{width:8px;height:8px;background:#fcd100;border-radius:50%}.buy_hd{position:fixed!important;bottom:0;width:100%;min-width:1120px;height:80px!important;box-sizing:border-box;background:#f5d220!important;z-index:10!important}.buy_hd .buy_con{height:100%}.buy_hd .buy_con .buy_btn{background:#F3493A;width:220px;height:80px;line-height:80px;text-align:center;font-size:28px;color:#FFF;cursor:pointer}.buy_hd .buy_con .buy_intro{margin-right:20px;display:inline-block;text-align:right;height:100%;display:flex;flex-direction:column;justify-content:center}.buy_hd .buy_con .buy_intro .price_intro{line-height:30px}.buy_hd .buy_con .buy_intro .price_intro .label{font-size:20px;color:#6E6E6E;margin-right:4px}.buy_hd .buy_con .buy_intro .price_intro .price_unit{font-size:18px;color:#F3493A;margin-right:6px}.buy_hd .buy_con .buy_intro .price_intro .price_value{font-size:32px;color:#F3493A}.buy_hd .buy_con .buy_intro .price_intro .price_value.j-cost-practical-amount em{font-style:normal}.buy_hd .buy_con .buy_intro .coupon_intro{font-size:14px;color:#6E6E6E}.pay_result_hd{width:100%;height:100%;position:fixed;top:0;left:0;z-index:16;display:flex;justify-content:center;align-items:center;text-align:center;display:none}.pay_result_hd .pay_result_con{width:520px;background:#FFF;border-radius:16px;position:relative;z-index:17;padding:50px 0;box-sizing:border-box;display:none}.pay_result_hd .pay_result_con .img_con{width:96px;height:96px;display:block;margin:0 auto 30px}.pay_result_hd .pay_result_con .word{font-size:16px;color:#333;letter-spacing:0;text-align:center;line-height:20px;width:100%}.pay_result_hd .pay_result_con .hint{width:100%;text-align:center;font-size:12px;color:#999;margin-top:8px}.pay_result_hd .pay_result_con .btn_con{padding-top:37px;text-align:center}.pay_result_hd .pay_result_con .btn_con .btn{width:160px;height:40px;text-align:center;line-height:40px;background:#f5d121;border-radius:19.5px;display:inline-block;cursor:pointer}.pay_result_hd .pay_result_con .btn_con .btn_fail{margin-right:20px}.pay_result_hd .result_con{width:400px}.toast_hd{font-size:14px;color:#fff;width:100%;position:fixed;bottom:100px;left:0;right:0;z-index:20;text-align:center;display:none}.toast_hd .toast_con{padding:10px 15px;background:rgba(0,0,0,.3);border-radius:8px;display:inline-block}.shade{display:inline-block;position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.4)}.marleft18{margin-left:18px}select::-ms-expand{display:none}.address-btn{font-size:14px;text-align:center;padding:13px 25px;line-height:1;border:0;outline:0}.address-btn.btn-yellow{background-color:#F4D120;color:#000}.address-btn.btn-gray{background-color:#eee}.address-btn.btn-gray .btn-icon-plus::before,.address-btn.btn-gray .btn-icon-plus::after{background-color:#ccc}.address-btn.btn-disabled{color:#ccc;cursor:not-allowed}.address-btn.btn-long{padding:10px 51px}.address-btn.btn-radius{border-radius:20px}.address-btn.btn-radius-small{border-radius:4px}.address-btn .btn-icon-plus{height:14px;width:14px;display:inline-block;vertical-align:bottom;margin-right:5px;position:relative}.address-btn .btn-icon-plus .icon-common{content:'';position:absolute;border-radius:1px}.address-btn .btn-icon-plus::before{content:'';position:absolute;border-radius:1px;width:2px;height:100%;left:50%;background-color:#000;transform:translateX(-50%);-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%)}.address-btn .btn-icon-plus::after{content:'';position:absolute;border-radius:1px;width:100%;height:2px;left:0;top:50%;background-color:#000;transform:translateY(-50%);-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%)}.ad-order-box{position:fixed;top:0;right:0;bottom:0;left:0;z-index:199;background-color:rgba(0,0,0,.4);display:none}.ad-order-box .ad-order-content{width:670px;box-sizing:border-box;padding:30px;position:absolute;border-radius:16px;background-color:#fff;top:50%;left:50%;transform:translate3d(-50%,-50%,0);-webkit-transform:translate3d(-50%,-50%,0);-ms-transform:translate3d(-50%,-50%,0)}.ad-order-box .ad-order-content .ad-order-fixed-area{position:relative;width:610px}.ad-order-box .ad-order-content .ad-order-fixed-area .ad-order-close{position:absolute;height:14px;width:14px;top:0;right:0;transform:rotate(45deg);-webkit-transform:rotate(45deg);-ms-transform:rotate(45deg);cursor:pointer}.ad-order-box .ad-order-content .ad-order-fixed-area .ad-order-close .close-icon-common{content:'';position:absolute;border-radius:1px;background-color:#ccc}.ad-order-box .ad-order-content .ad-order-fixed-area .ad-order-close::before{content:'';position:absolute;border-radius:1px;background-color:#ccc;width:2px;height:18px;top:0;left:9px;transform:translateX(-50%);-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%)}.ad-order-box .ad-order-content .ad-order-fixed-area .ad-order-close::after{content:'';position:absolute;border-radius:1px;background-color:#ccc;width:18px;height:2px;top:9px;left:0;transform:translateY(-50%);-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%)}.ad-order-box .ad-order-content .ad-order-fixed-area .ad-order-title{font-size:20px;color:#313131}.ad-order-box .ad-order-content .ad-order-fixed-area .ad-order-line{width:100%;height:1px;background-color:#E2E2E2;margin:25px 0 30px}.ad-order-box .ad-order-content .ad-order-list-wrap{font-size:14px;max-height:294px;overflow-y:scroll;box-shadow:0 0 3px #eee}.ad-order-box .ad-order-content .ad-order-list-wrap::-webkit-scrollbar{width:0}.ad-order-box .ad-order-content .ad-order-list-wrap .ad-list{padding:19px 0 19px 40px;border:1px solid #DBDBDB;border-radius:4px;margin-bottom:10px;position:relative;font-size:14px;cursor:pointer}.ad-order-box .ad-order-content .ad-order-list-wrap .ad-list:last-child{margin-bottom:0}.ad-order-box .ad-order-content .ad-order-list-wrap .ad-list .list-item{line-height:34px}.ad-order-box .ad-order-content .ad-order-list-wrap .ad-list .list-item .item-label{display:inline-block;color:#6E6E6E;min-width:70px;text-align:right}.ad-order-box .ad-order-content .ad-order-list-wrap .ad-list .list-item .item-content{max-width:350px;display:inline-block;vertical-align:top}.ad-order-box .ad-order-content .ad-order-list-wrap .ad-list .address-status{position:absolute;top:30px;right:30px;font-size:14px;color:#11DD5D;border:1px solid #11DD5D;padding:3px 10px;border-radius:4px;transition:.3s all ease-in-out;-webkit-transition:.3s all ease-in-out;display:none}.ad-order-box .ad-order-content .ad-order-list-wrap .ad-list .address-status.show{display:block;background-color:rgba(17,221,93,.05)}.ad-order-box .ad-order-content .ad-order-list-wrap .select-order-option{background-color:rgba(245,210,32,.05);border:1px solid #F5D220;cursor:auto}.ad-order-box .ad-order-content .ad-order-list-wrap .select-order-option .common-pseudo{content:'';position:absolute;right:0;bottom:0}.ad-order-box .ad-order-content .ad-order-list-wrap .select-order-option::before{content:'';position:absolute;right:0;bottom:0;height:15px;width:15px;background-color:#F5D220;border-top-left-radius:100%}.ad-order-box .ad-order-content .ad-order-list-wrap .select-order-option::after{content:'';position:absolute;right:0;bottom:0;height:7px;width:3px;border-radius:0 1px 2px;border-right:2px solid #323232;border-bottom:2px solid #323232;transform:translate3d(-3px,-2px,0) rotate(36deg);-webkit-transform:translate3d(-3px,-2px,0) rotate(36deg);-ms-transform:translate3d(-3px,-2px,0) rotate(36deg)}.ad-order-box .ad-order-content .ad-order-action{float:right;margin-top:30px}.ad-order-box .ad-order-content .ad-order-action button{padding:13px 51px}.ad-order-box .ad-order-content button{margin-right:20px}.ad-order-box .ad-order-content button:last-child{margin-right:0}
}
</style>
