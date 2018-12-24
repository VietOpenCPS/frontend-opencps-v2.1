<template>
  <div class="form-chitiet">
    <div class="row-header">
      <div class="background-triangle-big"> <span>{{nameReport}}</span> </div>
      <div class="layout row wrap header_tools row-blue">
        <div class="flex xs12 pl-3 text-ellipsis text-bold">
          <v-layout wrap class="chart__report">
            <v-flex class="px-2 text-right">
              <!--
              <v-btn flat class="mx-0 my-0" v-if="showConfig" v-on:click.native="doSaveConfig">
                <v-icon>settings</v-icon> &nbsp;
                Lưu thay đổi
              </v-btn>
              -->
              <v-btn flat class="mx-0 my-0" v-on:click.native="showConfig = !showConfig">
                <v-icon v-if="showConfig">reply</v-icon>
                <v-icon v-else>settings</v-icon> &nbsp;
                <span v-if="showConfig">Quay lại</span>
                <span v-else>Tuỳ chọn</span>
              </v-btn>
              <v-btn v-if="reportType === 'REPORT_01'" flat class="mx-0 my-0" v-on:click.native="doExcelFunc">
                Xuất Excel
              </v-btn>
            </v-flex>
          </v-layout>
        </div>
      </div>
    </div>
    <v-layout row wrap class="filter_menu mt-4">
      <v-flex xs6 sm2 class="mx-3" v-if="agencyLists.length > 0">
        <v-autocomplete
          :items="agencyLists"
          v-model="govAgency"
          label="Chọn đơn vị"
          item-text="text"
          item-value="value"
          >
        </v-autocomplete>
      </v-flex>
      <v-flex xs12 sm2 class="mx-3" v-for="(item, indexTool) in filters" v-bind:key="indexTool">
        <datetime-picker
          v-if="item['type'] === 'date'"
          v-model="data[item.key]" 
          :item="item" 
          :data-value="item['value']">
        </datetime-picker>
        <v-text-field 
          v-if="item['type'] === 'text'"
          v-model="data[item.key]" 
          :label="item['label']">
        </v-text-field>
        <v-select
          v-if="item['type'] === 'select'"
          :items="item['source']"
          v-model="data[item.key]"
          :label="item['label']"
          single-line
          item-value="value"
          item-text="name"
        ></v-select>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="filter_menu my-3 px-4" v-if="showConfig">
      <v-flex v-for="(item, index) in itemsReportsConfig" v-bind:key="index">
        <v-checkbox v-if="!reportType.startsWith('STATISTIC')" v-model="selected" :label="item.text" :value="item.value"></v-checkbox>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <v-btn dark v-on:click.native="doCreateReport" color="blue darken-3">Tạo báo cáo</v-btn>
      </v-flex>
    </v-layout>
    <div>
      <vue-friendly-iframe v-if="pdfBlob !== null && pdfBlob !== undefined && pdfBlob !== '' " :src="pdfBlob"></vue-friendly-iframe>
      <div class="mx-2" v-else-if="pdfBlob === ''">
        
      </div>
      <div class="mx-2" v-else-if="!isShowLoading">
        <v-alert :value="true" outline color="info" icon="info">
          Không có dữ liệu báo cáo.
        </v-alert>
      </div>
      <v-layout row wrap v-if="isShowLoading">
        <v-flex xs12 class="text-xs-center" mt-5>
          <v-progress-circular
            :size="100"
            :width="1"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </v-flex>
      </v-layout>
      
    </div>
  </div>
</template>

<script>
import support from '../../store/support.json'
import VueFriendlyIframe from 'vue-friendly-iframe'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
pdfMake.vfs = pdfFonts.pdfMake.vfs
import DatetimePicker from './DatetimePicker.vue'

export default {
  props: ['index'],
  components: {
    'vue-friendly-iframe': VueFriendlyIframe,
    DatetimePicker
  },
  data: () => ({
    api: '',
    onlines: [],
    online: '',
    itemsReportsConfig: [],
    report1Def: {},
    docDefinition: {},
    isDVC: false,
    isCallBack: true,
    fromDate: null,
    fromDateShow: false,
    menufromDate: false,
    fromDateFormatted: null,
    toDate: null,
    toDateShow: false,
    menutoDate: false,
    toDateMin: null,
    toDateFormatted: null,
    danhSachBaoCaos: [],
    years: [],
    year: (new Date()).getFullYear() + '',
    months: [],
    month: 0,
    agencyLists: [],
    govAgency: (window.themeDisplay !== null && window.themeDisplay !== undefined) ? parseInt(window.themeDisplay.getScopeGroupId()) : 0,
    danhSachBaoCao: [],
    pdfBlob: null,
    isShowLoading: false,
    isCallData: false,
    nameReport: '',
    showConfig: false,
    filters: [],
    data: {}
  }),
  computed: {
    itemsReports () {
      return this.$store.getters.itemsReports
    },
    selected: {
      // getter
      get: function() {
        return this.$store.getters.selected
      },
      // setter
      set: function(newValue) {
        this.$store.commit('setselected', newValue)
      }
    },
    reportType: {
      // getter
      get: function() {
        return this.$store.getters.reportType
      },
      // setter
      set: function(newValue) {
        this.$store.commit('setreportType', newValue)
      }
    },
    groupType: {
      // getter
      get: function() {
        return this.$store.getters.groupType
      },
      // setter
      set: function(newValue) {
        this.$store.commit('setgroupType', newValue)
      }
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      setTimeout(() => {
        vm.agencyLists = []
        vm.api = ''
        vm.filters = []
        vm.nameReport = vm.itemsReports[vm.index]['reportName']
        vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['groupIds']
        vm.filters = vm.itemsReports[vm.index]['filterConfig']['filters']
        console.log('agencyLists: ', vm.agencyLists)
        vm.api = vm.itemsReports[vm.index]['filterConfig']['api']
        vm.itemsReportsConfig = []
        vm.itemsReportsConfig = vm.itemsReports[vm.index]['filterConfig']['reportConfig']
        vm.report1Def = {}
        for (let key in vm.itemsReportsConfig) {
          vm.report1Def[vm.itemsReportsConfig[key]['value']] = vm.itemsReportsConfig[key]['text']
        }
        vm.reportType = vm.itemsReports[vm.index]['document']
        if (vm.showConfig) {
          vm.showConfig = false
          setTimeout(() => {
            vm.showConfig = true
          }, 200)
        }
        vm.pdfBlob = ''
      }, 500)
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      console.debug(oldRoute)
      let currentQuery = newRoute.query
      vm.nameReport = vm.itemsReports[vm.index]['reportName']
      vm.itemsReportsConfig = []
      vm.itemsReportsConfig = vm.itemsReports[vm.index]['filterConfig']['reportConfig']
      vm.report1Def = {}
      for (let key in vm.itemsReportsConfig) {
        vm.report1Def[vm.itemsReportsConfig[key]['value']] = vm.itemsReportsConfig[key]['text']
      }
      vm.reportType = vm.itemsReports[vm.index]['document']
      vm.pdfBlob = ''
      vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['groupIds']
      vm.api = ''
      vm.api = vm.itemsReports[vm.index]['filterConfig']['api']
      vm.filters = []
      vm.filters = vm.itemsReports[vm.index]['filterConfig']['filters']
      if (vm.showConfig) {
        vm.showConfig = false
        setTimeout(() => {
          vm.showConfig = true
        }, 200)
      }
    }
  },
  methods: {
    doCreatePDF (val) {
      let vm = this
      if (vm.reportType.startsWith('STATISTIC')) {
        vm.doPrintReportFix()
      } else {
        vm.doDynamicReport(val)
      }
      vm.isCallData = true
    },
    doDynamicReport (val) {
      let vm = this
      vm.docDefinition = {}
      let reportName = ''
      let docDString = JSON.stringify(vm.itemsReports[vm.index]['tableConfig']['docDefinition'])
      let onlineStr = ''
      if (String(vm.online) === 'true') {
        onlineStr = 'TRỰC TUYẾN'
      } else if (String(vm.online) === 'false') {
        onlineStr = 'TRỰC TIẾP'
      } else {
        onlineStr = ''
      }
      reportName = vm.itemsReports[vm.index]['title']
      docDString = docDString.replace(/\[\$siteName\$\]/g, vm.$store.getters.siteName)
                             .replace(/\[\$fromDate\$\]/g, vm.fromDateFormatted)
                             .replace(/\[\$toDate\$\]/g, vm.toDateFormatted)
                             .replace(/\[\$online\$\]/g, onlineStr)
                             .replace(/\[\$reportName\$\]/g, reportName)
      let widthsConfig = []
      let dataReportXX = ''
      widthsConfig.push(30)
      let headerTableReport = '['
      let header2TableReport = '['
      headerTableReport += JSON.stringify({
        text: 'STT',
        alignment: 'center',
        bold: true
      }) + ','
      header2TableReport += JSON.stringify({
        text: '(1)',
        alignment: 'center',
        italics: true
      }) + ','
      let ine = 2
      for (let key in val) {
        widthsConfig.push('auto')
        // vm.docDefinition['content'][2]['table']['widths'].push('auto')
        let str1 = ' '
        if (vm.report1Def[val[key]] !== undefined && vm.report1Def[val[key]] !== null && vm.report1Def[val[key]] !== '') {
          str1 = vm.report1Def[val[key]]
        }
        headerTableReport += JSON.stringify({
          text: str1,
          alignment: 'center',
          bold: true
        }) + ','
        header2TableReport += JSON.stringify({
          text: '(' + ine + ')',
          alignment: 'center',
          italics: true
        }) + ','
        ine = ine + 1
      }
      dataReportXX += headerTableReport.substring(0, headerTableReport.length - 1) + '],'
      dataReportXX += header2TableReport.substring(0, header2TableReport.length - 1) + '],'
      // bild data
      let filter = {
        document: vm.reportType
      }
      filter['api'] = vm.api
      filter['govAgency'] = vm.govAgency
      filter['agencyLists'] = vm.agencyLists
      vm.pdfBlob = null
      vm.isShowLoading = true
      vm.$store.dispatch('getAgencyReportLists', filter).then(function (result) {
        if (result !== null && result !== undefined) {
          let dataReport = result
          let domainRaw = {}
          let dossierRaw = {}
          let dataReportCurrent = {}
          for (let key in dataReport) {
            dataReportCurrent = dataReport[key]
            let domainRawItem = {}
            if (vm.groupType === 'domain') {
              domainRawItem['domainName'] = dataReportCurrent['domainName']
            } else {
              domainRawItem['domainName'] = dataReportCurrent['govAgencyName']
            }
              domainRawItem['services'] = []
            if (vm.groupType === 'domain') {
              if (domainRaw[dataReportCurrent['domainName']] === '' || domainRaw[dataReportCurrent['domainName']] === undefined) {
                domainRaw[dataReportCurrent['domainName']] = domainRawItem
              }
            } else {
              if (domainRaw[dataReportCurrent['govAgencyName']] === '' || domainRaw[dataReportCurrent['govAgencyName']] === undefined) {
                domainRaw[dataReportCurrent['govAgencyName']] = domainRawItem
              }
            }
            if (dossierRaw[dataReportCurrent['serviceCode']] !== '' && dossierRaw[dataReportCurrent['serviceCode']] !== undefined) {
              if (dossierRaw[dataReportCurrent['serviceCode']]['serviceCode'] === dataReportCurrent['serviceCode']) {
                dossierRaw[dataReportCurrent['serviceCode']]['dossiers'].push(dataReportCurrent)
              }
            } else {
              let dossierRawItem = {}
              dossierRawItem['serviceCode'] = dataReportCurrent['serviceCode']
              dossierRawItem['serviceName'] = dataReportCurrent['serviceName']
              if (vm.groupType === 'domain') {
                dossierRawItem['domainName'] = dataReportCurrent['domainName']
              } else {
                dossierRawItem['domainName'] = dataReportCurrent['govAgencyName']
              }
              dossierRawItem['dossiers'] = []
              dossierRaw[dataReportCurrent['serviceCode']] = dossierRawItem
              dossierRaw[dataReportCurrent['serviceCode']]['dossiers'].push(dataReportCurrent)
            }
          }
          for (let key in dossierRaw) {
            let keyObject = dossierRaw[key]
            if (key !== '' && keyObject !== undefined) {
              if (domainRaw[keyObject['domainName']] !== '' && domainRaw[keyObject['domainName']] !== undefined && 
                domainRaw[keyObject['domainName']]['domainName'] === keyObject['domainName']) {
                domainRaw[keyObject['domainName']]['services'].push(keyObject)
              }
            }
          }
          let domains = []
          for (let key in domainRaw) {
            let keyObject = domainRaw[key]
            if (key !== '') {
              let domainRawItem = {}
              domainRawItem['domainName'] = key
              domainRawItem['services'] = keyObject['services']
              domains.push(domainRawItem)
            }
          }
          if (domains.length > 0) {
            let dataReportTotal = ''
            dataReportTotal += JSON.stringify([{
              colSpan: val.length + 1,
              text: domains[0]['domainName'],
              bold: true,
              style: 'tdStyle'
            }]) + ','
            /*
            vm.docDefinition['content'][2]['table']['body'].push([{
              colSpan: val.length + 1,
              text: domains[0]['domainName'],
              bold: true,
              style: 'tdStyle'
            }])
            */
            for (let key in domains[0]['services']) {
              dataReportTotal += JSON.stringify([{
                colSpan: val.length + 1,
                text: '- ' + domains[0]['services'][key]['serviceCode'] + ' - ' + domains[0]['services'][key]['serviceName'],
                bold: true,
                style: 'tdStyle'
              }]) + ','
              /*
              vm.docDefinition['content'][2]['table']['body'].push([{
                colSpan: val.length + 1,
                text: '- ' + domains[0]['services'][key]['serviceCode'] + ' - ' + domains[0]['services'][key]['serviceName'],
                bold: true,
                style: 'tdStyle'
              }])
              */
              let dossiersArray = domains[0]['services'][key]['dossiers']
              let indexStt = 1
              let dataRow = []
              for (let keyDossier in dossiersArray) {
                dataRow = []
                let dossierObj = dossiersArray[keyDossier]
                dataRow.push({
                text: indexStt, 
                alignment: 'center',
                style: 'tdStyle'
                })
                for (let keyVal in val) {
                  let ddStr = ' '
                  if (dossierObj[val[keyVal]] !== undefined && dossierObj[val[keyVal]] !== null && dossierObj[val[keyVal]] !== '') {
                    ddStr = dossierObj[val[keyVal]]
                  }
                  dataRow.push({
                    text: ddStr, 
                    alignment: 'center',
                    style: 'tdStyle'
                  })
                }
                dataReportTotal += JSON.stringify(dataRow) + ','
                // vm.docDefinition['content'][2]['table']['body'].push(dataRow)
                indexStt = indexStt + 1
              }
            }
            dataReportTotal = dataReportTotal.substring(0, dataReportTotal.length - 1)
            dataReportXX += dataReportTotal
          }
          docDString = docDString.replace(/"\[\$tableWidth\$\]"/g, JSON.stringify(widthsConfig))
          docDString = docDString.replace(/"\[\$report\$\]"/g, dataReportXX)
          console.log('report2: ', docDString)
          vm.docDefinition = JSON.parse(docDString)
          let pdfDocGenerator = pdfMake.createPdf(vm.docDefinition)
          pdfDocGenerator.getBlob((blob) => {
            vm.pdfBlob = window.URL.createObjectURL(blob)
            vm.isShowLoading = false
          })
        } else {
          // vm.agencyLists = []
          vm.isShowLoading = false
        }
      })
    },
    doPrintReportFix () {
      let vm = this
      vm.agencyLists = []
      vm.api = ''
      vm.docDefinition = {}
      let docDString = JSON.stringify(vm.itemsReports[vm.index]['tableConfig']['docDefinition'])
      let onlineStr = ''
      if (String(vm.online) === 'true') {
        onlineStr = 'TRỰC TUYẾN'
      } else if (String(vm.online) === 'false') {
        onlineStr = 'TRỰC TIẾP'
      } else {
        onlineStr = ''
      }
      docDString = docDString.replace(/\[\$siteName\$\]/g, vm.$store.getters.siteName)
      
      for (let key in vm.filters) {
        let find = vm.filters[key]['key']
        let currentVal = vm.data[vm.filters[key]['key']]
        if (currentVal !== '' && currentVal !== undefined && currentVal !== null) {
          let dateStr = new Date(currentVal).toLocaleDateString('vi-VN')
          if (dateStr !== 'Invalid Date') {
            docDString = docDString.replace(eval('/\\[\\$' + find + '\\$\\]/g'), dateStr)
          } else {
            docDString = docDString.replace(eval('/\\[\\$' + find + '\\$\\]/g'), currentVal)
          }
        } else {
          docDString = docDString.replace(eval('/\\[\\$' + find + '\\$\\]/g'), '')
        }
      }
      vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['groupIds']
      vm.api = vm.itemsReports[vm.index]['filterConfig']['api']
      vm.isShowLoading = true
      let filter = {
        document: vm.reportType,
        data: vm.data,
        api: vm.api
      }
      filter['govAgency'] = vm.govAgency
      filter['agencyLists'] = vm.agencyLists
      vm.pdfBlob = null
      vm.isShowLoading = true
      vm.$store.dispatch('getAgencyReportLists', filter).then(function (result) {
        if (result !== null && result !== undefined) {
          let index = 1
          let dataRowTotal = []
          dataRowTotal.push({
            text: 'Tổng số', 
            colSpan: 2,
            bold: true,
            alignment: 'center',
            style: 'tdStyle'
          })
          for (let keyMapping in vm.itemsReportsConfig) {
            if (vm.itemsReportsConfig[keyMapping]['value'] === 'note') {
              dataRowTotal.push({
                text: '', 
                alignment: 'center',
                style: 'tdStyle'
              })
            }  else {
              dataRowTotal.push({
                text: 0, 
                alignment: 'center',
                style: 'tdStyle'
              })
            }
          }
          let dataRowI = ''
          let sumKey = vm.itemsReports[vm.index]['filterConfig']['sumKey']
          let selection = vm.itemsReports[vm.index]['filterConfig']['selection']
          let merge = vm.itemsReports[vm.index]['filterConfig']['merge']
          // TODO
          let resultData = result.filter(function(obj) {
            for (let keySe in selection) {
              if (obj[selection[keySe]['key']] === '' || obj[selection[keySe]['key']] === undefined || obj[selection[keySe]['key']] === null) {
                return obj
              }
            }
          })
          let resultDataTotal = resultData.filter(function(obj) {
            if (obj[sumKey] === '' || obj[sumKey] === undefined || obj[sumKey] === null) {
                return obj
            }
          })
          /*
          let resultDataVari = {}
          for (let key in resultData) {
            let keyVari = ''
            for (let keysd in merge) {
              keyVari += resultData[key][merge[keysd]] + '_'
            }
            if (resultDataVari[keyVari] === undefined || resultDataVari[keyVari] === null || resultDataVari[keyVari] === '') {
              resultDataVari[keyVari] = resultData[key]
            } else {
              for (let kkey in resultDataVari[keyVari]) {
                if (resultDataVari[keyVari][kkey] !== '' && resultDataVari[keyVari][kkey] !== undefined && resultDataVari[keyVari][kkey] !== null) {
                  resultDataVari[keyVari][kkey] = parseInt(resultData[key][kkey]) + parseInt(resultDataVari[keyVari][kkey])
                }
              }
            }
          }
          console.log('resultDataVari', resultDataVari)
          */
          for (let key in resultData) {
            if (resultData[key][sumKey] !== '' && resultData[key][sumKey] !== undefined && resultData[key][sumKey] !== null) {
              let dataRow = []
              dataRow.push({
                text: index, 
                alignment: 'center',
                style: 'tdStyle'
              })
              let indexTotal = 1
              for (let keyMapping in vm.itemsReportsConfig) {
                let dataText = ''
                let currentConfig = vm.itemsReportsConfig[keyMapping]
                if (resultData[key][currentConfig['value']] !== undefined && resultData[key][currentConfig['value']] !== null) {
                  dataText = resultData[key][currentConfig['value']] + ' '
                }
                dataRow.push({
                  text: dataText, 
                  alignment: 'center',
                  style: 'tdStyle'
                })
                indexTotal = indexTotal + 1
              }
              index = index + 1
              // vm.docDefinition['content'][2]['table']['body'].push(dataRow)
              dataRowI += JSON.stringify(dataRow) + ','
            }
          }
          for (let key in resultDataTotal) {
            let indexTotal = 1
            for (let keyMapping in vm.itemsReportsConfig) {
              let dataText = ''
              let currentConfig = vm.itemsReportsConfig[keyMapping]
              if (resultDataTotal[key][currentConfig['value']] !== undefined && resultDataTotal[key][currentConfig['value']] !== null && resultDataTotal[key][currentConfig['value']] !== '') {
                dataText = resultDataTotal[key][currentConfig['value']] + ' '
              }
              dataRowTotal[indexTotal]['text'] = parseInt(dataRowTotal[indexTotal]['text']) + parseInt(dataText) + ' '
              indexTotal = indexTotal + 1
            }
          }
          dataRowI += JSON.stringify(dataRowTotal)
          docDString = docDString.replace(/"\[\$report\$\]"/g, dataRowI)
          // vm.docDefinition['content'][2]['table']['body'].push(dataRowTotal)
          vm.docDefinition = JSON.parse(docDString)
          let pdfDocGenerator = pdfMake.createPdf(vm.docDefinition)
          pdfDocGenerator.getBlob((blob) => {
            vm.pdfBlob = window.URL.createObjectURL(blob)
            vm.isShowLoading = false
          })
        } else {
          // vm.agencyLists = []
          vm.isShowLoading = false
        }
      })
    },
    doCreateReport() {
      let vm = this
      let doData = {
        selected: vm.selected,
        itemsReports: vm.itemsReports,
        index: vm.index,
        userId: vm.getUserId()
      }
      vm.$store.dispatch('updateDynamicReport', doData).then(function () {
        vm.showConfig = false
        vm.doCreatePDF(vm.selected)
      })
    }
  }
}
</script>
