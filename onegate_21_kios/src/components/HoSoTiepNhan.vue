<template>
  <div class="py-0 kios-item" :class="!isMobile ? 'pr-3' : ''">
    <div>
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="10" />
      </content-placeholders>
      <v-card flat v-else class="mb-0">
        <div style="background-color: #ffffff">
          <h4 v-if="agencies.length === 1" class="py-1 text-xs-center" style="color:green; text-transform:uppercase">
            {{agencies[0]['administrationName']}}
          </h4>
          <h4 class="py-2 mx-3 text-xs-center">
            <span style="color:#065694">DANH SÁCH HỒ SƠ TIẾP NHẬN NGÀY {{fromDate()}} 
              <span v-if="dossierList.length > 0">(Tổng số: {{dossierList.length}} hồ sơ)</span>
            </span>
          </h4>
          <div class="py-3 mx-3"> 
            <v-layout wrap class="mb-3">
              <v-flex xs12 sm6 right>
                <v-text-field class="input-border input-search"
                  label="Mã hồ sơ/ tên chủ hồ sơ"
                  v-model="dossierNoKey"
                  @keyup.enter="searchKeyword"
                  @click:append="searchKeyword"
                  append-icon="search"
                  box
                  clearable
                ></v-text-field>
              </v-flex>
            </v-layout>
            <div v-if="dossierList.length > 0">
              <v-carousel hide-delimiters hide-controls interval="10000" @input="changeItem($event)">
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
                          <span v-if="props.item.online">{{props.item.submitDate}}</span>
                          <span v-else>{{props.item.receiveDate}}</span>
                        </td>
                        <td class="text-xs-left">
                          <span>{{props.item.receiveDate}}</span>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-carousel-item>
              </v-carousel>
            </div>
            <v-flex xs12 v-else>
              <v-alert class="mt-3" :value="true" outline color="blue" icon="priority_high">
                Không có hồ sơ tiếp nhận ngày {{fromDate()}}
              </v-alert>
            </v-flex>
          </div>
        </div>
        <v-btn v-if="!isMobile" class="back-btn" @click="changeScreen" fab color="primary">
          <v-icon v-if="!fullScreen" dark>fullscreen</v-icon>
          <v-icon v-if="fullScreen" dark>fullscreen_exit</v-icon>
        </v-btn>
      </v-card>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import $ from 'jquery'
export default {
  props: [],
  components: {},
  data: () => ({
    loading: false,
    loadingAction: false,
    dossierList: [],
    agencies: [],
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
        width: '100px'
      },
      {
        text: 'Ngày tiếp nhận',
        align: 'center',
        sortable: false,
        width: '130px'
      }
    ]
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
    let currentQuery = vm.$router.history.current.query
    let keyword = currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : ''
    vm.dossierNoKey = keyword
    vm.$nextTick(function () {
      vm.$store.commit('setFullScreen', false)
      vm.$store.dispatch('agencies').then(function (result) {
        vm.agencies = result
      })
      vm.searchDossier()
      setInterval(function () {
        vm.dossierNoKey = ''
        vm.searchDossier()
      }, 1800000)
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentQuery = newRoute.query
      let keyword = currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : ''
      vm.dossierNoKey = keyword
      vm.searchDossier()
    }
  },
  methods: {
    changeItem (event) {
      let vm = this
      vm.pagination.page = event + 1
    },
    /*
    doLoadingDataHoSo () {
      let vm = this
      vm.dossierList = []
      vm.loading = true
      let groupIds = vm.groupIdArr.length
      if (groupIds > 0) {
        let count = 0
        for (var key = 0; key < groupIds; key++) {
          let filter = {
            fromDate: vm.fromDate(),
            toDate: vm.fromDate(),
            groupId: vm.groupIdArr[key]
          }
          console.log('filter', filter)
          vm.$store.dispatch('loadingDataHoSoTN', filter).then(function (result) {
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
        let filter = {
          fromDate: vm.fromDate(),
          toDate: vm.fromDate()
        }
        vm.$store.dispatch('loadingDataHoSoTN', filter).then(function (result) {
          vm.loading = false
          if (result.data) {
            vm.dossierList = result.data
            vm.totalPages = Math.ceil(vm.dossierList.length / vm.pagination.rowsPerPage)
          }
        }).catch(reject => {
          vm.loading = false
        })
      }
    },
    */
    searchKeyword () {
      let vm = this
      let keyword = vm.dossierNoKey !== null && vm.dossierNoKey !== 'null' ? vm.dossierNoKey : ''
      vm.$router.push({
        path: '/tiep-nhan-ho-so?keyword=' + keyword,
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
      vm.$store.dispatch('loadingDataHoSoTN', filter).then(function (result) {
        vm.loading = false
        if (result.data) {
          vm.dossierList = result.data
          vm.totalPages = Math.ceil(vm.dossierList.length / vm.pagination.rowsPerPage)
        }
      }).catch(reject => {
        vm.loading = false
      })
    },
    changeScreen () {
      var vm = this
      vm.$store.commit('setFullScreen', !vm.fullScreen)
    },
    getGroupIdArr (groupIds) {
      if (groupIds) {
        return groupIds.split(',')
      } else {
        return []
      }
    },
    fromDate () {
      let value = new Date()
      return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()}`
    },
    toDate () {
      let value = new Date((new Date()).getTime() + 86400000)
      return `${(value.getDate()).toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()}`
    }
  }
}
</script>
