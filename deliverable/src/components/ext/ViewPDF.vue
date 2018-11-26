<template>
  <div>
    <vue-friendly-iframe v-if="!dialogPDFLoading" :src="pdfBlob"></vue-friendly-iframe>
  </div>
</template>

<script>

  import VueFriendlyIframe from 'vue-friendly-iframe'

  export default {
    props: ['id', 'datainput'],
    components: {
      'vue-friendly-iframe': VueFriendlyIframe
    },
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
          vm.pdfBlob = result
        })
      }
    }
  }
</script>
