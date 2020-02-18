<template>
  <div class="salesStatistics">
    <h4 style="margin-bottom: 10px">总计销售量：{{num}}</h4>
    <div style="display: flex;padding-left: 8%;height: 30px; justify-content: space-between">
      <div>
        <Button type="primary" style="margin-right: 10px" @click="getCountList('day')" v-if="ecFlag">最近七日销售量</Button>
        <Button type="primary" style="margin-right: 10px" @click="getCountList('day')" v-else>最近七日销售趋势</Button>
        <Button type="primary" style="margin-right: 10px" @click="getCountList('month')" v-if="ecFlag">今月销售量</Button>
        <Button type="primary" style="margin-right: 10px" @click="getCountList('month')" v-else>今月销售趋势</Button>
        <Button type="primary"  @click="getCountList('year')"  v-if="ecFlag">今年销售量</Button>
        <Button type="primary"  @click="getCountList('year')"  v-else>今月销售趋势</Button>
      </div>
      <Button type="warning"  @click="ecFlag =!ecFlag" v-if="ecFlag">切换销售趋势</Button>
      <Button type="warning"  @click="ecFlag =!ecFlag" v-else>切换销售量</Button>
    </div>
    <div
      class="PM10-echarts"
      id="UserChart"
    />
  </div>
</template>

<script>
export default {
  name: 'salesStatistics',
  data () {
    return {
      myChart: null,
      rcData: [], // ec 数据
      xRCData: [], // xec 数据
      ecFlag: true,
      num: ''
    }
  },
  methods: {
    // 查询总数
    getCountListAll (data = 'day') {
      this.$http.get('course-purchase/getPurchaseByCountAll', {
        countType: data
      }, res => {
        this.num = res.data
      })
    },
    // 查询
    getCountList (data = 'day') {
      this.$http.get('course-purchase/getPurchaseByCount', {
        countType: data
      }, res => {
        this.init(data, res.data)
        this.getCountListAll(data)
      })
    },
    // 生成天数中的小时数的X轴类目数
    generateHourByDay () {
      let xDatas = []
      var dateTime = new Date()
      dateTime = dateTime.setDate(dateTime.getDate() + 1)
      dateTime = new Date(dateTime)
      const now = dateTime.getTime()
      for (let index = 0; index < 7; index++) {
        const date = new Date(now - (7 - index) * 86400000)
        let day = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()
        let days = date.getDate() < 10 ? '0' + (date.getDate()).toString() : (date.getDate()).toString()
        let data = `${date.getFullYear()}-${day}-${days}`
        xDatas.push(data)
      }
      return xDatas
    },
    generateMonth () {
      let xDatas = []
      for (let index = 1; index <= 12; index++) {
        let xData = ''
        xData = index + '月'
        xDatas.push(xData)
      }
      return xDatas
    },
    // 生成月份中的天数的X轴类目数
    generateDayByMonth: function (monthDate) {
      let year = monthDate.getFullYear()
      let month = monthDate.getMonth() + 1
      let date = new Date(year, month, 0)
      let dateNum = date.getDate()
      let xDats = []
      for (let index = 1; index <= dateNum; index++) {
        const day = index < 10 ? '0' + index : index + ''
        xDats.push(day + '日')
      }
      return xDats
    },
    /**
       * 处理数据
       *
       *
       * **/
    handleData (dateSort, data) {
      const resultDataList = []
      switch (dateSort) {
        case 'day':
          for (let index = 0; index < data.length; index++) {
            let map = {}
            // 开始转换数据格式
            let hourData = data[index]
            let value = new Array(2)
            value[0] = this.$dateFormat(new Date(hourData.countDate), 'yyyy-MM-dd')
            value[1] = hourData.counts
            map.value = value
            resultDataList.push(map)
          }
          break
        case 'month':
          for (let index = 0; index < data.length; index++) {
            let map = {}
            // 开始转换数据格式
            let hourData = data[index]
            let value = new Array(2)
            value[0] = hourData.countDate.substring(8, 10) + '日'
            value[1] = hourData.counts
            map.value = value
            resultDataList.push(map)
          }
          break
        case 'year':
          for (let index = 0; index < data.length; index++) {
            let map = {}
            // 开始转换数据格式
            let hourData = data[index]
            let value = new Array(2)
            value[0] = hourData.countDate.substring(6, 7) + '月'
            value[1] = hourData.counts
            map.value = value
            resultDataList.push(map)
          }

          break
        default:
          break
      }
      return resultDataList
    },
    init (type = 'day', data) {
      switch (type) {
        case 'day':
          this.xRCData = this.generateHourByDay()
          this.rcData = this.handleData(type, data)
          break
        case 'month':
          this.xRCData = this.generateDayByMonth(new Date())
          this.rcData = this.handleData(type, data)
          break
        case 'year':
          this.xRCData = this.generateMonth()
          this.rcData = this.handleData(type, data)
          break
      }
      if (this.ecFlag) {
        let option = {
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: this.xRCData,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              type: 'bar',
              barWidth: '60%',
              data: this.rcData
            }
          ]
        }
        this.myChart.setOption(option, true)
      } else {
        let option = {
          xAxis: {
            type: 'category',
            data: this.xRCData
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: this.rcData,
            type: 'line'
          }]
        }
        this.myChart.setOption(option, true)
      }
    }
  },
  components: {},
  props: {},
  computed: {},
  watch: {
    ecFlag (val) {
      this.getCountList()
      if (val) {
        let option = {
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: this.xRCData,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              type: 'bar',
              barWidth: '60%',
              data: this.rcData
            }
          ]
        }
        this.myChart.setOption(option, true)
      } else {
        let option = {
          xAxis: {
            type: 'category',
            data: this.xRCData
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: this.xRCData,
            type: 'line'
          }]
        }
        this.myChart.setOption(option, true)
      }
    }
  },
  mounted () {
    this.xRCData = this.generateHourByDay()
    this.myChart = this.$echarts.init(document.getElementById('UserChart'))
    this.getCountList()
    this.getCountListAll()
  }
}
</script>

<style lang="less">
  .salesStatistics {
    width: 100%;
    height: 100%;
    position: relative;
    background: #FFFFFF;
    overflow: hidden;
    padding: 12px;
    .PM10-echarts{
      position: absolute;
      width: 100%;
      height: calc(~'100% - 100px');
      left: 0;
    }
  }
</style>
