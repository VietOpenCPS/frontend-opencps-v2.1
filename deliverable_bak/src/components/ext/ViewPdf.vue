<template>
  <div>
    <iframe v-show="!dialogPDFLoading" id="pdfViewerComponent" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 600px;" frameborder="0">
        </iframe>
  </div>
</template>

<script>

  export default {
    props: ['id', 'datainput'],
    data() {
      return {
        data: {},
        dialogPDFLoading: true,
        isCallBack: true,
        pdfBlob: null
      }
    },
    created() {
      var vm = this
      vm.$nextTick(function () {
        setTimeout(() => {
          vm.data = vm.datainput
          vm.pullPDF()
        }, 100)
      })
    },
    methods: {
      pullPDF () {
        let vm = this
        vm.dialogPDFLoading = true
        console.log('pullPDF', vm.data['fileEntryId'])
        vm.$store.dispatch('viewPDF', vm.data['fileEntryId']).then(function (result) {
          vm.dialogPDFLoading = false
          document.getElementById('pdfViewerComponent').src = result
        })
      }
    }
  }
</script>
