<template>
  <v-app class="onegate__fe" style="border: 1px solid #dedede;">
    <v-navigation-drawer app clipped floating width="240"
      :class='{"detail_state": detailState !== 0}' v-if="trangThaiHoSoList.length !== 0 && !isMobile"
    >
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="7" />
      </content-placeholders>
      <v-list v-else class="py-0 nav_trang_thai_ho_so">
        <v-list-group
          v-for="(item, index) in trangThaiHoSoList"
          v-model="item.active"
          :key="index"
          :prepend-icon="item['icon'] ? item['icon'] : 'description'"
          :append-icon="item.hasOwnProperty('items') ? '' : ''"
          no-action
          ref="listGroupCustom"
        >
          <v-list-tile slot="activator"
            @click="toTableIndexing(item, index)" >
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <span v-if="item.hasOwnProperty('counter') && item['counter'] > -1 && item['menuType'] !== 3" class="status__counter_group status__counter">
                {{item.counter}}
              </span>
              <span v-else-if="item['menuType'] !== 3" class="status__counter_group status__counter">
                <v-progress-circular :width="1" :size="16" indeterminate color="red"></v-progress-circular>
              </span>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-if="item.items && item.items.length > 1" v-for="subItem in item.items" :key="subItem.stepCode"
            v-on:click.native="filterSteps(subItem)"
            :class="{'list__tile--active': String(currentStep) === String(subItem.stepCode)}"
            >
            <v-list-tile-action>
              <v-icon color="primary" v-if="String(currentStep) === String(subItem.stepCode)">play_arrow</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ subItem.menuStepName }}</v-list-tile-title>
              <span v-if="subItem.hasOwnProperty('counter') && subItem['counter'] > -1" class="status__counter">
                {{subItem.counter}}
              </span>
              <span v-else class="status__counter">
                <v-progress-circular :width="1" :size="16" indeterminate color="red"></v-progress-circular>
              </span>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <div v-if="trangThaiHoSoList.length !== 0 && isMobile" id="m-navigation">
      <div class="row-header mb-0 py-2" style="background-color: #070f52">
        <div class="ml-2 white--text"> <span>QUẢN LÝ HỒ SƠ</span> </div>
      </div>
      <div style="max-height:200px;overflow:hidden;overflow-y:scroll">
        <content-placeholders class="mt-3" v-if="loading">
          <content-placeholders-text :lines="7" />
        </content-placeholders>
        <v-list v-else class="py-0 nav_trang_thai_ho_so">
          <v-list-group
            v-for="(item, index) in trangThaiHoSoList"
            v-model="item.active"
            :key="index"
            :prepend-icon="item['icon'] ? item['icon'] : 'description'"
            :append-icon="item.hasOwnProperty('items') ? '' : ''"
            no-action
            ref="listGroupCustom"
          >
            <v-list-tile slot="activator" class="px-0"
              @click="toTableIndexing(item, index)" >
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                <span v-if="item.hasOwnProperty('counter') && item['counter'] > -1 && item['menuType'] !== 3" class="status__counter_group status__counter">
                  {{item.counter}}
                </span>
                <span v-else-if="item['menuType'] !== 3" class="status__counter_group status__counter">
                  <v-progress-circular :width="1" :size="16" indeterminate color="red"></v-progress-circular>
                </span>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="px-0" v-if="item.items && item.items.length > 1" v-for="subItem in item.items" :key="subItem.stepCode"
              v-on:click.native="filterSteps(subItem)"
              :class="{'list__tile--active': String(currentStep) === String(subItem.stepCode)}"
              >
              <v-list-tile-action>
                <v-icon color="primary" v-if="String(currentStep) === String(subItem.stepCode)">play_arrow</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ subItem.menuStepName }}</v-list-tile-title>
                <span v-if="subItem.hasOwnProperty('counter') && subItem['counter'] > -1" class="status__counter">
                  {{subItem.counter}}
                </span>
                <span v-else class="status__counter">
                  <v-progress-circular :width="1" :size="16" indeterminate color="red"></v-progress-circular>
                </span>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </v-list>
      </div>
    </div>
    <v-content>
      <div v-if="agencyManage" class="row-header no__hidden_class mb-3">
        <div class="background-triangle-big"> <span>{{agencyManage}} </span> </div>
        <div class="layout row wrap header_tools row-blue">
        </div> 
      </div>
      <router-view v-if="isSigned"></router-view>
      <v-alert class="mx-3" v-if="!loading && trangThaiHoSoList.length === 0 && isSigned" outline color="warning" icon="priority_high" :value="true">
        Bạn không có quyền thao tác!
      </v-alert>
      <v-layout class="mt-4" wrap style="max-width:500px;margin: 0 auto" v-if="!isSigned">
        <v-flex xs12>
          <v-card flat class="px-2 py-3" style="border: 1px solid #dddddd;">
            <v-flex xs12 class="primary--text text-bold text-xs-center">
              VUI LÒNG ĐĂNG NHẬP ĐỂ SỬ DỤNG
            </v-flex>
            <v-flex xs12 class="mt-3 text-xs-center">
              <v-btn
                @click="doLogin"
                color="primary"
                class="mr-2"
              >
                <v-icon>input</v-icon>&nbsp;
                Đăng nhập
              </v-btn>
              <v-btn @click="goBack" color="primary">
                <v-icon>reply</v-icon>&nbsp;
                Quay lại
              </v-btn>
            </v-flex>
          </v-card>
        </v-flex>
      </v-layout>
    </v-content>
    <object id="plugin0" type="application/x-cryptolib05plugin" width="0" height="0"></object>
  </v-app>
</template>

<script>
  // import { isMobile } from 'mobile-device-detect'
  import axios from 'axios'
  import $ from 'jquery'
  export default {
    data: () => ({
      isCallBack: true,
      trangThaiHoSoList: [],
      loading: true,
      currentStep: '0',
      counterData: [],
      detailState: 0,
      isSigned: window.themeDisplay ? window.themeDisplay.isSignedIn() : false,
      agencyManage: ''
    }),
    beforeDestroy () {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.onResize, { passive: true })
      }
    },
    mounted () {
      this.onResize()
      window.addEventListener('resize', this.onResize, { passive: true })
      if (this.isMobile) {
        $('section#content').css('padding-left', '0px')
      }
    },
    computed: {
      currentIndex () {
        return this.$store.getters.index
      },
      activeGetCounter () {
        return this.$store.getters.activeGetCounter
      },
      initDataResource () {
        return this.$store.getters.loadingInitData
      },
      pathLanding () {
        let initData = this.$store.getters.loadingInitData
        return '/' + initData['groupId'] + '/danh-sach-ho-so'
      },
      isMobile () {
        return this.$store.getters.getIsMobile
      }
    },
    created () {
      let vm = this
      let isMobile = window.innerWidth < 1264
      vm.$store.commit('setIsMobile', isMobile)
      axios.get('/o/v1/opencps/users/' + window.themeDisplay.getUserId()).then(function(response) {
        let userData = response.data
        vm.$store.commit('setUserLogin', userData)
      })
      .catch(function(error) {
      })
      vm.$nextTick(function () {
        // 
        window.message = vm.callback_alpacal
        // 
        vm.loading = true
        vm.$store.dispatch('loadMenuConfigToDo').then(function (result) {
          vm.loading = false
          if (result) {
            vm.trangThaiHoSoList = result
            let currentParams = vm.$router.history.current.params
            if (Array.isArray(vm.trangThaiHoSoList) && vm.trangThaiHoSoList.length > 0) {
              if (!currentParams.hasOwnProperty('index') && !currentParams.hasOwnProperty('serviceCode')) {
                vm.trangThaiHoSoList[0]['active'] = true
                vm.$router.push({
                  path: vm.pathLanding + '/0',
                  query: {
                    q: vm.trangThaiHoSoList[0]['queryParams']
                  }
                })
              } else {
                vm.trangThaiHoSoList[currentParams.index]['active'] = true
              }
            }
            vm.loadingCounter()
            vm.loading = false
          }
          vm.getAgencies()
        })
        // 
        setInterval(function () {
          vm.loadingCounter()
        }, 5*60*1000)
      })
    },
    updated () {
      let vm = this
      vm.$nextTick(function () {
        let currentParams = vm.$router.history.current.params
        if (currentParams.hasOwnProperty('index') && vm.isCallBack) {
          vm.isCallBack = false
          vm.$store.commit('setIndex', currentParams.index)
          if (currentParams.hasOwnProperty('id')) {
            vm.detailState = 1
          } else {
            vm.detailState = 0
          }
        }
      })
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let isMobile = window.innerWidth < 1264
        vm.$store.commit('setIsMobile', isMobile)
        // if (window.location.href.includes('/m/') && vm.isMobile) {
        //   $('head meta[name=viewport]').remove()
        // } else {
        //   if ($('head meta[name=viewport]').length === 0) {
        //     $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0"/>')
        //   }
        // }
        let currentParams = newRoute.params
        let currentQuery = newRoute.query
        if (currentQuery.hasOwnProperty('step')) {
          vm.currentStep = String(currentQuery.step)
          console.log('currentStep', String(currentQuery.step))
        } else {
          vm.currentStep = '0'
        }
        if (currentQuery.hasOwnProperty('recount')) {
          vm.loadingCounter()
        }
        if (currentParams.hasOwnProperty('id')) {
          vm.detailState = 1
        } else {
          vm.detailState = 0
        }
      },
      activeGetCounter (val) {
        let vm = this
        setTimeout(function () {
          vm.loadingCounter()
        }, 300)
      }
    },
    methods: {
      toTableIndexing (item, index) {
        let vm = this
        try {
          if (vm.isMobile && $('#table-dossier')) {
            $('html, body').animate(
              {
                scrollTop: $('#table-dossier').offset().top,
              }, 200,'linear'
            )
          }
        } catch (error) {
        }
        this.$store.commit('setIndex', index)
        vm.$router.push({
          path: vm.pathLanding + '/' + index,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
            q: item.queryParams
          }
        })
      },
      filterSteps (item) {
        let vm = this
        try {
          if (vm.isMobile && $('#table-dossier')) {
            $('html, body').animate(
              {
                scrollTop: $('#table-dossier').offset().top,
              }, 200,'linear'
            )
          }
        } catch (error) {
        }
        
        let currentQuery = vm.$router.history.current.query
        let currentParams = vm.$router.history.current.params
        // console.log('currentParams', currentParams)
        // console.log('currentQuery', currentQuery)
        let queryString = vm.trangThaiHoSoList[currentParams.index].queryParams
        console.log('queryString++++++1111111+++++', queryString)
        /* test Local */
        /* let queryString = this.trangThaiHoSoList[0].queryParams */
        if (currentQuery !== null && currentQuery !== undefined) {
          let coma = queryString.lastIndexOf('=')
          if (coma > 0) {
            queryString = queryString.substr(0, coma + 1)
          }
        }
        vm.currentStep = String(item.stepCode)
        // console.log('queryString++++++++22222222+++', queryString)
        vm.$router.push({
          path: vm.pathLanding + '/' + currentParams.index,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
            q: queryString + item.stepCode,
            step: item.stepCode
          }
        })
      },
      loadingCounter () {
        let vm = this
        let filter = {
          originality: vm.getOriginality()
        }
        vm.$store.dispatch('loadingCounterHoSo', filter).then(function (result) {
          vm.counterData = result.data
          for (let key in vm.trangThaiHoSoList) {
            vm.trangThaiHoSoList[key]['counter'] = 0
            if (vm.trangThaiHoSoList[key].hasOwnProperty('items')) {
              let parentCount = 0
              for (let keyChild in vm.trangThaiHoSoList[key].items) {
                vm.trangThaiHoSoList[key].items[keyChild]['counter'] = 0
                for (let countKey in vm.counterData) {
                  if (String(vm.counterData[countKey].stepCode) === String(vm.trangThaiHoSoList[key].items[keyChild].stepCode)) {
                    let countCurrent = vm.counterData[countKey].totalCount
                    vm.trangThaiHoSoList[key].items[keyChild]['counter'] = countCurrent
                    parentCount = parentCount + countCurrent
                    break
                  }
                }
              }
              vm.trangThaiHoSoList[key]['counter'] = parentCount
            } else {
              if (vm.trangThaiHoSoList[key].queryParams.indexOf('step') >= 0) {
                if (vm.trangThaiHoSoList[key]['menuType'] === 2) {
                  let filter = {
                    queryParams: vm.trangThaiHoSoList[key].queryParams
                  }
                  vm.$store.dispatch('loadingCounterNotStep', filter).then(function (result) {
                    vm.trangThaiHoSoList[key]['counter'] = result.total
                  }).catch(function () {
                    vm.trangThaiHoSoList[key]['counter'] = 0
                  })
                } else {
                  let stepParent = vm.trangThaiHoSoList[key].queryParams.split('step=')
                  let countParent = 0
                  for (let countKey in vm.counterData) {
                    if (String(vm.counterData[countKey].stepCode) === String(stepParent[1])) {
                      countParent = vm.counterData[countKey].totalCount
                      break
                    }
                  }
                  vm.trangThaiHoSoList[key]['counter'] = countParent
                }
                
              } else {
                let filter = {
                  queryParams: vm.trangThaiHoSoList[key].queryParams
                }
                vm.$store.dispatch('loadingCounterNotStep', filter).then(function (result) {
                  vm.trangThaiHoSoList[key]['counter'] = result.total
                }).catch(function () {
                  vm.trangThaiHoSoList[key]['counter'] = 0
                })
              }
            }
          }
          vm.loading = false
        })
      },
      getAgencies () {
        let vm = this
        let url = '/o/rest/v2/dictcollections/SITE_GROUP/dictitems'
        let config = {
          headers: {
            'groupId': window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
          }
        }
        axios.get(url, config).then(function (response) {
          if (response.data && response.data['data']) {
            let listDonVi = response.data.data
            vm.agencyManage = listDonVi.filter(function (item) {
              return String(item.itemCode) === String(vm.initDataResource.groupId) 
            })[0].itemName
          }
          
        }).catch(function (error) {
          
        })
      },
      doLogin () {
        window.location.href = window.themeDisplay.getPortalURL()
      },
      goBack () {
        window.history.back()
      },
      callback_alpacal (data) {
        console.log('data_export_eform', data)
      },
      onResize () {
        let vm = this
        let isMobile = window.innerWidth < 1264
        vm.$store.commit('setIsMobile', isMobile)
      },
    }
  }
</script>
