<template>
    <div class="curriculum">
      <Carousel v-model="value1" loop>
        <CarouselItem v-for="(item,index) in courseList" :key="index">
          <div class="list_course_show_first list_course_show
                  " @click="listClick(item)">
            <div class="course_show_img box_sizing">

              <div class="course_item_left">
                <div class="course_class">{{item.cname}}</div>

                <div class="course_introduction">{{item.cdescript}}</div>

                <div class="course_teacher_name">
                  <div class="course_teacher_name_item" v-for="(teacher, tIndex) in item.teacherNames" :key="tIndex">{{teacher}}</div>
                </div>

                <div class="course_time">
                  <span class="schooltime">{{item.classTime}}</span>
                </div>

              </div>

              <div class="course_item_img"></div>

            </div>
            <ul class="sell_status box_sizing">
              <li class="course_sell_price">

                <div class="float_left"></div>

                <div class="float_right font-color-red"><span><del class="assemble-sell-del">RMB {{item.coursePrise}} </del></span><span class="course_price_unti_mini">RMB</span></div>
              </li>

              <li>
                <div class="float_left"></div>
                <input type="text" style="display:none" class="sellEnd" value="1609344000000">
                <div class="float_right surplus">距离停售还有<span>{{item.times}}天</span></div>
              </li>
            </ul>
          </div>
        </CarouselItem>
      </Carousel>
      <!--主体-->
      <div class="curriculum-content">
        <div class="list_course_show" v-for="(item,index) in courseList2" :key="index"  @click="listClick(item)">

          <div class="course_show_img box_sizing">

            <div class="course_item_left">
              <div class="course_class">{{item.cname}}
              </div>

              <div class="course_teacher_name">
                <div class="course_teacher_name_item" v-for="(teacher, tIndex) in item.teacherNames" :key="tIndex">{{teacher}}</div>
              </div>

              <div class="course_time">
                <span class="schooltime">{{item.classTime}}</span>
              </div>

            </div>

            <div class="course_item_img" style="background-image:url(https://cdn.bos.kaochong.com/web/47-8476183758860540188.png)"></div>

          </div>

          <ul class="sell_status box_sizing">
            <li class="course_sell_price">

              <div class="float_left"></div>

              <div class="float_right font-color-red"><span><del class="assemble-sell-del">RMB {{item.coursePrise}} </del></span><span class="course_price_unti_mini">RMB</span></div>
            </li>

            <li>
              <div class="float_left"></div>
              <input type="text" style="display:none" class="sellEnd" value="1579082400000">
              <div class="float_right surplus">距离停售还有<span>{{item.times}}天</span></div>
            </li>
          </ul>
        </div>
      </div>
      <Page :total="total"
            style="margin-top: 10px;  width: 100%;
      height: 56px;
      line-height: 56px;
      padding: 0 15px 0 350px;
      box-sizing: border-box;"
            show-elevator
            show-sizer
            show-total
            :current="pageNo"
            :page-size-opts="[10, 20, 30, 50]"
            :page-size="pageSize"
            @on-change="pageChange"
            @on-page-size-change="pageSizeChange"/>
    </div>
</template>

<script>
export default {
  name: 'curriculum',
  data () {
    return {
      value1: 0,
      pageNo: 1,
      pageSize: 10,
      courseList: [],
      courseList2: [],
      total: 0
    }
  },
  methods: {
    pageChange (page) {
      this.pageNo = page
      this.getCourseDetailsByPage()
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize
      this.getCourseDetailsByPage()
    },
    // 轮播图点击事件
    listClick (row) {
      this.$router.push({
        name: 'CurriculumDetails',
        query: {
          row: JSON.stringify(row)
        }
      })
    },
    // 计算天数差的函数，通用
    DateDiff (sDate1, sDate2) { // sDate1和sDate2是2002-12-18格式
      var aDate, oDate1, oDate2, iDays
      aDate = sDate1.split('-')
      oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) // 转换为12-18-2002格式
      aDate = sDate2.split('-')
      oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
      iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) // 把相差的毫秒数转换为天数
      return iDays
    },
    getCourseDetailsByPage () {
      this.$http.get('course-details/getCourseDetailsByPage', {
        page: this.pageNo,
        pageSize: this.pageSize
      }, res => {
        let array = []
        let array2 = []
        res.data.records.map((item) => {
          if (item.isTop === 0) {
            array.push(item)
          } else {
            array2.push(item)
          }
          let teacherNames = item.teacherNames.split(',')
          teacherNames.splice(teacherNames.length - 1, 1)
          item.teacherNames = teacherNames
          item.classTime = this.$dateFormat(new Date(item.startTime), 'yyyy-MM-dd') + ' - ' + this.$dateFormat(new Date(item.endTime), 'yyyy-MM-dd')
          item.times = this.DateDiff(this.$dateFormat(new Date(item.endSellTime), 'yyyy-MM-dd'), this.$dateFormat(new Date(), 'yyyy-MM-dd'))
        })
        this.courseList = array
        this.courseList2 = array2
        this.total = res.data.total
      })
    }

  },
  components: {},
  props: {},
  computed: {},
  watch: {},
  mounted () {
    this.getCourseDetailsByPage()
  }
}
</script>

<style lang="less">
  @import '~styles/mixins';
  @import '~styles/style';
    .curriculum {
      overflow-y: auto !important;
      padding:15px;
      .curriculum-content{
        .flex();
        flex-wrap: wrap;
        justify-content: center;
      }
  }
</style>
