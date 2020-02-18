<template>
    <div class="dataDownload">
      <div class="data_download_hd">
        <div class="data_download_con_hd">
          <ul class="data_download_list_hd">
            <li class="data_download_list_item" v-for="(item,index) in data" :key="index">
              <a @click="fileClick(item.id)" data-course="" class="data_download_list_item_link">
                <h3 class="data_download_list_item_title">
                  {{item.courseName}}
                </h3>
                <p class="data_download_list_item_hint">
                  课程时间： {{item.startTime}} - {{item.endTime}}
                </p>
                <img class="data_download_list_item_arrow" src="../../assets/imgs/右箭头(1).png" @click="fileClick(item.id)"/>
              </a>
            </li>
          </ul>

        </div>

      </div>
      <Modal v-model="importModalshowflag" title="相关资料"  footer-hide :z-index="1000" width="80%" class="modal-bg">
        <Form ref="fileVO"  :model="fileVO" label-position="right" class="label-input-form">
          <Row>
            <Col span="6">
              <FormItem label="文件名称">
                <Input  v-model="fileVO.fileName"  style="width: 200px" clearable  placeholder="请输入文件名称"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="">
                <Button type="primary" @click="getFileByPage" style="margin-bottom: 15px">查询</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Table :columns="courseColumns" :data="courseList" height="400" border ref="selection"></Table>
        <Page :total="total"
              style="margin-top: 10px;  width: 100%;
      height: 56px;
      line-height: 56px;
      padding: 0 15px;
      box-sizing: border-box;"
              show-elevator
              show-sizer
              show-total
              :current="pageNo"
              :page-size-opts="[10, 20, 30, 50]"
              :page-size="pageSize"
              @on-change="pageChange"
              @on-page-size-change="pageSizeChange"/>
      </Modal>
      <Modal v-model="exportModelFlag" footer-hide title="查看课堂作业" width="700">
      <p v-html="userVO.fileContent"></p>
      </Modal>
    </div>
</template>

<script>
export default {
  name: 'dataDownload',
  data () {
    return {
      userVO: {
        fileContent: ''
      },
      exportModelFlag: false,
      courseText: '',
      data: [],
      importModalshowflag: false,
      // 总数
      total: 0,
      // 当前页数
      pageNo: 1,
      // 单页数量
      pageSize: 10,
      fileVO: {
        fileContent: '',
        fileName: ''
      },
      courseColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '资料名称/课堂作业',
          align: 'center',
          key: 'fileName',
          render: (h, params) => {
            let text = ''
            if (params.row.fileName === null || params.row.fileName === '') {
              text = '课堂作业—' + params.row.fileContent
            } else {
              text = '资料—' + params.row.fileName
            }
            return h('div', {props: {}}, text)
          }
        },
        {
          title: '上传时间',
          align: 'center',
          key: 'updatedTime',
          render: (h, params) => {
            let typeShow = this.$dateFormat(new Date(params.row.updatedTime), 'yyyy-MM-dd hh:mm:ss')
            return h('div', {props: {}}, typeShow)
          }
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
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    if (params.row.fileName === '' || params.row.fileName === null) {
                      this.exportModelFlag = true
                      this.userVO.fileContent = params.row.fileContent
                      this.courseText = params.row
                    } else {
                      window.open('/course/course-file/downloadFile?fileId=' + params.row.id)
                    }
                  }
                }
              }, params.row.fileName === '' || params.row.fileName === null ? '查看' : '下载')

            ])
          }
        }
      ],
      courseList: [],
      detailsId: ''

    }
  },
  methods: {
    fileClick (id) {
      this.detailsId = id
      this.importModalshowflag = true
      this.getFileByPage()
    },
    pageChange (page) {
      this.pageNo = page
      this.getFileByPage()
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize
      this.getFileByPage()
    },
    getPurchaseByPage () {
      this.$http.get('course-purchase/getPurchaseByPage', {
        page: 1,
        pageSize: 9999
      }, res => {
        this.data = res.data
      })
    },
    getFileByPage () {
      this.$http.get('course-file/getFileByPage', {
        page: this.pageNo,
        pageSize: this.pageSize,
        detailsId: this.detailsId,
        fileName: this.fileVO.fileName
      }, res => {
        this.courseList = res.data.records
        this.total = res.data.total
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
    .dataDownload {
      .kkpager_hd {
        text-align: center;
        margin-bottom: 35px;
      }
      .data_download_hd {
        width: 100%;
        box-sizing: border-box;
      }
      .data_download_title_hd {
        width: 100%;
        height: 50px;
        line-height: 50px;
        box-sizing: border-box;
        background: #fff;
        border-radius: 4px;
        box-shadow: 0 1px 1px #e2e1e1;
        font-size: 14px;
        margin-bottom: 10px;
      }
      .data_download_title_item {
        margin: 0 30px;
        display: inline-block;
        color: #000;
      }
      .data_download_title_item:hover,
      .data_download_title_item.select {
        color: #f5c453;
      }
      /*con*/
      .data_download_con_hd,
      .data_download_list_hd {
        width: 100%;
        box-sizing: border-box;
      }
      .data_download_list_hd {
        margin-bottom: 10px;
      }
      .data_download_list_item {
        width: 100%;
        margin-bottom: 10px;
      }
      .data_download_list_item_link {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 25px 20px 30px 30px;
        border-radius: 4px;
        box-shadow: 0 1px 1px #e2e1e1;
        background-color: #fff;
        position: relative;
        display: inline-block;
      }
      .data_download_list_item_link:hover {
        background-color: #f9f9f9;
      }
      .data_download_list_item_title {
        font-size: 20px;
        line-height: 30px;
        margin-bottom: 11px;
        color: #000;
        width: 787px;
      }
      .data_download_list_item_hint {
        font-size: 14px;
        line-height: 14px;
        color: #666;
        width: 90%;
        height: 15px;
        overflow: hidden;
      }
      .data_download_list_item_arrow {
        position: absolute;
        top: 43px;
        right: 30px;
        width: 28px;
        height: 24px;
      }
      /*nothing*/
      .data_download_nothing_hd {
        width: 100%;
        height: 560px;
        box-sizing: border-box;
        background-color: #fff;
      }
      .data_download_nothing_con {
        width: 100%;
        text-align: center;
        padding-top: 120px;
        box-sizing: border-box;
      }
      .data_download_nothing_words {
        color: #5b5b5b;
        font-size: 18px;
      }

    }
</style>
