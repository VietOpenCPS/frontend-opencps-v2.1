<template>
  <div style="width: 100%; position: relative;">
    <div class="row-header" style="height: 38px;overflow: hidden;">
      <div class="background-triangle-big view_tp_pdf"> {{titleThanhPhan}} </div>
      <div class="layout row wrap header_tools row-blue">
  
        <div class="flex solo text-ellipsis">
  
          <span class="font-regulal">{{detail_model.shipName}}</span> | <span class="red--text text--darken-3">#</span> 
          <span class="font-regulal" style="font-weight: bold; color: rgb(35, 114, 187);">{{detail_model.documentName}} </span>| <span class="font-regulal">{{detail_model.callSign}}</span>

        </div>
        <div class="flex text-right" style="margin-left: auto;">
          <span class="font-regulal" style="font-weight: bold;color: #2372bb;">  </span>
          <v-btn v-if="!isKeToan" flat class="primary--text my-0" style="border-right: 2px solid #ffffff;border-radius: 0;">
            {{supportData.docType[document_type_code]}}
          </v-btn>
          <v-btn flat class=" primary--text my-0" v-on:click.native="backtolist('ke_hoach')"
          v-if="isThuTuc && isKeHoach && !isKeToan"
          >
                <v-icon class="mr-2 primary--text">undo</v-icon>
              Kế hoạch
          </v-btn>
          <v-btn flat class=" primary--text my-0" v-on:click.native="backtolist('ke_hoach')"
          v-if="!isThuTuc && isKeHoach && !isKeToan"
          >
                <v-icon class="mr-2 primary--text">undo</v-icon>
              Kế hoạch
          </v-btn>
          <v-btn flat class=" primary--text my-0" v-on:click.native="backtolist('thu_tuc')"
            v-if="isThuTuc && isKeHoach && !isKeToan"
          >
                <v-icon class="mr-2 primary--text">undo</v-icon>
              Thủ tục
          </v-btn>
          <v-btn flat class=" primary--text my-0" v-on:click.native="backtolist('thu_tuc')"
            v-if="isThuTuc && !isKeHoach && !isKeToan"
          >
                <v-icon class="mr-2 primary--text">undo</v-icon>
              Thủ tục
          </v-btn>
          <v-btn flat class=" primary--text my-0" v-on:click.native="backtolist('else_type')"
            v-if="!isThuTuc && !isKeHoach && !isKeToan"
          >
                <v-icon class="mr-2 primary--text">undo</v-icon>
              Quay lại
          </v-btn>
          <v-btn flat class=" primary--text my-0 pr-3 btn-top-panel" v-on:click.native="backtolist('ke_toan')"
            v-if="isKeToan"
          >
                <v-icon class="mr-2 primary--text">undo</v-icon>
              Quay lại
          </v-btn>
        </div>
      </div>
    </div>
    <div>
      <div class="panel my-0 px-0 btn--block" style="box-shadow: none !important;" v-if="file_lists.length > 0 && !nodata">
        <div class="flex xs12" style="align-items: center;display: flex;-webkit-align-items: center;display: -webkit-flex;">
           <v-btn flat icon class="mx-0 my-0 revert__icon" v-on:click.native="preAction()" v-if="file_list_view_index > 0">
            <v-icon>play_arrow</v-icon>
          </v-btn>
          <v-btn flat icon class="mx-0 my-0">
            <v-icon>picture_as_pdf</v-icon>
          </v-btn>
          <span class="text-bold">Phiên bản: <span v-if="file_lists.length > 0">{{version}}</span> | </span>
          <i class="text-gray"><span v-if="file_lists.length > 0">{{status}} - {{sendDate}}</span></i>
          <v-btn flat icon class="mx-0 my-0" v-on:click.native="nextAction()" v-if="file_lists.length > 1 && file_lists.length > file_list_view_index + 1">
            <v-icon>play_arrow</v-icon>
          </v-btn>
          <v-icon v-if="file_lists.length > 1 && file_lists.length == file_list_view_index + 1">more_vert</v-icon>
          <v-icon v-else-if="file_lists.length === 1">more_vert</v-icon>
          <span v-if="file_lists.length > 0" style="color: #2372ba;"> {{remarks}}</span>
        </div>
      </div>
      <div v-show="file_lists.length > 0">
          <div v-if="loadingPDF">
            <content-placeholders :rounded="true">
              <content-placeholders-img />
              <content-placeholders-heading />
            </content-placeholders>
          </div>
          <div id="dossierPDFView" v-show="!nodata">
        </div>
      </div>
    </div>
    <div v-if="nodata">
      
    </div>
    <div v-if="file_list_view_index === 0">
        <slot></slot>
      </div>
  </div>
</template>

<script>
const COMPONENT_NAME = 'jx-hanghai-detail-pdf'
import supportData from '../../store/support_data.json'

export default {
  name: COMPONENT_NAME,
  props: {
    name: String,
    group_id: 0,
    detail_tp: {},
    detail_tp_file_api: '',
    document_type: '',
    doc_type: 'NC',
    type: '',
    document_type_code: '',
    document_status_code: '',
    document_name: '',
    document_year: 0,
    request_code: '',
    message_type: ''
  },
  data () {
    return {
      supportData: supportData,
      loadingPDF: true,
      file_lists: [],
      file_list_view_index: 0,
      version: '',
      status: '',
      sendDate: '',
      remarks: '',
      nodata: false,
      detail_model: {},
      titleThanhPhan: '',
      isKeHoach: false,
      isThuTuc: false,
      isKeToan: false
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      vm.$store.dispatch('loadInitResource').then(function (result) {
        let initData = result
        vm.isKeHoach = initData.user.isKeHoach
        vm.isThuTuc = initData.user.isThuTuc
        vm.isKeToan = initData.user.isKeToan
      })
    })
  },
  methods: {
    backtolist: function (keyType) {
      this.document_status_code = 0
      if (keyType === 'ke_hoach') {
        this.type = keyType
        this.$router.push('/danh-sach-ho-so/' + this.type + '/' + this.document_type_code + '/' + this.document_status_code)
      } else if (keyType === 'ke_toan') {
        this.$router.push('/danh-sach-phieu-thanh-toan/ke_toan/0')
      } else if (keyType === 'thu_tuc') {
        this.type = keyType
        this.$router.push('/danh-sach-ho-so/' + this.type + '/' + this.document_type_code + '/' + this.document_status_code)
      } else {
        this.$router.push('/danh-sach-ho-so/' + this.type + '/' + this.document_type_code + '/' + this.document_status_code)
      }
    },
    backtolistpdf: function () {
      this.$router.push('/ho-so/' + this.type + '/' + this.document_name + '/' + this.document_year + '/' + this.document_type_code + '/' + this.document_status_code)
    },
    reloadDetail: function () {
      var vm = this
      vm.detail_model = vm.$parent.detail_model
      vm.titleThanhPhan = vm.$parent.title
    },
    preAction: function () {
      var vm = this
      if (vm.file_list_view_index > 0) {
        vm.file_list_view_index = vm.file_list_view_index - 1
        var data = vm.file_lists[vm.file_list_view_index]
        vm.version = data.version
        vm.status = data.status
        vm.sendDate = data.sendDate
        vm.remarks = data.remarks
        vm.loadingPDF = true
        vm.viewPDFProcess(data)
      }
    },
    nextAction: function () {
      var vm = this
      if (vm.file_list_view_index < vm.file_lists.length) {
        vm.file_list_view_index = vm.file_list_view_index + 1
        var data = vm.file_lists[vm.file_list_view_index]
        vm.version = data.version
        vm.status = data.status
        vm.sendDate = data.sendDate
        vm.remarks = data.remarks
        vm.loadingPDF = true
        vm.viewPDFProcess(data)
      }
    },
    _clearFile: function () {
      this.file_lists = []
    },
    _showFile: function (data) {
      this.file_lists = data
      this.file_list_view_index = 0
      try {
        this.version = data[0].version
        this.status = data[0].status
        this.sendDate = data[0].sendDate
        this.remarks = data[0].remarks
        var vm = this
        vm.loadingPDF = true
        if (data.length > 0) {
          vm.viewPDFProcess(data[0])
        } else {
          vm.loadingPDF = false
        }
      } catch (error) {
        console.log(error)
        this.version = ''
        this.status = ''
        this.sendDate = ''
      }
    },
    viewPDFProcess: function (data) {
      var vm = this
      vm.$parent.viewPDFProcess(data)
    }
  }
}
</script>
