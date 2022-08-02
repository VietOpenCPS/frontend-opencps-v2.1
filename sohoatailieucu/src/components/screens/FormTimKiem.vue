<template>
  <div id="form-search">
    <v-card-text class="px-0 py-0">
        <v-row>
          <v-layout wrap class="mt-0">
            <!-- <v-flex xs12 sm12 class="px-0">
              <v-text-field
                label="Từ khóa tìm kiếm"
                v-model="dataSearch['keywordSearch']"
                @keyup.enter="changeFilterSearch"
                box
                clear-icon="clear"
                clearable
              ></v-text-field>
            </v-flex> -->
            <v-flex xs12 sm6 class="pr-3">
              <v-autocomplete
                :items="donVi"
                v-model="dataSearch['donViCap']"
                label="Đơn vị cấp"
                item-text="name"
                item-value="value"
                :hide-selected="true"
                clearable
                @change="changeFilterSearch"
                box
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm6 class="px-0">
              <v-text-field
                label="Năm cấp"
                v-model="dataSearch['nam']"
                @keyup.enter="changeFilterSearch"
                box
                clear-icon="clear"
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 class="pr-3">
              <v-text-field
                label="Số hiệu giấy tờ"
                v-model="dataSearch['soHieuVanBanSearch']"
                @keyup.enter="changeFilterSearch"
                box
                clear-icon="clear"
                clearable
              ></v-text-field>
            </v-flex>
            <!-- <v-flex xs12 sm6 class="pr-3">
              <v-text-field
                label="Mã hồ sơ"
                v-model="dataSearch['dossierNoSearch']"
                @keyup.enter="changeFilterSearch"
                box
                clear-icon="clear"
                clearable
              ></v-text-field>
            </v-flex> -->
            <v-flex xs12 sm6 class="px-0">
              <v-text-field
                label="Mã thủ tục"
                v-model="dataSearch['maThuTucSearch']"
                @keyup.enter="changeFilterSearch"
                box
                clear-icon="clear"
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 class="px-0">
              <v-text-field
                label="Tên giấy tờ"
                v-model="dataSearch['tenFileSearch']"
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
              <v-icon style="color: #fff !important" size="20">
              clear
              </v-icon> &nbsp;
              Thoát
          </v-btn>
          <v-btn color="primary" small class="mx-0 white--text" @click="changeFilterSearch">
              <v-icon style="color: #fff !important" size="20">
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
    props: ['form', 'donVi'],
    data () {
      return {
        dataSearch: {
          donViCap: '',
          nam: '',
          soHieuVanBanSearch: '',
          tenFileSearch: '',
          dossierNoSearch: '',
          maThuTucSearch: '',
          keywordSearch: ''
        },
        isDvc: false,
        disableInput: false
      }
    },
    created () {
      let vm = this
      
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentQuery = newRoute.query
        
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
          soHieuVanBanSearch: '',
          tenFileSearch: '',
          dossierNoSearch: '',
          maThuTucSearch: '',
          keywordSearch: ''
        },
        vm.$emit('trigger-cancel', vm.dataSearch)
      },
      changeFilterSearch () {
        let vm = this
        setTimeout(function () {
          vm.$emit('trigger-search', vm.dataSearch)
        }, 200)
      }
    },
  }
</script>
<style lang="css" scoped>
  .v-data-table-header-mobile {
    display: none !important;
  }
</style>

