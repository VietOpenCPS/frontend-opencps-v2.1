<template>
  <div>
    <div class="row-1" style="    padding-bottom: 50px;">
      <div class="container align-space-between">
        <div class="left">
          <div class="about" style="margin-bottom: 25px;">
            <p>Giới thiệu</p>
            <span>Hệ thống Dịch vụ công trực tuyến Tỉnh Phú Thọ<br>
            là hệ thống giao dịch điện tử các thủ tục hành chính<br>
            giữa Công dân, Doanh nghiệp và các Cơ quan nhà nước.</span>
          </div>
  
          <div class="search">
            <div class="search-wrapper">
              <v-text-field v-model="keyword" solo placeholder="Nhập mã hồ sơ" append-icon="search" @click:append="goToSearch"></v-text-field>
              <v-btn v-on:click.native="goToNopHoSo" class="mx-0" block color="amber darken-2" dark style="color: #fff;">Ấn vào đây để nộp hồ sơ trực tuyến
                <v-icon style="
                    position: absolute;
                    right: 5px;
                    font-size: 18px;
                ">assignment</v-icon>
              </v-btn>
            </div>
          </div>
  
        </div>
  
        <div class="right" style="width: 300px;">
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
  
    <div class="row-2">
      <div class="container" style="padding: 0;"><img src="http://hanhchinhcong.phutho.gov.vn/o/parent-opencps-vue/images/img-home-1.png">
        <div class="align-middle">
          <a class="step align-middle" href=""> <img src="http://hanhchinhcong.phutho.gov.vn/o/parent-opencps-vue/images/img-home-2.png"> <span>Đăng ký<br> tài khoản</span> </a>
          <a class="step align-middle" href=""> <img src="http://hanhchinhcong.phutho.gov.vn/o/parent-opencps-vue/images/img-home-3.png"> <span>Đăng nhập và<br> khai báo hồ sơ</span> </a>
          <a class="step align-middle" href=""> <img src="http://hanhchinhcong.phutho.gov.vn/o/parent-opencps-vue/images/img-home-4.png"> <span>Thanh toán<br> phí, lệ phí</span> </a>
          <a class="step align-middle" href=""> <img src="http://hanhchinhcong.phutho.gov.vn/o/parent-opencps-vue/images/img-home-5.png"> <span>Nhận kết quả</span> </a>
        </div>
      </div>
    </div>
  
    <div class="row-3">
      <div class="sub-text px-2">Công dân, Doanh nghiệp khai thác Dịch vụ công trực tuyến tại Cổng Dịch vụ công trực tuyến hoặc khai thác trực tiếp tại Trung tâm Phục vụ Hành chính công</div>
      <div class="container">
      <div class="procedure align-middle align-space-between">
        <div class="col"><a class="box" href="/web/cong-dich-vu-cong/huong-dan?type=hd1#chi-tiet"><img src="http://hanhchinhcong.phutho.gov.vn/o/parent-opencps-vue/images/sm-img-1.png"> <span>Xem hướng dẫn<br> thủ tục hành chính</span> </a></div>
        <div class="col"><a class="box" href="/web/cong-dich-vu-cong/huong-dan?type=hd2#chi-tiet"><img src="http://hanhchinhcong.phutho.gov.vn/o/parent-opencps-vue/images/sm-img-2.png"> <span>Nộp hồ sơ và<br> thanh toán trực tuyến<br> tại Cổng Dịch vụ công</span> </a> <a class="box" href="/web/cong-dich-vu-cong/huong-dan?type=hd3#chi-tiet"> <img src="http://hanhchinhcong.phutho.gov.vn/o/parent-opencps-vue/images/sm-img-3.png"> <span>Nộp hồ sơ trực tiếp tại<br> Trung tâm Phục vụ<br> Hành chính công</span> </a></div>
        <div class="col"><a class="box" href="/web/cong-dich-vu-cong/huong-dan?type=hd4#chi-tiet"><img src="http://hanhchinhcong.phutho.gov.vn/o/parent-opencps-vue/images/sm-img-4.png"> <span>Theo dõi tiến trình<br> thụ lý hồ sơ</span> </a></div>
        <div class="col"><a class="box" href="/web/cong-dich-vu-cong/huong-dan?type=hd5#chi-tiet"><img src="http://hanhchinhcong.phutho.gov.vn/o/parent-opencps-vue/images/sm-img-5.png"> <span>Nhận kết quả trực tuyến</span> </a> <a class="box" href="/web/cong-dich-vu-cong/huong-dan?type=hd6#chi-tiet"> <img src="http://hanhchinhcong.phutho.gov.vn/o/parent-opencps-vue/images/sm-img-6.png"> <span>Nhận kết quả<br> tại nhà qua dịch vụ<br> chuyển phát nhanh</span> </a>      <a class="box" href="/web/cong-dich-vu-cong/huong-dan?type=hd7#chi-tiet"> <img src="http://hanhchinhcong.phutho.gov.vn/o/parent-opencps-vue/images/sm-img-7.png"> <span>Nhận kết quả<br> tại Trung tâm Phục vụ<br> Hành chính công</span> </a></div>
        <div class="col"><a class="box" href="/web/cong-dich-vu-cong/huong-dan?type=hd8#chi-tiet"><img src="http://hanhchinhcong.phutho.gov.vn/o/parent-opencps-vue/images/sm-img-8.png"> <span>Đánh giá cán bộ</span> </a></div>
      </div>
    </div>
    </div>

    <div class="row-4"> 
      <div class="container"> 
        <div class="chart-progress" v-if="showReport1">
          <div class="card" style="height: auto; border-radius: 0px;">
            <div class="card__title headline">
              TÌNH HÌNH GIẢI QUYẾT HỒ SƠ NĂM {{ (new Date()).getFullYear() }}
            </div>
            <div class="card__text pt-2 pb-0 pl-5 pr-4">

              <apexchart type="line" :options="chartOptions" :series="seriesChart"></apexchart>

            </div>
          </div>  
        </div> 
        <div class="chart-result" v-if="showReport2">
          <div class="card" style="height: auto; border-radius: 0px;">
            <div class="card__title headline">
              THEO DÕI TÌNH HÌNH GIẢI QUYẾT HỒ SƠ
            </div>
            <div class="card__text pt-2 pb-0 pl-5 pr-4">

              <apexchart type="donut" :options="donutOptions" :series="donutChart" :width="460" class="donutChartRight" style="overflow: hidden;height: 260px;"></apexchart>
              
              <v-layout row wrap>
                <v-flex style="font-size: 11px;padding: 4px 0;">
                  <span style="width: 15px;height: 15px;background: #A5D6A7;border-radius: 50%;display: block;position: absolute;"></span>
                  <span style="padding-left: 22px;">Đang xử lý còn hạn</span>
                </v-flex>
                <v-flex style="font-size: 11px;padding: 4px 0;">
                  <span style="width: 15px;height: 15px;background: #EF9A9A;border-radius: 50%;display: block;position: absolute;"></span>
                  <span style="padding-left: 22px;">Đang xử lý quá hạn</span>
                </v-flex>
                <v-flex style="font-size: 11px;padding: 4px 0;">
                  <span style="width: 15px;height: 15px;background: #78909C;border-radius: 50%;display: block;position: absolute;"></span>
                  <span style="padding-left: 22px;">Đang bổ sung điều kiện</span>
                </v-flex>
                <v-flex style="font-size: 11px;padding: 4px 0;">
                  <span style="width: 15px;height: 15px;background: #90CAF9;border-radius: 50%;display: block;position: absolute;"></span>
                  <span style="padding-left: 22px;">Đã giải quyết sớm hạn</span>
                </v-flex>
                <v-flex style="font-size: 11px;padding: 4px 0;">
                  <span style="width: 15px;height: 15px;background: #1565C0;border-radius: 50%;display: block;position: absolute;"></span>
                  <span style="padding-left: 22px;">Đã giải quyết đúng hạn</span>
                </v-flex>
                <v-flex style="font-size: 11px;padding: 4px 0;">
                  <span style="width: 15px;height: 15px;background: #C62828;border-radius: 50%;display: block;position: absolute;"></span>
                  <span style="padding-left: 22px;">Đã giải quyết quá hạn</span>
                </v-flex>
                <v-flex style="font-size: 11px;padding: 4px 0;">
                  <span style="width: 15px;height: 15px;background: #780ae8;border-radius: 50%;display: block;position: absolute;"></span>
                  <span style="padding-left: 22px;">Rút không giải quyết</span>
                </v-flex>
              </v-layout>

            </div>
          </div>    
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
      urlHome: '',
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
        colors: ['#A5D6A7', '#EF9A9A', '#78909C', '#90CAF9', '#1565C0', '#C62828', '#780ae8']
      },
      donutChart: [0, 0, 0, 0, 0, 0, 0]
    }),
    created () {
      let vm = this
      vm.$nextTick(function () {
        console.log('build chart')
        vm.doStaticsReport1()
        vm.urlHome = window.themeDisplay.getSiteAdminURL().split('~')[0].replace('group','web')
      })
    },
    methods: {
      goToSearch () {
        let vm = this
        window.location.href = vm.urlHome + '/kios#/tra-cuu-ho-so-homepage?keyword=' + vm.keyword
      },
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
          if (result === null || result === undefined || result === 'undefined') {} else {
            dataReport1 = result
          }
          console.log('dataReport1', dataReport1)
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
          if (result === null || result === undefined || result === 'undefined') {} else {
            agencyLists = result
          }
          vm.dataReport2 = true
          console.log(agencyLists)
          vm.doProcessReport2(agencyLists)
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
          if (String(data[key].govAgencyCode) === '' && String(data[key].domainName) === '') {} else {
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
