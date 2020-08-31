<template>
  <div class="px-2 py-0 kios-item">
    <content-placeholders class="mt-3" v-if="loading">
      <content-placeholders-text :lines="10" />
    </content-placeholders>
    <div v-else>
      <v-layout class="wrap pb-3">
        <div class="pb-2" style="width: 100px">
          <v-chip class="mx-0 my-0" label :color="getColor(serviceDetail.maxLevel)" text-color="white" style="height:px">
            Mức độ {{serviceDetail.maxLevel}}
          </v-chip>
        </div>
        <div style="width:calc(100% - 100px)">
          <span class="text-bold">{{serviceDetail.serviceName}}</span>
        </div>    
      </v-layout>
      <div class="mt-0">
        <v-tabs
          v-model="active"
          color="cyan"
          dark
          slider-color="yellow"
        >
          <v-tab key="1" ripple class="mr-2"> Thông tin chung </v-tab>
          <v-tab key="2" ripple class="mr-2"> Trình tự thực hiện</v-tab>
          <v-tab key="3" ripple class="mr-2"> Thành phần hồ sơ </v-tab>
          <v-tab key="4" ripple class="mr-2"> Yêu cầu điều kiện </v-tab>
          <v-tab-item key="1" class="wrap-scroll wrap-scroll-sevice">
            <v-card>
              <v-card-text class="px-0 py-0">
                <div class="table-detail-domain table-bordered">
                  <div class="table__overflow">
                    <table class="datatable table">
                      <tbody>
                        <tr>
                          <td class="pt-2"><span class="text-bold">Mã thủ tục</span></td>
                          <td class="pt-2"><span>{{serviceDetail.serviceCode}}</span></td>
                        </tr>
                        <tr>
                          <td class="pt-2"><span class="text-bold">Cơ quan quản lý</span></td>
                          <td class="pt-2"><span>{{serviceDetail.administrationName}}</span></td>
                        </tr>
                        <tr>
                          <td class="pt-2"><span class="text-bold">Lĩnh vực</span></td>
                          <td class="pt-2"><span>{{serviceDetail.domainName}}</span></td>
                        </tr>
                        <tr>
                          <td class="pt-2"><span class="text-bold">Cách thực hiện</span></td>
                          <td class="pt-2"><span v-html="serviceDetail.methodText"></span></td>
                        </tr>
                        <tr>
                          <td class="pt-2"><span class="text-bold">Thời gian giải quyết</span></td>
                          <td class="pt-2"><span v-html="serviceDetail.durationText"></span></td>
                        </tr>
                        <tr>
                          <td class="pt-2"><span class="text-bold">Đối tượng</span></td>
                          <td class="pt-2"><span v-html="serviceDetail.applicantText"></span></td>
                        </tr>
                        <tr>
                          <td class="pt-2"><span class="text-bold">Kết quả giải quyết</span></td>
                          <td class="pt-2"><span v-html="serviceDetail.resultText"></span></td>
                        </tr>
                        <tr>
                          <td class="pt-2"><span class="text-bold">Lệ phí</span></td>
                          <td class="pt-2"><span v-html="serviceDetail.feeText"></span></td>
                        </tr>
                        <tr>
                          <td class="pt-2"><span class="text-bold">Căn cứ pháp lý</span></td>
                          <td class="pt-2"><span v-html="serviceDetail.regularText"></span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item key="2" class="wrap-scroll wrap-scroll-sevice">
            <v-card>
              <v-card-text>
                <div v-html="serviceDetail.processText"></div>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item key="3" class="wrap-scroll wrap-scroll-sevice">
            <v-card>
              <v-card-text>
                <div v-html="serviceDetail.dossierText"></div>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item key="4" class="wrap-scroll wrap-scroll-sevice">
            <v-card>
              <v-card-text>
                <div v-html="serviceDetail.conditionText"></div>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </div>
      <!-- <v-btn class="back-btn" @click="goBack" fab color="primary">
        <v-icon dark>arrow_back</v-icon>
      </v-btn> -->
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
