<template>
  <v-app id="app_serviceinfo" :style="!isMobile ? 'border: 1px solid #dedede;max-width:1300px;margin:0 auto' : 'max-width:1300px;margin:0 auto'">
    <v-navigation-drawer app clipped floating width="265" v-if="!isMobile && !setAgency">
      <v-list class="py-0">
        <v-list-group
          v-for="(item, index) in menuServiceInfos"
          :key="index"
          :prepend-icon="item.icon"
          :append-icon="item.mappingCode === 'all' || item.mappingCode === 'tagCode' ? '' : 'expand_less'"
          :value="index === activeTab"
        >
          <v-list-tile slot="activator" @click="item.mappingCode === 'all' || item.mappingCode === 'tagCode' ? filterAll(item) : activeAll = false ">
            <v-list-tile-title>{{item.name}}</v-list-tile-title>
            <span v-if="item.mappingCode === 'all' || item.mappingCode === 'tagCode'" class="status__counter" style="color:#0b72ba">
              {{item.mappingCode === 'tagCode' ? countTagCode[item['value']] : countAllService}}
            </span>
          </v-list-tile>
          <v-list-tile v-for="(item1, index1) in item['children']" :key="index1" :class="thuTucTinh && (item1['administrationCode'] === 'CAP_HUYEN' || item1['administrationCode'] === 'CAP_XA') ? 'thuTucTinh' : ''">
            
            <v-list-tile-action v-if="!thuTucTinh || (thuTucTinh && item1['administrationCode'] !== 'CAP_HUYEN' && item1['administrationCode'] !== 'CAP_XA')">
              <v-icon color="#00aeef" 
                v-if="String(currentAgency) === String(item1[item.mappingCode]) || String(currentAgencyTh) === String(item1[item.mappingCode]) || String(currentDomain) === String(item1[item.mappingCode])
                || String(currentLevel) === String(item1[item.mappingCode]) || String(currentMethod) === String(item1[item.mappingCode])"
              >play_arrow</v-icon>
            </v-list-tile-action>
            <v-list-tile-content v-if="!thuTucTinh || (thuTucTinh && item1['administrationCode'] !== 'CAP_HUYEN' && item1['administrationCode'] !== 'CAP_XA')" @click="filterAction(index, item1)">
              <v-list-tile-title v-text="item1[item.mappingName]" style="width: calc(100% - 45px)" :title="item1[item.mappingName]"></v-list-tile-title>
              <span class="status__counter" style="color:#0b72ba">
                {{item1[item.mappingCount]}}
              </span>
            </v-list-tile-content>
            <!-- render list domain / cấp huyện, cấp xã -->
            <v-list class="py-0" v-if="thuTucTinh">
              <v-list-group
                :prepend-icon="play_arrow"
                v-if="thuTucTinh && item1['administrationCode'] === 'CAP_HUYEN'"
                @click="filterAction(index, item1)"
              >
                <v-list-tile slot="activator">
                  <v-list-tile-action>
                    <v-icon color="#00aeef" 
                      v-if="String(currentAgency) === String(item1[item.mappingCode]) || String(currentAgencyTh) === String(item1[item.mappingCode]) || String(currentDomain) === String(item1[item.mappingCode])
                      || String(currentLevel) === String(item1[item.mappingCode]) || String(currentMethod) === String(item1[item.mappingCode])"
                    >play_arrow</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{item1[item.mappingName]}}</v-list-tile-title>
                    <span class="status__counter" style="color:#0b72ba">
                      {{item1[item.mappingCount]}}
                    </span>
                  </v-list-tile-content>
                  
                </v-list-tile>
                <v-list-tile v-for="(item2, index2) in domainCapHuyen" :key="index2">
                  
                  <v-list-tile-action>
                    <v-icon color="#00aeef" size="10px">fiber_manual_record</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content @click.stop="filterAction(99, item1, item2)">
                    <v-list-tile-title v-text="item2.domainName" :title="item2.domainName"></v-list-tile-title>
                    <!-- <span class="status__counter" style="color:#0b72ba">
                      {{item1[item.mappingCount]}}
                    </span> -->
                  </v-list-tile-content>
                </v-list-tile>
              </v-list-group>
              <v-list-group
                :prepend-icon="play_arrow"
                v-if="thuTucTinh && item1['administrationCode'] === 'CAP_XA'"
                @click="filterAction(index, item1)"
              >
                <v-list-tile slot="activator" >
                  <v-list-tile-action>
                    <v-icon color="#00aeef" 
                      v-if="String(currentAgency) === String(item1[item.mappingCode]) || String(currentAgencyTh) === String(item1[item.mappingCode]) || String(currentDomain) === String(item1[item.mappingCode])
                      || String(currentLevel) === String(item1[item.mappingCode]) || String(currentMethod) === String(item1[item.mappingCode])"
                    >play_arrow</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{item1[item.mappingName]}}</v-list-tile-title>
                    <span class="status__counter" style="color:#0b72ba">
                      {{item1[item.mappingCount]}}
                    </span>
                  </v-list-tile-content>
                  
                </v-list-tile>
                <v-list-tile v-for="(item2, index2) in domainCapXa" :key="index2">
                  
                  <v-list-tile-action>
                    <v-icon color="#00aeef" size="10px">fiber_manual_record</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content @click.stop="filterAction(99, item1, item2)">
                    <v-list-tile-title v-text="item2.domainName" :title="item2.domainName"></v-list-tile-title>
                    <!-- <span class="status__counter" style="color:#0b72ba">
                      {{item1[item.mappingCount]}}
                    </span> -->
                  </v-list-tile-content>
                </v-list-tile>
              </v-list-group>
            </v-list>
            <!--  -->
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <router-view></router-view>
    </v-content>
    <go-top v-if="isMobile" :size="42" bg-color="#0064c7"></go-top>
  </v-app>
</template>

<script>
  import axios from 'axios'
  import GoTop from '@inotom/vue-go-top'
  export default {
    data: () => ({
      active: null,
      activeAll: false,
      activeTab: 0,
      pathRouter: '/thu-tuc-hanh-chinh',
      currentAgency: '',
      currentAgencyTh: '',
      currentDomain: '',
      currentLevel: '',
      currentMethod: '',
      countAllService: 0,
      countTagCode: [],
      itemTags: [],
      isDetail: false,
      text: '',
      menuServiceInfos: [
        {
          id: 1,
          name: 'Cơ quan quản lý',
          mappingName: 'administrationName',
          mappingCode: 'administrationCode',
          mappingCount: 'count',
          children: [],
          icon: 'account_balance'
        },
        {
          id: 2,
          name: 'Lĩnh vực',
          mappingName: 'domainName',
          mappingCode: 'domainCode',
          mappingCount: 'count',
          children: [],
          icon: 'domain'
        },
        {
          id: 3,
          name: 'Mức độ',
          mappingName: 'levelName',
          mappingCode: 'level',
          mappingCount: 'count',
          children: [],
          icon: 'sort'
        },
        {
          id: 4,
          name: 'Tất cả thủ tục',
          mappingName: 'all',
          mappingCode: 'all',
          mappingCount: 'count',
          children: [],
          icon: 'select_all'
        }
      ],
      hasCoQuanThucHien: false,
      setAgency: false,     /**fix 1 đơn vị */
      domainCapHuyen: [],
      domainCapXa: [],
      thuTucTinh: false,
      hasTagServiceInfo: false
    }),
    components: {
      GoTop
    },
    computed: {
      currentIndex () {
        return this.$store.getters.index
      },
      govAgencyList () {
        return this.$store.getters.getAgencyList
      },
      domainList () {
        return this.$store.getters.getDomainList
      },
      levelList () {
        return this.$store.getters.getLevelList
      },
      isMobile () {
        return this.$store.getters.getIsMobile
      }
    },
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
        $('.input-search input').css('margin-top', '5px')
        $('.input-search .v-input__slot').css('min-height', '36px')
        $('.input-search .v-input__append-inner').css('margin-top', '10px')
      }
    },
    beforeCreate() {
      console.log(this.message)
    },
    created () {
      var vm = this
      try {
        vm.hasCoQuanThucHien = hasCoQuanThucHien
      } catch (error) {
        vm.hasCoQuanThucHien = false
      }
      try {
        vm.thuTucTinh = thuTucTinh
      } catch (error) {
      }
      try {
        vm.hasTagServiceInfo = hasTagServiceInfo
      } catch (error) {
      }
      vm.$nextTick(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        if (newQuery.hasOwnProperty('setAgency')) {
          vm.setAgency = true
        }
        if (vm.hasCoQuanThucHien) {
          vm.menuServiceInfos = [
            {
              id: 1,
              name: 'Cơ quan quản lý',
              mappingName: 'administrationName',
              mappingCode: 'administrationCode',
              mappingCount: 'count',
              children: [],
              icon: 'account_balance'
            },
            {
              id: 2,
              name: 'Cơ quan thực hiện',
              mappingName: 'govAgencyName',
              mappingCode: 'govAgencyCode',
              mappingCount: 'count',
              children: [],
              icon: 'fas fa fa-book'
            },
            {
              id: 3,
              name: 'Lĩnh vực',
              mappingName: 'domainName',
              mappingCode: 'domainCode',
              mappingCount: 'count',
              children: [],
              icon: 'domain'
            },
            {
              id: 4,
              name: 'Mức độ',
              mappingName: 'levelName',
              mappingCode: 'level',
              mappingCount: 'count',
              children: [],
              icon: 'sort'
            },
            {
              id: 5,
              name: 'Tất cả thủ tục',
              mappingName: 'all',
              mappingCode: 'all',
              mappingCount: 'count',
              children: [],
              icon: 'select_all'
            }
          ]
        }
        if (vm.hasTagServiceInfo) {
          axios.get('/o/rest/v2/dictcollections/TAG_SERVICEINFO/dictitems').then(function(response) {
            vm.menuServiceInfos = []
            if (response.data && response.data.hasOwnProperty('data')) {
              vm.itemTags = response.data.data
              vm.getCountTag()
              let tags = [
                {
                  id: 1,
                  name: 'Cơ quan quản lý',
                  mappingName: 'administrationName',
                  mappingCode: 'administrationCode',
                  mappingCount: 'count',
                  children: [],
                  icon: 'account_balance'
                },
                {
                  id: 2,
                  name: 'Lĩnh vực',
                  mappingName: 'domainName',
                  mappingCode: 'domainCode',
                  mappingCount: 'count',
                  children: [],
                  icon: 'domain'
                },
                {
                  id: 3,
                  name: 'Mức độ',
                  mappingName: 'levelName',
                  mappingCode: 'level',
                  mappingCount: 'count',
                  children: [],
                  icon: 'sort'
                }
              ]
              for (let index = 0; index < vm.itemTags.length; index++) {
                let item = {
                  id: 3 + index + 1,
                  name: vm.itemTags[index]['itemName'],
                  mappingName: 'tagName',
                  mappingCode: 'tagCode',
                  mappingCount: 'count',
                  value: vm.itemTags[index]['itemCode'],
                  children: [],
                  icon: 'fullscreen_exit'
                }
                tags.push(item)
              }
              tags.push({
                id: 3 + vm.itemTags.length + 1,
                name: 'Tất cả thủ tục',
                mappingName: 'all',
                mappingCode: 'all',
                mappingCount: 'count',
                children: [],
                icon: 'select_all'
              })
              vm.menuServiceInfos = tags
            }
            // =+++++++++++
            vm.$store.dispatch('getGovAgency').then(function (result) {
              vm.currentAgency = newQuery.hasOwnProperty('agency') ? newQuery.agency : ''
              // vm.menuServiceInfos[0].children = result
              vm.$set(vm.menuServiceInfos, 0, {
                  id: 1,
                  name: 'Cơ quan quản lý',
                  mappingName: 'administrationName',
                  mappingCode: 'administrationCode',
                  mappingCount: 'count',
                  children: result,
                  icon: 'account_balance'
                }
              )
              vm.$store.commit('setAgencyList', result)
              // console.log('run app',  current)
              if ((vm.govAgencyList.length > 0 && current.hasOwnProperty('name') && (current.name === 'Landing') && !newQuery.hasOwnProperty('agency')) ||
              (vm.govAgencyList.length > 0 && current.hasOwnProperty('name') && (current.name === 'NotFound') && !newQuery.hasOwnProperty('agency'))
              ) {
                vm.currentAgency = vm.govAgencyList[0].administrationCode
                let queryString = '?'
                newQuery['page'] = 1
                newQuery['agency'] = vm.govAgencyList[0].administrationCode
                for (let key in newQuery) {
                  if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
                    queryString += key + '=' + newQuery[key] + '&'
                  }
                }
                let sortLevel = false
                try {
                  if (sortLevelConfig !== undefined) {
                    sortLevel = true
                  }
                } catch (error) {
                }

                if (!sortLevel) {
                  vm.$router.push({
                    path: vm.pathRouter + queryString,
                    query: {
                      renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
                    }
                  })
                } else {
                  vm.$router.push({
                    path: '/thu-tuc-hanh-chinh?page=1',
                    query: {
                      renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
                    }
                  })
                }

              } else {
                vm.currentAgency = newQuery.hasOwnProperty('agency') ? newQuery.agency : ''
              }
            })
            let filterDomain = {
              agencyCode: ''
            }
            vm.$store.dispatch('getDomain', filterDomain).then(function (result) {
              if (vm.hasCoQuanThucHien) {
                // vm.menuServiceInfos[2].children = result
                vm.$set(vm.menuServiceInfos, 2, {
                    id: 3,
                    name: 'Lĩnh vực',
                    mappingName: 'domainName',
                    mappingCode: 'domainCode',
                    mappingCount: 'count',
                    children: result,
                    icon: 'domain'
                  }
                )
              } else {
                // vm.menuServiceInfos[1].children = result
                vm.$set(vm.menuServiceInfos, 1, {
                    id: 2,
                    name: 'Lĩnh vực',
                    mappingName: 'domainName',
                    mappingCode: 'domainCode',
                    mappingCount: 'count',
                    children: result,
                    icon: 'domain'
                  }
                )
              }
              vm.$store.commit('setDomainList', result)
              vm.currentDomain = newQuery.hasOwnProperty('domain') ? newQuery.domain : ''
            })
            vm.$store.dispatch('getLevelList').then(function (result) {
              if (vm.hasCoQuanThucHien) {
                // vm.menuServiceInfos[3].children = result
                vm.$set(vm.menuServiceInfos, 3, {
                    id: 4,
                    name: 'Mức độ',
                    mappingName: 'levelName',
                    mappingCode: 'level',
                    mappingCount: 'count',
                    children: result,
                    icon: 'sort'
                  }
                )
              } else {
                // vm.menuServiceInfos[2].children = result
                vm.$set(vm.menuServiceInfos, 2, {
                    id: 3,
                    name: 'Mức độ',
                    mappingName: 'levelName',
                    mappingCode: 'level',
                    mappingCount: 'count',
                    children: result,
                    icon: 'sort'
                  }
                )
              }
              vm.$store.commit('setLevelList', result)
              vm.currentLevel = newQuery.hasOwnProperty('level') ? newQuery.level : ''
            })
          }).catch(function(error) {
          })
        }
        vm.$store.dispatch('getGovAgency').then(function (result) {
          vm.currentAgency = newQuery.hasOwnProperty('agency') ? newQuery.agency : ''
          // vm.menuServiceInfos[0].children = result
          vm.$set(vm.menuServiceInfos, 0, {
              id: 1,
              name: 'Cơ quan quản lý',
              mappingName: 'administrationName',
              mappingCode: 'administrationCode',
              mappingCount: 'count',
              children: result,
              icon: 'account_balance'
            }
          )
          vm.$store.commit('setAgencyList', result)
          // console.log('run app',  current)
          if ((vm.govAgencyList.length > 0 && current.hasOwnProperty('name') && (current.name === 'Landing') && !newQuery.hasOwnProperty('agency')) ||
          (vm.govAgencyList.length > 0 && current.hasOwnProperty('name') && (current.name === 'NotFound') && !newQuery.hasOwnProperty('agency'))
          ) {
            vm.currentAgency = vm.govAgencyList[0].administrationCode
            let queryString = '?'
            newQuery['page'] = 1
            newQuery['agency'] = vm.govAgencyList[0].administrationCode
            for (let key in newQuery) {
              if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
                queryString += key + '=' + newQuery[key] + '&'
              }
            }
            let sortLevel = false
            try {
              if (sortLevelConfig !== undefined) {
                sortLevel = true
              }
            } catch (error) {
            }

            if (!sortLevel) {
              vm.$router.push({
                path: vm.pathRouter + queryString,
                query: {
                  renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
                }
              })
            } else {
              vm.$router.push({
                path: '/thu-tuc-hanh-chinh?page=1',
                query: {
                  renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
                }
              })
            }

          } else {
            vm.currentAgency = newQuery.hasOwnProperty('agency') ? newQuery.agency : ''
          }
        })
        // 
        if (vm.hasCoQuanThucHien) {
          vm.$store.dispatch('getGovAgencyThucHien').then(function (result) {
            vm.currentAgencyTh = newQuery.hasOwnProperty('agencyth') ? newQuery.agencyth : ''
            // vm.menuServiceInfos[1].children = result
            vm.$set(vm.menuServiceInfos, 1, {
                id: 2,
                name: 'Cơ quan thực hiện',
                mappingName: 'govAgencyName',
                mappingCode: 'govAgencyCode',
                mappingCount: 'count',
                children: result,
                icon: 'fas fa fa-book'
              }
            )
            vm.$store.commit('setAgencyListThucHien', result)
          }).catch(function(){})
        }
        // 
        let filterDomain = {
          agencyCode: ''
        }
        vm.$store.dispatch('getDomain', filterDomain).then(function (result) {
          if (vm.hasCoQuanThucHien) {
            // vm.menuServiceInfos[2].children = result
            vm.$set(vm.menuServiceInfos, 2, {
                id: 3,
                name: 'Lĩnh vực',
                mappingName: 'domainName',
                mappingCode: 'domainCode',
                mappingCount: 'count',
                children: result,
                icon: 'domain'
              }
            )
          } else {
            // vm.menuServiceInfos[1].children = result
            vm.$set(vm.menuServiceInfos, 1, {
                id: 2,
                name: 'Lĩnh vực',
                mappingName: 'domainName',
                mappingCode: 'domainCode',
                mappingCount: 'count',
                children: result,
                icon: 'domain'
              }
            )
          }
          vm.$store.commit('setDomainList', result)
          vm.currentDomain = newQuery.hasOwnProperty('domain') ? newQuery.domain : ''
        })
        // 
        if (vm.thuTucTinh) {
          let sortCode = function (serviceList) {
            function compare(a, b) {
              if (a.domainName < b.domainName)
                return -1
              if (a.domainName > b.domainName)
                return 1
              return 0
            }
            return serviceList.sort(compare)
          }
          let filterDomain = {
            agencyCode: 'CAP_HUYEN'
          }
          vm.$store.dispatch('getDomain', filterDomain).then(function (result) {
            vm.domainCapHuyen = sortCode(result)
          })
          let filterDomain2 = {
            agencyCode: 'CAP_XA'
          }
          vm.$store.dispatch('getDomain', filterDomain2).then(function (result) {
            vm.domainCapXa = sortCode(result)
          })
        }
        // 
        vm.$store.dispatch('getLevelList').then(function (result) {
          if (vm.hasCoQuanThucHien) {
            // vm.menuServiceInfos[3].children = result
            vm.$set(vm.menuServiceInfos, 3, {
                id: 4,
                name: 'Mức độ',
                mappingName: 'levelName',
                mappingCode: 'level',
                mappingCount: 'count',
                children: result,
                icon: 'sort'
              }
            )
          } else {
            // vm.menuServiceInfos[2].children = result
            vm.$set(vm.menuServiceInfos, 2, {
                id: 3,
                name: 'Mức độ',
                mappingName: 'levelName',
                mappingCode: 'level',
                mappingCount: 'count',
                children: result,
                icon: 'sort'
              }
            )
          }
          vm.$store.commit('setLevelList', result)
          vm.currentLevel = newQuery.hasOwnProperty('level') ? newQuery.level : ''
        })
        vm.currentMethod = newQuery.hasOwnProperty('level') && String(newQuery.level) === '2' ? 'MC' : newQuery.hasOwnProperty('level') && String(newQuery.level === '3,4') ? 'DVC' : ''
        vm.activeAll = newQuery.hasOwnProperty('all') && newQuery['all']
        vm.getCountAll()
        // 
        axios.get('/o/v1/opencps/users/' + window.themeDisplay.getUserId()).then(function(response) {
          let userData = response.data
          vm.$store.commit('setUserLogin', userData)
        })
        .catch(function(error) {
        })
      })
      // 
      
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentParams = newRoute.params
        let currentQuery = newRoute.query
        if (currentQuery.hasOwnProperty('setAgency')) {
          vm.setAgency = true
        }
        if (currentParams.hasOwnProperty('index') && currentParams['index']) {
          vm.isDetail = true
          try {
            if (govTracking_log) {
              govTracking_log()
            }
          } catch (error) {
            
          }
        } else {
          vm.isDetail = false
        }
        vm.currentAgency = currentQuery.hasOwnProperty('agency') ? currentQuery.agency : ''
        vm.currentAgencyTh = currentQuery.hasOwnProperty('agencyth') ? currentQuery.agencyth : ''
        vm.currentDomain = currentQuery.hasOwnProperty('domain') ? currentQuery.domain : ''
        vm.currentLevel = currentQuery.hasOwnProperty('level') ? currentQuery.level : ''
        vm.currentMethod = currentQuery.hasOwnProperty('level') && String(currentQuery.level) === '2' ? 'MC' : currentQuery.hasOwnProperty('level') && String(currentQuery.level === '3,4') ? 'DVC' : ''
        vm.activeAll = currentQuery.hasOwnProperty('all') && currentQuery['all']
      },
      levelList (list) {
        let vm = this
        let dossierMc = 0
        let dossierDvc = 0
        if (Array.isArray(list) && list.length > 0) {
          for (let index in list) {
            if (Number(list[index]['level']) > 2) {
              dossierDvc += Number(list[index]['count'])
            } else {
              dossierMc += Number(list[index]['count'])
            }
          }
          // vm.menuServiceInfos[3]['children'][0]['count'] = dossierMc
          // vm.menuServiceInfos[3]['children'][1]['count'] = dossierDvc
        }
      }
    },
    methods: {
      onResize () {
        let vm = this
        let isMobile = window.innerWidth < 1024
        vm.$store.commit('setIsMobile', isMobile)
      },
      filterAction (index, item1, item2) {
        let vm = this
        console.log('filterAction', index, item1)
        if (vm.hasCoQuanThucHien) {
          if (index === 0) {
            vm.filterAgency(item1)
          } else if (index === 1) {
            vm.filterAgencyThucHien(item1)
          } else if (index === 2) {
            vm.filterDomain(item1)
          } else if (index === 3) {
            vm.filterLevel(item1)
          } else if (index === 4) {
            vm.filterMethod(item1)
          } else if (index === 5) {
            vm.filterAll()
          } else if (index === 99) {
            vm.filterAgencyAndDomain(item1, item2)
          }
        } else if (vm.hasTagServiceInfo) {
          if (index === 0) {
            vm.filterAgency(item1)
          } else if (index === 1) {
            vm.filterDomain(item1)
          } else if (index === 2) {
            vm.filterLevel(item1)
          } else if (index >= 3 && index < vm.menuServiceInfos.length - 1) {
            vm.filterTag(item1)
          } else if (index === vm.menuServiceInfos.length - 1) {
            vm.filterAll()
          } else if (index === 99) {
            vm.filterAgencyAndDomain(item1, item2)
          }
        } else {
          if (index === 0) {
            vm.filterAgency(item1)
          } else if (index === 1) {
            vm.filterDomain(item1)
          } else if (index === 2) {
            vm.filterLevel(item1)
          } else if (index === 3) {
            vm.filterMethod(item1)
          } else if (index === 5) {
            vm.filterAll()
          } else if (index === 99) {
            vm.filterAgencyAndDomain(item1, item2)
          }
        }
      },
      filterAgency (item) {
        var vm = this
        vm.currentAgency = item.administrationCode
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['agency'] = item.administrationCode
        newQuery['agencyth'] = ''
        newQuery['domain'] = ''
        newQuery['level'] = ''
        newQuery['all'] = false
        newQuery['tagCode'] = ''
        newQuery['MaTTHCDP'] = null
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: vm.pathRouter + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      },
      filterAgencyThucHien (item) {
        var vm = this
        vm.currentAgencyth = item.govAgencyCode
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['agencyth'] = item.govAgencyCode
        newQuery['agency'] = ''
        newQuery['domain'] = ''
        newQuery['level'] = ''
        newQuery['all'] = false
        newQuery['tagCode'] = ''
        newQuery['MaTTHCDP'] = null
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: vm.pathRouter + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      },
      filterDomain (item) {
        var vm = this
        vm.currentDomain = item.domainCode
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['domain'] = item.domainCode
        newQuery['agency'] = ''
        newQuery['agencyth'] = ''
        newQuery['level'] = ''
        newQuery['all'] = false
        newQuery['tagCode'] = ''
        newQuery['MaTTHCDP'] = null
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: vm.pathRouter + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      },
      filterLevel (item) {
        var vm = this
        vm.currentLevel = item.level
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['domain'] = ''
        newQuery['agency'] = ''
        newQuery['agencyth'] = ''
        newQuery['all'] = false
        newQuery['tagCode'] = ''
        newQuery['level'] = item.level
        newQuery['MaTTHCDP'] = null
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: vm.pathRouter + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      },
      filterMethod (item) {
        var vm = this
        vm.currentLevel = item.level
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['domain'] = ''
        newQuery['agency'] = ''
        newQuery['agencyth'] = ''
        newQuery['all'] = false
        newQuery['tagCode'] = ''
        newQuery['level'] = item.level
        newQuery['MaTTHCDP'] = null
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: vm.pathRouter + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      },
      filterAll (item) {
        var vm = this
        vm.activeAll = true
        vm.currentLevel = ''
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['domain'] = ''
        newQuery['agency'] = ''
        newQuery['agencyth'] = ''
        newQuery['level'] = ''
        newQuery['MaTTHCDP'] = null
        if (item && item.mappingCode === 'tagCode') {
          newQuery['tagCode'] = item['value']
          newQuery['all'] = false
        } else {
          newQuery['all'] = true
          newQuery['tagCode'] = ''
        }
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: vm.pathRouter + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      },
      filterTag () {
        var vm = this
        vm.activeAll = true
        vm.currentLevel = ''
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['domain'] = ''
        newQuery['agency'] = ''
        newQuery['agencyth'] = ''
        newQuery['level'] = ''
        newQuery['all'] = false
        newQuery['MaTTHCDP'] = null
        newQuery['tagCode'] = item['value']
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: vm.pathRouter + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      },
      filterAgencyAndDomain (item, item2) {
        var vm = this
        vm.currentAgency = item.administrationCode
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['agency'] = item.administrationCode
        newQuery['agencyth'] = ''
        newQuery['domain'] = item2.domainCode
        newQuery['level'] = ''
        newQuery['all'] = false
        newQuery['tagCode'] = ''
        newQuery['MaTTHCDP'] = null
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: vm.pathRouter + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      },
      getCountAll () {
        let vm = this
        let filter = {
          page: 1
        }
        vm.$store.dispatch('getServiceLists', filter).then(function (result) {
          if (result.data) {
            vm.countAllService = result.total
            console.log('countAllService', vm.countAllService)
          }
        }).catch(reject => {
        })
      },
      getCountTag () {
        let vm = this
        vm.countTagCode = {}
        for (let index = 0; index < vm.itemTags.length; index++) {
          vm.countTagCode[vm.itemTags[index]['itemCode']] = 0
          let filter = {
            page: 1,
            tagCode: vm.itemTags[index]['itemCode']
          }
          vm.$store.dispatch('getCountTagCode', filter).then(function (result) {
            if (result.total) {
              vm.countTagCode[vm.itemTags[index]['itemCode']] = result.total
            }
            console.log('countTagCode', vm.countTagCode)
          }).catch(reject => {
          })
        }
        
      },
      goBack () {
        window.history.back()
      }
    }
  }
</script>
<style>
  .service__info__menu .tabs__container {
    border-bottom: 1px solid #0072c0;
  }
</style>
