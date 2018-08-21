<template>
  <div class="px-2 py-0">
    <content-placeholders class="mt-3" v-if="loading">
      <content-placeholders-text :lines="10" />
    </content-placeholders>
    <div v-else>
      <div class="row-header">
        <div class="background-triangle-big"> <span>CHI TIẾT THỦ TỤC HÀNH CHÍNH</span> </div>
        <div class="layout row wrap header_tools">
          <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
            <v-btn flat class="my-0 mx-0 btn-border-left" @click="goBack" active-class="temp_active">
              Quay lại &nbsp;
              <v-icon size="16">undo</v-icon>
            </v-btn>
          </div>
        </div> 
      </div>
      <div>
        <div class="mx-2 my-3">
          <v-chip class="mx-0 my-0 mr-3" label :color="getColor(serviceDetail.maxLevel)" text-color="white" style="height:25px">
            Mức độ {{serviceDetail.maxLevel}}
          </v-chip>
          <span class="text-bold">{{serviceDetail.serviceName}}</span>
        </div>
        <div class="mt-2">
          <v-tabs
            v-model="active"
            color="cyan"
            dark
            slider-color="yellow"
          >
            <v-tab key="1" ripple class="mx-2"> Thông tin chung </v-tab>
            <v-tab key="2" ripple class="mx-2"> Trình tự thực hiện</v-tab>
            <v-tab key="3" ripple class="mx-2"> Thành phần hồ sơ </v-tab>
            <v-tab key="4" ripple class="mx-2"> Yêu cầu điều kiện </v-tab>
            <v-tab-item key="1" >
              <v-card>
                <v-card-text>
                  <v-layout wrap class="my-1">
                    <v-flex xs12 sm2><span class="text-bold">Cơ quan quản lý</span></v-flex>
                    <v-flex xs12 sm10><span>{{serviceDetail.administrationName}}</span></v-flex>
                  </v-layout>
                  <v-layout wrap class="my-1">
                    <v-flex xs12 sm2><span class="text-bold">Lĩnh vực</span></v-flex>
                    <v-flex xs12 sm10><span>{{serviceDetail.domainName}}</span></v-flex>
                  </v-layout>
                  <v-layout wrap class="my-1">
                    <v-flex xs12 sm2><span class="text-bold">Cách thực hiện</span></v-flex>
                    <v-flex xs12 sm10><span v-html="serviceDetail.methodText"></span></v-flex>
                  </v-layout>
                  <v-layout wrap class="my-1">
                    <v-flex xs12 sm2><span class="text-bold">Thời gian giải quyết</span></v-flex>
                    <v-flex xs12 sm10><span>{{serviceDetail.durationText}}</span></v-flex>
                  </v-layout>
                  <v-layout wrap class="my-1">
                    <v-flex xs12 sm2><span class="text-bold">Đối tượng</span></v-flex>
                    <v-flex xs12 sm10><span v-html="serviceDetail.applicantText"></span></v-flex>
                  </v-layout>
                  <v-layout wrap class="my-1">
                    <v-flex xs12 sm2><span class="text-bold">Kết quả giải quyết</span></v-flex>
                    <v-flex xs12 sm10><span>{{serviceDetail.resultText}}</span></v-flex>
                  </v-layout>
                  <v-layout wrap class="my-1">
                    <v-flex xs12 sm2><span class="text-bold">Lệ phí</span></v-flex>
                    <v-flex xs12 sm10><span>{{serviceDetail.feeText}}</span></v-flex>
                  </v-layout>
                  <v-layout wrap>
                    <v-flex xs12 sm2><span class="text-bold">Căn cứ pháp lý</span></v-flex>
                    <v-flex xs12 sm10><span v-html="serviceDetail.regularText"></span></v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item key="2" >
              <v-card>
                <v-card-text>
                  <div v-html="serviceDetail.processText"></div>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item key="3" >
              <v-card>
                <v-card-text>
                  <div v-html="serviceDetail.dossierText"></div>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item key="4" >
              <v-card>
                <v-card-text>
                  <div v-html="serviceDetail.conditionText"></div>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
export default {
  props: ['index'],
  components: {},
  data: () => ({
    loading: false,
    loadingAction: false,
    serviceDetail: {}
  }),
  computed: {},
  created () {
    let vm = this
    vm.$nextTick(function () {
      var vm = this
      vm.loading = true
      let filter = {
        index: vm.index
      }
      vm.$store.dispatch('getServiceDetail', filter).then(function (result) {
        vm.serviceDetail = result
        vm.loading = false
      }).catch(function (reject) {
        vm.loading = false
      })
    })
  },
  watch: {},
  methods: {
    goBack () {
      window.history.back()
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
