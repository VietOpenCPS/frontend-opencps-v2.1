<template>
  <v-app class="onegate__fe" style="border: 1px solid #dedede;">
    <v-navigation-drawer app clipped floating width="240"
      :class='{"detail_state": detailState !== 0}' v-if="trangThaiHoSoList.length !== 0 && !isMobile && !isOffLine"
    >
      <div class="">
        <v-btn class="px-0 mt-0 ml-0" block color="primary" v-on:click.native="doAddDVC()"
          :loading="loadingGov"
          :disabled="loadingGov"
          style="height:36px"
        >
          <v-icon size="22" color="white">add</v-icon>&nbsp;
          Thêm mới hồ sơ
          <span slot="loader">Loading...</span>
        </v-btn>
      </div>
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
              <span v-if="item.hasOwnProperty('counter') && item['counter'] > -1" class="status__counter_group status__counter">
                {{item.counter}}
              </span>
              <span v-else class="status__counter_group status__counter">
                <v-progress-circular :width="1" :size="16" indeterminate color="red"></v-progress-circular>
              </span>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-if="item.items && item.items.length > 1" v-for="subItem in item.items" :key="subItem.stepCode"
            v-on:click.native="filterSteps(subItem, index)"
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
    <div v-if="trangThaiHoSoList.length !== 0 && isMobile && !isOffLine" id="m-navigation">
      <div class="row-header mb-0 py-2" style="background-color: #070f52">
        <div class="ml-2 white--text"> <span>QUẢN LÝ HỒ SƠ</span> </div>
      </div>
      <div class="mx-2">
        <v-btn block color="primary" v-on:click.native="doAddDVC()"
          :loading="loadingGov"
          :disabled="loadingGov"
        >
          Thêm mới hồ sơ
          <span slot="loader">Loading...</span>
        </v-btn>
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
      <router-view></router-view>
      <v-alert class="mx-3" v-if="!loading && trangThaiHoSoList.length === 0 && !isOffLine" outline color="warning" icon="priority_high" :value="true">
        Bạn không có quyền thao tác!
      </v-alert>
      <v-dialog v-model="dialogVerifycation" max-width="350">
        <v-card class="px-0">
          <v-card-title color="primary" class="headline">Yêu cầu xác minh tài khoản</v-card-title>
          <v-divider class="my-0"></v-divider>
          <v-card-text>Tài khoản chỉ được phép nộp tối đa 3 hồ sơ trực tuyến khi chưa được xác minh. <br>
            Để tiếp tục nộp hồ sơ trực tuyến vui lòng mang chứng minh thư nhân dân/ thẻ căn cước đến Bộ phận tiếp nhận và trả kết quả để được xác minh.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="dialogVerifycation = false">Đóng</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-content>
    <object id="plugin0" type="application/x-cryptolib05plugin" width="0" height="0"></object>
  </v-app>
</template>

<script>
  import axios from 'axios'
  // import { isMobile } from 'mobile-device-detect'
  export default {
    data: () => ({
      isCallBack: true,
      trangThaiHoSoList: [],
      loading: true,
      currentStep: '0',
      counterData: [],
      detailState: 0,
      dialogVerifycation: false,
      verificationApplicantCreateDossier: false
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
      loadingGov () {
        return this.$store.getters.loadingGov
      },
      activeGetCounter () {
        return this.$store.getters.activeGetCounter
      },
      // viewMobile () {
      //   return isMobile
      // },
      pathLanding () {
        return '/danh-sach-ho-so'
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
      let vm = this
      let isMobile = window.innerWidth < 1264
      vm.$store.commit('setIsMobile', isMobile)
      //
      try {
        vm.verificationApplicantCreateDossier = hasVerificationCreateDossier
      } catch (error) {
      }
      // 
      axios.get('/o/v1/opencps/users/' + window.themeDisplay.getUserId()).then(function(response) {
        let userData = response.data
        vm.$store.commit('setUserLogin', userData)
      })
      .catch(function(error) {
      })
      // if (window.location.href.includes('/m/') && isMobile) {
      //   $('head meta[name=viewport]').remove()
      // } else {
      //   if ($('head meta[name=viewport]').length === 0) {
      //     $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0"/>')
      //   }
      // }
      vm.$nextTick(function () {
        vm.loading = true
        vm.$store.dispatch('loadMenuConfigToDo').then(function (result) {
          vm.loading = false
          if (result.length !== 0) {
            vm.trangThaiHoSoList = result
            let route = vm.$router.history.current
            let currentParams = vm.$router.history.current.params
            if (!currentParams.hasOwnProperty('index') && !currentParams.hasOwnProperty('serviceCode') && route.name !== 'ThanhToanThanhCong') {
              vm.trangThaiHoSoList[0]['active'] = true
              vm.$router.push({
                path: vm.pathLanding + '/0',
                query: {
                  q: vm.trangThaiHoSoList[0]['queryParams']
                }
              })
            } else if (currentParams.hasOwnProperty('index')) {
              vm.trangThaiHoSoList[currentParams.index]['active'] = true
            }
            vm.loadingCounter()
          }
        })
        // 
        setInterval(function () {
          vm.loadingCounter()
        }, 3*60*1000)
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
        // if (window.location.href.includes('/m/') && vm.viewMobile) {
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
      filterSteps (item, index) {
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

        let currentQuery = this.$router.history.current.query
        let currentParams = this.$router.history.current.params
        console.log('currentParams', currentParams)
        console.log('currentQuery', currentQuery)
        let queryString = this.trangThaiHoSoList[index].queryParams
        /* test Local */
        /* let queryString = this.trangThaiHoSoList[0].queryParams */
        if (currentQuery !== null && currentQuery !== undefined) {
          let coma = queryString.lastIndexOf('=')
          if (coma > 0) {
            queryString = queryString.substr(0, coma + 1)
          }
        }
        this.currentStep = String(item.stepCode)
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
                      let countParent = vm.counterData[countKey].totalCount
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
      doAddDVC () {
        let vm = this
        if (vm.verificationApplicantCreateDossier && vm.userLoginInfomation && vm.userLoginInfomation['verification'] && String(vm.userLoginInfomation['verification']) === '2') {
          vm.dialogVerifycation = true
        } else {
          // vm.$router.push('/add-dvc/0')
          vm.$router.push('/linh-vuc-thu-tuc')
        }
      },
      onResize () {
        let vm = this
        let isMobile = window.innerWidth < 1264
        vm.$store.commit('setIsMobile', isMobile)
      },
    }
  }
</script>
