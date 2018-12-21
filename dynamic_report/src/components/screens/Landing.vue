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
    <v-layout row wrap class="filter_menu mt-2">
      <v-flex xs6 sm2 class="px-2" v-if="agencyLists.length > 0">
        <v-autocomplete
          :items="agencyLists"
          v-model="govAgency"
          item-text="text"
          item-value="value"
          :hide-selected="true"
          @change="changeGov"
          >
        </v-autocomplete>
      </v-flex>
      <v-flex xs6 sm2 class="px-2" v-if="years.length > 0">
        <v-autocomplete
          :items="years"
          v-model="year"
          item-text="name"
          item-value="value"
          :hide-selected="true"
          @change="changeYear"
          >
        </v-autocomplete>
      </v-flex>
      <v-flex xs6 sm2 class="px-2" v-if="onlines.length > 0">
        <v-autocomplete
          :items="onlines"
          v-model="online"
          item-text="name"
          item-value="value"
          :hide-selected="true"
          @change="changeOnline"
          >
        </v-autocomplete>
      </v-flex>
      <v-flex xs6 sm1 class="px-2" v-if="fromDateShow">
        <v-subheader class="pl-0 text-header" style="float: right;">Từ ngày: </v-subheader>
      </v-flex>
      <v-flex xs6 sm2 class="px-2" v-if="fromDateShow">
        <v-layout wrap>
          <v-flex>
            <v-menu
              ref="menufromDate"
              :close-on-content-click="false"
              v-model="menufromDate"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <v-text-field
                placeholder="dd/mm/yyyy"
                slot="activator"
                v-model="fromDateFormatted"
                append-icon="event"
                @blur="fromDate = parseDate(fromDateFormatted)"
              ></v-text-field>
              <v-date-picker v-model="fromDate" no-title @input="changeFromDate"></v-date-picker>
            </v-menu>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs6 sm1 class="px-2" v-if="toDateShow">
        <v-subheader class="pl-0 text-header" style="float: right;">Đến ngày:</v-subheader>
      </v-flex>
      <v-flex xs6 sm2 class="px-2" v-if="toDateShow">
        <v-menu
          ref="menutoDate"
          :close-on-content-click="false"
          v-model="menutoDate"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
        >
          <v-text-field
            placeholder="dd/mm/yyyy"
            slot="activator"
            v-model="toDateFormatted"
            append-icon="event"
            @blur="toDate = parseDate(toDateFormatted)"
          ></v-text-field>
          <v-date-picker v-model="toDate" :min="toDateMin" no-title @input="changeToDate"></v-date-picker>
        </v-menu>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="filter_menu my-3 px-4" v-if="showConfig">
      <v-flex v-for="(item, index) in itemsReportsConfig" v-bind:key="index">
        <v-checkbox v-if="reportType !== 'REPORT_01' && !reportType.startsWith('STATISTIC')" v-model="selected" :label="item.text" :value="item.value"></v-checkbox>
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

export default {
  props: ['index'],
  components: {
    'vue-friendly-iframe': VueFriendlyIframe
  },
  data: () => ({
    api: '',
    onlines: [],
    online: '',
    itemsReportsConfig: [],
    report1Def: [],
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
    showConfig: false
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
        vm.years = []
        vm.onlines = []
        vm.fromDateShow = false
        vm.toDateShow = false
        vm.api = ''
        vm.nameReport = vm.itemsReports[vm.index]['reportName']
        vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['govAgencyCode']
        console.log('agencyLists: ', vm.agencyLists)
        vm.api = vm.itemsReports[vm.index]['filterConfig']['api']
        vm.years = vm.itemsReports[vm.index]['filterConfig']['year']
        vm.onlines = vm.itemsReports[vm.index]['filterConfig']['online']
        // vm.fromDateShow = vm.itemsReports[vm.index]['filterConfig']['fromDate']
        // vm.toDateShow = vm.itemsReports[vm.index]['filterConfig']['toDate']
        if (vm.itemsReports[vm.index]['filterConfig']['fromFinishDate'] || 
            vm.itemsReports[vm.index]['filterConfig']['fromReleaseDate'] ||
            vm.itemsReports[vm.index]['filterConfig']['fromReceiveNotDoneDate'] ||
            vm.itemsReports[vm.index]['filterConfig']['fromReceiveDate'] ||
            vm.itemsReports[vm.index]['filterConfig']['fromStatisticDate']) {
          vm.fromDateShow = true
        }
        if (vm.itemsReports[vm.index]['filterConfig']['toFinishDate'] || 
            vm.itemsReports[vm.index]['filterConfig']['toReleaseDate'] ||
            vm.itemsReports[vm.index]['filterConfig']['toReceiveNotDoneDate'] ||
            vm.itemsReports[vm.index]['filterConfig']['toReceiveDate'] ||
            vm.itemsReports[vm.index]['filterConfig']['toStatisticDate']) {
          vm.toDateShow = true
        }
        vm.itemsReportsConfig = []
        vm.itemsReportsConfig = vm.itemsReports[vm.index]['filterConfig']['reportConfig']
        vm.reportType = vm.itemsReports[vm.index]['document']
        if (vm.showConfig) {
          vm.showConfig = false
          setTimeout(() => {
            vm.showConfig = true
          }, 200)
        }
        /*
        for (let key in vm.itemsReports) {
          if (vm.itemsReports[key]['document'] === vm.reportType) {
            vm.agencyLists = vm.itemsReports[key]['filterConfig']['govAgencyCode']
            break
          }
        }
        console.log('itemsReports', vm.itemsReports)
        console.log('reportType', vm.reportType)
        console.log('agencyLists', vm.agencyLists)
        */
        vm.pdfBlob = ''
        let currentParams = vm.$router.history.current.params
        let currentQuerys = vm.$router.history.current.query
        if (currentQuerys.hasOwnProperty('fromDate')) {
          vm.fromDateFormatted = currentQuerys.fromDate
        } else {
          vm.fromDateFormatted = ''
          let date = new Date()
          vm.fromDateFormatted = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('vi-VN')
        }
        if (currentQuerys.hasOwnProperty('toDate')) {
          vm.toDateFormatted = currentQuerys.toDate
        } else {
          vm.toDateFormatted = ''
          vm.toDateFormatted = new Date().toLocaleDateString('vi-VN')
        }
      }, 500)
      /*
      setTimeout(() => {
        let currentParams = vm.$router.history.current.params
        let currentQuerys = vm.$router.history.current.query
        if (currentQuerys.hasOwnProperty('fromDate')) {
          vm.year = currentQuerys.fromDate ? '' : vm.year
          vm.fromDateFormatted = currentQuerys.fromDate
        } else {
          vm.fromDateFormatted = ''
          let date = new Date()
          vm.fromDateFormatted = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('vi-VN')
        }
        if (currentQuerys.hasOwnProperty('toDate')) {
          vm.year = currentQuerys.toDate ? '' : vm.year
          vm.toDateFormatted = currentQuerys.toDate
        } else {
          vm.toDateFormatted = ''
          vm.toDateFormatted = new Date().toLocaleDateString('vi-VN')
        }
        if (vm.toDateFormatted !== '' && vm.fromDateFormatted !== '') {
          vm.year = ''
        }
        vm.doCreatePDF(vm.selected)
        console.log('watch created')
      }, 200)
      */
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      console.debug(oldRoute)
      let currentQuery = newRoute.query
      if (currentQuery.hasOwnProperty('fromDate')) {
        vm.year = currentQuery.fromDate ? '' : vm.year
        vm.fromDateFormatted = currentQuery.fromDate
      } else {
        vm.fromDateFormatted = ''
        let date = new Date()
        vm.fromDateFormatted = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('vi-VN')
      }
      if (currentQuery.hasOwnProperty('toDate')) {
        vm.toDateFormatted = currentQuery.toDate
      } else {
        vm.toDateFormatted = ''
        vm.toDateFormatted = new Date().toLocaleDateString('vi-VN')
      }
      /*
      if (currentQuery.hasOwnProperty('toDate') && currentQuery.hasOwnProperty('fromDate') && currentQuery.fromDate !== '' && currentQuery.toDate !== '') {
        vm.doCreatePDF(vm.selected)
        console.log('watch route1')
      } else if (currentQuery.hasOwnProperty('toDate') && currentQuery.hasOwnProperty('fromDate') && currentQuery.fromDate === '' && currentQuery.toDate === '' && currentQuery.year !== '') {
        vm.doCreatePDF(vm.selected)
        console.log('watch route2')
      }
      */
      vm.nameReport = vm.itemsReports[vm.index]['reportName']
      vm.itemsReportsConfig = []
      vm.itemsReportsConfig = vm.itemsReports[vm.index]['filterConfig']['reportConfig']
      vm.reportType = vm.itemsReports[vm.index]['document']
      vm.pdfBlob = ''
      vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['govAgencyCode']
      vm.api = ''
      vm.api = vm.itemsReports[vm.index]['filterConfig']['api']
      vm.years = vm.itemsReports[vm.index]['filterConfig']['year']
      vm.onlines = []
      vm.onlines = vm.itemsReports[vm.index]['filterConfig']['online']
      // vm.fromDateShow = vm.itemsReports[vm.index]['filterConfig']['fromDate']
      // vm.toDateShow = vm.itemsReports[vm.index]['filterConfig']['toDate']
      if (vm.itemsReports[vm.index]['filterConfig']['fromFinishDate'] || 
          vm.itemsReports[vm.index]['filterConfig']['fromReleaseDate'] ||
          vm.itemsReports[vm.index]['filterConfig']['fromReceiveNotDoneDate'] ||
          vm.itemsReports[vm.index]['filterConfig']['fromReceiveDate'] ||
          vm.itemsReports[vm.index]['filterConfig']['fromStatisticDate']) {
        vm.fromDateShow = true
      }
      if (vm.itemsReports[vm.index]['filterConfig']['toFinishDate'] || 
          vm.itemsReports[vm.index]['filterConfig']['toReleaseDate'] ||
          vm.itemsReports[vm.index]['filterConfig']['toReceiveNotDoneDate'] ||
          vm.itemsReports[vm.index]['filterConfig']['toReceiveDate'] ||
          vm.itemsReports[vm.index]['filterConfig']['toStatisticDate']) {
        vm.toDateShow = true
      }
      if (vm.showConfig) {
        vm.showConfig = false
        setTimeout(() => {
          vm.showConfig = true
        }, 200)
      }
    },
    /*
    groupType (val) {
      console.debug(val)
      console.log('watch groupType')
      if (this.isCallData) {
        this.doCreatePDF(this.selected)
      }
    },
    selected (val) {
      console.log('watch selected')
      if (this.isCallData) {
        this.doCreatePDF(val)
      }
    },
    */
    fromDate (val) {
      this.toDateMin = val
      this.fromDateFormatted = this.formatDate(this.fromDate)
    },
    toDate (val) {
      this.toDateFormatted = this.formatDate(val)
    }
  },
  methods: {
    changeGov (item) {
      let vm = this
      vm.govAgency = item
      if (vm.govAgency === 0 || String(vm.govAgency) === '0') {
        vm.groupType = 'gov'
      } else {
        vm.groupType = 'domain'
      }
      vm.$router.push({
        path: '/bao-cao/' + vm.index,
        query: {
          year: vm.year,
          // month: vm.month,
          fromDate: vm.fromDateFormatted,
          toDate: vm.toDateFormatted,
          renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
        }
      })
    },
    changeYear (item) {
      let vm = this
      vm.year = item
      if (vm.year) {
        vm.fromDateFormatted = ''
        vm.toDateFormatted = ''
        vm.$router.push({
          path: '/bao-cao/' + vm.index,
          query: {
            year: vm.year,
            fromDate: '',
            toDate: '',
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      } else {
        let date = new Date()
        vm.$router.push({
          path: '/bao-cao/' + vm.index,
          query: {
            year: vm.year,
            fromDate: new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('vi-VN'),
            toDate: new Date().toLocaleDateString('vi-VN'),
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }
    },
    changeMonth (item) {
      let vm = this
      vm.month = item
      vm.$router.push({
        path: '/bao-cao/' + vm.index,
        query: {
          year: vm.year,
          month: vm.month,
          fromDate: vm.fromDate,
          toDate: vm.toDate,
          renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
        }
      })
    },
    changeFromDate () {
      let vm = this
      vm.menufromDate = false
      vm.fromDateFormatted = vm.formatDate(vm.fromDate)
      if (vm.fromDateFormatted && vm.toDateFormatted) {
        vm.$router.push({
          path: '/bao-cao/' + vm.index,
          query: {
            year: vm.year,
            month: vm.month,
            fromDate: vm.fromDateFormatted,
            toDate: vm.toDateFormatted,
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }
    },
    changeToDate () {
      let vm = this
      vm.menutoDate = false
      vm.toDateFormatted = vm.formatDate(vm.toDate)
      if (vm.fromDateFormatted && vm.toDateFormatted) {
        vm.$router.push({
          path: '/bao-cao/' + vm.index,
          query: {
            year: vm.year,
            // month: vm.month,
            fromDate: vm.fromDateFormatted,
            toDate: vm.toDateFormatted,
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }
    },
    formatDate (date) {
      if (!date) return null
      console.log('formatDate', date)
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    parseDate (date) {
      if (!date) return null
      console.log('parseDate', date)
      const [day, month, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    doCreatePDF (val) {
      let vm = this
      if (vm.reportType === 'REPORT_01') {
        vm.doPrintReport()
      } else if (vm.reportType.startsWith('STATISTIC')) {
        vm.doPrintReportFix()
      } else {
        vm.doDynamicReport(val)
      }
      vm.isCallData = true
    },
    doDynamicReport (val) {
      let vm = this
      let mappingData = []
      vm.agencyLists = []
      vm.years = []
      vm.api = ''
      vm.onlines = []
      vm.fromDateShow = false
      vm.toDateShow = false
      vm.docDefinition = {}
      let reportName = ''
      vm.docDefinition = JSON.parse(JSON.stringify(vm.itemsReports[vm.index]['tableConfig']['docDefinition']))
      mappingData = vm.itemsReports[vm.index]['filterConfig']['mappingData']
      vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['govAgencyCode']
      vm.api = vm.itemsReports[vm.index]['filterConfig']['api']
      vm.years = vm.itemsReports[vm.index]['filterConfig']['year']
      vm.onlines = vm.itemsReports[vm.index]['filterConfig']['online']
      vm.fromDateShow = vm.itemsReports[vm.index]['filterConfig']['fromDate']
      vm.toDateShow = vm.itemsReports[vm.index]['filterConfig']['toDate']
      reportName = vm.itemsReports[vm.index]['title']
      /*
      for (let key in vm.itemsReports) {
        if (vm.itemsReports[key]['document'] === vm.reportType) {
          console.log('doDynamic: ', vm.itemsReports[key])
          vm.docDefinition = JSON.parse(JSON.stringify(vm.itemsReports[key]['tableConfig']['docDefinition']))
          mappingData = vm.itemsReports[key]['filterConfig']['mappingData']
          vm.agencyLists = vm.itemsReports[key]['filterConfig']['govAgencyCode']
          break
        }
      }
      */
      if (vm.fromDateFormatted !== '' && vm.toDateFormatted !== '' && vm.year === '') {
        vm.docDefinition['content'][1]['text'][2]['text'] = 'Từ ngày ' + vm.fromDateFormatted + ' đến ngày ' + vm.toDateFormatted
      } else {
        vm.docDefinition['content'][1]['text'][2]['text'] = 'Năm: ' + vm.year
      }
      /*
      for (let key in vm.itemsReports) {
        if (vm.itemsReports[key]['code'] === String(vm.index)) {
          
          break
        }
      }
      */
      vm.docDefinition['content'][1]['text'][0]['text'] = 'BÁO CÁO ' + reportName + '\n'
      vm.docDefinition['content'][0]['columns'][0]['text'][0] = vm.$store.getters.siteName + '\n'
      vm.docDefinition['content'][2]['table']['widths'] = []
      vm.docDefinition['content'][2]['table']['widths'].push(30)
      let headerTableReport = []
      let header2TableReport = []
      headerTableReport.push({
        text: 'STT',
        alignment: 'center',
        bold: true
      })
      header2TableReport.push({
        text: '(1)',
        alignment: 'center',
        italics: true
      })
      let ine = 2
      for (let key in val) {
        vm.docDefinition['content'][2]['table']['widths'].push('auto')
        headerTableReport.push({
          text: vm.report1Def[val[key]],
          alignment: 'center',
          bold: true
        })
        header2TableReport.push({
          text: '(' + ine + ')',
          alignment: 'center',
          italics: true
        })
        ine = ine + 1
      }
      vm.docDefinition['content'][2]['table']['body'] = []
      vm.docDefinition['content'][2]['table']['body'].push(headerTableReport)
      vm.docDefinition['content'][2]['table']['body'].push(header2TableReport)
      // bild data
      let filter = {
        document: vm.reportType,
        fromDate: vm.fromDateFormatted,
        toDate: vm.toDateFormatted,
        year: vm.year
      }
      if (vm.govAgency) {
        filter['govAgency'] = vm.govAgency
        filter['agencyLists'] = vm.agencyLists
      }
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
            vm.docDefinition['content'][2]['table']['body'].push([{
              colSpan: val.length + 1,
              text: domains[0]['domainName'],
              bold: true,
              style: 'tdStyle'
            }])
            for (let key in domains[0]['services']) {
              vm.docDefinition['content'][2]['table']['body'].push([{
                colSpan: val.length + 1,
                text: '- ' + domains[0]['services'][key]['serviceCode'] + ' - ' + domains[0]['services'][key]['serviceName'],
                bold: true,
                style: 'tdStyle'
              }])
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
                  dataRow.push({
                    text: dossierObj[val[keyVal]], 
                    alignment: 'center',
                    style: 'tdStyle'
                  })
                }
                vm.docDefinition['content'][2]['table']['body'].push(dataRow)
                indexStt = indexStt + 1
              }
            }
          }
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
      let mappingData = []
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
        onlineStr = 'TRỰC TIẾP/TRỰC TUYẾN'
      }
      docDString = docDString.replace(/\[\$siteName\$\]/g, vm.$store.getters.siteName)
                             .replace(/\[\$fromDate\$\]/g, vm.fromDateFormatted)
                             .replace(/\[\$toDate\$\]/g, vm.toDateFormatted)
                             .replace(/\[\$online\$\]/g, onlineStr)
      mappingData = vm.itemsReports[vm.index]['filterConfig']['mappingData']
      vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['govAgencyCode']
      vm.api = vm.itemsReports[vm.index]['filterConfig']['api']
      /*
      for (let key in vm.itemsReports) {
        if (vm.itemsReports[key]['document'] === vm.reportType) {
          vm.docDefinition = JSON.parse(JSON.stringify(vm.itemsReports[key]['tableConfig']['docDefinition']))
          mappingData = vm.itemsReports[key]['filterConfig']['mappingData']
          vm.agencyLists = vm.itemsReports[key]['filterConfig']['govAgencyCode']
          break
        }
      }
      */
      vm.isShowLoading = true
      let filter = {
        document: vm.reportType,
        fromStatisticDate: vm.fromDateFormatted,
        toStatisticDate: vm.toDateFormatted,
        online: vm.online,
        api: vm.api
      }
      if (vm.govAgency) {
        filter['year'] = vm.year
        filter['govAgency'] = vm.govAgency
        filter['agencyLists'] = vm.agencyLists
      }
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
          for (let keyMapping in mappingData) {
            if (mappingData[keyMapping] === 'processCount' || mappingData[keyMapping] === 'releaseCount' || mappingData[keyMapping] === 'processingCount') {
              dataRowTotal.push({
                text: 0, 
                bold: true,
                alignment: 'center',
                style: 'tdStyle'
              })
            } else if (mappingData[keyMapping] === 'note') {
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
          for (let key in result) {
            let flag = false
            /*
            if (String(vm.govAgency) !== '0' && String(vm.govAgency) !== '' && String(vm.govAgency) !== '0') {
              if (result[key]['domainName'] !== '' && result[key]['domainName'] !== undefined && (result[key]['govAgencyName'] === undefined || result[key]['govAgencyName'] === '')) {
                flag = true
              } else {
                flag = false
              }
            } else {
              if (result[key]['govAgencyName'] !== '' && result[key]['govAgencyName'] !== undefined && (result[key]['domainName'] === undefined || result[key]['domainName'] === '')) {
                flag = true
              } else {
                flag = false
              }
            }
            */
            if (String(mappingData[0]) === 'govAgencyName') {
              if (result[key]['govAgencyName'] !== '' && result[key]['govAgencyName'] !== undefined && (result[key]['domainName'] === undefined || result[key]['domainName'] === '')) {
                flag = true
              } else {
                flag = false
              }
            } else if (String(mappingData[0]) === 'domainName') {
              if (result[key]['domainName'] !== '' && result[key]['domainName'] !== undefined && (result[key]['govAgencyName'] === undefined || result[key]['govAgencyName'] === '')) {
                flag = true
              } else {
                flag = false
              }
            } else if (String(mappingData[0]) === 'month') {
              if (result[key]['domainName'] !== '' && result[key]['domainName'] !== undefined && result[key]['govAgencyName'] !== undefined && result[key]['govAgencyName'] !== '') {
                flag = true
              } else {
                flag = false
              }
            }
            if (flag) {
              let dataRow = []
              dataRow.push({
                text: index, 
                alignment: 'center',
                style: 'tdStyle'
              })
              /*
              if (vm.groupType !== 'domain') {
                dataRow.push({
                  text: result[key]['govAgencyName'], 
                  alignment: 'center',
                  style: 'tdStyle'
                })
              } else {
                dataRow.push({
                  text: result[key]['domainName'], 
                  alignment: 'center',
                  style: 'tdStyle'
                })
              }
              */
              let indexTotal = 1
              for (let keyMapping in mappingData) {
                let dataText = ''
                if (result[key][mappingData[keyMapping]] !== undefined && result[key][mappingData[keyMapping]] !== null) {
                  dataText = result[key][mappingData[keyMapping]] + ' '
                }
                dataRow.push({
                  text: dataText, 
                  alignment: 'center',
                  style: 'tdStyle'
                })
                if (dataRowTotal[indexTotal] !== null && dataRowTotal[indexTotal] !== undefined && dataRowTotal[indexTotal]['text'] !== '') {
                  dataRowTotal[indexTotal]['text'] = parseInt(dataRowTotal[indexTotal]['text']) + parseInt(result[key][mappingData[keyMapping]])
                }
                indexTotal = indexTotal + 1
              }
              index = index + 1
              // vm.docDefinition['content'][2]['table']['body'].push(dataRow)
              dataRowI += JSON.stringify(dataRow)
            }
          }
          dataRowI += JSON.stringify(dataRowTotal)
          docDString = docDString.replace(/"\[\$report\$\]"/g, dataRowI)
          console.log('docDString: ', docDString)
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
    doPrintReport () {
      let vm = this
      let filter = {
        document: vm.reportType
      }
      if (vm.itemsReports[vm.index]['filterConfig']['fromFinishDate']) {
        filter['fromFinishDate'] = vm.fromDateFormatted
        filter['toFinishDate'] = vm.toDateFormatted
      }
      if (vm.itemsReports[vm.index]['filterConfig']['fromReleaseDate']) {
        filter['fromReleaseDate'] = vm.fromDateFormatted
        filter['toReleaseDate'] = vm.toDateFormatted
      }
      if (vm.itemsReports[vm.index]['filterConfig']['fromReceiveNotDoneDate']) {
        filter['fromReceiveNotDoneDate'] = vm.fromDateFormatted
        filter['toReceiveNotDoneDate'] = vm.toDateFormatted
      }
      if (vm.itemsReports[vm.index]['filterConfig']['fromReceiveDate']) {
        filter['fromReceiveDate'] = vm.fromDateFormatted
        filter['toReceiveDate'] = vm.toDateFormatted
      }
      if (vm.itemsReports[vm.index]['filterConfig']['fromStatisticDate']) {
        filter['fromStatisticDate'] = vm.fromDateFormatted
        filter['toStatisticDate'] = vm.toDateFormatted
      }
      filter['api'] = vm.api
      if (vm.reportType === 'REPORT_01') {
        filter['year'] = vm.year
      }
      if (vm.isDVC && vm.govAgency !== 0 && String(vm.govAgency) !== '0') {
        filter['agency'] = vm.govAgency
      } else if (vm.isDVC && (vm.govAgency === 0 || String(vm.govAgency) === '0')) {
        filter['agency'] = 'all'
      }
      vm.pdfBlob = null
      vm.isShowLoading = true
      vm.$store.dispatch('getAgencyReportLists', filter).then(function (result) {
        let putData = {}
        if (result !== null && result !== undefined) {
          putData = result
          if (filter['agency'] === 'all') {
            putData['flagAgency'] = 1
          } else {
            putData['flagAgency'] = 0
          }
          if (vm.reportType === 'REPORT_01') {
            putData['year'] = vm.year
            // putData['month'] = vm.month
            putData['fromStatisticDate'] = vm.fromDateFormatted
            putData['toStatisticDate'] = vm.toDateFormatted
          } else {
            putData['fromDate'] = vm.fromDateFormatted
            putData['toDate'] = vm.toDateFormatted
          }
          let filterPostData = {
            document: vm.reportType,
            data: putData
          }
          vm.$store.dispatch('doStatisticReportPrint', filterPostData).then(function (result) {
            vm.pdfBlob = result
            vm.isShowLoading = false
          })
        } else {
          // vm.agencyLists = []
          vm.isShowLoading = false
        }
      })
    },
    doExcelFunc () {
      let vm = this
      let filter = {
        document: vm.reportType,
        fromDate: vm.fromDateFormatted,
        toDate: vm.toDateFormatted
      }
      if (vm.reportType === 'REPORT_01') {
        filter['year'] = vm.year
      }
      if (vm.isDVC && vm.govAgency) {
        filter['agency'] = vm.govAgency['itemCode']
      } else if (vm.isDVC && !vm.govAgency) {
        filter['agency'] = 'all'
      }
      vm.$store.dispatch('getAgencyReportLists', filter).then(function (result) {
        let putData = {}
        if (result !== null && result !== undefined) {
          putData = result
          if (filter['agency'] === 'all') {
            putData['flagAgency'] = 1
          } else {
            putData['flagAgency'] = 0
          }
          if (vm.reportType === 'REPORT_01') {
            putData['year'] = vm.year
            putData['month'] = '0'
            putData['fromStatisticDate'] = vm.fromDateFormatted
            putData['toStatisticDate'] = vm.toDateFormatted
          } else {
            putData['fromDate'] = vm.fromDateFormatted
            putData['toDate'] = vm.toDateFormatted
          }
          putData['reportType'] = 'excel'
          let filterPostData = {
            document: vm.reportType,
            data: putData,
            download: true
          }
          vm.$store.dispatch('doStatisticReportPrint', filterPostData)
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
