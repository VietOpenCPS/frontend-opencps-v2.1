<template>
  <div class="px-2 py-0">
    <div>
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="10" />
      </content-placeholders>
      <v-card v-else>
        <div style="background-color: #ffffff" :class="visible ? 'overlayActive': ''">
          <div class="mt-3 pt-2 text-center total-result-search-blue">
            <span>DANH SÁCH HỒ SƠ CÓ KẾT QUẢ &nbsp; ({{dossierItemTotal}})</span>
          </div>
          <div class="dossierList">
            <div class="wrap-list" :style="{ color: activeColor }">
              <v-layout class="wrap" v-for="(item, index) in dossierList" 
              :key="item.dossierId" :class="index%2==1 ? 'active': ''">
                <v-flex class="px-3 py-2" style="width: 250px"><span>{{item.dossierNo}}</span></v-flex>
                <v-flex class="px-3 py-2" style="width: calc(100% - 450px)"><span> {{item.applicantName}}</span></v-flex>
                <v-flex class="px-3 py-2 text-right" style="width: 200px"><span>{{item.dueDate}}</span></v-flex>
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
    dossierItemTotal: 0
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
