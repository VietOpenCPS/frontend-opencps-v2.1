<template>
  <div>
    <v-card-text class="px-0">
        <v-row>
          <v-layout wrap class="mt-0">
            <v-flex xs12 class="px-0 pr-2">
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
            <v-flex xs12 sm6 class="px-0">
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
            <v-flex xs12 sm6 class="px-0 pr-2">
              <v-text-field
                label="Chủ sở hữu"
                v-model="dataSearch['applicantName']"
                @keyup.enter="changeFilterSearch"
                box
                clear-icon="clear"
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 class="px-0">
              <v-text-field
                label="Số CMND/ CCCD, mã số thuế doanh nghiệp, tổ chức"
                v-model="dataSearch['applicantIdNo']"
                @keyup.enter="changeFilterSearch"
                box
                clear-icon="clear"
                clearable
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-row>
        <v-row class="justify-end">
          <v-btn color="red" small class="mt-3 mx-3" @click="cancelSearch">
              <v-icon left size="20">
              mdi-close
              </v-icon>
              Thoát
          </v-btn>
          <v-btn color="#0072bc" small class="mt-3 mx-3" @click="changeFilterSearch">
              <v-icon left size="20">
              mdi-content-save
              </v-icon>
              Tìm kiếm
          </v-btn>
        </v-row>
    </v-card-text>
    
  </div>
  
</template>

<script>
  export default {
    name: 'Search',
    props: ['form'],
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
          status: 0,
          keywordSearch: '',
          fileNoSearch: ''
        },
        isDvc: false
      }
    },
    created () {
      let vm = this
      vm.getDanhMucGiayTo()
    },
    watch: {
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
          fileNoSearch: ''
        },
        vm.$emit('trigger-cancel', vm.dataSearch)
      },
      changeFilterSearch () {
        this.$emit('trigger-search', dataSearch)
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

