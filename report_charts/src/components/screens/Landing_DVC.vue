<template>
  <div class="form-chitiet">
    <div class="run-down mt-3" v-if="String(index) === '0'">
      <div class="box-title">Tình hình xử lý các năm</div>
      <div class="in-time">
        <span>{{itemTotalAllYear['ontimePercentage'] ? Math.round(itemTotalAllYear['ontimePercentage']) : 0}} %</span>
        Sớm và đúng hạn
      </div>
      <div class="fake-line"></div>
      <div class="total-solved">
        <span>{{itemTotalAllYear['processCount']}}</span>
        Tổng giải quyết
      </div>
      <div class="finished">
        <span>{{itemTotalAllYear['releaseCount']}}</span>
        Hoàn thành
      </div>
      <div class="processing">
        <span>{{itemTotalAllYear['processingCount']}}</span>
        Đang xử lý
      </div>
      <div class="take-back">
        <span>{{itemTotalAllYear['cancelledCount']}}</span>
        Rút hồ sơ
      </div>
    </div>
    <v-layout row wrap style="margin: 0;">
      <v-flex xs12 lg6 class="mt-3 pr-2" v-if="String(index) === '0'">
        <v-card class="wrap_report" style="border-radius: 0;height: 100%">
          <div class="row-header">
            <div class="background-triangle-big"> <span>THỐNG KÊ THỦ TỤC HÀNH CHÍNH</span> </div>
            <div class="layout row wrap header_tools row-blue">
            </div> 
          </div>
          <v-card-text class="pt-4 py-0 px-0">
            <v-layout wrap class="custom-class">
              <v-flex xs12 sm6 class="px-2 pb-3">
                <v-card color="green lighten-1" class="white--text" height="70px" style="border-radius: 4px;">
                  <v-layout class="px-2" style="height:70px">
                    <v-flex class="xs3 pt-1">
                      <v-btn outline fab color="white" depressed style="pointer-events:none;height:52px">
                        <v-icon size="32" color="#ffffff">timeline</v-icon>
                      </v-btn>
                    </v-flex>
                    <v-flex class="xs9 pl-4 pt-2">
                      <p><span>Thủ tục </span> <span class="text-bold">mức độ 2</span> </p>
                      <p class="text-bold" style="font-size: 1.75em">{{levelList[0]['count']}}</p>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-flex>
              <v-flex xs12 sm6 class="px-2 pb-3">
                <v-card color="orange lighten-1" class="white--text" height="70px" style="border-radius: 4px;">
                  <v-layout class="px-2" style="height:70px">
                    <v-flex class="xs3 pt-1">
                      <v-btn outline fab color="white" depressed style="pointer-events:none;height:52px">
                        <v-icon size="32" color="#ffffff">timeline</v-icon>
                      </v-btn>
                    </v-flex>
                    <v-flex class="xs9 pl-4 pt-2">
                      <p><span>Thủ tục </span> <span class="text-bold">mức độ 3</span> </p>
                      <p class="text-bold" style="font-size: 1.75em">{{levelList[1]['count']}}</p>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-flex>
              <v-flex xs12 sm6 class="px-2 pt-2 pb-3">
                <v-card color="red lighten-1" class="white--text" height="70px">
                  <v-layout class="px-2" style="height:70px">
                    <v-flex class="xs3 pt-1">
                      <v-btn outline fab color="white" depressed style="pointer-events:none;height:52px">
                        <v-icon size="32" color="#ffffff">timeline</v-icon>
                      </v-btn>
                    </v-flex>
                    <v-flex class="xs9 pl-4 pt-2">
                      <p><span>Thủ tục </span> <span class="text-bold">mức độ 4</span> </p>
                      <p class="text-bold" style="font-size: 1.75em">{{levelList[2]['count']}}</p>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-flex>
              <v-flex xs12 sm6 class="px-2 pt-2 pb-3">
                <v-card color="#00bcd5" class="white--text" height="70px">
                  <v-layout class="px-2" style="height:70px">
                    <v-flex class="xs3 pt-1">
                      <v-btn outline fab color="white" depressed style="pointer-events:none;height:52px">
                        <v-icon size="32" color="#ffffff">timeline</v-icon>
                      </v-btn>
                    </v-flex>
                    <v-flex class="xs9 pl-4 pt-2">
                      <p><span class="text-bold">TỔNG SỐ THỦ TỤC</span> </p>
                      <p class="text-bold" style="font-size: 1.75em">{{totalTTHC}}</p>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 lg6 class="mt-3 pl-2" v-if="String(index) === '0'">
        <v-card class="wrap_report" style="border-radius: 0;">
          <div class="row-header">
            <div class="background-triangle-big two-line"> 
              <span>TỔNG HỢP TÌNH HÌNH</span> <br>
              <span v-if="String(year) !== '0'">GIẢI QUYẾT HỒ SƠ NĂM {{year}}</span>
              <span v-else>GIẢI QUYẾT HỒ SƠ CÁC NĂM</span>
            </div>
            <div class="layout row wrap header_tools row-blue">
            </div> 
          </div>
          <v-card-text class="pt-2 pb-0 px-0 pie-chart" v-if="showTableTotal">
            <!-- <pie-chart-report-public :item="itemTotal" :year="year" :month="month" :chart_view="chartView"></pie-chart-report-public> -->
            <!-- report_1 -->
            <apexchart type=donut width=380 height=270 :options="chartDonutOptions" :series="seriesDonut" />
            <span class="d-inline-block total-pie-text">
              <p class="blue--text mb-0 text-bold" style="font-size: 1.25em">TỔNG SỐ HỒ SƠ: 
                <span style="font-size: 32px">
                  {{itemTotal.processingCount + itemTotal.waitingCount + itemTotal.releaseCount}}
                </span>
              </p>
            </span>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-card v-if="showDetailReport" class="wrap_report xs12 flex" style="border-radius: 0;">
        <v-card-text class="py-2 px-1 layout row wrap" style="
            background: #fafafa;
            margin: 0;
        ">
          <v-flex xs12 sm4 class="px-2" v-for="(item, index) in agencyLists" v-bind:key="index" v-if="((govAgencyCode === '' && item.govAgencyName !== '') || (govAgencyCode !== '' && item.domainName !== '') || (!chartView && item.domainName !== '')) && reloadPie">
            <pie-chart-report :item="item" :year="year" :month="month" :chart_view="chartView"></pie-chart-report>
          </v-flex>
        </v-card-text>
      </v-card>
      <!-- filter navigation -->
      <v-layout wrap class="mt-4 ml-0" :class="String(index) !== '0' ? 'mb-4' : ''">
        <v-flex xs12 >
          <div class="d-inline-block px-2" style="border: 1px solid #0054a6;border-radius: 4px;background: #fff;">
            <v-btn @click="toNativeViewType(true)" :flat="chartView ? false : true" depressed small color="#0054a6"
             class="mr-2" :class="chartView ? 'white--text' : ''" style="height: 24px;">Đơn vị</v-btn>
            <v-btn @click="toNativeViewType(false)" :flat="chartView ? true : false" depressed small color="#0054a6" 
            :class="chartView ? '' : 'white--text'" style="height: 24px;">Lĩnh vực</v-btn>
          </div>

          <div class="d-inline-block ml-3 px-2" style="border: 1px solid #0054a6;border-radius: 4px;background: #fff;">
            <v-btn @click="changeSystem('total')" :flat="systemReport !== 'total' ? true : false" :class="systemReport === 'total' ? 'white--text' : ''" small color="#0054a6" depressed class="mr-2" style="height: 24px;">Tất cả các hệ thống</v-btn>
            <v-btn @click="changeSystem('0')" :flat="systemReport !== '0' ? true : false" :class="systemReport === '0' ? 'white--text' : ''" small depressed color="#0054a6" class="mr-2" title="Dịch vụ công và một cửa điện tử" style="height: 24px;">DVC-MCĐT</v-btn>
            <v-btn @click="changeSystem('1')" :flat="systemReport !== '1' ? true : false" :class="systemReport === '1' ? 'white--text' : ''" small depressed color="#0054a6" class="mr-2" style="height: 24px;">NSW</v-btn>
            <v-btn @click="changeSystem('2')" :flat="systemReport !== '2' ? true : false" :class="systemReport === '2' ? 'white--text' : ''" small depressed color="#0054a6" class="" style="height: 24px;">Phần mềm nghiệp vụ</v-btn>
          </div>

          <v-layout wrap class="right date-filter">
            <v-flex class="mr-2" :style="String(year) !== '0' ? 'width:125px' : 'width:155px'">
              <v-select
                :items="years"
                v-model="year"
                item-text="name"
                item-value="value"
                @change="changeYear"
                class="d-inline-block text-bold"
                solo
                flat
                background-color="#fff"
                style="border: 1px solid #0054a6; border-radius: 3px;height:36px"
                hide-details
                >
                <template v-slot:selection="{ item, index }">
                  <span style="color: #0054a6 !important">{{item ? item['name'] : ''}}</span>
                </template>
              </v-select>
            </v-flex>
            <v-flex class="mr-2" style="width:125px">
              <v-select
                :items="months"
                v-model="month"
                item-text="name"
                item-value="value"
                :hide-selected="true"
                @change="changeMonth"
                class="d-inline-block text-bold"
                solo
                flat
                background-color="#fff"
                style="border: 1px solid #0054a6; border-radius: 3px; height:36px"
                hide-details
                :disabled="String(year) === '0'"
                >
                <template v-slot:selection="{ item, index }">
                  <span style="color: #0054a6 !important">{{item ? item['name'] : ''}}</span>
                </template>
              </v-select>
            </v-flex>
            <v-flex class="" style="width:80px;border: 1px solid #0054a6; border-radius: 3px; height:36px;background: #fff">
              <v-tooltip bottom class="ml-1">
                <v-btn icon class="mx-0 my-0" slot="activator" v-on:click.native="toNativeView(0)">
                  <v-icon size="16" :color="String(index) === '0' ? 'blue' : 'grey'">pie_chart</v-icon>
                </v-btn>
                <span>Xem dạng biểu đồ</span>
              </v-tooltip>
              <v-tooltip bottom>
                <v-btn icon class="mx-0 my-0" slot="activator" v-on:click.native="toNativeView(1)">
                  <v-icon size="16" :color="String(index) !== '0' ? 'blue' : 'grey'">grid_on</v-icon>
                </v-btn>
                <span>Xem dạng bảng biểu</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <!-- Thống kê theo đơn vị, lĩnh vực -->
      <v-flex xs12 class="mt-4 ml-0" v-if="!reloadBar && String(index) === '0'">
        <v-card class="wrap_report" style="border-radius: 0;">
          <div class="row-header" v-if="String(month) !== '0'">
            <div class="background-triangle-big"> <span>TÌNH HÌNH GIẢI QUYẾT HỒ SƠ THÁNG {{month}} NĂM {{year}}</span> </div>
            <div class="layout row wrap header_tools row-blue">
            </div> 
          </div>
          <div class="row-header" v-else>
            <div class="background-triangle-big">
              <span v-if="String(year) !== '0'">TÌNH HÌNH GIẢI QUYẾT HỒ SƠ NĂM {{year}}</span> 
              <span v-else>TÌNH HÌNH GIẢI QUYẾT HỒ SƠ CÁC NĂM </span> 
            </div>
            <div class="layout row wrap header_tools row-blue">
            </div> 
          </div>
          <v-card-text class="pt-2 pb-0 px-0">
            <div v-if="noReportData" class="py-3">
              <v-alert
                :value="true"
                color="info"
                icon="info"
                outline
              >
                Không có dữ liệu báo cáo
              </v-alert>
            </div>
            <!-- report_2 -->
            <apexchart v-else type="bar" height="350" 
              :options="chartOptionsBarTotal" 
              :series="seriesChartBarTotal" 
              :stacked="true"
              style="margin-top: -30px"
            ></apexchart>
          </v-card-text>
        </v-card>
      </v-flex>
      <!-- Thống kê theo hình thức nộp hồ sơ -->
      <v-flex xs12 class="mt-4 ml-0" v-if="!reloadBar && !noReportData && String(index) === '0'">
        <v-card class="wrap_report" style="border-radius: 0;">
          <div class="row-header" v-if="String(month) !== '0'">
            <div class="background-triangle-big"> <span>TỔNG SỐ HỒ SƠ TIẾP NHẬN THÁNG {{month}} NĂM {{year}}</span> </div>
            <div class="layout row wrap header_tools row-blue">
            </div> 
          </div>
          <div class="row-header" v-else>
            <div class="background-triangle-big"> 
              <span v-if="String(year) !== '0'">TỔNG SỐ HỒ SƠ TIẾP NHẬN NĂM {{year}}</span>
              <span v-else>THỐNG KÊ TỔNG SỐ HỒ SƠ TIẾP NHẬN CÁC NĂM</span> 
            </div>
            <div class="layout row wrap header_tools row-blue">
            </div> 
          </div>
          <v-card-text class="pt-2 pb-0 px-0">
            <!-- report_3 -->
            <apexchart type="bar" height="500"
              :options="dossierTypeChartOption" 
              :series="seriesDossierTypeChart" 
              style="margin-top: -30px"
            ></apexchart>
          </v-card-text>
        </v-card>
      </v-flex>

      <!-- <v-flex xs12 class="mt-4 ml-0 mr-2" v-if="!reloadBar">
        <v-card class="wrap_report" style="border-radius: 0;">
          <div class="row-header" v-if="String(month) !== '0'">
            <div class="background-triangle-big"> <span>TÌNH HÌNH GIẢI QUYẾT HỒ SƠ THÁNG {{month}} NĂM {{year}}</span> </div>
            <div class="layout row wrap header_tools row-blue">
            </div> 
          </div>
          <div class="row-header" v-else>
            <div class="background-triangle-big"> <span>TÌNH HÌNH GIẢI QUYẾT HỒ SƠ NĂM {{year}}</span> </div>
            <div class="layout row wrap header_tools row-blue">
            </div> 
          </div>
          <v-card-text class="pt-2 pb-0 px-0">
            <apexchart type="bar" height="350"
              :options="chartOptionsBar" 
              :series="seriesChartBar" 
            ></apexchart>
          </v-card-text>
        </v-card>
      </v-flex> --> 

      <v-flex xs12 class="mt-4 ml-0" v-if="!reloadLine && year !== '0' && String(index) === '0'" id="lineChartID">
        <v-card class="wrap_report" style="border-radius: 0">
          <div class="row-header">
            <div class="background-triangle-big"> 
              <span v-if="String(year) !== '0'">THỐNG KÊ TỔNG SỐ HỒ SƠ ĐÃ TIẾP NHẬN NĂM {{year}}</span> 
              <span v-else>THỐNG KÊ TỔNG SỐ HỒ SƠ ĐÃ TIẾP NHẬN CÁC NĂM</span> 
            </div>
            <div class="layout row wrap header_tools row-blue">
            </div>
          </div>
          <v-card-text class="pt-2 pb-0 px-0">
            <div v-if="noReportDataLine" class="py-3">
              <v-alert
                :value="true"
                color="info"
                icon="info"
                outline
              >
                Không có dữ liệu báo cáo
              </v-alert>
            </div>
            <!-- report_4 -->
            <apexchart v-else type="line" height="500"
              :options="chartOptions" 
              :series="seriesChart"
              style="margin-top: -30px;"
            ></apexchart>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <!--  -->
    <div v-if="String(index) === '1'">
      <v-card class="py-4" style="border-radius: 0;box-shadow: none;
        border-bottom: 1px solid #ddd;">
        <v-card-text>
          <v-layout wrap id="contentToPDF">
            <v-flex xs7 class="text-center text-bold">
            </v-flex>
            <v-flex xs5 class="text-center text-bold">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM <br/>
              Độc lập - Tự do - Hạnh phúc 
              <hr align="center" width="120px" style="margin: auto;">
            </v-flex>
            <v-flex xs7 class="text-center text-bold">
            </v-flex>
            <v-flex xs5 class="text-center mt-2">
              Ngày {{currentDay}} tháng {{currentMonth}} năm {{(new Date()).getFullYear()}} 
            </v-flex>
            <v-flex xs12 class="text-center text-bold mt-3 fs14">
              BÁO CÁO TỔNG HỢP TÌNH HÌNH GIẢI QUYẾT THỦ TỤC HÀNH CHÍNH <br/>
              <span v-if="String(month) !== '0'">Tháng {{month}}</span> Năm {{year}}
            </v-flex>
            <div class="mt-3 report__table">
              <table>
                <thead>
                  <tr>
                    <th rowspan="5" colspan="1" width="60"><span>STT</span></th>
                    <th rowspan="5" colspan="1"><span v-if="govAgencyCode !== '' || String(chartView) === 'false'">Lĩnh vực</span> <span v-else>Đơn vị</span></th>
                    <th rowspan="1" colspan="5">Nhận giải quyết</th>
                    <th rowspan="1" colspan="7">Kết quả giải quyết</th>

                    <th rowspan="1" colspan="3">Đang giải quyết</th>
                    <th rowspan="5" colspan="1" width="60">Tạm dừng bổ sung điều kiện</th>
                    <th rowspan="5" colspan="1" width="60">Rút không giải quyết</th>
                    <th rowspan="5" colspan="1" width="60">Tỉ lệ sớm và đúng hạn</th>
                  </tr>
                  <tr>
                    <th rowspan="4" colspan="1" width="60">Tổng số</th>
                    <th rowspan="4" colspan="1" width="60">Tồn trước</th>
                    <th rowspan="1" colspan="3">Nhận trong kỳ</th>
                    <th rowspan="4" colspan="1" width="60">Tổng số</th>
                    <th rowspan="1" colspan="3">Tình hình thực hiện</th>
                    <th rowspan="4" colspan="1" width="60">Từ chối giải quyết</th>
                    <th rowspan="1" colspan="2">Trả kết quả</th>
                    <th rowspan="4" colspan="1" width="60">Tổng số</th>
                    <th rowspan="4" colspan="1" width="60">Còn hạn</th>
                    <th rowspan="4" colspan="1" width="60">Quá hạn</th>
                  </tr>
                  <tr>
                    <th rowspan="3" width="60">Tổng số</th>
                    <th rowspan="3" width="60">Một cửa</th>
                    <th rowspan="3" width="60">Trực tuyến</th>
                    <th rowspan="3" width="60">Trước hạn</th>
                    <th rowspan="3" width="60">Đúng hạn</th>
                    <th rowspan="3" width="60">Quá hạn</th>
                    <th rowspan="3" width="60">Đã trả</th>
                    <th rowspan="3" width="60">Chưa trả</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="note__column">
                    <td align="center">(1)</td>
                    <td align="center">(2)</td>
                    <td align="center">(3)</td>
                    <td align="center">(4)</td>
                    <td align="center">(5)</td>
                    <td align="center">(6)</td>
                    <td align="center">(7)</td>
                    <td align="center">(8)</td>
                    <td align="center">(9)</td>
                    <td align="center">(10)</td>
                    <td align="center">(11)</td>
                    <td align="center">(12)</td>
                    <td align="center">(13)</td>
                    <td align="center">(14)</td>
                    <td align="center">(15)</td>
                    <td align="center">(16)</td>
                    <td align="center">(17)</td>
                    <td align="center">(18)</td>
                    <td align="center">(19)</td>
                    <td align="center">(20)</td>
                  </tr>
                  <tr v-for="(item, index) in agencyLists" v-bind:key="index" v-if="((govAgencyCode === '' || String(chartView) === 'true') && item.govAgencyName !== '') || ((govAgencyCode !== ''  || String(chartView) === 'false') && item.domainName !== '')">
                    <td align="center">{{index}}</td>
                    <td v-if="govAgencyCode !== '' || String(chartView) === 'false'" align="left" style="padding: 8px 10px;">{{item.domainName}}</td>
                    <td v-else align="left" style="padding: 8px 10px;">{{item.govAgencyName}}</td>
                    <td align="center">{{item.processCount}}</td>
                    <td align="center">{{item.remainingCount}}</td>
                    <td align="center">{{item.receivedCount}}</td>
                    <td align="center">{{item.onegateCount}}</td>
                    <td align="center">{{item.onlineCount}}</td>
                    <td align="center">{{item.releaseCount}}</td>
                    <td align="center">{{item.betimesCount}}</td>
                    <td align="center">{{item.ontimeCount}}</td>
                    <td align="center">{{item.overtimeCount}}</td>
                    <td align="center">{{item.unresolvedCount}}</td>
                    <td align="center">{{item.doneCount}}</td>
                    <td align="center">{{item.releasingCount}}</td>
                    <td align="center">{{item.processingCount}}</td>
                    <td align="center">{{item.undueCount}}</td>
                    <td align="center">{{item.overdueCount}}</td>
                    <td align="center">{{item.waitingCount}}</td>
                    <td align="center">{{item.cancelledCount}}</td>
                    <td align="center">{{item.ontimePercentage}}</td>
                  </tr>
                  <tr class="sum__column" style="font-weight: bold;" v-if="showTable">
                    <td align="center" colspan="2">Tổng số</td>
                    <td align="center ">{{totalCounter['total_3']}}</td>
                    <td align="center">{{totalCounter['total_4']}}</td>
                    <td align="center">{{totalCounter['total_5']}}</td>
                    <td align="center">{{totalCounter['total_6']}}</td>
                    <td align="center">{{totalCounter['total_7']}}</td>
                    <td align="center">{{totalCounter['total_8']}}</td>
                    <td align="center">{{totalCounter['total_9']}}</td>
                    <td align="center">{{totalCounter['total_10']}}</td>
                    <td align="center">{{totalCounter['total_11']}}</td>
                    <td align="center">{{totalCounter['total_12']}}</td>
                    <td align="center">{{totalCounter['total_13']}}</td>
                    <td align="center">{{totalCounter['total_14']}}</td>
                    <td align="center">{{totalCounter['total_15']}}</td>
                    <td align="center">{{totalCounter['total_16']}}</td>
                    <td align="center">{{totalCounter['total_17']}}</td>
                    <td align="center">{{totalCounter['total_18']}}</td>
                    <td align="center">{{totalCounter['total_19']}}</td>
                    <td align="center">{{totalCounter['total_20']}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </v-layout>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>

import { PieChartReport, PieChartReportPublic } from '@/components'
import $ from 'jquery'
export default {
  props: ['index', 'id'],
  components: {
    PieChartReport,
    PieChartReportPublic
  },
  data: () => ({
    systemReport: '',
    showDetailReport: false,
    itemTotalAllYear: {},
    itemTotal: {},
    levelList: [
      {level: 2, count: "0", levelName: 2},
      {level: 3, count: "0", levelName: 3},
      {level: 4, count: "0", levelName: 4}
    ],
    totalTTHC: 0,
    chartView: true,
    currentMonth: ((new Date()).getMonth() + 1) < 10 ? '0' + ((new Date()).getMonth() + 1) : ((new Date()).getMonth() + 1),
    currentDay: (new Date()).getDate() < 10 ? '0' + (new Date()).getDate() : (new Date()).getDate(),
    agencyGroups: [],
    noReportData: false,
    noReportDataLine: false,
    isCallBack: true,
    reloadPie: true,
    reloadBar: true,
    reloadLine: true,
    showTable: false,
    agencyLists: [],
    agencyListsMonth: [],
    group: '',
    years: [
      {
        'value': '2019',
        'name': 'Năm 2019'
      },
      {
        'value': '2018',
        'name': 'Năm 2018'
      },
      {
        'value': '2017',
        'name': 'Năm 2017'
      }
    ],
    year: (new Date()).getFullYear() + '',
    months: [
      {
        'value': '0',
        'name': 'Cả năm'
      },
      {
        'value': '1',
        'name': 'Tháng 1'
      },
      {
        'value': '2',
        'name': 'Tháng 2'
      },
      {
        'value': '3',
        'name': 'Tháng 3'
      },
      {
        'value': '4',
        'name': 'Tháng 4'
      },
      {
        'value': '5',
        'name': 'Tháng 5'
      },
      {
        'value': '6',
        'name': 'Tháng 6'
      },
      {
        'value': '7',
        'name': 'Tháng 7'
      },
      {
        'value': '8',
        'name': 'Tháng 8'
      },
      {
        'value': '9',
        'name': 'Tháng 9'
      },
      {
        'value': '10',
        'name': 'Tháng 10'
      },
      {
        'value': '11',
        'name': 'Tháng 11'
      },
      {
        'value': '12',
        'name': 'Tháng 12'
      }
    ],
    month: ((new Date()).getMonth() + 1) + '',
    danhSachBaoCaos: [],
    totalCounter: {},
    reportGovName: '',
    govAgencyCode: '',
    chartOptions: {
      chart: {
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
      xaxis: {
        categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
      },
      // colors: ['#77B6EA', '#545454'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        }
      },
      markers: {
        size: 3,
        hover: {
          size: 4,
          sizeOffset: 4
        }
      },
      tooltip: {
        y: {
          formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
            if (value) {
              return value
            }
          }
        }
      }
    },
    chartDonutOptions: {
      labels: ['Đang xử lý', 'Đang chờ bổ sung', 'Đã giải quyết'],
      colors: ['#8BC34A', '#FFC107', '#2196F3'],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '12px',
                fontFamily: 'Roboto, Arial, sans-serif',
                color: undefined,
                offsetY: 5
              },
              value: {
                show: true,
                fontSize: '24px',
                fontFamily: 'Roboto, Arial, sans-serif',
                color: undefined,
                offsetY: 20,
                formatter: function (val, w) {
                  let total = w.globals.seriesTotals.reduce((a, b) => {
                    return a + b
                  }, 0)
                  return Math.round((val/total)*100)+' %'
                }
              },
              total: {
                show: true,
                label: 'Sớm và đúng hạn',
                color: '#ff5c24',
                formatter: function (w) {
                }
              }
            }
          }
        }
      },
      dataLabels: {
        enabled: false
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
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 220
          },
          legend: {
            show: false
          }
        }
      }],
      legend: {
        position: 'left',
        offsetY: 0,
        height: 120,
        fontFamily: 'Roboto, Arial, sans-serif',
        formatter: function(seriesName, opts) {
          return '<span class="text-bold" style="color:' + opts.w.globals.colors[opts.seriesIndex]+ '">' +
           opts.w.globals.series[opts.seriesIndex] + '</span>&nbsp; &nbsp;' + seriesName
        }
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: function(val) {
            return val + " hồ sơ"
          },
          title: {
            formatter: function (seriesName) {
              return ''
            }
          }
        },
        fixed: {
          enabled: true,
          position: 'topRight',
          offsetX: 0,
          offsetY: 0,
        }
      }
    },
    seriesDonut: [],
    toolbar: {
      show: false
    },
    seriesChart: [{
      name: 'Series A',
      data: [30, 40, 45, 50, 49, 60, 70, 91]
    }, {
      name: 'Series B',
      data: [23, 43, 54, 12, 44, 52, 32, 11]
    }],
    chartOptionsBar: {
    },
    seriesChartBar: [{
      data: [0]
    }],
    chartOptionsBarTotal: {
    },
    seriesChartBarTotal: [],
    dossierTypeChartOption: {
      plotOptions: {
        bar: {
          // barHeight: '100%',
          columnWidth: '40%',
          horizontal: false
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
      colors: ['#4FC3F7', '#B3E5FC'],
      stroke: {
        width: 1,
        colors: ['#fff']
      },
      xaxis: {
        categories: [],
        labels: {
          show: true,
          rotate: 0,
          rotateAlways: false,
          trim: false,
          formatter: function(val) {
            return val
          }
        }
      },
      yaxis: {
        title: {
          text: undefined
        }
      },
      dataLabels: {
        formatter: function(val) {
          if (Number(val) > 2) {return val}
          return ''
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
    seriesDossierTypeChart: [
      {
        name: 'Hồ sơ nộp trực tiếp',
        data: []
      },{
        name: 'Hồ sơ nộp trực tuyến',
        data: []
      }
    ],
    labelOfLine: [],
    showTableTotal: false
  }),
  computed: {
    loadingMenuConfigToDo () {
      return this.$store.getters.loadingMenuConfigToDo
    },
    options () {
      return {
        duration: 300,
        offset: 0,
        easing: 'easeInOutCubic'
      }
    }
  },
  created () {
    var vm = this
    $('html').addClass('report')
    vm.$nextTick(function () {
      let currentYear = (new Date()).getFullYear()
      vm.years = []
      try {
        if (yearsFilterConfig) {
          let yearsFilter = yearsFilterConfig.split(',') /**Năm báo cáo theo cấu hình */
          for (let i = 0; i<yearsFilter.length; i++) {
            vm.years.push(
              {
                'value': String(yearsFilter[i]),
                'name': 'Năm ' + String(yearsFilter[i])
              }
            )
          }
          if (String(yearsFilter[0]) === '0') {
            vm.years.unshift({
              'value': '0',
              'name': 'Tất cả các năm'
            })
          }
        } else {
          for (let j = 0; j<=2; j++) {
            vm.years.push(
              {
                'value': String(Number(currentYear) - j),
                'name': 'Năm ' + String(Number(currentYear) - j)
              }
            )
          }
        }
      } catch (error) {
        for (let i = 0; i<=2; i++) {
          vm.years.push(
            {
              'value': String(Number(currentYear) - i),
              'name': 'Năm ' + String(Number(currentYear) - i)
            }
          )
        }
      }
      let currentParams = vm.$router.history.current.params
      let currentQuerys = vm.$router.history.current.query
      if (currentParams.hasOwnProperty('index') && vm.isCallBack) {
        vm.isCallBack = false
        vm.reportGovName = ''
        vm.govAgencyCode = ''
        if (currentQuerys.hasOwnProperty('year')) {
          vm.year = currentQuerys.year
        }
        if (currentQuerys.hasOwnProperty('month')) {
          vm.month = currentQuerys.month
        }
        if (currentQuerys.hasOwnProperty('group')) {
          vm.group = currentQuerys.group
        }
        if (currentQuerys.hasOwnProperty('reportGovName')) {
          vm.reportGovName = currentQuerys.reportGovName
        }
        if (currentQuerys.hasOwnProperty('govAgencyCode')) {
          vm.govAgencyCode = currentQuerys.govAgencyCode
        }
        if (currentQuerys.hasOwnProperty('chartView')) {
          vm.chartView = (currentQuerys.chartView === 'true')
        }
        if (currentQuerys.hasOwnProperty('system')) {
          vm.systemReport = currentQuerys.system
        }
        vm.doStaticsReport()
        vm.$store.dispatch('getLevelList').then(function (result) {
          let totalXXX = 0
          for (let key in result) {
            totalXXX = totalXXX + parseInt(result[key]['count'])
            if (result[key]['level'] === 2) {
              vm.levelList[0]['count'] = result[key]['count']
            } else if (result[key]['level'] === 3) {
              vm.levelList[1]['count'] = result[key]['count']
            } else if (result[key]['level'] === 4) {
              vm.levelList[2]['count'] = result[key]['count']
            }
          }
          vm.totalTTHC = totalXXX
        })
        vm.showTableTotal = false
        vm.itemTotal = ''
        vm.$store.dispatch('getReportTotal', vm.year).then(function (result) {
          let agencyListsTotal = result
          for (let key in agencyListsTotal) {
            let currentData = agencyListsTotal[key]
            if (currentData.domainName === '' && currentData.domainName === '') {
              vm.itemTotal = currentData
              vm.showTableTotal = true
              break
            }
          }
          if (vm.itemTotal === '') {
            vm.showTableTotal = false
          }
        })
        vm.$store.dispatch('getReportTotal', '0').then(function (result) {
          let agencyListsTotal = result
          for (let key in agencyListsTotal) {
            let currentData = agencyListsTotal[key]
            if (currentData.domainName === '' && currentData.govAgencyName === '') {
              vm.itemTotalAllYear = currentData
              console.log('itemTotalAllYear', vm.itemTotalAllYear)
              vm.showTableTotal = true
              break
            }
          }
          if (vm.itemTotal === '') {
            vm.showTableTotal = false
          }
        })
      }
    })
  },
  mounted () {
    let vm = this
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      console.debug(oldRoute)
      let currentQuerys = newRoute.query
      vm.reportGovName = ''
      vm.govAgencyCode = ''
      console.log('currentQuerys', currentQuerys)
      if (currentQuerys.hasOwnProperty('year')) {
        vm.year = currentQuerys.year + ''
      } else {
        vm.year = (new Date()).getFullYear() + ''
      }
      if (currentQuerys.hasOwnProperty('month')) {
        vm.month = currentQuerys.month + ''
      } else {
        vm.month = ((new Date()).getMonth() + 1) + ''
      }
      if (currentQuerys.hasOwnProperty('reportGovName')) {
        vm.reportGovName = currentQuerys.reportGovName
      }
      if (currentQuerys.hasOwnProperty('reportGovName')) {
        vm.reportGovName = currentQuerys.reportGovName
      }
      if (currentQuerys.hasOwnProperty('govAgencyCode')) {
        vm.govAgencyCode = currentQuerys.govAgencyCode
      }
      if (currentQuerys.hasOwnProperty('chartView')) {
        if (currentQuerys.chartView === 'true' || currentQuerys.chartView) {
          vm.chartView = true
        } else {
          vm.chartView = false
        }
      }
      if (currentQuerys.hasOwnProperty('system')) {
        vm.systemReport = currentQuerys.system
      }
      vm.doStaticsReport()
    },
    reloadLine (val) {
      let vm = this
      let currentQuerys = vm.$router.history.current.query
      if (!val && String(vm.index) !== '0' && currentQuerys.hasOwnProperty('lineChart') && currentQuerys['lineChart']) {
        setTimeout(function () {
          vm.$vuetify.goTo('#lineChartID', vm.options)
        }, 300)
      }
    },
    itemTotal (val) {
      // data report_1
      let vm = this
      if (val) {
        vm.seriesDonut[0] = val['processingCount'] /**Đang xử lý còn hạn */
        vm.seriesDonut[1] = val['waitingCount'] /**Đang xử lý quá hạn */
        vm.seriesDonut[2] = val['releaseCount'] /**Đang bổ sung điều kiện */
        vm.chartDonutOptions.plotOptions = {
          pie: {
            donut: {
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '12px',
                  fontFamily: 'Roboto, Arial, sans-serif',
                  color: undefined,
                  offsetY: 5
                },
                value: {
                  show: true,
                  fontSize: '24px',
                  fontFamily: 'Roboto, Arial, sans-serif',
                  color: undefined,
                  offsetY: 20,
                  formatter: function (val, w) {
                    let total = w.globals.seriesTotals.reduce((a, b) => {
                      return a + b
                    }, 0)
                    return Math.round((val/total)*100)+' %'
                  }
                },
                total: {
                  show: true,
                  label: 'Sớm và đúng hạn',
                  color: '#00E396',
                  formatter: function (w) {
                    return val['ontimePercentage']+' %'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  methods: {
    toNativeViewType (type) {
      let vm = this
      // let currentQuerys = vm.$router.history.current.query
      // if (currentQuerys.hasOwnProperty('chartView')) {
      //   let changTypeCHK = (currentQuerys.chartView === 'true' || currentQuerys.chartView)
      //   console.log('changTypeCHK', changTypeCHK)
      //   if (String(changTypeCHK) === 'true') {
      //     vm.chartView = false
      //     console.log('changTypeCHK1', vm.chartView)
      //   } else {
      //     vm.chartView = true
      //     console.log('changTypeCHK2', vm.chartView)
      //   }
      // } else {
        vm.chartView = type
      // }
      console.log('toNativeViewType', vm.chartView)
      vm.$router.push({
        path: '/bao-cao/' + vm.index,
        query: {
          year: vm.year,
          month: vm.month,
          group: vm.group,
          chartView: vm.chartView,
          system: vm.systemReport
        }
      })
    },
    changeSystem (type) {
      let vm = this
      vm.systemReport = type
      vm.$router.push({
        path: '/bao-cao/' + vm.index,
        query: {
          year: vm.year,
          month: vm.month,
          group: vm.group,
          chartView: vm.chartView,
          system: vm.systemReport
        }
      })
    },
    toNativeViewBack (data) {
      let vm = this
      vm.$router.push({
        path: '/bao-cao/' + data,
        query: {
          year: vm.year,
          month: vm.month,
          group: vm.group
        }
      })
    },
    toNativeView (data, lineChart) {
      let vm = this
      let query = {
        year: vm.year,
        month: vm.month,
        group: vm.group,
        reportGovName: vm.reportGovName,
        govAgencyCode: vm.govAgencyCode,
        lineChart: lineChart ? true : false
      }
      vm.$router.push({
        path: '/bao-cao/' + data,
        query: query
      })
      if (lineChart) {
        vm.$vuetify.goTo('#lineChartID', vm.options)
      }
    },
    doStaticsReport () {
      let vm = this
      let filter = {
        year: vm.year,
        month: vm.month,
        group: vm.group,
        reporting: true,
        agency: vm.govAgencyCode,
        report: vm.chartView ? false : 'linemonth',
        system: vm.systemReport
      }
      let tempGov = vm.govAgencyCode
      if (vm.chartView) {
        filter.report = true
        let currentQuerys = vm.$router.history.current.query
        if (currentQuerys.hasOwnProperty('govAgencyCode')) {
          vm.govAgencyCode = currentQuerys.govAgencyCode
          tempGov = vm.govAgencyCode
          if (tempGov !== '') {
            filter.report = false
          }
        }
      } else {
        vm.govAgencyCode = ''
        filter.agency = 'total'
      }
      vm.reloadPie = false
      vm.reloadBar = true

      vm.totalCounter['total_3'] = 0
      vm.totalCounter['total_4'] = 0
      vm.totalCounter['total_5'] = 0
      vm.totalCounter['total_6'] = 0
      vm.totalCounter['total_7'] = 0
      vm.totalCounter['total_8'] = 0
      vm.totalCounter['total_9'] = 0
      vm.totalCounter['total_10'] = 0
      vm.totalCounter['total_11'] = 0
      vm.totalCounter['total_12'] = 0
      vm.totalCounter['total_13'] = 0
      vm.totalCounter['total_14'] = 0
      vm.totalCounter['total_15'] = 0
      vm.totalCounter['total_16'] = 0
      vm.totalCounter['total_17'] = 0
      vm.totalCounter['total_18'] = 0
      vm.totalCounter['total_19'] = 0
      vm.totalCounter['total_20'] = 0
      vm.totalCounter['total_21'] = 0
      vm.totalCounter['total_22'] = 0
      vm.totalCounter['total_23'] = 0
      vm.totalCounter['total_24'] = 0
      vm.totalCounter['total_25'] = 0
      vm.showTable = false
      vm.$store.dispatch('getAgencyReportLists', filter).then(function (result) {
        if (result === null || result === undefined || result === 'undefined') {
          vm.noReportData = true
          vm.agencyLists = []
        } else {
          vm.noReportData = false
          vm.agencyLists = result
        }
        // console.log('agencyLists', vm.agencyLists)
        if (!vm.noReportData) {
          vm.doProcessReport2(vm.agencyLists)
          vm.doProcessReportTypeDossiers(vm.agencyLists)
          for (let key in vm.agencyLists) {
            let currentData = vm.agencyLists[key]
            // console.log('currentData', currentData)
            if (currentData.domainName === '' && currentData.domainName === '') {
              vm.totalCounter['total_3'] = currentData.processCount
              vm.totalCounter['total_4'] = currentData.remainingCount
              vm.totalCounter['total_5'] = currentData.receivedCount
              vm.totalCounter['total_6'] = currentData.onegateCount
              vm.totalCounter['total_7'] = currentData.onlineCount
              vm.totalCounter['total_8'] = currentData.releaseCount
              vm.totalCounter['total_9'] = currentData.betimesCount
              vm.totalCounter['total_10'] = currentData.ontimeCount
              vm.totalCounter['total_11'] = currentData.overtimeCount
              vm.totalCounter['total_12'] = currentData.unresolvedCount
              vm.totalCounter['total_13'] = currentData.doneCount
              vm.totalCounter['total_14'] = currentData.releasingCount
              vm.totalCounter['total_15'] = currentData.processingCount
              vm.totalCounter['total_16'] = currentData.undueCount
              vm.totalCounter['total_17'] = currentData.overdueCount
              vm.totalCounter['total_18'] = currentData.waitingCount
              vm.totalCounter['total_19'] = currentData.cancelledCount
              vm.totalCounter['total_20'] = currentData.ontimePercentage
              vm.showTable = true
              break
            }
          }
        }
        
        vm.reloadPie = true
      })
      // report line
      if (vm.year !== '0') {
        setTimeout(() => {
          filter = {
            year: vm.year,
            group: vm.group,
            agency: tempGov,
            report: vm.chartView ? true : 'linemonth',
            system: vm.systemReport
          }
          if (!vm.chartView) {
            filter.agency = 'total'
            filter.report = 'linemonth'
          } else {
            if (tempGov !== '') {
              filter.agency = tempGov
              filter.report = false
            } else {
              filter.agency = ''
              filter.report = true
            }
          }
          vm.reloadLine = true
          vm.$store.dispatch('getAgencyReportLists', filter).then(function (result) {
            let dataReport1 = []
            if (result === null || result === undefined || result === 'undefined') {
              vm.noReportDataLine = true
              vm.reloadLine = false
            } else {
              vm.noReportDataLine = false
              dataReport1 = result
            }
            if (!vm.noReportDataLine) {
              vm.doProcessReport1(dataReport1)
            }
          })
        }, 200)
      } else {
        vm.reloadLine = false
      }
    },
    changeYear (item) {
      let vm = this
      if (String(item) === '0') {
        vm.month = '0'
      }
      vm.year = item
      vm.showTableTotal = false
      vm.itemTotal = ''
      vm.$store.dispatch('getReportTotal', vm.year).then(function (result) {
        let agencyListsTotal = result
        for (let key in agencyListsTotal) {
          let currentData = agencyListsTotal[key]
          if (currentData.domainName === '' && currentData.domainName === '') {
            vm.itemTotal = currentData
            vm.showTableTotal = true
            break
          }
        }
        if (vm.itemTotal === '') {
          vm.showTableTotal = false
        }
      })
      vm.$router.push({
        path: '/bao-cao/' + vm.index,
        query: {
          year: vm.year,
          month: vm.month,
          group: vm.group,
          reportGovName: vm.reportGovName,
          govAgencyCode: vm.govAgencyCode,
          system: vm.systemReport
        }
      })
    },
    changeMonth (item) {
      let vm = this
      vm.month = item
      console.log('changeMonth', vm.year)
      vm.$router.push({
        path: '/bao-cao/' + vm.index,
        query: {
          year: vm.year,
          month: vm.month,
          group: vm.group,
          reportGovName: vm.reportGovName,
          govAgencyCode: vm.govAgencyCode,
          system: vm.systemReport
        }
      })
    },
    changeDonVi (item) {
      let vm = this
      vm.agency = item
      vm.$router.push({
        path: '/bao-cao/' + vm.index,
        query: {
          year: vm.year,
          month: vm.month,
          group: vm.group,
          reportGovName: vm.reportGovName,
          govAgencyCode: vm.govAgencyCode
        }
      })
    },
    doProcessReport1 (data) {
      let vm = this
      let datasetsCustom = []
      let labelsCustomMonth = {}
      let monthData = {}
      // console.log('dataReport line month', data)
      // Bind data report NĂM
      for (let i = 1; i <= 12; i++) {
        labelsCustomMonth['' + i] = 'T ' + i
      }
      for (let key in data) {
        if (String(data[key].govAgencyCode) === '' && String(data[key].domainName) === '') {
        } else {
          if (data[key].month > 0) {
            // labelsCustomMonth['' + data[key].month] = 'T ' + data[key].month
            if (data[key].govAgencyName !== '' && String(data[key].domainName) === '') {
              let agencyName = String(data[key].govAgencyName).normalize('NFD')
              if (monthData[agencyName] !== null && monthData[agencyName] !== undefined) {
                monthData[agencyName].push({
                  month: data[key].month,
                  total: data[key].receivedCount
                })
              } else {
                monthData[agencyName] = []
                monthData[agencyName].push({
                  month: data[key].month,
                  total: data[key].receivedCount
                })
              }
            } else {
              let domainName = String(data[key].domainName).normalize('NFD')
              if (monthData[domainName] !== null && monthData[domainName] !== undefined) {
                monthData[domainName].push({
                  month: data[key].month,
                  total: data[key].receivedCount
                })
              } else {
                monthData[domainName] = []
                monthData[domainName].push({
                  month: data[key].month,
                  total: data[key].receivedCount
                })
              }
            }
          }
        }
      }
      // console.log('monthData 19891', monthData)
      // console.log('monthData 555', labelsCustomMonth)
      for (let key in monthData) {
        let lineProcessData = {
          label: key,
          borderColor: '#' + vm.intToRGB(vm.hashCode(key)),
          backgroundColor: 'transparent',
          data: Array.from(Array(labelsCustomMonth.length), () => 0)
        }
        for (let keyArray in monthData[key]) {
          let month = monthData[key][keyArray].month
          let firstKey = Object.keys(labelsCustomMonth)[0]
          let index = month - firstKey
          lineProcessData.data[index] = monthData[key][keyArray].total
        }
        datasetsCustom.push(lineProcessData)
      }
      vm.chartOptions.xaxis.categories = Object.values(labelsCustomMonth)
      vm.chartOptions.colors = []
      vm.seriesChart = []
      // data report_4
      for (let key in datasetsCustom) {
        vm.seriesChart.push({
          name: datasetsCustom[key]['label'],
          data: datasetsCustom[key]['data']
        })
        vm.chartOptions.colors.push(datasetsCustom[key]['borderColor'])
      }
      vm.reloadLine = false
      // console.log('vm.seriesChart', vm.seriesChart)
    },
    doProcessReport2 (data) {
      let vm = this
      let datasetsCustom = []
      let labelsCustomMonth = {}
      let processingCountData = []
      let waitingCountData = []
      let releaseCountData = []
      let currentQuerys = vm.$router.history.current.query
      // console.log('dataReport2', data)
      // data report_2
      for (let key in data) {
        if (String(data[key].govAgencyName) === '' && String(data[key].domainName) === '') {
        } else {
          // if (data[key].month > 0) {
            // if (currentQuerys.hasOwnProperty('govAgencyCode') && currentQuerys['govAgencyCode'] !== undefined && currentQuerys['govAgencyCode'] !== '' && String(data[key].domainName) !== '') {
            if (String(data[key].govAgencyName) === '' && String(data[key].domainName) !== '') {
              labelsCustomMonth[data[key].domainName] = data[key].processingCount + data[key].waitingCount + data[key].releaseCount
            } else {
              labelsCustomMonth[data[key].govAgencyName] = data[key].processingCount + data[key].waitingCount + data[key].releaseCount
            }
            processingCountData.push(data[key].processingCount)
            waitingCountData.push(data[key].waitingCount)
            releaseCountData.push(data[key].releaseCount)
          // }
        }
      }
      vm.labelOfLine = []
      // console.log('labelsCustomMonth ---', labelsCustomMonth)
      for (let key in labelsCustomMonth) {
        if (key === '') {
          vm.labelOfLine.push('Toàn bộ lĩnh vực')
        } else {
          vm.labelOfLine.push(key)
        }
        let lineProcessData = {
          label: key,
          borderColor: '#' + vm.intToRGB(vm.hashCode(key)),
          backgroundColor: 'transparent',
          data: labelsCustomMonth[key]
        }
        datasetsCustom.push(lineProcessData)
      }
      if (currentQuerys.hasOwnProperty('govAgencyCode') && currentQuerys['govAgencyCode'] !== undefined && currentQuerys['govAgencyCode'] !== '') {
        delete datasetsCustom[0]
      }
      let colorDK = []
      let seriesChartBarData = []
      for (let key in datasetsCustom) {
        seriesChartBarData.push(datasetsCustom[key]['data'])
        colorDK.push(datasetsCustom[key]['borderColor'])
      }
      // console.log('seriesChartBarData', seriesChartBarData)
      vm.seriesChartBar = []
      vm.seriesChartBar = [{
        data: seriesChartBarData
      }]
      vm.reloadBar = false
      vm.chartOptionsBar = {}
      vm.chartOptionsBar = {
        plotOptions: {
          bar: {
            barHeight: '100%',
            distributed: true,
            horizontal: true,
            dataLabels: {
              position: 'bottom'
            }
          }
        },
        colors: colorDK,
        dataLabels: {
          enabled: true,
          textAnchor: 'start',
          style: {
            colors: ['#fff']
          },
          formatter: function(val, opt) {
            if (String(val) > 0) {
              return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
            } else {
              return ''
            }
          },
          offsetX: 0,
          dropShadow: {
            enabled: true
          }
        },
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        grid: {
          borderColor: '#e7e7e7',
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
          }
        },
        xaxis: {
          categories: vm.labelOfLine,
        },
        yaxis: {
          labels: {
            show: false
          }
        },
        tooltip: {
          theme: 'dark',
          x: {
            show: false
          },
          y: {
            title: {
              formatter: function() {
                return ''
              }
            }
          }
        }
      }
      // data report_2
      vm.seriesChartBarTotal = []
      vm.seriesChartBarTotal = [{
        name: 'Đang xử lý',
        data: processingCountData
      },{
        name: 'Đang chờ bổ sung',
        data: waitingCountData
      },{
        name: 'Đã giải quyết',
        data: releaseCountData
      }]
      vm.chartOptionsBarTotal = {}
      vm.chartOptionsBarTotal = {
        plotOptions: {
          bar: {
            barHeight: '100%',
            horizontal: true,
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
        colors: ['#8BC34A', '#FFC107', '#2196F3'],
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        xaxis: {
          categories: vm.labelOfLine,
          labels: {
            formatter: function(val) {
              return val
            }
          }
        },
        yaxis: {
          title: {
            text: undefined
          }
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
      }
    },
    doProcessReportTypeDossiers (data) {
      let vm = this
      let onlineCountData = []
      let onegateCountData = []
      let labelDomain = []
      let labelAgency = []
      // Bind data report THÁNG
      for (let key in data) {
        if (String(data[key].govAgencyName) === '' && String(data[key].domainName) === '') {
        } else {
          if (String(data[key].govAgencyName) === '' && String(data[key].domainName) !== '') {
            labelDomain.push(data[key].domainName)
          } else {
            labelAgency.push(data[key].govAgencyName)
          }
          onlineCountData.push(data[key].onlineCount)
          onegateCountData.push(data[key].onegateCount)
        }
      }
      // data report_3
      vm.seriesDossierTypeChart[0]['data'] = onegateCountData
      vm.seriesDossierTypeChart[1]['data'] = onlineCountData
      vm.dossierTypeChartOption.xaxis.categories = vm.chartView ? labelAgency : labelDomain
      try {
        if (typeDossierChartXLabel) {
          vm.dossierTypeChartOption.xaxis.labels = typeDossierChartXLabel
        } else {
          vm.dossierTypeChartOption.xaxis.labels = {
            show: true,
            rotate: 0,
            rotateAlways: false,
            trim: false,
            formatter: function(val) {
              return val
            }
          }
        }
      } catch (error) {
        vm.dossierTypeChartOption.xaxis.labels = {
          show: true,
          rotate: 0,
          rotateAlways: false,
          trim: false,
          formatter: function(val) {
            return val
          }
        }
      }
    },
    hashCode (str) {
      var hash = 0
      for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
      }
      return hash
    },
    intToRGB (i) {
      var c = (i & 0x00FFFFFF).toString(16).toUpperCase()
      return '00000'.substring(0, 6 - c.length) + c
    }
  }
}
</script>
