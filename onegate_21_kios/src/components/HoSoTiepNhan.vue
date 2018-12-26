<template>
  <div class="py-0 kios-item">
    <div>
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="10" />
      </content-placeholders>
      <v-card v-else>
        <div style="background-color: #ffffff">
          <h4 class="py-3 ml-3">
            <span style="color:#065694">DANH SÁCH HỒ SƠ TIẾP NHẬN NGÀY {{fromDate()}} 
              <span v-if="dossierList.length > 0">(Tổng số: {{dossierList.length}} hồ sơ)</span>
            </span>
          </h4>
          <div class="mt-3"> 
            <v-carousel hide-delimiters hide-controls interval="10000" @input="changeItem($event)" v-if="dossierList.length > 0">
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
            <v-alert class="mt-3 mx-3" v-else :value="true" outline color="blue" icon="priority_high">
              Không có hồ sơ tiếp nhận ngày {{fromDate()}}
            </v-alert>
          </div>
        </div>
        <v-btn class="back-btn" @click="changeScreen" fab color="primary">
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
        text: 'Ngày có kết quả',
        align: 'center',
        sortable: false,
        width: '130px'
      }
    ]
  }),
  computed: {
    fullScreen () {
      return this.$store.getters.getFullScreen
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      vm.$store.commit('setFullScreen', false)
      vm.doLoadingDataHoSo()
      setInterval(function () {
        vm.doLoadingDataHoSo()
      }, 1800000)
    })
  },
  watch: {},
  methods: {
    changeItem (event) {
      let vm = this
      console.log('event', event)
      vm.pagination.page = event + 1
    },
    doLoadingDataHoSo () {
      let vm = this
      vm.dossierList = []
      vm.loading = true
      var filter = {
        fromDate: vm.fromDate(),
        toDate: vm.fromDate()
      }
      vm.$store.dispatch('loadingDataHoSoTN', filter).then(function (result) {
        vm.loading = false
        if (result.data) {
          vm.dossierList = result.data
          vm.totalPages = Math.ceil(vm.dossierList.length / vm.pagination.rowsPerPage)
        } else {
          vm.dossierList = []
        }
      }).catch(reject => {
        vm.loading = false
        vm.dossierList = []
      })
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
    }
  }
}
</script>
