<template>
  <div>
    <vue-pdf-viewer width="100%" height="100%" style="overflow: auto;min-height: 600px;" :url="url"></vue-pdf-viewer>
    <iframe v-show="!dialogPDFLoading" id="pdfViewer" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 600px;" frameborder="0"></iframe>
  </div>
</template>

<script>

  import VuePDFViewer from 'vue-pdf-viewer'

  export default {
    props: ['id', 'datainput'],
    components: {
      'vue-pdf-viewer': VuePDFViewer
    },
    data() {
      return {
        data: {},
        dialogPDFLoading: true,
        isCallBack: true,
        url: 'blob:http://localhost:8080/0a3f225d-dd33-4e7d-80c1-fca34e02ac74'
      }
    },
    created() {
      var vm = this
      vm.$nextTick(function () {
        if (vm.isCallBack) {
          vm.isCallBack = false
          vm.data = vm.datainput
          console.log('vm.datainput', vm.datainput)
          console.log('vm.data', vm.data)
          vm.pullPDF()
        }
      })
    },
    methods: {
      pullPDF () {
        let vm = this
        vm.dialogPDFLoading = true
        console.log('pullPDF', vm.data['fileEntryId'])
        vm.$store.dispatch('viewPDF', vm.data['fileEntryId']).then(function (result) {
          vm.dialogPDFLoading = false
          document.getElementById('pdfViewer').src = result
        })
      }
    }
  }
</script>
