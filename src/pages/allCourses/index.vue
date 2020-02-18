<template>
  <div class="allCourses">
    <ul class="mycourseUl clearfix" v-for="(item,index) in data" :key="index">
      <li class="tb">
        <div class="mycourseBlockHd clearfix">
            <div class="lessonpicHd">
              <div
                class="lessonPic"
              ></div>
            </div>
            <div class="mycourseInfoHd">
              <div class="title">{{item.courseName}}</div>
            <div class="mycourseLeInfoHd" v-for="(list,index2) in item.list" :key="index2">
              <span class="mycourseClassNum">第{{index2 + 1}}节</span>
              <span class="mycourseClassTime">01.15 20:10</span>
              <span class="mycourseInfoTitle">{{list.menuName}}</span>
              <div class="enterQQGroup">{{list.menuState}}</div>
            </div>
              <div class="progress_container">
              </div>
            </div><div class="more_hd"><div class="more_icon"></div>
            <div class="more_list_hd" style="display: none;">
              <div class="remove_btn">
                <span></span>删除课程</div>
            </div>
          </div>
          </div>
        <div class="expDateHd">{{item.endTime}} 到期</div>
      </li>
    </ul>
    <!--<Page :total="total"-->
          <!--style="margin-top: 10px;  width: 100%;-->
      <!--height: 56px;-->
      <!--line-height: 56px;-->
      <!--padding: 0 15px;-->
      <!--box-sizing: border-box;"-->
          <!--show-elevator-->
          <!--show-sizer-->
          <!--show-total-->
          <!--:current="pageNo"-->
          <!--:page-size-opts="[10, 20, 30, 50]"-->
          <!--:page-size="pageSize"-->
          <!--@on-change="pageChange"-->
          <!--@on-page-size-change="pageSizeChange"/>-->
  </div>
</template>

<script>
export default {
  name: 'AllCourses',
  data () {
    return {
      // 总数
      total: 0,
      // 当前页数
      pageNo: 1,
      // 单页数量
      pageSize: 10,
      data: []
    }
  },
  methods: {
    pageChange (page) {
      this.pageNo = page
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize
    },
    getPurchaseByPage () {
      this.$http.get('course-purchase/getPurchaseByPage', {
        page: this.pageNo,
        pageSize: 9999
      }, res => {
        res.data.map((item) => {
          this.$http.get('course-menu/getMenuByList', {
            id: item.detailsId
          }, res => {
            res.data.map((item) => {
              if (item.menuState === null || item.menuState === '') {
                item.menuState = '未开始'
              }
            })
            item.list = []
            item.list = res.data
          })
        })
        setTimeout(() => {
          this.data = res.data
          console.log(res.data)
        }, 500)
      })
    }

  },
  components: {},
  props: {},
  computed: {},
  watch: {},
  mounted () {
    this.getPurchaseByPage()
  }
}
</script>

<style lang="less">
  .allCourses {
    ul{
      padding: 16px;
    }
    .mycourseBlockHd{
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 100%;
      height: 190px;
      padding: 18px;
      background-color: #fff;
      border: 1px solid #e4e4e4;
      .lessonpicHd{
        float: left;
        width: 20%;
      }
      .mycourseInfoHd{
        position: relative;
        float: left;
        width: 80%;
        height: 150px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        padding: 4px 0 5px 32px;
        .title{
          color: #000;
          font-size: 18px;
          max-width: 371px;
          -o-text-overflow: ellipsis;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          margin-bottom: 9px;
        }
        .mycourseLeInfoHd{
          color: #666;
          font-weight: 400;
          line-height: 28px;
          width: 100%;
          font-size: 12px;
          height: 28px;
          .mycourseClassTime .mycourseClassNum{
            margin-right: 12px;
          }
          .mycourseInfoTitle{
            margin-right: 12px;
            font-weight: 400;
            vertical-align: middle;
            max-width: 100%;
            overflow: hidden;
            white-space: nowrap;
            -o-text-overflow: ellipsis;
            text-overflow: ellipsis;
          }
          .enterQQGroup{
            width: 70px;
            height: 24px;
            -webkit-border-radius: 15px;
            border-radius: 15px;
            border: 1px solid #a8a8a8;
            color: #000;
            font-size: 12px;
            line-height: 24px;
            text-align: center;
            float: right;
            z-index: 10;
          }
        }
      }
      .lessonPic{
        width: 100%;
        height: 150px;
        display: inline-block;
        background-size: cover;
        background-position: 50%;
      }
    }
    .expDateHd{
      position: absolute;
      z-index: 99;
      top: 29px;
      right: 20px;
      color: #999;
      padding: 2px;
      font-size: 12px;
    }
  }
</style>
