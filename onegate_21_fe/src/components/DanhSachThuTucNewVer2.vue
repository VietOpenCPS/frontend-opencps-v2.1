<template>
  <div>
    <div class="" v-if="String(serviceCode) !== '0' && !hasVerify">
      <v-dialog
        v-model="dialogLoadingCreate"
        persistent
        width="300"
        v-if="!selectOption"
      >
        <v-card
          color="primary"
          dark
        >
          <v-card-text>
            Đang tạo hồ sơ
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      
      <v-dialog v-else v-model="dialog_selectOption" scrollable persistent max-width="1000px">
        <v-card style="width: 100%">
          <v-toolbar flat dark color="primary">
            <v-toolbar-title>Chọn dịch vụ</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click.native="closeSelectOption()">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="pt-3">
            <v-layout class="py-2" wrap v-for="(item, index) in serviceOptionsProcess" :key="index" style="border-bottom: 1px solid #dedede;">
              <v-flex style="width: calc(100% - 110px)">
                <span>{{item.optionName}}</span>
              </v-flex>
              <v-flex style="width: 100px">
                <v-btn class="px-3 right" color="primary" @click="selectServiceOptionCRD(item, govAgencyCodeSelect)">
                  Chọn
                </v-btn>
              </v-flex>
              
            </v-layout>
          </v-card-text>
        </v-card>
      </v-dialog>
      
    </div>
    <div>
      <div class="row-header no__hidden_class">
        <div v-if="trangThaiHoSoList !== null" class="background-triangle-big">
          <span>DANH SÁCH THỦ TỤC HÀNH CHÍNH</span>
        </div>
        <div class="layout row wrap header_tools row-blue" v-if="!isMobile">
          <div class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
            <v-text-field
              v-model="serviceNameKey"
              placeholder="Tìm kiếm theo tên thủ tục"
              solo
              chips
              multiple
              deletable-chips
              item-value="value"
              item-text="text"
              @keyup.enter="filterService"
              content-class="adv__search__select"
              return-object
            ></v-text-field>
          </div>
          <div class="flex text-right" style="margin-left: auto;max-width: 50px;">
            <v-btn icon class="my-0 mx-2" v-on:click.native="filterService">
              <v-icon size="16">search</v-icon>
            </v-btn>
          </div>
        </div> 
      </div>
      <v-layout wrap>
        <div class="adv_search xs12 flex">
          <div class="searchAdvanced-content">
            <v-layout wrap class="white pt-3">
              <v-flex :style="!isMobile ? 'width:calc(100% - 220px)' : ''">
                <v-layout wrap class="">
                  <v-flex xs12 sm6 class="px-2">
                    <v-autocomplete
                      class="select-border"
                      :items="domainList"
                      v-model="domainFilter"
                      label="Chọn lĩnh vực"
                      item-text="domainName"
                      item-value="domainCode"
                      :hide-selected="true"
                      @change="filterService"
                      box
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs12 sm6 class="px-2">
                    <v-autocomplete
                      class="select-border"
                      :items="listLerver"
                      v-model="leverFilter"
                      label="Chọn mức độ"
                      item-text="levelName"
                      item-value="level"
                      :hide-selected="true"
                      clearable
                      @change="filterService"
                      box
                    ></v-autocomplete>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex style="width:210px" class="pl-2" v-if="!isMobile">
                <v-chip label color="primary" class="my-0" text-color="white" style="height:48px;border-radius: 5px;">
                  <v-checkbox
                    class="mt-0"
                    v-model="serviceLastest"
                    color="white"
                    hide-details
                  >
                    <template slot="label">
                      <div class="white--text">THỦ TỤC NỘP GẦN ĐÂY</div>
                    </template>
                  </v-checkbox>
                </v-chip>
              </v-flex>
            </v-layout>
          </div>
        </div>

      </v-layout>
      <v-divider class="my-0 py-0"></v-divider>
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="10" />
      </content-placeholders>
      <div v-if="!loading && loaded">
        <v-card v-if="!activeFilterKey && !serviceLastest">
          <div v-if="serviceConfigListRender.length > 0">
            <v-card-text class="pl-3 py-1 pr-0" v-for='(itemServiceConfig, index3) in serviceConfigListRender' :key='index3' style="border-bottom: 1px solid #dedede;">
              <v-layout row wrap>
                <v-flex class="pt-0" :style="!isMobile ? 'width:calc(100% - 240px)' : ''">
                  <span style="font-weight: bold">{{(agencyPage*numberPerPage - numberPerPage)+ index3 + 1}}.</span> &nbsp;
                  <span>{{itemServiceConfig.serviceName}}</span>
                </v-flex>
                <v-flex class="" style="width:190px" >
                  <v-btn class="mx-2 my-0 mt-0 white--text" depressed readonly small :color="getColor(itemServiceConfig.maxLevel)"
                    style="pointer-events: none;min-width: 90px;">Mức độ {{itemServiceConfig.maxLevel}}
                  </v-btn>
                  <v-menu class="right" left offset-x v-if="itemServiceConfig.serviceConfigs && serviceConfigs(itemServiceConfig.serviceConfigs).length === 1">
                    <v-btn color="primary" class="mx-2 my-0" slot="activator" small 
                      @click="pullServiceOptions(serviceConfigs(itemServiceConfig.serviceConfigs)[0], itemServiceConfig)" style="min-width: 90px;"
                    >
                      Chọn
                    </v-btn>
                    <v-list v-if="serviceOptions.length > 1">
                      <v-list-tile v-for="(itemOption, i) in serviceOptions" :key="i" 
                        @click="selectServiceOption(itemOption, serviceConfigs(itemServiceConfig.serviceConfigs)[0].govAgencyCode, serviceConfigs(itemServiceConfig.serviceConfigs)[0])">
                        <v-list-tile-title>{{ itemOption.optionName }}</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                  <v-btn small color="primary" class="mx-2 my-0 right" style="min-width: 90px;"
                    v-if="itemServiceConfig.serviceConfigs && serviceConfigs(itemServiceConfig.serviceConfigs).length > 1"
                    @click="showSelectGov(itemServiceConfig.serviceConfigs, itemServiceConfig)"
                  >
                    Chọn
                  </v-btn>
                  
                </v-flex>
              </v-layout>
            </v-card-text>
          </div>
          <div v-else class="my-3 mx-2">
            <v-alert
              :value="true"
              color="info"
              icon="info"
              outline
            >
                Không có thủ tục nào
            </v-alert>
          </div>
        </v-card>
        <v-card v-if="serviceLastest">
          <div v-if="serviceInfoLastestList.length > 0">
            <v-card-text class="pl-3 py-1 pr-2" v-for='(item, index) in serviceInfoLastestList' :key='index' style="border-bottom: 1px solid #dedede;">
              <v-layout row wrap>
                <v-flex :style="!isMobile ? 'width:calc(100% - 240px)' : ''">
                  <span style="font-weight: bold">{{(agencyPage*numberPerPage - numberPerPage)+ index + 1}}.</span> &nbsp;
                  <span>{{item.serviceName}}</span>
                </v-flex>
                <v-flex class="" style="width:190px" >
                  <v-btn class="mx-0 my-0 mt-0 white--text" depressed readonly small :color="getColor(item.maxLevel)"
                    style="pointer-events: none;min-width: 90px;">Mức độ {{item.maxLevel}}
                  </v-btn>
                  <v-menu class="right" left offset-x v-if="item.serviceConfigs && serviceConfigs(item.serviceConfigs).length === 1">
                    <v-btn color="primary" class="mx-0 my-0" slot="activator" small 
                      @click="pullServiceOptions(serviceConfigs(item.serviceConfigs)[0], item)" style="min-width: 90px;"
                    >
                      Chọn
                    </v-btn>
                    <v-list v-if="serviceOptions.length > 1">
                      <v-list-tile v-for="(itemOption, i) in serviceOptions" :key="i" 
                        @click="selectServiceOption(itemOption, serviceConfigs(item.serviceConfigs)[0].govAgencyCode, serviceConfigs(item.serviceConfigs)[0])">
                        <v-list-tile-title>{{ itemOption.optionName }}</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                  <v-btn small color="primary" class="mx-0 my-0 right" style="min-width: 90px;"
                    v-if="item.serviceConfigs && serviceConfigs(item.serviceConfigs).length > 1"
                    @click="showSelectGov(item.serviceConfigs, item)"
                  >
                    Chọn
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card-text>
          </div>
          <div v-else class="my-3 mx-2">
            <v-alert
              :value="true"
              color="info"
              icon="info"
              outline
            >
                Không có thủ tục nào
            </v-alert>
          </div>
        </v-card>
        <div class="my-2" v-if="serviceConfigListRender.length > 0 && !serviceLastest">
          <div class="text-xs-right layout wrap" style="position: relative;">
            <div class="flex pagging-table px-2"> 
              <tiny-pagination :total="serviceTotal" :page="agencyPage" :numberPerPage="numberPerPage" nameRecord="thủ tục" custom-class="custom-tiny-class" 
                @tiny:change-page="changePage" ></tiny-pagination> 
            </div>
          </div>
        </div>
        <!--  -->
        <div class="my-2" v-if="serviceInfoLastestList.length > 0 && serviceLastest">
          <div class="text-xs-right layout wrap" style="position: relative;">
            <div class="flex pagging-table px-2"> 
              <tiny-pagination :total="serviceLastestTotal" :page="serviceLastestPage" :numberPerPage="numberPerPage" nameRecord="thủ tục" custom-class="custom-tiny-class" 
                @tiny:change-page="changePageServiceLastest" ></tiny-pagination> 
            </div>
          </div>
        </div>
      </div>
      <v-dialog v-model="dialog_captcha" scrollable persistent max-width="700px">
        <v-card>
          <v-toolbar flat dark color="primary">
            <v-toolbar-title>Xác thực người dùng</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click.native="dialog_captcha = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form ref="formCaptcha" v-model="validCaptcha" lazy-validation>
              <v-layout wrap class="py-1 align-center row-list-style">
                <v-flex xs12>
                  <captcha ref="captcha"></captcha>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="mr-3" color="primary" @click="doCreateDossier"
            :loading="loadingAction"
            :disabled="loadingAction">
              <v-icon>done</v-icon> &nbsp;
              Đồng ý
              <span slot="loader">Loading...</span>
            </v-btn>
            <v-btn class="mr-3" color="primary" @click="dialog_captcha = false"
            :loading="loadingAction"
            :disabled="loadingAction">
              <v-icon>clear</v-icon> &nbsp;
              Hủy nộp hồ sơ
              <span slot="loader">Loading...</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogVerifycation" max-width="350">
        <v-card class="px-0">
          <v-card-title color="primary" class="headline">Yêu cầu xác minh tài khoản</v-card-title>
          <v-divider></v-divider>
          <v-card-text>Tài khoản chỉ được phép nộp tối đa 3 hồ sơ trực tuyến khi chưa được xác minh. Để tiếp tục nộp hồ sơ trực tuyến vui lòng mang chứng minh thư nhân dân/ thẻ căn cước đến Bộ phận tiếp nhận và trả kết quả để được xác minh.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="dialog = false">Đóng</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--  -->
      <v-dialog v-model="dialog_selectAgency" scrollable persistent max-width="700px">
        <v-card>
          <v-toolbar flat dark color="primary">
            <v-toolbar-title>Chọn cơ quan tiếp nhận</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click.native="dialog_selectAgency = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form ref="formSelect" v-model="validFormSelectGov" lazy-validation>
              <v-autocomplete
                class="mt-3"
                placeholder="Chọn cơ quan"
                :items="govAgencyListTiepNhan"
                v-model="govAgencyTiepNhanSelected"
                item-text="govAgencyName"
                item-value="govAgencyCode"
                clearable
                :rules="[v => !!v || 'Chọn cơ quan tiếp nhận']"
                required
                return-object
                @change="changeGovSelected"
              ></v-autocomplete>
              <v-autocomplete
                v-if="serviceOptions.length > 1"
                class="mt-3"
                placeholder="Chọn dịch vụ"
                :items="serviceOptions"
                v-model="serviceOptionsSelect"
                item-text="optionName"
                item-value="processOptionId"
                clearable
                :rules="[v => !!v || 'Chọn dịch vụ']"
                required
                return-object
              ></v-autocomplete>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="submitSelectGov">
              <v-icon size="20">save</v-icon>&nbsp; Đồng ý
            </v-btn>
            <v-btn class="white--text" color="red"  @click="dialog_selectAgency = false">
              <v-icon size="20">clear</v-icon>&nbsp; Thoát
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    
  </div>
</template>

<script>
  import Captcha from './Captcha.vue'
  import toastr from 'toastr'
  import TinyPagination from './pagging/opencps_pagination.vue'
  toastr.options = {
    'closeButton': true,
    'timeOut': '3000'
  }
  export default {
    props: ['serviceCode'],
    components: {
      'captcha': Captcha,
      'tiny-pagination': TinyPagination
    },
    data: () => ({
      dialog_selectAgency: false,
      validFormSelectGov: false,
      govAgencyListTiepNhan: [],
      govAgencyTiepNhanSelected: '',
      loading: false,
      loaded: false,
      validFormSearch: false,
      validSearch: false,
      showFilter: false,
      capCoQuanThucHien: 'SBN',
      dialog_captcha: false,
      validCaptcha: false,
      govAgencyList: [],
      govAgencyFilter: '',
      domainList: [],
      domainListRender: [],
      domainFilter: '',
      serviceCodeFilter: '',
      administrationList: [],
      administrationFilter: '',
      leverFilter: '',
      panelAgency: [],
      panelDomain: [],
      govAgencies: [],
      govAgencyRender: [],
      serviceOptions: [],
      serviceOptionsSelect: '',
      serviceConfigSelect: '',
      serviceConfigList: [],
      serviceConfigListRender: [],
      serviceInfoIdSelect: '',
      serviceOptionsProcess: [],
      listQuanHuyen: [],
      listLerver: [],
      selectOption: false,
      govAgencyCodeSelect: '',
      serviceNameKey: '',
      activeFilterKey: false,
      loadingMutiple: true,
      dataPostDossier: '',
      serviceLastest: false,
      numberPerPage: 10,
      agencyPage: 1,
      serviceTotal: 0,
      serviceLastestTotal: 0,
      serviceLastestPage: 1,
      dialogVerifycation: false,
      verificationApplicantCreateDossier: false,
      hasVerify: false,
      dialogLoadingCreate: true,
      dialog_selectOption: true,
      serviceInfoLastestList: []
    }),
    computed: {
      currentIndex () {
        return this.$store.getters.index
      },
      currentUser () {
        return this.$store.getters.loadingInitData.user
      },
      userLoginInfomation () {
        return this.$store.getters.getUserLogin
      },
      isMobile () {
        return this.$store.getters.getIsMobile
      }
    },
    created () {
      var vm = this
      //
      try {
        vm.verificationApplicantCreateDossier = hasVerificationCreateDossier
      } catch (error) {
      }
      // 
      let current = vm.$router.history.current
      let newQuery = current.query

      vm.domainFilter = newQuery['domain'] ? newQuery['domain'] : ''
      vm.leverFilter = newQuery['lever'] ? Number(newQuery['lever']) : ''
      vm.serviceNameKey = newQuery['keyword'] ? Number(newQuery['keyword']) : ''
      vm.serviceLastest = String(newQuery['lastest']) === 'true' ? true : false
      if (vm.domainFilter || vm.serviceLastest) {
        vm.filterAndSort()
      }

      if (String(vm.serviceCode) !== '0') {
        let params = {
          service: vm.serviceCode
        }
        vm.$store.dispatch('getServiceConfigs', params).then( res => {
          vm.pullServiceOptions(res.data[0])
        })
      }
      vm.getLevers()
      vm.getDomains()
    },
    updated () {
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let newQuery = newRoute.query
        
        vm.domainFilter = newQuery['domain'] ? newQuery['domain'] : ''
        vm.leverFilter = newQuery['lever'] ? Number(newQuery['lever']) : ''
        vm.serviceNameKey = newQuery['keyword'] ? Number(newQuery['keyword']) : ''
        vm.serviceLastest = String(newQuery['lastest']) === 'true' ? true : false
        if (vm.domainFilter || vm.serviceLastest) {
          vm.filterAndSort()
        }
      },
      serviceLastest (val) {
        let vm = this
        vm.filterService()
      },
      capCoQuanThucHien (val) {
        let vm = this
        if(val){
          vm.getAgencys(val)
        }
      }
    },
    methods: {
      changeFilterDomain () {
        let vm = this
      },
      changeFilterLevel () {
        let vm = this
      },
      filterServiceName () {
        let vm = this
      },
      changePage (config) {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        vm.agencyPage = config.page
        newQuery['page'] = ''
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null && newQuery[key] !== 'null') {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        queryString += 'page=' + vm.agencyPage
        vm.$router.push({
          path: current.path + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      },
      changePageServiceLastest (config) {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        vm.serviceLastestPage = config.page
        newQuery['page'] = ''
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null && newQuery[key] !== 'null') {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        queryString += 'page=' + vm.agencyPage
        vm.$router.push({
          path: current.path + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      },
      filterService () {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        if (vm.domainFilter || vm.serviceLastest) {
          setTimeout (function () {
            let queryString = '?'
            newQuery['domain'] = vm.domainFilter
            newQuery['keyword'] = String(vm.serviceNameKey).trim()
            newQuery['lever'] = vm.leverFilter
            newQuery['page'] = 1
            if (vm.serviceLastest) {
              newQuery['lastest'] = vm.serviceLastest
            } else {
              newQuery['lastest'] = ''
            }

            for (let key in newQuery) {
              if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
                queryString += key + '=' + newQuery[key] + '&'
              }
            }
            vm.$router.push({
              path: current.path + queryString,
              query: {
                renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
              }
            })
          }, 10)
        } else {
          if (vm.serviceLastest) {
            newQuery['lastest'] = vm.serviceLastest
          } else {
            newQuery['lastest'] = ''
          }
        }
        
      },
      filterAndSort () {
        let vm = this
        vm.loading = true
        vm.loaded = true
        let current = vm.$router.history.current
        let newQuery = current.query
        if(!newQuery.hasOwnProperty('lastest')) {
          vm.agencyPage = newQuery.hasOwnProperty('page') && newQuery['page'] ? Number(newQuery['page']) : 1
          let params = {
            start:  vm.agencyPage * vm.numberPerPage - vm.numberPerPage,
            end: vm.agencyPage * vm.numberPerPage,
            level: newQuery.hasOwnProperty('lever') && newQuery.lever ? newQuery.lever : '3,4',
            domain: newQuery.hasOwnProperty('domain') && newQuery.domain ? newQuery.domain : '',
            keyword: newQuery.hasOwnProperty('keyword') && newQuery.keyword ? newQuery.keyword : '',
          }
          vm.$store.dispatch('getServiceInfos', params).then(res => {
            vm.loading = false
            vm.serviceTotal = res.total
            if(res.data){
              vm.serviceConfigListRender = res.data
            }
            else {
              vm.serviceConfigListRender = []
            }
          }).catch(() => {
            vm.loading = false
            vm.serviceConfigListRender = []
          })
        }
        if (newQuery.hasOwnProperty('lastest') && newQuery.lastest && String(newQuery.lastest) !== 'false') {
          vm.serviceLastestPage = newQuery.hasOwnProperty('page') && newQuery['page'] ? Number(newQuery['page']) : 1
          let params = {
            start:  vm.serviceLastestPage * vm.numberPerPage - vm.numberPerPage,
            end: vm.serviceLastestPage * vm.numberPerPage
          }
          vm.$store.dispatch('getServiceRecently', params).then(function (result) {
            vm.loading = false
            vm.serviceLastestTotal = result.total
            vm.serviceInfoLastestList = result.data
          }).catch (function () {
            vm.loading = false
            vm.serviceInfoLastestList = []
            vm.serviceLastestTotal = 0
          })
        }

      },
      pullServiceOptions (item, serviceInfo) {
        var vm = this

        if (vm.verificationApplicantCreateDossier && vm.userLoginInfomation && vm.userLoginInfomation['verification'] && String(vm.userLoginInfomation['verification']) === '2') {
          vm.hasVerify = true
          setTimeout(function () {
            vm.dialogVerifycation = true
          }, 300)
        } else {
          vm.serviceConfigSelect = item
          vm.govAgencyCodeSelect = item.govAgencyCode
          vm.serviceInfoIdSelect = serviceInfo ? serviceInfo.serviceInfoId : item.serviceInfoId
          vm.$store.dispatch('getServiceOpionByProcess', item).then(result => {
            if (result) {
              vm.serviceOptions = result

              if (String(vm.serviceCode) === '0') {
                vm.selectOption = false
                if (result.length === 1) {
                  vm.$store.dispatch('getServiceInfo', {
                    serviceInfoId: vm.serviceInfoIdSelect
                  }).then(resServiceInfo => {
                    console.log('resultresultresult',result)
                    let data = {
                      serviceCode: resServiceInfo.serviceCode,
                      govAgencyCode: item.govAgencyCode,
                      templateNo: result[0].templateNo,
                      originality: vm.getOriginality(),
                      j_captcha_response: ''
                    }
                    if (!vm.isOffLine) {
                      vm.trackingBTTT(resServiceInfo.serviceCode)
                      vm.$store.dispatch('postDossier', data).then(function (result) {
                        vm.loadingAction = false
                        vm.indexAction = -1
                        vm.$router.push({
                          path: '/danh-sach-ho-so/' + 0 + '/ho-so/' + result.dossierId + '/NEW',
                          query: vm.$router.history.current.query
                        })
                      })
                    } else {
                      vm.dataPostDossier = data
                      vm.$refs.captcha.makeImageCap()
                      vm.dialog_captcha = true
                    }
                  })
                }
              } else {
                if (result.length === 1) {
                  vm.$store.dispatch('getServiceInfo', {
                    serviceInfoId: vm.serviceInfoIdSelect
                  }).then(resServiceInfo => {
                    console.log('resultresultresult',result)
                    let data = {
                      serviceCode: resServiceInfo.serviceCode,
                      govAgencyCode: item.govAgencyCode,
                      templateNo: result[0].templateNo,
                      originality: vm.getOriginality(),
                      j_captcha_response: ''
                    }
                    if (!vm.isOffLine) {
                      vm.trackingBTTT(resServiceInfo.serviceCode)
                      vm.$store.dispatch('postDossier', data).then(function (result) {
                        vm.loadingAction = false
                        vm.indexAction = -1
                        vm.$router.push({
                          path: '/danh-sach-ho-so/' + 0 + '/ho-so/' + result.dossierId + '/NEW',
                          query: vm.$router.history.current.query
                        })
                      })
                    } else {
                      vm.dataPostDossier = data
                      vm.$refs.captcha.makeImageCap()
                      vm.dialog_captcha = true
                    }
                  })
                } else {
                  vm.serviceOptionsProcess = result
                  vm.selectOption = true
                }
                
              }
            } else {
              vm.$store.dispatch('getServiceConfigDetail', item).then(result => {
                if (result.hasOwnProperty('serviceUrl') && result.serviceUrl) {
                  window.location.href = result.serviceUrl
                }
              }).catch(function(){})
            }
          }).catch(result => {
            vm.serviceOptions = []
          })
        }
      },
      selectServiceOption (item, govAgencyCodeSelect, itemServiceConfig) {
        let vm = this
        if (itemServiceConfig) {
          vm.serviceConfigSelect = itemServiceConfig
          vm.govAgencyCodeSelect = itemServiceConfig.govAgencyCode
        } else {
          vm.govAgencyCodeSelect = govAgencyCodeSelect.govAgencyCode
        }
        
        vm.loadingMutiple = true
        vm.$store.dispatch('getServiceInfo', {
          serviceInfoId: vm.serviceInfoIdSelect
        }).then(resServiceInfo => {
          let data = {
            serviceCode: resServiceInfo.serviceCode,
            govAgencyCode: itemServiceConfig ? itemServiceConfig.govAgencyCode : govAgencyCodeSelect.govAgencyCode,
            templateNo: item.templateNo,
            originality: vm.getOriginality(),
            j_captcha_response: ''
          }
          if (!vm.isOffLine) {
            vm.trackingBTTT(resServiceInfo.serviceCode)
            vm.$store.dispatch('postDossier', data).then(function (result) {
              vm.loadingAction = false
              vm.indexAction = -1
              vm.$router.push({
                path: '/danh-sach-ho-so/' + 0 + '/ho-so/' + result.dossierId + '/NEW',
                query: vm.$router.history.current.query
              })
            })
          } else {
            vm.dataPostDossier = data
            vm.$refs.captcha.makeImageCap()
            vm.dialog_captcha = true
          }
        })
      },
      pullServiceOptionsLastest (item) {
        let vm = this
        vm.$store.dispatch('getServiceOpionByProcess', item).then(result => {
          if (result) {
            vm.serviceOptions = result
          }
        })
      },
      doCreateDossier () {
        let vm = this
        vm.$refs.formCaptcha.resetValidation()
        let captchaInput = vm.$refs.captcha.j_captcha_response
        if (vm.$refs.formCaptcha.validate()) {
          vm.dataPostDossier['j_captcha_response'] = captchaInput
          vm.createDossier(vm.dataPostDossier)
        }
      },
      createDossier (data) {
        let vm = this
        if (vm.serviceConfigSelect.serviceUrl) {
          window.location.href = vm.serviceConfigSelect
        } else {
          vm.trackingBTTT(data.serviceCode)
          vm.$store.dispatch('postDossier', data).then(function (result) {
            if (result['status'] !== undefined && result['status'] === 203) {
              vm.loadingAction = false
              toastr.clear()
              toastr.error('Mã captcha không chính xác. Vui lòng thử lại')
              vm.$refs.captcha.makeImageCap()
            } else {
              vm.loadingAction = false
              vm.dialog_captcha = false
              vm.indexAction = -1
              vm.$router.push({
                path: '/danh-sach-ho-so/' + 0 + '/ho-so/' + result.data.dossierId + '/NEW',
                query: vm.$router.history.current.query
              })
            }
          }).catch (function (reject) {
            toastr.error('Nộp hồ sơ không thành công')
            vm.$refs.captcha.makeImageCap()
          })
        }
      },
      serviceConfigs (config) {
        if (Array.isArray(config)) {
          return config
        } else {
          if (config.hasOwnProperty('serviceConfigId')) {
            return [config]
          } else {
            return []
          }
        }
      },
      getColor (level) {
        if (level === 2) {
          return 'green'
        } else if (level === 3) {
          return 'orange darken-1'
        } else if (level === 4) {
          return 'red'
        }
      },
      goBack () {
        window.history.back()
      },
      getServiceAdminisTration () {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        vm.$store.dispatch('getServiceAdminisTration', {}).then(
          res => {
            vm.administrationList = res
            vm.capCoQuanThucHien = newQuery['administration'] ? newQuery['administration'] : res[0]['groupCode']
            vm.getAgencys(vm.capCoQuanThucHien)
          }
        ).catch(()=>{})
      },
      showSelectGov (govList, serviceInfo) {
        let vm = this
        vm.serviceInfoIdSelect = serviceInfo.serviceInfoId
        vm.govAgencyTiepNhanSelected = ''
        vm.serviceOptionsSelect = ''
        vm.govAgencyListTiepNhan = vm.serviceConfigs(govList)
        vm.dialog_selectAgency = true
      },
      changeGovSelected () {
        let vm = this
        setTimeout(function () {
          vm.pullServiceOptionsLastest(vm.govAgencyTiepNhanSelected)
        }, 100)
      },
      submitSelectGov () {
        let vm = this
        if (vm.$refs.formSelect.validate()) {
          vm.govAgencyTiepNhanSelected.serviceInfoId = vm.serviceInfoIdSelect
          if (vm.serviceOptions.length === 1) {
            vm.selectServiceOption(vm.serviceOptions[0], vm.govAgencyTiepNhanSelected)
          } else {
            vm.selectServiceOption(vm.serviceOptionsSelect, vm.govAgencyTiepNhanSelected)
          }
        }
      },
      // getDictcollections () {
      //   let vm = this
      //   let filter = {
      //     groupCode: 'QUAN_HUYEN'
      //   }
      //   vm.$store.dispatch('getDictcollections', filter).then(
      //     res => {
      //       vm.listQuanHuyen = res.data

      //     }
      //   ).catch(()=>{})
      // },
      getLevers () {
        let vm = this
        vm.$store.dispatch('getLevels').then(
          res => {
            vm.listLerver = res
          }
        ).catch(()=>{})
      },
      getAgencys(administrationCode) {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        let data = {
          administration: administrationCode ? administrationCode : ''
        }
        vm.$store.dispatch('getAgencys', data).then(
          res => {
            vm.govAgencyList = res
          }
        ).catch(()=>{
          vm.govAgencyList = []
        })      
      },
      getDomains(agencyCode) {
        let vm = this
        let data = {
          agency: agencyCode ? agencyCode : ''
        }
        vm.$store.dispatch('getDomains', data).then(
          res => {
            vm.domainList = res
          }
        ).catch(()=>{
          vm.domainList = []
        })      
      },
      closeSelectOption () {
        let vm = this
        vm.dialog_selectOption = false
        // vm.filterAndSort()
      },
      selectServiceOptionCRD (item, govAgencyCode) {
        var vm = this
        vm.$store.dispatch('getServiceInfo', {
          serviceInfoId: vm.serviceInfoIdSelect
        }).then(resServiceInfo => {
          vm.trackingBTTT(resServiceInfo.serviceCode)
          let data = {
            serviceCode: resServiceInfo.serviceCode,
            govAgencyCode: govAgencyCode,
            templateNo: item.templateNo,
            originality: vm.getOriginality()
          }
          vm.$store.dispatch('postDossier', data).then(function (result) {
            vm.loadingAction = false
            vm.indexAction = -1
            vm.$router.push({
              path: '/danh-sach-ho-so/' + 0 + '/ho-so/' + result.dossierId + '/NEW',
              query: vm.$router.history.current.query
            })
          })
        })
      },
      trackingBTTT (serviceCode) {
        try {
          console.log('trackDVC serviceCode', serviceCode)
          if (_govaq) {
            _govaq.push(['trackDVC', serviceCode, '1', ''])
          }
        } catch (error) { 
        }
      }
    }
  }
</script>
