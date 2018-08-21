<template>
  <div class="px-2 py-0">
    <div>
      <v-card>
        <v-layout wrap class="px-0 py-0">
          <div style="width: calc(100% - 150px)">
            <v-layout wrap>
              <!-- <v-flex xs4 class="pl-2 pr-2">
                <v-text-field
                  label="Số hồ sơ"
                  placeholder="Nhấn để nhập mã số hồ sơ"
                  v-model="dossierNoKey"
                  clearable
                ></v-text-field>
              </v-flex>
              <v-flex xs4 class="pl-2 pr-2">
                <v-text-field
                  label="Số CMND"
                  placeholder="Nhấn để nhập số CMND"
                  v-model="applicantIdNoKey"
                  clearable
                ></v-text-field>
              </v-flex>
              <v-flex xs4 class="pl-2 pr-2">
                <v-text-field
                  label="Họ tên người nộp"
                  placeholder="Nhấn để nhập họ và tên"
                  v-model="applicantNameKey"
                  clearable
                ></v-text-field>
              </v-flex> -->
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
                  placeholder="Chọn lĩnh vực"
                  item-text="domainName"
                  item-value="domainCode"
                  return-object
                  :hide-selected="true"
                  clearable
                ></v-select>
              </v-flex>
              <v-flex xs4 class="pl-2 pr-2">
                <v-select
                  :items="listMucDo"
                  v-model="levelSelected"
                  autocomplete
                  placeholder="Chọn mức độ"
                  item-text="levelName"
                  item-value="level"
                  return-object
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
          <div class="pt-2 text-center" style="width: 250px">
            <v-btn color="primary"
              :loading="loadingTable"
              :disabled="loadingTable"
              @click="filterDossier"
            >
              <v-icon size="18">search</v-icon>
              &nbsp;
              Tra Cứu
              <span slot="loader">Loading...</span>
            </v-btn>
            <v-btn outline color="primary"
              @click="filterDossier"
            >
              <v-icon size="18">refresh</v-icon>
              &nbsp;
              Làm Mới
            </v-btn>
          </div>
        </v-layout>
        <div class="my-3 pt-2 text-center" style="height: 40px; background-color: #d6e9f7">
          <span style="color:red">Có {{dossierItemTotal}} kết quả được tìm thấy</span>
        </div>
        <v-data-table
        :headers="headersTable"
        :items="dossierList"
        hide-actions
        class="table-landing table-bordered"
        >
          <template slot="items" slot-scope="props">
            <tr v-bind:class="{'active': props.index%2==1}" @click="viewDetail(props.item)">
              <td class="text-xs-center">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.index + 1}}</span>
                </div>
              </td>
              <td class="text-xs-left">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.dossierNo}}</span><br>
                </div>
              </td>
              <td class="text-xs-left">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.serviceName}}</span>
                </div>
              </td>
              <td class="text-xs-left">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.applicantName}}</span>
                </div>
              </td>
              <td class="text-xs-left">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>
                    <span>{{props.item.dossierStatusText}}</span>
                  </span>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
        <div v-if="hosoDatasPage < totalPages && dossierItemTotal > 0" class="mt-3 text-center">
          <v-btn outline color="indigo" @click="showMore" 
            :loading="loadingTable"
            :disabled="loadingTable">
            <v-icon size="20">expand_more</v-icon>&nbsp;
            Xem thêm
            <span slot="loader">Loading...</span>
          </v-btn>
        </div>
      </v-card>
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
    loadingTable: false,
    dossierNoKey: '',
    applicantNameKey: '',
    applicantIdNoKey: '',
    dossierList: [],
    dossierItemTotal: 0,
    hosoDatasPage: 1,
    totalPages: 1,
    headersTable: [
      {
        text: 'Số thứ tự',
        align: 'center',
        sortable: false
      },
      {
        text: 'Số hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thủ tục thực hiện',
        align: 'center',
        sortable: false
      },
      {
        text: 'Người nộp',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tình trạng hồ sơ',
        align: 'center',
        sortable: false
      }
    ]
  }),
  computed: {},
  created () {
    let vm = this
    vm.$nextTick(function () {
      var vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      vm.dossierNoKey = newQuery.hasOwnProperty('dossierNo') ? newQuery.dossierNo : ''
      vm.applicantIdNoKey = newQuery.hasOwnProperty('applicantIdNo') ? newQuery.applicantIdNo : ''
      vm.applicantNameKey = newQuery.hasOwnProperty('applicantName') ? newQuery.applicantName : ''
      vm.hosoDatasPage = 1
      vm.doLoadingDataHoSo()
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
      vm.dossierNoKey = currentQuery.hasOwnProperty('dossierNo') ? currentQuery.dossierNo : ''
      vm.applicantIdNoKey = currentQuery.hasOwnProperty('applicantIdNo') ? currentQuery.applicantIdNo : ''
      vm.applicantNameKey = currentQuery.hasOwnProperty('applicantName') ? currentQuery.applicantName : ''
      vm.hosoDatasPage = 1
      vm.doLoadingDataHoSo()
    }
  },
  methods: {
    filterDossier () {
      var vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['dossierNo'] = vm.dossierNoKey ? vm.dossierNoKey : ''
      newQuery['applicantIdNo'] = vm.applicantIdNoKey ? vm.applicantIdNoKey : ''
      newQuery['applicantName'] = vm.applicantNameKey ? vm.applicantNameKey : ''
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
    showMore () {
      var vm = this
      vm.hosoDatasPage += 1
      vm.loadingTable = true
      let currentQuery = router.history.current.query
      var filter = null
      filter = {
        page: vm.hosoDatasPage,
        dossierNo: currentQuery.hasOwnProperty('dossierNo') ? currentQuery.dossierNo : '',
        applicantName: currentQuery.hasOwnProperty('applicantName') ? currentQuery.applicantName : '',
        applicantIdNo: currentQuery.hasOwnProperty('applicantIdNo') ? currentQuery.applicantIdNo : ''
      }
      vm.$store.dispatch('loadingDataHoSo', filter).then(function (result) {
        vm.loadingTable = false
        let dossierMore = result.data
        vm.dossierList = vm.dossierList.concat(dossierMore)
      }).catch(reject => {
        vm.loadingTable = false
      })
    },
    doLoadingDataHoSo () {
      let vm = this
      vm.dossierList = []
      vm.loadingTable = true
      let currentQuery = router.history.current.query
      var filter = null
      filter = {
        page: vm.hosoDatasPage,
        dossierNo: currentQuery.hasOwnProperty('dossierNo') ? currentQuery.dossierNo : '',
        applicantName: currentQuery.hasOwnProperty('applicantName') ? currentQuery.applicantName : '',
        applicantIdNo: currentQuery.hasOwnProperty('applicantIdNo') ? currentQuery.applicantIdNo : ''
      }
      vm.$store.dispatch('loadingDataHoSo', filter).then(function (result) {
        vm.loadingTable = false
        vm.dossierList = result.data
        vm.dossierItemTotal = result.total
        vm.totalPages = Math.ceil(result.total / 15)
      }).catch(reject => {
        vm.loadingTable = false
        vm.dossierList = []
        vm.dossierItemTotal = 0
      })
    },
    viewDetail (item) {
      // window.location.href = 'http://119.17.200.7/web/so-xay-dung#/danh-sach-ho-so/0/chi-tiet-ho-so/102205'
    }
  }
}
</script>
