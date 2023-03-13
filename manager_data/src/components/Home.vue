<template>
  <v-app>
    <v-navigation-drawer :clipped="$vuetify.breakpoint.lgAndUp" v-model="drawer" fixed app width="260" dark
      style="background-image: url(&quot;/o/vue-admin/images/bg_menu.jpg&quot;);"
    >
      <div class="sidebar-background" ></div>
      <v-list dense>
        <template v-for="item in items">
            <v-layout
              v-if="item.heading"
              :key="item.heading"
              row
              align-center
            >
              <v-flex xs6>
                <v-subheader v-if="item.heading">
                  {{ item.heading }}
                </v-subheader>
              </v-flex>
              <v-flex xs6 class="text-xs-center">
                <a href="#!" class="body-2 black--text">EDIT</a>
              </v-flex>
            </v-layout>
            <v-list-group
              v-else-if="item.hasOwnProperty('children')"
              v-model="item.model"
              :key="item.text"
              :append-icon="item.model ? item.icon : item['icon-alt']"
              prepend-icon="folder_open"
              dark
            >
              <v-list-tile slot="activator">
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ item.text }}
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile
                v-if="item.hasOwnProperty('children')"
                v-for="(child, i) in item.children"
                :key="i"
                :class='{"list__active": tableName === child.code}'
                :to="child.link.indexOf('?') > 0 ? child.link + '&state_change=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1 : child.link + '?state_change=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1"
              >
                <v-list-tile-action v-if="child.icon">
                  <v-icon>{{ child.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ child.text }}
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list-group>
            <v-list-tile v-else :key="item.text">
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-container fluid class="px-0">
      <div class="adv_search my-0 px-2" style="background: #eeeeee" v-if="agencyList && tableName !== 'opencps_serviceconfig_dvc'">
        <div class="searchAdvanced-content py-3">
          <v-layout wrap>
            <v-flex xs12 class="mb-3 px-2">
              <div>
                <div class="d-inline-block text-bold" style="font-weight:450;width: 130px;">ĐƠN VỊ:</div>
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
                  height="32"
                  min-height="32"
                  return-object
                  @change="changeAgency"
                  clearable
                ></v-autocomplete>
              </div>
            </v-flex>
          </v-layout>
        </div>
      </div>
      <router-view></router-view>
    </v-container>
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
  </v-app>
</template>
<script>
  import axios from 'axios'
  import $ from 'jquery'
  export default {
    data: () => ({
      dialog: false,
      drawer: null,
      dataSocket: {},
      scopeAdmin: false,
      hasTrackingApi: false,
      agencyList: '',
      agencyFilter: '',
      siteTrungTam: false,
      agencyListConfig: ''
    }),
    props: {
      tableName: String
    },
    created () {
      let vm = this
      vm.$nextTick(function () {
        try {
          vm.siteTrungTam = siteTrungTam
        } catch (error) {
        }
        try {
          vm.agencyListConfig = agencyListConfig
        } catch (error) {
        }
        try {
          let isAdmin = vm.getUser('Administrator')
          if (scopeAdminConfig && !isAdmin) {
            vm.scopeAdmin = true
          }
        } catch (error) {
        }
        try {
          vm.hasTrackingApi = hasTrackingApi
        } catch (error) {
        }
        
        vm.getAgencyConfigs()
      })
    },
    computed: {
      items() {
        return this.$store.getters.getlistTableMenu
      },
      loginUser() {
        return this.$store.getters.getloginUser
      },
      userRoles () {
        return this.$store.getters.getUserRoles
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
      }
    },
    watch: {
      userRoles () {
        let vm = this
        try {
          let isAdmin = vm.getUser('Administrator')
          if (scopeAdminConfig && !isAdmin) {
            vm.scopeAdmin = true
          } else {
            vm.scopeAdmin = false
          }
        } catch (error) {
          vm.scopeAdmin = false
        }
      }
    },
    methods: {
      changeAgency () {
        let vm = this
        setTimeout(function () {
          vm.$store.commit('setAgencyManager',vm.agencyFilter ? vm.agencyFilter : '')
          vm.$store.commit('setGroupIdAgencyManager',vm.agencyFilter ? vm.agencyFilter['value'] : window.themeDisplay.getScopeGroupId())
          axios.defaults.headers.common['groupId'] = vm.agencyFilter ? vm.agencyFilter['value'] : window.themeDisplay.getScopeGroupId()
          $.ajaxSetup({headers:{"Token":Liferay.authToken,"groupId":vm.agencyFilter ? vm.agencyFilter['value'] : window.themeDisplay.getScopeGroupId()},global:true});
          console.log('groupIdAgencyManager', vm.agencyFilter ? vm.agencyFilter['value'] : '')
          try {
            if ($('a[aria-current="page"]').length) {
              let pathR = $('a[aria-current="page"]')[0]['hash'].replace('#','')
              vm.$router.push({
                path: pathR
              })
            } else {
              let pathR = $('.v-list__group__items a')[0]['hash'].replace('#','')
              vm.$router.push({
                path: pathR
              })
            }
          } catch (error) {
          }
        }, 200)
      },
      getAgencyConfigs () {
        let vm = this
        vm.agencyList = ''
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
          try {
            let agencyCurrentSite = agency.filter(function (item) {
              return item.value == window.themeDisplay.getScopeGroupId()
            })[0]
            vm.$store.commit('setCurrentSite', agencyCurrentSite)
          } catch (error) {
            vm.$store.commit('setCurrentSite', '')
          }
          if (vm.siteTrungTam) {
            vm.agencyList = agency
          } else {
            let idSite = window.themeDisplay.getScopeGroupId()
            if (configs.hasOwnProperty(idSite)) {
              if (configs[idSite] === 'all' || !configs[idSite]) {
                vm.agencyList = agency
              } else {
                vm.agencyList = configs[idSite]
              }
            } else {
              if (configs.hasOwnProperty('SBN') && configs.hasOwnProperty('SBN_MANAGER_SITE')) {
                let isSbn = configs['SBN'].find(function (item) {
                  return item == idSite
                })
                if (isSbn) {
                  vm.agencyList = configs['SBN_MANAGER_SITE']
                }
              }
            }
          }
          vm.$store.commit('setAgencyListManager', vm.agencyList)
        }).catch(function (xhr) {
        })

        // let param = {
        //   headers: {
        //     groupId: 357926,
        //     Token: window.Liferay ? window.Liferay.authToken : ''
        //   }
        // }
        // let url = '/o/rest/v2/serverconfigs/GROUP_ID_SITE_MOTCUA'
        // axios.get(url, param).then(function (response) {
        //   let serializable = response.data
        //   let configs = JSON.parse(serializable.configs)
        //   let agency = configs['groupIds']
        //   try {
        //     let agencyCurrentSite = agency.filter(function (item) {
        //       return item.value == window.themeDisplay.getScopeGroupId()
        //     })[0]
        //     vm.$store.commit('setCurrentSite', agencyCurrentSite)
        //   } catch (error) {
        //     vm.$store.commit('setCurrentSite', '')
        //   }
        //   if (vm.siteTrungTam) {
        //     vm.agencyList = agency
        //   } else {
        //     let idSite = window.themeDisplay.getScopeGroupId()
        //     if (configs.hasOwnProperty(idSite)) {
        //       if (configs[idSite] === 'all' || !configs[idSite]) {
        //         vm.agencyList = agency
        //       } else {
        //         vm.agencyList = configs[idSite]
        //       }
        //     } else {
        //       if (configs.hasOwnProperty('SBN') && configs.hasOwnProperty('SBN_MANAGER_SITE')) {
        //         let isSbn = configs['SBN'].find(function (item) {
        //           return item == idSite
        //         })
        //         if (isSbn) {
        //           vm.agencyList = configs['SBN_MANAGER_SITE']
        //         }
        //       }
        //     }
        //   }
        //   vm.$store.commit('setAgencyListManager', vm.agencyList)
        // }).catch(function (error) {
        // })
      },
      getUser (roleItem) {
        let vm = this
        let roles = vm.userRoles
        if (!roles) {
          return false
        }
        let roleExits = roles.findIndex(item => item.role === roleItem)
        return (roleExits >= 0)
      },
      redirectFilter(val) {
        this.$router.push(val + '?state_change=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1)
      },
      closeError() {
        this.$store.commit('setsnackbarerror', false)
      },
      reloadPage() {
        window.location.reload(true)
      },
      redirectControlPanel() {
        let controlPanelURL = ''
        if (window.themeDisplay !== null && window.themeDisplay !== undefined) {
          controlPanelURL = window.themeDisplay.getLayoutRelativeControlPanelURL()
        }
        window.location.href = controlPanelURL + '?p_p_id=com_liferay_layout_admin_web_portlet_GroupPagesPortlet'
      },
      getItemSearch() {
        let vm = this
        if (vm.items.length === 2) {
          return vm.items[1].children
        } else if (vm.items.length > 2) {
          return vm.items[2].children
        } else {
          return []
        }
      },
      doLogOut() {
        window.location.href = '/c/portal/logout'
      },
      theoDoiLog () {
        this.$router.push({
          name: 'TheoDoiLogTruyCap'
        })
      },
      thongKeTruyCap () {
        // window.location.href = 'https://analytics.google.com'
        this.$router.push({
          name: 'ThongKeTruyCap'
        })
      }
    }
  }
</script>