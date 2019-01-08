<template>
<v-form ref="form" v-model="valid" lazy-validation>
  <input type="file" name="files" id="filefile" />
  <v-btn color="success" v-on:click.native="sdfsdfdsf">text</v-btn>
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
              <vue-csv-downloader
                :data="csvExport"
                :fields="fields"
                :downloadname="nameReport"
                v-if="showCSVDownload"
                :pdfblob="pdfBlob"
              >
              </vue-csv-downloader>
              <v-select v-if="buttonsShow"
                v-for="(button, btnIndex) in buttons" v-bind:key="btnIndex"
                :items="button['source']"
                :label="button['label']"
                v-model="buttonsVal"
                item-text="name"
                item-value="value"
                single-line
                style="float: right;"
                class="btn__chot"
                @change="doChotSoLieu($event, button)"
              ></v-select>
              <v-btn flat class="mx-0 my-0" v-if="customize" v-on:click.native="showConfig = !showConfig">
                <v-icon v-if="showConfig">reply</v-icon>
                <v-icon v-else>settings</v-icon> &nbsp;
                <span v-if="showConfig">Quay lại</span>
                <span v-else>Tuỳ chọn</span>
              </v-btn>
            </v-flex>
          </v-layout>
        </div>
      </div>
    </div>
    <v-layout row wrap class="filter_menu mt-4">
      <v-flex xs6 sm2 class="mx-3" v-if="agencyLists.length > 1">
        <v-autocomplete
          :items="agencyLists"
          v-model="govAgency"
          label="Chọn đơn vị"
          item-text="text"
          item-value="value"
          >
        </v-autocomplete>
      </v-flex>
      <v-flex xs6 sm2 class="mx-3" v-if="groupBy.length > 1">
        <v-autocomplete
          :items="groupBy"
          v-model="groupByVal"
          label="Nhóm dữ liệu"
          item-text="label"
          item-value="key"
          >
        </v-autocomplete>
      </v-flex>
      <v-flex xs12 sm2 class="mx-3" v-for="(item, indexTool) in filters" v-bind:key="indexTool">
        <datetime-picker
          v-if="item['type'] === 'date' && showPicker"
          v-model="data[item.key]" 
          :item="item" 
          :data-value="data[item.key]"
          :data-all="data"
          @change="reloadPickerChange(item.key)">
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
          item-value="value"
          item-text="name"
        ></v-select>
      </v-flex>
    </v-layout>
    <v-layout align-start justify-start row wrap class="filter_menu my-3 px-4" v-if="showConfig">
      <v-flex class="mx-2" v-for="(item, index) in itemsReportsConfig" v-bind:key="index">
        <v-checkbox v-if="!reportType.startsWith('STATISTIC')" @change="changeConfig(index)" v-model="selected" :label="item.text" :value="item.value"></v-checkbox>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <v-btn dark v-on:click.native="doCreateReport" color="blue darken-3">Tạo báo cáo</v-btn>
      </v-flex>
    </v-layout>
    <div>
      <vue-friendly-iframe v-if="pdfBlob !== null && pdfBlob !== undefined && pdfBlob !== ''" :src="pdfBlob"></vue-friendly-iframe>
      <div class="mx-2" v-if="showErrorData">
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
</v-form>
</template>

<script>
import VueFriendlyIframe from 'vue-friendly-iframe'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
pdfMake.vfs = pdfFonts.pdfMake.vfs
import DatetimePicker from './DatetimePicker.vue'
import CsvDownload from './CsvDownload.vue'

export default {
  props: ['index'],
  components: {
    'vue-friendly-iframe': VueFriendlyIframe,
    DatetimePicker,
    'vue-csv-downloader': CsvDownload
  },
  data: () => ({
    showPicker: true,
    showErrorData: false,
    showCSVDownload: false,
    csvExport: [],
    fields: [],
    valid: false,
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
    govAgency: 0,
    danhSachBaoCao: [],
    pdfBlob: null,
    isShowLoading: false,
    isCallData: false,
    nameReport: '',
    showConfig: false,
    filters: [],
    data: {},
    customize: false,
    groupBy: [],
    groupByVal: '',
    dataReportXX: '',
    buttons: [],
    buttonsVal: '',
    buttonsShow: false
  }),
  computed: {
    itemsReports () {
      return this.$store.getters.itemsReports
    },
    reportConfigStatic () {
      return this.$store.getters.reportConfigStatic
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
        vm.showErrorData = false
        vm.showCSVDownload = false
        vm.agencyLists = []
        vm.api = ''
        vm.filters = []
        vm.customize = false
        vm.data = {}
        vm.groupBy = []
        vm.itemsReportsConfig = []
        vm.dataReportXX = ''
        vm.buttons = []
        vm.buttonsVal = ''
        vm.buttonsShow = false
        vm.nameReport = vm.itemsReports[vm.index]['reportName']
        if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('reportConfig')) {
          vm.itemsReportsConfig = vm.itemsReports[vm.index]['filterConfig']['reportConfig']
        }
        if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('customize')) {
          vm.customize = vm.itemsReports[vm.index]['filterConfig']['customize']
        }
        if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('groupBy')) {
          vm.groupBy = vm.itemsReports[vm.index]['filterConfig']['groupBy']
          let defaultValGroup = vm.groupBy[0]['key']
          for (let keyGroup in vm.groupBy) {
            if (vm.groupBy[keyGroup]['selected']) {
              defaultValGroup = vm.groupBy[keyGroup]['key']
              break
            }
          }
          vm.groupByVal = defaultValGroup
        }
        if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('groupIds')) {
          vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['groupIds']
          if (vm.agencyLists.length > 0) {
            let defaultVal = vm.agencyLists[0]['value']
            for (let key in vm.agencyLists) {
              if (vm.agencyLists[key]['selected']) {
                defaultVal = vm.agencyLists[key]['value']
                break
              }
            }
            vm.govAgency = defaultVal
          }
        }
        if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('api')) {
          vm.api = vm.itemsReports[vm.index]['filterConfig']['api']
        }
        if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('filters')) {
          vm.filters = vm.itemsReports[vm.index]['filterConfig']['filters']
        }
        for (let key in vm.filters) {
          if (vm.filters[key]['type'] === 'select' || vm.filters[key]['type'] === 'date') {
            vm.data[vm.filters[key]['key']] = vm.filters[key]['value']
          }
        }
        if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('buttons')) {
          vm.buttons = vm.itemsReports[vm.index]['filterConfig']['buttons']
          if (vm.buttons.length > 0) {
            setTimeout(() => {
              vm.buttonsShow = true
            }, 100)
          }
        }
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
      vm.showErrorData = false
      vm.showCSVDownload = false
      vm.itemsReportsConfig = []
      vm.groupBy = []
      vm.customize = false
      vm.data = {}
      vm.api = ''
      vm.filters = []
      vm.report1Def = {}
      vm.dataReportXX = ''
      vm.buttons = []
      vm.buttonsVal = ''
      vm.buttonsShow = false
      vm.nameReport = vm.itemsReports[vm.index]['reportName']
      if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('reportConfig')) {
        vm.itemsReportsConfig = vm.itemsReports[vm.index]['filterConfig']['reportConfig']
      }
      if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('customize')) {
        vm.customize = vm.itemsReports[vm.index]['filterConfig']['customize']
      }
      if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('groupBy')) {
        vm.groupBy = vm.itemsReports[vm.index]['filterConfig']['groupBy']
        let defaultValGroup = vm.groupBy[0]['key']
        for (let keyGroup in vm.groupBy) {
          if (vm.groupBy[keyGroup]['selected']) {
            defaultValGroup = vm.groupBy[keyGroup]['key']
            break
          }
        }
        vm.groupByVal = defaultValGroup
      }
      if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('groupIds')) {
        vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['groupIds']
        if (vm.agencyLists.length > 0) {
          let defaultVal = vm.agencyLists[0]['value']
          for (let key in vm.agencyLists) {
            if (vm.agencyLists[key]['selected']) {
              defaultVal = vm.agencyLists[key]['value']
              break
            }
          }
          vm.govAgency = defaultVal
        }
      }
      if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('api')) {
        vm.api = vm.itemsReports[vm.index]['filterConfig']['api']
      }
      if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('filters')) {
        vm.filters = vm.itemsReports[vm.index]['filterConfig']['filters']
      }
      for (let key in vm.itemsReportsConfig) {
        vm.report1Def[vm.itemsReportsConfig[key]['value']] = vm.itemsReportsConfig[key]['text']
      }
      vm.reportType = vm.itemsReports[vm.index]['document']
      vm.pdfBlob = ''
      for (let key in vm.filters) {
        if (vm.filters[key]['type'] === 'select' || vm.filters[key]['type'] === 'date') {
          vm.data[vm.filters[key]['key']] = vm.filters[key]['value']
        }
      }
      if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('buttons')) {
        vm.buttons = vm.itemsReports[vm.index]['filterConfig']['buttons']
        if (vm.buttons.length > 0) {
          setTimeout(() => {
            vm.buttonsShow = true
          }, 100)
        }
      }
      if (vm.showConfig) {
        vm.showConfig = false
        setTimeout(() => {
          vm.showConfig = true
        }, 200)
      }
    }
  },
  methods: {
    doCreatePDF () {
      let vm = this
      if (vm.reportType.startsWith('STATISTIC')) {
        vm.doPrintReportFix()
      } else {
        vm.doDynamicReport()
      }
      vm.isCallData = true
    },
    doDynamicReport () {
      let vm = this
      vm.docDefinition = {}
      let docDString = {}
      vm.dataReportXX = ''
      docDString = JSON.stringify(vm.reportConfigStatic[vm.index]['docDefinition'])
      docDString = docDString.replace(/\[\$siteName\$\]/g, vm.$store.getters.siteName)
      for (let key in vm.filters) {
        let find = vm.filters[key]['key']
        let currentVal = vm.data[vm.filters[key]['key']]
        if (currentVal !== '' && currentVal !== undefined && currentVal !== null) {
          let dateStr = new Date(currentVal).toLocaleDateString('vi-VN')
          if (dateStr !== 'Invalid Date'&& String(currentVal).length === 13) {
            docDString = docDString.replace(eval('/\\[\\$' + find + '\\$\\]/g'), dateStr)
          } else {
            if (vm.filters[key]['type'] === 'select') {
              for (let keySource in vm.filters[key]['source']) {
                if (String(vm.filters[key]['source'][keySource]['value']) === String(currentVal)) {
                  currentVal = vm.filters[key]['source'][keySource]['name']
                }
              }
            }
            docDString = docDString.replace(eval('/\\[\\$' + find + '\\$\\]/g'), currentVal)
          }
        } else {
          currentVal = ''
          for (let keySource in vm.filters[key]['source']) {
            if (currentVal === '' || currentVal === '0') {
              currentVal = vm.filters[key]['source'][keySource]['name']
              break
            }
          }
          docDString = docDString.replace(eval('/\\[\\$' + find + '\\$\\]/g'), currentVal)
        }
      }
      vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['groupIds']
      for (let key in vm.agencyLists) {
        if (String(vm.agencyLists[key]['value']) === String(vm.govAgency)) {
          docDString = docDString.replace(/\[\$groupIds\$\]/g, vm.agencyLists[key]['text'])
          break
        }
      }
      vm.api = vm.itemsReports[vm.index]['filterConfig']['api']
      let widthsConfig = []
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
      let colLeng = 0
      for (let key in vm.itemsReportsConfig) {
        if (vm.itemsReportsConfig[key].hasOwnProperty('selected') && vm.itemsReportsConfig[key]['selected']) {
          colLeng = colLeng + 1
          widthsConfig.push('auto')
          // vm.docDefinition['content'][2]['table']['widths'].push('auto')
          let str1 = ' '
          if (vm.report1Def[vm.itemsReportsConfig[key]['value']] !== undefined && vm.report1Def[vm.itemsReportsConfig[key]['value']] !== null && vm.report1Def[vm.itemsReportsConfig[key]['value']] !== '') {
            str1 = vm.report1Def[vm.itemsReportsConfig[key]['value']]
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
      }
      vm.dataReportXX += headerTableReport.substring(0, headerTableReport.length - 1) + '],'
      vm.dataReportXX += header2TableReport.substring(0, header2TableReport.length - 1) + '],'
      // bild data
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
          let dataReport = result
          let dossierRaw = {}
          let dataReportCurrent = {}
          let dataReportTotal = ''
          let textGroup = ''
          for (let keyGroup in vm.groupBy) {
            if (String(vm.groupBy[keyGroup]['key']) === String(vm.groupByVal)) {
              textGroup = vm.groupBy[keyGroup]['display']
              break
            }
          }
          for (let key in dataReport) {
            dataReportCurrent = dataReport[key]
            if (dossierRaw[dataReportCurrent[vm.groupByVal]] !== '' && dossierRaw[dataReportCurrent[vm.groupByVal]] !== undefined) {
              if (dossierRaw[dataReportCurrent[vm.groupByVal]][textGroup] === dataReportCurrent[textGroup]) {
                dossierRaw[dataReportCurrent[vm.groupByVal]]['dossiers'].push(dataReportCurrent)
              }
            } else {
              let dossierRawItem = {}
              dossierRawItem[vm.groupByVal] = dataReportCurrent[vm.groupByVal]
              dossierRawItem[textGroup] = dataReportCurrent[textGroup]
              dossierRawItem['dossiers'] = []
              dossierRaw[dataReportCurrent[vm.groupByVal]] = dossierRawItem
              dossierRaw[dataReportCurrent[vm.groupByVal]][textGroup] = dataReportCurrent[textGroup]
              dossierRaw[dataReportCurrent[vm.groupByVal]]['dossiers'].push(dataReportCurrent)
            }
          }
          let dataToExportCSV = []
          for (let key in dossierRaw) {
            if (dossierRaw[key][vm.groupByVal] !== undefined && dossierRaw[key][vm.groupByVal] !== null && dossierRaw[key][vm.groupByVal] !== '') {
              let csvGroup = []
              csvGroup.push(dossierRaw[key][vm.groupByVal] + ' - ' + dossierRaw[key][textGroup])
              for (let colLengIndex in colLeng) {
                csvGroup.push('')
              }
              dataToExportCSV.push(csvGroup)
              dataReportTotal += JSON.stringify([{
                colSpan: colLeng + 1,
                text: dossierRaw[key][vm.groupByVal] + ' - ' + dossierRaw[key][textGroup],
                bold: true,
                style: 'tdStyle'
              }]) + ','
            }
            /*
            vm.docDefinition['content'][2]['table']['body'].push([{
              colSpan: val.length + 1,
              text: '- ' + domains[0]['services'][key]['serviceCode'] + ' - ' + domains[0]['services'][key]['serviceName'],
              bold: true,
              style: 'tdStyle'
            }])
            */
            let dossiersArray = dossierRaw[key]['dossiers']
            let indexStt = 1
            let dataRow = []
            for (let keyDossier in dossiersArray) {
              dataRow = []
              let dataToExportCSVItem = []
              let dossierObj = dossiersArray[keyDossier]
              dataToExportCSVItem.push(indexStt)
              dataRow.push({
                text: indexStt, 
                alignment: 'center',
                style: 'tdStyle'
              })
              for (let keyVal in vm.itemsReportsConfig) {
                if (vm.itemsReportsConfig[keyVal].hasOwnProperty('selected') && vm.itemsReportsConfig[keyVal]['selected']) {
                  let alignmentConfig = 'center'
                  if (vm.itemsReportsConfig[keyVal].hasOwnProperty('align')) {
                    alignmentConfig = vm.itemsReportsConfig[keyVal]['align']
                  }
                  let ddStr = ' '
                  if (dossierObj[vm.itemsReportsConfig[keyVal]['value']] !== undefined && dossierObj[vm.itemsReportsConfig[keyVal]['value']] !== null && dossierObj[vm.itemsReportsConfig[keyVal]['value']] !== '') {
                    ddStr = dossierObj[vm.itemsReportsConfig[keyVal]['value']]
                  }
                  dataToExportCSVItem.push(ddStr)
                  dataRow.push({
                    text: ddStr, 
                    alignment: alignmentConfig,
                    style: 'tdStyle'
                  })
                }
              }
              dataReportTotal += JSON.stringify(dataRow) + ','
              // vm.docDefinition['content'][2]['table']['body'].push(dataRow)
              indexStt = indexStt + 1
              dataToExportCSV.push(dataToExportCSVItem)
            }
          }
          dataReportTotal = dataReportTotal.substring(0, dataReportTotal.length - 1)
          vm.dataReportXX += dataReportTotal
          // }
          vm.csvExport = []
          vm.csvExport = dataToExportCSV
          vm.fields = []
          vm.fields.push('STT')
          for (let excelKey in vm.itemsReportsConfig) {
            if (vm.itemsReportsConfig[excelKey]['selected']) {
              let stringColumn = vm.itemsReportsConfig[excelKey]['value']
              if (vm.itemsReportsConfig[excelKey]['text'] !== '') {
                stringColumn = vm.itemsReportsConfig[excelKey]['text']
              }
              vm.fields.push(stringColumn)
            }
          }
          vm.showCSVDownload = true
          docDString = docDString.replace(/"\[\$tableWidth\$\]"/g, JSON.stringify(widthsConfig))
          docDString = docDString.replace(/"\[\$report\$\]"/g, vm.dataReportXX)
          vm.docDefinition = JSON.parse(docDString)
          let pdfDocGenerator = pdfMake.createPdf(vm.docDefinition)
          pdfDocGenerator.getBlob((blob) => {
            vm.pdfBlob = window.URL.createObjectURL(blob)
            vm.isShowLoading = false
          })
        } else {
          // vm.agencyLists = []
          vm.isShowLoading = false
          vm.showErrorData = true
        }
      })
    },
    doPrintReportFix () {
      let vm = this
      vm.agencyLists = []
      vm.api = ''
      vm.dataReportXX = ''
      vm.docDefinition = {}
      let docDString = {}
      docDString = JSON.stringify(vm.reportConfigStatic[vm.index]['docDefinition'])
      docDString = docDString.replace(/\[\$siteName\$\]/g, vm.$store.getters.siteName)
      for (let key in vm.filters) {
        let find = vm.filters[key]['key']
        let currentVal = vm.data[vm.filters[key]['key']]
        if (currentVal !== '' && currentVal !== undefined && currentVal !== null) {
          let dateStr = new Date(currentVal).toLocaleDateString('vi-VN')
          if (dateStr !== 'Invalid Date'&& String(currentVal).length === 13) {
            docDString = docDString.replace(eval('/\\[\\$' + find + '\\$\\]/g'), dateStr)
          } else {
            if (vm.filters[key]['type'] === 'select') {
              for (let keySource in vm.filters[key]['source']) {
                if (String(vm.filters[key]['source'][keySource]['value']) === String(currentVal)) {
                  currentVal = vm.filters[key]['source'][keySource]['name']
                }
              }
            }
            docDString = docDString.replace(eval('/\\[\\$' + find + '\\$\\]/g'), currentVal)
          }
        } else {
          currentVal = ''
          for (let keySource in vm.filters[key]['source']) {
            if (currentVal === '' || currentVal === '0') {
              currentVal = vm.filters[key]['source'][keySource]['name']
              break
            }
          }
          docDString = docDString.replace(eval('/\\[\\$' + find + '\\$\\]/g'), currentVal)
        }
      }
      vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['groupIds']
      for (let key in vm.agencyLists) {
        if (String(vm.agencyLists[key]['value']) === String(vm.govAgency)) {
          docDString = docDString.replace(/\[\$groupIds\$\]/g, vm.agencyLists[key]['text'])
          break
        }
      }
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
      let sumKey = vm.itemsReports[vm.index]['filterConfig']['sumKey']
      let selection = vm.itemsReports[vm.index]['filterConfig']['selection']
      let merge = vm.itemsReports[vm.index]['filterConfig']['merge']
      let sort = vm.itemsReports[vm.index]['filterConfig']['sort']
      let subKey = vm.itemsReports[vm.index]['filterConfig']['subKey']
      vm.$store.dispatch('getAgencyReportLists', filter).then(function (result) {
        if (result !== null) {
          let index = 1
          let dataRowTotal = []
          let totalText = 'Tổng số'
          if (sumKey === 'month') {
            totalText = 'Cả năm'
          }
          dataRowTotal.push({
            text: totalText, 
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
          
          // TODO
          let resultData = result
          if (selection !== undefined && selection !== null && selection.length > 0) {
            resultData = result.filter(function(obj) {
              let totalCHK = 0
              for (let keySe in selection) {
                if (selection[keySe]['compare'] === '#') {
                  if (String(obj[selection[keySe]['key']]) !== String(selection[keySe]['value'])) {
                    totalCHK = totalCHK + 1
                    // return obj
                  }
                } else if (selection[keySe]['compare'] === '=') {
                  if (selection[keySe]['value'] === '') {
                    if (String(obj[selection[keySe]['key']]) === '' || obj[selection[keySe]['key']] === undefined || obj[selection[keySe]['key']] === null) {
                      totalCHK = totalCHK + 1
                      // return obj
                    }
                  } else {
                    if (String(obj[selection[keySe]['key']]) === String(selection[keySe]['value'])) {
                      totalCHK = totalCHK + 1
                      // return obj
                    }
                  }
                } else {
                  if (String(obj[selection[keySe]['key']]) === '' || obj[selection[keySe]['key']] === undefined || obj[selection[keySe]['key']] === null) {
                    totalCHK = totalCHK + 1
                    // return obj
                  }
                }
              }
              if (totalCHK === selection.length) {
                return obj
              }
            })
          }
          let resultDataTotal = resultData.filter(function(obj) {
            if (subKey !== null && subKey !== undefined && subKey !== '') {
              if ((obj[sumKey] === '' || String(obj[sumKey]) === '0' || obj[sumKey] === undefined || obj[sumKey] === null) && obj[subKey] === '') {
                return obj
              }
            } else {
              if (obj[sumKey] === '' || String(obj[sumKey]) === '0' || obj[sumKey] === undefined || obj[sumKey] === null) {
                return obj
              }
            }
          })
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
                  if (String(parseInt(resultDataVari[keyVari][kkey])) === 'NaN') {
                    resultDataVari[keyVari][kkey] = resultData[key][kkey]
                  } else if (kkey === 'ontimePercentage') {
                    resultDataVari[keyVari][kkey] = parseInt(resultData[key][kkey])
                  } else if (kkey === 'month' || kkey === 'year') {
                    resultDataVari[keyVari][kkey] = parseInt(resultData[key][kkey])
                  } else {
                    resultDataVari[keyVari][kkey] = parseInt(resultData[key][kkey]) + parseInt(resultDataVari[keyVari][kkey])
                  }
                }
              }
            }
          }
          resultData = []
          for (let key in resultDataVari) {
            if (key !== undefined && !key.startsWith('undefined')) {
              resultData.push(resultDataVari[key])
            }
          }
          if (sort !== '' && sort !== undefined && sort !== null) {
            resultData = vm.sortByKey(resultData, sort)
          }
          if (subKey !== null && subKey !== undefined && subKey !== '') {
            let arraySubKey = {}
            for (let key in resultData) {
              if ((resultData[key][sumKey] !== '' && String(resultData[key][sumKey]) !== '0' && resultData[key][sumKey] !== undefined && resultData[key][sumKey] !== null) ||
                (subKey !== null && subKey !== undefined && subKey !== '' && resultData[key][subKey] === '' && resultData[key][sumKey] !== '' && resultData[key][sumKey] !== '0')) {
                if (arraySubKey[resultData[key]['domain']] !== undefined && arraySubKey[resultData[key]['domain']] !== null) {
                  arraySubKey[resultData[key]['domain']].push(resultData[key])
                } else {
                  arraySubKey[resultData[key]['domain']] = []
                  arraySubKey[resultData[key]['domain']].push(resultData[key])
                }
              }
            }
            resultData = []
            for (let key in arraySubKey) {
              let subKeySortData = vm.sortByKey(arraySubKey[key], subKey)
              for (let keyData in subKeySortData) {
                resultData.push(subKeySortData[keyData])
              }
            }
          }
          let dataToExportCSV = []
          for (let key in resultData) {
            let dataInput = resultData[key]
            if ((resultData[key][sumKey] !== '' && String(resultData[key][sumKey]) !== '0' && resultData[key][sumKey] !== undefined && resultData[key][sumKey] !== null) ||
                (subKey !== null && subKey !== undefined && subKey !== '' && resultData[key][subKey] === '' && resultData[key][sumKey] !== '' && String(resultData[key][sumKey]) !== '0')) {
              let dataRow = []
              let dataToExportCSVItem = []
              if (subKey !== null && subKey !== undefined && subKey !== '' && resultData[key][subKey] !== '') {
                dataToExportCSVItem.push('')
                dataRow.push({
                  text: '', 
                  alignment: 'center',
                  style: 'tdStyle'
                })
              } else {
                dataToExportCSVItem.push(index)
                dataRow.push({
                  text: index, 
                  alignment: 'center',
                  style: 'tdStyle'
                })
              }
              let indexTotal = 1
              for (let keyMapping in vm.itemsReportsConfig) {
                let currentConfig = vm.itemsReportsConfig[keyMapping]
                let dataText = ' '
                let preff = currentConfig.hasOwnProperty('prefix') ? currentConfig['prefix'] : ''
                if (currentConfig.hasOwnProperty('calculator')) {
                  dataText = Math.round(eval(currentConfig['calculator']))
                } else {
                  if (resultData[key][currentConfig['value']] !== undefined && resultData[key][currentConfig['value']] !== null) {
                    if (currentConfig.hasOwnProperty('subValue') && resultData[key][subKey] !== '') {
                      dataText =  ' - ' + resultData[key][currentConfig['subValue']] + ' '
                    } else {
                      dataText = preff + ' ' + resultData[key][currentConfig['value']] + ' '
                    }
                  }
                }
                let alignmentConfig = 'center'
                if (currentConfig.hasOwnProperty('align')) {
                  alignmentConfig = currentConfig['align']
                }
                dataToExportCSVItem.push(dataText)
                dataRow.push({
                  text: dataText, 
                  alignment: alignmentConfig,
                  style: 'tdStyle'
                })
                if (vm.govAgency === 0) {
                  if (dataRowTotal[indexTotal] !== null && dataRowTotal[indexTotal] !== undefined && dataRowTotal[indexTotal]['text'] !== '') {
                    if (currentConfig['value'] === 'ontimePercentage') {
                      dataRowTotal[indexTotal]['text'] = parseInt(dataText)
                    } else if (isNaN(dataText)) {
                      dataRowTotal[indexTotal]['text'] = ' '
                    } else {
                      dataRowTotal[indexTotal]['text'] = parseInt(dataRowTotal[indexTotal]['text']) + parseInt(dataText)
                    }
                  }
                }
                indexTotal = indexTotal + 1
              }
              if (subKey !== null && subKey !== undefined && subKey !== '' && resultData[key][subKey] !== '') {
                
              } else {
                index = index + 1
              }
              // vm.docDefinition['content'][2]['table']['body'].push(dataRow)
              vm.dataReportXX += JSON.stringify(dataRow) + ','
              dataToExportCSV.push(dataToExportCSVItem)
            }
          }
          if (vm.agencyLists.length > 0 && vm.govAgency === 0) {
            /*
            let resultDataVariTotal = {}
            for (let key in resultDataTotal) {
              let keyVari = ''
              for (let keysd in merge) {
                keyVari += resultDataTotal[key][merge[keysd]] + '_'
              }
              if (resultDataVariTotal[keyVari] === undefined || resultDataVariTotal[keyVari] === null || resultDataVariTotal[keyVari] === '') {
                resultDataVariTotal[keyVari] = resultDataTotal[key]
              } else {
                for (let kkey in resultDataVariTotal[keyVari]) {
                  if (resultDataVariTotal[keyVari][kkey] !== '' && resultDataVariTotal[keyVari][kkey] !== undefined && resultDataVariTotal[keyVari][kkey] !== null) {
                    if (String(parseInt(resultDataVariTotal[keyVari][kkey])) === 'NaN') {
                      resultDataVariTotal[keyVari][kkey] = resultDataTotal[key][kkey]
                    } else if (kkey === 'ontimePercentage') {
                      resultDataVariTotal[keyVari][kkey] = parseInt(resultDataVariTotal[keyVari][kkey])
                    } else {
                      resultDataVariTotal[keyVari][kkey] = parseInt(resultDataTotal[key][kkey]) + parseInt(resultDataVariTotal[keyVari][kkey])
                    }
                  }
                }
              }
            }
            resultDataTotal = []
            for (let key in resultDataVariTotal) {
              if (key === undefined || key === 'undefined_') {
                resultDataTotal.push(resultDataVariTotal[key])
              }
            }
            */
            for (let key in resultDataTotal) {
              let indexTotal = 1
              for (let keyMapping in vm.itemsReportsConfig) {
                let dataText = ''
                let currentConfig = vm.itemsReportsConfig[keyMapping]
                if (currentConfig.hasOwnProperty('calculator')) {
                  dataText = Math.round(eval(currentConfig['calculator']))
                } else if (resultDataTotal[key][currentConfig['value']] !== undefined && resultDataTotal[key][currentConfig['value']] !== null && resultDataTotal[key][currentConfig['value']] !== '') {
                  dataText = resultDataTotal[key][currentConfig['value']] + ' '
                }
                dataRowTotal[indexTotal]['text'] = parseInt(dataText) + ' '
                indexTotal = indexTotal + 1
              }
              break
            }
          } else {
            for (let key in resultDataTotal) {
              let indexTotal = 1
              for (let keyMapping in vm.itemsReportsConfig) {
                let dataText = ''
                let currentConfig = vm.itemsReportsConfig[keyMapping]
                if (currentConfig.hasOwnProperty('calculator')) {
                  dataText = Math.round(eval(currentConfig['calculator']))
                } else if (resultDataTotal[key][currentConfig['value']] !== undefined && resultDataTotal[key][currentConfig['value']] !== null && resultDataTotal[key][currentConfig['value']] !== '') {
                  dataText = resultDataTotal[key][currentConfig['value']] + ' '
                }
                dataRowTotal[indexTotal]['text'] = parseInt(dataText) + ' '
                indexTotal = indexTotal + 1
              }
            }
          }
          console.log('dataRowTotal: ', dataRowTotal)
          vm.dataReportXX += JSON.stringify(dataRowTotal)
          dataToExportCSV
          let itemTotal = []
          for (let keyTotalCSV in dataRowTotal) {
            itemTotal.push(dataRowTotal[keyTotalCSV]['text'])
          }
          dataToExportCSV.push(itemTotal)
          vm.csvExport = []
          vm.csvExport = dataToExportCSV
          vm.fields = []
          vm.fields.push('STT')
          vm.fields.push(sumKey)
          for (let excelKey in vm.itemsReportsConfig) {
            if (vm.itemsReportsConfig[excelKey]['selected']) {
              let stringColumn = vm.itemsReportsConfig[excelKey]['value']
              if (vm.itemsReportsConfig[excelKey]['text'] !== '') {
                stringColumn = vm.itemsReportsConfig[excelKey]['text']
              }
              vm.fields.push(stringColumn)
            }
          }
          vm.showCSVDownload = true
          docDString = docDString.replace(/"\[\$report\$\]"/g, vm.dataReportXX)
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
          vm.showErrorData = true
        }
      })
    },
    doCreateReport() {
      let vm = this
      if (vm.$refs.form.validate()) {
        vm.showConfig = false
        vm.doCreatePDF()
      }
    },
    sortByKey (array, key) {
      return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      })
    },
    changeConfig (index) {
      let vm = this
      if (vm.itemsReportsConfig[index].hasOwnProperty('selected')) {
        if (vm.itemsReportsConfig[index]['selected']) {
          vm.itemsReportsConfig[index]['selected'] = false
        } else {
          vm.itemsReportsConfig[index]['selected'] = true
        }
      } else {
        vm.itemsReportsConfig[index]['selected'] = true
      }
    },
    doChotSoLieu (dataSelect, button) {
      let vm = this
      let filter = {
        api: button['api'],
        key: button['key'],
        value: dataSelect,
        data: vm.data
      }
      vm.$store.dispatch('doChotSoLieu', filter).then(function () {
        vm.doCreatePDF()
      })
    },
    reloadPickerChange (key) {
      let vm = this
      console.log('key: ', key)
      console.log('dkdkdkkssss0002312312: ', vm.data[key])
      vm.showPicker = false
      setTimeout(() => {
        vm.data[key] = new Date(vm.data[key]).toLocaleDateString('vi-VN')
        vm.showPicker = true
      }, 200)
    },
    sdfsdfdsf () {
      let vm = this
      vm.$store.dispatch('doExportXlsxddd')
    }
  }
}
</script>
