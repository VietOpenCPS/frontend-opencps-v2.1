<template>
  <div>
    <div class="row-header no__hidden_class">
      <div class="background-triangle-big">
        <span>DANH SÁCH MẪU TỜ KHAI TRỰC TUYẾN</span>
      </div>
      <div class="layout row wrap header_tools row-blue">
        <!-- <div class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
          <v-text-field
            v-model="eformNoSearch"
            placeholder="Tìm kiếm tờ khai đã tạo theo mã"
            solo
            chips
            multiple
            deletable-chips
            item-value="eFormNo"
            item-text="eFormName"
            @keyup.enter="searchEform"
            content-class="adv__search__select"
            return-object
          ></v-text-field>
        </div>
        <div class="flex text-right" style="margin-left: auto;max-width: 50px;">
          <v-btn icon class="my-0 mx-2" v-on:click.native="searchEform">
            <v-icon size="16">search</v-icon>
          </v-btn>
        </div> -->
      </div> 
    </div>
    <v-card flat class="mt-3">
      <v-card-text class='grey lighten-3 px-0 py-0'>
        <v-expansion-panel class="expand__select__domain" v-model="panelServiceList" expand>
          <v-expansion-panel-content v-for='(item, index) in serviceInfoList' :key='index' :value="true">
            <div class="text-bold" slot='header' style="margin-left: 14px;color:#615d5d">
                <v-icon class="pr-2" color="#615d5d">navigate_next</v-icon> 
                <span style="position: absolute;margin-top: 1px;">{{item.serviceCode}}  - {{item.serviceName}} </span>
            </div>
            <v-card>
              <v-card-text class="card__text__gov" v-for='(itemTemplate, index2) in item.templateList' :key='index2'>
                <v-layout row wrap>
                  <v-flex xs12 sm10 class="pt-1 primary--text text-bold" @click="selectTemplate(index, itemTemplate, item)" style="cursor: pointer">
                    <span>{{index2 + 1}}.</span> &nbsp;
                    <span>{{itemTemplate.templateName}}</span>
                  </v-flex>

                  <v-flex xs12 sm2 class="text-xs-center">
                    <v-menu left offset-x>
                      <v-btn color="primary" class="mx-0 my-0 mt-1 white--text" slot="activator" small 
                        @click="selectTemplate(index, itemTemplate, item)"
                      >
                        Chọn
                      </v-btn>
                    </v-menu>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import axios from 'axios'
import support from '../../store/support.json'
Vue.use(toastr)
export default {
  props: [],
  components: {
  },
  data: () => ({
    serviceInfoList: [],
    eformNoSearch: '',
    panelServiceList: [],
    serviceInfoListRender: []
  }),
  computed: {
    serviceinfoSelected () {
      return this.$store.getters.getServiceinfoSelected
    },
    formScriptEform () {
      return this.$store.getters.getFormScriptEform
    },
    formDataEform () {
      return this.$store.getters.getFormDataEform
    },
    fileTemplateSelected () {
      return this.$store.getters.getFileTemplateSelected
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let current = vm.$router.history.current
      let currentQuery = current.query
      vm.doLoadingThuTuc()
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
    }
  },
  methods: {
    doLoadingThuTuc () {
      var vm = this
      vm.serviceInfoList = []
      vm.loading = true
      let currentQuery = vm.$router.history.current.query
      var filter = null
      filter = {
        page: currentQuery.page ? currentQuery.page : 1
      }
      vm.$store.dispatch('getServiceLists', filter).then(function (result) {
        vm.loading = false
        if (result.data) {
          vm.serviceInfoList = result.data
          for (let index in vm.serviceInfoList) {
            vm.getFileTemplate(index, vm.serviceInfoList[index])
          }
        } else {
          vm.serviceInfoList = []
        }
      }).catch(reject => {
        vm.loading = false
        vm.serviceInfoList = []
      })
    },
    getFileTemplate (index, item) {
      let vm = this
      vm.$store.dispatch('getFileTemplateEform', item).then(response => {
        if (response.data) {
          vm.serviceInfoList[index].templateList = response.data
        }
        vm.panelServiceList.push(true)
      })
    },
    selectTemplate (indexService, template, serviceInfo) {
      let vm = this
      vm.$store.commit('setServiceinfoSelected', serviceInfo)
      let templateFile = Object.assign({}, template, {serviceInfoId: serviceInfo.serviceInfoId})
      vm.$store.commit('setFileTemplateSelected', templateFile)
      vm.$router.push({
        path: '/thong-tin-to-khai',
        query: {
          renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
        }
      })
    },
    searchEform () {
    },
    goBack () {
      window.history.back()
    }
  }
}
</script>
