<template>
  <div class="px-2 py-0 kios-item">
    <h4 class="pt-2 ml-2">
      <span style="color:#065694">TRA CỨU THỦ TỤC HÀNH CHÍNH </span>
    </h4>
    <v-layout wrap class="mt-2">
      <v-flex xs4 class="pl-2 pr-2">
        <v-select
          class="select-border"
          :items="govAgencyList"
          v-model="govAgencySelected"
          placeholder="Chọn cơ quan"
          item-text="administrationName"
          item-value="administrationCode"
          :hide-selected="true"
          @change="changeAdministration"
        ></v-select>
      </v-flex>
      <v-flex xs4 class="pl-2 pr-2">
        <v-select
          class="select-border"
          :items="listLinhVuc"
          v-model="linhVucSelected"
          placeholder="Chọn lĩnh vực"
          item-text="domainName"
          item-value="domainCode"
          :hide-selected="true"
          @change="changeDomain"
        ></v-select>
      </v-flex>
      <!-- <v-flex xs3 class="pl-2 pr-2">
        <v-select
          class="select-border"
          :items="listMucDo"
          v-model="levelSelected"
          autocomplete
          placeholder="Chọn mức độ"
          item-text="levelName"
          item-value="level"
          :hide-selected="true"
          @change="changeLevel"
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
      </v-flex> -->
      <v-flex xs4 class="pl-2 pr-2">
        <div class="input-border input-group input-group--placeholder input-group--text-field primary--text">
          <div class="input-group__input">
            <input id="serviceNameKey" class="kios-input" data-layout="normal" @keyup.enter="filterServiceinfos('keyword')" @focus="show" aria-label="Tên thủ tục" placeholder="Nhấn để nhập tên thủ tục" type="text">
            <i aria-hidden="true" @click="filterServiceinfos('keyword')" class="px-3 icon material-icons input-group__append-icon input-group__icon-cb input-group__icon-clearable">search</i>
          </div>
        </div>
      </v-flex>
    </v-layout>
    <!-- <div class="text-center" style="width: 130px">
      <v-btn color="primary"
        :loading="loading"
        :disabled="loading"
        @click="filterServiceinfos('filter')"
        style="height:34px;width:110px;margin-top:17px"
      >
        <v-icon size="18">search</v-icon>
        &nbsp;
        Tra Cứu
        <span slot="loader">Loading...</span>
      </v-btn>
    </div> -->
    <content-placeholders class="mt-3" v-if="loading">
      <content-placeholders-text :lines="10" />
    </content-placeholders>
    <div class="mt-4" v-if="!loading && !activeDetailService && !showListThuTuc && govAgencyList && !govAgencySelected && govAgencyList.length > 0" :class="visible ? 'overlayActive': ''">
      <v-layout class="wrap">
        <v-flex xs6 sm4 class="pr-3" v-for="(item, index) in govAgencyList" :key="index">
          <v-btn outline flat color="primary" class="btn-select" @click="filterAdministration(item)" style="width:100%;background-color:#b3d4fc5c!important">{{item.administrationName}}</v-btn>
        </v-flex>
      </v-layout>
    </div>
    <div class="mt-4 mx-2" v-if="!loading && !activeDetailService && !showListThuTuc && listLinhVuc && govAgencySelected && !linhVucSelected && listLinhVuc.length > 0" :class="visible ? 'overlayActive': ''">
      <!-- danh sách lĩnh vực -->
      <div class="wrap-scroll wrap-scroll-domain list-domain">
        <v-list class="py-0">
          <template v-for="(item, index) in listLinhVuc" >
            <v-list-tile :key="index" @click="filterDomain(item)">
              <v-list-tile-content>
                <v-list-tile-title v-html="item.domainName"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </div>
      <div v-if="totalPaggingLinhVuc > 10" class="text-xs-center layout wrap mt-2" style="position: relative;">
        <div class="flex pagging-table px-2"> 
          <tiny-pagination :total="totalPaggingLinhVuc" :page="pageListLinhVuc" custom-class="custom-tiny-class" 
            @tiny:change-page="paggingData" ></tiny-pagination> 
        </div>
      </div>
    </div>
    <!-- danh sách thủ tục -->
    <div class="mt-4" v-if="!loading && !activeDetailService && showListThuTuc" :class="visible ? 'overlayActive': ''">
      <div class="wrap-scroll wrap-scroll-tableservice">
        <v-data-table
          :headers="headersTable"
          :items="listThuTuc"
          hide-actions
          class="table-bordered table-thu-tuc ml-2"
        >
          <template slot="items" slot-scope="props">
            <tr v-bind:class="{'active': props.index%2==1}" @click="viewDetail(props.item)">
              <td class="text-xs-center">
                <content-placeholders v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{pageListThuTuc * 10 - 10 + props.index + 1}}</span><br>
                </div>
              </td>
              <td class="text-xs-left" >
                <content-placeholders v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.serviceName}}</span>
                </div>
              </td>
              <td class="text-xs-left">
                <content-placeholders v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>
                    <span>{{props.item.domainName}}</span>
                  </span>
                </div>
              </td>
              <td class="text-xs-center">
                <content-placeholders v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>
                    <v-chip class="mx-0 my-0" label :color="getColor(props.item.maxLevel)" text-color="white" style="height:25px">
                      Mức độ {{props.item.maxLevel}}
                    </v-chip>
                    <!-- <span :style="getColor(props.item.maxLevel)">Mức độ {{props.item.maxLevel}}</span> -->
                  </span>
                </div>
              </td>
            </tr>
          </template>
          <template slot="no-data">
            <div class="text-xs-center mt-2">
              Không có thủ tục nào được tìm thấy
            </div>
          </template>
        </v-data-table>
      </div>
      <div v-if="totalPaggingThuTuc > 10" class="text-xs-center layout wrap mt-2" style="position: relative;">
        <div class="flex pagging-table px-2">
          <tiny-pagination :total="totalPaggingThuTuc" :page="pageListThuTuc" custom-class="custom-tiny-class" 
            @tiny:change-page="paggingData" ></tiny-pagination> 
        </div>
      </div>
    </div>
    <!-- chi tiết thủ tục -->
    <div class="mt-4" v-if="!loading && activeDetailService">
      <chi-tiet-thu-tuc :index="serviceId"></chi-tiet-thu-tuc>
    </div>
    <div class="virtual-keyboard" v-if="visible">
      <vue-touch-keyboard v-if="visible" :layout="layout" :cancel="hide" :accept="accept" :input="input" :next="next" />
    </div>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import $ from 'jquery'
import TinyPagination from './pagination.vue'
import VueTouchKeyBoard from './keyboard.vue'
import ChiTietThuTuc from './ChiTietThuTuc.vue'
export default {
  props: [],
  components: {
    'tiny-pagination': TinyPagination,
    'vue-touch-keyboard': VueTouchKeyBoard,
    'chi-tiet-thu-tuc': ChiTietThuTuc
  },
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
    govAgencySelected: {},
    serviceItemTotal: 0,
    pageListLinhVuc: 1,
    pageListThuTuc: 1,
    totalPaggingLinhVuc: 0,
    totalPaggingThuTuc: 0,
    serviceId: '',
    headersTable: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tên thủ tục',
        align: 'center',
        sortable: false
      },
      {
        text: 'Lĩnh vực',
        align: 'center',
        sortable: false
      },
      {
        text: 'Mức độ',
        align: 'center',
        sortable: false
      }
    ],
    showListThuTuc: false,
    //
    visible: false,
    layout: 'normal',
    input: null,
    options: {
      useKbEvents: false
    }
  }),
  computed: {
    activeDetailService () {
      return this.$store.getters.getActiveDetailService
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      var vm = this
      vm.$store.commit('setFullScreen', false)
      let current = vm.$router.history.current
      let newQuery = current.query
      vm.loading = true
      vm.listThuTuc = []
      vm.$store.dispatch('getGovAgency').then(function (result) {
        vm.loading = false
        vm.govAgencyList = result
        if (vm.govAgencyList.length > 0) {
          // vm.serviceNameKey = newQuery.hasOwnProperty('keyword') ? newQuery.keyword : ''
          $('#serviceNameKey').val(newQuery.hasOwnProperty('keyword') ? newQuery.keyword : '')
          vm.levelSelected = newQuery.hasOwnProperty('level') ? Number(newQuery.level) : ''
          vm.linhVucSelected = newQuery.hasOwnProperty('domain') ? newQuery.domain : ''
          vm.govAgencySelected = newQuery.hasOwnProperty('administration') ? newQuery.administration : ''
          if (vm.govAgencySelected) {
            vm.loading = true
            let filter = {
              page: newQuery.page ? newQuery.page : 1,
              administrationCode: vm.govAgencySelected
            }
            vm.$store.dispatch('getDomainListsPublic', filter).then(function (result) {
              vm.loading = false
              if (result.data) {
                vm.listLinhVuc = result.data
                vm.totalPaggingLinhVuc = Number(result.total)
              } else {
                vm.listLinhVuc = []
                vm.totalPaggingLinhVuc = 0
              }
              vm.pageListLinhVuc = Number(newQuery.page) ? Number(newQuery.page) : 1
              if (vm.govAgencySelected && vm.linhVucSelected) {
                vm.doLoadingThuTuc()
              }
            }).catch(reject => {
              vm.listLinhVuc = []
              vm.totalPaggingLinhVuc = 0
              vm.loading = false
            })
          }
        }
      }).catch(reject => {
        vm.loading = false
      })
      // vm.$store.dispatch('getLevelLists').then(function (result) {
      //   vm.listMucDo = result
      // })
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
      vm.govAgencySelected = currentQuery.hasOwnProperty('administration') ? currentQuery.administration : ''
      // vm.serviceNameKey = currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : ''
      $('#serviceNameKey').val(currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : '')
      vm.levelSelected = currentQuery.hasOwnProperty('level') ? Number(currentQuery.level) : ''
      vm.linhVucSelected = currentQuery.hasOwnProperty('domain') ? currentQuery.domain : ''
      if (vm.govAgencySelected && !vm.linhVucSelected) {
        vm.loading = true
        let filter = {
          page: currentQuery.page ? currentQuery.page : 1,
          administrationCode: vm.govAgencySelected
        }
        vm.$store.dispatch('getDomainListsPublic', filter).then(function (result) {
          vm.loading = false
          if (result.data) {
            vm.listLinhVuc = result.data
            vm.totalPaggingLinhVuc = Number(result.total)
          } else {
            vm.listLinhVuc = []
            vm.totalPaggingLinhVuc = 0
          }
          vm.pageListLinhVuc = Number(currentQuery.page) ? Number(currentQuery.page) : 1
        }).catch(reject => {
          vm.loading = false
          vm.listLinhVuc = []
          vm.totalPaggingLinhVuc = 0
        })
      }
      if (vm.linhVucSelected || $('#serviceNameKey').val() !== '') {
        vm.doLoadingThuTuc()
        vm.showListThuTuc = true
      }
      if (currentQuery.hasOwnProperty('detail')) {
        vm.$store.commit('setActiveDetailService', true)
      } else {
        vm.$store.commit('setActiveDetailService', false)
      }
    }
  },
  methods: {
    filterServiceinfos (type) {
      var vm = this
      if (type === 'keyword' && $('#serviceNameKey').val() !== '') {
        vm.showListThuTuc = true
      }
      vm.visible = false
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      // newQuery['keyword'] = vm.serviceNameKey ? vm.serviceNameKey : ''
      if (newQuery.hasOwnProperty('detail')) {
        newQuery['detail'] = ''
      }
      newQuery['keyword'] = $('#serviceNameKey').val()
      newQuery['level'] = vm.levelSelected ? vm.levelSelected : ''
      newQuery['domain'] = vm.linhVucSelected ? vm.linhVucSelected : ''
      newQuery['administration'] = vm.govAgencySelected ? vm.govAgencySelected : ''
      newQuery['page'] = 1
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
        page: currentQuery.page ? currentQuery.page : 1,
        administration: currentQuery.hasOwnProperty('administration') ? currentQuery.administration : vm.govAgencySelected,
        keyword: currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : '',
        level: currentQuery.hasOwnProperty('level') ? currentQuery.level : vm.levelSelected,
        domain: currentQuery.hasOwnProperty('domain') ? currentQuery.domain : vm.linhVucSelected
      }
      vm.$store.dispatch('getServiceLists', filter).then(function (result) {
        vm.loading = false
        if (result.data) {
          vm.listThuTuc = result.data
          vm.pageListThuTuc = Number(currentQuery.page) ? Number(currentQuery.page) : 1
          vm.totalPaggingThuTuc = result.total
        } else {
          vm.totalPaggingThuTuc = 0
          vm.listThuTuc = []
        }
        vm.serviceItemTotal = result.total
      }).catch(reject => {
        vm.loading = false
        vm.listThuTuc = []
        vm.totalPaggingThuTuc = 0
        vm.serviceItemTotal = 0
      })
    },
    changeAdministration () {
      var vm = this
      vm.showListThuTuc = false
      vm.listLinhVuc = []
      vm.linhVucSelected = ''
      vm.levelSelected = ''
      vm.visible = false
      let current = vm.$router.history.current
      let newQuery = {
        administration: ''
      }
      let queryString = '?'
      setTimeout(function () {
        newQuery['administration'] = vm.govAgencySelected ? vm.govAgencySelected : ''
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
      }, 200)
    },
    filterAdministration (item) {
      var vm = this
      vm.govAgencySelected = item.administrationCode
      vm.changeAdministration()
    },
    changeDomain () {
      var vm = this
      vm.showListThuTuc = true
      setTimeout(function () {
        if (vm.linhVucSelected) {
          vm.filterServiceinfos()
        }
      }, 200)
    },
    filterDomain (item) {
      var vm = this
      vm.linhVucSelected = item.domainCode
      vm.changeDomain()
    },
    changeLevel () {
      var vm = this
      setTimeout(function () {
        vm.filterServiceinfos()
      }, 200)
    },
    viewDetail (item) {
      var vm = this
      vm.serviceId = item.serviceInfoId
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      if (newQuery.hasOwnProperty('detail')) {
        newQuery['detail'] = ''
      }
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      queryString += '&detail=true'
      vm.$router.push({
        path: current.path + queryString
      })
    },
    paggingData (config) {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['page'] = ''
      // console.log('queryString=====', queryString)
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null && newQuery[key] !== 'null') {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      queryString += 'page=' + config.page
      vm.$router.push({
        path: current.path + queryString
      })
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
    govAgencyName (arg) {
      var vm = this
      if (arg) {
        let value = vm.govAgencyList.filter(function (item) {
          return item.administrationCode.toString() === arg.toString()
        })
        if (value.length > 0) {
          return value[0].administrationName
        }
      } else {
        return ''
      }
    },
    //
    clear (id) {
      $(`#${id}`).val('')
    },
    accept (text) {
      this.hide()
    },
    show (e) {
      this.input = e.target
      if (!this.visible) {
        this.visible = true
      }
      this.bindClick()
    },
    hide () {
      this.visible = false
    },
    next () {
      let inputs = document.querySelectorAll('input')
      let found = false
      let arr1 = []
      arr1.forEach.call(inputs, (item, i) => {
        if (!found && item === this.input && i < inputs.length - 1) {
          found = true
          this.$nextTick(() => {
            inputs[i + 1].focus()
          })
        }
      })
      if (!found) {
        this.input.blur()
        this.hide()
      }
    },
    bindClick () {
      var vm = this
      setTimeout(function () {
        $('.keyboard .line:nth-child(2) .key:last-child').unbind('click')
        $('.keyboard .line:nth-child(2) .key:last-child').bind('click', function () {
          vm.filterServiceinfos()
        })
      }, 300)
    }
  }
}
</script>
