<template>
  <div style="width: 1300px; margin: 0 auto">
    <v-flex class="text-right">
      <div class="d-inline-block px-1 mr-2" style="border: 1px solid #dedede;border-radius: 4px;background: #fff;">
        <v-btn @click="toNativeViewType(1)" :flat="chartView === 1 ? false : true" depressed small color="#903938"
        class="mr-2" :class="chartView === 1 ? 'white--text' : ''" style="height: 30px;">Đơn vị cấp sở</v-btn>
        <v-btn @click="toNativeViewType(2)" :flat="chartView === 2 ? false : true" depressed small color="#903938"
        class="mr-2" :class="chartView === 2 ? 'white--text' : ''" style="height: 30px;">Đơn vị cấp huyện</v-btn>

        <v-menu right offset-x class="d-inline-block">
          <v-btn :flat="chartView === 3 ? false : true" depressed small color="#903938" 
            :class="chartView === 3 ? 'white--text' : ''" style="height: 30px;" slot="activator">
            <span>Đơn vị cấp xã</span> &nbsp; 
            <v-icon size="18" :style="chartView === 3 ? 'color: #fff !important' : ''">arrow_drop_down</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile v-for="(item, index) in listDonViCapXa" :key="index" @click="toNativeViewType(3, item)">
              <v-list-tile-title><v-icon size="18" class="blue--text" v-if="capXaSelected.value === item.value">
                check</v-icon>&nbsp; <span :style="capXaSelected.value === item.value ? 'color: #903938' : ''">{{item.text}}</span>
              </v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
    </v-flex>
    
    <v-layout wrap>
      <v-flex xs12 md5 class="pa-2">
        <div class="pa-2 v-sheet theme--light" style="height: 100%; border: 1px solid #dedede;">
          <div class="row-header" style="height: 38px; overflow: hidden;background: #fff">
            <div class="background-triangle-big1">THỐNG KÊ THEO NĂM</div>
            <v-layout wrap>
              <v-flex class="text-right">
                <v-select
                  style="width: 150px; display:inline-block; margin: 0 10px;"
                  :items="yearList"
                  item-value="value"
                  item-text="name"
                  v-model="yearSelected"
                  @change="getStatisticsYear"
                ></v-select>
              </v-flex>
            </v-layout>
          </div>
          <v-layout wrap align-center style="margin-top: 25px;">
            <v-flex md6 xs12>
              <apexchart
                type="pie"
                width=400 height=250
                :options="chartOptionsYear"
                :series="statisticalYear"
                class="pieChartTotal"
              ></apexchart>
            </v-flex>
            <v-flex md6 xs12>
              <v-layout wrap class="run-down">
                <v-flex xs12 text-center class="px-3">
                  <span style="color:#1976d2;">{{statistics.receivedCount}}</span>
                  <p>Tổng số đã tiếp nhận</p>
                </v-flex>
                <v-flex xs12 text-center class="px-3">
                  <span style="color:#1976d2;">{{statistics.releaseCount}}</span>
                  <p>Hoàn thành</p>
                </v-flex>
                <v-flex xs12 text-center class="px-3">
                  <span style="color:#1976d2;">{{statistics.processingCount}}</span>
                  <p>Đang xử lý</p>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
      <v-flex xs12 md7 class="pa-2">
        <div class="pa-2 v-sheet theme--light" style="border: 1px solid #dedede;">
          <div class="row-header mb-1" style="height: 38px; overflow: hidden;background: #fff">
            <div class="background-triangle-big1">THỐNG KÊ THEO THÁNG</div>
            <v-layout wrap>
              <v-flex class="text-right">
                <v-select
                  style="width: 150px; display:inline-block; margin: 0 10px;"
                  :items="yearList"
                  item-value="value"
                  item-text="name"
                  v-model="yearSelectedColumn"
                  @change="getStatisticsMonth"
                ></v-select>

              </v-flex>
            </v-layout>
          </div>
          <v-card-text class="px-0 py-0">
            <v-layout wrap class="custom-class">
              <v-flex xs12>
                <apexchart class="colum-chart" type="bar" height="300" :options="chartOptionsColumn" :series="seriesColumn"></apexchart>
              </v-flex>
            </v-layout>
          </v-card-text>
        </div>
      </v-flex>
      <v-flex xs12 class="pa-2">
        <div class="pa-2 v-sheet theme--light" style="border: 1px solid #dedede;">
          <div class="row-header" style="height: 38px; overflow: hidden;background: #fff">
            <div class="background-triangle-big1" style="width: auto;">THỐNG KÊ TỔNG HỢP</div>
            <v-layout wrap>
              <v-flex class="text-right">
                <v-select
                  v-model="monthSelected"
                  :items="monthList"
                  style="width: 120px; display:inline-block; margin: 0 10px;"
                  item-text="name"
                  item-value="value"
                  @change="getStatisticsReport"
                ></v-select>
                <v-select
                  v-model="yearSelected2"
                  :items="yearList"
                  style="width: 120px; display:inline-block; margin: 0 10px;"
                  item-text="name"
                  item-value="value"
                  @change="getStatisticsReport"
                ></v-select>
              </v-flex>
            </v-layout>
          </div>
          <v-layout wrap>
            <v-flex xs12 class="my-2 report__table" style="overflow: hidden;">
              <v-flex xs12 class="text-center text-bold my-3" v-if="chartView === 1">
                TỔNG HỢP TÌNH HÌNH GIẢI QUYẾT HỒ SƠ ĐƠN VỊ CẤP SỞ <br/>
                <span v-if="String(monthSelected) !== '0'">Tháng {{monthSelected}}</span> Năm {{yearSelected2}}
              </v-flex>
              <v-flex xs12 class="text-center text-bold my-3" v-if="chartView === 2">
                TỔNG HỢP TÌNH HÌNH GIẢI QUYẾT HỒ SƠ ĐƠN VỊ CẤP HUYỆN <br/>
                <span v-if="String(monthSelected) !== '0'">Tháng {{monthSelected}}</span> Năm {{yearSelected2}}
              </v-flex>
              <v-flex xs12 class="text-center text-bold my-3" v-if="chartView === 3">
                TỔNG HỢP TÌNH HÌNH GIẢI QUYẾT HỒ SƠ ĐƠN VỊ <span style="text-transform: uppercase;">{{capXaSelected.text}}</span> <br/>
                <span v-if="String(monthSelected) !== '0'">Tháng {{monthSelected}}</span> Năm {{yearSelected2}}
              </v-flex>
              <table class="my-2" hide-default-footer>
                <thead>
                  <tr>
                    <th rowspan="3" class="text-center px-2">
                      <span>STT</span>
                    </th>
                    <th rowspan="3" class="text-center px-2">
                      <span>Đơn vị</span>
                    </th>
                    <th width="80" rowspan="3" class="text-center px-2 py-1">
                      <span>Số đầu kỳ</span>
                    </th>
                    <th width="80" rowspan="3" class="text-center px-2">
                      <span>Kỳ trước chuyển qua</span>
                    </th>
                    <th width="80" rowspan="3" class="text-center px-2">
                      <span>Tiếp nhận trong kỳ</span>
                    </th>
                    <th colspan="7" class="px-2">
                      <span>Kết quả giải quyết trong kỳ</span>
                    </th>
                    <th width="80" rowspan="3" class="text-center px-2 py-1">
                      <span>Tổng số trễ hạn</span>
                    </th>
                    <th width="80" rowspan="3" class="text-center px-2">
                      <span>Hồ sơ trả lại</span>
                    </th>
                    <th width="80" rowspan="3" class="text-center px-2">
                      <span>Hồ sơ rút</span>
                    </th>
                  </tr>
                  <tr>
                    <th colspan="4" class="text-center px-2 py-2">
                      <span>Hồ sơ đã giải quyết xong</span>
                    </th>
                    <th colspan="3" class="text-center px-2 py-2">
                      <span>Hồ sơ đang giải quyết</span>
                    </th>
                  </tr>
                  <tr>
                    <th width="80" class="text-center px-2">
                      <span>Tổng số</span>
                    </th>
                    <th width="60" class="text-center px-2">
                      <span>Sớm hạn</span>
                    </th>
                    <th width="60" class="text-center px-2">
                      <span>Đúng hạn</span>
                    </th>
                    <th width="60" class="text-center px-2">
                      <span>Trễ hạn</span>
                    </th>
                    <th width="80" class="text-center px-2">
                      <span>Tổng số</span>
                    </th>
                    <th width="60" class="text-center px-2">
                      <span>Chưa đến hạn</span>
                    </th>
                    <th width="60" class="text-center px-2">
                      <span>Quá hạn</span>
                    </th>
                  </tr>
                </thead>
                <tbody v-if="loadingTable">
                  <tr class="note__column">
                    <td class="px-2" colspan="15">
                      <content-placeholders class="my-2">
                        <content-placeholders-text :lines="5" />
                      </content-placeholders>
                    </td>
                  </tr>
                </tbody>
                <tbody v-if="!loadingTable && danhSachThongKe.length > 0">
                  <tr class="note__column">
                    <td align="center" class="px-2">(1)</td>
                    <td align="center" class="px-2">(2)</td>
                    <td align="center" class="px-2">(3 = 4 + 5)</td>
                    <td align="center" class="px-2">(4)</td>
                    <td align="center" class="px-2">(5)</td>
                    <td align="center" class="px-2">(6 = 7 + 8 + 9)</td>
                    <td align="center" class="px-2">(7)</td>
                    <td align="center" class="px-2">(8)</td>
                    <td align="center" class="px-2">(9)</td>
                    <td align="center" class="px-2">(10 = 11 + 12)</td>
                    <td align="center" class="px-2">(11)</td>
                    <td align="center" class="px-2">(12)</td>
                    <td align="center" class="px-2">(13 = 9 + 12)</td>
                    <td align="center" class="px-2">(14)</td>
                    <td align="center" class="px-2">(15)</td>
                  </tr>
                  <tr v-for="(item,index) in danhSachThongKe" :key="index">
                    <td align="center" class="px-2">{{index + 1}}</td>
                    <td align="left" class="px-2" style="padding: 8px 10px;">{{item.govAgencyName}}</td>
                    <td align="center" class="px-2">{{item.processCount}}</td>
                    <td align="center"  class="px-2">{{item.remainingCount}}</td>
                    <td align="center" class="px-2">{{item.receivedCount}}</td>
                    <td align="center" class="px-2">{{item.releaseCount}}</td>
                    <td align="center" class="px-2" :style="item.betimesCount ? 'cursor: pointer;text-decoration: underline' : ''"
                      :title="item.betimesCount ? 'Xem danh sách hồ sơ' : ''" @click="item.betimesCount ? viewDossierList(item, 'betimesCount') : ''">
                      {{item.betimesCount}}
                    </td>
                    <td align="center" class="px-2" :style="item.ontimeCount ? 'cursor: pointer;text-decoration: underline' : ''"
                      :title="item.ontimeCount ? 'Xem danh sách hồ sơ' : ''" @click="item.ontimeCount ? viewDossierList(item, 'ontimeCount') : ''">
                      {{item.ontimeCount}}
                    </td>
                    <td align="center" class="px-2" :style="item.overtimeCount ? 'cursor: pointer;text-decoration: underline' : ''"
                      :title="item.overtimeCount ? 'Xem danh sách hồ sơ' : ''" @click="item.overtimeCount ? viewDossierList(item, 'overtimeCount') : ''">
                      {{item.overtimeCount}}
                    </td>
                    <td align="center" class="px-2">{{item.processingCount}}</td>
                    <td align="center" class="px-2" :style="item.undueCount ? 'cursor: pointer;text-decoration: underline' : ''"
                      :title="item.undueCount ? 'Xem danh sách hồ sơ' : ''" @click="item.undueCount ? viewDossierList(item, 'undueCount') : ''">
                      {{item.undueCount}}
                    </td>
                    <td align="center" class="px-2" :style="item.overdueCount ? 'cursor: pointer;text-decoration: underline' : ''"
                      :title="item.overdueCount ? 'Xem danh sách hồ sơ' : ''" @click="item.overdueCount ? viewDossierList(item, 'overdueCount') : ''">
                      {{item.overdueCount}}
                    </td>
                    <td align="center" class="px-2">{{item.overtimeCount + item.overdueCount}}</td>
                    <td align="center" class="px-2" :style="item.unresolvedCount ? 'cursor: pointer;text-decoration: underline' : ''"
                      :title="item.unresolvedCount ? 'Xem danh sách hồ sơ' : ''" @click="item.unresolvedCount ? viewDossierList(item, 'unresolvedCount') : ''">
                      {{item.unresolvedCount}}
                    </td>
                    <td align="center" class="px-2" :style="item.cancelledCount ? 'cursor: pointer;text-decoration: underline' : ''"
                      :title="item.cancelledCount ? 'Xem danh sách hồ sơ' : ''" @click="item.cancelledCount ? viewDossierList(item, 'cancelledCount') : ''">
                      {{item.cancelledCount}}
                    </td>
                  </tr>
                </tbody>
                <tbody v-if="!loadingTable && danhSachThongKe.length === 0">
                  <tr class="note__column">
                    <td align="center" class="px-2">(1)</td>
                    <td align="center" class="px-2">(2)</td>
                    <td align="center" class="px-2">(3 = 4 + 5)</td>
                    <td align="center" class="px-2">(4)</td>
                    <td align="center" class="px-2">(5)</td>
                    <td align="center" class="px-2">(6 = 7 + 8 + 9)</td>
                    <td align="center" class="px-2">(7)</td>
                    <td align="center" class="px-2">(8)</td>
                    <td align="center" class="px-2">(9)</td>
                    <td align="center" class="px-2">(10 = 11 + 12)</td>
                    <td align="center" class="px-2">(11)</td>
                    <td align="center" class="px-2">(12)</td>
                    <td align="center" class="px-2">(13 = 9 + 12)</td>
                    <td align="center" class="px-2">(14)</td>
                    <td align="center" class="px-2">(15)</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="sum__column" style="font-weight: bold;">
                    <td align="center" colspan="2">Tổng số</td>
                    <td align="center" class="px-2">{{totalCounter['total_3']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_4']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_5']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_6']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_7']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_8']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_9']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_10']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_11']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_12']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_13']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_14']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_15']}}</td>
                  </tr>
                </tfoot>
              </table>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
    </v-layout>
    <!--  -->
    <v-dialog v-model="dialog_dossier" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title class="">Danh sách hồ sơ</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon dark @click="dialog_dossier = false">
              <v-icon size="24">reply</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text v-if="reRender">
          <danh-sach-ho-so ref="danhsachhoso" :groupId="groupIdAgency" :apiGetDossier="apiGetDossier"></danh-sach-ho-so>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import TinyPagination from './Pagination.vue'
import DanhSachHoSo from './DanhSachHoSo'
export default {
  props: ['govAgencyInfo'],
  components: {
    'danh-sach-ho-so': DanhSachHoSo,
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    listDonViSBN: [],
    donViSBN: 'total',
    listDonViHuyen: [],
    donViHuyen: 'total',
    listDonViXa: [],
    capXaSelected: '',
    donViXa: 'total',
    groupCode: "SBN",
    isLoading: false,
    loadingTable: false,
    yearSelected: new Date().getFullYear(),
    yearSelected2: new Date().getFullYear(),
    yearSelectedColumn: new Date().getFullYear(),
    monthSelected: 0,
    distGroupSelected: "",
    statisticalYear: [0, 0],
    statisticalSBN: [0, 0, 0, 0, 0, 0],
    statisticalQUAN_HUYEN: [0, 0, 0, 0, 0, 0],
    statisticalXA_PHUONG: [0, 0, 0, 0, 0, 0],
    statisticalMonth: [
      {
        name: "Hồ sơ nộp trực tiếp",
        data: [0, 0]
      },
      {
        name: "Hồ sơ nộp trực tuyến",
        data: [0, 0]
      }
    ],
    chartOptionsYear: {
      labels: ["Hoàn thành đúng hạn", "Hoàn thành trễ hạn"],
      legend: {
        position: 'bottom'
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0,
          }
        },
        hover: {
          filter: {
            type: 'none',
            value: 0,
          }
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'none',
            value: 0,
          }
        },
      },
      colors: ['#00E396','#FF4560']
    },
    chartOptionsMonth: {
      plotOptions: {
        bar: {
          barHeight: '100%',
          horizontal: window.innerWidth < 600 ? false : true,
          dataLabels: {
            hideOverflowingLabels: true
          }
        },
      },
      chart: {
        stacked: true,
        locales: [{
          "name": "en",
          "options": {
            "toolbar": {
              "exportToSVG": "Tải xuống SVG",
              "exportToPNG": "Tải xuống PNG"
            }
          }
        }]
      },
      colors: ['#8BC34A', '#2196F3'],
      stroke: {
        width: 1,
        colors: ['#fff']
      },
      xaxis: {
        labels: {
          formatter: function(val) {
            return val
          },
          trim: false
        },
        min: 1
      },
      yaxis: {
        title: {
          text: undefined
        },
        labels: {
          offsetX: 0,
          offsetY: 0
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          if (Number(val) > 2) {return val}
          return ''
        },
        style: {
          fontSize: '11px',
          fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
          colors: ['white']
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val
          }
        }
      }
    },
    chartOptionsSoQuanXa: {
      labels: [
        "Đang giải quyết trong hạn",
        "Đang giải quyết quá hạn",
        "Hoàn thành đúng hạn",
        "Hoàn thành quá hạn",
        "Xin rút",
        "Chờ bổ sung"
      ],
      colors: ['#00E396','#FF4560','#008FFB','#775DD0','#2f8512','#FEB019'],
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0,
          }
        },
        hover: {
          filter: {
            type: 'none',
            value: 0,
          }
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'none',
            value: 0,
          }
        },
      }
    },
    chartOptionsColumn: {
      chart: {
        type: 'bar',
        height: 300,
        toolbar: {
            show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " hồ sơ"
          }
        }
      }
    },
    seriesColumn: [],
    seriesColumnDefault: [
      {
        name: 'Đã tiếp nhận',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }, {
        name: 'Hoàn thành',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }, {
        name: 'Đang xử lý',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    ],
    monthList: [
      { name: "Cả năm", value: 0 },
      { name: "Tháng 1", value: 1 },
      { name: "Tháng 2", value: 2 },
      { name: "Tháng 3", value: 3 },
      { name: "Tháng 4", value: 4 },
      { name: "Tháng 5", value: 5 },
      { name: "Tháng 6", value: 6 },
      { name: "Tháng 7", value: 7 },
      { name: "Tháng 8", value: 8 },
      { name: "Tháng 9", value: 9 },
      { name: "Tháng 10", value: 10 },
      { name: "Tháng 11", value: 11 },
      { name: "Tháng 12", value: 12 }
    ],
    listDoiTuong: [],
    statistics: {
      betimesCount: 1,
      cancelledCount: 0,
      companyId: 0,
      unresolvedCount: 0,
      domainCode: "",
      domainName: "",
      doneCount: 0,
      dossierOnline3Count: 0,
      dossierOnline4Count: 0,
      govAgencyCode: "",
      govAgencyName: "",
      groupId: 1,
      insideCount: 0,
      interoperatingCount: 0,
      month: 0,
      onegateCount: 0,
      onlineCount: 0,
      ontimeCount: 0,
      ontimePercentage: 0,
      outsideCount: 0,
      overdueCount: 0,
      overtimeCount: 0,
      overtimeInside: 0,
      overtimeOutside: 0,
      processCount: 0,
      processingCount: 0,
      receiveDossierSatCount: 0,
      receivedCount: 0,
      releaseCount: 0,
      releaseDossierSatCount: 0,
      releasingCount: 0,
      remainingCount: 0,
      reporting: false,
      saturdayCount: 0,
      system: 0,
      totalCount: 0,
      undueCount: 0,
      unresolvedCount: 0,
      viaPostalCount: 0,
      waitingCount: 0,
      year: 2020
    },
    danhSachThongKe: [],
    quanhuyenSelected: '',
    labelPieChartConfig: '',
    totalCounter: {},
    chartView: 1,
    listGroupIdAllSite: [],
    listDonViCapSo: [],
    listDonViCapHuyen: [],
    listDonViCapXa: [],

    dialog_dossier: false,
    reRender: false,
    apiGetDossier: '',
    groupIdAgency: ''
  }),
  computed: {
    yearList() {
      let arr = [];
      let year = new Date().getFullYear();
      for (let i = 0; i <= 3; i++) {
        arr.push({ name: "Năm " + (year - i), value: year - i });
      }
      return arr;
    },
    heightChart() {
      return this.statisticalMonth[0].data.length < 5 ? "300" : "auto";
    }
  },
  created() {
    let vm = this
    vm.$nextTick(() => {
      try {
        if (listGroupIdAllSiteConfig) {
          vm.listGroupIdAllSite = listGroupIdAllSiteConfig
        }
      } catch (error) {
      }
      try {
        if (listDonViXaConfig) {
          vm.listDonViCapXa = listDonViXaConfig
        }
      } catch (error) {
      }
      vm.getStatisticsYear()
      vm.getStatisticsMonth()
      vm.getStatisticsReport()
    })
  },
  watch: {
    
  },
  methods: {
    toNativeViewType (type, item) {
      let vm = this
      vm.chartView = type
      if (item) {
        vm.capXaSelected = item
      } else {
        vm.capXaSelected = ''
      }
      vm.getStatisticsYear()
      vm.getStatisticsMonth()
      vm.getStatisticsReport()
    },
    getStatisticsYear() {
      let vm = this
      let typeMethod = 'POST'
      let paramProxy = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId(),
            Token: window.Liferay ? window.Liferay.authToken : ''
          },
          params: {}
      }
      let dataUpdate = new URLSearchParams()
      let paramGetProxy = {
        year: vm.yearSelected,
        month: 0,
        domain: 'total',
        agency: 'total',
        groupCode: vm.chartView === 1 ? 'SBN' : (vm.chartView === 2 ? 'QUAN_HUYEN' : 'XA_PHUONG'),
        t: (new Date()).getTime()
      }
      if (vm.chartView === 3) {
        paramGetProxy = Object.assign(paramGetProxy, {parentAgency: vm.capXaSelected.code})
      }
     
      dataUpdate.append("method", "GET")
      dataUpdate.append("url", "/statistics")
      dataUpdate.append('data', JSON.stringify(paramGetProxy))
      axios({
        method: typeMethod,
        url: '/o/rest/v2/proxy',
        headers: paramProxy.headers,
        params: paramProxy.params,
        data: dataUpdate
      }).then(function (response) {
        if (response.data.data) {
          let totalData = response.data.data.filter(function (item) {
            return item.domainCode === '' && item.govAgencyCode === ''
          })[0]
          vm.statistics = totalData
          vm.statisticalYear = [
            totalData.ontimeCount + totalData.betimesCount,
            totalData.overtimeCount
          ]
        } else {
          vm.statisticalYear = [0, 0]
          vm.statistics = {
            receivedCount: 0,
            releaseCount: 0,
            processingCount: 0,
            overtimeCount: 0
          }
        }
      }).catch(function (error) {
        reject(error)
      })
    },
    getStatisticsMonth() {
      let vm = this
      let typeMethod = 'POST'
      let paramProxy = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId(),
            Token: window.Liferay ? window.Liferay.authToken : ''
          },
          params: {}
      }
      let dataUpdate = new URLSearchParams()
      let paramGetProxy = {
        year: vm.yearSelectedColumn,
        domain: 'total',
        groupCode: vm.chartView === 1 ? 'SBN' : (vm.chartView === 2 ? 'QUAN_HUYEN' : 'XA_PHUONG'),
        t: (new Date()).getTime()
      }
      if (vm.chartView === 3) {
        paramGetProxy = Object.assign(paramGetProxy, {parentAgency: vm.capXaSelected.code})
      }
      dataUpdate.append("method", "GET")
      dataUpdate.append("url", "/statistics")
      dataUpdate.append('data', JSON.stringify(paramGetProxy))
      axios({
        method: typeMethod,
        url: '/o/rest/v2/proxy',
        headers: paramProxy.headers,
        params: paramProxy.params,
        data: dataUpdate
      }).then(function (response) {
        vm.seriesColumn = vm.seriesColumnDefault
        if (response.data.hasOwnProperty('data') && response.data.data) {
          let currentData = response.data.data
          let dataItem1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          let dataItem2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          let dataItem3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          for (let i = 0; i < currentData.length; i++) {
            if (currentData[i]['month'] && String(currentData[i]['month']) !== '0' && String(currentData[i]['month']) !== '-1') {
              let index = Number(currentData[i]['month']) - 1
              dataItem1[index] += currentData[i]['receivedCount']
              dataItem2[index] += currentData[i]['releaseCount']
              dataItem3[index] += currentData[i]['processingCount']
            }
          }
          setTimeout(function () {
            vm.seriesColumn = [
              {
                name: 'Đã tiếp nhận',
                data: dataItem1
              }, {
                name: 'Hoàn thành',
                data: dataItem2
              }, {
                name: 'Đang xử lý',
                data: dataItem3
              }
            ]
          }, 300)
          
        }
      }).catch(function (error) {
        reject(error)
      })
    },
    getStatisticsReport() {
      let vm = this
      vm.loadingTable = true
      setTimeout (function () {
        vm.danhSachThongKe = []
        let typeMethod = 'POST'
        let paramProxy = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId(),
            Token: window.Liferay ? window.Liferay.authToken : ''
          },
          params: {}
        }
        let dataUpdate = new URLSearchParams()
        let paramGetProxy = {
          total: "agency",
          domain: "total",
          year: vm.yearSelected2,
          month: vm.monthSelected,
          groupCode: vm.chartView === 1 ? 'SBN' : (vm.chartView === 2 ? 'QUAN_HUYEN' : 'XA_PHUONG'),
          t: (new Date()).getTime()
        }
        if (vm.chartView === 3) {
          paramGetProxy = Object.assign(paramGetProxy, {parentAgency: vm.capXaSelected.code})
        }
        dataUpdate.append("method", "GET")
        dataUpdate.append("url", "/statistics")
        dataUpdate.append('data', JSON.stringify(paramGetProxy))
        axios({
          method: typeMethod,
          url: '/o/rest/v2/proxy',
          headers: paramProxy.headers,
          params: paramProxy.params,
          data: dataUpdate
        }).then(function (response) {
          vm.loadingTable = false
          if (response.data.hasOwnProperty('data') && response.data.data) {
            let dataTotal = ''
            dataTotal = response.data.data.filter(function (item) {
              return item.govAgencyCode === ''
            })[0]
            let dataRes = response.data.data.filter(function (item) {
              return item.govAgencyCode !== ''
            })
            let sortAgency = function (agency) {
              function compare(a, b) {
                if (a.govAgencyName < b.govAgencyName)
                  return -1
                if (a.govAgencyName > b.govAgencyName)
                  return 1
                return 0
              }
              return agency.sort(compare)
            }
            vm.danhSachThongKe = sortAgency(dataRes)
            
            let total = {
              'total_3': dataTotal.processCount,
              'total_4': dataTotal.remainingCount,
              'total_5': dataTotal.receivedCount,
              'total_6': dataTotal.releaseCount,
              'total_7': dataTotal.betimesCount,
              'total_8': dataTotal.ontimeCount,
              'total_9': dataTotal.overtimeCount,
              'total_10': dataTotal.processingCount,
              'total_11': dataTotal.undueCount,
              'total_12': dataTotal.overdueCount,
              'total_13': dataTotal.overtimeCount + dataTotal.overdueCount,
              'total_14': dataTotal.unresolvedCount,
              'total_15': dataTotal.cancelledCount
            }
            vm.totalCounter = total
          } else {
            vm.setTotalCounter()
          }
        }).catch(function (error) {
          vm.loadingTable = false
          vm.setTotalCounter()
        })
      }, 200)
    },
    viewDossierList (itemRecord, statusCount) {
      let vm = this
      let fromDate = '1/' + vm.monthSelected + '/' + vm.yearSelected2
      let toDate = '31/' + vm.monthSelected + '/' + vm.yearSelected2
      if (vm.monthSelected === 0) {
        fromDate = '1/1/' + vm.yearSelected2
        toDate = '31/12/' + vm.yearSelected2
      }
      vm.reRender = false
      if (statusCount === 'betimesCount') {
        vm.apiGetDossier = '/o/rest/v2/dossiers?status=releasing,posting,done&time=betimes&fromReleaseDate=' + fromDate + '&toReleaseDate=' + toDate
      }
      if (statusCount === 'ontimeCount') {
        vm.apiGetDossier = '/o/rest/v2/dossiers?status=releasing,posting,done&time=ontime&fromReleaseDate=' + fromDate + '&toReleaseDate=' + toDate
      }
      if (statusCount === 'overtimeCount') {
        vm.apiGetDossier = '/o/rest/v2/dossiers?status=releasing,posting,done&time=overtime&fromReleaseDate=' + fromDate + '&toReleaseDate=' + toDate
      }
      if (statusCount === 'undueCount') {
        vm.apiGetDossier = '/o/rest/v2/dossiers?status=processing,interoperating,planning&time=undue&fromReceiveDate=' + fromDate + '&toReceiveDate=' + toDate
      }
      if (statusCount === 'overdueCount') {
        vm.apiGetDossier = '/o/rest/v2/dossiers?status=processing,interoperating,planning&time=overdue&fromReceiveDate=' + fromDate + '&toReceiveDate=' + toDate
      }
      if (statusCount === 'unresolvedCount') {
        vm.apiGetDossier = '/o/rest/v2/dossiers?status=unresolved&fromReleaseDate=' + fromDate + '&toReleaseDate=' + toDate
      }
      if (statusCount === 'cancelledCount') {
        vm.apiGetDossier = '/o/rest/v2/dossiers?status=cancelled&fromReleaseDate=' + fromDate + '&toReleaseDate=' + toDate
      }
      if (vm.chartView === 3) {
        vm.groupIdAgency = vm.capXaSelected.value
        vm.apiGetDossier = vm.apiGetDossier + '&agency=' + itemRecord.govAgencyCode
      } else {
        console.log('listGroupIdAllSite', vm.listGroupIdAllSite)
        console.log('itemRecord', itemRecord)
        vm.groupIdAgency = vm.listGroupIdAllSite.filter(function (item) {
          return item.code === itemRecord.govAgencyCode
        })[0]['value']
      }
      console.log('groupIdAgency-api', vm.groupIdAgency, vm.apiGetDossier)
      vm.dialog_dossier = true
      vm.reRender = true
      setTimeout(function () {
        vm.$refs.danhsachhoso.initData()
      }, 100)
    },
    setTotalCounter () {
      let vm = this
      let total = {
        'total_3': 0,
        'total_4': 0,
        'total_5': 0,
        'total_6': 0,
        'total_7': 0,
        'total_8': 0,
        'total_9': 0,
        'total_10': 0,
        'total_11': 0,
        'total_12': 0,
        'total_13': 0,
        'total_14': 0,
        'total_15': 0
      }
      vm.totalCounter = total
    },
  }
};
</script>
