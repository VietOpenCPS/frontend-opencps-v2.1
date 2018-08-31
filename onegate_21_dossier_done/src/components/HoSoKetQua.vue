<template>
  <div class="px-2 py-0">
    <div>
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="10" />
      </content-placeholders>
      <v-card v-else>
        <div class="table-dossier" style="background-color: #ffffff">
          <h4 class="py-3 ml-3">
            <span>DANH SÁCH HỒ SƠ ĐÃ CÓ KẾT QUẢ &nbsp; (TỔNG SỐ: {{dossierItemTotal}})</span>
          </h4>
          <div>
            <v-layout class="wrap">
              <v-flex class="px-3 py-2 th" style="width: 250px"><span class="text-bold">Số hồ sơ</span></v-flex>
              <v-flex class="px-3 py-2 th" style="width: calc(100% - 450px)"><span class="text-bold"> Chủ hồ sơ</span></v-flex>
              <v-flex class="px-3 py-2 th" style="width: 200px"><span class="text-bold">Ngày trả kết quả</span></v-flex>
            </v-layout>
          </div>
          <div class="dossierList">
            <div class="wrap-list" :class="dossierList.length > 10 ? activeAnimate : ''">
              <v-layout class="wrap" v-for="(item, index) in dossierList" 
              :key="item.dossierId" :class="index%2==1 ? 'active': ''">
                <v-flex class="px-3 py-2 td" style="width: 250px"><span>{{item.dossierNo}}</span></v-flex>
                <v-flex class="px-3 py-2 td" style="width: calc(100% - 450px)"><span> {{item.applicantName}}</span></v-flex>
                <v-flex class="px-3 py-2 td" style="width: 200px"><span>{{item.finishDate}}</span></v-flex>
              </v-layout>
            </div>
          </div>
        </div>
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
    dossierItemTotal: 0,
    headersTable: [
      {
        text: 'Số hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Chủ hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Ngày hẹn trả',
        align: 'center',
        sortable: false
      }
    ]
  }),
  computed: {},
  created () {
    let vm = this
    vm.$nextTick(function () {
      vm.doLoadingDataHoSo()
    })
  },
  watch: {},
  methods: {
    doLoadingDataHoSo () {
      let vm = this
      vm.dossierList = []
      vm.loading = true
      var filter = null
      filter = {}
      vm.$store.dispatch('loadingDataHoSoKQ', filter).then(function (result) {
        vm.loading = false
        vm.dossierList = result.data
        vm.dossierItemTotal = result.total
      }).catch(reject => {
        vm.loading = false
        vm.dossierList = []
        vm.dossierItemTotal = 0
      })
    }
  }
}
</script>
