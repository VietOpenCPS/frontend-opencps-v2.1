<template>
  <div>
    <div class="row-header no__hidden_class">
      <div class="background-triangle-big"> <span>{{items[index] !== undefined ? items[index]['typeName'] : ''}}</span> </div>
      <div class="layout row wrap header_tools row-blue">
        <div class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
          
        </div>
        <div class="flex text-right" style="margin-left: auto;max-width: 50px;">
          <v-btn icon class="my-0 mx-2">
            <v-icon size="16">filter_list</v-icon>
          </v-btn>
        </div>
      </div> 
    </div>
    <div style="text-align: right;">
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
        <v-card-title class="headline">Giấy phép</v-card-title>
        <v-btn icon dark class="mx-0 my-0 absolute__btn_panel mr-2" v-on:click.native="dialogPDF = false">
          <v-icon>clear</v-icon>
        </v-btn>
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

  export default {
    props: ['index'],
    components: {
      TinyPagination
    },
    data () {
      return {
        loadingTable: false,
        dialogPDFLoading: false,
        dialogPDF: false,
        headers: [],
        hideAction: false,
        hosoDatas: [],
        hosoDatasTotal: 0,
        hosoDatasPage: 1,
        dataSocket: {}
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        setTimeout(() => {
          if (vm.items[val]['tableConfig'] !== '') {
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
        }, 100)
      })
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentQuery = newRoute.query
        if (currentQuery.hasOwnProperty('page')) {
          vm.hosoDatasPage = parseInt(currentQuery.page)
        } else {
          vm.hosoDatasPage = 1
        }
        vm.pullData(vm.items[vm.index]['typeCode'])
      },
      index (val) {
        var vm = this
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
      }
    },
    computed: {
      items () {
        return this.$store.getters.getDeliverableTypes
      }
    },
    methods: {
      pullData (type) {
        let vm = this
        let filter = {
          type: type,
          page: vm.hosoDatasPage
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
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        // console.log('queryString=====', queryString)
        queryString += 'page=' + config.page
        vm.$router.push({
          path: current.path + queryString
        })
      }
    }
  }
</script>
