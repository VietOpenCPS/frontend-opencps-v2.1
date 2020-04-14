<template>
  <div>
    <div class="text-center mt-5" v-if="String(serviceCode) !== '0' && !selectOption && !hasVerify">
      <v-progress-circular
        :size="100"
        :width="1"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <p class="mt-5">Đang tạo hồ sơ ...</p>
    </div>
    <div v-else>
      <div class="row-header no__hidden_class" style="padding-right:24px;">
        <div v-if="trangThaiHoSoList !== null" class="background-triangle-big">
          <span>DANH SÁCH THỦ TỤC HÀNH CHÍNH</span>
        </div>
        <div class="layout row wrap header_tools row-blue" v-if="!isMobile">
          <div class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
            <v-text-field
              v-model="serviceNameKey"
              placeholder="Tìm kiếm theo tên thủ tục"
              @keyup.enter="filterServiceName"
              
              hide-details="true"
            ></v-text-field>
          </div>
          <div class="flex text-right" style="margin-left: auto;max-width: 340px;">
              <div style="display: flex;align-items: center;justify-content: flex-end;">
                <v-chip label color="primary" class="my-0" text-color="white" style="height:38px;border-radius: 5px;">
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
                <v-btn small color="primary" @click="searchServiceConfig()">
                  <v-icon>search</v-icon>
                  Tìm kiếm
                </v-btn>
              </div>
          </div>
        </div> 
      </div>
      <v-layout wrap>
        <v-flex xs12  class="px-2">
          <v-layout wrap align-center>
            <v-flex xs8>

            </v-flex>
            <v-flex xs4 class="text-right">

            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12>
          <v-layout wrap class="pa-2">
            <v-flex xs12 class="px-2">
              <v-layout wrap align-center>
                <v-flex xs3><strong>Cấp cơ quan thực hiện</strong></v-flex>
                <v-flex xs9>    
                    <v-radio-group v-model="capCoQuanThucHien" row>
                      <v-radio label="Sở ban ngành" value="SBN"></v-radio>
                      <v-radio label="Thành phố, quận, huyện, thị xã" value="QUAN_HUYEN"></v-radio>
                      <v-radio label="Xã phường thị trấn" value="XA_PHUONG"></v-radio>
                    </v-radio-group>
                  </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-layout wrap>
                <v-flex xs6 class="pa-2" v-if="capCoQuanThucHien === 'XA_PHUONG'">
                  <v-autocomplete
                    class="select-border"
                    label="Quận, huyện, thị xã"
                    :items="listQuanHuyen"
                    v-model="administrationFilter"
                    :hide-selected="true"
                    item-text="itemName"
                    item-value="itemCode"
                    clearable
                    
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs6 class="pa-2">
                  <v-autocomplete
                    class="select-border"
                    :items="govAgencyList"
                    v-model="govAgencyFilter"
                    label="Chọn cơ quan"
                    item-text="itemName"
                    item-value="itemCode"
                    :hide-selected="true"
                    clearable
                    
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs6 class="pa-2">
                  <v-autocomplete
                    class="select-border"
                    :items="domainList"
                    v-model="domainFilter"
                    label="Chọn lĩnh vực"
                    item-text="domainName"
                    item-value="domainCode"
                    :hide-selected="true"
                    clearable
                    
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs6 class="pa-2">
                  <v-autocomplete
                    class="select-border"
                    label="Mức độ"
                    :items="listLerver"
                    v-model="leverFilter"
                    :hide-selected="true"
                    item-text="levelName"
                    item-value="level"
                    clearable
                    
                  ></v-autocomplete>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-divider class="my-0 py-0"></v-divider>
      <v-card v-if="!activeFilterKey && !serviceLastest">
        <v-card-text class="card__text__gov" v-for='(itemServiceConfig, index3) in serviceConfigListRender' :key='index3'>
          <!-- Cap 3 -->
          <v-layout row wrap>
            <v-flex xs12 sm9 class="pt-1">
              <span style="font-weight: bold">{{(agencyPage*numberPerPage - numberPerPage)+ index3 + 1}}.</span> &nbsp;
              <span>{{itemServiceConfig.serviceName}}</span>
            </v-flex>
            <v-flex xs12 sm1 class="text-xs-center pt-1">
              <span>Mức {{itemServiceConfig.maxLevel}}</span>
            </v-flex>
            <v-flex xs12 sm2 class="text-xs-center">
              <v-menu left offset-x>
                <v-btn flat class="mx-0 my-0" slot="activator" small 
                  @click="pullServiceOptions(itemServiceConfig)"
                >
                  Chọn
                </v-btn>
                <v-list v-if="serviceOptions.length > 1">
                  <v-list-tile v-for="(itemOption, i) in serviceOptions" :key="i" 
                    @click="selectServiceOption(itemOption, itemServiceConfig)">
                    <v-list-tile-title>{{ itemOption.optionName }}</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
      <v-card v-if="activeFilterKey || serviceLastest">
        <div v-if="serviceConfigListRender.length > 0">
          <v-card-text class="card__text__gov" v-for='(itemServiceConfig, index3) in serviceConfigListRender' :key='index3'>
            <!-- Cap 3 -->
            <v-layout row wrap>
              <v-flex xs12 sm9 class="pt-1">
                <span style="font-weight: bold">{{(agencyPage*numberPerPage - numberPerPage)+ index3 + 1}}.</span> &nbsp;
                <span>{{itemServiceConfig.serviceInfoName}}</span>&nbsp;
                <span v-if="itemServiceConfig.govAgencyNameRender" class="primary--text">({{itemServiceConfig.govAgencyNameRender}})</span>
              </v-flex>
              <v-flex xs12 sm1 class="text-xs-center pt-1">
                <span>Mức {{serviceLastest ? itemServiceConfig.serviceLevel : itemServiceConfig.level}}</span>
              </v-flex>
              <v-flex xs12 sm2 class="text-xs-center">
                <v-menu left offset-x>
                  <v-btn flat class="mx-0 my-0" slot="activator" small 
                    @click="pullServiceOptions(itemServiceConfig)"
                  >
                    Chọn
                  </v-btn>
                  <v-list v-if="serviceOptions.length > 1">
                    <v-list-tile v-for="(itemOption, i) in serviceOptions" :key="i" 
                      @click="selectServiceOption(itemOption, itemServiceConfig.govAgencyCode, itemServiceConfig)">
                      <v-list-tile-title>{{ itemOption.optionName }}</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </v-flex>
            </v-layout>
          </v-card-text>
        </div>
        <div v-else class="my-3 mx-2">
          <v-alert  color="warning" icon="priority_high" :value="true">
            Không có thủ tục nào
          </v-alert>
        </div>
      </v-card>
      <div class="my-2">
        <div class="text-xs-right layout wrap" style="position: relative;">
          <div class="flex pagging-table px-2"> 
            <tiny-pagination :total="serviceTotal" :page="agencyPage" :numberPerPage="numberPerPage" nameRecord="thủ tục" custom-class="custom-tiny-class" 
              @tiny:change-page="changePage" ></tiny-pagination> 
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
    </div>
    
  </div>
</template>

<script>
  import Captcha from './Captcha.vue'
  import toastr from 'toastr'
  import TinyPagination from './pagging/hanghai_pagination.vue'
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
      showFilter: false,
      capCoQuanThucHien: 'SBN',
      dialog_captcha: false,
      validCaptcha: false,
      govAgencyList: [],
      govAgencyFilter: '',
      domainList: [],
      domainListRender: [],
      domainFilter: '',
      administrationList: [],
      administrationFilter: '',
      leverFilter: '',
      panelAgency: [],
      panelDomain: [],
      govAgencies: [],
      govAgencyRender: [],
      serviceOptions: [],
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
      dialogVerifycation: false,
      verificationApplicantCreateDossier: false,
      hasVerify: false
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
      if (newQuery['domain']) {
        vm.domainFilter = newQuery['domain']
      }
      if (newQuery['agency']) {
        vm.govAgencyFilter = newQuery['agency']
      }
      if (String(vm.serviceCode) === '0') {
        vm.filterAndSort()
      }
      // 
      if (String(vm.serviceCode) !== '0') {
        let params = {
          service: vm.serviceCode
        }
        vm.$store.dispatch('getServiceConfigs', params).then( res => {
          vm.pullServiceOptions(res.data[0])
        })
      }
      vm.getServiceAdminisTration()
      vm.getDictcollections()
      vm.getLevers()
      vm.getAgencys(vm.capCoQuanThucHien)
      vm.getDomains()
    },
    updated () {
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        vm.filterAndSort()
      },
      serviceLastest (val) {
        let vm = this
        if (val) {
          vm.govAgencyFilter = ''
          vm.domainFilter = ''
          vm.serviceNameKey = ''
          vm.filterService()
        } else {
          vm.filterService()
        }
      },
      capCoQuanThucHien (val) {
        let vm = this
        if(val){
          vm.getAgencys(val)
        }
      }
    },
    methods: {
      changeFilteradministration () {
        let vm = this
        vm.govAgencyFilter = ''
        vm.serviceNameKey = ''
        vm.domainFilter = ''
        vm.activeFilterKey = false
        vm.serviceLastest = false
        console.log('vm.administrationFilter',vm.administrationFilter)
        if(vm.administrationFilter){
          vm.getAgencys(vm.administrationFilter)
        }
      },
      changeFilterAgency () {
        let vm = this
        vm.serviceNameKey = ''
        vm.domainFilter = ''
        vm.activeFilterKey = false
        vm.serviceLastest = false
        vm.filterService()
      },
      changeFilterDomain () {
        let vm = this
        vm.serviceNameKey = ''
        vm.activeFilterKey = false
        vm.serviceLastest = false
        vm.filterService()
      },
      filterServiceName () {
        let vm = this
        if (vm.serviceNameKey && vm.serviceNameKey.length > 5) {
          vm.govAgencyFilter = ''
          vm.domainFilter = ''
          vm.serviceLastest = false
          vm.activeFilterKey = true
          vm.filterService()
        } else {
          vm.govAgencyFilter = ''
          vm.domainFilter = ''
          vm.serviceNameKey = ''
          vm.serviceLastest = false
          vm.activeFilterKey = false
          vm.filterService()
        }
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
      filterService () {
        let vm = this
        setTimeout (function () {
          let current = vm.$router.history.current
          let newQuery = current.query
          let queryString = '?'
          newQuery['administration'] = vm.administrationFilter
          newQuery['agency'] = vm.govAgencyFilter
          newQuery['domain'] = vm.domainFilter
          newQuery['lever'] = vm.leverFilter
          if (vm.serviceLastest) {
            newQuery['lastest'] = vm.serviceLastest
          } else {
            newQuery['lastest'] = ''
          }
          newQuery['keyword'] = String(vm.serviceNameKey).trim()
          if (!vm.govAgencyFilter) {
            newQuery['page'] = 1
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
        }, 5)
      },
      filterAndSort () {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        if(!newQuery.hasOwnProperty('lastest')) {
          vm.agencyPage = newQuery.hasOwnProperty('page') && newQuery['page'] ? newQuery['page'] : 1
          console.log(' vm.agencyPage',  vm.agencyPage)

          let params = {
            start:  vm.agencyPage * vm.numberPerPage - vm.numberPerPage,
            end: vm.agencyPage * vm.numberPerPage,
            level: newQuery.hasOwnProperty('lever') && newQuery.agency ? newQuery.lever : '',
            agency: newQuery.hasOwnProperty('agency') && newQuery.agency ? newQuery.agency : '',
            domain: newQuery.hasOwnProperty('domain') && newQuery.domain ? newQuery.domain : '',
            keyword: newQuery.hasOwnProperty('keyword') && newQuery.keyword ? vm.convertString(newQuery.keyword) : '',
          }
          vm.$store.dispatch('getServiceConfigs', params).then(res => {
            vm.serviceTotal = res.total
            if(res.data){
              vm.serviceConfigListRender = res.data
            }
            else {
              vm.serviceConfigListRender = []
            }
          }).catch(() => {
            vm.serviceConfigListRender = []
          })
          if (newQuery.hasOwnProperty('agency') && newQuery.agency) {
            vm.domainListTemp = vm.domainList.filter(e => e.govAgencyCode === newQuery.agency)
          } else {
            vm.domainListTemp = vm.domainList
          }
        }
        if (newQuery.hasOwnProperty('lastest') && newQuery.lastest && String(newQuery.lastest) !== 'false') {
          vm.$store.dispatch('getServiceRecently').then(function (result) {
            if (result.length > 0) {
              let serviceConfigs = []
              for (let index in result) {
                if (Array.isArray(result[index]['serviceConfigs'])) {
                  for (let key in result[index]['serviceConfigs']) {
                    result[index]['serviceConfigs'][key].serviceInfoId = result[index]['serviceConfigs'][key]['serviceInfoId']
                    result[index]['serviceConfigs'][key].serviceInfoName = result[index]['serviceName']
                    result[index]['serviceConfigs'][key].govAgencyNameRender = result[index]['serviceConfigs'][key]['govAgencyName']
                    serviceConfigs.push(result[index]['serviceConfigs'][key])
                  }
                } else {
                  result[index]['serviceConfigs'].serviceInfoId = result[index]['serviceInfoId']
                  result[index]['serviceConfigs'].serviceInfoName = result[index]['serviceName']
                  serviceConfigs.push(result[index]['serviceConfigs'])
                }
              }
              vm.serviceConfigListRender = serviceConfigs
              console.log('serviceConfigListRender 2', vm.serviceConfigListRender)
            } else {
              vm.serviceConfigListRender = []
            }
          }).catch (function () {
            vm.serviceConfigListRender = []
          })
        }
        if (!vm.domainFilter && !vm.serviceNameKey) {
          if (vm.govAgencyRender.length === 1) {
            vm.panelAgency = [true]
            if (vm.govAgencyRender[0].domains.length === 1) {
              vm.panelDomain = []
              vm.panelDomain[0] = [true]
            } else {
              for (let key in vm.govAgencyRender[0].domains) {
                vm.panelDomain.push([])
                vm.panelDomain[key].push(false)
              }
              vm.panelDomain[0] = [true]
            }
          } else {
            for (let key in vm.govAgencyRender) {
              vm.panelAgency.push(false)
              vm.panelDomain.push([])
              if (vm.govAgencyRender[key].domains.length === 1) {
                vm.panelDomain[0] = [true]
              } else {
                for (let index in vm.govAgencyRender[key].domains[index]) {
                  vm.panelDomain[key].push(false)
                }
              }
            }
          }
        }
        // if(newQuery.hasOwnProperty('agency') && newQuery.agency) {
        //   vm.getDomains(newQuery.agency)
        // }
      },
      pullServiceOptions (item) {
        var vm = this
        console.log('service config', item)
        console.log('service config govAgencyCode', item.govAgencyCode)
        if (vm.verificationApplicantCreateDossier && vm.userLoginInfomation && vm.userLoginInfomation['verification'] && String(vm.userLoginInfomation['verification']) === '2') {
          vm.hasVerify = true
          setTimeout(function () {
            vm.dialogVerifycation = true
          }, 300)
        } else {
          vm.serviceConfigSelect = item
          vm.govAgencyCodeSelect = item.govAgencyCode
          vm.serviceInfoIdSelect = item.serviceInfoId
          vm.$store.dispatch('getServiceOpionByProcess', item).then(result => {
            if (result) {
              vm.serviceOptions = result
              console.log((String(vm.serviceCode) !== '0') || (result.length === 1 && String(vm.serviceCode) === '0'))
              if ((String(vm.serviceCode) !== '0') || (result.length === 1 && String(vm.serviceCode) === '0')) {
                vm.selectOption = false
                vm.$store.dispatch('getServiceInfo', {
                  serviceInfoId: item.serviceInfoId
                }).then(resServiceInfo => {
                  console.log('resultresultresult',result)
                  let data = {
                    serviceCode: resServiceInfo.serviceCode,
                    govAgencyCode: item.govAgencyCode,
                    templateNo: result[0].templateNo,
                    originality: vm.getOriginality(),
                    j_captcha_response: ''
                  }
                  console.log()
                  if (!vm.isOffLine) {
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
      selectServiceOption (item, itemServiceConfig) {
        var vm = this
        console.log('selectServiceOption', item)
        console.log('selectServiceOption', item.govAgencyCode)
        console.log('selectServiceOption', itemServiceConfig)
        vm.serviceConfigSelect = itemServiceConfig
        vm.govAgencyCodeSelect = itemServiceConfig.govAgencyCode
        vm.serviceInfoIdSelect = itemServiceConfig.serviceInfoId
        vm.loadingMutiple = true
        vm.$store.dispatch('getServiceInfo', {
          serviceInfoId: vm.serviceConfigSelect.serviceInfoId
        }).then(resServiceInfo => {
          let data = {
            serviceCode: resServiceInfo.serviceCode,
            govAgencyCode: itemServiceConfig.govAgencyCode,
            templateNo: item.templateNo,
            originality: vm.getOriginality(),
            j_captcha_response: ''
          }
          if (!vm.isOffLine) {
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
      getColor (level) {
        if (level === 2) {
          return 'green'
        } else if (level === 3) {
          return 'orange'
        } else if (level === 4) {
          return 'red'
        }
      },
      goBack () {
        window.history.back()
      },
      convertString(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
        str = str.replace(/đ/g, 'd')
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
        str = str.replace(/Đ/g, 'D')
        str = str.toLocaleLowerCase().replace(/\s/g, '')
        return str
      },
      getServiceAdminisTration () {
        let vm = this
        vm.$store.dispatch('getServiceAdminisTration', {}).then(
          res => {
            vm.administrationList = res
            vm.administrationFilter = res[0]['groupCode']
            vm.getAgencys(vm.administrationFilter)

          }
        ).catch(()=>{})
      },
      getDictcollections () {
        let vm = this
        let filter = {
          groupCode: 'QUAN_HUYEN'
        }
        vm.$store.dispatch('getDictcollections', filter).then(
          res => {
            vm.listQuanHuyen = res.data

          }
        ).catch(()=>{})
      },
      getLevers () {
        let vm = this

        vm.$store.dispatch('getLevers').then(
          res => {
            vm.listLerver = res.data

          }
        ).catch(()=>{})
      },
      getAgencys(administrationCode) {
        let vm = this
        let data = {
          administration: administrationCode ? administrationCode : ''
        }
        vm.$store.dispatch('getAgencys', data).then(
          res => {
              vm.govAgencyList = res
              // vm.govAgencyFilter = res[0]['itemCode']
              // vm.filterService()
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
      searchServiceConfig(){
        let vm = this
        if (vm.serviceNameKey && vm.serviceNameKey.length > 5) {
          vm.govAgencyFilter = ''
          vm.domainFilter = ''
          vm.serviceLastest = false
          vm.activeFilterKey = true
          vm.filterService()
        } else {
          vm.serviceLastest = false
          vm.activeFilterKey = false
          vm.filterService()
        }
      }
    }
  }
</script>
