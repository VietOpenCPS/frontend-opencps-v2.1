<template>
  <div>
    <div class="row-1" style="    background-size: cover !important;    padding-top: 0 !important;
    padding-bottom: 175px !important;">
      <div class="container">
        <div class="left">
          <div class="about">
            <p>Giới thiệu</p>
            <span>Hệ thống Dịch vụ công trực tuyến Tỉnh Phú Thọ<br>
  là hệ thống giao dịch điện tử các thủ tục hành chính<br>
  giữa Công dân, Doanh nghiệp và các Cơ quan nhà nước.</span></div>
  
          <div class="search">
            <div class="search-wrapper">
              <v-text-field
                v-model="keyword"
                solo
                placeholder="Nhập mã hồ sơ"
                append-icon="search"
                @click:append="() => ( 
                  this.$router.push({
                    path: '/tra-cuu-ho-so',
                    query: {
                      keyword: this.keyword
                    }
                  }) 
                )"
              ></v-text-field>
              <v-btn v-on:click.native="goToNopHoSo" class="mx-0" block color="amber darken-2" dark style="color: #fff;">Ấn vào đây để nộp hồ sơ trực tuyến <v-icon style="
                  position: absolute;
                  right: 5px;
                  font-size: 18px;
              ">assignment</v-icon></v-btn>
            </div>
          </div>
  
        </div>
  
        <div class="right" style="
    width: 100%;
">
          <div class="head">TÌNH HÌNH XỬ LÝ HỒ SƠ</div>
  
          <div class="body">
            <p>Năm {{ (new Date()).getFullYear() }}</p>
  
            <div class="numbers align-space-between">
              <div class="tiepnhan">
                <p>Đã tiếp nhận</p>
                <span id="da_tiep_nhan">{{daTiepNhan}}</span> <label>Hồ sơ</label></div>
  
              <div class="giaiquyet">
                <p>Đã giải quyết</p>
                <span id="da_giai_quyet">{{daGiaiQuyet}}</span> <label>Hồ sơ</label></div>
            </div>
  
            <div class="result">
              <p id="phan_tram">{{phanTram}}%</p>
              <span>Trong hạn</span></div>
          </div>
        </div>
      </div>
    </div>

    <div class="row-3" style="
    clear: both;
">
      <div class="sub-text px-2">Công dân, Doanh nghiệp khai thác Dịch vụ công trực tuyến tại Cổng Dịch vụ công trực tuyến hoặc khai thác trực tiếp tại Trung tâm Phục vụ Hành chính công</div>
    </div>
  
    <div style="clear: both;">
      
      <div class="container">
        <div class="chart-progress" v-if="showReport1">
          <apexchart type="line" height="525"
            :options="chartOptions" 
            :series="seriesChart" 
          ></apexchart>
        </div>
  
        <div class="chart-result" v-if="showReport2">
          <apexchart type="donut" 
            :options="donutOptions"
            :series="donutChart"
            :responsive="responsive"
          ></apexchart>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
  
  import Vue from 'vue'

  export default {
    props: [],
    data: () => ({
      keyword: '',
      daTiepNhan: 0,
      daGiaiQuyet: 0,
      phanTram: 0,
      currentYear: (new Date()).getFullYear(),
      gov_agency_code: '',
      showReport1: false,
      showReport2: false,
      chartOptions: {
        xaxis: {
          categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        },
        colors: ['#77B6EA', '#545454'],
        dataLabels: {
          enabled: true
        },
        stroke: {
          curve: 'smooth'
        },
        grid: {
          borderColor: '#e7e7e7',
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
          }
        },
        title: {
          text: 'TÌNH HÌNH GIẢI QUYẾT HỒ SƠ NĂM ' + (new Date()).getFullYear(),
          align: 'left'
        }
      },
      toolbar: {
        show: false
      },
      seriesChart: [{
        name: 'Series A',
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      }, {
        name: 'Series B',
        data: [23, 43, 54, 12, 44, 52, 32, 11]
      }],
      donutOptions: {
        labels: ['Đang xử lý còn hạn', 'Đang xử lý quá hạn', 'Đang bổ sung điều kiện', 'Đã giải quyết sớm hạn', 'Đã giải quyết đúng hạn', 'Đã giải quyết quá hạn', 'Rút không giải quyết'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 350
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      },
      donutChart: [0, 0, 0, 0, 0, 0, 0]
    }),
    created () {
      let vm = this
      vm.$nextTick(function () {
        $('.mWrapper > header').css('display', 'none')
        $('.mWrapper > nav').css('display', 'none')
        $('.mWrapper > footer').css('padding-bottom', '150px')
        $('.mWrapper > footer > .container > .left').css('width', '100%')
        $('.mWrapper > footer > .container > .right').css('width', '100%')
        $('body').css('min-width', 'unset')
        vm.doStaticsReport1()
      })
    },
    methods: {
      doStaticsReport1 () {
        let vm = this
        let filter = {
          year: vm.currentYear,
          reporting: true,
          agency: '',
          report: true
        }
        vm.showReport1 = false
        vm.$store.dispatch('getAgencyReportLists', filter).then(function (result) {
          let dataReport1 = []
          if (result === null || result === undefined || result === 'undefined') {
          } else {
            dataReport1 = result
          }
          vm.doProcessReport1(dataReport1)
        }).catch(function () {
        })
        let filterPie = {
          year: vm.currentYear,
          reporting: true,
          agency: 'total',
          report: true
        }
        vm.dataReport2 = false
        vm.$store.dispatch('getAgencyReportLists', filterPie).then(function (result) {
          let agencyLists = []
          if (result === null || result === undefined || result === 'undefined') {
          } else {
            vm.agencyLists = result
          }
          vm.dataReport2 = true
          vm.doProcessReport2(vm.agencyLists)
        }).catch(function () {
        })
        vm.daTiepNhan = 0
        vm.daGiaiQuyet = 0
        vm.phanTram = 0
        vm.$store.dispatch('getAgencyReportListsHomePage').then(function (result) {
          if (result === null || result === undefined || result === 'undefined') {
          } else {
            vm.daTiepNhan = result['receivedCount']
            vm.daGiaiQuyet = result['releaseCount']
            vm.phanTram = result['ontimePercentage']
          }
        })
      },
      doProcessReport2 (data) {
        let vm = this
        vm.donutChart = []
        for (let key in data) {
          if (data[key].hasOwnProperty('month') && data[key]['month'] === 0) {
            vm.donutChart = [data[key]['undueCount'], data[key]['overdueCount'], data[key]['waitingCount'], data[key]['betimesCount'], data[key]['ontimeCount'], data[key]['overtimeCount'], data[key]['cancelledCount']]
          }
        }
        vm.showReport2 = true
      },
      doProcessReport1 (data) {
        let vm = this
        let datasetsCustom = []
        let labelsCustomMonth = {}
        let monthData = {}
        let lineDataMonth = {}
        for (let key in data) {
          if (String(data[key].govAgencyCode) === '' && String(data[key].domainName) === '') {
          } else {
            if (data[key].month > 0) {
              labelsCustomMonth['' + data[key].month] = 'T ' + data[key].month
              if (vm.gov_agency_code === '' && data[key].govAgencyName !== '') {
                if (monthData[data[key].govAgencyName] !== null && monthData[data[key].govAgencyName] !== undefined) {
                  monthData[data[key].govAgencyName].push({
                    month: data[key].month,
                    total: data[key].undueCount + data[key].overdueCount + data[key].waitingCount + data[key].betimesCount + data[key].ontimeCount + data[key].overtimeCount
                  })
                } else {
                  monthData[data[key].govAgencyName] = []
                  monthData[data[key].govAgencyName].push({
                    month: data[key].month,
                    total: data[key].undueCount + data[key].overdueCount + data[key].waitingCount + data[key].betimesCount + data[key].ontimeCount + data[key].overtimeCount
                  })
                }
              }
            }
          }
        }
        let dataOfLine = {}
        for (let key in monthData) {
          let lineProcessData = {
            label: key,
            borderColor: '#' + vm.intToRGB(vm.hashCode(key)),
            backgroundColor: 'transparent',
            data: []
          }
          for (let keyArray in monthData[key]) {
            lineProcessData.data.push(monthData[key][keyArray].total)
          }
          datasetsCustom.push(lineProcessData)
        }
        vm.chartOptions.xaxis.categories = Object.values(labelsCustomMonth)
        vm.chartOptions.colors = []
        vm.seriesChart = []
        for (let key in datasetsCustom) {
          vm.seriesChart.push({
            name: datasetsCustom[key]['label'],
            data: datasetsCustom[key]['data'].reverse()
          })
          vm.chartOptions.colors.push(datasetsCustom[key]['borderColor'])
        }
        vm.showReport1 = true
      },
      hashCode (str) {
        var hash = 0
        for (var i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash)
        }
        return hash
      },
      intToRGB (i) {
        var c = (i & 0x00FFFFFF).toString(16).toUpperCase()
        return '00000'.substring(0, 6 - c.length) + c
      },
      goToNopHoSo () {
        window.location.href = '/web/cong-dich-vu-cong/thu-tuc-hanh-chinh'
      }
    }
  }
</script>
