<template>
  <v-card class="mt-2" style="width: 90%; margin:auto;background:#fff">
    <v-card-text class="pt-2">
      <h3 class="mx-2 my-3">
        <span style="color:#065694"> EXPORT DỮ LIỆU </span>
      </h3>
      <v-layout wrap class="py-2">
        <v-flex xs12 sm3 class="">
          <v-btn :color="typeExport === 'dictcollection' ? 'warning' : 'primary'" @click="getCollection()"
            :loading="loading"
            :disabled="loading"
          >
            <v-icon>exit_to_app</v-icon>&nbsp;
            Dữ liệu danh mục
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-flex>
        <v-flex xs12 sm3 class="">
          <v-btn :color="typeExport === 'serviceInfo' ? 'warning' : 'primary'" @click="exportData('serviceInfo', '')"
            :loading="loading"
            :disabled="loading"
          >
            <v-icon>exit_to_app</v-icon>&nbsp;
            Thủ tục hành chính
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-flex>
        <v-flex xs12 sm3 class="">
          <v-btn :color="typeExport === 'citizen' ? 'warning' : 'primary'" @click="exportData('applicant', 'citizen')"
            :loading="loading"
            :disabled="loading"
          >
            <v-icon>exit_to_app</v-icon>&nbsp;
            Dữ liệu công dân
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-flex>
        <v-flex xs12 sm3 class="">
          <v-btn :color="typeExport === 'bussiness' ? 'warning' : 'primary'"  @click="exportData('applicant', 'business')"
            :loading="loading"
            :disabled="loading"
          >
            <v-icon>exit_to_app</v-icon>&nbsp;
            Dữ liệu doanh nghiệp
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-flex>
      </v-layout>
      <div class="my-3" v-if="typeExport === 'dictcollection'">
        <v-data-table
          :headers="headers"
          :items="dictCollectionList"
          hide-actions
          class="table-landing table-bordered mx-2"
          style="border: 1px solid #dedede"
        >
          <template slot="items" slot-scope="props">
            <tr v-bind:class="{'active': props.index%2==1}">
              <td class="text-xs-center" width="50px">
                <div>
                  <span>{{props.index + 1}}</span><br>
                </div>
              </td>
              <td class="text-xs-left">
                <div>
                  <span>{{props.item.collectionCode}}</span>
                </div>
              </td>
              <td class="text-xs-left">
                <div>
                  <span>
                    <span>{{props.item.collectionName}}</span>
                  </span>
                </div>
              </td>
              <td class="text-xs-center">
                <v-btn title="Export" class="mx-0 my-1" icon ripple
                  @click="exportData('dictcollection', props.item.collectionCode)"
                  :loading="loading"
                  :disabled="loading"
                >
                  <v-icon color="blue lighten-1">exit_to_app</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
          <template slot="no-data">
            <div class="text-xs-center mt-2">
              Không có danh mục nào được tìm thấy
            </div>
          </template>
        </v-data-table>
      </div>
      <div class="mx-2 my-3" v-if="typeExport !== 'dictcollection'">
        <v-alert
          outline
          :value="true"
          icon="info"
          type="warning"
        >
          <span v-if="typeExport === 'serviceInfo'">Export dữ liệu thủ tục hành chính</span>
          <span v-if="typeExport === 'citizen'">Export dữ liệu công dân</span>
          <span v-if="typeExport === 'bussiness'">Export dữ liệu doanh nghiệp</span>
        </v-alert>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import $ from 'jquery'
import support from '../store/support.json'
import toastr from 'toastr'
// import Suggestions from 'v-suggestions'
Vue.use(toastr)
export default {
  props: [],
  components: {
  },
  data: () => ({
    loading: false,
    dictCollectionList: [],
    typeExport: 'dictcollection',
    headers: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Mã danh mục',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tên danh mục',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thao tác',
        align: 'center',
        sortable: false
      }
    ]
  }),
  computed: {
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      var vm = this
      let current = vm.$router.history.current
      let currentQuery = current.query
      vm.$store.dispatch('getDictCollections').then(result => {
        vm.dictCollectionList = result
      })
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
    getCollection () {
      let vm = this
      vm.typeExport = 'dictcollection'
      vm.$store.dispatch('getDictCollections').then(result => {
        vm.dictCollectionList = result
      })
    },
    exportData (dataCode, dataType) {
      let vm = this
      vm.typeExport = dataCode
      vm.loading = true
      let filter = {
        dataCode: dataCode,
        dataType: dataType
      }
      vm.$store.dispatch('exportData', filter).then(result => {
        vm.loading = false
      })
    }
  }
}
</script>

