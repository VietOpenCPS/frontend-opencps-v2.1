<template>
  <v-app id="app_api_report" :class="hiddenAside ? 'px-3' : ''">
    <router-view></router-view>
    <!--  -->
  </v-app>
</template>

<script>
  import support from './store/support.json'

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
      closeError () {
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
      goTo (page) {
        let vm = this
        let url = window.themeDisplay.getSiteAdminURL().split('/~')[0].replace('group','web')
        window.location.href = url + '/' + page
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
