<template>
  <div class="px-2 py-0">
    <div>
      <v-layout wrap class="px-0 py-0">
        <div style="width: calc(100% - 260px)">
          <v-layout wrap>
            <v-flex xs4 class="pl-2 pr-2">
              <v-text-field
                label="Tên thủ tục"
                placeholder="Nhấn để nhập tên thủ tục"
                v-model="serviceNameKey"
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex xs4 class="pl-2 pr-2">
              <v-select
                :items="listLinhVuc"
                v-model="linhVucSelected"
                autocomplete
                label="Lĩnh vực"
                placeholder="Chọn lĩnh vực"
                item-text="domainName"
                item-value="domainCode"
                :hide-selected="true"
                clearable
              ></v-select>
            </v-flex>
            <v-flex xs4 class="pl-2 pr-2">
              <v-select
                :items="listMucDo"
                v-model="levelSelected"
                autocomplete
                label="Mức độ"
                placeholder="Chọn mức độ"
                item-text="levelName"
                item-value="level"
                :hide-selected="true"
                clearable
              >
                <template slot="item" slot-scope="data">
                  <template>
                    <v-list-tile-content>
                      <v-list-tile-title >Mức độ {{data.item.level}}</v-list-tile-title>
                    </v-list-tile-content>
                  </template>
                </template>
              </v-select>
            </v-flex>
          </v-layout>
        </div>
        <div class="pt-2 text-center" style="width: 260px">
          <v-btn color="primary"
            :loading="loading"
            :disabled="loading"
            @click="filterServiceinfos('filter')"
            style="height:30px;width:110px"
          >
            <v-icon size="18">search</v-icon>
            &nbsp;
            Tra Cứu
            <span slot="loader">Loading...</span>
          </v-btn>
          <v-btn outline color="primary"
            :loading="loading"
            :disabled="loading"
            @click="filterServiceinfos('refesh')"
            style="height:30px;width:110px"
          >
            <v-icon size="18">refresh</v-icon>
            &nbsp;
            Làm Mới
            <span slot="loader">Loading...</span>
          </v-btn>
        </div>
      </v-layout>
      <div class="my-3 pt-2 text-center" style="height: 40px; background-color: #d6e9f7">
        <span style="color:red">Có {{serviceItemTotal}} kết quả được tìm thấy</span>
      </div>
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="10" />
      </content-placeholders>
      <div v-else class="overflowContainer">
        <div class="mb-3 main-header" v-for="(item, index) in govAgencyList" :key="index" v-if="checkAgency(item)">
          <v-expansion-panel class="expansion-pl">
            <v-expansion-panel-content value="1">
              <div slot="header" class="pl-2">
                {{item.administrationName}}
              </div>
              <v-card class="sub-header" v-for="(item2, index2) in listLinhVuc" :key="index2" v-if="checkDomain(item2)">
                <v-expansion-panel class="expansion-pl">
                  <v-expansion-panel-content value="1">
                    <div slot="header" class="pl-4">
                      {{item2.domainName}}
                    </div>
                    <v-card class="list-bdb">
                      <div class="pl-4 pr-2 py-1 boder-bottom" v-for="(item3, index3) in listThuTuc" :key="index3" v-if="checkThuTuc(item, item2, item3)">
                        <v-layout wrap class="px-0 py-0" style="align-items: center">
                          <div style="width: 110px">
                            <v-chip class="mx-0 my-0" label :color="getColor(item3.maxLevel)" text-color="white" style="height:25px">
                              Mức độ {{item3.maxLevel}}
                            </v-chip>
                          </div>
                          <div class="px-2" style="width: calc(100% - 220px)">{{item3.serviceName}}</div>
                          <div style="width: 110px">
                            <v-btn color="primary"
                              :loading="loading"
                              :disabled="loading"
                              @click="viewDetail(item3)"
                              class="mx-0"
                              style="width: 100%"
                            >
                              Chi tiết
                              <span slot="loader">Loading...</span>
                            </v-btn>
                          </div>
                        </v-layout>
                      </div>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
export default {
  props: [],
  components: {},
  data: () => ({
    loading: false,
    loadingAction: false,
    serviceNameKey: '',
    listLinhVuc: [],
    linhVucSelected: '',
    listMucDo: [],
    levelSelected: '',
    listThuTuc: [],
    govAgencyList: [],
    serviceItemTotal: 0
  }),
  computed: {},
  created () {
    let vm = this
    vm.$nextTick(function () {
      var vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      vm.serviceNameKey = newQuery.hasOwnProperty('serviceName') ? newQuery.serviceName : ''
      vm.levelSelected = newQuery.hasOwnProperty('level') ? Number(newQuery.level) : ''
      vm.linhVucSelected = newQuery.hasOwnProperty('domain') ? newQuery.domain : ''
      vm.loading = true
      vm.listThuTuc = []
      vm.$store.dispatch('getDomainLists').then(function (result) {
        vm.listLinhVuc = result
      })
      vm.$store.dispatch('getLevelLists').then(function (result) {
        vm.listMucDo = result
      })
      vm.$store.dispatch('getGovAgency').then(function (result) {
        vm.govAgencyList = result
      })
      vm.doLoadingThuTuc()
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
      vm.serviceNameKey = currentQuery.hasOwnProperty('serviceName') ? currentQuery.serviceName : ''
      vm.levelSelected = currentQuery.hasOwnProperty('level') ? Number(currentQuery.level) : ''
      vm.linhVucSelected = currentQuery.hasOwnProperty('domain') ? currentQuery.domain : ''
      vm.doLoadingThuTuc()
    }
  },
  methods: {
    filterServiceinfos (refresh) {
      var vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      if (refresh === 'refesh') {
        vm.serviceNameKey = ''
        vm.levelSelected = ''
        vm.linhVucSelected = ''
      }
      newQuery['serviceName'] = vm.serviceNameKey ? vm.serviceNameKey : ''
      newQuery['level'] = vm.levelSelected ? vm.levelSelected : ''
      newQuery['domain'] = vm.linhVucSelected ? vm.linhVucSelected : ''
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
    },
    doLoadingThuTuc () {
      var vm = this
      vm.listThuTuc = []
      vm.loading = true
      let currentQuery = router.history.current.query
      var filter = null
      filter = {
        serviceName: currentQuery.hasOwnProperty('serviceName') ? currentQuery.serviceName : '',
        level: currentQuery.hasOwnProperty('level') ? currentQuery.level : '',
        domain: currentQuery.hasOwnProperty('domain') ? currentQuery.domain : ''
      }
      vm.$store.dispatch('getServiceLists', filter).then(function (result) {
        vm.loading = false
        vm.listThuTuc = result.data
        vm.serviceItemTotal = result.total
      }).catch(reject => {
        vm.loading = false
        vm.listThuTuc = []
        vm.serviceItemTotal = 0
      })
    },
    viewDetail (item) {
      router.push('/tra-cuu-thu-tuc/' + item.serviceInfoId)
    },
    checkAgency (agency) {
      var vm = this
      let checkAgency
      checkAgency = vm.listThuTuc.filter(function (item) {
        return item.administrationCode === agency.administrationCode
      })
      if (checkAgency.length > 0) {
        return true
      } else {
        return false
      }
    },
    checkDomain (domain) {
      var vm = this
      let checkDomain
      checkDomain = vm.listThuTuc.filter(function (item) {
        return item.domainCode === domain.domainCode
      })
      if (checkDomain.length > 0) {
        return true
      } else {
        return false
      }
    },
    checkThuTuc (govAgency, domain, serviceinfos) {
      if (serviceinfos.administrationCode === govAgency.administrationCode && serviceinfos.domainCode === domain.domainCode) {
        return true
      } else {
        return false
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
    }
  }
}
</script>
