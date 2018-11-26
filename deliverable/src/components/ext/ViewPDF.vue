<template>
  <div>
    <iframe v-show="!dialogPDFLoading" id="pdfViewer" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 600px;" frameborder="0"></iframe>
  </div>
</template>

<script>

  export default {
    props: ['id', 'datainput'],
    data() {
      return {
        data: {},
        dialogPDFLoading: true,
        isCallBack: true
      }
    },
    updated() {
      var vm = this
      vm.$nextTick(function () {
        if (vm.isCallBack) {
          vm.isCallBack = false
          vm.data = vm.datainput
          vm.pullPDF()
        }
      })
    },
    methods: {
      pullPDF () {
        let vm = this
        vm.dialogPDFLoading = true
        vm.$store.dispatch('viewPDF', vm.data['fileEntryId']).then(function (result) {
          vm.dialogPDFLoading = false
          document.getElementById('pdfViewer').src = result
        })
      }
    }
  }
</script>
