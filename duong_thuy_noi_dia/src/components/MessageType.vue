<template>
  <div>
    <jx-hanghai-detail-pdf 
      :type="type"
      :document_type_code="documentTypeCode"
      :document_status_code="documentStatusCode"
      :document_name="documentName"
      :document_year="documentYear"
      :request_code="requestCode"
      :message_type="messageType"
      ref="hanghaidetailpdf"
      >
    </jx-hanghai-detail-pdf>
    <router-view></router-view>

  </div>
</template>

<script>
import axios from 'axios'
import DetailPDF from './hang_hai/hanghai_detail_pdf.vue'
export default {
  props: ['type', 'documentName', 'documentYear', 'documentTypeCode', 'documentStatusCode', 'messageType', 'requestCode', 'state'],
  components: {
    'jx-hanghai-detail-pdf': DetailPDF
  },
  data: () => ({
    detail_model: {},
    title: '',
    getFileThanhPhanVersionList: '',
    exportPDFDetailThanhPhan: ''
  }),
  beforeCreate () {
    let vm = this
    vm.$nextTick(function () {
      vm.$store.dispatch('loadInitResource').then(function (result) {
        if (result !== null) {
          vm.getFileThanhPhanVersionList = result.getFileThanhPhanVersionList
          vm.exportPDFDetailThanhPhan = result.exportPDFDetailThanhPhan
        }
      })
    })
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      let query = vm.$router.history.current.query
      if (query.hasOwnProperty('title')) {
        vm.title = query['title']
      }
      vm.reloadDetail()
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let query = newRoute.query
      if (query.hasOwnProperty('title')) {
        vm.title = query['title']
      }
      vm.reloadDetail()
    }
  },
  methods: {
    pullDetail () {
      let hanghaidetailpdf = this.$refs.hanghaidetailpdf
      if (hanghaidetailpdf !== null && hanghaidetailpdf !== undefined && hanghaidetailpdf !== 'undefined') {
        return hanghaidetailpdf.detail_model
      }
    },
    reloadDetail: function () {
      let vm = this
      vm.detail_model = {}
      let config = {
        'documentType': vm.documentTypeCode,
        'documentName': vm.documentName,
        'documentYear': vm.documentYear,
        'type': vm.type
      }
      vm.$store.dispatch('loadDetailHoSo', config).then(function (result) {
        vm.detail_model = result
        let hanghaidetailpdf = vm.$refs.hanghaidetailpdf
        if (hanghaidetailpdf !== null && hanghaidetailpdf !== undefined && hanghaidetailpdf !== 'undefined') {
          hanghaidetailpdf.reloadDetail()
          vm._changefileListVersion()
        }
      })
    },
    _changefileListVersion: function () {
      let vm = this
      let pdfViewChild = vm.$refs.hanghaidetailpdf
      pdfViewChild.file_lists = []
      axios.get(vm.getFileThanhPhanVersionList, {
        params: {
          'documentName': vm.documentName,
          'documentYear': vm.documentYear,
          'messageType': vm.messageType,
          'documentType': vm.documentTypeCode
        }
      }).then(function (response) {
        let serializable = response.data
        if (serializable != null && serializable.length > 0) {
          pdfViewChild.nodata = false
          pdfViewChild._showFile(serializable)
        } else {
          console.log('error get file thanh phan list')
          pdfViewChild.nodata = true
          pdfViewChild.loadingPDF = false
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    viewPDFProcess: function (data) {
      let vm = this
      let pdfViewChild = vm.$refs.hanghaidetailpdf
      let iFrame = document.getElementById('dossierPDFView')
      iFrame.innerHTML = ''
      const config = {
        params: {
          'documentName': vm.documentName,
          'documentYear': vm.documentYear,
          'messageType': vm.messageType,
          'documentType': vm.documentTypeCode,
          'requestCode': data.requestCode
        }
      }
      axios
        .get(vm.exportPDFDetailThanhPhan, config)
        .then(function (response) {
          let serializable = response.data
          pdfViewChild.loadingPDF = false
          if (serializable.url !== null && serializable.url !== '') {
            let urlDownload = serializable.url
            iFrame.innerHTML =
              '<iframe src="' + urlDownload + '" style="width:100%; height: 100vh;" frameborder="0"></iframe>'
          } else {
            iFrame.innerHTML = '<div class="alert alert--outline error--text mx-4 mb-2"><i aria-hidden="true" class="icon material-icons alert__icon">warning</i><div> Không tìm thấy tài liệu PDF </div></div>'
          }
        })
        .catch(function (error) {
          console.log(error)
          pdfViewChild.loadingPDF = false
          iFrame.innerHTML = 'Xuất file xảy ra lỗi'
        })
    }
  }
}
</script>
