<template>
  <div style="width: 1300px; margin: 0 auto">
    <div v-if="!loadingConfig">
      <thong-ke-trung-tam v-if="donViTrungTam"></thong-ke-trung-tam>
      <thong-ke-quan-huyen v-if="donViHuyen" :govAgencyInfo="govAgencyHuyen"></thong-ke-quan-huyen>
      <thong-ke-so-xa v-if="!donViTrungTam && !donViHuyen"></thong-ke-so-xa>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import ThongKeSoXa from './ThongKeCapSoXa'
import ThongKeQuanHuyen from './ThongKeCapQuanHuyen'
import ThongKeTrungTam from './ThongKeTrungTam'
export default {
  components: {
    'thong-ke-so-xa': ThongKeSoXa,
    'thong-ke-quan-huyen': ThongKeQuanHuyen,
    'thong-ke-trung-tam': ThongKeTrungTam
  },
  data: () => ({
    donViTrungTam: false,
    donViHuyen: false,
    govAgencyHuyen: '',
    loadingConfig: true
  }),
  computed: {
  },
  created () {
    let vm = this
    vm.getDynamicReports()
  },
  watch: {
    
  },
  methods: {
    getDynamicReports () {
      let vm = this
      vm.loadingConfig = true
      let options = {
        headers: {
          'groupId': window.themeDisplay.getScopeGroupId(),
          'Content-Type': 'text/plain',
          'Accept': 'application/json'
        }
      }
      let body = `{
        getDynamicReports(start: -1, end: -1) {
            dynamicReportId
            reportCode
            reportName
            filterConfig
            tableConfig
            userConfig
            sharing
        }
      }`
      axios.post('/o/v1/opencps/adminconfig', body, options).then(function (response) {
        let serializable = response.data
        let itemsReportsData = []
        let indexKey = 0
        let dynamicReportsFilterSharing = serializable['getDynamicReports'].filter(function (item) {
          return String(item.sharing) !== '9'
        })
        for (let key in dynamicReportsFilterSharing) {
          let current = dynamicReportsFilterSharing[key]
          itemsReportsData.push({
            'code' : String(indexKey),
            'document' : current['reportCode'],
            'active' : false,
            'title' : current['reportName'],
            'filterConfig' : eval('( ' + current['filterConfig'] + ' )'),
            'tableConfig' : eval('( ' + current['tableConfig'] + ' )'),
            'userConfig' : eval('( ' + current['userConfig'] + ' )'),
            'dynamicReportId' : current['dynamicReportId'],
            'reportCode' : current['reportCode'],
            'reportName' : current['reportName'],
            'sharing' : current['sharing']
          })
          indexKey = indexKey + 1
        }
        let reportHuyen = itemsReportsData.filter(function (item) {
          return item.userConfig && item.userConfig.hasOwnProperty('donViHuyen')
        })
        if (reportHuyen && reportHuyen.length > 0) {
          vm.donViHuyen = true
          vm.govAgencyHuyen = reportHuyen[0]['userConfig']
        }
        vm.loadingConfig = false
      }).catch(function (error) {
        vm.loadingConfig = false
      })
    },
  }
};
</script>
