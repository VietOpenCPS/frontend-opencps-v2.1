<template>
  <div>
    <div class="row-header no__hidden_class">
      <div class="background-triangle-big"> <span>DANH SÁCH GIẤY PHÉP</span> </div>
      <div class="layout row wrap header_tools row-blue">
        <div class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
          <v-text-field
            v-model="deliverableKey"
            placeholder="Tìm kiếm theo tên giấy phép, mã giấy phép ..."
            solo
            chips
            multiple
            deletable-chips
            item-value="value"
            item-text="text"
            @keyup.enter="searchDeliverable"
            content-class="adv__search__select"
            return-object
          ></v-text-field>
        </div>
        <div class="flex text-right" style="margin-left: auto;max-width: 50px;">
          <v-btn icon class="my-0 mx-2" v-on:click.native="searchDeliverable">
            <v-icon size="16">search</v-icon>
          </v-btn>
        </div>
      </div> 
      <!-- <div class="layout row wrap header_tools row-blue">
        <div class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
          <v-combobox
            v-model="advSearchItems"
            placeholder="Tìm kiếm ..."
            solo
            chips
            small
            tags
            deletable-chips
            item-value="value"
            item-text="text"
            @input="keywordEventChange"
            return-object
            multiple
          ></v-combobox>
        </div>
        <div class="flex text-right" style="margin-left: auto;max-width: 50px;">
          <v-btn icon class="my-0 mx-2" v-on:click.native="menusss = !menusss">
            <v-icon size="16">filter_list</v-icon>
          </v-btn>
        </div>
      </div>
      <v-fade-transition>
        <div v-if="menusss" class="adv__search_container">
          <v-layout wrap v-for="(item, indexTool) in filters" v-bind:key="indexTool" v-if="item.display">
              <v-flex xs12 sm4>
                <v-select
                  :items="filters"
                  v-model="item.fieldName"
                  label="Chọn điều kiện lọc"
                  single-line
                  item-value="fieldName"
                  item-text="fieldLabel"
                  disabled
                ></v-select>
              </v-flex>
              <v-flex xs12 sm1 class="text-center">
                <v-btn icon class="mb-0 mx-0 mt-1">
                  <v-icon size="16">drag_handle</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs12 sm7>
                <v-text-field v-if="item.fieldType === 'string'"
                  v-model="filterData[item.fieldName]"
                  :label="item['fieldLabel']"
                  single-line
                  clearable
                  @change="changeAdvFilterData($event, item)"
                ></v-text-field>
              </v-flex>
          </v-layout>
          <v-layout wrap>
            <v-flex xs12 sm10 class="no__selected__items">
              <v-select
                :items="filters"
                label="Chọn điều kiện lọc"
                single-line
                item-value="fieldName"
                item-text="fieldLabel"
                @change="selectedAdvFilter"
                hide-selected
                return-object
              ></v-select>
            </v-flex>
            <v-flex xs12 sm2 class="text-right">
              <v-btn color="primary" class="mx-0 my-0 mt-1" v-on:click.native="menusss = false">
                <v-icon class="mr-2">clear</v-icon>
                Quay lại
              </v-btn>
            </v-flex>
          </v-layout>
        </div>
      </v-fade-transition> -->
    </div>
    <div style="text-align: right;" v-if="getUser('QUAN_LY_GIAY_PHEP') || userPermission">
      <v-btn color="blue darken-3" dark
        :to="'/danh-sach-giay-to/' + index + '/editor/0'"
      >
        Thêm giấy phép
      </v-btn>
    </div>
    <v-data-table
        :headers="headers"
        :items="hosoDatas"
        :total-items="hosoDatasTotal"
        class="table-landing table-bordered"
        no-data-text="Không có giấy phép nào"
        hide-actions
        v-if="!loadingTable"
      >
      <template slot="items" slot-scope="props">
        <tr>
          <td class="text-xs-center px-0 py-0">
            <content-placeholders v-if="loadingTable">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <span v-else @click="viewDetail(props.item['_source'], props.index)" style="cursor: pointer;">
              {{ hosoDatasPage * 15 - 15 + props.index + 1 }}
            </span>
          </td>

          <td v-for="(itemHeader, indexHeader) in headers" v-bind:key="indexHeader + '_' + props.item['_id']"
            :class="itemHeader['class_column']"
            v-if="itemHeader.hasOwnProperty('value')"
          >
            <content-placeholders v-if="loadingTable">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <div v-else @click="viewDetail(props.item['_source'], props.index)" style="cursor: pointer;">
              <template-rendering v-if="itemHeader.hasOwnProperty('layout_view')" :item="props.item['_source']" :layout_view="itemHeader.layout_view"></template-rendering>
              <span v-else>
                {{ props.item['_source'][itemHeader.value] }}
              </span>
            </div>
          </td>
          <td class="text-xs-center px-0 py-0" v-if="!hideAction">
            <content-placeholders v-if="loadingTable">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-btn flat icon class="mx-0 my-0" v-else v-on:click.native="showPDFG(props.item['_source'])">
              <v-icon>picture_as_pdf</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
    <div v-if="!loadingTable" class="text-xs-right layout wrap" style="position: relative;border-top: 1px solid lightgrey;">
      <div class="flex pagging-table px-2"> 
        <tiny-pagination :total="hosoDatasTotal" :page="hosoDatasPage" custom-class="custom-tiny-class" 
          @tiny:change-page="paggingData" ></tiny-pagination>
      </div>
    </div>
    <v-dialog v-model="dialogPDF" max-width="900" transition="fade-transition">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Giấy phép</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogPDF = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <div v-if="dialogPDFLoading" style="
            min-height: 600px;
            text-align: center;
            margin: auto;
            padding: 25%;
        ">
          <v-progress-circular
            :size="100"
            :width="1"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>
        <iframe v-show="!dialogPDFLoading" id="pdfViewerListComponent" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 600px;" frameborder="0">
        </iframe>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { TinyPagination } from '@/components'
  import TemplateRendering from './template_rendering.vue'

  export default {
    props: ['index'],
    components: {
      TinyPagination,
      TemplateRendering
    },
    data () {
      return {
        filterData: {},
        menusss: false,
        loadingTable: false,
        dialogPDFLoading: false,
        dialogPDF: false,
        headers: [],
        hideAction: false,
        hosoDatas: [],
        hosoDatasTotal: 0,
        hosoDatasPage: 1,
        dataSocket: {},
        filters: [],
        advSearchItems: [],
        deliverableKey: ''
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        vm.$store.dispatch('getDeliverableTypes').then(function (result) {
          setTimeout(() => {
            if (vm.items[vm.index]['dataConfig'] !== '') {
              vm.filters = eval('( ' + vm.items[vm.index]['dataConfig'] + ' )')
            }
            if (vm.items[vm.index]['tableConfig'] !== '') {
              vm.headers = eval('( ' + vm.items[vm.index]['tableConfig'] + ' )')['headers']
            } else {
              vm.headers = []
              vm.hosoDatas = []
              vm.hosoDatasTotal = 0
              vm.hosoDatasPage = 1
              vm.loadingTable = true
              setTimeout(() => {
                vm.loadingTable = false
              }, 100)
            }
            vm.pullData(vm.items[vm.index]['typeCode'])
            // set permissionUser
            if (vm.items.length > 0) {
              vm.$store.commit('setUserPermission', vm.items[vm.index]['moderator'])
            }
            // 
          }, 100)
        })
      })
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentQuery = newRoute.query
        if (currentQuery.hasOwnProperty('keyword')) {
          vm.deliverableKey = currentQuery['keyword']
        }
        if (currentQuery.hasOwnProperty('page')) {
          vm.hosoDatasPage = parseInt(currentQuery.page)
        } else {
          vm.hosoDatasPage = 1
        }
        // vm.pullData(vm.items[vm.index]['typeCode'])
        vm.filterDeliverable()
      },
      index (val) {
        var vm = this
        // set permissionUser
        if (vm.items.length > 0) {
          vm.$store.commit('setUserPermission', vm.items[val]['moderator'])
        }
        // 
        if (vm.items[val]['dataConfig'] !== '') {
          vm.filters = eval('( ' + vm.items[val]['dataConfig'] + ' )')
        } else {
          vm.filters = []
        }
        if (vm.items[val]['tableConfig'] !== '') {
          vm.hosoDatasPage = 1
          vm.headers = eval('( ' + vm.items[val]['tableConfig'] + ' )')['headers']
        } else {
          vm.headers = []
          vm.hosoDatas = []
          vm.hosoDatasTotal = 0
          vm.hosoDatasPage = 1
          vm.loadingTable = true
          setTimeout(() => {
            vm.loadingTable = false
          }, 100)
        }
      },
      items () {
        var vm = this
        // set permissionUser
        if (vm.items.length > 0) {
          vm.$store.commit('setUserPermission', vm.items[vm.index]['moderator'])
        }
        // 
      },
      advSearchItems: {
        handler: function (val, oldVal) {
          let vm = this
          let current = vm.$router.history.current
          let newQuery = current.query
          let currentPath = current.path
          let queryString = '?'
          newQuery['renew'] = ''
          for (let key in vm.filters) {
            newQuery[vm.filters[key]['fieldName']] = ''
          }
          for (let key in newQuery) {
            if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
              queryString += key + '=' + newQuery[key] + '&'
            }
          }
          for (let key in val) {
            if (!val[key]['text'].endsWith(':__')) {
              queryString += val[key]['spec'] + '=' + val[key]['value'] + '&'
            }
          }
          queryString += 'renew=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1
          vm.$router.push({
            path: '/danh-sach-giay-to/' + vm.index + queryString
          })
        },
        deep: true
      }
    },
    computed: {
      items () {
        return this.$store.getters.getDeliverableTypes
      },
      userPermission () {
        return this.$store.getters.getUserPermission
      }
    },
    methods: {
      pullData (type) {
        let vm = this
        let currentQuery = vm.$router.history.current.query
        let queryString = ''
        for (let key in currentQuery) {
          if (currentQuery[key] !== '' && currentQuery[key] !== 'undefined' && currentQuery[key] !== undefined) {
            queryString += key + '=' + currentQuery[key] + '&'
          }
        }
        queryString += '1=1'
        let filter = {
          type: type,
          page: vm.hosoDatasPage,
          q: queryString
        }
        vm.loadingTable = true
        vm.$store.dispatch('getDeliverables', filter).then(function (result) {
          vm.hosoDatasTotal = result['hits']['total']
          vm.hosoDatas = result['hits']['hits']
          vm.loadingTable = false
        }).catch(function (reject) {
          vm.loadingTable = false
          console.log(reject)
        })
        setTimeout(() => {
          if (vm.advSearchItems !== null && vm.advSearchItems.length === 0) {
            for (let key in vm.filters) {
              if (currentQuery.hasOwnProperty(vm.filters[key]['fieldName'])) {
                vm.filters[key].display = true
                vm.filters[key].disabled = true
                vm.advSearchItems.push({
                  spec: vm.filters[key].fieldName,
                  value: currentQuery[vm.filters[key]['fieldName']],
                  text: vm.filters[key].fieldName + ':' + currentQuery[vm.filters[key]['fieldName']],
                  index: vm.filters[key].index
                })
              }
            }
          }
        }, 200)
      },
      viewDetail (item, index) {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: '/danh-sach-giay-to/' + vm.index + '/editor/' + item['entryClassPK'] + queryString
        })
      },
      showPDFG (item) {
        let vm = this
        vm.dialogPDF = true
        vm.dialogPDFLoading = true
        vm.$store.dispatch('viewPDF', item['fileEntryId']).then(function (result) {
          vm.dialogPDFLoading = false
          document.getElementById('pdfViewerListComponent').src = result
        })
      },
      paggingData (config) {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = ''
        newQuery['keyword'] = ''
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        // console.log('queryString=====', queryString)
        queryString += 'page=' + config.page + '&keyword=' + vm.deliverableKey
        vm.$router.push({
          path: current.path + queryString
        })
      },
      selectedAdvFilter (item) {
        let vm = this
        vm.filters[item.index].display = true
        vm.filters[item.index].disabled = true
        let hasKey = false
        for (let key in vm.advSearchItems) {
          if (vm.advSearchItems[key].index === item.index) {
            hasKey = true
            break
          }
        }
        if (!hasKey) {
          vm.advSearchItems.push({
            spec: vm.filters[item.index].fieldName,
            value: '__',
            text: vm.filters[item.index].fieldName + ':' + '__',
            index: item.index
          })
        }
        console.log('vm.advSearchItems', vm.advSearchItems)
      },
      keywordEventChange (data) {
        let vm = this
        for (let keyTool in vm.filters) {
          vm.filters[keyTool].display = false
          vm.filters[keyTool].disabled = false
          for (let key in data) {
            if (data[key]['index'] === vm.filters[keyTool]['index']) {
              vm.filters[keyTool].display = true
              vm.filters[keyTool].disabled = true
              break
            }
          }
        }
      },
      changeAdvFilterData (data, item) {
        let vm = this
        let valueFilter = data
        for (let key in vm.advSearchItems) {
          if (vm.advSearchItems[key].index === item.index) {
            vm.advSearchItems[key].spec = item.fieldName
            vm.advSearchItems[key].value = valueFilter
            vm.advSearchItems[key].text = item.fieldName + ':' + valueFilter
            break
          }
        }
      },
      searchDeliverable () {
        let vm = this
        setTimeout(function () {
          let current = vm.$router.history.current
          let newQuery = current.query
          let queryString = '?'
          newQuery['page'] = 1
          newQuery['keyword'] = vm.deliverableKey
          for (let key in newQuery) {
            if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
              queryString += key + '=' + newQuery[key] + '&'
            }
          }
          vm.$router.push({
            path: current.path + queryString,
            query: {
              renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
            }
          })
        }, 100)
      },
      filterDeliverable () {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        let filter = {
          type: vm.items[vm.index]['typeCode'],
          page: newQuery.hasOwnProperty('page') ? newQuery['page'] : 1,
          keyword: newQuery.hasOwnProperty('keyword') ? newQuery['keyword'] : vm.deliverableKey
        }
        vm.loadingTable = true
        vm.$store.dispatch('searchDeliverables', filter).then(function (result) {
          vm.hosoDatasTotal = result['hits']['total']
          vm.hosoDatas = result['hits']['hits']
          vm.loadingTable = false
        }).catch(function (reject) {
          vm.loadingTable = false
          console.log(reject)
        })
      },
      getUser (roleItem) {
        let vm = this
        let roles = vm.$store.getters.getUser.role
        if (!roles) {
          return false
        }
        let roleExits = roles.findIndex(item => String(item).indexOf(roleItem) >= 0)
        return (roleExits >= 0)
      }
    }
  }
</script>
