<template>
  <div>
    <div class="row-header no__hidden_class">
      <div class="background-triangle-big"> <span>{{items ? String(items[index]['typeName']) : ''}}</span> </div>

      <div class="layout row wrap header_tools row-blue">
        <div class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
          <!-- <v-text-field
            v-model="deliverableKey"
            placeholder="Tìm kiếm theo số giấy phép ..."
            solo
            chips
            multiple
            deletable-chips
            item-value="value"
            item-text="text"
            @keyup.enter="filterDeliverable('keyword')"
            content-class="adv__search__select"
            return-object
            autofocus
          ></v-text-field> -->
        </div>
        <div class="flex text-right" style="margin-left: auto;max-width: 115px;">
          <v-tooltip top>
            <v-btn  slot="activator" icon class="my-0 mx-0 mr-2 px-0" v-on:click.native="menusss = !menusss">
              <v-icon size="20">fas fa fa-filter</v-icon>
            </v-btn>
            <span>Tìm kiếm nâng cao</span>
          </v-tooltip>
          <!-- <v-btn color="blue darken-3" dark class="my-0 mx-2" v-on:click.native="menusss = !menusss">
            <v-icon size="16">search</v-icon>&nbsp; Tìm kiếm
          </v-btn> -->
        </div>
      </div> 
    </div>
    <div class="" v-if="menusss">
      <v-layout wrap>
        <div class="adv_search px-2 my-2 mx-2" style="background: #eeeeee">
          <div class="searchAdvanced-content py-2">
            <v-layout wrap>
              <!-- <v-flex xs12 sm6 class="mb-2 px-2">
                <div>
                  <div class="d-inline-block text-bold" style="font-weight:450;width: 150px;">Số/ ký hiệu:</div>
                  <v-text-field
                    v-model="deliverableKey"
                    class="search-input-appbar input-search d-inline-block"
                    style="width: calc(100% - 150px);"
                    single-lines
                    hide-details
                    solo
                    flat
                    height="32"
                    min-height="32"
                    clearable
                    @keyup.enter="filterDeliverable"
                  ></v-text-field>
                </div>
              </v-flex>
              <v-flex xs12 sm6 class="mb-2 px-2">
                <div>
                  <div class="d-inline-block text-bold" style="font-weight:450;width: 150px;">Ngày ban hành:</div>
                  <v-menu
                    class="d-inline-block"
                    style="width: calc(100% - 150px);"
                    ref="menuDate"
                    :close-on-content-click="false"
                    v-model="menuDate"
                    :nudge-right="40"
                    lazy
                    transition="fade-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                  >
                    <v-text-field
                      class="search-input-appbar input-search d-inline-block"
                      slot="activator"
                      append-icon="event"
                      single-lines
                      hide-details
                      solo
                      flat
                      height="32"
                      min-height="32"
                      v-model="issueDate"
                      @blur="issueDatePiecker = parseDate(issueDate)"
                      clearable
                      @keyup.enter="filterDeliverable"
                    ></v-text-field>
                    <v-date-picker ref="picker" min="1950-01-01" :first-day-of-week="1" locale="vi"
                    v-model="issueDatePiecker" no-title @input="changeIssueDate"></v-date-picker>
                  </v-menu>
                </div>
              </v-flex>
              <v-flex xs12 sm6 class="mb-2 px-2">
                <div>
                  <div class="d-inline-block text-bold" style="font-weight:450;width: 150px;">Đơn vị được cấp:</div>
                  <v-text-field
                    v-model="applicantName"
                    class="search-input-appbar input-search d-inline-block"
                    style="width: calc(100% - 150px);"
                    single-lines
                    hide-details
                    solo
                    flat
                    height="32"
                    min-height="32"
                    clearable
                    @keyup.enter="filterDeliverable"
                  ></v-text-field>
                </div>
              </v-flex>
              <v-flex xs12 sm6 class="mb-2 px-2">
                <div>
                  <div class="d-inline-block text-bold" style="font-weight:450;width: 150px;">Đơn vị cử đến:</div>
                  <v-text-field
                    v-model="donvicu_data"
                    class="search-input-appbar input-search d-inline-block"
                    style="width: calc(100% - 150px);"
                    single-lines
                    hide-details
                    solo
                    flat
                    height="32"
                    min-height="32"
                    clearable
                    @keyup.enter="filterDeliverable"
                  ></v-text-field>
                </div>
              </v-flex>
              <v-flex xs12 class="mb-2 px-2">
                <div>
                  <div class="d-inline-block text-bold" style="font-weight:450;width: 150px;">Trích yếu:</div>
                  <v-textarea
                    v-model="trichyeu_data"
                    class="search-input-appbar input-search d-inline-block"
                    style="width: calc(100% - 150px);"
                    single-lines
                    hide-details
                    solo
                    flat
                    rows="3"
                    clearable
                    @keyup.enter.native="filterDeliverable"
                  ></v-textarea>
                </div>
              </v-flex> -->
              <v-flex v-for="(item, indexTool) in filters" v-if="item.display" v-bind:key="indexTool" :class="item.class" class="mb-2 px-2">
                <div>
                  <div class="d-inline-block text-bold" style="font-weight:450;width: 150px;">{{item.fieldLabel}}:</div>
                  <v-text-field
                    v-if="item.fieldType === 'string'"
                    v-model="filterData[item.fieldName]"
                    class="search-input-appbar input-search d-inline-block"
                    style="width: calc(100% - 150px);"
                    single-lines
                    hide-details
                    solo
                    flat
                    height="32"
                    min-height="32"
                    clearable
                    @keyup.enter="filterDeliverable"
                  ></v-text-field>
                  <v-textarea
                    v-if="item['fieldType'] === 'textarea'"
                    v-model="filterData[item.fieldName]"
                    class="search-input-appbar input-search d-inline-block"
                    style="width: calc(100% - 150px);"
                    single-lines
                    hide-details
                    solo
                    flat
                    rows="3"
                    clearable
                    @keyup.enter="filterDeliverable"
                  ></v-textarea>
                  <v-autocomplete
                    v-if="item['fieldType'] === 'select'"
                    class="select-search d-inline-block"
                    :items="item['source']"
                    v-model="filterData[item.fieldName]"
                    :label="item['label']"
                    item-value="value"
                    item-text="name"
                    :clearable="item['clearable']"
                    hide-details
                    solo
                    flat
                    height="32"
                    min-height="32"
                    style="width: calc(100% - 150px);"
                  ></v-autocomplete>
                  <datetime-picker
                    v-if="item.fieldType === 'date'"
                    v-model="filterData[item.fieldName]" 
                    :item="item" 
                    :data-value="filterData[item.fieldName]"
                    :data-all="filterData"
                    :classTextField="'search-input-appbar input-search d-inline-block'"
                    :classMenu="'d-inline-block'"
                    @changeDate="changeDate($event, item.fieldName)"
                    >
                    
                  </datetime-picker>
                  <!-- <v-menu
                    class="d-inline-block"
                    style="width: calc(100% - 150px);"
                    ref="menuDate"
                    :close-on-content-click="false"
                    v-model="menuDate"
                    :nudge-right="40"
                    lazy
                    transition="fade-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                  >
                    <v-text-field
                      v-if="item['fieldType'] === 'date'"
                      class="search-input-appbar input-search d-inline-block"
                      slot="activator"
                      append-icon="event"
                      single-lines
                      hide-details
                      solo
                      flat
                      height="32"
                      min-height="32"
                      v-model="filterData[item.fieldName]"
                      @blur="issueDatePiecker = parseDate(filterData[item.fieldName])"
                      clearable
                      @keyup.enter="filterDeliverable"
                    ></v-text-field>
                    <v-date-picker ref="picker" min="1950-01-01" :first-day-of-week="1" locale="vi"
                    v-model="issueDatePiecker" no-title @input="changeIssueDate(item.fieldName)"></v-date-picker>
                  </v-menu> -->
                </div>
              </v-flex>
              
            </v-layout>
            
            <v-flex class="xs12 mx-2">
              <v-btn class="mx-0 mb-0" color="primary" dark @click.native="filterDeliverable">
                <v-icon size="18">search</v-icon> &nbsp; Tìm kiếm
              </v-btn>
            </v-flex>
          </div>
        </div>

      </v-layout>
    </div>
    <div style="text-align: right;" v-if="getUser('QUAN_LY_GIAY_PHEP') || userPermission">
      <v-btn color="blue darken-3" dark
        :to="'/danh-sach-giay-to/' + index + '/editor/0'"
      >
        <v-icon size="16">add</v-icon>&nbsp;Thêm&nbsp;{{String(loaiDuLieu).toLowerCase()}}
      </v-btn>
      <!-- download -->
      <v-btn color="primary" class="white--text"
        @click="downloadBieuMau(downloadFileTemplate.url)"
        v-if="downloadFileTemplate.url">
        <v-icon>get_app</v-icon> &nbsp;
        {{downloadFileTemplate.lable}}
      </v-btn>
      <!--  -->
      <!-- import -->
      <v-btn color="primary" class="white--text"
        v-if="importDeliverable"
        :loading="loadingImport"
        :disabled="loadingImport"
        @click="doImportData">
        <v-icon>exit_to_app</v-icon> &nbsp;
        Import&nbsp;{{String(loaiDuLieu).toLowerCase()}}
      </v-btn>
      <!--  -->
      <v-btn color="primary"
        v-if="exportDeliverable"
        @click="exportTracking"
        :loading="loadingImport"
        :disabled="loadingImport"
      >
        <v-icon>import_export</v-icon>&nbsp;
        Export&nbsp;{{String(loaiDuLieu).toLowerCase()}}
      </v-btn>
      <JsonExcel
          class="btn btn-default btn-export"
          :data="json_data"
          style="display: none"
          :name="items ? String(items[index]['typeName']) : ''"
      >
        Export Excel
      </JsonExcel>
    </div>
    <v-data-table
        :headers="headers"
        :items="hosoDatas"
        class="table-landing table-bordered"
        hide-actions
      >
      <template slot="items" slot-scope="props">
        <tr>
          <!-- <td class="text-xs-center px-0 py-0 pt-1">
            <content-placeholders v-if="loadingTable">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <span v-else @click="viewDetail(props.item, props.index)" style="cursor: pointer;">
              {{ hosoDatasPage * 15 - 15 + props.index + 1 }}
            </span>
          </td> -->

          <td class="pt-1" v-for="(itemHeader, indexHeader) in headers" v-bind:key="indexHeader + '_' + props.item['_id']"
            :class="itemHeader['class_column']"
            v-if="itemHeader.hasOwnProperty('value') && itemHeader.value !== 'action'"
          >
            <div v-if="itemHeader.value === 'counter'">
              <span @click="viewDetail(props.item, props.index)" style="cursor: pointer;">
                {{ hosoDatasPage * 15 - 15 + props.index + 1 }}
              </span>
            </div>
            <div v-else-if="itemHeader.value === 'deliverableState'" @click="viewDetail(props.item, props.index)" style="cursor: pointer;">
              <span>
                {{getState(props.item)}}
              </span>
            </div>
            <div class="text-xs-center" v-else-if="itemHeader.value === 'mortgageable'" style="cursor: pointer;">
              <v-tooltip top v-if="String(props.item['mortgageable_data']).toLowerCase() === 'true' && props.item['mortgageInfo_data']">
                <v-btn slot="activator" flat icon class="mx-0 my-0" v-on:click.stop="showMortgage(props.item, props.index)">
                  <v-icon class="green--text" size="24px">check_circle</v-icon>
                </v-btn>
                <span>{{props.item['mortgageInfo_data']}}</span>
              </v-tooltip>
              
              <v-tooltip top v-if="String(props.item['mortgageable_data']).toLowerCase() === 'true' && !props.item['mortgageInfo_data']">
                <v-btn slot="activator" flat icon class="mx-0 my-0" v-on:click.stop="showMortgage(props.item, props.index)">
                  <v-icon style="color:#D32F2F" size="24px">remove_circle</v-icon>
                </v-btn>
                <span>Không có thông tin thế chấp</span>
              </v-tooltip>
              
            </div>
            <div v-else-if="itemHeader.type === 'currency'">
              <span>
                {{currency(props.item[itemHeader.value])}}
              </span>
            </div>
            <div v-else @click="viewDetail(props.item, props.index)" style="cursor: pointer;">
              <template-rendering v-if="itemHeader.hasOwnProperty('layout_view')" :item="props.item" :layout_view="itemHeader.layout_view"></template-rendering>
              <span v-else>
                {{ props.item[itemHeader.value] }}
              </span>
            </div>
          </td>
          <td class="text-xs-left px-0 py-0 pt-1" v-if="!hideAction" style="width:120px">
            <content-placeholders v-if="loadingTable">
              <content-placeholders-text :lines="1" />
            </content-placeholders>

            <v-tooltip top v-if="!loadingTable">
              <v-btn slot="activator" flat icon class="mx-0 my-0" v-on:click.native="showPDFG(props.item)">
                <v-icon>attach_file</v-icon>
              </v-btn>
              <span>Xem &nbsp;{{String(loaiDuLieu).toLowerCase()}}</span>
            </v-tooltip>
            
            <!-- <v-tooltip top v-if="!loadingTable">
              <v-btn :disabled="props.item['fileAttachs'] ? false : true" slot="activator" flat icon class="mx-0 my-0" v-if="!loadingTable" v-on:click.native="viewFileAttach(props.item)">
                <v-icon>attach_file</v-icon>
              </v-btn>
              <span>Xem tài liệu đính kèm</span>
            </v-tooltip> -->

            <v-tooltip top v-if="!loadingTable">
              <v-btn :disabled="props.item['dossierId'] === '0' ? false : true" slot="activator" flat icon class="mx-0 my-0" v-if="!loadingTable" v-on:click.native="editDeliverables(props.item)">
                <v-icon>edit</v-icon>
              </v-btn>
              <span>Sửa&nbsp;{{String(loaiDuLieu).toLowerCase()}}</span>
            </v-tooltip>

            <v-tooltip top v-if="!loadingTable">
              <v-btn slot="activator" flat icon class="mx-0 my-0" v-if="props.item['dossierId'] === '0' && !loadingTable" v-on:click.native="deleteDeliverable(props.item)">
                <v-icon>delete</v-icon>
              </v-btn>
              <span>Xóa&nbsp;{{String(loaiDuLieu).toLowerCase()}}</span>
            </v-tooltip>

          </td>
        </tr>
      </template>
      <template slot="no-data">
        <div class="text-xs-center mt-2">
          Không có dữ liệu
        </div>
      </template>
    </v-data-table>
    <div v-if="!loadingTable" class="text-xs-right layout wrap" style="position: relative;border-top: 1px solid lightgrey;">
      <div class="flex pagging-table px-2"> 
        <tiny-pagination :total="hosoDatasTotal" :page="hosoDatasPage" custom-class="custom-tiny-class" 
          @tiny:change-page="paggingData" ></tiny-pagination>
      </div>
    </div>
    <v-dialog v-model="dialogPDFList" max-width="1200" transition="fade-transition" fullscreen>
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>
           <span v-if="!viewAttach">{{String(loaiDuLieu).toUpperCase()}}</span>
           <span v-else>TÀI LIỆU ĐÍNH KÈM</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogPDFList = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <div v-if="dialogPDFLoading" style="
            min-height: 650px;
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
        <iframe v-show="!dialogPDFLoading" id="pdfViewerListComponent" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 650px;" frameborder="0">
        </iframe>
        <v-card-actions v-if="viewAttach && fileEntryIdAttachs.length > 1" class="py-0">
          <span class="left primary--text text-bold" style="font-size: 1.25em">Tổng số: <span class="red--text">{{fileEntryIdAttachs.length}}</span> tài liệu</span>
          <div class="text-xs-center" style="width: calc(100% - 150px);">
            <v-pagination
              v-model="pageAttachs"
              :length="fileEntryIdAttachs.length"
              circle
              @input="changePage(pageAttachs)"
              :total-visible="5"
            ></v-pagination>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogMortgage" max-width="700" persistent transition="fade-transition">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>
           Thông tin thế chấp
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogMortgage = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-textarea
            v-model="mortGageInput"
            placeholder="Nhập thông tin thế chấp"
            class=""
            box
            rows="7"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-2" color="red" @click="dialogMortgage = false"
            :loading="loading"
            :disabled="loading"
          >
            <v-icon class="white--text">clear</v-icon> &nbsp;
            <span class="white--text">Thoát</span>
          </v-btn>
          <v-btn class="mr-2" color="primary" @click="changeMortgageInfo()"
            :loading="loading"
            :disabled="loading"
          >
            <v-icon>save</v-icon> &nbsp;
            Cập nhật
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <input
      type="file"
      ref="importData"
      name="importData"
      accept=""
      @input="onFilePicked"
      v-show="false"
    >
  </div>
</template>

<script>
  import { TinyPagination } from '@/components'
  import TemplateRendering from './template_rendering.vue'
  import DatetimePicker from '../ext/DatetimePicker.vue'
  import axios from 'axios'
  import toastr from 'toastr'
  import JsonExcel from 'vue-json-excel'

  export default {
    props: ['index'],
    components: {
      TinyPagination,
      TemplateRendering,
      DatetimePicker,
      JsonExcel
    },
    data () {
      return {
        menuDate: false,
        issueDatePiecker: '',
        filterData: {},
        menusss: false,
        loadingTable: false,
        dialogPDFLoading: false,
        loadingImport: false,
        dialogPDFList: false,
        dialogMortgage: false,
        mortGageInput: '',
        headerExport: [],
        headerExportRemoveAction: [],
        headers: [],
        hideAction: false,
        hosoDatas: [],
        hosoDatasTotal: 0,
        hosoDatasPage: 1,
        dataSocket: {},
        filters: [],
        advSearchItems: [],
        deliverableKey: '',
        pageAttachs: 1,
        viewAttach: false,
        fileEntryIdAttachs: [],
        deliverableSelected: '',
        indexDeliverableSelected: '',

        deliverableCode: '',
        issueDate: null,
        applicantName: '',
        donvicu_data: '',
        trichyeu_data: '',
        loaiDuLieu: '',
        json_fields: {
        },
        json_data: [],
        json_meta: [
            [
                {
                    'key': 'charset',
                    'value': 'utf-8'
                }
            ]
        ],
        filterExport: '',
        downloadFileTemplate: {
          lable: '',
          url: '',
        },
        importDeliverable: true,
        exportDeliverable: true,
        urlRedirectDossier: ''
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
              try{
                console.log(eval('( ' + vm.items[vm.index]['tableConfig'] + ' )'))
               
                let tableConfig = eval('( ' + vm.items[vm.index]['tableConfig'] + ' )')
                console.log(tableConfig)
                vm.downloadFileTemplate = tableConfig['downloadFileTemplate'] ? tableConfig['downloadFileTemplate'] : {url: '', lable: ''}
              }
              catch (err) {
                vm.downloadFileTemplate = {url: '', lable: ''}
              }
              vm.headerExport = eval('( ' + vm.items[vm.index]['tableConfig'] + ' )')['headers']
              vm.headers = vm.headerExport.filter(function (item) {
                return !item.hasOwnProperty('show') || (item.hasOwnProperty('show') && item.show)
              })
              let tableConfig = eval('( ' + vm.items[vm.index]['tableConfig'] + ' )')
              if (tableConfig.hasOwnProperty('loaiDuLieu') && tableConfig.loaiDuLieu) {
                vm.loaiDuLieu = tableConfig.loaiDuLieu
              } else {
                vm.loaiDuLieu = "giấy phép"
              }
              if (tableConfig.hasOwnProperty('importDeliverable') && !tableConfig.importDeliverable) {
                vm.importDeliverable = false
              }
              if (tableConfig.hasOwnProperty('exportDeliverable') && !tableConfig.exportDeliverable) {
                vm.exportDeliverable = false
              }
              if (tableConfig.hasOwnProperty('urlRedirectDossier') && tableConfig.urlRedirectDossier) {
                vm.urlRedirectDossier = tableConfig.urlRedirectDossier
              }
              vm.headerExportRemoveAction = vm.headerExport.filter(function (item) {
                return item.value !== 'action'
              })
              for(let i=0; i< vm.headerExportRemoveAction.length ;i++){
                // if(vm.headerExportRemoveAction[i]['text'] !== 'STT'){
                  vm.json_fields[vm.headerExportRemoveAction[i]['text']] =  vm.headerExportRemoveAction[i]['value']
                // }
              }
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
        vm.deliverableKey = ''
        vm.applicantName = ''
        vm.issueDate = ''
        vm.donvicu = ''
        vm.trichyeu = ''
        vm.deliverableCode = ''
        vm.filterDeliverable('keyword')
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
          console.log('ưqe',vm.items[vm.index]['tableConfig'])
          vm.headerExport = eval('( ' + vm.items[val]['tableConfig'] + ' )')['headers']
          try{
            let tableConfig = JSON.parse(vm.items[vm.index]['tableConfig'])
            vm.downloadFileTemplate = tableConfig['downloadFileTemplate'] ? tableConfig['downloadFileTemplate'] : {url: '', lable: ''}
          }
          catch (err) {
            vm.downloadFileTemplate = {url: '', lable: ''}
          }
      
          vm.headers = vm.headerExport.filter(function (item) {
            return !item.hasOwnProperty('show') || (item.hasOwnProperty('show') && item.show)
          })
          vm.headerExportRemoveAction = vm.headerExport.filter(function (item) {
            return item.value !== 'action'
          })
          for(let i=0; i< vm.headerExportRemoveAction.length ;i++){
            // if(vm.headerExportRemoveAction[i]['text'] !== 'STT'){
              vm.json_fields[vm.headerExportRemoveAction[i]['text']] =  vm.headerExportRemoveAction[i]['value']
            // }
          }
          let tableConfig = eval('( ' + vm.items[val]['tableConfig'] + ' )')
          if (tableConfig.hasOwnProperty('loaiDuLieu') && tableConfig.loaiDuLieu) {
            vm.loaiDuLieu = tableConfig.loaiDuLieu
          } else {
            vm.loaiDuLieu = "giấy phép"
          }
          if (tableConfig.hasOwnProperty('importDeliverable') && !tableConfig.importDeliverable) {
            vm.importDeliverable = false
          }
          if (tableConfig.hasOwnProperty('exportDeliverable') && !tableConfig.exportDeliverable) {
            vm.exportDeliverable = false
          }
          if (tableConfig.hasOwnProperty('urlRedirectDossier') && tableConfig.urlRedirectDossier) {
            vm.urlRedirectDossier = tableConfig.urlRedirectDossier
          }
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
        try {
          let tableConfig = eval('( ' + vm.items[vm.index]['tableConfig'] + ' )')
          if (tableConfig.hasOwnProperty('paramUrl') && tableConfig.paramUrl) {
            filter = Object.assign(filter, {formDataKey: JSON.stringify(tableConfig.paramUrl)})
          }
        } catch (error) {
        }
        vm.filterExport = filter
        vm.$store.dispatch('getDeliverables', filter).then(function (result) {
          vm.hosoDatasTotal = result['total']
          vm.hosoDatas = result['data']
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
        // ---- Xem chi tiết giấy phép
        // let current = vm.$router.history.current
        // let newQuery = current.query
        // let queryString = '?'
        // for (let key in newQuery) {
        //   if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
        //     queryString += key + '=' + newQuery[key] + '&'
        //   }
        // }
        // vm.$router.push({
        //   path: '/danh-sach-giay-to/' + vm.index + '/editor/' + item['entryClassPK'] + queryString
        // })
        // ----Xem chi tiết hồ sơ
        if (item.hasOwnProperty('dossierId') && item.dossierId) {
          let url = vm.urlRedirectDossier + '/' + item.dossierId
          window.open(url, "_blank")
        }
        
      },
      editDeliverables (item, index) {
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
          path: '/danh-sach-giay-to/' + vm.index + '/editor/' + item['entryClassPK'] + queryString + 'editForm=true'
        })
      },
      showPDFG (item) {
        let vm = this
        vm.viewAttach = false
        vm.dialogPDFList = true
        vm.dialogPDFLoading = true
        vm.$store.dispatch('viewPDF', item['fileEntryId']).then(function (result) {
          vm.dialogPDFLoading = false
          document.getElementById('pdfViewerListComponent').src = result
        })
      },
      viewFileAttach (detail) {
        let vm = this
        vm.viewAttach = true
        vm.fileEntryIdAttachs = String(detail['fileAttachs']).split(',')
        vm.loading = true
        vm.dialogPDFLoading = true
        vm.$store.dispatch('viewPDF', vm.fileEntryIdAttachs[0]).then(function (result) {
          vm.loading = false
          vm.dialogPDFLoading = false
          vm.dialogPDFList = true
          document.getElementById('pdfViewerListComponent').src = result
        }).catch(function () {
          vm.loading = false
          vm.dialogPDFLoading = false
        })
      },
      showMortgage (detail, index) {
        let vm = this
        vm.deliverableSelected = detail
        vm.indexDeliverableSelected = index
        vm.mortGageInput = detail['mortgageInfo_data'] ? detail['mortgageInfo_data'] : ''
        vm.dialogMortgage = true
      },
      changeMortgageInfo () {
        let vm = this
        var formDataObj
        try {
          formDataObj = JSON.parse(vm.deliverableSelected['formData'])
          formDataObj.mortgageInfo = vm.mortGageInput
        } catch (error) {
          formDataObj = {
            mortgageInfo: vm.mortGageInput
          }
        }
        let filter = {
          deliverableId: vm.deliverableSelected['deliverableId'],
          formData: formDataObj
        }
        vm.loading = true
        vm.$store.dispatch('putFormData', filter).then(function (data) {
          toastr.success('Cập nhật thành công')
          vm.hosoDatas[vm.indexDeliverableSelected]['mortgageInfo_data'] = vm.mortGageInput
          vm.loading = false
          vm.dialogMortgage = false
        }).catch(function() {
          vm.loading = false
          toastr.error('Cập nhật thất bại')
        })
      },
      changePage(page) {
        let vm = this
        let index = Number(page) - 1
        vm.dialogPDFLoading = true
        vm.$store.dispatch('viewPDF', vm.fileEntryIdAttachs[index]).then(function (result) {
          vm.dialogPDFLoading = false
          document.getElementById('pdfViewerListComponent').src = result
        }).catch(function () {
          vm.dialogPDFLoading = false
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
        // console.log('vm.advSearchItems', vm.advSearchItems)
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
      filterDeliverable (type_search) {
        let vm = this
        vm.filterExport = ''
        let current = vm.$router.history.current
        let newQuery = current.query
        if (vm.deliverableKey && !vm.applicantName && !vm.issueDate && !vm.donvicu_data && !vm.trichyeu_data) {
          type_search = 'keyword'
        }
        let searchParams = {}
        // if (vm.applicantName ) {
        //   searchParams.applicantName = vm.applicantName
        // }
        // if (vm.issueDate ) {
        //   searchParams.issueDate = vm.issueDate
        // }
        // if (vm.donvicu_data ) {
        //   searchParams.subject = vm.donvicu_data
        // }
        // if (vm.trichyeu_data ) {
        //   searchParams.deliverableName = String(vm.trichyeu_data).replace(/\n/g, "")
        // }
        // if (vm.deliverableKey ) {
        //   searchParams.deliverableCode = vm.deliverableKey
        // }
        for(let key in vm.filterData){
          if(vm.filterData[key]){
            searchParams[key] = typeof vm.filterData[key] === 'string' ? vm.filterData[key].trim() : vm.filterData[key]
          }
        }
        try {
          let tableConfig = eval('( ' + vm.items[vm.index]['tableConfig'] + ' )')
          if (tableConfig.hasOwnProperty('paramUrl') && tableConfig.paramUrl) {
            searchParams = Object.assign(searchParams, tableConfig.paramUrl)
          }
        } catch (error) {
        }
        
        let filter = {
          typeSearch: type_search ? type_search : '',
          type: vm.items[vm.index]['typeCode'],
          page: newQuery.hasOwnProperty('page') ? newQuery['page'] : 1,
          keyword: newQuery.hasOwnProperty('keyword') ? newQuery['keyword'] : vm.deliverableKey,
          formDataKey: JSON.stringify(searchParams)
        }
        vm.filterExport = filter
        vm.loadingTable = true
        vm.$store.dispatch('searchDeliverables', filter).then(function (result) {
          vm.hosoDatasTotal = result.hasOwnProperty('total') ? result['total'] : 0
          vm.hosoDatas = result.hasOwnProperty('data') ? result['data'] : []
          vm.loadingTable = false
        }).catch(function (reject) {
          vm.loadingTable = false
          vm.hosoDatasTotal = 0
          vm.hosoDatas = []
          console.log(reject)
        })
      },
      doImportData () {
        let vm = this
        vm.$refs.importData.click()
      },
      onFilePicked(event) {
        let vm = this
        let files = event.target.files || event.dataTransfer.files
        if (files && files[0]) {
          vm.loadingImport = true
          let bodyFormData = new FormData()
          bodyFormData.append('file', files[0])
          bodyFormData.append('deliverableTypeCode', vm.items[vm.index]['typeCode'])
          axios({
            method: 'post',
            url: '/o/rest/v2/deliverables/import/files-v3',
            data: bodyFormData,
            config: { headers: {
                'groupId': window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
                'Content-Type': 'multipart/form-data'
              }
            }
          })
          .then(function (response) {
            setTimeout(function () {
              vm.loadingImport = false
              toastr.success('Import giấy phép thành công')
              vm.pullData(vm.items[vm.index]['typeCode'])
            }, 1000)
          })
          .catch(function (response) {
            vm.loadingImport = false
          })
        }
      },
      deleteDeliverable (item) {
        let vm = this
        let param = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId()
          }
        }
        axios.delete('/o/rest/v2/deliverables/' + item.deliverableId, param).then(function () {
          toastr.success('Thực hiện thành công')
          vm.loadingTable = true
          let currentQuery = vm.$router.history.current.query
          let queryString = ''
          for (let key in currentQuery) {
            if (currentQuery[key] !== '' && currentQuery[key] !== 'undefined' && currentQuery[key] !== undefined) {
              queryString += key + '=' + currentQuery[key] + '&'
            }
          }
          queryString += '1=1'
          let filter = {
            type: vm.items[vm.index]['typeCode'],
            page: vm.hosoDatasPage,
            q: queryString,
          }
          try {
            let tableConfig = eval('( ' + vm.items[vm.index]['tableConfig'] + ' )')
            if (tableConfig.hasOwnProperty('paramUrl') && tableConfig.paramUrl) {
              filter = Object.assign(filter, {formDataKey: JSON.stringify(tableConfig.paramUrl)})
            }
          } catch (error) {
          }
          vm.$store.dispatch('getDeliverables', filter).then(function (result) {
            vm.hosoDatasTotal = result['total']
            vm.hosoDatas = result['data']
            vm.loadingTable = false
          }).catch(function (reject) {
            vm.loadingTable = false
          })
        }).catch(function (xhr) {
          toastr.success('Thực hiện thất bại')
        })
      },
      getState (item) {
        let currentDate = (new Date()).getTime()
        let expireDate = Number(item['expireDate'])
        if (expireDate < currentDate) {
          return 'Hết hiệu lực'
        } else {
          let state = String(item['deliverableState'])
          if (state === '0') {
            return 'Không xác định'
          } else if (state === '1') {
            return 'Đang hiệu lực'
          } else if (state === '2') {
            return 'Gia hạn'
          } else if (state === '4') {
            return 'Xóa - Thu hồi'
          }
        }
      },
      getUser (roleItem) {
        let vm = this
        let roles = vm.$store.getters.getUser.role
        if (!roles) {
          return false
        }
        let roleExits = roles.findIndex(item => String(item).indexOf(roleItem) >= 0)
        return (roleExits >= 0)
      },
      changeIssueDate (key) {
        let vm = this
        vm.menuDate = false
        vm.issueDate = vm.formatDate(vm.issueDatePiecker)
        if(key){
          vm.filterData[key] = vm.formatDate(vm.issueDatePiecker)
        }
      },
      formatDate(date) {
        if (!date) return null
        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      parseDate(date) {
        if (!date) return null
        const [day, month, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      reloadPickerChange(key){
        console.log(key)
      },
      changeDate(event, key){
        console.log(event)
        // let date = new Date(event)
        // const [year, month, day] = date.toISOString().substr(0, 10).split('-')
        this.filterData[key] = event
      },
      async fetchDataExcel(){
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
          type: vm.items[vm.index]['typeCode'],
          page: vm.hosoDatasPage,
          q: queryString,
          getAll: true
        }
        const data = await vm.$store.dispatch('getDeliverables', filter)
        console.log(data.data)
        return data.data
      },
      exportTracking () {
        let vm = this
        vm.loadingImport = true
        vm.filterExport = Object.assign(vm.filterExport, {export: true})
        vm.$store.dispatch('searchDeliverables', vm.filterExport).then(function (result) {
          vm.loadingImport = false
          let data = result.data
          let dataExport = []
          console.log('headerExport', vm.headerExportRemoveAction)
          console.log('json_fields', vm.json_fields)
          for (let i=0;i<data.length;i++) {
            let item = {}
            let indexFields = 0
            for (let key in vm.json_fields) {
              let valueTemplate
              if (vm.headerExportRemoveAction[indexFields].hasOwnProperty('layoutViewExport') && vm.headerExportRemoveAction[indexFields].layoutViewExport) {
                let str = vm.headerExportRemoveAction[indexFields]['layoutViewExport'].replace('itemData', JSON.stringify(data[i]))
                valueTemplate = eval(str)
              }
              item[key]=valueTemplate ? valueTemplate : data[i][vm.json_fields[key]]
              if (vm.headerExportRemoveAction[indexFields]['value'] === 'counter') {
                item[key] = i + 1
              }
              indexFields += 1
            }
            console.log(item)
            dataExport.push(item)
          }
          vm.json_data = dataExport
          console.log(vm.json_data)
          setTimeout(() => {
            $('.btn-export').click()
          }, 100)
        }).catch(function (reject) {
          vm.loadingImport = false
        })
      },
      downloadBieuMau (string) {
        //const url = window.URL.createObjectURL(new Blob([response.data]))
        console.log(string)
        const link = document.createElement('a')
        link.href = string
        
        // link.setAttribute('download', 'file.png') //or any other extension
        document.body.appendChild(link)
        link.click()
      },
      currency (value) {
        if (value) {
          return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        }
        return ''
      }
    }
  }
</script>
