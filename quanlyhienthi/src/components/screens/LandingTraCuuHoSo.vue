<template>
  <div class="py-0 kios-item">
    <div>
      <v-card color="transparent" flat style="">
        <div>
          <div class="layout wrap" style="position: absolute;width: 500px;padding-left: 20px;top: 5px;">
            <img src="/documents/35417/0/quochuy.svg"
              style="width: 70px;height: auto;max-width: 70px;display: flex;">
            <div class="text-logo flex"
              style="display: inline-block;font-weight: 700;font-size: 20px;padding-top: 10px;padding-left: 20px;">
              <p style="color: #be4605;margin-bottom: 0px;">TRUNG TÂM PHỤC VỤ HÀNH CHÍNH CÔNG</p>
              <p style="color: #e11133;">TỈNH HẬU GIANG</p>
            </div>
          </div>
          <h4 class="py-2 mx-3 text-xs-center" style="height: 120px;padding-top: 15px !important;">
            <span style="color: #903938; font-size: 1.5em !important;">
              <span v-if="statusFilter == 1">DANH SÁCH HỒ SƠ SẮP ĐẾN HẠN </span>
              <span v-if="statusFilter == 2">DANH SÁCH HỒ SƠ CÓ KẾT QUẢ </span>
              <span v-if="dossierList.length > 0">(TỔNG SỐ: {{dossierList.length}})</span>
            </span>
          </h4>

          <div class="py-0 mx-3">
            <v-btn style="position: absolute;right: 0; top: 0px" flat icon color="#903938" @click="showFilter = !showFilter">
              <v-icon>settings</v-icon>
            </v-btn>
            <v-layout wrap class="mb-3">
              <div v-if="showFilter" class="adv_search my-2 px-2" style="background: #eeeeee; margin: 0 auto;width: 100%">
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
                          return-object
                          @change="changeAgency"
                          multiple
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
                    <v-flex xs12 class="mb-3 px-2">
                      <div>
                        <div class="d-inline-block text-bold" style="font-weight:450;width: 130px;">Trạng thái:</div>
                        <v-autocomplete
                          placeholder="Chọn trạng thái hồ sơ"
                          class="select-search d-inline-block"
                          style="width: calc(100% - 130px)"
                          :items="statusList"
                          v-model="statusFilter"
                          item-text="name"
                          item-value="value"
                          hide-details
                          hide-no-data
                          solo
                          flat
                          height="32"
                          min-height="32"
                        ></v-autocomplete>
                      </div>
                    </v-flex>
                  </v-layout>
                  
                  <v-flex class="xs12 mx-2">
                    <v-btn :loading="loading" :style="loading ? 'pointer-events: none' : ''" class="mx-0 mb-0" color="primary" dark @click.native="searchDossier(true)">
                      <v-icon size="18">search</v-icon> &nbsp; Tìm kiếm
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
                  <div class="layout wrap" style="width: 100%;font-size: 16px;font-weight: 900;color: #903938 !important">
                    <div class="flex column header-item" style="width: 70px">STT</div>
                    <div class="flex column header-item" style="width: 270px">MÃ HỒ SƠ</div>
                    <div class="flex column header-item col-table-3" style="">CHỦ HỒ SƠ</div>
                    <div class="flex column header-item" style="width: 300px">ĐƠN VỊ XỬ LÝ</div>
                    <div class="flex column header-item header-item" style="width: 200px">NGÀY TIẾP NHẬN</div>
                    <div class="flex column header-item" style="width: 200px" v-if="statusFilter == 1">NGÀY HẸN TRẢ</div>
                    <div class="flex column header-item" style="width: 200px" v-if="statusFilter == 2">NGÀY CÓ KẾT QUẢ</div>
                  </div>
                  <VueSlickCarousel v-bind="settingSlick" v-if="dossierList.length > 0">
                    <div v-for="(item, index) in dossierList" :key="index" class="layout wrap container-table" 
                    :style=" index%2==1 ? 'width: 100%' : 'width: 100%;background: #dedede70'">
                      <div class="flex column col-table-1 body-item" style="width: 70px">{{index + 1}}</div>
                      <div class="flex column col-table-2 body-item" style="width: 270px">{{item.dossierNo}}</div>
                      <div class="flex column col-table-3 body-item">{{item.applicantName}}</div>
                      <div class="flex column col-table-6 body-item" style="width: 300px">{{item.govAgencyName}}</div>
                      <div class="flex column col-table-4 body-item" style="width: 200px">{{item.receiveDate ? String(item.receiveDate).split(' ')[0] : ''}}</div>
                      <div class="flex column col-table-5 body-item" style="width: 200px" v-if="statusFilter == 1">{{item.dueDate ? String(item.dueDate).split(' ')[0] : ''}}</div>
                      <div class="flex column col-table-5 body-item" style="width: 200px" v-if="statusFilter == 2">{{item.releaseDate ? String(item.releaseDate).split(' ')[0] : ''}}</div>
                    </div>
                  </VueSlickCarousel>
              </div>
              <!-- <v-flex xs12 v-else>
                <v-alert class="mt-3" :value="true" outline color="blue" icon="priority_high">
                  KHÔNG CÓ HỒ SƠ
                </v-alert>
              </v-flex> -->
            </div>
          </div>
        </div>
        <!-- <v-btn v-if="!isMobile" class="back-btn" @click="changeScreen" fab color="primary">
          <v-icon size="20" v-if="!fullScreen" dark>fullscreen</v-icon>
          <v-icon size="20" v-if="fullScreen" dark>fullscreen_exit</v-icon>
        </v-btn> -->
        <!-- <v-btn class="back-home" fab dark color="primary" @click="goHome"> 
          <v-icon style="font-size: 24px !important;" class="white--text">home</v-icon>
        </v-btn> -->

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
    headerTable: [
      {
        text: 'STT',
        align: 'center',
        sortable: false,
        width: '50px'
      },
      {
        text: 'Mã hồ sơ',
        align: 'center',
        sortable: false,
        width: '200px'
      },
      {
        text: 'Chủ hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Ngày nộp',
        align: 'center',
        sortable: false,
        width: '200px'
      },
      {
        text: 'Ngày có kết quả',
        align: 'center',
        sortable: false,
        width: '200px'
      }
    ],
    isOneGate: false,
    settingSlick: {
      "arrows": false,
      "dots": false,
      "vertical": true,
      "infinite": true,
      "slidesToShow": 3,
      "slidesToScroll": 3,
      "autoplay": true,
      "autoplaySpeed": 2000,
      "pauseOnDotsHover": true,
      "pauseOnFocus": true,
      "pauseOnHover": true
    },
    timeOutRefresh: 300000
  }),
  computed: {

  },
  created () {
    let vm = this
    vm.$nextTick(function () {
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
      vm.getAgencyConfigs()
      setInterval(function () {
        vm.searchDossier()
      }, vm.timeOutRefresh)
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
    searchDossier (reset) {
      let vm = this
      if (reset) {
        try {
          localStorage.setItem("agencyFilter", JSON.stringify(vm.agencyFilter))
          localStorage.setItem("statusFilter", JSON.stringify(vm.statusFilter))
        } catch (error) {
        }
      }
      if (!vm.agencyFilter || vm.agencyFilter.length === 0 || !vm.statusFilter) {
        return
      }
      vm.dossierList = []
      vm.loading = true
      // let filter = {
      //   groupId: '45062',
      //   start: 0,
      //   end: 100
      // }
      // if (vm.statusFilter == 1) {
      //   filter['top'] = 'coming'
      // }
      // if (vm.statusFilter == 2) {
      //   filter['status'] = 'done'
      // }
      // vm.$store.dispatch('getDossiers', filter).then(function (result) {
      //   vm.loading = false
      //   if (result.data) {
      //     vm.dossierList = result.data
      //   }
      //   console.log('vm.dossierList', vm.dossierList)
      // }).catch(reject => {
      //   vm.loading = false
      // })

      // 
      let promises = []
      for (let key in vm.agencyFilter) {       
        promises.push(axios.get("/o/rest/v2/dossiers", {
          headers: {
            groupId: vm.agencyFilter[key]['value'],
            Accept: 'application/json'
          },
          params: {
            start: 0,
            end: 500,
            order: true,
            status: vm.statusFilter == 2 ? 'releasing' : '',
            top: vm.statusFilter == 1 ? 'coming' : '',
            agency: vm.agencyFilter[key]['code']
          }
        }))
      
      }
      axios.all(promises)
      .then(axios.spread((...args) => {
        vm.loading = false
        let myObject = []
        for (let i = 0; i < args.length; i++) {
          let dataOutput = args[i]['data'].hasOwnProperty('total') ? args[i]['data']['data'] : args[i]['data']
          if (args[i]['data']['total'] > 0 || (!args[i]['data'].hasOwnProperty('total') && dataOutput)) {
            myObject = myObject.concat(dataOutput)
          }
        }
        if (myObject.length > 0) {
          vm.dossierList = myObject
        } else {
          vm.dossierList = []
        }
      })).catch(function () {
        vm.loading = false
      })
      // 
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
      dataPost.append('url', '/serverconfigs/GROUP_ID_SITE_MOTCUA')
      dataPost.append('data', JSON.stringify(dataGet))
      axios.post('/o/rest/v2/proxy', dataPost, param).then(function (response) {
        let serializable = response.data
        let configs = JSON.parse(serializable.configs)
        let agency = configs['groupIds']
        vm.agencyList = agency.filter(function (item) {
          return !item.hasOwnProperty('parent')
        })
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
