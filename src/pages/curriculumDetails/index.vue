<template>
    <div class="curriculumDetails">
      <div class="detail_intro_pc">
        <div class="course_container clearfix">
          <div class="detail_intro_left detail_intro_left_video">
            <div class="lesson_bgpic" style="background-image: url(http://kc-base.oss-cn-beijing.aliyuncs.com/course/item/wxMi3zKRkXYQfx3.png)"> </div>
            <input type="hidden" value="">
          </div>

          <div class="detail_intro_right">
            <div class="detail_title_hd">{{courseList.cname}}
            </div>
            <div class="detail_time_hd font_mid_grey">
              <span>开课时间:</span>
              <span class="detail_time">
                {{courseList.classTime}}
                    </span>
            </div>
            <div class="detail_price_hd ">
              <span class="rmb font_price">RMB</span>
              <span class="detail_price font_price">{{courseList.coursePrise}}</span>
            </div>
            <div class="detail_btn_hd">
              <a href="javascript:;" id="j-buy" class="j_btn_control btn_normal_orange btn_common" @click="buyClass">立即抢购</a>
            </div>
            <div class="detail_quota_cd_hd">
                    <span class="quota_hd font_mid_grey">
                      购买人数: <em>{{getPurchaseCount}}人</em>
                    </span>
              <span id="j-cd" class="cd_hd font_mid_grey">
                <div id="j-sellEnd-time" data-sellend="1609344000000" style="display: none"></div>
                <div id="j-sellStart-time" data-sellstart="1578240000000" style="display: none"></div>
                                <span>距离结束</span>
                            <span class="cd_red_font">{{courseList.times}}天</span>
                    </span>
            </div>
          </div>
        </div>
      </div>
      <div class="detail_intro_pc-content">
        <div class="detail_intro_pc-content-left">
          <Tabs type="card" value="name1" class="detail_intro_pc-content-card">
            <TabPane label="课题介绍" name="name1">{{courseList.remarks}}</TabPane>
            <TabPane label="课表目录" name="name2">
              <div class="course_content_section">
                <div id="catelog" class="anchor"></div>
                <div class="content_node">课程目录</div>
                <div class="lesson_catelog_hd">
                  <ul id="j-timetable" class="catelog_ul"><li>
                    <ul class="list">
                      <li v-for="(item,index) in classList" :key="index">
                        <div class="normal_wrap">
                        <span class="catelog_index cate_index_normal">{{index + 1}}</span>
                        <span class="catelog_title font_dark">{{item.menuName}}</span>
                        <span class="catelog_teacher_name font_mid_grey">{{item.teacherName}}</span>
                        <span class="catelog_livetype"></span>
                        <span class="catelog_time font_mid_grey">{{item.startTime + ' - ' + item.endTime}}</span>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              </div>
            </TabPane>
            <TabPane label="听课须知" name="name3">{{courseList.tips}}</TabPane>
            <TabPane label="学生评价" name="name4">
              <div class="comment_hd">
                <div id="comment" class="anchor"></div>
                <div class="comment_t">学生评价<em class="j-comment-num">({{getAssessList.length}})</em></div>
                <div v-for="(item,index) in getAssessList" :key="index" style="margin-bottom: 10px">
                  <div style="display: flex; line-height: 30px"><span style="font-size: 16px;font-weight: 600;margin-right: 5px">{{item.userName}}</span> {{item.createdTime}}</div>
                 <div style="display: flex; line-height: 30px">
                   <div style="margin-right: 5px">评分</div>
                   <Rate show-text allow-half disabled  v-model="item.assessLevel">
                     <span style="color: #f5a623">{{ item.assessLevel}}分</span>
                   </Rate>
                 </div>
                  <div style="display: flex; line-height: 30px">
                    <div style="margin-right: 5px">评价</div><div>{{item.content}}</div>
                  </div>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
        <div class="detail_intro_pc-content-right">
          <div class="teacher_info_wrap">
            <div class="detail_block_hd no_border_bottom" v-for="(item,index) in teacherList" :key="index">
              <div class="teacher_info_hd clearfix">
                <img src="https://s-base.kaochong.com/admin/teacher/image_0da514fd3db161dc8ec1d8cf8e1803bc.png" alt="肖睿">
                <div class="detail_teacher_info">
                  <div class="detail_teacher_name">{{item.uname}}</div>
                  <div class="detail_teacher_title font_mid_grey">{{item.mainCourse}}</div>
                </div>
              </div>
              <div class="detail_teacher_intro font_mid_grey">
                {{item.resume}}
              </div>
            </div>
            <div class="teacher_page_enter_hd">
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'curriculumDetails',
  data () {
    return {
      tabs: 2,
      courseList: {},
      classList: [],
      teacherList: [],
      getAssessList: [],
      getPurchaseCount: ''
    }
  },
  methods: {
    // 购买课程
    buyClass () {
      this.$router.push({
        name: 'NewOrder',
        query: {
          row: JSON.stringify(this.courseList)
        }
      })
    },
    getMenuByList () {
      this.$http.get('course-menu/getMenuByList', {
        courseId: JSON.parse(this.$route.query.row).id
      }, res => {
        res.data.map((item) => {
          this.getAssessByList(item.id)
          item.time = item.startTime.substring(0, 10) + ' ' + item.startTime.substring(11, item.startTime.length) + ' - ' + item.endTime.substring(11, item.endTime.length)
        })
        this.classList = res.data
      })
    },
    getUserByPage () {
      this.$http.get('sys-user/getUserByPage', {
        page: 1,
        pageSize: 99999,
        userRole: '2'
      }, res => {
        let teacherIs = JSON.parse(this.$route.query.row).teacherIds.split(',')
        teacherIs.map((teacherId) => {
          res.data.records.map((item) => {
            if (teacherId === item.id) {
              this.teacherList.push(item)
            }
          })
        })
        console.log(this.teacherList)
        this.userList = res.data.records
        this.total = res.data.total
      })
    },
    getAssessByList (id) {
      this.$http.get('course-assess/getAssessByList', {
        courseId: id
      }, res => {
        res.data.map((item) => {
          item.assessLevel = Number(item.assessLevel)
          this.getAssessList.push(item)
        })
      })
    },
    getPurchaseCountByCourseId () {
      this.$http.get('course-purchase/getPurchaseCountByCourseId', {
        detailsId: JSON.parse(this.$route.query.row).id
      }, res => {
        this.getPurchaseCount = res.data
      })
    }
  },
  components: {},
  props: {},
  computed: {},
  watch: {},
  mounted () {
    this.courseList = JSON.parse(this.$route.query.row)
    console.log(this.courseList)
    this.getMenuByList()
    this.getUserByPage()
    this.getPurchaseCountByCourseId()
  }
}
</script>

<style lang="less">
  @import '~styles/mixins';
  @import '~styles/style';
    .curriculumDetails {
      background: #FFFF !important;
      .detail_intro_pc{
        /*padding: 60px 0 72px;*/
        background: #fff;
        .course_container {
          width: 1120px;
          min-height: 270px;
          margin: 0 auto;
          z-index: 3;
          position: relative;
          box-sizing: border-box;
          .clearfix:before, .clearfix:after {
            display: table;
            content: "";
          }
          .detail_intro_left_video {
            /*margin: 16px 0 0 85px;*/
            .lesson_bgpic {
              width: 460px;
              height: 248px;
              background-size: cover;
              float: left;
              background-position: 50% 50%;
            }
          }
          .detail_intro_left {
            float: left;
            position: relative;
            /*margin: 16px 0 0 105px;*/
          }
          .detail_intro_right {
            position: relative;
            float: left;
            width: 476px;
            margin-left: 79px;
            .quota_hd {
              margin-right: 20px;
            }
          }
        }
      }
      .detail_intro_pc-content{
        width: 1120px;
        position: relative;
        margin: 0 auto;
        .flex();
        .detail_intro_pc-content-left{
          flex:  0 0 70%;
          .comment_hd{
            border: 1px solid #efefef;
            background-color: #fff;
            position: relative;
            width: 100%;
            box-sizing: border-box;
            padding: 0 30px;
            .anchor {
              position: relative;
              top: -53px;
            }
            .comment_t {
              position: relative;
              border-left: 4px solid #ffd308;
              font-size: 20px;
              height: 20px;
              line-height: 20px;
              padding-left: 14px;
              margin: 30px 0;
              color: #333;
            }
            .commnet_ul {
              padding: 0 22px;
            }
            .cm_btn_hd {
              font-size: 14px;
              width: 300px;
              margin: 0 auto;
              text-align: center;
              padding: 28px 0 40px;
            }
          }
        }
        .detail_intro_pc-content-right{
          flex:  0 0 30%;
        }
      }
    }
</style>
