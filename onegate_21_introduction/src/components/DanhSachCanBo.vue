<template>
  <div class="py-0"  style="width: 90%;margin: auto">
    <div class="table-dossier" style="background-color: #ffffff">
      <h4 class="py-3 ml-3 text-xs-center">
        <span style="color:#065694">DANH SÁCH CÁN BỘ LÀM VIỆC TẠI TRUNG TÂM PHỤC VỤ HÀNH CHÍNH CÔNG</span>
      </h4>
      <div class="" style="border-left:1px solid #dedede;">
        <div class="">
          <div class="text-bold px-2 py-2 td" style="background-color: #dede;">
            I.	CÁN BỘ TRỰC THUỘC TRUNG TÂM
          </div>
          <v-container fluid grid-list-sm class="px-0 py-0">
            <v-layout wrap>
              <v-flex xs12 sm3 md2 class="td"
              v-for="(item, index) in employeeList" :key="index" v-if="item.userType === '0'"
              >
                <v-card flat color="#e9e9ff" width="100%" height="100%">
                  <v-card-title primary-title class="px-0 py-0">
                    <v-flex xs12 class="text-xs-center">
                      <img style="width: 150px;height: 150px;object-fit: contain" :src="'https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend/kios/img/image' + item.userId +'.png'">
                    </v-flex>
                    <v-flex xs12 class="text-bold text-xs-center px-2"><span>{{item.fullName}}</span></v-flex>
                    <v-flex xs12 class="px-2"><span> {{item.jobPos}}</span></v-flex>
                    <v-flex xs12 class="px-2"><span>{{item.workingUnit}}</span></v-flex>
                    <v-flex xs12 class="px-2"><span>{{item.telNo}}</span></v-flex>
                  </v-card-title>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
          <!--  -->
          <div class="text-bold px-2 py-2 td" style="background-color: #dede;">
            II.	 CÁN BỘ BIỆT PHÁI ĐẾN LÀM VIỆC TẠI TRUNG TÂM
          </div>
          <v-container fluid grid-list-sm class="px-0 py-0">
            <v-layout wrap>
              <v-flex xs12 sm3 md2 class="td"
              v-for="(item, index) in employeeList" :key="index" v-if="item.userType === '1'"
              >
                <v-card flat color="#e9e9ff" width="100%" height="100%">
                  <v-card-title primary-title class="px-0 py-0">
                    <v-flex xs12 class="text-xs-center">
                      <img style="width: 150px;height: 150px;object-fit: contain" :src="'https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend/kios/img/image' + item.userId +'.png'">
                    </v-flex>
                    <v-flex xs12 class="text-xs-center px-2 text-bold"><span>{{item.fullName}}</span></v-flex>
                    <v-flex xs12 class="px-2"><span> {{item.jobPos}}</span></v-flex>
                    <v-flex xs12 class="px-2"><span>{{item.workingUnit}}</span></v-flex>
                    <v-flex xs12 class="px-2"><span>{{item.telNo}}</span></v-flex>
                  </v-card-title>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </div>
      </div>
    </div>
    <!-- <v-btn class="back-btn" title="Trang chủ" @click="goHome" fab color="primary">
      <v-icon dark>home</v-icon>
    </v-btn> -->
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
    employeeList: []
  }),
  computed: {
    fullScreen () {
      return this.$store.getters.getFullScreen
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      vm.$store.commit('setFullScreen', true)
      vm.$store.dispatch('loadInitResource').then(result => {
        console.log('result', result)
        vm.employeeList = result.dataEmployee
      })
    })
  },
  watch: {},
  methods: {
    changeScreen () {
      var vm = this
      vm.$store.commit('setFullScreen', !vm.fullScreen)
    },
    goHome () {
      window.history.back()
    }
  }
}
</script>
