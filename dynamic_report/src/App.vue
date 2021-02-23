<template>
  <v-app id="app_dynamic_report" :class="hiddenAside ? 'px-3' : ''">
    <v-navigation-drawer app clipped floating width="300" v-if="isSigned">
      <div class="drawer__filter">
        <div class="px-2 pt-0">
          <v-btn v-if="isAdmin" class="px-0 mt-0 ml-0" block color="primary" v-on:click.native="dialog_chotsolieu = true"
            style="height:36px"
          >
            <v-icon size="22" color="white">sync</v-icon>&nbsp;
            Chốt số liệu báo cáo
          </v-btn>
        </div>
        <v-list dense style="padding: 0;" class="report_list">
          <v-list-tile
            v-for="(item, indexItem) in itemsReports"
            :key="indexItem"
            :to="'/bao-cao/' + indexItem + '?reportType=' + reportTypeFilter"
          >
            <v-list-tile-action>
              <v-icon v-if="String(indexItem) === String(index)" color="blue darken-3">play_arrow</v-icon>
              <v-icon v-else>description</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title :title="item.reportName" style="font-size:13px">{{ item.reportName }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </div>
    </v-navigation-drawer>
    <v-content :style="hiddenAside ? 'background: #ffffff' : ''" v-if="isSigned">
      <router-view></router-view>
    </v-content>
    <v-snackbar
      v-model="snackbarerror"
      :bottom="false"
      :left="false"
      :multi-line="false"
      :right="true"
      :timeout="2000"
      :top="true"
      :vertical="false"
      color="red darken-3"
    >
      Yêu cầu thực hiện thất bại
      <v-btn
        icon
        @click="closeError()"
      >
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="snackbarsocket"
      :bottom="true"
      :left="false"
      :multi-line="true"
      :right="false"
      :timeout="0"
      :top="true"
      :vertical="false"
      color="red darken-3"
    >
      <v-progress-circular
        :size="20"
        :width="1"
        color="white"
        indeterminate
      ></v-progress-circular>
      &nbsp;
      Mất kết nối, tự động kết nối lại trong giây lát ... 
      
      <v-btn
        icon
        @click="reloadPage()"
      >
        <v-icon>replay</v-icon>
      </v-btn>
    </v-snackbar>
    <!--  -->
    <div v-if="isChildPage" style="position:fixed;top:250px;right:0;width: 34px;background-color:#ffffff;
      border-radius:15px;border-top-right-radius: 0;border-bottom-right-radius: 0;border: 1.5px solid #dedede;border-right: 0">
      <v-tooltip left>
        <v-btn slot="activator" flat icon color="blue" class="mx-0 my-0" style="width: 32px; height:32px" @click="goTo('thong-ke')">
          <v-icon size="20">pie_chart</v-icon>
        </v-btn>
        <span>Thống kê chung</span>
      </v-tooltip>
      <v-tooltip left>
        <v-btn slot="activator" flat icon color="green" class="mx-0 my-0" style="width: 32px;height:32px" @click="goTo('bao-cao-admin')">
          <v-icon size="20">book</v-icon>
        </v-btn>
        <span>Báo cáo tình hình giải quyết</span>
      </v-tooltip>
      <v-menu left offset-x open-on-hover>
        <v-btn slot="activator" flat icon color="teal" class="mx-0 my-0" style="width: 32px;height:32px">
          <v-icon size="20">assignment_turned_in</v-icon>
        </v-btn>
        <v-list>
          <p class="text-bold primary--text px-3 pt-2">TÌNH HÌNH ĐÁNH GIÁ THỦ THỤC HÀNH CHÍNH<p>
          <v-list-tile @click="goTo('thong-ke#/danh-gia-hai-long')">
            <v-list-tile-title >Đánh giá DVC mức độ 3, 4</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="goTo('thong-ke#/chi-so-danh-gia')">
            <v-list-tile-title @click="goTo('thong-ke#/chi-so-danh-gia')">Chỉ số đánh giá giải quyết TTHC</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-tooltip left>
        <v-btn slot="activator" flat icon color="orange" class="mx-0 my-0" style="width: 32px;height:32px" @click="goTo('tra-cuu-ho-so')">
          <v-icon size="20">search</v-icon>
        </v-btn>
        <span>Tra cứu thông tin hồ sơ</span>
      </v-tooltip>
      <!-- <v-menu left offset-x open-on-hover>
        <v-btn slot="activator" flat icon color="orange" class="mx-0 my-0" style="width: 32px;height:32px">
          <v-icon size="20">perm_identity</v-icon>
        </v-btn>
        <v-list>
          <p class="text-bold primary--text px-3 pt-2">TÌNH HÌNH ĐÁNH GIÁ CÁN BỘ<p>
          <v-list-tile @click="goTo('thong-ke#/danh-gia-can-bo')">
            <v-list-tile-title>Đánh giá cán bộ qua Kiosk</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="goTo('thong-ke#/tinh-hinh-giai-quyet')">
            <v-list-tile-title>Tình hình xử lý hồ sơ của cán bộ</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu> -->
    </div>
    <!--  -->
    <v-dialog v-model="dialog_chotsolieu" max-width="350" transition="fade-transition">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Thời gian chốt số liệu</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialog_chotsolieu = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="py-0 px-0">
          <v-layout wrap class="pt-4 py-0 px-2">
            <v-flex xs12 sm6 class="pr-2">
              <v-autocomplete
                :items="monthList"
                v-model="month"
                label="Tháng"
                hide-no-data
                :hide-selected="true"
                box
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm6 class="pl-2">
              <v-autocomplete
                :items="yearList"
                v-model="year"
                label="Năm"
                hide-no-data
                :hide-selected="true"
                box
              ></v-autocomplete>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-2" color="primary" @click="chotSoLieuBaoCao()"
            :loading="loadingChotSoLieu"
            :disabled="loadingChotSoLieu"
          >
            <v-icon>save</v-icon> &nbsp;
            Xác nhận
          </v-btn>
          <v-btn class="" color="primary" @click="dialog_chotsolieu = false"
            :loading="loadingChotSoLieu"
            :disabled="loadingChotSoLieu"
          >
            <v-icon>clear</v-icon> &nbsp;
            Hủy
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
  import support from './store/support.json'
  import axios from 'axios'
  import toastr from 'toastr'
  export default {
    props: ['index'],
    data: () => ({
      loadingChotSoLieu: false,
      hiddenAside: false,
      dialog: false,
      drawer: null,
      dataSocket: {},
      support: support,
      itemsReportsConfig: [],
      itemsGroups: [
        {
          value: 'domain',
          text: 'lĩnh vực'
        },
        {
          value: 'gov',
          text: 'đơn vị'
        }
      ],
      userConfig: [],
      reportTypeFilter: '',
      reportTypeMappingRole: '',
      year: '',
      month: '',
      monthList: [1,2,3,4,5,6,7,8,9,10,11,12],
      yearList: '',
      dialog_chotsolieu: false,
      isAdmin: false,
      isSigned: window.themeDisplay.isSignedIn()
    }),
    computed: {
      itemsReports () {
        return this.$store.getters.itemsReports
      },
      items () {
        return this.$store.getters.getDeliverableTypes
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
      selectedText: {
        // getter
        get: function() {
          return this.$store.getters.selectedText
        },
        // setter
        set: function(newValue) {
          this.$store.commit('setselectedText', newValue)
        }
      },
      snackbarerror: {
        // getter
        get: function() {
          return this.$store.getters.getsnackbarerror
        },
        // setter
        set: function(newValue) {
          this.$store.commit('setsnackbarerror', newValue)
        }
      },
      snackbarsocket: {
        // getter
        get: function() {
          return this.$store.getters.getsnackbarsocket
        },
        // setter
        set: function(newValue) {
          this.$store.commit('setsnackbarsocket', newValue)
        }
      },
      isChildPage () {
        // giám sát
        try {
          if (childPage) {
            return true
          }
          return false
        } catch (error) {
          return false
        }
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        vm.yearList = []
        let currentYear = (new Date()).getFullYear()
        vm.year = currentYear
        vm.month = (new Date()).getMonth() + 1
        for (let i = currentYear; i >= 2019; i--) {
          vm.yearList.push(i)
        }

        try {
          if (reportTypeFilter) {
            vm.reportTypeFilter = reportTypeFilter
          }
        } catch (error) {
        }
        try {
          if (reportTypeMappingRole) {
            vm.reportTypeMappingRole = reportTypeMappingRole
          }
        } catch (error) {
        }
        let doGetReport = function () {
          if (vm.$route.query.hasOwnProperty('doreport')) {
            vm.hiddenAside = true
          } else {
            vm.hiddenAside = false
          }
          if (vm.$route.query.reportType !== undefined && vm.$route.query.reportType !== null && vm.$route.query.reportType !== '') {
            vm.reportTypeFilter = vm.$route.query.reportType
          }
          vm.$store.dispatch('getDynamicReports', vm.reportTypeFilter).then(function (result) {
            vm.itemsReportsConfig = []
            vm.userConfig = []
            if (String(vm.index) !== '0') {
              for (let key in vm.itemsReports) {
                if (vm.itemsReports[key]['code'] === String(vm.index)) {
                  vm.reportType = vm.itemsReports[key]['document']
                  vm.itemsReportsConfig = vm.itemsReports[key]['filterConfig']['reportConfig']
                  if (vm.itemsReports[key]['userConfig'] !== '') {
                    let userConfigObjec = vm.itemsReports[key]['userConfig']
                    if (userConfigObjec.hasOwnProperty(vm.getUserId())) {
                      vm.userConfig = userConfigObjec[vm.getUserId()]
                    }
                  }
                  break
                }
              }
            } else {
              vm.reportType = vm.itemsReports[0]['document']
              vm.itemsReportsConfig = vm.itemsReports[0]['filterConfig']['reportConfig']
              if (vm.itemsReports[0]['userConfig'] !== '') {
                let userConfigObjec = vm.itemsReports[0]['userConfig']
                if (userConfigObjec.hasOwnProperty(vm.getUserId())) {
                  vm.userConfig = userConfigObjec[vm.getUserId()]
                }
              }
            }
            vm.selected = []
            if (vm.userConfig.length > 0) {
              vm.selected = vm.userConfig
            } else {
              for (let keySelected in vm.itemsReportsConfig) {
                if (vm.itemsReportsConfig[keySelected]['selected']) {
                  vm.selected.push(vm.itemsReportsConfig[keySelected]['value'])
                }
              }
            }
          })
        }
        if (vm.reportTypeMappingRole) {
          let roles = ''
          vm.$store.dispatch('getRoleUser').then(function (result) {
            roles = result
            if (roles) {
              let roleList = roles
              roleList = roleList.filter(function (item) {
                return vm.reportTypeMappingRole.hasOwnProperty(item) && vm.reportTypeMappingRole[item]
              })
              if (roleList && roleList.length > 0) {
                vm.reportTypeFilter = vm.reportTypeMappingRole[roleList[0]]
                doGetReport()
              } else {
                doGetReport()
              }
            } else {
              doGetReport()
            }
          }).catch(function (error) {
            doGetReport()
          })
        } else {
          doGetReport()
        }
        vm.checkAdmin()
      })
    },
    methods: {
      redirectFilter(val) {
        this.$router.push(val + '?state_change=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1)
      },
      closeError() {
        this.$store.commit('setsnackbarerror', false)
      },
      reloadPage() {
        window.location.reload(true)
      },
      deliverableRouter (item) {
        console.log(item)
      },
      resetConfig () {
        let vm = this
        vm.selected = []
        for (let keySelected in vm.itemsReportsConfig) {
          if (vm.itemsReportsConfig[keySelected]['selected']) {
            vm.selected.push(vm.itemsReportsConfig[keySelected]['value'])
          }
        }
      },
      changeReportType (data) {
        let vm = this
        vm.itemsReportsConfig = []
        for (let key in vm.itemsReports) {
          if (vm.itemsReports[key]['document'] === data) {
            vm.itemsReportsConfig = vm.itemsReports[key]['filterConfig']['reportConfig']
            if (vm.itemsReports[key]['userConfig'] !== '') {
              let userConfigObjec = vm.itemsReports[key]['userConfig']
              if (userConfigObjec.hasOwnProperty(vm.getUserId())) {
                vm.userConfig = userConfigObjec[vm.getUserId()]
              }
            }
            vm.selected = []
            if (vm.userConfig.length > 0) {
              vm.selected = vm.userConfig
            } else {
              for (let keySelected in vm.itemsReportsConfig) {
                if (vm.itemsReportsConfig[keySelected]['selected']) {
                  vm.selected.push(vm.itemsReportsConfig[keySelected]['value'])
                }
              }
            }
            vm.$router.push('/bao-cao/' + vm.itemsReports[key]['code'])
            break
          }
        }
      },
      goTo (page) {
        let vm = this
        let url = window.themeDisplay.getSiteAdminURL().split('/~')[0].replace('group','web')
        window.location.href = url + '/' + page
      },
      chotSoLieuBaoCao () {
        let vm = this
        let param = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId(),
            Token: window.Liferay ? window.Liferay.authToken : ''
          },
          params: {
            reCalculate: 1,
            year: vm.year,
            month: vm.month
          }
        }
        vm.loadingChotSoLieu = true
        axios.get('/o/rest/statistics', param).then(function (response) {
          toastr.success('Yêu cầu thực hiện thành công')
          vm.loadingChotSoLieu = false
          vm.dialog_chotsolieu = false
        }).catch(function (error) {
          vm.loadingChotSoLieu = false
          toastr.error('Yêu cầu thực hiện không thành công')
        })
      },
      checkAdmin () {
        let vm = this
        vm.isAdmin = false
        vm.$store.dispatch('getRoleUser').then(function (roles) {
          if (!roles) {
            vm.isAdmin = false
          }
          let roleExits = roles.findIndex(item => item === 'Administrator' || item === 'Administrator_data' || item === 'CHOT_SO_LIEU_BAO_CAO')
          if (roleExits >= 0) {
            vm.isAdmin = true
          }
        })
      }
    }
  }
</script>
