<template>
  <div>
    <div class="row-header no__hidden_class">
      <div class="background-triangle-big"> <span>DANH SÁCH MẪU GIẤY PHÉP</span> </div>

      <div class="layout row wrap header_tools row-blue">
        <div class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
          <v-text-field
            v-model="keywordFilter"
            placeholder="Tên mẫu giấy phép ..."
            solo
            chips
            multiple
            deletable-chips
            item-value="value"
            item-text="text"
            @keyup.enter="filterDeliverableType"
            content-class="adv__search__select"
            return-object
            autofocus
          ></v-text-field>
        </div>
      </div> 
    </div>

    <v-data-table
        :headers="deliverableHeader"
        :items="deliverableList"
        :pagination.sync="pagination"
        hide-actions
        class="table-landing table-bordered mt-3"
        style="border-left: 1px solid #dedede"
    >
        <template slot="items" slot-scope="props">
          <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;">
              <td class="text-xs-center" style="width:50px;height:36px" @click="showEditApplicant(props.item)">
              <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                  <span>{{ pagination.page * pagination.rowsPerPage - pagination.rowsPerPage + props.index + 1 }}</span>
              </div>
              </td>
              <td class="text-xs-left" style="height:36px" @click="showDanhSachGiayPhep(props.index)">
                <content-placeholders v-if="loadingTable">
                    <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                    <span>{{props.item.typeName}}</span>
                </div>
              </td>
              <td class="text-xs-center" style="height:36px;width: 170px">
                <content-placeholders v-if="loadingTable">
                    <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-btn  v-if="!loadingTable" @click="showDanhSachGiayPhep(props.index)" color="green" flat class="mx-0 mr-3 my-0"
                  style="font-size: 13px !important"
                >
                  Danh sách giấy phép
                </v-btn>
              </td>
          </tr>
        </template>
        <template slot="no-data">
          <div class="text-xs-center mt-2">
              Không có mẫu giấy phép
          </div>
        </template>
    </v-data-table>
    <!--  -->
    <div v-if="!loadingTable" class="text-xs-right layout wrap" style="position: relative;border-top: 1px solid lightgrey;">
      <div class="flex pagging-table px-2"> 
        <tiny-pagination :total="hosoDatasTotal" :page="hosoDatasPage" custom-class="custom-tiny-class" 
          @tiny:change-page="paggingData" ></tiny-pagination>
      </div>
    </div>

  </div>
</template>

<script>
  import { TinyPagination } from '@/components'

  export default {
    props: [],
    components: {
      TinyPagination
    },
    data () {
      return {
        deliverableHeader: [
          {
            text: 'STT',
            align: 'center',
            sortable: false
          },
          {
            text: 'Tên mẫu giấy phép',
            align: 'center',
            sortable: false
          },
          {
            text: 'Thao tác',
            align: 'center',
            sortable: false
          }
        ],
        deliverableList: '',
        hosoDatasTotal: 0,
        hosoDatasPage: 1,
        loadingTable: false,
        keywordFilter: '',
        pagination: {
          page: 1,
          rowsPerPage: 20,
          totalItems: 0
        }
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        vm.loadingTable = true
        vm.$store.dispatch('getDeliverableTypes').then(function (result) {
          vm.deliverableList = result
          vm.hosoDatasTotal = vm.deliverableList.length
          vm.pagination.totalItems = vm.hosoDatasTotal
          vm.loadingTable = false
        }).catch(function () {
          vm.deliverableList = []
          vm.hosoDatasTotal = 0
          vm.pagination.totalItems = 0
          vm.loadingTable = false
        })
      })
    },
    watch: {
      
    },
    computed: {
      items () {
        return this.$store.getters.getDeliverableTypesFilters
      },
    },
    methods: {
      paggingData (config) {
        let vm = this
        console.log('page', config.page)
        vm.pagination.page = config.page
      },
      filterDeliverableType () {
        let vm = this
        let keyword = String(vm.keywordFilter).toLowerCase().replace(/\n/g, "").trim()
        let listViewFull = vm.$store.getters.getDeliverableTypes
        let listViewFilter = listViewFull.filter(function (item) {
          return String(item.typeName).toLowerCase().replace(/\n/g, "").indexOf(keyword) >= 0
        })
        
        if (keyword && keyword.length >= 3) {
            if (listViewFilter && listViewFilter.length) {
              vm.$store.commit('setDeliverableTypesFilter', listViewFilter)
              vm.deliverableList = listViewFilter
              vm.hosoDatasTotal = listViewFilter.length
              vm.pagination.totalItems = listViewFilter.length
              vm.pagination.page = 1
            } else {
              vm.deliverableList = []
              vm.hosoDatasTotal = 0
              vm.pagination.totalItems = 0
            }
        } else {
            vm.deliverableList = listViewFull
            vm.hosoDatasTotal = listViewFull.length
            vm.pagination.totalItems = listViewFull.length
            vm.pagination.page = 1
        }
      },
      showDanhSachGiayPhep (index) {
        let vm = this
        vm.$router.push('/danh-sach-giay-to/' + index + '?t=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1)
      },
    }
  }
</script>