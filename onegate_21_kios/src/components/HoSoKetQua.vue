<template>
  <div class="py-0 kios-item">
    <div>
      <v-card color="transparent" flat style="">
        <div>
          <!-- <h4 v-if="agencies.length === 1" class="py-1 text-xs-center" style="color:green; text-transform:uppercase;font-size: 1.2em !important;">
            {{agencies[0]['administrationName']}}
          </h4> -->
          <h4 class="py-2 mx-3 text-xs-center">
            <span style="color:#065694;font-size: 1.2em !important;">DANH SÁCH HỒ SƠ CÓ KẾT QUẢ NGÀY {{fromDate()}} 
              <span v-if="dossierList.length > 0">(Tổng số: {{dossierList.length}} hồ sơ)</span>
            </span>
          </h4>
          <div class="py-3 mx-3"> 
            <v-layout wrap class="mb-3">
              <v-flex xs12 sm6 offset-sm3>
                <!-- <v-text-field class="input-border input-search"
                  label="Mã hồ sơ/ tên chủ hồ sơ"
                  v-model="dossierNoKey"
                  @keyup.enter="searchKeyword"
                  @click:append="searchKeyword"
                  append-icon="search"
                  box
                  clearable
                ></v-text-field> -->
                <div class="input-custom">
                  <input id="dossierNoKey" type="text" @focus="show" @keyup.enter="searchKeyword" required="required" />
                  <span class="bar"></span>
                  <label for="dossierNoKey">Mã hồ sơ, tên chủ hồ sơ</label>
                  <!-- <v-icon class="icon-prepend text-bold" size="18" @click="searchKeyword">search</v-icon> -->
                  <v-btn color="primary"
                    @click="searchKeyword"
                    class="kios-btn"
                    style="top: -5px;
                    position: absolute;
                    right: -4px;
                    height: 48px !important;
                    border-bottom-left-radius: 0px;"
                  >
                    <v-icon size="20">search</v-icon>
                    &nbsp;
                    Tra cứu
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </div>
              </v-flex>
            </v-layout>
            <content-placeholders class="mt-3" v-if="loading">
              <content-placeholders-text :lines="10" />
            </content-placeholders>
            <div v-else>
              <v-carousel hide-delimiters hide-controls interval="10000" @input="changeItem($event)" v-if="dossierList.length > 0" style="background: transparent;">
                <v-carousel-item
                  v-for="i in totalPages"
                  :key="i"
                  transition="fade"
                  reverse-transition="fade"
                >
                  <v-data-table
                  :headers="headerTable"
                  :items="dossierList"
                  :pagination.sync="pagination"
                  hide-actions
                  class="table-bordered"
                  light
                  >
                    <template slot="items" slot-scope="props">
                      <tr v-bind:class="{'active': props.index%2==1}">
                        <td class="text-xs-center">
                          <span>{{pagination.page * pagination.rowsPerPage - pagination.rowsPerPage + props.index + 1}}</span><br>
                        </td>
                        <td class="text-xs-left">
                          <span>{{props.item.dossierNo}}</span><br>
                        </td>
                        <td class="text-xs-left" >
                          <span>{{props.item.applicantName}}</span>
                        </td>
                        <td class="text-xs-left">
                          <span>{{props.item.receiveDate}}</span>
                        </td>
                        <td class="text-xs-left">
                          <span>{{props.item.releaseDate}}</span>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-carousel-item>
              </v-carousel>
              <v-flex xs12 v-else>
                <v-alert class="mt-3" :value="true" outline color="blue" icon="priority_high">
                  Không có hồ sơ có kết quả ngày {{fromDate()}}
                </v-alert>
              </v-flex>
            </div>
          </div>
        </div>
        <!-- <v-btn v-if="!isMobile" class="back-btn" @click="changeScreen" fab color="primary">
          <v-icon size="20" v-if="!fullScreen" dark>fullscreen</v-icon>
          <v-icon size="20" v-if="fullScreen" dark>fullscreen_exit</v-icon>
        </v-btn> -->
        <v-btn class="back-btn" outline large color="primary" @click="goBack" style="width: 120px !important;">
          <v-icon style="font-size: 24px !important;">reply</v-icon>&nbsp;
          Quay lại 
        </v-btn>
      </v-card>
      <div class="virtual-keyboard" v-if="visible && !isMobile">
        <v-btn small fab color="#383533" @click="visible = false" style="position:absolute;right:0;top:0">
          <v-icon color="#fff">clear</v-icon>
        </v-btn>
        <vue-touch-keyboard v-if="visible" :layout="layout" :cancel="hide" :accept="accept" :input="input" :next="next" :options="options" />
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import $ from 'jquery'
import VueTouchKeyBoard from './keyboard.vue'
export default {
  props: [],
  components: {
    'vue-touch-keyboard': VueTouchKeyBoard
  },
  data: () => ({
    loading: false,
    loadingAction: false,
    dossierNoKey: '',
    agencies: [],
    dossierList: [],
    totalPages: 0,
    pagination: {
      rowsPerPage: 5,
      page: 1
    },
    headerTable: [
      {
        text: 'STT',
        align: 'center',
        sortable: false,
        width: '50px'
      },
      {
        text: 'Mã hồ sơ',
        align: 'center',
        sortable: false,
        width: '200px'
      },
      {
        text: 'Chủ hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Ngày nộp',
        align: 'center',
        sortable: false,
        width: '200px'
      },
      {
        text: 'Ngày có kết quả',
        align: 'center',
        sortable: false,
        width: '200px'
      }
    ],
    visible: false,
    layout: 'normal',
    input: null,
    options: {
      useKbEvents: true,
      preventClickEvent: false
    }
  }),
  computed: {
    fullScreen () {
      return this.$store.getters.getFullScreen
    },
    groupIds () {
      return this.$store.getters.getGroupid
    },
    groupIdArr () {
      return this.getGroupIdArr(this.groupIds)
    },
    isMobile () {
      return this.$store.getters.getIsMobile
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      let current = vm.$router.history.current
      let newQuery = current.query
      vm.dossierNoKey = newQuery.hasOwnProperty('keyword') ? newQuery.keyword : ''
      setTimeout (function () {
        $('#dossierNoKey').val(vm.dossierNoKey)
      }, 300)
      vm.$store.commit('setFullScreen', false)
      vm.$store.dispatch('agencies').then(function (result) {
        vm.agencies = result
      })
      vm.doLoadingDataHoSo()
      setInterval(function () {
        vm.doLoadingDataHoSo()
      }, 1800000)
    })
  },
  mounted () {
    let vm = this
    let currentQuery = vm.$router.history.current.query
    let keyword = currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : ''
    vm.dossierNoKey = keyword
    setTimeout (function () {
      $('#dossierNoKey').val(vm.dossierNoKey)
    }, 300)
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentQuery = newRoute.query
      let keyword = currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : ''
      vm.dossierNoKey = keyword
      $('#dossierNoKey').val(vm.dossierNoKey)
      vm.searchDossier()
    }
  },
  methods: {
    changeItem (event) {
      let vm = this
      vm.pagination.page = event + 1
    },
    doLoadingDataHoSo () {
      let vm = this
      vm.dossierList = []
      vm.loading = true
      let filter = {
        fromDate: vm.fromDate(),
        toDate: vm.fromDate(),
        groupId: '',
        keyword: vm.dossierNoKey
      }
      let groupIds = vm.groupIdArr.length
      if (groupIds > 0) {
        let count = 0
        for (var key = 0; key < groupIds; key++) {
          filter.groupId = vm.groupIdArr[key]
          console.log('filter', filter)
          vm.$store.dispatch('loadingDataHoSoKQ', filter).then(function (result) {
            count += 1
            if (result.data) {
              vm.dossierList = vm.dossierList.concat(result.data)
            }
            if (count === groupIds) {
              console.log('dossierList', vm.dossierList)
              vm.totalPages = Math.ceil(vm.dossierList.length / vm.pagination.rowsPerPage)
              vm.loading = false
            }
          }).catch(reject => {
            count += 1
            if (count === groupIds) {
              vm.totalPages = Math.ceil(vm.dossierList.length / vm.pagination.rowsPerPage)
              vm.loading = false
            }
          })
        }
      } else {
        vm.$store.dispatch('loadingDataHoSoKQ', filter).then(function (result) {
          vm.loading = false
          if (result.data) {
            vm.dossierList = vm.dossierList.concat(result.data)
            vm.totalPages = Math.ceil(vm.dossierList.length / vm.pagination.rowsPerPage)
            console.log('dosierLisst', vm.dossierList)
          }
        }).catch(reject => {
          vm.loading = false
        })
      }
    },
    searchKeyword () {
      let vm = this
      vm.visible = false
      vm.dossierNoKey = $('#dossierNoKey').val()
      let keyword = vm.dossierNoKey !== null && vm.dossierNoKey !== 'null' ? vm.dossierNoKey : ''
      vm.$router.push({
        path: '/ho-so-co-ket-qua?keyword=' + keyword,
        query: {
          renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
        }
      })
    },
    searchDossier () {
      let vm = this
      vm.dossierList = []
      vm.loading = true
      let filter = {
        fromDate: vm.fromDate(),
        toDate: vm.fromDate(),
        groupId: '',
        keyword: vm.dossierNoKey
      }
      vm.$store.dispatch('loadingDataHoSoKQ', filter).then(function (result) {
        vm.loading = false
        if (result.data) {
          vm.dossierList = vm.dossierList.concat(result.data)
          vm.totalPages = Math.ceil(vm.dossierList.length / vm.pagination.rowsPerPage)
        }
      }).catch(reject => {
        vm.loading = false
      })
    },
    getGroupIdArr (groupIds) {
      if (groupIds) {
        return groupIds.split(',')
      } else {
        return []
      }
    },
    goBack () {
      window.history.back()
    },
    changeScreen () {
      var vm = this
      vm.$store.commit('setFullScreen', !vm.fullScreen)
    },
    fromDate () {
      let value = new Date()
      return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()}`
    },
    toDate () {
      let value = new Date((new Date()).getTime() + 86400000)
      return `${(value.getDate()).toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()}`
    },
    //
    show (e) {
      this.validPass = true
      this.input = e.target
      if (!this.visible) {
        this.visible = true
      }
      this.bindClick('search')
    },
    bindClick (type) {
      var vm = this
      setTimeout(function () {
        $('.keyboard .enter').unbind('click')
        if (type === 'search') {
          $('.keyboard .enter').bind('click', function () {
            vm.searchKeyword()
          })
        } else if (type === 'view') {
          $('.keyboard .enter').bind('click', function () {
            vm.submitViewDetail()
          })
        }
      }, 300)
    }
  }
}
</script>
