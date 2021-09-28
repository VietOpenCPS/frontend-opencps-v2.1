<template>
  <div id="form-search">
    <v-card-text class="px-0 pt-0">
        <v-row v-if="form !== 'danhmuc'">
          <v-layout wrap class="mt-0">
            <v-flex xs12 sm6 class="px-0 pr-3">
              <v-autocomplete
                :items="fileTemplateList"
                v-model="dataSearch['fileTemplateNo']"
                label="Loại giấy tờ"
                item-text="name"
                item-value="fileTemplateNo"
                :hide-selected="true"
                clearable
                @change="changeFilterSearch"
                box
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm6 class="">
              <v-text-field
                label="Số hiệu giấy tờ"
                v-model="dataSearch['fileNoSearch']"
                @keyup.enter="changeFilterSearch"
                box
                clear-icon="clear"
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 class="px-0 pr-3">
              <v-text-field
                label="Số CMND/ CCCD, mã số thuế doanh nghiệp, tổ chức"
                v-model="dataSearch['applicantIdNo']"
                @keyup.enter="changeFilterSearch"
                box
                clear-icon="clear"
                clearable
                :readonly="disableInput"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 :class="!form || form !== 'sohoa' ? 'px-0 pr-3 sm3' : 'px-0 pr-0 sm6'">
              <v-text-field
                label="Chủ sở hữu"
                v-model="dataSearch['applicantName']"
                @keyup.enter="changeFilterSearch"
                box
                clear-icon="clear"
                clearable
                :readonly="disableInput"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm3 class="px-0" v-if="!form || form !== 'sohoa'">
              <v-autocomplete
                :items="statusList"
                v-model="dataSearch['status']"
                label="Tình trạng"
                item-text="text"
                item-value="value"
                :hide-selected="true"
                clearable
                @change="changeFilterSearch"
                box
              ></v-autocomplete>
            </v-flex>
          </v-layout>
        </v-row>
        <v-row v-if="form === 'danhmuc'">
          <v-layout wrap class="mt-0">
            <v-flex xs12 sm6 class="pr-3">
              <v-text-field
                label="Mã loại giấy tờ"
                v-model="dataSearch['fileTemplateNo']"
                @keyup.enter="changeFilterSearch"
                box
                clear-icon="clear"
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 class="px-0">
              <v-text-field
                label="Tên loại giấy tờ"
                v-model="dataSearch['name']"
                @keyup.enter="changeFilterSearch"
                box
                clear-icon="clear"
                clearable
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-row>
        <v-flex class="text-right">
          <v-btn color="red" small class="mr-3 ml-0 white--text" @click="cancelSearch">
              <v-icon size="20">
              clear
              </v-icon> &nbsp;
              Thoát
          </v-btn>
          <v-btn color="#0072bc" small class="mx-0 white--text" @click="changeFilterSearch">
              <v-icon size="20">
              search
              </v-icon> &nbsp;
              Tìm kiếm
          </v-btn>
        </v-flex>
    </v-card-text>
    
  </div>
  
</template>

<script>
  export default {
    name: 'Search',
    props: ['form', 'inputSearch'],
    data () {
      return {
        statusList: [
          {text: 'Yêu cầu số hóa', value: 0},
          {text: 'Có hiệu lực', value: 1},
          {text: 'Hết hiệu lực', value: 2},
          {text: 'Hủy', value: 3}
        ],
        dataSearch: {
          applicantName: '',
          applicantIdNo: '',
          fileTemplateNo: '',
          status: '',
          keywordSearch: '',
          fileNoSearch: '',
          name: ''
        },
        isDvc: false,
        disableInput: false
      }
    },
    created () {
      let vm = this
      if (vm.inputSearch) {
        vm.dataSearch = Object.assign(vm.dataSearch, vm.inputSearch)
      }
      vm.getDanhMucGiayTo()
      let currentQuery = vm.$router.history.current.query
      if (currentQuery.hasOwnProperty('applicantIdNo') && currentQuery.applicantIdNo) {
        vm.disableInput = true
      }
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentQuery = newRoute.query
        if (currentQuery.hasOwnProperty('applicantIdNo') && currentQuery.applicantIdNo) {
          vm.disableInput = true
        }
      }
    },
    computed: {
    },
    methods: {
      getDataOutPut () {
        let vm = this
        return vm.dataSearch
      },
      cancelSearch () {
        let vm = this
        vm.dataSearch = {
          applicantName: '',
          applicantIdNo: '',
          fileTemplateNo: '',
          status: '',
          keywordSearch: '',
          fileNoSearch: '',
          name: ''
        },
        vm.$emit('trigger-cancel', vm.dataSearch)
      },
      changeFilterSearch () {
        let vm = this
        setTimeout(function () {
          vm.$emit('trigger-search', vm.dataSearch)
        }, 200)
      },
      getDanhMucGiayTo () {
        let vm = this
        let filter = {
          status: 1
        }
        if (vm.isDvc) {
          vm.$store.dispatch('getFileItemsFromDvc', filter).then(function (result) {
            if (result.hasOwnProperty('data')) {
              vm.fileTemplateList = result.data
            } else {
              vm.fileTemplateList = []
            }
          }).catch(function () {
          })
        } else {
          vm.$store.dispatch('getFileItems', filter).then(function (result) {
            if (result.hasOwnProperty('data')) {
              vm.fileTemplateList = result.data
            } else {
              vm.fileTemplateList = []
            }
          }).catch(function () {
          })
        }
      },
    },
  }
</script>
<style lang="css" scoped>
  .v-data-table-header-mobile {
    display: none !important;
  }
</style>

