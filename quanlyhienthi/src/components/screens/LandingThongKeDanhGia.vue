<template>
  <div class="py-0 kios-item">
    <div>
      <v-card color="transparent" flat style="">
        <div class="layout wrap">
          <div class="layout wrap flex" style="max-width: 500px;padding-left: 20px;top: 5px;">
            <img src="/documents/35417/0/quochuy.svg"
              style="width: 70px;height: 60px;max-width: 70px;display: flex;margin-top: 10px;">
            <div class="text-logo flex"
              style="display: inline-block;font-weight: 700;font-size: 20px;padding-top: 10px;padding-left: 20px;">
              <p style="color: #be4605;margin-bottom: 0px;">TRUNG TÂM PHỤC VỤ HÀNH CHÍNH CÔNG</p>
              <p style="color: #e11133;">TỈNH HẬU GIANG</p>
            </div>
          </div>
          <h4 class=" flex py-2 mx-3 text-xs-center" style="height: 120px;padding-top: 15px !important;">
            <span style="color: #903938; font-size: 1.7em !important;">
              <span>KẾT QUẢ ĐÁNH GIÁ MỨC ĐỘ HÀI LÒNG CÁN BỘ</span>
            </span>
            <!-- <p style="color: #903938; font-size: 1.7em !important;">
              <span>{{agencyFilter && agencyFilter[0] ? agencyFilter[0]['name'] : ''}}</span>
            </p> -->
          </h4>

          <div class="py-0 mx-3" style="width: 100%;">
            <v-btn v-if="siteTrungTam" style="position: absolute;right: 0; top: 0px" flat icon color="#903938" @click="showFilter = !showFilter">
              <v-icon>settings</v-icon>
            </v-btn>
            <v-layout wrap class="mb-3">
              <div v-show="showFilter" class="adv_search my-2 px-2" style="background: #eeeeee; margin: 0 auto;width: 100%">
                <div class="searchAdvanced-content py-3">
                  <v-layout wrap>
                    <v-flex xs12 class="mb-3 px-2">
                      <div>
                        <div class="d-inline-block text-bold" style="font-weight:450;width: 130px;">Đơn vị:</div>
                        <v-autocomplete
                          placeholder="Chọn đơn vị"
                          class="select-search d-inline-block"
                          style="width: calc(100% - 130px)"
                          :items="agencyList"
                          v-model="agencyFilter"
                          item-text="text"
                          item-value="code"
                          hide-details
                          hide-no-data
                          solo
                          flat
                          multiple
                          return-object
                          clearable
                        ></v-autocomplete>
                      </div>
                    </v-flex>
                    <v-flex xs12 class="mb-3 px-2" v-if="agencyFilter && agencyFilter.hasOwnProperty('parent')">
                      <div>
                        <div class="d-inline-block text-bold" style="font-weight:450;width: 130px;">Đơn vị xã, phường:</div>
                        <v-autocomplete
                          placeholder="Chọn đơn vị"
                          class="select-search d-inline-block"
                          style="width: calc(100% - 130px)"
                          :items="agencyListXa"
                          v-model="agencyFilterXa"
                          item-text="itemName"
                          item-value="itemCode"
                          hide-details
                          hide-no-data
                          solo
                          flat
                          height="32"
                          min-height="32"
                          return-object
                          clearable
                        ></v-autocomplete>
                      </div>
                    </v-flex>
                  </v-layout>
                  
                  <v-flex class="xs12 mx-2">
                    <v-btn :loading="loading" :style="loading ? 'pointer-events: none' : ''" class="mx-0 mb-0" color="primary" dark @click.native="getDanhSachCanBo">
                      <v-icon size="18">search</v-icon> &nbsp; Đồng ý
                    </v-btn>
                  </v-flex>
                </div>
              </div>
            </v-layout>
            <content-placeholders class="mt-3" v-if="loading">
              <content-placeholders-text :lines="15" />
            </content-placeholders>
            <div v-else>
              <div>
                  <div class="layout wrap" style="width: 100%;font-size: 16px;font-weight: 900;color: #fff;background-color: rgb(190, 70, 5);">
                    <div class="flex column header-item" style="width: 100px;max-width: 100px">STT</div>
                    <div class="flex column header-item">TÊN CÁN BỘ</div>
                    <div class="flex column header-item col-table-3" style="width: 250px;max-width: 250px">ẢNH CÁN BỘ</div>
                    <div class="flex column header-item header-item" style="width: 250px;max-width: 250px">RẤT HÀI LÒNG</div>
                    <div class="flex column header-item" style="width: 250px;max-width: 250px">HÀI LÒNG</div>
                    <div class="flex column header-item" style="width: 250px;max-width: 250px">KHÔNG HÀI LÒNG</div>
                  </div>
                  <VueSlickCarousel v-bind="settingSlick" v-if="danhSachCanBoDanhGia.length > 5">
                    <div v-for="(item, index) in danhSachCanBoDanhGia" :key="item.email" class="layout wrap container-table" 
                    :style=" index%2==1 ? 'width: 100%' : 'width: 100%;background: #dedede70'">
                      <div class="flex column col-table-1 body-item" style="width: 100px">{{index + 1}}</div>
                      <div class="flex column col-table-2 body-item">{{item.fullName}}</div>
                      <div class="flex column col-table-3 body-item">
                        <img :src="item.urlAvatar ? item.urlAvatar : '/o/hau-giang-theme/images/avatar-default.png'" alt="" style="width: 200px;height: 250px;">
                      </div>
                      <div class="flex column col-table-4 body-item" >
                        <p>{{item.percentVeryHappy ? item.percentVeryHappy : 0}}%</p>
                        <p>({{item.veryHappyCount ? item.veryHappyCount : 0}} lượt)</p>
                      </div>
                      <div class="flex column col-table-5 body-item" >
                        <p>{{item.percentHappy ? item.percentHappy : 0}}%</p>
                        <p>({{item.happyCount ? item.happyCount : 0}} lượt)</p>
                      </div>
                      <div class="flex column col-table-6 body-item" >
                        <p>{{item.percentUnHappy ? item.percentUnHappy : 0}}%</p>
                        <p>({{item.unHappyCount ? item.unHappyCount : 0}} lượt)</p>
                      </div>
                    </div>
                  </VueSlickCarousel>
                  <div v-if="danhSachCanBoDanhGia.length > 0 && danhSachCanBoDanhGia.length <= 5">
                    <div v-for="(item, index) in danhSachCanBoDanhGia" :key="item.email" class="layout wrap container-table" 
                      :style=" index%2==1 ? 'width: 100%' : 'width: 100%;background: #dedede70'">
                      <div class="flex column col-table-1 body-item" style="width: 100px">{{index + 1}}</div>
                      <div class="flex column col-table-2 body-item">{{item.fullName}}</div>
                      <div class="flex column col-table-3 body-item">
                        <img :src="item.urlAvatar ? item.urlAvatar : '/o/hau-giang-theme/images/avatar-default.png'" alt="" style="width: 200px;height: 250px;">
                      </div>
                      <div class="flex column col-table-4 body-item" >
                        <p>{{item.percentVeryHappy ? item.percentVeryHappy : 0}}%</p>
                        <p>({{item.veryHappyCount ? item.veryHappyCount : 0}} lượt)</p>
                      </div>
                      <div class="flex column col-table-5 body-item" >
                        <p>{{item.percentHappy ? item.percentHappy : 0}}%</p>
                        <p>({{item.happyCount ? item.happyCount : 0}} lượt)</p>
                      </div>
                      <div class="flex column col-table-6 body-item" >
                        <p>{{item.percentUnHappy ? item.percentUnHappy : 0}}%</p>
                        <p>({{item.unHappyCount ? item.unHappyCount : 0}} lượt)</p>
                      </div>
                    </div>
                  </div>
              </div>
              <!-- <v-flex xs12 v-else>
                <v-alert class="mt-3" :value="true" outline color="blue" icon="priority_high">
                  KHÔNG CÓ HỒ SƠ
                </v-alert>
              </v-flex> -->
            </div>
          </div>
        </div>

      </v-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
export default {
  props: [],
  components: {
    VueSlickCarousel
  },
  data: () => ({
    siteTrungTam: false,
    danhSachCanBoDanhGia: [],
    showFilter: false,
    statusList: [
      {name: "SẮP ĐẾN HẠN", value: 1},
      {name: "CÓ KẾT QUẢ", value: 2}
    ],
    statusFilter: 2,
    agencyListXa: [],
    agencyFilterXa: '',
    agencyList: [],
    agencyFilter: '',
    groupIdDonVi: '',
    loading: false,
    loadingAction: false,
    dossierNoKey: '',
    agencies: [],
    dossierList: [],
    totalPages: 0,
    currentDate: '',
    isOneGate: false,
    settingSlick: {
      "arrows": false,
      "dots": false,
      "vertical": true,
      "infinite": true,
      "slidesToShow": 15,
      "slidesToScroll": 15,
      "speed": 10000,
      "autoplay": true,
      "autoplaySpeed": 3000,
      "pauseOnFocus": true,
      "pauseOnHover": true,
      "cssEase": "linear"
    },
    timeOutRefresh: 300000
  }),
  computed: {

  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      try {
        vm.siteTrungTam = siteTrungTamConfig
      } catch (error) {
      }
      try {
        vm.agencyList = [
          {
              "value": 45022,
              "code": "STNMT",
              "text": "Sở Tài nguyên và Môi trường"
          },
          {
              "value": 45027,
              "code": "SXD",
              "text": "Sở Xây dựng"
          },
          {
              "value": 45032,
              "code": "SCT",
              "text": "Sở Công thương"
          },
          {
              "value": 45037,
              "code": "SGDDT",
              "text": "Sở Giáo dục và Đào tạo"
          },
          {
              "value": 45042,
              "code": "SGTVT",
              "text": "Sở Giao thông Vận tải"
          },
          {
              "value": 35730,
              "code": "SKHDT",
              "text": "Sở Kế hoạch và Đầu tư"
          },
          {
              "value": 45047,
              "code": "SKHCN",
              "text": "Sở Khoa học và Công nghệ"
          },
          {
              "value": 45052,
              "code": "SLDTBXH",
              "text": "Sở Lao động thương binh và Xã hội"
          },
          {
              "value": 45087,
              "code": "SNV",
              "text": "Sở Nội vụ"
          },
          {
              "value": 45082,
              "code": "SNNPTNT",
              "text": "Sở Nông nghiệp và Phát triển nông thôn"
          },
          {
              "value": 45057,
              "code": "STC",
              "text": "Sở Tài chính"
          },
          {
              "value": 45062,
              "code": "STTTT",
              "text": "Sở Thông tin và Truyền thông"
          },
          {
              "value": 45067,
              "code": "STP",
              "text": "Sở Tư pháp"
          },
          {
              "value": 45072,
              "code": "SVHTTDL",
              "text": "Sở Văn hoá Thể thao và Du lịch"
          },
          {
              "value": 45077,
              "code": "SYT",
              "text": "Sở Y tế"
          },
          {
              "value": 44898,
              "code": "BQLKKT",
              "text": "Ban Quản lý khu Nông nghiệp ứng dụng công nghệ cao"
          },
          {
              "value": 47439,
              "code": "BQLKCN",
              "text": "Ban Quản lý các khu công nghiệp"
          },
          {
              "value": 36001,
              "code": "VPT",
              "text": "Văn phòng UBND tỉnh"
          }
        ]
      } catch (error) {
      }
      try {
        let date1 = new Date()
        vm.currentDate = `${date1.getDate().toString().padStart(2, '0')}/${(date1.getMonth() + 1).toString().padStart(2, '0')}/${date1.getFullYear()}`
      } catch (error) {
      }
      let current = vm.$router.history.current
      let newQuery = current.query
      try {
        if (settingSlickConfig) {
          vm.settingSlick = settingSlickConfig
        }
        if (timeOutSetting) {
          vm.timeOutRefresh = timeOutSetting
        }
      } catch (error) {
      }
      if (vm.siteTrungTam) {
        vm.getDanhSachCanBo()
      } else {
        vm.searchDossier()
      }
    })
  },
  mounted () {
    let vm = this
    let currentQuery = vm.$router.history.current.query
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentQuery = newRoute.query
    }
  },
  methods: {
    getDanhSachCanBo () {
      let vm = this
      vm.danhSachCanBoDanhGia = []
      let dataCanBo = []
      let count = 0
      let agencyThongKe = []
      if (vm.agencyFilter && vm.agencyFilter.length) {
        agencyThongKe = vm.agencyFilter
      } else {
        agencyThongKe = vm.agencyList
      }
      agencyThongKe.forEach(element => {
        let param = {
          headers: {
            groupId: element.value
          },
          params: {
          }
        }
        axios.get('/o/rest/v2/employees/jobposcode/DANHGIA', param).then(function (response) {
          count += 1
          let serializable = response.data
          let dataRes = []
          if (serializable && serializable.length > 0) {
            dataRes = serializable
          }
          dataCanBo = dataCanBo.concat(dataRes)
          if (count == agencyThongKe.length) {
            vm.danhSachCanBoDanhGia = [].concat(dataCanBo)
            vm.getDanhSachKetQuaDanhGia()
          }
        }).catch(function (error) {
          count += 1
          if (count == agencyThongKe.length) {
            vm.danhSachCanBoDanhGia = [].concat(dataCanBo)
            vm.getDanhSachKetQuaDanhGia()
          }
        })
      });
    },
    getDanhSachKetQuaDanhGia () {
      let vm = this
      vm.dossierList = []
      let count = 0
      vm.agencyList.forEach(element => {
        let param = {
          headers: {
            groupId: element.value
          },
          params: {
            type: 2,
            fromDate: 1640995200000,
            toDate: (new Date()).getTime(),
            listGroupId: element.value,
            listGov: element.code
          }
        }
        axios.get('/o/rest/v2/votings/reportVE', param).then(function (response) {
          count += 1
          let serializable = response.data
          let dataRes = []
          if (serializable && serializable.length > 0) {
            dataRes = serializable
          }
          vm.dossierList = vm.dossierList.concat(dataRes)
          if (count == vm.agencyList.length) {
            if (vm.danhSachCanBoDanhGia.length) {
              for (let index = 0; index < vm.danhSachCanBoDanhGia.length; index++) {
                let element = vm.danhSachCanBoDanhGia[index]
                let indexEmp = vm.dossierList.findIndex(function (item) {
                  return item.employeeEmail == element.email
                })
                if (indexEmp !== -1) {
                  let item = Object.assign(element, vm.dossierList[indexEmp])
                  vm.$set(vm.danhSachCanBoDanhGia, index, item)
                } else {
                  let item = Object.assign(element, {
                    happyCount: 0,
                    percentHappy: 0,
                    percentUnHappy: 0,
                    percentVeryHappy: 0,
                    sumCount: 0,
                    unHappyCount: 0,
                    veryHappyCount: 0
                  })
                  vm.$set(vm.danhSachCanBoDanhGia, index, item)
                }
              }
            }
          }
        }).catch(function (error) {
          count += 1
          if (count == vm.agencyList.length) {
            if (vm.danhSachCanBoDanhGia.length) {
              for (let index = 0; index < vm.danhSachCanBoDanhGia.length; index++) {
                let element = vm.danhSachCanBoDanhGia[index]
                let indexEmp = vm.dossierList.findIndex(function (item) {
                  return item.employeeEmail == element.email
                })
                if (indexEmp !== -1) {
                  let item = Object.assign(element, vm.dossierList[indexEmp])
                  vm.$set(vm.danhSachCanBoDanhGia, index, item)
                } else {
                  let item = Object.assign(element, {
                    happyCount: 0,
                    percentHappy: 0,
                    percentUnHappy: 0,
                    percentVeryHappy: 0,
                    sumCount: 0,
                    unHappyCount: 0,
                    veryHappyCount: 0
                  })
                  vm.$set(vm.danhSachCanBoDanhGia, index, item)
                }
              }
            }
          }
        })
      });
    },
    searchDossier () {
      let vm = this
      let param = {
        headers: {
          groupId: window.themeDisplay.getScopeGroupId()
        },
        params: {
        }
      }
      axios.get('/o/rest/v2/employees/jobposcode/DANHGIA', param).then(function (response) {
        let serializable = response.data
        if (serializable && serializable.length > 0) {
          vm.danhSachCanBoDanhGia = serializable
        } else {
          vm.danhSachCanBoDanhGia = []
        }
        console.log('vm.danhSachCanBoDanhGia', vm.danhSachCanBoDanhGia)
        vm.getKetQuaDanhGia()
      }).catch(function (error) {
        vm.danhSachCanBoDanhGia = []
      })
      // 
    },
    getKetQuaDanhGia () {
      let vm = this
      vm.dossierList = []
      console.log('vm.agencyFilter', vm.agencyFilter)
      let param = {
        headers: {
          groupId: !vm.siteTrungTam ? window.themeDisplay.getScopeGroupId() : ''
        },
        params: {
          type: 2,
          fromDate: 1640995200000,
          toDate: (new Date()).getTime(),
          listGroupId: window.themeDisplay.getScopeGroupId(),
          listGov: ''
        }
      }
      vm.loading = true
      axios.get('/o/rest/v2/votings/reportVE', param).then(function (response) {
        vm.loading = false
        let serializable = response.data
        console.log('vm.dossierList', vm.dossierList)
        if (vm.danhSachCanBoDanhGia.length) {
          for (let index = 0; index < vm.danhSachCanBoDanhGia.length; index++) {
            let element = vm.danhSachCanBoDanhGia[index]
            let indexEmp = vm.dossierList.findIndex(function (item) {
              return item.employeeEmail == element.email
            })
            if (indexEmp !== -1) {
              let item = Object.assign(element, vm.dossierList[indexEmp])
              vm.$set(vm.danhSachCanBoDanhGia, index, item)
            } else {
              let item = Object.assign(element, {
                happyCount: 0,
                percentHappy: 0,
                percentUnHappy: 0,
                percentVeryHappy: 0,
                sumCount: 0,
                unHappyCount: 0,
                veryHappyCount: 0
              })
              vm.$set(vm.danhSachCanBoDanhGia, index, item)
            }
          }
          console.log('vm.danhSachCanBoDanhGia', vm.danhSachCanBoDanhGia)
        }
      }).catch(function (error) {
        vm.dossierList = []
        vm.loading = false
      })
    },
    getGroupIdArr (groupIds) {
      if (groupIds) {
        return groupIds.split(',')
      } else {
        return []
      }
    },
    getAgencyConfigs () {
      let vm = this
      let param = {
        headers: {
          groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
          Token: window.Liferay ? window.Liferay.authToken : ''
        }
      }
      
      let dataGet = {}
      let dataPost = new URLSearchParams()
      dataPost.append('method', 'GET')
      dataPost.append('serverCode', 'SERVER_DVC')
      dataPost.append('url', '/serverconfigs/GROUP_GOVAGENCY_MOTCUA')
      dataPost.append('data', JSON.stringify(dataGet))
      axios.post('/o/rest/v2/proxy', dataPost, param).then(function (response) {
        let serializable = response.data
        let configs = JSON.parse(serializable.configs)
        let agency = configs['govagency']
        vm.agencyList = agency
        // 
        try {
          vm.agencyFilter = JSON.parse(localStorage.getItem("agencyFilter"))
          vm.statusFilter = Number(localStorage.getItem("statusFilter"))
          vm.searchDossier()
        } catch (error) {
        }
        // 
      }).catch(function (xhr) {
      })
    },
    changeAgency () {
      let vm = this
      setTimeout(function () {
        vm.groupIdDonVi = vm.agencyFilter['value']
        if (vm.agencyFilter.hasOwnProperty('parent')) {
          vm.agencyListXa = []
          vm.agencyFilterXa = ''
          vm.getDonViXa()
        } else {
          vm.agencyListXa = []
          vm.agencyFilterXa = ''
        }
      }, 200)
    },
    getDonViXa () {
      let vm = this
      let filter = {
        parent: vm.agencyFilter['parent']
      }
      vm.$store.dispatch('getAgencysFromParent', filter).then(
        res => {
          vm.agencyListXa = res
        }
      ).catch(()=>{
        vm.agencyListXa = []
      }) 
    },
    goBack () {
      window.history.back()
    },
    changeScreen () {
      var vm = this
      vm.$store.commit('setFullScreen', !vm.fullScreen)
    },
    fromDate () {
      let value = new Date()
      return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()}`
    },
    toDate () {
      let value = new Date((new Date()).getTime() + 86400000)
      return `${(value.getDate()).toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()}`
    },
  }
}
</script>
