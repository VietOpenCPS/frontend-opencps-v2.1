<template>
<v-form ref="form" v-model="valid" lazy-validation>
  <div class="form-chitiet">
    <div v-if="itemsReports && itemsReports.length > 0">
      <div class="row-header" v-if="!hiddenAside">
        <div class="background-triangle-big"> <span>{{nameReport}}</span> </div>
        <div class="layout row wrap header_tools row-blue">
          <div class="flex xs12 pl-3 text-ellipsis text-bold">
            <v-layout wrap class="chart__report">
              <v-flex class="px-2 text-right">
                <v-select v-if="buttonsShow"
                  v-for="(button, btnIndex) in buttons" v-bind:key="btnIndex"
                  :items="button['source']"
                  :label="button['label']"
                  v-model="buttonsVal"
                  item-text="name"
                  item-value="value"
                  single-line
                  style="float: right"
                  class="btn__chot"
                  @change="doChotSoLieu($event, button)"
                ></v-select>
                <v-btn flat class="mx-0 my-0" v-if="customize" v-on:click.native="showConfigColumnPdf">
                  <v-icon v-if="showConfig">reply</v-icon>
                  <v-icon v-else>settings</v-icon> &nbsp;
                  <span v-if="showConfig">Quay lại</span>
                  <span v-else>Tùy chọn</span>
                </v-btn>
              </v-flex>
            </v-layout>
          </div>
        </div>
      </div>
      <v-layout row wrap class="filter_menu mt-4">
        <v-flex xs6 sm3 class="px-3 mb-3" v-if="agencyLists.length > 1">
          <v-autocomplete
            :items="agencyLists"
            v-model="govAgency"
            label="Chọn đơn vị"
            item-text="text"
            item-value="value"
            @change="changeGovAgency()"
            clearable
            >
          </v-autocomplete>
        </v-flex>  
        <!--  -->
        <v-flex xs6 sm3 class="px-3 mb-3" v-for="(item, indexgroupIdList) in groupIdList" v-bind:key="item.key + indexgroupIdList + index">
          <v-autocomplete
            :items="item.value"
            :label="item.label"
            v-model="filterGroup[item.key]" 
            item-text="text"
            item-value="value"
            @change="changeGroupIdList(item)"
            clearable
            >
          </v-autocomplete>
        </v-flex>
        <!--  -->
        <v-flex xs6 sm6 class="px-3 mb-3" v-if="groupBy.length > 1">
          <v-autocomplete
            :items="groupBy"
            v-model="groupByVal"
            label="Nhóm dữ liệu"
            item-text="label"
            item-value="key"
            >
          </v-autocomplete>
        </v-flex>
        <v-flex :class="item.hasOwnProperty('class') ? item.class : 'xs12 sm3 px-3 mb-3'" v-for="(item, indexTool) in filters" v-bind:key="indexTool">
          <datetime-picker
            v-if="item['type'] === 'date' && showPicker"
            v-model="data[item.key]" 
            :item="item" 
            :data-value="data[item.key]"
            :data-all="data"
            @change="reloadPickerChange(item.key)">
            
          </datetime-picker>
          <v-text-field 
            v-if="item['type'] === 'text'"
            v-model="data[item.key]" 
            :label="item['label']">
          </v-text-field>
          <v-autocomplete
            v-if="item['type'] === 'select' && item.hasOwnProperty('multiple') && item.multiple"
            :items="item['source']"
            v-model="data[item.key]"
            :label="item['label']"
            item-value="value"
            item-text="name"
            :clearable="item['clearable']"
            :multiple="item.hasOwnProperty('multiple') && item.multiple"
            @change="item.hasOwnProperty('parent') ? changeMapping(item) : ''"
          >
            <!-- <template slot="selection" slot-scope="props" >
              <v-chip v-if="props.index === 0">
                <span>{{ props.item.name }}</span>
              </v-chip>
              <span
                v-if="props.index === 1"
                class="grey--text caption"
              >(+{{ data[item.key].length - 1 }})</span>
            </template> -->
          </v-autocomplete>
          <v-autocomplete
            v-if="item['type'] === 'select' && !item.hasOwnProperty('multiple') && !item.multiple"
            :items="item['source']"
            v-model="data[item.key]"
            :label="item['label']"
            item-value="value"
            item-text="name"
            :clearable="item['clearable']"
            @change="item.hasOwnProperty('parent') ? changeMapping(item) : ''"
          >
          </v-autocomplete>
        </v-flex>
        <v-flex xs12 class="px-3 mb-3">
          <div class="d-inline-block left" v-if="!itemsReports[index]['filterConfig']['version'] && !itemsReports[index]['filterConfig']['backendVer2']">
            <v-btn dark color="blue darken-3" v-on:click.native="doCreateReport(false)"> 
              <v-icon>library_books</v-icon> &nbsp; Tạo báo cáo
            </v-btn>
            <v-btn v-if="isRender && itemsReports[index]['filterConfig']['showTable']" dark color="blue darken-3" class="mx-3 my-0" v-on:click.native="printReport()">
              <v-icon>print</v-icon> &nbsp; In báo cáo
            </v-btn>
            <v-btn v-if="!itemsReports[index]['filterConfig']['showTable']" dark color="blue darken-3" class="mx-3 my-0" v-on:click.native="itemsReports[index]['filterConfig']['version'] ? downloadExcel() : doCreateReport(true)">
              <v-icon size="16px">fas fa fa-file-excel-o</v-icon> &nbsp; Tải xuống Excel
            </v-btn>
            <v-btn v-if="!itemsReports[index]['filterConfig']['showTable'] && exportWordReport" dark color="blue darken-3" class="my-0" v-on:click.native="doCreateReport(true, 'word')">
              <v-icon size="16px">fas fa fa-file-word-o</v-icon> &nbsp; Tải xuống Word
            </v-btn>
            <v-btn v-if="isRender && itemsReports[index]['filterConfig']['showTable']" dark color="blue darken-3" class="mx-3 my-0" v-on:click.native="downloadExcel()">
              <v-icon>save_alt</v-icon> &nbsp; Tải xuống Excel
            </v-btn>
            <v-btn v-if="exportXML" dark v-on:click.native="doDynamicReportXML" color="blue darken-3">exportXML</v-btn>
          </div>
          <div class="d-inline-block left" v-if="itemsReports[index]['filterConfig']['version'] || itemsReports[index]['filterConfig']['backendVer2']">
            <v-btn dark color="blue darken-3" v-on:click.native="createReport()"> 
              <v-icon>library_books</v-icon> &nbsp; Tạo báo cáo
            </v-btn>
          </div>
        </v-flex>
      </v-layout>
      <!-- table báo cáo số liệu tổng hợp -->
      <div class="mx-3" v-if="!isShowLoading && itemsReports[index]['filterConfig']['version']">
        <div class="mb-2" v-if="listTongHop && listTongHop.length > 0" style="font-weight: 500;font-size: 14px;">
          <span style="color: green">Tổng số hồ sơ: </span> <span style="color: red">{{totalCount}}</span>
        </div>
        <v-data-table
          :headers="headerTongHop"
          :items="listTongHop"
          hide-actions
          class="table-landing table-bordered"
          style="border-left: 1px solid #dedede;"
          no-data-text="Không có hồ sơ nào"
        >
          <template slot="items" slot-scope="props">
            <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;">
              <td class="text-xs-left pt-2" style="min-width: 135px;" @click="viewListHoSo(props.item, 'first')" title="Xem danh sách">
                <content-placeholders v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span v-if="props.item.hasOwnProperty('domainName')">{{props.item.domainName}}</span>
                  <span v-if="props.item.hasOwnProperty('serviceName')">{{props.item.serviceName}}</span>
                  <span v-if="props.item.hasOwnProperty('govAgencyName')">{{props.item.govAgencyName}}</span>
                </div>
              </td>
              <td class="text-xs-center pt-2" @click="viewListHoSo(props.item, 'first')" title="Xem danh sách">
                <content-placeholders v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <a style="font-weight: bold; color: #008000c7;text-decoration: underline;">
                    <span>{{props.item.count ? props.item.count : props.item.totalCount}}</span>
                  </a>
                </div>
              </td>
              <td class="text-xs-left">
                <content-placeholders v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <v-menu v-for="n in props.item.pages" :key="n" bottom offset-y style="display: inline-block;position:relative !important">
                    <v-btn small slot="activator" class="on-hover-btn my-1" color="primary" dark style="font-size: 13px !important"> 
                      Quyển {{n}} &nbsp; <v-icon size="18">arrow_drop_down</v-icon>
                    </v-btn>
                    <v-list>
                      <v-list-tile @click="printPdf(props.item ,n)">
                        <v-list-tile-title>
                          <v-icon class="mr-1" color="blue" size="16">
                            print
                          </v-icon>
                          In báo cáo
                        </v-list-tile-title>
                      </v-list-tile>
                      <v-list-tile @click="downloadExcel(props.item, n)">
                        <v-list-tile-title>
                          <v-icon class="mx-1" color="green" size="14">
                            fas fa fa-file-excel-o
                          </v-icon>
                          Tải excel
                        </v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
      <!-- table bao cao -->
      <div>
        <div v-if="!itemsReports[index]['filterConfig']['showTable'] && !showHTML && !itemsReports[index]['filterConfig']['version']">
          <vue-friendly-iframe v-if="showGuilds" :src="'/documents/' + groupId + '/0/hdsd.pdf'"></vue-friendly-iframe>
          <vue-friendly-iframe v-if="pdfBlob !== null && pdfBlob !== undefined && pdfBlob !== '' && !showGuilds" :src="pdfBlob"></vue-friendly-iframe>
        </div>
        <div v-if="itemsReports[index]['filterConfig']['showTable'] && isRender && !showErrorData && !isShowLoading">
          <v-data-table
            :headers="headers"
            :items="dossierList"
            :pagination.sync="pagination"
            hide-actions
            class="table-landing table-bordered"
          >
            <template slot="items" slot-scope="props">
              <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;" @click="viewDetail(props.item)">
                <td class="text-xs-center">
                  <content-placeholders v-if="loading">
                    <content-placeholders-text :lines="1" />
                  </content-placeholders>
                  <div v-else>
                    <span>{{pagination.page * pagination.rowsPerPage - pagination.rowsPerPage + props.index + 1}}</span><br>
                  </div>
                </td>
                <td class="text-xs-left" style="min-width: 135px;">
                  <content-placeholders v-if="loading">
                    <content-placeholders-text :lines="1" />
                  </content-placeholders>
                  <div v-else>
                    <span>{{props.item.dossierNo}}</span>
                  </div>
                </td>
                <td class="text-xs-left">
                  <content-placeholders v-if="loading">
                    <content-placeholders-text :lines="1" />
                  </content-placeholders>
                  <div v-else>
                    <span>{{props.item.dossierName}}</span>
                  </div>
                </td>
                <td class="text-xs-left" style="min-width: 135px">
                  <content-placeholders v-if="loading">
                    <content-placeholders-text :lines="1" />
                  </content-placeholders>
                  <div v-else>
                    <span>
                      <span>{{props.item.applicantName}}</span>
                    </span>
                  </div>
                </td>
                <td class="text-xs-center">
                  <content-placeholders v-if="loading">
                    <content-placeholders-text :lines="1" />
                  </content-placeholders>
                  <div v-else>
                    <span>
                      <span>{{props.item.receiveDate}}</span>
                    </span>
                  </div>
                </td>
                <td class="text-xs-center">
                  <content-placeholders v-if="loading">
                    <content-placeholders-text :lines="1" />
                  </content-placeholders>
                  <div v-else>
                    <span>
                      <span>{{props.item.dueDate}}</span>
                    </span>
                  </div>
                </td>
                <td class="text-xs-left">
                  <content-placeholders v-if="loading">
                    <content-placeholders-text :lines="1" />
                  </content-placeholders>
                  <div v-else>
                    <span>
                      <span>{{props.item.dossierStatusText}}</span>
                    </span>
                  </div>
                </td>
                <td class="text-xs-left">
                  <content-placeholders v-if="loading">
                    <content-placeholders-text :lines="1" />
                  </content-placeholders>
                  <div v-else>
                    <span>
                      <span>{{props.item.dossierOverdue}}</span>
                    </span>
                  </div>
                </td>
              </tr>
            </template>
          </v-data-table>
          <div class="text-xs-right layout wrap mt-2" style="position: relative;">
            <div class="flex pagging-table px-2"> 
              <tiny-pagination :total="pagination.totalItems" :page="pagination.page" custom-class="custom-tiny-class" 
                @tiny:change-page="paggingData" ></tiny-pagination> 
            </div>
          </div>
        </div>
        <!--  -->
        <v-layout wrap v-if="reportType.startsWith('DANH_GIA_CAN_BO')">
          <v-flex xs12 class="report__table" style="overflow:auto;max-height: 1000px" v-if="!showErrorData && dataTableVottingList.length > 0">
            <table class="my-2" hide-default-footer>
              <thead>
                <tr>
                  <th rowspan="2" class="text-center px-2 py-1">
                    <span>STT</span>
                  </th>
                  <th rowspan="2" class="text-center px-2 py-1">
                    <span>Tên đơn vị</span>
                  </th>
                  <!-- <th width="80" rowspan="3" class="text-center px-2 py-1">
                    <span>Số lượt đánh giá</span>
                  </th> -->
                  <th class="py-1" v-for="(item, index) in dataTableVottingList[0]['employees'][0]['voting']" v-bind:key="index" :colspan="dataTableVottingList[0]['employees'][0]['voting'][index]['selected'].length">
                    <span>{{item.question}}</span>
                  </th>
                </tr>

                <tr>
                  <th v-for="(item, index) in listAnswers" v-bind:key="index" width="" class="text-center px-2 py-1">
                    <span>{{item}}</span>
                  </th>
                </tr>
              </thead>
              <tbody v-if="loadingTable">
                <content-placeholders class="my-2">
                  <content-placeholders-text :lines="5" />
                </content-placeholders>
              </tbody>
              <tbody v-if="!loadingTable && dataTableVottingList.length > 0">
                <tr v-for="(item,index) in dataTableRender" :key="index">
                  <td align="center" :class="item.hasOwnProperty('group') ? 'px-2 text-bold py-1' : 'px-2 py-1'">{{item.hasOwnProperty('group') ? item.group : item.child}}</td>
                  <td align="left" :class="item.hasOwnProperty('group') ? 'px-2 text-bold py-1' : 'px-2 py-1'" style="padding: 8px 10px;"
                    :colspan="item.hasOwnProperty('group') ? columnLength - 1 : ''"
                  >
                    {{item.name}}
                  </td>
                  <!-- <td align="center" class="px-2 py-1" v-if="!item.hasOwnProperty('group')">{{item.total}}</td> -->
                  <!-- <td align="center"  class="px-2" v-for="(item1,index1) in (columnLength - 3)" :key="index1"
                    v-if="item.hasOwnProperty('group')"
                  >
                    
                  </td> -->
                  <td align="center"  class="px-2 py-1" v-for="(item1,index1) in item['data']" :key="index1"
                    v-if="!item.hasOwnProperty('group')"
                  >
                    {{item1}}
                  </td>
                  
                </tr>
              </tbody>
            </table>
          </v-flex>
        </v-layout>
        <!--  -->
        <div class="mx-3 my-4" v-if="showErrorData">
          <v-alert :value="true" outline color="info" icon="info">
            Không có dữ liệu báo cáo.
          </v-alert>
        </div>
        <v-layout row wrap v-if="isShowLoading">
          <v-flex xs12 class="text-xs-center" mt-5>
            <v-progress-circular
              :size="100"
              :width="1"
              color="primary"
              indeterminate
            ></v-progress-circular>
          </v-flex>
        </v-layout>
      </div>
    </div>
    <!-- danh sách hồ sơ -->
    <v-dialog v-model="dialogDossierList" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Danh sách hồ sơ</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogDossierList = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card class="py-0 px-0">
          <v-layout row wrap v-if="loadingGetDossier">
            <v-flex xs12 class="text-xs-center" mt-5>
              <v-progress-circular
                :size="100"
                :width="1"
                color="primary"
                indeterminate
              ></v-progress-circular>
            </v-flex>
          </v-layout>
          <div v-else>
            <v-data-table
              :headers="headers"
              :items="dossierList"
              hide-actions
              class="table-landing table-bordered"
            >
              <template slot="items" slot-scope="props">
                <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;" @click="viewDetail(props.item)">
                  <td class="text-xs-center">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <span>{{pagination.page * pagination.rowsPerPage - pagination.rowsPerPage + props.index + 1}}</span><br>
                    </div>
                  </td>
                  <td class="text-xs-left" style="min-width: 135px;">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <span>{{props.item.dossierNo}}</span>
                    </div>
                  </td>
                  <td class="text-xs-left" style="min-width: 135px">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <span>
                        <span>{{props.item.applicantName}}</span>
                      </span>
                    </div>
                  </td>
                  <td class="text-xs-center">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <span>
                        <span>{{props.item.receiveDate}}</span>
                      </span>
                    </div>
                  </td>
                  <td class="text-xs-center">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <span>
                        <span>{{props.item.dueDate}}</span>
                      </span>
                    </div>
                  </td>
                  <td class="text-xs-left">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <span>
                        <span>{{props.item.dossierStatusText}}</span>
                      </span>
                    </div>
                  </td>
                </tr>
              </template>
            </v-data-table>
            <div class="text-xs-right layout wrap mt-2" style="position: relative;">
              <div class="flex pagging-table px-2"> 
                <tiny-pagination :total="pagination.totalItems" :page="pagination.page" custom-class="custom-tiny-class" 
                  @tiny:change-page="paggingData" ></tiny-pagination> 
              </div>
            </div>
          </div>
        </v-card>
      </v-card>
    </v-dialog>
    <!-- thong tin ho so -->
    <v-dialog v-model="dialogDossierDetail" max-width="1200" transition="fade-transition">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Thông tin hồ sơ</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogDossierDetail = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="py-0 px-0">
          <thong-tin-ho-so :detailDossier="dossierInfo"></thong-tin-ho-so>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- dialog pdf -->
    <v-dialog v-model="dialogPDF" max-width="1200" transition="fade-transition">
      <v-card style="min-height: calc(90vh - 100px)">
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Báo cáo thống kê</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogPDF = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text v-if="loadingPdfVer2">
          <v-flex xs12 class="text-xs-center" style="margin-top: 150px">
            <v-progress-circular
              :size="100"
              :width="1"
              color="primary"
              indeterminate
            ></v-progress-circular>
          </v-flex>
        </v-card-text>
        <!-- <iframe v-else id="dialogPDFVer2" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 600px;" frameborder="0">
        </iframe> -->
        <vue-friendly-iframe v-else :src="pdfBlob"></vue-friendly-iframe>
      </v-card>
    </v-dialog>
    <!--  -->
    <v-dialog v-model="dialogConfigColumn" max-width="900" transition="fade-transition" >
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Cột hiển thị bảng thống kê, báo cáo</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogConfigColumn = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card class="py-0 px-0">
          <v-layout align-start justify-start row wrap class="filter_menu my-3 px-4">
            <v-flex class="mx-2" v-for="(item, index) in itemsReportsConfig" v-bind:key="index">
              <v-checkbox v-if="!reportType.startsWith('STATISTIC')" @change="changeConfig(index)" :label="item.text" v-model="item.selected"></v-checkbox>
            </v-flex>
          </v-layout>
        </v-card>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-3" color="primary" @click.native="dialogConfigColumn = false">
            <v-icon>save</v-icon> &nbsp;
            Đồng ý
          </v-btn>
      </v-card>
    </v-dialog>
    <!--  -->
  </div>
</v-form>
</template>

<script>
import axios from 'axios'
import VueFriendlyIframe from 'vue-friendly-iframe'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
pdfMake.vfs = pdfFonts.pdfMake.vfs
import DatetimePicker from './DatetimePicker.vue'
import CsvDownload from './CsvDownload.vue'
import { toXML } from 'jstoxml'
import TinyPagination from './Pagination.vue'
import ThongTinHoSo from './ThongTinHoSo.vue'
const jsonMapper = require('json-mapper-json')
var FileSaver = require('file-saver-fixed')

export default {
  props: ['index'],
  components: {
    'vue-friendly-iframe': VueFriendlyIframe,
    DatetimePicker,
    'vue-csv-downloader': CsvDownload,
    'tiny-pagination': TinyPagination,
    'thong-tin-ho-so': ThongTinHoSo
  },
  data: () => ({
    dialogConfigColumn: false,
    showHTML: false,
    columnLength: 0,
    listAnswers: [],
    dataTableRender: [],
    dataTableVottingList: [],
    hiddenAside: false,
    groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
    doExportExcel: false,
    doExportWord: false,
    exportWordReport: false,
    showGuilds: false,
    showPicker: true,
    showErrorData: false,
    showCSVDownload: false,
    csvExport: [],
    fields: [],
    valid: false,
    api: '',
    proxyApi: '',
    onlines: [],
    online: '',
    itemsReportsConfig: [],
    report1Def: {},
    docDefinition: {},
    isDVC: false,
    isCallBack: true,
    fromDate: null,
    fromDateShow: false,
    menufromDate: false,
    fromDateFormatted: null,
    toDate: null,
    toDateShow: false,
    menutoDate: false,
    toDateMin: null,
    toDateFormatted: null,
    danhSachBaoCaos: [],
    years: [],
    year: (new Date()).getFullYear() + '',
    months: [],
    month: 0,
    agencyLists: [],
    govAgency: 0,
    danhSachBaoCao: [],
    pdfBlob: null,
    isShowLoading: false,
    loadingPdfVer2: false,
    isCallData: false,
    nameReport: '',
    showConfig: false,
    filters: [],
    data: '',
    customize: false,
    groupBy: [],
    groupByVal: '',
    groupByValObj: '',
    dataReportXX: '',
    buttons: [],
    buttonsVal: '',
    buttonsShow: false,
    noHeader: true,
    exportXML: false,
    jsonMapperJson: {},
    userData: '',
    bookList: [],
    totalCount: 0,
    listTongHop: [],
    headerTongHop: [
      {
        text: 'Lĩnh vực',
        align: 'center',
        sortable: false
      },
      {
        text: 'Số lượng hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'In danh sách/ tải danh sách excel',
        align: 'center',
        sortable: false
      }
    ],
    headers: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Mã hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Chủ hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Ngày tiếp nhận',
        align: 'center',
        sortable: false
      },
      {
        text: 'Ngày hẹn trả',
        align: 'center',
        sortable: false
      },
      {
        text: 'Trạng thái',
        align: 'center',
        sortable: false
      }
    ],
    pagination: {
      page: 1,
      rowsPerPage: 20,
      totalItems: 0
    },
    sttQuyen: 1,
    targetFilter: '',
    tableType: '',
    dossierList: [],
    currentLimit: 100,
    dossierInfo: '',
    dialogDossierList: false,
    dialogDossierDetail: false,
    dialogPDF: false,
    dialogPDFLoading: false,
    isRender: false,
    dataExportExcel: '',
    groupIdList: [],
    filterGroup: {},
    groupIdListSelected: '',
    dataBodyHTML: [],
    dataRowRenderHtmlTable: [],
    headerRenderHtmlTable: [],
    widthRenderHtmlTable: [],
    statisticVotingDossiers: false,
    loadingGetDossier: false
  }),
  computed: {
    itemsReports () {
      return this.$store.getters.itemsReports
    },
    reportConfigStatic () {
      return this.$store.getters.reportConfigStatic
    },
    selected: {
      // getter
      get: function() {
        return this.$store.getters.selected
      },
      // setter
      set: function(newValue) {
        this.$store.commit('setselected', newValue)
      }
    },
    reportType: {
      // getter
      get: function() {
        return this.$store.getters.reportType
      },
      // setter
      set: function(newValue) {
        this.$store.commit('setreportType', newValue)
      }
    },
    groupType: {
      // getter
      get: function() {
        return this.$store.getters.groupType
      },
      // setter
      set: function(newValue) {
        this.$store.commit('setgroupType', newValue)
      }
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      console.log('run new ver_23')
      try {
        vm.exportWordReport = exportWordReport
      } catch (error) {
      }
      let query = vm.$router.history.current.query
      let param = {
        headers: {
          groupId: window.themeDisplay.getScopeGroupId()
        },
        params: {
        }
      }
      axios.get('/o/v1/opencps/users/' + window.themeDisplay.getUserId(), param).then(function(response) {
        vm.userData = response.data
      }).catch(function(error) {
      })
      if (query.hasOwnProperty('doreport')) {
        vm.hiddenAside = true
      } else {
        vm.hiddenAside = false
      }
      setTimeout(() => {
        vm.showErrorData = false
        vm.showCSVDownload = false
        vm.agencyLists = []
        vm.api = ''
        vm.proxyApi = ''
        vm.filters = []
        vm.customize = false
        vm.data = {}
        vm.groupBy = []
        vm.itemsReportsConfig = []
        vm.dataReportXX = ''
        vm.buttons = []
        vm.buttonsVal = ''
        vm.buttonsShow = false
        vm.exportXML = false
        if (vm.itemsReports[vm.index]) {
          vm.nameReport = vm.itemsReports[vm.index]['reportName']
          if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('reportConfig')) {
            vm.itemsReportsConfig = vm.itemsReports[vm.index]['filterConfig']['reportConfig']
          }
          if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('customize')) {
            vm.customize = vm.itemsReports[vm.index]['filterConfig']['customize']
          }
          if (vm.itemsReports[vm.index]['reportCode'].indexOf('REGISTER') >= 0 || vm.itemsReports[vm.index]['reportCode'].indexOf('STATISTIC') >= 0) {
            vm.customize = false
          }
          if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('autoHeader')) {
            vm.noHeader = vm.itemsReports[vm.index]['filterConfig']['autoHeader']
          }
          if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('groupBy')) {
            vm.groupBy = vm.itemsReports[vm.index]['filterConfig']['groupBy']
            let defaultValGroup = vm.groupBy[0]['key']
            for (let keyGroup in vm.groupBy) {
              if (vm.groupBy[keyGroup]['selected']) {
                defaultValGroup = vm.groupBy[keyGroup]['key']
                break
              }
            }
            vm.groupByVal = defaultValGroup
          }
          if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('groupIds')) {
            // set list filter
            if(vm.itemsReports[vm.index]['filterConfig']['showTable']){
              vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['groupIdsAdmin']
            } else {
              vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['groupIds']
            }
            
            if (vm.agencyLists.length > 0) {
              let defaultVal = vm.agencyLists[0]['value']
              for (let key in vm.agencyLists) {
                if (vm.agencyLists[key]['selected']) {
                  defaultVal = vm.agencyLists[key]['value']
                  break
                }
              }
              if (query.hasOwnProperty('groupId') && query['groupId']) {
              vm.govAgency = Number(query['groupId'])
              } else {
                vm.govAgency = defaultVal
              }
            } else {
              vm.govAgency = 'site'
            }
          } else {
            vm.govAgency = 'site'
          }
          if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('api')) {
            vm.api = vm.itemsReports[vm.index]['filterConfig']['api']
          }
          if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('proxyApi')) {
            vm.proxyApi = vm.itemsReports[vm.index]['filterConfig']['proxyApi']
          }
          if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('filters')) {
            vm.filters = vm.itemsReports[vm.index]['filterConfig']['filters']
            // 
            if (vm.itemsReports[vm.index]['filterConfig']['version'] && !vm.itemsReports[vm.index]['filterConfig']['chonDonViGroupBy']) {
              if (vm.groupByVal === 'domainCode') {
                vm.filters = vm.filters.filter(function (item) {
                  return item.key !== 'serviceCode' && item.key !== 'govAgencyCode'
                })
              }
              if (vm.groupByVal === 'serviceCode') {
                vm.filters = vm.filters.filter(function (item) {
                  return item.key !== 'domainCode' && item.key !== 'govAgencyCode'
                })
              }
            }
          }
          // 
          if(vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('groupIdList')) {
            vm.groupIdList = vm.itemsReports[vm.index]['filterConfig']['groupIdList']
          } else {
            vm.groupIdList = []
          }
          // 
          for (let key in vm.filters) {
            if (vm.filters[key]['type'] === 'select' || vm.filters[key]['type'] === 'date') {
              // if (vm.filters[key]['type'] === 'select' && vm.filters[key].hasOwnProperty('multiple') && vm.filters[key].multiple) {
              //   vm.data[vm.filters[key]['key']] = vm.filters[key] && vm.filters[key]['value'] ? vm.filters[key]['value'].toString() : ''
              // } else {
                vm.data[vm.filters[key]['key']] = vm.filters[key]['value']
              // }
              
              if (vm.filters[key]['type'] === 'date' && query.hasOwnProperty(vm.filters[key]['key']) && query[vm.filters[key]['key']]) {
                vm.data[vm.filters[key]['key']] = query[vm.filters[key]['key']]
              }
            }
            if (vm.filters[key]['type'] === 'select' && vm.filters[key].hasOwnProperty('api') && vm.filters[key]['api']) {
              vm.filters[key]['groupId'] = vm.govAgency
              if (!vm.filters[key]['source'] || vm.filters[key]['source'].length === 0) {
                vm.$store.dispatch('loadDataSource', vm.filters[key]).then(function(result) {
                  vm.filters[key]['source'] = result
                  if (vm.filters[key]['appendItem']) {
                    vm.filters[key]['source'] = vm.filters[key]['appendItem'].concat(result)
                  }
                }).catch(function(){})
              }
            }
          }
          if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('buttons')) {
            vm.buttons = vm.itemsReports[vm.index]['filterConfig']['buttons']
            if (vm.buttons.length > 0) {
              setTimeout(() => {
                vm.buttonsShow = true
              }, 100)
            }
          }
          if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('exportXML')) {
            vm.exportXML = vm.itemsReports[vm.index]['filterConfig']['exportXML']
          }
          vm.report1Def = {}
          for (let key in vm.itemsReportsConfig) {
            vm.report1Def[vm.itemsReportsConfig[key]['value']] = vm.itemsReportsConfig[key]['text']
          }
          vm.reportType = vm.itemsReports[vm.index]['document']
          if (vm.showConfig) {
            vm.showConfig = false
            setTimeout(() => {
              vm.showConfig = true
            }, 200)
          }
          vm.pdfBlob = ''
        }
        if (query.hasOwnProperty('doreport')) {
          vm.doCreateReport(false)
        }
      }, 1000)
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      vm.listTongHop = []
      vm.totalCount = 0
      vm.showHTML = false
      vm.showErrorData = false
      vm.showCSVDownload = false
      vm.itemsReportsConfig = []
      vm.groupBy = []
      vm.customize = false
      vm.data = {}
      vm.api = ''
      vm.proxyApi = ''
      vm.filters = []
      vm.report1Def = {}
      vm.dataReportXX = ''
      vm.buttons = []
      vm.buttonsVal = ''
      vm.buttonsShow = false
      vm.exportXML = false
      vm.nameReport = vm.itemsReports[vm.index] ? vm.itemsReports[vm.index]['reportName'] : ''
      if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('reportConfig')) {
        vm.itemsReportsConfig = vm.itemsReports[vm.index]['filterConfig']['reportConfig']
      }
      if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('customize')) {
        vm.customize = vm.itemsReports[vm.index]['filterConfig']['customize']
      }
      if (vm.itemsReports[vm.index]['reportCode'].indexOf('REGISTER') >= 0 || vm.itemsReports[vm.index]['reportCode'].indexOf('STATISTIC') >= 0) {
        vm.customize = false
      }
      // bug unsupported number: NaN
      if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('autoHeader')) {
        vm.noHeader = vm.itemsReports[vm.index]['filterConfig']['autoHeader']
      } else {
        vm.noHeader = true
      }
      // 
      if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('groupBy')) {
        vm.groupBy = vm.itemsReports[vm.index]['filterConfig']['groupBy']
        let defaultValGroup = vm.groupBy[0]['key']
        for (let keyGroup in vm.groupBy) {
          if (vm.groupBy[keyGroup]['selected']) {
            defaultValGroup = vm.groupBy[keyGroup]['key']
            break
          }
        }
        vm.groupByVal = defaultValGroup
      }
      if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('groupIds')) {
        // set list filter
        if(vm.itemsReports[vm.index]['filterConfig']['showTable']){
          vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['groupIdsAdmin']
        } else {
          vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['groupIds']
        }
        if (vm.agencyLists.length > 0) {
          let defaultVal = vm.agencyLists[0]['value']
          for (let key in vm.agencyLists) {
            if (vm.agencyLists[key]['selected']) {
              defaultVal = vm.agencyLists[key]['value']
              break
            }
          }
          vm.govAgency = defaultVal
        } else {
          vm.govAgency = 'site'
        }
      } else {
        vm.govAgency = 'site'
      }
      if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('api')) {
        vm.api = vm.itemsReports[vm.index]['filterConfig']['api']
      }
      if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('proxyApi')) {
        vm.proxyApi = vm.itemsReports[vm.index]['filterConfig']['proxyApi']
      }
      if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('filters')) {
        vm.filters = vm.itemsReports[vm.index]['filterConfig']['filters']
        if (vm.itemsReports[vm.index]['filterConfig']['version'] && !vm.itemsReports[vm.index]['filterConfig']['chonDonViGroupBy']) {
          if (vm.groupByVal === 'domainCode') {
            vm.filters = vm.filters.filter(function (item) {
              return item.key !== 'serviceCode' && item.key !== 'govAgencyCode'
            })
          }
          if (vm.groupByVal === 'serviceCode') {
            vm.filters = vm.filters.filter(function (item) {
              return item.key !== 'domainCode' && item.key !== 'govAgencyCode'
            })
          }
        }
      }
      // 
      if(vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('groupIdList')) {
        // console.log('groupIdList', vm.itemsReports[vm.index]['filterConfig']['groupIdList'])
        vm.groupIdList = vm.itemsReports[vm.index]['filterConfig']['groupIdList']
      } else {
        vm.groupIdList = []
        // console.log('groupIdList0',vm.groupIdList)
      }
      for(let i in vm.filterGroup){
        vm.filterGroup[i] = null
      }
      // 
      for (let key in vm.itemsReportsConfig) {
        vm.report1Def[vm.itemsReportsConfig[key]['value']] = vm.itemsReportsConfig[key]['text']
      }
      vm.reportType = vm.itemsReports[vm.index]['document']
      vm.pdfBlob = ''
      for (let key in vm.filters) {
        if (vm.filters[key]['type'] === 'select' || vm.filters[key]['type'] === 'date') {
          // if (vm.filters[key]['type'] === 'select' && vm.filters[key].hasOwnProperty('multiple') && vm.filters[key].multiple) {
          //   vm.data[vm.filters[key]['key']] = vm.filters[key] && vm.filters[key]['value'] ? vm.filters[key]['value'].toString() : ''
          // } else {
            vm.data[vm.filters[key]['key']] = vm.filters[key]['value']
          // }
          
        }
        if (vm.filters[key]['type'] === 'select' && vm.filters[key].hasOwnProperty('api') && vm.filters[key]['api']) {
          vm.filters[key]['groupId'] = vm.govAgency
          if (!vm.filters[key]['source'] || vm.filters[key]['source'].length === 0) {
            vm.$store.dispatch('loadDataSource', vm.filters[key]).then(function(result) {
              vm.filters[key]['source'] = result
              if (vm.filters[key]['appendItem']) {
                vm.filters[key]['source'] = vm.filters[key]['appendItem'].concat(result)
              }
            }).catch(function(){})
          }
          
        }
      }
      if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('buttons')) {
        vm.buttons = vm.itemsReports[vm.index]['filterConfig']['buttons']
        if (vm.buttons.length > 0) {
          setTimeout(() => {
            vm.buttonsShow = true
          }, 100)
        }
      }
      if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('exportXML')) {
        vm.exportXML = vm.itemsReports[vm.index]['filterConfig']['exportXML']
      }
      if (vm.showConfig) {
        vm.showConfig = false
        setTimeout(() => {
          vm.showConfig = true
        }, 200)
      }
    },
    itemsReports () {
      let vm = this
      setTimeout(() => {
        vm.showErrorData = false
        vm.showCSVDownload = false
        vm.agencyLists = []
        vm.api = ''
        vm.proxyApi = ''
        vm.filters = []
        vm.customize = false
        vm.data = {}
        vm.groupBy = []
        vm.itemsReportsConfig = []
        vm.dataReportXX = ''
        vm.buttons = []
        vm.buttonsVal = ''
        vm.buttonsShow = false
        vm.exportXML = false
        if (vm.itemsReports[vm.index]) {
          vm.nameReport = vm.itemsReports[vm.index]['reportName']
          if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('reportConfig')) {
            vm.itemsReportsConfig = vm.itemsReports[vm.index]['filterConfig']['reportConfig']
          }
          if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('customize')) {
            vm.customize = vm.itemsReports[vm.index]['filterConfig']['customize']
          }
          if (vm.itemsReports[vm.index]['reportCode'].indexOf('REGISTER') >= 0 || vm.itemsReports[vm.index]['reportCode'].indexOf('STATISTIC') >= 0) {
            vm.customize = false
          }
          if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('autoHeader')) {
            vm.noHeader = vm.itemsReports[vm.index]['filterConfig']['autoHeader']
          }
          if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('groupBy')) {
            vm.groupBy = vm.itemsReports[vm.index]['filterConfig']['groupBy']
            let defaultValGroup = vm.groupBy[0]['key']
            for (let keyGroup in vm.groupBy) {
              if (vm.groupBy[keyGroup]['selected']) {
                defaultValGroup = vm.groupBy[keyGroup]['key']
                break
              }
            }
            vm.groupByVal = defaultValGroup
          }
          if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('groupIds')) {
            if(vm.itemsReports[vm.index]['filterConfig']['showTable']){
              vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['groupIdsAdmin']
            } else {
              vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['groupIds']
            }
            if (vm.agencyLists.length > 0) {
              let defaultVal = vm.agencyLists[0]['value']
              for (let key in vm.agencyLists) {
                if (vm.agencyLists[key]['selected']) {
                  defaultVal = vm.agencyLists[key]['value']
                  break
                }
              }
              vm.govAgency = defaultVal
            }
          }
          if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('api')) {
            vm.api = vm.itemsReports[vm.index]['filterConfig']['api']
          }
          if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('proxyApi')) {
            vm.proxyApi = vm.itemsReports[vm.index]['filterConfig']['proxyApi']
          }
          if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('filters')) {
            vm.filters = vm.itemsReports[vm.index]['filterConfig']['filters']
          }
          // 
          if(vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('groupIdList')) {
            vm.groupIdList = vm.itemsReports[vm.index]['filterConfig']['groupIdList']
          } else {
            vm.groupIdList = []
          }
          // 
          for (let key in vm.filters) {
            if (vm.filters[key]['type'] === 'select' || vm.filters[key]['type'] === 'date') {

              vm.data[vm.filters[key]['key']] = vm.filters[key]['value']
              
            }
          }
          if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('buttons')) {
            vm.buttons = vm.itemsReports[vm.index]['filterConfig']['buttons']
            if (vm.buttons.length > 0) {
              setTimeout(() => {
                vm.buttonsShow = true
              }, 100)
            }
          }
          if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('exportXML')) {
            vm.exportXML = vm.itemsReports[vm.index]['filterConfig']['exportXML']
          }
          vm.report1Def = {}
          for (let key in vm.itemsReportsConfig) {
            vm.report1Def[vm.itemsReportsConfig[key]['value']] = vm.itemsReportsConfig[key]['text']
          }
          vm.reportType = vm.itemsReports[vm.index]['document']
          if (vm.showConfig) {
            vm.showConfig = false
            setTimeout(() => {
              vm.showConfig = true
            }, 200)
          }
          vm.pdfBlob = ''
        }
      }, 200)
    },
    groupByVal (val) {
      let vm = this
      console.log('valGroupBy', val)
      if (val && vm.itemsReports[vm.index]['filterConfig']['version'] && !vm.itemsReports[vm.index]['filterConfig']['chonDonViGroupBy']) {
        if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('filters')) {
          vm.filters = vm.itemsReports[vm.index]['filterConfig']['filters']
        }
        if (vm.groupByVal === 'domainCode') {
          vm.filters = vm.filters.filter(function (item) {
            return item.key !== 'serviceCode' && item.key !== 'govAgencyCode'
          })
        }
        if (vm.groupByVal === 'serviceCode') {
          vm.filters = vm.filters.filter(function (item) {
            return item.key !== 'domainCode' && item.key !== 'govAgencyCode'
          })
        }
        for (let key in vm.filters) {
          if (vm.filters[key]['type'] === 'select' && vm.filters[key].hasOwnProperty('api') && vm.filters[key]['api']) {
            if (!vm.filters[key]['source'] || vm.filters[key]['source'].length === 0) {
              vm.$store.dispatch('loadDataSource', vm.filters[key]).then(function(result) {
                vm.filters[key]['source'] = result
                if (vm.filters[key]['appendItem']) {
                  vm.filters[key]['source'] = vm.filters[key]['appendItem'].concat(result)
                }
              }).catch(function(){})
            }
          }
        }
      }
      console.log('valGroupBy123123', val)
    },
    api (val) {
      let vm = this
      if (val.indexOf('isGetVotingData') !== -1) {
        vm.statisticVotingDossiers = true
      } else {
        vm.statisticVotingDossiers = false
      }
    }
  },
  methods: {
    showConfigColumnPdf () {
      let vm = this
      vm.dialogConfigColumn = true
    },
    doCreatePDF () {
      let vm = this
      vm.headerRenderHtmlTable = []
      if (vm.itemsReports[vm.index]['reportCode'].indexOf('STATISTIC') === -1) {
        vm.headerRenderHtmlTable = vm.itemsReportsConfig.filter(function(item) {
          return item.selected
        })
        console.log('headerRenderHtmlTable-1', vm.headerRenderHtmlTable)
      } else {
        let body = vm.itemsReports[vm.index]['tableConfig']['docDefinition']['content'][2]['table']['body']
        vm.headerRenderHtmlTable = body
        console.log('headerRenderHtmlTable-1-a', vm.headerRenderHtmlTable)
      }
      if (vm.reportType.startsWith('STATISTIC')) {
        vm.doPrintReportFix()
      } else if (vm.reportType.startsWith('DANH_GIA_CAN_BO')) {
        vm.doDynamicVoting()
      } else {
        vm.doDynamicReport()
      }
      vm.isCallData = true
    },
    doDynamicVoting () {
      let vm = this
      vm.showErrorData = false
      vm.isShowLoading = true
      vm.agencyLists = []
      vm.api = ''
      vm.proxyApi = ''
      
      if(vm.itemsReports[vm.index]['filterConfig']['showTable']){
        vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['groupIdsAdmin']
      } else {
        vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['groupIds']
      }

      vm.api = vm.itemsReports[vm.index]['filterConfig']['api']
      if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('proxyApi')) {
        vm.proxyApi = vm.itemsReports[vm.index]['filterConfig']['proxyApi']
      }
      let filter = {
        document: vm.reportType,
        data: vm.data,
        api: vm.api,
        proxyApi: vm.proxyApi
      }
      let check =  true
      for (let key in vm.filterGroup) {
        if (key === vm.groupIdListSelected) {
          filter['govAgency'] = vm.filterGroup[key]
          filter['agencyLists'] = vm.groupIdList.find(item => item.key === key).value
          check = false
          break
        }
      }
      
      if(check) {
        filter['govAgency'] = vm.govAgency
        filter['agencyLists'] = vm.agencyLists
      }
      let sumKey = vm.itemsReports[vm.index]['filterConfig']['sumKey']
      let selection = vm.itemsReports[vm.index]['filterConfig']['selection']
      let merge = vm.itemsReports[vm.index]['filterConfig']['merge']
      let sort = vm.itemsReports[vm.index]['filterConfig']['sort']
      let subKey = vm.itemsReports[vm.index]['filterConfig']['subKey']
      console.log('FILTER', filter)
      let jobposListEmp = []
      if (vm.govAgency) {
        let selected = vm.agencyLists.filter(function (item) {
          return item.value === vm.govAgency
        })[0]
        jobposListEmp = [{jobposCode: selected.value, groupId: selected.code}]
      } else {
        let lengData = vm.agencyLists.length
        for (let i = 1; i < lengData; i++) {
          let item = {jobposCode: vm.agencyLists[i].value, groupId: vm.agencyLists[i].code}
          jobposListEmp.push(item)
        }
      }
      let filterGetEmployee = {
        jobposList: jobposListEmp,
        data: vm.data
      }
      //
      if (vm.doExportExcel) {
        vm.$store.dispatch('exportVotingEmployee', filterGetEmployee).then(function (response) {
          vm.isShowLoading = false
        }).catch(function () {
          vm.isShowLoading = false
        })
      } else {
        vm.$store.dispatch('getReportVotingEmployee', filterGetEmployee).then(function (result) {
          vm.isShowLoading = false
          if (result.hasOwnProperty('data') && result.data) {
            vm.dataTableVottingList = result.data
            // tạo header
            let answers = []
            let arr = vm.dataTableVottingList[0]['employees'][0]['voting']
            for (let i = 0; i < arr.length; i++) {
              for (let j = 0; j < arr[i]['choices'].length; j++) {
                answers.push(arr[i]['choices'][j])
              }
            }
            vm.listAnswers = answers
            vm.columnLength = vm.listAnswers.length + 2
            // Tạo body
            let dataRawVoting = []
            let lengData = vm.dataTableVottingList.length
            let dataEmp = vm.dataTableVottingList
            for (let i = 0; i < lengData; i++) {
              dataRawVoting.push({
                group: i + 1,
                name: dataEmp[i]['jobposName'],
                data: []
              })
              let lengthEmployee = dataEmp[i]['employees'].length
              for (let j = 0; j < lengthEmployee; j++) {
                let lengthVoting = dataEmp[i]['employees'][j]['voting'].length
                let dataScore = []
                for (let k = 0; k < lengthVoting; k++) {
                  dataScore = dataScore.concat(dataEmp[i]['employees'][j]['voting'][k]['selected'])
                }
                dataRawVoting.push(
                  {
                    child: (i + 1) + '.' + (j + 1),
                    name: dataEmp[i]['employees'][j]['name'],
                    total: dataEmp[i]['employees'][j]['totalVote'],
                    data: dataScore
                  }
                )
              }
            }
            vm.dataTableRender = dataRawVoting
            console.log('dataRawVoting', vm.dataTableRender)
          } else {
            vm.dataTableVottingList = []
            vm.showErrorData = true
          }
        }).catch(function () {
          vm.isShowLoading = false
          vm.dataTableVottingList = []
          vm.showErrorData = true
        })
      }
      
    },
    doDynamicReport () {
      let vm = this
      vm.isRender = false
      vm.docDefinition = {}
      let docDString = {}
      vm.dataReportXX = ''
      docDString = JSON.stringify(vm.reportConfigStatic[vm.index]['docDefinition'])
      // console.log('userData', vm.userData)
      let titleGov = vm.userData.hasOwnProperty('govAgencyName') && vm.userData.govAgencyName ? vm.userData.govAgencyName : vm.itemsReports[vm.index]['filterConfig']['govAgencyName']
      if (!titleGov) {
        titleGov = vm.$store.getters.siteName
      }
      console.log('titleGov', titleGov)
      docDString = docDString.replace(/\[\$siteName\$\]/g, String(titleGov).toUpperCase())

      for (let key in vm.filters) {
        let find = vm.filters[key]['key']
        let currentVal = vm.data[vm.filters[key]['key']]
        if (currentVal !== '' && currentVal !== undefined && currentVal !== null) {
          let dateStr = String(currentVal).indexOf('/') <= 0 ? new Date(currentVal).toLocaleDateString('vi-VN') : currentVal
          if (dateStr !== 'Invalid Date'&& String(currentVal).length === 13) {
            docDString = docDString.replace(eval('/\\[\\$' + find + '\\$\\]/g'), dateStr)
          } else {
            if (vm.filters[key]['type'] === 'select') {
              for (let keySource in vm.filters[key]['source']) {
                if (String(vm.filters[key]['source'][keySource]['value']) === String(currentVal)) {
                  currentVal = vm.filters[key]['source'][keySource]['name']
                }
              }
            }
            docDString = docDString.replace(eval('/\\[\\$' + find + '\\$\\]/g'), currentVal)
          }
        } else {
          // notex2
          currentVal = ''
          for (let keySource in vm.filters[key]['source']) {
            // if (currentVal === '' || currentVal === '0') {
            if (currentVal === '0') {
              currentVal = vm.filters[key]['source'][keySource]['name']
              break
            }
          }
          docDString = docDString.replace(eval('/\\[\\$' + find + '\\$\\]/g'), currentVal)
        }
      }
      if(vm.itemsReports[vm.index]['filterConfig']['showTable']){
        vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['groupIdsAdmin']
      } else {
        vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['groupIds']
      }
      console.log('agencyLists999999', vm.agencyLists)
      console.log('govAgency999999', vm.govAgency)
      for (let key in vm.agencyLists) {
        if (String(vm.agencyLists[key]['value']) === String(vm.govAgency)) {
          docDString = docDString.replace(/\[\$groupIds\$\]/g, vm.agencyLists[key]['text'])
          docDString = docDString.replace(/\[\$groupIdsHeader\$\]/g, vm.agencyLists[key]['text'].toUpperCase())
          break
        }
      }
      if (vm.itemsReports[vm.index]['filterConfig']['version']) {
        vm.api = vm.itemsReports[vm.index]['filterConfig']['apiLayDanhSach']
        vm.data[vm.groupByVal] = vm.targetFilter[vm.groupByVal]
      } else {
        vm.api = vm.itemsReports[vm.index]['filterConfig']['api']
      }
      if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('proxyApi')) {
        vm.proxyApi = vm.itemsReports[vm.index]['filterConfig']['proxyApi']
      }
      let widthsConfig = []
      widthsConfig.push(30)
      let headerTableReport = '['
      let header2TableReport = '['
      headerTableReport += JSON.stringify({
        text: 'STT',
        alignment: 'center',
        bold: true
      }) + ','
      header2TableReport += JSON.stringify({
        text: '(1)',
        alignment: 'center',
        italics: true
      }) + ','
      let ine = 2
      let colLeng = 0
      for (let key in vm.itemsReportsConfig) {
        if (vm.itemsReportsConfig[key].hasOwnProperty('selected') && vm.itemsReportsConfig[key]['selected']) {
          let widthConfig = vm.itemsReportsConfig[key].hasOwnProperty('width') ? vm.itemsReportsConfig[key] : 'auto'
          colLeng = colLeng + 1
          widthsConfig.push(widthConfig)
          // vm.docDefinition['content'][2]['table']['widths'].push('auto')
          let str1 = ' '
          if (vm.report1Def[vm.itemsReportsConfig[key]['value']] !== undefined && vm.report1Def[vm.itemsReportsConfig[key]['value']] !== null && vm.report1Def[vm.itemsReportsConfig[key]['value']] !== '') {
            str1 = vm.report1Def[vm.itemsReportsConfig[key]['value']]
          }
          headerTableReport += JSON.stringify({
            text: str1,
            alignment: 'center',
            bold: true
          }) + ','
          header2TableReport += JSON.stringify({
            text: '(' + ine + ')',
            alignment: 'center',
            italics: true
          }) + ','
          ine = ine + 1
        }
      }
      if (vm.noHeader) {
        vm.dataReportXX += headerTableReport.substring(0, headerTableReport.length - 1) + '],'
        vm.dataReportXX += header2TableReport.substring(0, header2TableReport.length - 1) + '],'
      }
      
      // build data
      let filter = {
        document: vm.reportType,
        data: vm.data,
        api: vm.api,
        proxyApi: vm.proxyApi,
        formatDate: vm.itemsReports[vm.index]['filterConfig']['version'] || vm.itemsReports[vm.index]['filterConfig']['typeDate'] === 'timestamp' ? 'timestamp' : 'date'
      }
      let check =  true
      console.log('groupIdListSelected 555', vm.groupIdListSelected)
      for (let key in vm.filterGroup) {
        if(key === vm.groupIdListSelected) {
          let exits = vm.groupIdList.find(item => item.key === key)
          filter['govAgency'] = vm.filterGroup[key]
          filter['agencyLists'] = exits ? exits.value : []
          check = false
          break
        }
      }
      if(check) {
        filter['govAgency'] = vm.govAgency
        filter['agencyLists'] = vm.agencyLists
      }
      vm.pdfBlob = null
      if (!vm.itemsReports[vm.index]['filterConfig']['version']) {
        vm.isShowLoading = true
      }
      if (vm.itemsReports[vm.index]['filterConfig']['version']) {
        let counterPage = vm.itemsReports[vm.index]['filterConfig']['numberPerPage']
        filter['start'] = vm.sttQuyen * counterPage - counterPage,
        filter['end'] = vm.sttQuyen * counterPage
        vm.dialogPDF = true
        vm.loadingPdfVer2 = true
      }
      let dispatchUse = vm.itemsReports[vm.index]['filterConfig']['version'] || vm.itemsReports[vm.index]['filterConfig']['typeDate'] === 'timestamp' ? 'getDossiers' : 'getAgencyReportListsOld'
      vm.$store.dispatch(dispatchUse, filter).then(function (result) {
        // console.log('result',result)
        if (result !== null && result !== undefined) {
          // set dossierList
          let dataReport
          if (vm.itemsReports[vm.index]['filterConfig']['version'] || vm.itemsReports[vm.index]['filterConfig']['typeDate'] === 'timestamp') {
            dataReport = result.data
            vm.dossierList = result.data
          } else {
            dataReport = result
            vm.dossierList = result
          }
          vm.pagination.totalItems = vm.dossierList.length
          if (vm.dossierList && vm.dossierList.length === 0) {
            vm.isShowLoading = false
            vm.showErrorData = true
            return
          }
          //
          vm.showErrorData = false
          let dossierRaw = {}
          let dataReportCurrent = {}
          let dataReportTotal = ''
          let textGroup = ''
          let codeGroup = ''
          for (let keyGroup in vm.groupBy) {
            if (String(vm.groupBy[keyGroup]['key']) === String(vm.groupByVal)) {
              textGroup = vm.groupBy[keyGroup]['display']
              codeGroup = vm.groupBy[keyGroup]['key']
              break
            }
          }
          try {
            vm.groupByValObj = vm.groupBy.filter(function (item) {
              return item.key === vm.groupByVal
            })[0]
          } catch (error) {
          }
          // 
          if (vm.itemsReports[vm.index]['filterConfig']['sumKey'] && vm.itemsReports[vm.index]['filterConfig']['version']) {
            vm.itemsReports[vm.index]['filterConfig']['sumKey'] = vm.groupByVal
          }
          // 
          for (let key in dataReport) {
            dataReportCurrent = dataReport[key]
            if (dossierRaw[dataReportCurrent[vm.groupByVal]] !== '' && dossierRaw[dataReportCurrent[vm.groupByVal]] !== undefined) {
              if (dossierRaw[dataReportCurrent[vm.groupByVal]][codeGroup] === dataReportCurrent[codeGroup] && 
                (!vm.itemsReports[vm.index]['filterConfig']['sumKey'] || (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('sumKey') && vm.itemsReports[vm.index]['filterConfig']['sumKey'] && dataReportCurrent[vm.itemsReports[vm.index]['filterConfig']['sumKey']]))
              ) {
                dossierRaw[dataReportCurrent[vm.groupByVal]]['dossiers'].push(dataReportCurrent)
                dossierRaw[dataReportCurrent[vm.groupByVal]]['totalChild'] = dossierRaw[dataReportCurrent[vm.groupByVal]]['totalChild'] + 1
              }
            } else {
              let dossierRawItem = {}
              if ((!dataReportCurrent.hasOwnProperty('dossierId') && !vm.reportType.startsWith('REPORT_STATISTIC')) || 
                (vm.reportType.startsWith('REPORT_STATISTIC') && vm.itemsReports[vm.index]['filterConfig']['sumKey'] && !dataReportCurrent[vm.itemsReports[vm.index]['filterConfig']['sumKey']])
              ) {
                dossierRawItem[vm.groupByVal] = dataReportCurrent[vm.groupByVal]
                dossierRawItem[textGroup] = dataReportCurrent[textGroup]
                dossierRawItem['totalChild'] = 0
                dossierRawItem['dossiers'] = []
                dossierRaw[dataReportCurrent[vm.groupByVal]] = dossierRawItem
                dossierRaw[dataReportCurrent[vm.groupByVal]][textGroup] = dataReportCurrent[textGroup]
                dossierRaw[dataReportCurrent[vm.groupByVal]]['dossiers'] = []
              } else {
                dossierRawItem[vm.groupByVal] = dataReportCurrent[vm.groupByVal]
                dossierRawItem[textGroup] = dataReportCurrent[textGroup]
                dossierRawItem['totalChild'] = 1
                dossierRawItem['dossiers'] = []
                dossierRaw[dataReportCurrent[vm.groupByVal]] = dossierRawItem
                dossierRaw[dataReportCurrent[vm.groupByVal]][textGroup] = dataReportCurrent[textGroup]
                dossierRaw[dataReportCurrent[vm.groupByVal]]['dossiers'].push(dataReportCurrent)
              }
            }
          }
          
          // 
          vm.dataRowRenderHtmlTable = dossierRaw
          console.log('dataRowRenderHtmlTable666', vm.dataRowRenderHtmlTable)
          // 
          let dataToExportCSV = []
          let dataRaw = []
          for (let key in dossierRaw) {
            if (key && dossierRaw[key]['totalChild'] !== 0) {
              dataRaw.push(dossierRaw[key])
            }
          }
          dataRaw.reverse()
          console.log('dossierRaw 47', dataRaw)
          let dataRowTotal = []
          let dataRowAverageTotal = [] /**Row tính trung bình cộng */
          let totalText = 'Tổng cộng'
          let totalAverageText = 'Trung bình'
          if (vm.statisticVotingDossiers) {
            totalAverageText = 'Điểm trung bình các chỉ số'
          }
          dataRowTotal.push({
            text: totalText, 
            colSpan: !vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('hiddenStt') ? 2 : 1,
            bold: true,
            alignment: 'center',
            style: 'tdStyle'
          })
          dataRowAverageTotal.push({
            text: totalAverageText, 
            colSpan: !vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('hiddenStt') ? 2 : 1,
            bold: true,
            alignment: 'center',
            style: 'tdStyle'
          })
          for (let keyMapping in vm.itemsReportsConfig) {
            if (vm.itemsReportsConfig[keyMapping]['value'] === 'note' || vm.itemsReportsConfig[keyMapping].hasOwnProperty('notSum')) {
              dataRowTotal.push({
                text: '', 
                alignment: 'center',
                style: 'tdStyle'
              })
              dataRowAverageTotal.push({
                text: '', 
                alignment: 'center',
                style: 'tdStyle'
              })
            }  else {
              if (vm.itemsReportsConfig[keyMapping].hasOwnProperty('type') && vm.itemsReportsConfig[keyMapping].type === 'currency') {
                dataRowTotal.push({
                  text: 0, 
                  alignment: 'center',
                  style: 'tdStyle',
                  type: 'currency'
                })
                dataRowAverageTotal.push({
                  text: 0, 
                  alignment: 'center',
                  style: 'tdStyle',
                  type: 'currency'
                })
              } else {
                dataRowTotal.push({
                  text: 0, 
                  alignment: 'center',
                  style: 'tdStyle'
                })
                dataRowAverageTotal.push({
                  text: 0, 
                  alignment: 'center',
                  style: 'tdStyle'
                })
              }
              
            }
          }
          let indexNotShowGroup = 1
          let indexCountTotal = 0
          // console.log(vm.groupByValObj)
          // console.log(vm.groupByValObj && Object.keys(vm.groupByValObj).length > 0 && vm.groupByValObj.constructor === Object && !vm.groupByValObj.hasOwnProperty('showGroup'))
          for (let key in dataRaw) {
            if (vm.groupByValObj && Object.keys(vm.groupByValObj).length > 0 && vm.groupByValObj.constructor === Object && !vm.groupByValObj.hasOwnProperty('showGroup')) {
              if (dataRaw[key][vm.groupByVal] !== undefined && dataRaw[key][vm.groupByVal] !== null && dataRaw[key][vm.groupByVal] !== '') {
                let csvGroup = []
                csvGroup.push( dataRaw[key][textGroup] + ' ( ' + dataRaw[key]['totalChild'] + ' ) ')
                for (let colLengIndex in colLeng) {
                  csvGroup.push('')
                }
                dataToExportCSV.push(csvGroup)
                dataReportTotal += JSON.stringify([{
                  colSpan: !vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('hiddenStt') ? colLeng + 1 : colLeng,
                  text: dataRaw[key][textGroup] + ' ( ' + dataRaw[key]['totalChild'] + ' ) ',
                  bold: true,
                  style: 'tdStyle'
                }]) + ','
              }
            }
            
           
            let dossiersArray = dataRaw[key]['dossiers']
            let indexStt = 1
            let dataRow = []
            for (let keyDossier in dossiersArray) {
              indexCountTotal += 1
              dataRow = []
              let dataToExportCSVItem = []
              let dossierObj = dossiersArray[keyDossier]
              dataToExportCSVItem.push(indexStt)
              if (!vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('hiddenStt')) {
                dataRow.push({
                  text: vm.groupByValObj && Object.keys(vm.groupByValObj).length > 0 && vm.groupByValObj.constructor === Object && !vm.groupByValObj.hasOwnProperty('showGroup') ? indexStt : indexNotShowGroup, 
                  alignment: 'center',
                  style: 'tdStyle'
                })
              }
              
              for (let keyVal in vm.itemsReportsConfig) {
                if (vm.itemsReportsConfig[keyVal].hasOwnProperty('selected') && vm.itemsReportsConfig[keyVal]['selected']) {
                  let alignmentConfig = 'center'
                  if (vm.itemsReportsConfig[keyVal].hasOwnProperty('align')) {
                    alignmentConfig = vm.itemsReportsConfig[keyVal]['align']
                  }
                  let ddStr = ' '
                  let currentConfig = vm.itemsReportsConfig[keyVal]

                  if (currentConfig.hasOwnProperty('calculator')) {
                    let calu = currentConfig['calculator'].replace(/dataInput/g, 'dossierObj')
                    if (isNaN(eval(calu)) || vm.itemsReportsConfig[keyVal]['value'] == 'note') {
                      ddStr = eval(calu)
                    } else {
                      ddStr = Math.round(eval(calu))
                    }
                  } else {
                    if (dossierObj[vm.itemsReportsConfig[keyVal]['value']] !== undefined && dossierObj[vm.itemsReportsConfig[keyVal]['value']] !== null && dossierObj[vm.itemsReportsConfig[keyVal]['value']] !== '') {
                      ddStr = dossierObj[vm.itemsReportsConfig[keyVal]['value']]
                    }
                  }
                  dataToExportCSVItem.push(ddStr)
                  // convert value currency
                  dataRow.push({
                    text: currentConfig.hasOwnProperty('type') && currentConfig.type === 'currency' ? vm.currency(ddStr) : ddStr, 
                    alignment: alignmentConfig,
                    style: 'tdStyle'
                  })
                  // caculator count total
                  if (vm.reportType.startsWith('REPORT_STATISTIC')) {
                    let indexRow = dataRow.length - 1
                    dataRowTotal[indexRow]['text'] = Number(dataRowTotal[indexRow]['text'].toString().replace(/\./g, '')) + Number(dataRow[indexRow]['text'].toString().replace(/\./g, ''))
                    if (dataRowTotal[indexRow]['type'] === 'currency') {
                      dataRowTotal[indexRow]['text'] = vm.currency(dataRowTotal[indexRow]['text'])
                    }
                    if (vm.itemsReportsConfig[keyVal]['value'] === 'note' || vm.itemsReportsConfig[keyVal].hasOwnProperty('notSum')) {
                      dataRowTotal[indexRow]['text'] = ''
                    }
                    dataRowAverageTotal[indexRow]['text'] = dataRowTotal[indexRow]['text']
                  }
                  
                  // 
                }
              }
              dataReportTotal += JSON.stringify(dataRow) + ','
              // vm.docDefinition['content'][2]['table']['body'].push(dataRow)
              indexStt = indexStt + 1
              indexNotShowGroup = indexNotShowGroup + 1
              dataToExportCSV.push(dataToExportCSVItem)
              // 
              
            }
          }
          dataReportTotal = dataReportTotal.substring(0, dataReportTotal.length - 1)
          vm.dataReportXX += dataReportTotal

          // console.log('itemsReportsConfig', vm.itemsReportsConfig)
          // console.log('dataRowTotal 777===', dataRowTotal)
          // console.log('percentTotal 555', dataRowTotal[dataRowTotal.length - 1]['text'], indexCountTotal, Math.round(dataRowTotal[dataRowTotal.length - 1]['text']/indexCountTotal))
          let totalScoreVoting = 0
          for (let indexTotalAverage in dataRowAverageTotal) {
            if (!isNaN(dataRowAverageTotal[indexTotalAverage]['text']) && dataRowAverageTotal[indexTotalAverage]['text']) {
              totalScoreVoting += dataRowAverageTotal[indexTotalAverage]['text']
              let average = dataRowAverageTotal[indexTotalAverage]['text']/indexCountTotal
              dataRowAverageTotal[indexTotalAverage]['text'] = String(average).indexOf('.') > 0 ? average.toFixed(1) : average
            }
          }
          if (vm.reportType.startsWith('REPORT_STATISTIC') && !vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('hiddenTotalRow')) {
            if (vm.itemsReportsConfig[dataRowTotal.length - 2]['value'] === 'ontimePercentage') {
              dataRowTotal[dataRowTotal.length - 1]['text'] = Math.round(dataRowTotal[dataRowTotal.length - 1]['text']/indexCountTotal)
            }
            vm.dataReportXX += ',' + JSON.stringify(dataRowTotal)
          }
          if (vm.statisticVotingDossiers) {
            vm.dataReportXX += ',' + JSON.stringify(dataRowAverageTotal)
          }
          // console.log('dataReportXX11ZZ', vm.dataReportXX)
          
          vm.csvExport = []
          vm.csvExport = dataToExportCSV
          vm.fields = []
          vm.fields.push('STT')
          for (let excelKey in vm.itemsReportsConfig) {
            if (vm.itemsReportsConfig[excelKey]['selected']) {
              let stringColumn = vm.itemsReportsConfig[excelKey]['value']
              if (vm.itemsReportsConfig[excelKey]['text'] !== '') {
                stringColumn = vm.itemsReportsConfig[excelKey]['text']
              }
              vm.fields.push(stringColumn)
            }
          }
          vm.showCSVDownload = true
          if (vm.statisticVotingDossiers) {
            docDString = docDString.replace(/\[\$totalScoreVoting\$\]/g, totalScoreVoting)
          }
          docDString = docDString.replace(/"\[\$tableWidth\$\]"/g, JSON.stringify(widthsConfig))
          docDString = docDString.replace(/"\[\$report\$\]"/g, vm.dataReportXX)
          vm.dataExportExcel = docDString
          vm.docDefinition = JSON.parse(docDString)
          // console.log('vm.docDefinition', vm.docDefinition)
          let pdfDocGenerator = pdfMake.createPdf(vm.docDefinition)
          // create blob
          // check showTable
          if(vm.itemsReports[vm.index]['filterConfig']['version']){
            pdfDocGenerator.getBlob((blob) => {
              vm.pdfBlob = window.URL.createObjectURL(blob)
              if (vm.pdfBlob) {
                vm.isRender = true
              } else {
                vm.isRender = false
              }
            })
            setTimeout(function () {
              vm.loadingPdfVer2 = false
            }, 300)
          } else {
            pdfDocGenerator.getBlob((blob) => {
              vm.pdfBlob = window.URL.createObjectURL(blob)
              vm.isShowLoading = false
              if (vm.doExportExcel && !vm.doExportWord) {
                vm.$store.dispatch('getExcelReportFromServer', {
                  data: docDString,
                  fileName: 'baocaothongke' + '.xls'
                })
              }
              if (vm.doExportWord) {
                let docDStringJson = JSON.parse(docDString)
                let docDStringWord = Object.assign(docDStringJson, {reportType: "docx"})
                // console.log('docDString55552343', docDStringWord)
                vm.$store.dispatch('getExcelReportFromServer', {
                  data: JSON.stringify(docDStringWord),
                  fileName: 'baocaothongke' + '.docx'
                })
              }
            })
          }
        } else {
          // vm.agencyLists = []
          vm.isShowLoading = false
          vm.showErrorData = true
        }
      })
    },
    doPrintReportFix () {
      let vm = this
      vm.dataRowRenderHtmlTable = []
      vm.isRender = false
      vm.agencyLists = []
      vm.api = ''
      vm.proxyApi = ''
      vm.dataReportXX = ''
      vm.docDefinition = {}
      let docDString = {}
      docDString = JSON.stringify(vm.reportConfigStatic[vm.index]['docDefinition'])
      // console.log('userData', vm.userData)
      let titleGov = vm.userData.hasOwnProperty('govAgencyName') && vm.userData.govAgencyName ? vm.userData.govAgencyName : vm.itemsReports[vm.index]['filterConfig']['govAgencyName']
      if (!titleGov) {
        titleGov = vm.$store.getters.siteName
      }
      // console.log('titleGov', titleGov)
      docDString = docDString.replace(/\[\$siteName\$\]/g, String(titleGov).toUpperCase())
      //console.log('docDString', docDString)
      for (let key in vm.filters) {
        let find = vm.filters[key]['key']
        let currentVal = vm.data[vm.filters[key]['key']]
        if (currentVal !== '' && currentVal !== undefined && currentVal !== null) {
          let dateStr = String(currentVal).indexOf('/') <= 0 ? new Date(currentVal).toLocaleDateString('vi-VN') : currentVal
          if (dateStr !== 'Invalid Date'&& String(currentVal).length === 13) {
            docDString = docDString.replace(eval('/\\[\\$' + find + '\\$\\]/g'), dateStr)
          } else {
            if (vm.filters[key]['type'] === 'select') {
              for (let keySource in vm.filters[key]['source']) {
                if (String(vm.filters[key]['source'][keySource]['value']) === String(currentVal)) {
                  currentVal = vm.filters[key]['source'][keySource]['name']
                }
              }
            }
            docDString = docDString.replace(eval('/\\[\\$' + find + '\\$\\]/g'), currentVal)
          }
        } else {
          currentVal = ''
          for (let keySource in vm.filters[key]['source']) {
            // if (currentVal === '' || currentVal === '0') {
            if (currentVal === '0') {
              currentVal = vm.filters[key]['source'][keySource]['name']
              break
            }
          }
          docDString = docDString.replace(eval('/\\[\\$' + find + '\\$\\]/g'), currentVal)
        }
      }
      if(vm.itemsReports[vm.index]['filterConfig']['showTable']){
        vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['groupIdsAdmin']
      } else {
        vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['groupIds']
      }
      for (let key in vm.agencyLists) {
        if (String(vm.agencyLists[key]['value']) === String(vm.govAgency)) {
          docDString = docDString.replace(/\[\$groupIds\$\]/g, String(vm.agencyLists[key]['text']).toUpperCase())
          break
        }
      }
      vm.api = vm.itemsReports[vm.index]['filterConfig']['api']
      if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('proxyApi')) {
        vm.proxyApi = vm.itemsReports[vm.index]['filterConfig']['proxyApi']
      }
      vm.isShowLoading = true
      try {
        if (vm.api.indexOf('groupBy=serviceCode') >= 0 && vm.data['domainCode'] && !vm.data['serviceCode']) {
          let dataSource = vm.filters.filter(function (item) {
            return item['key'] === 'serviceCode'
          })[0]
          // console.log('dataSource', dataSource['source'])
          let serviceCode = []
          for (let i = 0; i < dataSource['source'].length; i++) {
            serviceCode.push(dataSource['source'][i]['value'])
          }
          // console.log('serviceCode', serviceCode)
          vm.data['serviceCode'] = serviceCode.toString()
        }
      } catch (error) {
      }
      let filter = {
        document: vm.reportType,
        data: vm.data,
        api: vm.api,
        proxyApi: vm.proxyApi
      }
      if (vm.api.indexOf('/o/statistic/dossier') >= 0) {
        filter.formatDate = 'timestamp'
      }
      let check =  true
      for (let key in vm.filterGroup) {
        if (key === vm.groupIdListSelected) {
          filter['govAgency'] = vm.filterGroup[key]
          filter['agencyLists'] = vm.groupIdList.find(item => item.key === key).value
          check = false
          break
        }
      }
      // console.log('check-check', vm.groupIdListSelected, vm.filterGroup)
      if(check) {
        filter['govAgency'] = vm.govAgency
        filter['agencyLists'] = vm.agencyLists
      }
      // 
      if (filter['govAgency']) {
        for (let key in vm.agencyLists) {
          if (String(vm.agencyLists[key]['value']) === String(filter['govAgency'])) {
            docDString = docDString.replace(/\[\$groupIds\$\]/g, String(vm.agencyLists[key]['text']).toUpperCase())
            break
          }
        }
      }
      // 
      vm.pdfBlob = null
      vm.isShowLoading = true
      let sumKey = vm.itemsReports[vm.index]['filterConfig']['sumKey']
      let selection = vm.itemsReports[vm.index]['filterConfig']['selection']
      let merge = vm.itemsReports[vm.index]['filterConfig']['merge']
      let sort = vm.itemsReports[vm.index]['filterConfig']['sort']
      let subKey = vm.itemsReports[vm.index]['filterConfig']['subKey']
      
      // console.log('itemsReports', vm.itemsReports[vm.index])
      let dispatchUse = vm.api.indexOf('/o/statistic/dossier') >= 0 ? 'getAgencyReportLists' : 'getAgencyReportListsOld'
      vm.$store.dispatch(dispatchUse, filter).then(function (result) {
        // console.log('result',result)
        if (result !== null) {
          // set dossierList
          vm.dossierList = result
          vm.pagination.totalItems = vm.dossierList.length
          //
          vm.showErrorData = false
          let index = 1
          let dataRowTotal = []
          let totalText = 'Tổng số'
          if (sumKey === 'month') {
            totalText = 'Cả năm'
          }
          dataRowTotal.push({
            text: totalText, 
            colSpan: 2,
            bold: true,
            alignment: 'center',
            style: 'tdStyle'
          })
          for (let keyMapping in vm.itemsReportsConfig) {
            if (vm.itemsReportsConfig[keyMapping]['value'] === 'note' || vm.itemsReportsConfig[keyMapping].hasOwnProperty('notSum')) {
              dataRowTotal.push({
                text: '', 
                alignment: 'center',
                style: 'tdStyle'
              })
            }  else {
              dataRowTotal.push({
                text: 0, 
                alignment: 'center',
                style: 'tdStyle'
              })
            }
          }

          // TODO
          let resultData = result
          if (selection !== undefined && selection !== null && selection.length > 0) {
            // console.log('selection', selection)
            resultData = result.filter(function(obj) {
              let totalCHK = 0
              for (let keySe in selection) {
                if (selection[keySe]['compare'] === '#') {
                  if (String(obj[selection[keySe]['key']]) !== String(selection[keySe]['value'])) {
                    totalCHK = totalCHK + 1
                    return obj
                  }
                } else if (selection[keySe]['compare'] === '=') {
                  if (selection[keySe]['value'] === '') {
                    if (String(obj[selection[keySe]['key']]) === '' || obj[selection[keySe]['key']] === undefined || obj[selection[keySe]['key']] === null) {
                      totalCHK = totalCHK + 1
                      return obj
                    }
                  } else {
                    // console.log('compare', selection[keySe], obj[selection[keySe]['key']], selection[keySe]['value'])
                    if (String(obj[selection[keySe]['key']]) === String(selection[keySe]['value'])) {
                      totalCHK = totalCHK + 1
                      return obj
                    }
                  }
                } else {
                  if (String(obj[selection[keySe]['key']]) === '' || obj[selection[keySe]['key']] === undefined || obj[selection[keySe]['key']] === null) {
                    totalCHK = totalCHK + 1
                    // return obj
                  }
                }
              }
              if (totalCHK === selection.length) {
                return obj
              }
            })
          }
          // console.log('resultData555', resultData)
          let resultDataTotal = [resultData.find(function(obj) {
            if (subKey !== null && subKey !== undefined && subKey !== '') {
              if ((obj[sumKey] === '' || String(obj[sumKey]) === '0' || obj[sumKey] === undefined || obj[sumKey] === null) && obj[subKey] === '') {
                return obj
              }
            } else {
              if (obj[sumKey] === '' || String(obj[sumKey]) === '0' || obj[sumKey] === undefined || obj[sumKey] === null) {
                return obj
              }
            }
          })]
          if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('notSumkey')) {
            resultDataTotal = resultData
          }
        //  console.log('resultDataTotal666', resultDataTotal)
          let resultDataVari = {}
          for (let key in resultData) {
            let keyVari = ''
            for (let keysd in merge) {
              keyVari += resultData[key][merge[keysd]] + '_'
            }
            if (resultDataVari[keyVari] === undefined || resultDataVari[keyVari] === null || resultDataVari[keyVari] === '') {
              resultDataVari[keyVari] = resultData[key]
            } else {
              for (let kkey in resultDataVari[keyVari]) {
                if (resultDataVari[keyVari][kkey] !== '' && resultDataVari[keyVari][kkey] !== undefined && resultDataVari[keyVari][kkey] !== null) {
                  if (String(parseInt(resultDataVari[keyVari][kkey])) === 'NaN') {
                    resultDataVari[keyVari][kkey] = resultData[key][kkey]
                  } else if (kkey === 'ontimePercentage') {
                    resultDataVari[keyVari][kkey] = parseInt(resultData[key][kkey])
                  } else if (kkey === 'month' || kkey === 'year') {
                    resultDataVari[keyVari][kkey] = parseInt(resultData[key][kkey])
                  } else {
                    resultDataVari[keyVari][kkey] = parseInt(resultData[key][kkey]) + parseInt(resultDataVari[keyVari][kkey])
                  }
                }
              }
            }
          }
          resultData = []
          for (let key in resultDataVari) {
            if (key !== undefined && !key.startsWith('undefined')) {
              resultData.push(resultDataVari[key])
            }
          }
          if (sort !== '' && sort !== undefined && sort !== null) {
            resultData = vm.sortByKey(resultData, sort)
          }
          if (subKey !== null && subKey !== undefined && subKey !== '') {
            let arraySubKey = {}
            for (let key in resultData) {
              if ((resultData[key][sumKey] !== '' && String(resultData[key][sumKey]) !== '0' && resultData[key][sumKey] !== undefined && resultData[key][sumKey] !== null) ||
                (subKey !== null && subKey !== undefined && subKey !== '' && resultData[key][subKey] === '' && resultData[key][sumKey] !== '' && resultData[key][sumKey] !== '0')) {
                if (arraySubKey[resultData[key][sumKey]] !== undefined && arraySubKey[resultData[key][sumKey]] !== null) {
                  arraySubKey[resultData[key][sumKey]].push(resultData[key])
                } else {
                  arraySubKey[resultData[key][sumKey]] = []
                  arraySubKey[resultData[key][sumKey]].push(resultData[key])
                }
              }
            }
            resultData = []
            for (let keySUBARRAY in arraySubKey) {
              let subKeySortData = vm.sortByKey(arraySubKey[keySUBARRAY], subKey)
              for (let keyData in subKeySortData) {
                resultData.push(subKeySortData[keyData])
              }
            }
          }
          let dataToExportCSV = []
          for (let key in resultData) {
            let dataInput = resultData[key]            
            if ((resultData[key][sumKey] !== '' && String(resultData[key][sumKey]) !== '0' && resultData[key][sumKey] !== undefined && resultData[key][sumKey] !== null) ||
                (subKey !== null && subKey !== undefined && subKey !== '' && resultData[key][subKey] === '' && resultData[key][sumKey] !== '' && String(resultData[key][sumKey]) !== '0')) {
              let dataRow = []
              let dataToExportCSVItem = []
              if (subKey !== null && subKey !== undefined && subKey !== '' && resultData[key][subKey] !== '') {
                dataToExportCSVItem.push('')
                dataRow.push({
                  text: '', 
                  alignment: 'center',
                  style: 'tdStyle'
                })
              } else {
                dataToExportCSVItem.push(index)
                dataRow.push({
                  text: index, 
                  alignment: 'center',
                  style: 'tdStyle'
                })
              }
              let indexTotal = 1
              for (let keyMapping in vm.itemsReportsConfig) {
                let currentConfig = vm.itemsReportsConfig[keyMapping]
                let dataText = ' '
                let preff = currentConfig.hasOwnProperty('prefix') ? currentConfig['prefix'] : ''
                if (currentConfig.hasOwnProperty('calculator')) {
                  if (isNaN(eval(currentConfig['calculator']))) {
                    dataText = eval(currentConfig['calculator'])
                  } else {
                    dataText = Math.round(eval(currentConfig['calculator']))
                  }
                } else {
                  // console.log('resultData[key]', resultData[key], currentConfig['value'] )
                  if (resultData[key][currentConfig['value']] !== undefined && resultData[key][currentConfig['value']] !== null) {
                    if (currentConfig.hasOwnProperty('subValue') && resultData[key][subKey] !== '') {
                      dataText =  ' - ' + resultData[key][currentConfig['subValue']] + ' '
                    } else {
                      dataText = preff + ' ' + resultData[key][currentConfig['value']] + ' '
                    }
                  }
                }
                let alignmentConfig = 'center'
                if (currentConfig.hasOwnProperty('align')) {
                  alignmentConfig = currentConfig['align']
                }
                dataToExportCSVItem.push(dataText)
                dataRow.push({
                  text: currentConfig['value'] === 'note' || currentConfig.hasOwnProperty('notSum') ? ' ' : (dataText === ' ' ? ' 0 ' : dataText), 
                  alignment: alignmentConfig,
                  style: 'tdStyle'
                })

                if (vm.govAgency === 0) {
                  if (dataRowTotal[indexTotal] !== null && dataRowTotal[indexTotal] !== undefined) {
                    if (currentConfig['value'] === 'ontimePercentage') {
                      dataRowTotal[indexTotal]['text'] = parseInt(dataText)
                    } else if (currentConfig['value'] === 'note' || currentConfig.hasOwnProperty('notSum')) {
                      dataRowTotal[indexTotal]['text'] = ' '
                    } else if (isNaN(dataText)) {
                      // dataRowTotal[indexTotal]['text'] = ' '
                      dataRowTotal[indexTotal]['text'] = ' 0 '
                    } else {
                      dataRowTotal[indexTotal]['text'] = parseInt(dataRowTotal[indexTotal]['text']) + parseInt(dataText)
                    }
                  }
                }
                indexTotal = indexTotal + 1
              }
              if (subKey !== null && subKey !== undefined && subKey !== '' && resultData[key][subKey] !== '') {
                
              } else {
                index = index + 1
              }
              
              vm.dataRowRenderHtmlTable.push(dataRow)
              // vm.docDefinition['content'][2]['table']['body'].push(dataRow)
              vm.dataReportXX += JSON.stringify(dataRow) + ','
              dataToExportCSV.push(dataToExportCSVItem)
            }
          }
          if (vm.agencyLists.length > 0 && vm.govAgency === 0) {
            // console.log('resultDataTotal777', resultDataTotal)
            for (let keyXXTT in resultDataTotal) {
              let indexTotalXXTT = 1
              for (let keyMappingXXTT in vm.itemsReportsConfig) {
                let dataTextXXTT = ''
                let currentConfigXXTT = vm.itemsReportsConfig[keyMappingXXTT]
                // console.log('currentConfigXXTT777', currentConfigXXTT)
                if (currentConfigXXTT.hasOwnProperty('calculator')) {
                  var dataInputXXTT = resultDataTotal[keyXXTT]
                  let calu = currentConfigXXTT['calculator'].replace(/dataInput/g, 'dataInputXXTT')
                  if (isNaN(eval(calu)) || currentConfigXXTT['value'] === 'note') {
                    dataTextXXTT = eval(calu)
                  } else {
                    dataTextXXTT = Math.round(eval(calu))
                  }
                } else if (resultDataTotal[keyXXTT][currentConfigXXTT['value']] !== undefined && resultDataTotal[keyXXTT][currentConfigXXTT['value']] !== null && resultDataTotal[keyXXTT][currentConfigXXTT['value']] !== '') {
                  dataTextXXTT = resultDataTotal[keyXXTT][currentConfigXXTT['value']] + ' '
                }
                dataRowTotal[indexTotalXXTT]['text'] = isNaN(parseInt(dataTextXXTT)) ? '0 '  : parseInt(dataTextXXTT) + ' '
                if (currentConfigXXTT['value'] === 'note' || currentConfigXXTT.hasOwnProperty('notSum')) {
                  dataRowTotal[indexTotalXXTT]['text'] = ' '
                }
                indexTotalXXTT = indexTotalXXTT + 1
              }
              break
            }
            // console.log('dataRowTotal 555', dataRowTotal)
          } else {
            for (let keyXXTT in resultDataTotal) {
              let indexTotalXXTT = 1
              for (let keyMappingXXTT in vm.itemsReportsConfig) {
                let dataTextXXTT = ''
                let currentConfigXXTT = vm.itemsReportsConfig[keyMappingXXTT]
                if (currentConfigXXTT.hasOwnProperty('calculator')) {
                  var dataInputXXTT = resultDataTotal[keyXXTT]
                  let calu = currentConfigXXTT['calculator'].replace(/dataInput/g, 'dataInputXXTT')
                  if (isNaN(eval(calu)) || currentConfigXXTT['value'] === 'note') {
                    dataTextXXTT = eval(calu)
                  } else {
                    dataTextXXTT = Math.round(eval(calu))
                  }
                } else if (resultDataTotal[keyXXTT][currentConfigXXTT['value']] !== undefined && resultDataTotal[keyXXTT][currentConfigXXTT['value']] !== null && resultDataTotal[keyXXTT][currentConfigXXTT['value']] !== '') {
                  dataTextXXTT = resultDataTotal[keyXXTT][currentConfigXXTT['value']] + ' '
                }
                dataRowTotal[indexTotalXXTT]['text'] = isNaN(parseInt(dataTextXXTT)) ? '0' : parseInt(dataTextXXTT) + ' '
                if (currentConfigXXTT['value'] === 'note' || currentConfigXXTT.hasOwnProperty('notSum')) {
                  dataRowTotal[indexTotalXXTT]['text'] = ' '
                }
                indexTotalXXTT = indexTotalXXTT + 1
              }
            }
            console.log('dataRowTotal 666', dataRowTotal)
          }
          vm.dataReportXX += JSON.stringify(dataRowTotal)
          // console.log('vm.dataReportXX 1231', vm.dataReportXX)
          let itemTotal = []
          for (let keyTotalCSV in dataRowTotal) {
            itemTotal.push(dataRowTotal[keyTotalCSV]['text'])
          }
          dataToExportCSV.push(itemTotal)
          vm.csvExport = []
          vm.csvExport = dataToExportCSV
          vm.fields = []
          vm.fields.push('STT')
          vm.fields.push(sumKey)
          for (let excelKey in vm.itemsReportsConfig) {
            if (vm.itemsReportsConfig[excelKey]['selected']) {
              let stringColumn = vm.itemsReportsConfig[excelKey]['value']
              if (vm.itemsReportsConfig[excelKey]['text'] !== '') {
                stringColumn = vm.itemsReportsConfig[excelKey]['text']
              }
              vm.fields.push(stringColumn)
            }
          }
          vm.showCSVDownload = true
          docDString = docDString.replace(/"\[\$report\$\]"/g, vm.dataReportXX)
          // console.log('docDString,dataExportExcelStatistic', docDString)
          vm.dataExportExcel = docDString
          // vm.docDefinition['content'][2]['table']['body'].push(dataRowTotal)
          vm.docDefinition = JSON.parse(docDString)
          // console.log('docDefinition-render-pdf', vm.docDefinition)
          let pdfDocGenerator = pdfMake.createPdf(vm.docDefinition)
          // create blob
          // check showTable
          // console.log('resultData', resultData)
          // console.log('resultDataTotal 2', resultDataTotal)
          if(vm.itemsReports[vm.index]['filterConfig']['showTable']){
            pdfDocGenerator.getBlob((blob) => {
              vm.pdfBlob = window.URL.createObjectURL(blob)
              if (vm.pdfBlob) {
                vm.isRender = true
              } else {
                vm.isRender = false
              }
              vm.isShowLoading = false
            })
          } else {
            pdfDocGenerator.getBlob((blob) => {
              vm.pdfBlob = window.URL.createObjectURL(blob)
              vm.isShowLoading = false
              if (vm.doExportExcel && !vm.doExportWord) {
                vm.$store.dispatch('getExcelReportFromServer', {
                  data: docDString,
                  fileName: new Date().getTime() + '.xls'
                })
              }
              if (vm.doExportWord) {
                let docDStringJson = JSON.parse(docDString)
                let docDStringWord = Object.assign(docDStringJson, {reportType: "docx"})
                vm.$store.dispatch('getExcelReportFromServer', {
                  data: JSON.stringify(docDStringWord),
                  fileName: 'baocaothongke' + '.docx'
                })
              }
            })
          }
        } else {
          // vm.agencyLists = []
          vm.isShowLoading = false
          vm.showErrorData = true
        }
      })
    },
    doCreateReport(isExportExcel, isExportWord) {
      let vm = this
      vm.showHTML = false
      vm.showGuilds = false
      if (vm.$refs.form.validate()) {
        vm.doExportExcel = isExportExcel
        vm.doExportWord = isExportWord && isExportWord === 'word' ? true : false
        vm.showConfig = false
        vm.doCreatePDF()
      }
    },
    createReport () {
      let vm = this
      vm.targetFilter = ''
      try {
        vm.headerTongHop[0]['text'] = vm.groupBy.filter(function (item) {
          return item.key === vm.groupByVal
        })[0]['label']
      } catch (error) {
      }
      vm.currentLimit = Number(vm.itemsReports[vm.index]['filterConfig']['numberPerPage'])
      vm.isRender = false
      vm.isShowLoading = true
      vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['groupIds']
      vm.api = vm.itemsReports[vm.index]['filterConfig']['api']
      if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('proxyApi')) {
        vm.proxyApi = vm.itemsReports[vm.index]['filterConfig']['proxyApi']
      }
      // console.log('valGroupBy789', vm.groupByVal)
      vm.data['groupBy'] = vm.groupByVal
      // console.log('valGroupByvm.data333', vm.data)
      // build data
      let filter = {
        document: vm.reportType,
        data: vm.data,
        api: vm.api,
        proxyApi: vm.proxyApi,
        formatDate: vm.itemsReports[vm.index]['filterConfig']['version'] || vm.itemsReports[vm.index]['filterConfig']['typeDate'] === 'timestamp' ? 'timestamp' : 'date'
      }
      let check =  true
      // console.log('groupIdListSelected 555', vm.groupIdListSelected)
      for (let key in vm.filterGroup) {
        if(key === vm.groupIdListSelected) {
          let exits = vm.groupIdList.find(item => item.key === key)
          filter['govAgency'] = vm.filterGroup[key]
          filter['agencyLists'] = exits ? exits.value : []
          check = false
          break
        }
      }
      if(check) {
        filter['govAgency'] = vm.govAgency
        filter['agencyLists'] = vm.agencyLists
      }
      vm.pdfBlob = null
      vm.listTongHop = []
      vm.$store.dispatch('createReport', filter).then(function (result) {
        let counter = 0
        vm.isRender = true
        vm.isShowLoading = false
        let dataReport = result.filter(function (item) {
          return item.domainCode || item.serviceCode || item.govAgencyCode
        })
        // dataReport.map(item => {
        //   item['pages'] = item.count ? Math.ceil(item.count / vm.currentLimit) : 0
        //   return item
        // })
        for (let key in dataReport) {
          if (dataReport[key].count) {
            dataReport[key]['pages'] = dataReport[key].count ? Math.ceil(dataReport[key].count / vm.currentLimit) : 0
            counter+=Number(dataReport[key].count)
          } else {
            dataReport[key]['pages'] = dataReport[key].totalCount ? Math.ceil(dataReport[key].totalCount / vm.currentLimit) : 0
            counter+=Number(dataReport[key].totalCount)
          }
        }
        vm.listTongHop = dataReport
        vm.totalCount = counter
      })
    },
    viewListHoSo (item, first) {
      let vm = this
      vm.targetFilter = item
      if (first) {
        vm.pagination.page = 1
      }
      vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['groupIds']
      vm.api = vm.itemsReports[vm.index]['filterConfig']['apiLayDanhSach']
      if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('proxyApi')) {
        vm.proxyApi = vm.itemsReports[vm.index]['filterConfig']['proxyApi']
      }
      vm.data[vm.groupByVal] = item[vm.groupByVal]
      // build data
      let filter = {
        document: vm.reportType,
        data: vm.data,
        api: vm.api,
        proxyApi: vm.proxyApi,
        start: vm.pagination.page * vm.pagination.rowsPerPage - vm.pagination.rowsPerPage,
        end: vm.pagination.page * vm.pagination.rowsPerPage,
        formatDate: vm.itemsReports[vm.index]['filterConfig']['version'] || vm.itemsReports[vm.index]['filterConfig']['typeDate'] === 'timestamp' ? 'timestamp' : 'date'
      }
      let check =  true
      // console.log('groupIdListSelected 555', vm.groupIdListSelected)
      for (let key in vm.filterGroup) {
        if(key === vm.groupIdListSelected) {
          let exits = vm.groupIdList.find(item => item.key === key)
          filter['govAgency'] = vm.filterGroup[key]
          filter['agencyLists'] = exits ? exits.value : []
          check = false
          break
        }
      }
      if(check) {
        filter['govAgency'] = vm.govAgency
        filter['agencyLists'] = vm.agencyLists
      }
      vm.loadingGetDossier = true
      vm.dialogDossierList = true

      vm.$store.dispatch('getDossiers', filter).then(function (result) {
        vm.loadingGetDossier = false
        vm.dossierList = result.data
        if (first) {
          vm.pagination.totalItems = result.total
        }
      })
    },
    sortByKey (array, key) {
      return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      })
    },
    changeConfig (index) {
      let vm = this
      // if (vm.itemsReportsConfig[index].hasOwnProperty('selected')) {
      //   if (vm.itemsReportsConfig[index]['selected']) {
      //     vm.itemsReportsConfig[index]['selected'] = false
      //   } else {
      //     vm.itemsReportsConfig[index]['selected'] = true
      //   }
      // } else {
      //   vm.itemsReportsConfig[index]['selected'] = true
      // }
      // console.log('itemsReportsConfig index', vm.itemsReportsConfig[index])
      // console.log('itemsReportsConfig', vm.itemsReportsConfig)
    },
    doChotSoLieu (dataSelect, button) {
      let vm = this
      let filter = {
        api: button['api'],
        key: button['key'],
        value: dataSelect,
        data: vm.data
      }
      vm.$store.dispatch('doChotSoLieu', filter).then(function () {
        vm.doCreatePDF()
      })
    },
    reloadPickerChange (key) {
      let vm = this
      console.log('keyDate2', key, vm.data[key])
      vm.showPicker = false
      setTimeout(() => {
        vm.data[key] = new Date(vm.data[key]).toLocaleDateString('vi-VN')
        console.log('DATE91232', vm.data[key])
        vm.showPicker = true
      }, 200)
    },
    sdfsdfdsf () {
      let vm = this
      vm.$store.dispatch('doExportXlsxddd')
    },
    toDoNotDone () {
      alert('Đang phát triển.')
    },
    doDynamicReportXML () {
      let vm = this
      if(vm.itemsReports[vm.index]['filterConfig']['showTable']){
        vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['groupIdsAdmin']
      } else {
        vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['groupIds']
      }
      vm.jsonMapperJson = {}
      vm.jsonMapperJson = vm.itemsReports[vm.index]['userConfig']
      vm.api = vm.itemsReports[vm.index]['filterConfig']['api']
      if (vm.itemsReports[vm.index]['filterConfig'].hasOwnProperty('proxyApi')) {
        vm.proxyApi = vm.itemsReports[vm.index]['filterConfig']['proxyApi']
      }
      // bild data
      let filter = {
        document: vm.reportType,
        data: vm.data,
        api: vm.api,
        proxyApi: vm.proxyApi
      }
      filter['govAgency'] = vm.govAgency
      filter['agencyLists'] = vm.agencyLists
      vm.$store.dispatch('getAgencyReportLists', filter).then(function (result) {
        // console.log('result',result)
        if (result !== null && result !== undefined) {
          jsonMapper({ 'content': result, 'blank': '' }, vm.jsonMapperJson).then((result) => {
            // console.log(result)
            const xmlOptions = {
              header: true,
              indent: '  '
            };
            let xmlToExport = toXML(result, xmlOptions)
            var blob = new Blob([ new TextEncoder().encode( xmlToExport ) ], {
                type: "text/plain;charset=utf-8;",
            })
            FileSaver.saveAs(blob, new Date().getTime() + ".xml");
          })
        }
      })
    },
    convertPDFToHTML (content) {
      let vm = this
      window.PDFJS.getDocument(content).then(window.pdf_table_extractor).then(function (result) {
        let all_tables = [];
        let table_dom = window.$('<table></table>').attr('border', 1);
        // let page_tables = result.pageTables.shift()
        for (let tableIndexXXX in result.pageTables) {
          let page_tables = result.pageTables[tableIndexXXX]
          all_tables = all_tables.concat(page_tables.tables);
          let tables = page_tables.tables;
          let merge_alias = page_tables.merge_alias;
          let merges = page_tables.merges;
          for (let r = 0; r < tables.length; r++) {
            let tr_dom = window.$('<tr></tr>')
            for (let c = 0; c < tables[r].length; c++) {
              let r_c = [r, c].join('-')
              if (merge_alias[r_c]) {
                continue
              }
              let td_dom = window.$('<td></td>');
              if (merges[r_c]) {
                if (merges[r_c].width > 1) {
                  td_dom.attr('colspan', merges[r_c].width)
                }
                if (merges[r_c].height > 1) {
                  td_dom.attr('rowspan', merges[r_c].height)
                }
              }
              td_dom.html(tables[r][c].replace(/\n/ig, '<br/>').replace(/↵/ig, '<br/>'))
              tr_dom.append(td_dom)
            }
            table_dom.append(tr_dom)
          }
        }
        var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">'
        tab_text = tab_text + '<head><meta http-equiv="content-type" content="text/html; charset=UTF-8"/><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
        tab_text = tab_text + '<x:Name>Test Sheet</x:Name>'
        tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>'
        tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>'
        
        tab_text = tab_text + '<table></table><table border="0" cellpadding="0" cellspacing="0"><tbody><tr><td colspan="10" valign="top" width="167"><p align="center"><strong><strong>-------</strong></p></td><td valign="top" width="275" colspan="10"><p align="center"><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>Độc lập - Tự do - Hạnh phúc <br>---------------</strong></p></td></tr></tbody></table><table></table>';
        tab_text = tab_text + '<table border="0" cellpadding="0" cellspacing="0"><tbody><tr><td colspan="20" valign="top" width="167"><p align="center"><strong>TỔNG HỢP HỒ SƠ NỘP TRỰC TUYẾN THEO LĨNH VỰC</strong></p></td></td></tr></tbody></table><table></table>';

        tab_text = tab_text + "<table border='1px' width='1366px'>"
        tab_text = tab_text + table_dom[0].innerHTML
        
        tab_text = tab_text + '<table></table><table border="0" cellpadding="0" cellspacing="0"><tbody><tr><td colspan="4" valign="top" width="167"><p align="left"><strong>Nơi nhận:</strong></p></td><td valign="top" width="275" colspan="16"><p align="right"><strong>THỦ TRƯỞNG ĐƠN VỊ</strong><br/>(Ký và ghi rõ họ tên)</p></td></tr></tbody></table><table></table>';
        tab_text = tab_text + '</body></html>';

        var blob = new Blob([ new TextEncoder().encode( tab_text ) ], {
          type: 'data:application/vnd.ms-excel;charset=utf-8;',
        })
        // window.location.href = "data:application/vnd.ms-excel;charset=UTF-8,%EF%BB%BF" + encodeURIComponent(tab_text)
        FileSaver.saveAs(blob, new Date().getTime() + ".xls");
      })
    },
    goToThongKe () {
      let vm = this
      let fromStatisticDate = vm.data['fromStatisticDate']
      let toStatisticDate = vm.data['toStatisticDate']
      let site = window.themeDisplay.getSiteAdminURL().split('/~')[0].replace('group','web')
      let urlReport = site + '/thong-ke#/danh-gia-thu-tuc?groupId=' + vm.govAgency + '&fromStatisticDate=' +
      fromStatisticDate + '&toStatisticDate=' + toStatisticDate
      window.location.href = urlReport
    },
    s2ab (s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    },
    parseCurrentDate (date) {
      if (!date) {
        return null
      }
      try {
        let [day, month, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      } catch (e) {
        return ''
      }
    },
    currency (value) {
      if (value) {
        let moneyCur = (value / 1).toFixed(0).replace('.', ',')
        return moneyCur.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      }
      return ''
    },
    paggingData (config) {
      let vm = this
      vm.pagination.page = config.page
      vm.viewListHoSo(vm.targetFilter)
    },
    viewDetail (item) {
      let vm = this
      vm.dossierInfo = item
      vm.dialogDossierDetail = true
    },
    printPdf (item, n) {
      let vm = this
      vm.sttQuyen = n
      vm.targetFilter = item
      vm.doDynamicReport()
    },
    downloadExcel (item, n) {
      let vm = this
      let counterPage = 1
      if (n) {
        vm.sttQuyen = n
        counterPage = vm.itemsReports[vm.index]['filterConfig']['numberPerPage']
        vm.targetFilter = item
        vm.data[vm.groupByVal] = item[vm.groupByVal]
      }
      vm.agencyLists = vm.itemsReports[vm.index]['filterConfig']['groupIds']
      vm.api = vm.itemsReports[vm.index]['filterConfig']['apiExportExcel'] ? vm.itemsReports[vm.index]['filterConfig']['apiExportExcel'] : vm.itemsReports[vm.index]['filterConfig']['api']
      // build data
      let filter = {
        document: vm.reportType,
        data: vm.data,
        api: vm.api,
        proxyApi: vm.proxyApi,
        fileName: vm.itemsReports[vm.index]['reportName'].replace(/ /g, "") + '.xlsx'
      }
      if (n) {
        filter.start = vm.sttQuyen * counterPage - counterPage
        filter.end = vm.sttQuyen * counterPage
      }
      let check =  true
      console.log('groupIdListSelected 555', vm.groupIdListSelected)
      for (let key in vm.filterGroup) {
        if(key === vm.groupIdListSelected) {
          let exits = vm.groupIdList.find(item => item.key === key)
          filter['govAgency'] = vm.filterGroup[key]
          filter['agencyLists'] = exits ? exits.value : []
          check = false
          break
        }
      }
      if(check) {
        filter['govAgency'] = vm.govAgency
        filter['agencyLists'] = vm.agencyLists
      }
      vm.loadingGetDossier = true
      vm.$store.dispatch('exportExcel', filter).then(function (result) {
        vm.loadingGetDossier = false
      })
    },
    exportExcel () {
      let vm = this
      console.log('sadsadas',vm.dataExportExcel)
      vm.$store.dispatch('getExcelReportFromServer', {
        groupId: vm.govAgency ? vm.govAgency : window.themeDisplay.getScopeGroupId(),
        data: vm.dataExportExcel,
        fileName: 'baocaothongke' + '.xls'
      })
    },
    changeGroupIdList(item){
       let vm = this
      setTimeout(()=>{
        vm.govAgency = null
        console.log(item.key)
        console.log(vm.filterGroup[item.key])
        vm.groupIdListSelected = vm.filterGroup[item.key] ? item.key : ''
        for(let i in vm.filterGroup){
          if(i !== item.key) {
            vm.filterGroup[i] = null
          }
        }
        
        for (let key in vm.filters) {
          if (vm.filters[key]['type'] === 'select' && vm.filters[key].hasOwnProperty('api') && vm.filters[key]['api']) {
            vm.filters[key]['value'] = ''
            vm.data[vm.filters[key]['key']] = ''
            vm.filters[key]['groupId'] = vm.filterGroup[item.key]
            console.log('filter dataSource', vm.filters[key])
            vm.$store.dispatch('loadDataSource', vm.filters[key]).then(function(result) {
              vm.filters[key]['source'] = result
              if (vm.filters[key]['appendItem']) {
                vm.filters[key]['source'] = vm.filters[key]['appendItem'].concat(result)
              }
            }).catch(function(){})
          }
        }
      }, 200)
    },
    changeGovAgency () {
      let vm = this
      vm.groupIdListSelected = ''
      setTimeout(()=>{
        for (let key in vm.filters) {
          if (vm.filters[key]['type'] === 'select' && vm.filters[key].hasOwnProperty('api') && vm.filters[key]['api']) {
            vm.filters[key]['value'] = ''
            vm.data[vm.filters[key]['key']] = ''
            vm.filters[key]['groupId'] = vm.govAgency
            vm.$store.dispatch('loadDataSource', vm.filters[key]).then(function(result) {
              vm.filters[key]['source'] = result
              if (vm.filters[key]['appendItem']) {
                vm.filters[key]['source'] = vm.filters[key]['appendItem'].concat(result)
              }
            }).catch(function(){})
          }
        }
        for(let i in vm.filterGroup){
          vm.filterGroup[i] = null
        }
        vm.data[vm.groupByVal] = ''
      }, 300)
    },
    viewHTML () {
      let vm = this
      vm.headerRenderHtmlTable = []
      vm.widthRenderHtmlTable = []
      vm.tableType = ''
      console.log('vm.itemsReportsConfig:',vm.itemsReportsConfig)
      if (vm.itemsReports[vm.index]['reportCode'].indexOf('STATISTIC') === -1) {
        vm.headerRenderHtmlTable = vm.itemsReportsConfig.filter(function(item) {
          return item.selected
        })
        console.log('headerRenderHtmlTable-1', vm.headerRenderHtmlTable)
        let textGroup = ''
        let codeGroup = ''
        for (let keyGroup in vm.groupBy) {
          if (String(vm.groupBy[keyGroup]['key']) === String(vm.groupByVal)) {
            textGroup = vm.groupBy[keyGroup]['display']
            codeGroup = vm.groupBy[keyGroup]['key']
            break
          }
        }
        let dataBody = []
        for(let key in vm.dataRowRenderHtmlTable){
          let rowTotal = {
            colSpan: vm.headerRenderHtmlTable.length,
            text: vm.dataRowRenderHtmlTable[key][textGroup],
            bold: true,
            style: 'trStyle',
            totalChild: vm.dataRowRenderHtmlTable[key]['dossiers'].length,
            dossier: {}
          }
          dataBody.push(rowTotal)
          for(let i=0; i< vm.dataRowRenderHtmlTable[key]['dossiers'].length; i++){
            let row = {
              colSpan: 1,
              text: '',
              bold: false,
              style: 'tdStyle',
              dossier: {}
            }
            for(let j=0;j<vm.headerRenderHtmlTable.length;j++){
              row.dossier[vm.headerRenderHtmlTable[j]['value']] = vm.dataRowRenderHtmlTable[key]['dossiers'][i][vm.headerRenderHtmlTable[j]['value']]
            }
            dataBody.push(row)
          }
        } 
        vm.dataBodyHTML = dataBody
        console.log('dataBody',dataBody)
        vm.tableType = 'table-1'
      } else {
        let body = vm.itemsReports[vm.index]['tableConfig']['docDefinition']['content'][2]['table']['body']
        let widths = vm.itemsReports[vm.index]['tableConfig']['docDefinition']['content'][2]['table']['widths']
        vm.widthRenderHtmlTable = widths
        vm.headerRenderHtmlTable = body
        console.log('headerRenderHtmlTable-1-a', vm.headerRenderHtmlTable)
        console.log('dataRowRenderHtmlTable', vm.dataRowRenderHtmlTable)
        vm.tableType = 'table-2'
      }

      vm.showHTML = true
    },
    changeMapping (item) {
      let vm = this
      setTimeout(function () {
        if (item.hasOwnProperty('parent')) {
          vm.data[item.parent] = ''
          let indexChildren = ''
          for (let key in vm.filters) {
            if (vm.filters[key]['key'] === item.parent) {
              indexChildren = key
              break
            }
          }
          console.log('indexChildren', indexChildren)
          if (indexChildren) {
            console.log('filters', vm.filters)
            console.log('data', vm.data)
            let keySearch = item['key']
            if (item.hasOwnProperty('keySearch')) {
              keySearch = item['keySearch']
            }
            vm.filters[indexChildren]['api'] = vm.filters[indexChildren]['api'].split('?')[0]
            vm.filters[indexChildren]['api'] += '?' + keySearch + '=' + vm.data[item['key']].toString()
            vm.$store.dispatch('loadDataSource', vm.filters[indexChildren]).then(function(result) {
              vm.filters[indexChildren]['source'] = result
              if (vm.filters[indexChildren]['appendItem']) {
                vm.filters[indexChildren]['source'] = vm.filters[indexChildren]['appendItem'].concat(result)
              }
            }).catch(function(){})
          }
        }
      }, 100)
    }
  }
}
</script>
