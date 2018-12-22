<template>
  <div>
    <v-card>
      <div class="row-header" :style="viewMobile ? 'background-color: #070f52' : ''">
        <div v-if="!viewMobile" class="background-triangle-big"> <span>CHI TIẾT THỦ TỤC HÀNH CHÍNH</span> </div>
        <div v-else class="ml-2 py-2 text-bold white--text"> <span>CHI TIẾT THỦ TỤC HÀNH CHÍNH</span> </div>
        <div class="layout row wrap header_tools row-blue">
          <div v-if="!viewMobile" class="flex xs4 sm2 text-right" style="margin-left: auto;">
            <v-btn flat class="my-0 mx-0 btn-border-left" @click="goBack" active-class="temp_active">
              <v-icon size="18">reply</v-icon> &nbsp; Quay lại
            </v-btn>
          </div>
          <div v-else class="flex text-right" style="margin-left: auto;">
            <v-btn flat class="my-0 mx-0 btn-border-left white--text" @click="goBack" active-class="temp_active">
              <v-icon size="18">reply</v-icon> &nbsp; Quay lại
            </v-btn>
          </div>
        </div> 
      </div>
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="10" />
      </content-placeholders>
      <div v-else>
        <v-layout class="wrap mt-3 ml-2">
          <div class="pb-2" style="width: 100px">
            <v-chip class="mx-0 my-0" small disabled label :color="getColor(serviceDetail.maxLevel)" text-color="white" style="height:px">
              Mức độ {{serviceDetail.maxLevel}}
            </v-chip>
          </div>
          <div style="width:calc(100% - 100px)">
            <span class="text-bold">{{serviceDetail.serviceName}}</span>
          </div>    
        </v-layout>
        <div class="mt-3">
          <v-tabs
            icons-and-text
            v-model="active"
          >
            <v-tabs-slider color="primary"></v-tabs-slider>
            <v-tab key="1" ripple class="mr-2"> Thông tin chung </v-tab>
            <v-tab key="2" ripple class="mr-2"> Trình tự thực hiện</v-tab>
            <v-tab key="3" ripple class="mr-2"> Thành phần hồ sơ </v-tab>
            <v-tab key="4" ripple class="mr-2"> Yêu cầu điều kiện </v-tab>
            <!--  -->
            <v-tab-item key="1" transition="fade-transition" reverse-transition="fade-transition">
              <v-card>
                <v-card-text class="px-0 py-0">
                  <div class="table-detail-domain table-bordered">
                    <div class="table__overflow">
                      <table class="datatable table">
                        <tbody>
                          <tr>
                            <td :width="viewMobile ? 150 : 200"><span class="text-bold">Cơ quan quản lý</span></td>
                            <td><span>{{serviceDetail.administrationName}}</span></td>
                          </tr>
                          <tr>
                            <td><span class="text-bold">Lĩnh vực</span></td>
                            <td><span>{{serviceDetail.domainName}}</span></td>
                          </tr>
                          <tr>
                            <td><span class="text-bold">Cách thực hiện</span></td>
                            <td><span v-html="serviceDetail.methodText"></span></td>
                          </tr>
                          <tr>
                            <td><span class="text-bold">Thời gian giải quyết</span></td>
                            <td><span v-html="serviceDetail.durationText"></span></td>
                          </tr>
                          <tr>
                            <td><span class="text-bold">Đối tượng</span></td>
                            <td><span v-html="serviceDetail.applicantText"></span></td>
                          </tr>
                          <tr>
                            <td><span class="text-bold">Kết quả giải quyết</span></td>
                            <td><span v-html="serviceDetail.resultText"></span></td>
                          </tr>
                          <tr>
                            <td><span class="text-bold">Lệ phí</span></td>
                            <td><span v-html="serviceDetail.feeText"></span></td>
                          </tr>
                          <tr>
                            <td><span class="text-bold">Căn cứ pháp lý</span></td>
                            <td><span v-html="serviceDetail.regularText"></span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </v-card-text>
                <v-menu bottom right offset-y class="ml-2 my-2" style="display: inline-block;position:relative !important;"
                  v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length > 1"
                >
                  <v-btn small slot="activator" color="primary" v-if="serviceDetail.maxLevel >= 3">Nộp hồ sơ &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                  <v-btn small slot="activator" color="primary" v-else>Xem hướng dẫn &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                  <v-list v-if="serviceDetail.serviceConfigs">
                    <v-list-tile v-for="(item2, index) in serviceConfigs(serviceDetail.serviceConfigs)" :key="index">
                      <v-list-tile-title v-if="item2.serviceLevel >= 3" @click="createDossier(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                      <v-list-tile-title v-else @click="viewGuide(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
                <v-btn small color="primary" class="mx-2 my-2" 
                  v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) > 2"
                  @click="createDossier(serviceConfigs(serviceDetail.serviceConfigs)[0])"
                >
                  Nộp hồ sơ
                </v-btn>
                <v-btn small color="primary" class="mx-2 my-2" 
                  v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) <= 2"
                  @click="viewGuide(serviceConfigs(serviceDetail.serviceConfigs)[0])"
                >
                  Xem hướng dẫn
                </v-btn>
              </v-card>
            </v-tab-item>
            <v-tab-item key="2" transition="fade-transition" reverse-transition="fade-transition">
              <v-card>
                <v-card-text>
                  <div v-html="serviceDetail.processText"></div>
                </v-card-text>
                <v-menu bottom right offset-y class="ml-2 mb-2" style="display: inline-block;position:relative !important;"
                  v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length > 1"
                >
                  <v-btn small slot="activator" color="primary" v-if="serviceDetail.maxLevel >= 3">Nộp hồ sơ &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                  <v-btn small slot="activator" color="primary" v-else>Xem hướng dẫn &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                  <v-list v-if="serviceDetail.serviceConfigs">
                    <v-list-tile v-for="(item2, index) in serviceConfigs(serviceDetail.serviceConfigs)" :key="index">
                      <v-list-tile-title v-if="item2.serviceLevel >= 3" @click="createDossier(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                      <v-list-tile-title v-else @click="viewGuide(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
                <v-btn small color="primary" class="mx-2 my-2" 
                  v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) > 2"
                  @click="createDossier(serviceConfigs(serviceDetail.serviceConfigs)[0])"
                >
                  Nộp hồ sơ
                </v-btn>
                <v-btn small color="primary" class="mx-2 my-2" 
                  v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) <= 2"
                  @click="viewGuide(serviceConfigs(serviceDetail.serviceConfigs)[0])"
                >
                  Xem hướng dẫn
                </v-btn>
              </v-card>
            </v-tab-item>
            <v-tab-item key="3" transition="fade-transition" reverse-transition="fade-transition">
              <v-card>
                <v-card-text>
                  <div v-html="serviceDetail.dossierText" class="mb-2"></div>
                  <!-- tải file biểu mẫu -->
                  <div v-if="serviceDetail.fileTemplates && fileTemplate(serviceDetail.fileTemplates)">
                    <div class="text-bold mb-2">File biểu mẫu</div>
                    <div v-for="item in fileTemplate(serviceDetail.fileTemplates)" :key="item.fileTemplateNo" class="hover-pointer mb-1">
                      <span v-on:click.stop="downloadFileTemplate(item)" slot="activator">
                        <v-icon style="color: #0d71bb;" size="16" color="primary">save_alt</v-icon>
                        <span class="pl-2 text-bold">{{item.templateName}}</span>
                      </span>
                    </div>
                  </div>
                </v-card-text>
                <v-menu bottom right offset-y class="ml-2 mb-2" style="display: inline-block;position:relative !important;"
                  v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length > 1"
                >
                  <v-btn small slot="activator" color="primary" v-if="serviceDetail.maxLevel >= 3">Nộp hồ sơ &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                  <v-btn small slot="activator" color="primary" v-else>Xem hướng dẫn &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                  <v-list v-if="serviceDetail.serviceConfigs">
                    <v-list-tile v-for="(item2, index) in serviceConfigs(serviceDetail.serviceConfigs)" :key="index">
                      <v-list-tile-title v-if="item2.serviceLevel >= 3" @click="createDossier(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                      <v-list-tile-title v-else @click="viewGuide(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
                <v-btn small color="primary" class="mx-2 my-2" 
                  v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) > 2"
                  @click="createDossier(serviceConfigs(serviceDetail.serviceConfigs)[0])"
                >
                  Nộp hồ sơ
                </v-btn>
                <v-btn small color="primary" class="mx-2 my-2" 
                  v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) <= 2"
                  @click="viewGuide(serviceConfigs(serviceDetail.serviceConfigs)[0])"
                >
                  Xem hướng dẫn
                </v-btn>
              </v-card>
            </v-tab-item>
            <v-tab-item key="4" transition="fade-transition" reverse-transition="fade-transition">
              <v-card>
                <v-card-text>
                  <div v-html="serviceDetail.conditionText"></div>
                </v-card-text>
                <v-menu bottom right offset-y class="ml-2 mb-2" style="display: inline-block;position:relative !important;"
                  v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length > 1"
                >
                  <v-btn small slot="activator" color="primary" v-if="serviceDetail.maxLevel >= 3">Nộp hồ sơ &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                  <v-btn small slot="activator" color="primary" v-else>Xem hướng dẫn &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                  <v-list v-if="serviceDetail.serviceConfigs">
                    <v-list-tile v-for="(item2, index) in serviceConfigs(serviceDetail.serviceConfigs)" :key="index">
                      <v-list-tile-title v-if="item2.serviceLevel >= 3" @click="createDossier(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                      <v-list-tile-title v-else @click="viewGuide(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
                <v-btn small color="primary" class="mx-2 my-2" 
                  v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) > 2"
                  @click="createDossier(serviceConfigs(serviceDetail.serviceConfigs)[0])"
                >
                  Nộp hồ sơ
                </v-btn>
                <v-btn small color="primary" class="mx-2 my-2" 
                  v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) <= 2"
                  @click="viewGuide(serviceConfigs(serviceDetail.serviceConfigs)[0])"
                >
                  Xem hướng dẫn
                </v-btn>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </div>
      </div>
    </v-card>
    <v-dialog scrollable v-model="dialogGuide" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">Hướng dẫn nộp hồ sơ</v-card-title>
        <v-card-text v-if="serviceConfigDetail" style="max-height: 400px" v-html="serviceConfigDetail.serviceInstruction"></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click.native="dialogGuide = false">
            Đóng
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import { isMobile } from 'mobile-device-detect'
export default {
  props: ['index'],
  components: {},
  data: () => ({
    loading: true,
    loadingAction: false,
    serviceDetail: '',
    serviceConfigDetail: '',
    active: null,
    dialogGuide: false
  }),
  computed: {
    viewMobile () {
      return isMobile
    }
  },
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
    createDossier (item) {
      let redirectURL = window.themeDisplay.getLayoutRelativeURL().substring(0, window.themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
      let url = redirectURL + '/dich-vu-cong#/add-dvc/' + item.serviceConfigId
      window.open(url, '_self')
    },
    viewGuide (item) {
      var vm = this
      vm.serviceConfigDetail = item
      vm.dialogGuide = true
    },
    downloadFileTemplate (item) {
      var vm = this
      let url = '/o/rest/v2/serviceinfos/' + vm.index + '/filetemplates/' + item.fileTemplateNo
      window.open(url)
    },
    fileTemplate (fileData) {
      if (Array.isArray(fileData)) {
        return fileData
      } else {
        if (fileData.hasOwnProperty('fileTemplateNo')) {
          return [fileData]
        } else {
          return false
        }
      }
    },
    serviceConfigs (config) {
      if (Array.isArray(config)) {
        return config
      } else {
        if (config.hasOwnProperty('serviceConfigId')) {
          return [config]
        } else {
          return []
        }
      }
    },
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
<style>
  .table-detail-domain table.table tbody td:first-child {
    border-left: 0;
    padding: 0 15px;
  }
  .table-detail-domain .table.table tbody td {
    height: 36px;
    vertical-align: middle;
  }
</style>
