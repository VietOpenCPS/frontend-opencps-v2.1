<template>
  <div style="width: 1300px; margin: 0 auto">
    <v-layout wrap>
      <v-flex xs12 md6 class="pa-2">
        <div class="pa-2 v-sheet theme--light" style="border: 1px solid #dedede;">
          <div class="row-header" style="height: 38px; overflow: hidden;background: #fff">
            <div class="background-triangle-big1">THỐNG KÊ THEO NĂM</div>
            <div style="width: 200px;">
              <v-select
                width="200px"
                :items="yearList"
                item-value="value"
                item-text="name"
                v-model="yearSelected"
              ></v-select>
            </div>
          </div>
          <v-layout wrap align-center>
            <v-flex md6 xs12>
              <apexchart
                type="pie"
                width=400 height=220
                :options="chartOptionsYear"
                :series="statisticalYear"
                class="pieChartTotal"
              ></apexchart>
            </v-flex>
            <v-flex md6 xs12>
              <!-- <v-layout wrap class="run-down">
                <v-flex md6 xs12 text-center>
                  <span style="color:#1976d2;">{{statistics.receivedCount}}</span>
                  <p>Tổng số đã tiếp nhận</p>
                </v-flex>
                <v-flex md6 xs12 text-center>
                  <span style="color:#1976d2;">{{thongKeHauGiang ? statistics.releaseInAPeriodCount : statistics.releaseCount}}</span>
                  <p>Tổng số hoàn thành</p>
                </v-flex>
                <v-flex md6 xs12 text-center>
                  <span style="color:#1976d2;">{{thongKeHauGiang ? processingTotal : statistics.processingCount}}</span>
                  <p>Tổng số đang xử lý</p>
                </v-flex>
                <v-flex md6 xs12 text-center>
                  <span style="color:#1976d2;">{{statistics.overtimeCount}}</span>
                  <p>Trễ hạn</p>
                </v-flex>
              </v-layout> -->
              <v-layout wrap class="run-down">
                <v-flex md6 xs12 text-center>
                  <span style="color:#1976d2;">{{statisticSum.receivedCount}}</span>
                  <p>Tổng số đã tiếp nhận</p>
                </v-flex>
                <v-flex md6 xs12 text-center>
                  <span style="color:#1976d2;">{{thongKeHauGiang ? statisticSum.releaseInAPeriodCount : statisticSum.releaseCount}}</span>
                  <p>Tổng số hoàn thành</p>
                </v-flex>
                <v-flex md6 xs12 text-center>
                  <span style="color:#1976d2;">{{thongKeHauGiang ? processingTotal : statisticSum.processingCount}}</span>
                  <p>Tổng số đang xử lý</p>
                </v-flex>
                <v-flex md6 xs12 text-center>
                  <span style="color:#1976d2;">{{statisticSum.overtimeCount}}</span>
                  <p>Trễ hạn</p>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
      <v-flex xs12 md6 class="pa-2">
        <div class="pa-2 v-sheet theme--light" style="border: 1px solid #dedede;">
          <div class="row-header mb-1" style="height: 38px; overflow: hidden;background: #fff">
            <div class="background-triangle-big1">THỐNG KÊ THỦ TỤC HÀNH CHÍNH</div>
          </div>
          <v-card-text class="px-0 py-3 pt-4">
            <v-layout wrap class="custom-class">
              <v-flex xs12 sm6 class="px-2 pb-3">
                <v-card @click="changeLevel(2)" color="green lighten-1" class="white--text" height="70px" style="border-radius: 4px;cursor: pointer;">
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
                <v-card @click="changeLevel(3)" color="orange lighten-1" class="white--text" height="70px" style="border-radius: 4px;cursor: pointer;">
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
                <v-card @click="changeLevel(4)" color="red lighten-1" class="white--text" height="70px" style="cursor: pointer;">
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
        </div>
      </v-flex>
      <v-flex xs12>
        <v-layout wrap>
          <v-flex md4 xs12 class="pa-2">
            <div class="pa-2 v-sheet theme--light" style="border: 1px solid #dedede;">
              <div class style="height: 38px; overflow: hidden;background: #fff">
                <div class="background-triangle-big1">SỞ BAN NGÀNH</div>
                <v-flex class="right">
                  <div class="agencyFilter agencyFilter1">
                    <v-autocomplete
                      :items="listDonViSBN"
                      v-model="donViSBN"
                      placeholder="Chọn đơn vị"
                      item-text="itemName"
                      item-value="itemCode"
                      hide-no-data
                      :hide-selected="true"
                      @change="getStatisticsYearSBN"
                    ></v-autocomplete>
                  </div>
                </v-flex>
              </div>
              <apexchart
                v-if="!thongKeHauGiang"
                type="pie"
                width=400 height=220
                :options="chartOptionsSoQuanXa"
                :series="statisticalSBN"
                class="pieChartAgency"
              ></apexchart>
              <!-- Hậu Giang -->
              <v-layout wrap align-center v-else class="pieChartHauGiang">
                <v-flex md7 xs12>
                  <apexchart
                    type="pie"
                    width=350 height=220
                    :options="chartOptionsSoQuanXa"
                    :series="statisticalSBN"
                    class=""
                  ></apexchart>
                </v-flex>
                <v-flex md5 xs12>
                  <v-layout wrap class="run-down">
                    <v-flex xs12 text-center>
                      <span style="color:#1976d2;">{{statisticTotalSBN.receivedCount}}</span>
                      <p>Tổng số đã tiếp nhận</p>
                    </v-flex>
                    <v-flex xs12 text-center>
                      <span style="color:#1976d2;">{{thongKeHauGiang ? statisticTotalSBN.releaseInAPeriodCount : statisticTotalSBN.releaseCount}}</span>
                      <p>Hoàn thành</p>
                    </v-flex>
                    <v-flex s12 text-center>
                      <span style="color:#1976d2;">{{thongKeHauGiang ? processingSBN : statisticTotalSBN.processingCount}}</span>
                      <p>Đang xử lý</p>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
              <!--  -->
            </div>
          </v-flex>
          <v-flex md4 xs12 class="pt-2 pr-2 pb-2 pl-0">
            <div class="pa-2 v-sheet theme--light" style="border: 1px solid #dedede;">
              <div class style="height: 38px; overflow: hidden;">
                <div class="background-triangle-big1">HUYỆN/ THỊ XÃ/ THÀNH PHỐ</div>
                <v-flex class="right">
                  <div class="agencyFilter agencyFilter2">
                    <v-autocomplete
                      :items="listDonViHuyen"
                      v-model="donViHuyen"
                      placeholder="Chọn đơn vị"
                      item-text="itemName"
                      item-value="itemCode"
                      hide-no-data
                      :hide-selected="true"
                      @change="getStatisticsYearQUAN_HUYEN"
                    ></v-autocomplete>
                  </div>
                </v-flex>
              </div>
              <apexchart
                v-if="!thongKeHauGiang"
                type="pie"
                width=400 height=220
                :options="chartOptionsSoQuanXa"
                :series="statisticalQUAN_HUYEN"
                class="pieChartAgency"
              ></apexchart>
              <!-- Hậu Giang -->
              <v-layout wrap align-center v-else class="pieChartHauGiang">
                <v-flex md7 xs12>
                  <apexchart
                    type="pie"
                    width=350 height=220
                    :options="chartOptionsSoQuanXa"
                    :series="statisticalQUAN_HUYEN"
                    class=""
                  ></apexchart>
                </v-flex>
                <v-flex md5 xs12>
                  <v-layout wrap class="run-down">
                    <v-flex xs12 text-center>
                      <span style="color:#1976d2;">{{statisticTotalQuanHuyen.receivedCount}}</span>
                      <p>Tổng số đã tiếp nhận</p>
                    </v-flex>
                    <v-flex xs12 text-center>
                      <span style="color:#1976d2;">{{thongKeHauGiang ? statisticTotalQuanHuyen.releaseInAPeriodCount : statisticTotalQuanHuyen.releaseCount}}</span>
                      <p>Hoàn thành</p>
                    </v-flex>
                    <v-flex s12 text-center>
                      <span style="color:#1976d2;">{{thongKeHauGiang ? processingQuanHuyen : statisticTotalQuanHuyen.processingCount}}</span>
                      <p>Đang xử lý</p>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
              <!--  -->
            </div>
          </v-flex>
          <v-flex md4 xs12 class="pt-2 pr-2 pb-2 pl-0">
            <div class="pa-2 v-sheet theme--light" style="border: 1px solid #dedede;">
              <div class style="height: 38px; overflow: hidden;">
                <div class="background-triangle-big1">XÃ/ PHƯỜNG/ THỊ TRẤN</div>
                <v-flex class="right">
                  <div class="agencyFilter agencyFilter3">
                    <v-autocomplete
                      :items="listDonViXa"
                      v-model="donViXa"
                      placeholder="Chọn đơn vị"
                      item-text="itemName"
                      item-value="itemCode"
                      hide-no-data
                      :hide-selected="true"
                      @change="getStatisticsYearXA_PHUONG"
                    ></v-autocomplete>
                  </div>
                </v-flex>
              </div>
              <div style="width: 100%;">
                <apexchart
                  v-if="!thongKeHauGiang"
                  type="pie"
                  width=400 height=220
                  :options="chartOptionsSoQuanXa"
                  :series="statisticalXA_PHUONG"
                  class="pieChartAgency"
                ></apexchart>
                <!-- Hậu Giang -->
                <v-layout wrap align-center v-else class="pieChartHauGiang">
                  <v-flex md7 xs12>
                    <apexchart
                      type="pie"
                      width=350 height=220
                      :options="chartOptionsSoQuanXa"
                      :series="statisticalXA_PHUONG"
                      class=""
                    ></apexchart>
                  </v-flex>
                  <v-flex md5 xs12>
                    <v-layout wrap class="run-down">
                      <v-flex xs12 text-center>
                        <span style="color:#1976d2;">{{statisticTotalXaPhuong.receivedCount}}</span>
                        <p>Tổng số đã tiếp nhận</p>
                      </v-flex>
                      <v-flex xs12 text-center>
                        <span style="color:#1976d2;">{{thongKeHauGiang ? statisticTotalXaPhuong.releaseInAPeriodCount : statisticTotalXaPhuong.releaseCount}}</span>
                        <p>Hoàn thành</p>
                      </v-flex>
                      <v-flex s12 text-center>
                        <span style="color:#1976d2;">{{thongKeHauGiang ? processingXaPhuong : statisticTotalXaPhuong.processingCount}}</span>
                        <p>Đang xử lý</p>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
                <!--  -->
              </div>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 class="pa-2">
        <div class="pa-2 v-sheet theme--light" style="border: 1px solid #dedede;">
          <div class="row-header" style="height: 38px; overflow: hidden;background: #fff">
            <div class="background-triangle-big1" style="width: 228px;">THỐNG KÊ THEO THÁNG</div>
            <v-layout wrap>
              <v-flex md7>
                <div style="display: flex; align-items: center; height: 40px;">
                  <span
                    class="mx-3"
                    style="cursor: pointer;"
                    :class="{'groupcode-active':  String(groupCode) === 'SBN'}"
                    @click="groupCode='SBN'"
                  >SỞ BAN NGÀNH</span>
                  <span
                    class="mx-3"
                    style="cursor: pointer;"
                    :class="{'groupcode-active':  String(groupCode) === 'QUAN_HUYEN'}"
                    @click="groupCode='QUAN_HUYEN'"
                  >HUYỆN/ THỊ XÃ/ THÀNH PHỐ</span>
                  <v-menu right offset-x class="d-inline-block">
                    <span small slot="activator" color="primary" class="mx-3" :class="{'groupcode-active':  String(groupCode) === 'XA_PHUONG'}">
                      XÃ/ PHƯỜNG/ THỊ TRẤN &nbsp; <v-icon size="18" class="text-bold">arrow_drop_down</v-icon>
                    </span>
                    <v-list>
                      <v-list-tile v-for="(item, index) in listDoiTuong" :key="index" @click="getStatisticsMonth('XA_PHUONG', item)">
                        <v-list-tile-title><v-icon size="18" class="blue--text" v-if="quanhuyenSelected.itemCode === item.itemCode">check</v-icon>&nbsp; {{item.itemName}}</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </div>
              </v-flex>
              <v-flex md5 class="text-right">
                <v-select
                  v-model="monthSelected"
                  :items="monthList"
                  style="width: 27%; display:inline-block; margin: 0 10px;"
                  item-text="name"
                  item-value="value"
                ></v-select>
                <v-select
                  v-model="yearSelected2"
                  :items="yearList"
                  style="width: 27%; display:inline-block; margin: 0 10px;"
                  item-text="name"
                  item-value="value"
                ></v-select>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      class="mx-2"
                      :text="isTable"
                      small
                      color="#1976d2"
                      v-on="on"
                      @click="isTable=false"
                    >
                      <i class="fa fa-pie-chart white--text" aria-hidden="true"></i>
                    </v-btn>
                  </template>
                  <span>Xem dạng biểu đồ</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      class="mx-2"
                      :text="!isTable"
                      small
                      color="#1976d2"
                      v-on="on"
                      @click="isTable=true"
                    >
                      <i class="fa fa-table white--text" aria-hidden="true"></i>
                    </v-btn>
                  </template>
                  <span>Xem dạng bảng biểu</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </div>
          <v-layout wrap>
            <v-flex xs12 class="my-3 report__table" style="overflow: hidden;">
              <apexchart v-if="!isTable && !isLoading" type="bar" :height="heightChart" width='100%'
                :options="chartOptionsMonth" 
                :series="statisticalMonth" 
                :stacked="true"
              ></apexchart>
              <v-flex xs12 class="text-center text-bold my-3" v-if="isTable">
                BÁO CÁO TỔNG HỢP TÌNH HÌNH GIẢI QUYẾT THỦ TỤC HÀNH CHÍNH <br/>
                <span v-if="String(monthSelected) !== '0'">Tháng {{monthSelected}}</span> Năm {{yearSelected2}}
              </v-flex>
              <table class="my-2" v-if="isTable" hide-default-footer>
                <thead>
                  <tr>
                    <th rowspan="3" class="text-center px-2">
                      <span>STT</span>
                    </th>
                    <th rowspan="3" class="text-center px-2">
                      <span>Đơn vị</span>
                    </th>
                    <th colspan="5" class="text-center px-2 py-1">
                      <span>Nhận giải quyết</span>
                    </th>
                    <th colspan="7" class="text-center px-2">
                      <span>Kết quả nhận giải quyết</span>
                    </th>
                    <th colspan="3" class="text-center px-2">
                      <span>Đang giải quyết</span>
                    </th>
                    <th rowspan="3" style="text-align: center;" width="60" class="px-2">
                      <span>Tạm dừng bổ sung điều kiện</span>
                    </th>
                    <!-- <th rowspan="3" style="text-align: center;" width="60" class="px-2">
                      <span>Rút không giải quyết</span>
                    </th> -->
                    <th rowspan="3" style="text-align: center;" width="60" class="px-2">
                      <span>Tỉ lệ sớm và đúng hạn</span>
                    </th>
                  </tr>
                  <tr>
                    <th rowspan="2" class="text-center px-2 py-2">
                      <span>Tổng số</span>
                    </th>
                    <th rowspan="2" class="text-center px-2">
                      <span>Tồn trước</span>
                    </th>
                    <th colspan="3" class="text-center px-2 py-1">
                      <span>Nhận trong kì</span>
                    </th>
                    <th rowspan="2" class="text-center px-2 py-1">
                      <span>Tổng số</span>
                    </th>
                    <th colspan="3" class="text-center px-2">
                      <span>Tình hình thực hiện</span>
                    </th>
                    <th rowspan="2" class="text-center px-2">
                      <span>Từ chối giải quyết</span>
                    </th>
                    <th colspan="2" class="text-center px-2">
                      <span>Trả kết quả</span>
                    </th>
                    <th rowspan="2" class="text-center px-2">
                      <span>Tổng số</span>
                    </th>
                    <th rowspan="2" class="text-center px-2">
                      <span>Còn hạn</span>
                    </th>
                    <th rowspan="2" class="text-center px-2">
                      <span>Quá hạn</span>
                    </th>
                  </tr>
                  <tr>
                    <th class="text-center px-2">
                      <span>Tổng số</span>
                    </th>
                    <th class="text-center px-2">
                      <span>Một cửa</span>
                    </th>
                    <th class="text-center px-2">
                      <span>Trực tuyến</span>
                    </th>
                    <th class="text-center px-2">
                      <span>Trước hạn</span>
                    </th>
                    <th class="text-center px-2">
                      <span>Đúng hạn</span>
                    </th>
                    <th class="text-center px-2">
                      <span>Quá hạn</span>
                    </th>
                    <th class="text-center px-2">
                      <span>Đã trả</span>
                    </th>
                    <th class="text-center px-2">
                      <span>Chưa trả</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr class="note__column">
                    <td align="center" class="px-2">(1)</td>
                    <td align="center" class="px-2">(2)</td>
                    <td align="center" class="px-2">(3)</td>
                    <td align="center" class="px-2">(4)</td>
                    <td align="center" class="px-2">(5)</td>
                    <td align="center" class="px-2">(6)</td>
                    <td align="center" class="px-2">(7)</td>
                    <td align="center" class="px-2">(8)</td>
                    <td align="center" class="px-2">(9)</td>
                    <td align="center" class="px-2">(10)</td>
                    <td align="center" class="px-2">(11)</td>
                    <td align="center" class="px-2">(12)</td>
                    <td align="center" class="px-2">(13)</td>
                    <td align="center" class="px-2">(14)</td>
                    <td align="center" class="px-2">(15)</td>
                    <td align="center" class="px-2">(16)</td>
                    <td align="center" class="px-2">(17)</td>
                    <td align="center" class="px-2">(18)</td>
                    <td align="center" class="px-2">(19)</td>
                    <!-- <td align="center" class="px-2">(20)</td> -->
                  </tr>
                  <tr v-for="(item,index) in danhSachThongKeThang" :key="index">
                    <td align="center"  class="px-2">{{index + 1}}</td>
                    <td align="left"  class="px-2" style="padding: 8px 10px;">{{item.govAgencyName}}</td>
                    <td align="center"  class="px-2">{{item.processCount}}</td>
                    <td align="center"  class="px-2">{{item.remainingCount}}</td>
                    <td align="center" class="px-2">{{item.receivedCount}}</td>
                    <td align="center" class="px-2">{{item.onegateCount}}</td>
                    <td align="center" class="px-2">{{item.onlineCount}}</td>
                    <td align="center" class="px-2">{{item.releaseCount}}</td>
                    <td align="center" class="px-2">{{item.betimesCount}}</td>
                    <td align="center" class="px-2">{{item.ontimeCount}}</td>
                    <td align="center" class="px-2">{{item.overtimeCount}}</td>
                    <td align="center" class="px-2">{{item.unresolvedCount}}</td>
                    <td align="center" class="px-2">{{item.doneCount}}</td>
                    <td align="center" class="px-2">{{item.releasingCount}}</td>
                    <td align="center" class="px-2">{{item.processingCount}}</td>
                    <td align="center" class="px-2">{{item.undueCount}}</td>
                    <td align="center" class="px-2">{{item.overdueCount}}</td>
                    <td align="center" class="px-2">{{item.waitingCount}}</td>
                    <!-- <td align="center" class="px-2">{{item.cancelledCount}}</td> -->
                    <td align="center" class="px-2">{{item.ontimePercentage}}</td>
                  </tr>
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
                    <td align="center" class="px-2">{{totalCounter['total_16']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_17']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_18']}}</td>
                    <!-- <td align="center" class="px-2">{{totalCounter['total_19']}}</td> -->
                    <td align="center" class="px-2">{{totalCounter['total_20']}}</td>
                  </tr>
                </tbody>
              </table>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
    </v-layout>

    <v-dialog v-model="dialogServiceInfo" fullscreen hide-overlay transition="fade-transition">
      <v-card flat>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>THỦ TỤC HÀNH CHÍNH MỨC ĐỘ {{levelFilter}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogServiceInfo = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-0 pb-0 px-0">
          <div class="mb-3">
            <v-progress-linear v-if="loadingService" :indeterminate="true"></v-progress-linear>
            <v-data-table
              v-else
              :headers="headersThuTuc"
              :items="serviceInfoList"
              hide-actions
              class="table-landing table-bordered"
              item-key="serviceInfoId"
            >
              <!--  -->
              <template slot="headers" slot-scope="props">
                <tr>
                  <th
                    v-for="header in headersThuTuc"
                    :key="header.text"
                    :class="header['class'] ? header['class'] : ''"
                  >
                    <span>{{ header.text }}</span>
                  </th>
                </tr>
              </template>
              <!--  -->
              <template slot="items" slot-scope="props">
                <tr style="cursor: pointer">
                  <td class="text-xs-center" width="50px" style="height: 40px !important">
                    <span>{{thutucPage * 15 - 15 + props.index + 1}}</span>
                  </td>
                  <td class="text-xs-left" width="150px" style="height: 40px !important">
                    {{ props.item.serviceCodeDVCQG ? props.item.serviceCodeDVCQG : props.item.serviceCode }}
                  </td>
                  <td class="text-xs-left" style="height: 40px !important">
                    {{ props.item.serviceName }}
                  </td>
                  <td class="text-xs-left" width="200px" style="height: 40px !important">
                    {{props.item.domainName}}
                  </td>
                  
                </tr>
              </template>
            </v-data-table>

            <div class="text-xs-right layout wrap" style="position: relative;">
              <div class="flex pagging-table px-2 mt-2"> 
                <tiny-pagination :total="totalThuTuc" :page="thutucPage" custom-class="custom-tiny-class" 
                 @tiny:change-page="paggingData" ></tiny-pagination> 
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="loadingAction" color="primary" @click.native="dialogServiceInfo = false"
            >
            <v-icon class="white--text">close</v-icon>&nbsp;
            Thoát
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import TinyPagination from './Pagination.vue'
export default {
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    listDonViSBN: [],
    donViSBN: 'total',
    listDonViHuyen: [],
    donViHuyen: 'total',
    listDonViXa: [],
    donViXa: 'total',
    levelList: [
      {level: 2, count: "0", levelName: 2},
      {level: 3, count: "0", levelName: 3},
      {level: 4, count: "0", levelName: 4}
    ],
    totalTTHC: 0,
    groupCode: "SBN",
    isLoading: false,
    yearSelected: new Date().getFullYear(),
    yearSelected2: new Date().getFullYear(),
    monthSelected: new Date().getMonth() + 1,
    distGroupSelected: "",
    isTable: false,
    statisticalYear: [0, 0],
    statisticalSBN: [],
    statisticalQUAN_HUYEN: [],
    statisticalXA_PHUONG: [],
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
      labels: ["Hoàn thành sớm và đúng hạn", "Hoàn thành trễ hạn"],
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
    chartOptionsYearHauGiang: {
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
    statisticSum: '',
    statistics: {
      betimesCount: 1,
      cancelledCount: 0,
      companyId: 0,
      deniedCount: 0,
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
    statisticTotalSBN: '',
    statisticTotalQuanHuyen: '',
    statisticTotalXaPhuong: '',
    danhSachThongKeThang: [],
    quanhuyenSelected: '',
    totalCounter: {},
    labelPieChartConfig: '',
    serviceInfoList: [],
    totalThuTuc: 0,
    thutucPage: 1,
    dialogServiceInfo: false,
    levelFilter: '',
    loadingService: false,
    headersThuTuc: [
      {
        text: 'STT',
        align: 'center',
        sortable: false,
        class: 'text-xs-center'
      },
      {
        text: 'Mã thủ tục',
        align: 'center',
        sortable: false,
        class: 'text-xs-center'
      },
      {
        text: 'Tên thủ tục',
        align: 'center',
        sortable: false,
        class: 'text-xs-center'
      },
      {
        text: 'Lĩnh vực',
        align: 'center',
        sortable: false,
        class: 'text-xs-center'
      }
    ],
    thongKeHauGiang: false,
    processingTotal: 0,
    processingSBN: 0,
    processingQuanHuyen: 0,
    processingXaPhuong: 0
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
    //
    try {
      vm.thongKeHauGiang = thongKeHauGiang ? thongKeHauGiang : false
    } catch (error) {
      vm.thongKeHauGiang = false
    }
    if (vm.thongKeHauGiang) {
      vm.chartOptionsYear = vm.chartOptionsYearHauGiang
    }
    try {
      vm.labelPieChartConfig = labelPieChartConfig ? labelPieChartConfig : ''
    } catch (error) {
      vm.labelPieChartConfig = ''
    }
    // 
    vm.groupCode = 'SBN'
    this.$nextTick(() => {
      vm.getDictgroups('SBN');
      vm.getDictgroups('QUAN_HUYEN');
      vm.getDictgroups('XA_PHUONG');
      // vm.getStatisticsYear();
      vm.getStatisticsYearSBN();
      vm.getStatisticsYearQUAN_HUYEN();
      vm.getStatisticsYearXA_PHUONG();
      vm.getStatisticsMonth(vm.groupCode);
      vm.getLevelService()
      vm.sumReport()
    })
  },
  watch: {
    yearSelected() {
      let vm = this
      // 
      try {
        vm.labelPieChartConfig = labelPieChartConfig ? labelPieChartConfig : ''
      } catch (error) {
        vm.labelPieChartConfig = ''
      }
      // 
      // vm.getStatisticsYear();
      vm.getStatisticsYearSBN();
      vm.getStatisticsYearQUAN_HUYEN();
      vm.getStatisticsYearXA_PHUONG();
      // 
      vm.sumReport()
    },
    yearSelected2() {
      let vm = this
      if (vm.groupCode === 'XA_PHUONG') {
        vm.getStatisticsMonth('XA_PHUONG', vm.quanhuyenSelected)
      } else {
        vm.getStatisticsMonth(this.groupCode)
      }
    },
    monthSelected() {
      let vm = this
      if (vm.groupCode === 'XA_PHUONG') {
        vm.getStatisticsMonth('XA_PHUONG', vm.quanhuyenSelected)
      } else {
        vm.getStatisticsMonth(this.groupCode)
      }
    },
    // distGroupSelected(val) {
    //   let vm = this
    //   vm.getStatisticsMonth(this.groupCode);
    // },
    groupCode(val) {
      let vm = this
      if (val !== 'XA_PHUONG') {
        vm.quanhuyenSelected = ''
        vm.getStatisticsMonth(val)
      }
    }
  },
  methods: {
    changeLevel (levelSelect) {
      let vm = this
      // vm.thutucPage = 1
      // vm.levelFilter = levelSelect
      // vm.doLoadingThuTuc()
      // vm.dialogServiceInfo = true

      let pathName = window.themeDisplay.getSiteAdminURL().split('/~')[0].replace('group','web')
      let url = pathName + '/thu-tuc-hanh-chinh#/thu-tuc-hanh-chinh/?page=1&level=' + levelSelect
      window.open(url, "_blank")
    },
    doLoadingThuTuc () {
      let vm = this
      vm.serviceInfoList = []
      let paramGet = {
        start: vm.thutucPage * 15 - 15,
        end: vm.thutucPage * 15,
        level: vm.levelFilter
      }
      let param = {
        headers: {
          groupId: window.themeDisplay.getScopeGroupId()
        },
        params: paramGet
      }
      vm.loadingService = true
      axios.get('/o/rest/v2/serviceinfos', param).then(function (response) {
        vm.loadingService = false
        let serializable = response.data
        if (serializable.data) {
          vm.serviceInfoList = serializable.data
          vm.totalThuTuc = serializable.total
        } else {
          vm.totalThuTuc = 0
          vm.serviceInfoList = []
        }
      }).catch(function (error) {
        vm.loadingService = false
        vm.totalThuTuc = 0
        vm.serviceInfoList = []
      })
    },
    paggingData (config) {
      let vm = this
      vm.thutucPage = config.page
      vm.doLoadingThuTuc()
    },
    getLevelService () {
      let vm = this
      let param = {
        headers: {
          groupId: window.themeDisplay.getScopeGroupId()
        }
      }
      axios.get('/o/rest/v2/serviceinfos/statistics/levels', param).then(function (response) {
        let serializable = response.data
        if (serializable.data) {
          let totalXXX = 0
          let result = serializable.data
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
        }
      }).catch(function (error) {
        console.log(error)
        reject(error)
      })
    },
    getDictgroups(key) {
      let vm = this;
      let originUrl = window.location.origin;
      let config = {
        url:
          originUrl +
          "/o/rest/v2/dictcollections/REPORT_GROUP/dictgroups/" +
          key +
          "/dictitems",
        headers: {
          groupId: window.themeDisplay.getScopeGroupId(),
          Accept: "application/json"
        }
      }
      axios
        .request(config)
        .then(function(response) {
          let totalScore = [{itemName: 'Tất cả đơn vị', itemCode: 'total'}]
          if (response.data.data) {
            if (key === 'SBN') {
              vm.listDonViSBN = totalScore.concat(response.data.data)
            } else if (key === 'QUAN_HUYEN') {
              vm.listDoiTuong = response.data.hasOwnProperty('data') ? totalScore.concat(response.data.data) : []
              vm.listDonViHuyen = response.data.hasOwnProperty('data') ? totalScore.concat(response.data.data) : []
            } else {
              vm.listDonViXa = response.data.hasOwnProperty('data') ? totalScore.concat(response.data.data) : []
            }
          } else {
            if (key === 'SBN') {
              vm.listDonViSBN = []
            } else if (key === 'QUAN_HUYEN') {
              vm.listDoiTuong = []
              vm.listDonViHuyen = []
            } else {
              vm.listDonViXa = []
            }
          }
        })
        .catch()
    },
    getStatisticsYear() {
      let vm = this;
      let originUrl = window.location.origin;
      let config = {
        url: originUrl + "/o/rest/statistics",
        headers: {
          groupId: window.themeDisplay.getScopeGroupId(),
          Accept: "application/json"
        },
        params: {
          year: vm.yearSelected,
          month: 0,
          domain: 'total',
          agency: 'total'
        }
      };
      axios
        .request(config)
        .then(function(response) {
          if (response.data.data) {
            vm.statistics = response.data.data[0]
            vm.processingTotal = vm.statistics.processingCount + vm.statistics.waitingCount
            // số liệu hoàn thành, đang xử lý chỉ lấy hồ sơ trong năm hiện tại
            if (vm.thongKeHauGiang) {
              vm.processingTotal = vm.statistics.processingInAPeriodCount
            }
            vm.statisticalYear = [
              response.data.data[0].ontimeCount + response.data.data[0].betimesCount,
              response.data.data[0].overtimeCount
            ]
            // if (vm.thongKeHauGiang) {
            //   vm.statisticalYear = [
            //     response.data.data[0].ontimeCount + response.data.data[0].betimesCount,
            //     response.data.data[0].overtimeCount + response.data.data[0].overdueCount
            //   ]
            // }
          } else {
            vm.processingTotal = 0
            vm.statisticalYear = [0, 0]
            vm.statistics = {
              receivedCount: 0,
              releaseCount: 0,
              processingCount: 0,
              overtimeCount: 0
            }
          }
        })
        .catch();
    },
    getStatisticsYearSBN(agency) {
      let vm = this;
      vm.getLabelPieChartConfig()
      let originUrl = window.location.origin;
      let config = {
        url: originUrl + "/o/rest/statistics",
        headers: {
          groupId: window.themeDisplay.getScopeGroupId(),
          Accept: "application/json"
        },
        params: {
          year: vm.yearSelected,
          month: 0,
          domain: "total",
          agency: "total",
          groupCode: "SBN"
        }
      };
      setTimeout(function () {
        if (vm.donViSBN && vm.donViSBN !== 'total') {
          config.params = {
            year: vm.yearSelected,
            month: 0,
            domain: "total",
            agency: vm.donViSBN,
          }
        } else {
          config.params = {
            year: vm.yearSelected,
            month: 0,
            domain: "total",
            agency: "total",
            groupCode: "SBN"
          }
        }
        axios
          .request(config)
          .then(function(response) {
            if (response.data.data) {
              if (!vm.thongKeHauGiang) {
                if (vm.labelPieChartConfig) {
                  vm.statisticalSBN = vm.labelPieChartConfig.map(x => response.data.data[0][x['value']])
                } else {
                  vm.statisticalSBN = [
                    response.data.data[0].undueCount,
                    response.data.data[0].overdueCount,
                    response.data.data[0].ontimeCount,
                    response.data.data[0].overtimeCount,
                    response.data.data[0].cancelledCount,
                    response.data.data[0].waitingCount
                  ]
                }
              }
              
              if (vm.thongKeHauGiang) {
                vm.statisticTotalSBN = response.data.data[0]
                vm.processingSBN = vm.statisticTotalSBN.processingCount + vm.statisticTotalSBN.waitingCount
                if (vm.thongKeHauGiang) {
                  vm.processingSBN = vm.statisticTotalSBN.processingInAPeriodCount
                }
                vm.statisticalSBN = [
                  response.data.data[0].ontimeCount + response.data.data[0].betimesCount,
                  response.data.data[0].overtimeCount
                ]
              }
            } else {
              vm.statisticTotalSBN = vm.statistics
              vm.statisticalSBN = vm.labelPieChartConfig ? vm.labelPieChartConfig.map(x => 0) : [0, 0, 0, 0, 0, 0]
            }
          })
          .catch();
      }, 50)
      
    },
    getStatisticsYearQUAN_HUYEN() {
      let vm = this;
      vm.getLabelPieChartConfig();
      let originUrl = window.location.origin;
      let config = {
        url: originUrl + "/o/rest/statistics",
        headers: {
          groupId: window.themeDisplay.getScopeGroupId(),
          Accept: "application/json"
        },
        params: {
          year: vm.yearSelected,
          month: 0,
          domain: "total",
          agency: "total",
          groupCode: "QUAN_HUYEN"
        }
      };
      setTimeout(function () {
        if (vm.donViHuyen && vm.donViHuyen !== 'total') {
          config.params = {
            year: vm.yearSelected,
            month: 0,
            domain: "total",
            agency: vm.donViHuyen
          }
        } else {
          config.params = {
            year: vm.yearSelected,
            month: 0,
            domain: "total",
            agency: "total",
            groupCode: "QUAN_HUYEN"
          }
        }
        axios
          .request(config)
          .then(function(response) {
            if (response.data.data) {
              if (!vm.thongKeHauGiang) {
                if (vm.labelPieChartConfig) {
                  vm.statisticalQUAN_HUYEN = vm.labelPieChartConfig.map(x => response.data.data[0][x['value']])
                } else {
                  vm.statisticalQUAN_HUYEN = [
                    response.data.data[0].undueCount,
                    response.data.data[0].overdueCount,
                    response.data.data[0].ontimeCount,
                    response.data.data[0].overtimeCount,
                    response.data.data[0].cancelledCount,
                    response.data.data[0].waitingCount
                  ]
                }
              }
              
              if (vm.thongKeHauGiang) {
                vm.statisticTotalQuanHuyen = response.data.data[0]
                vm.processingQuanHuyen = vm.statisticTotalQuanHuyen.processingCount + vm.statisticTotalQuanHuyen.waitingCount
                if (vm.thongKeHauGiang) {
                  vm.processingQuanHuyen = vm.statisticTotalQuanHuyen.processingInAPeriodCount
                }
                vm.statisticalQUAN_HUYEN = [
                  response.data.data[0].ontimeCount + response.data.data[0].betimesCount,
                  response.data.data[0].overtimeCount
                ]
              }
            } else {
              vm.statisticTotalQuanHuyen = vm.statistics
              vm.statisticalQUAN_HUYEN = vm.labelPieChartConfig ? vm.labelPieChartConfig.map(x => 0) : [0, 0, 0, 0, 0, 0];
            }
          })
          .catch();
      }, 50)
      
    },
    getStatisticsYearXA_PHUONG() {
      let vm = this;
      vm.getLabelPieChartConfig();
      let originUrl = window.location.origin;
      let config = {
        url: originUrl + "/o/rest/statistics",
        headers: {
          groupId: window.themeDisplay.getScopeGroupId(),
          Accept: "application/json"
        },
        params: {
          domain: "total",
          agency: "total",
          year: vm.yearSelected,
          month: 0,
          groupCode: "XA_PHUONG"
        }
      };
      setTimeout (function () {
        if (vm.donViXa && vm.donViXa !== 'total') {
          config.params = {
            domain: "total",
            agency: vm.donViXa,
            year: vm.yearSelected,
            month: 0
          }
        } else {
          config.params = {
            domain: "total",
            agency: "total",
            year: vm.yearSelected,
            month: 0,
            groupCode: "XA_PHUONG"
          }
        }
        axios
          .request(config)
          .then(function(response) {
            if (response.data.data) {
              if (!vm.thongKeHauGiang) {
                if (vm.labelPieChartConfig) {
                  vm.statisticalXA_PHUONG = vm.labelPieChartConfig.map(x => response.data.data[0][x['value']])
                } else {
                  vm.statisticalXA_PHUONG = [
                    response.data.data[0].undueCount,
                    response.data.data[0].overdueCount,
                    response.data.data[0].ontimeCount,
                    response.data.data[0].overtimeCount,
                    response.data.data[0].cancelledCount,
                    response.data.data[0].waitingCount
                  ];
                }
              }
              
              if (vm.thongKeHauGiang) {
                vm.statisticTotalXaPhuong = response.data.data[0]
                vm.processingXaPhuong = vm.statisticTotalXaPhuong.processingCount + vm.statisticTotalXaPhuong.waitingCount
                if (vm.thongKeHauGiang) {
                  vm.processingXaPhuong = vm.statisticTotalXaPhuong.processingInAPeriodCount
                }
                vm.statisticalXA_PHUONG = [
                  response.data.data[0].ontimeCount + response.data.data[0].betimesCount,
                  response.data.data[0].overtimeCount
                ]
              }
            } else {
              vm.statisticTotalXaPhuong = vm.statistics
              vm.statisticalXA_PHUONG = vm.labelPieChartConfig ? vm.labelPieChartConfig.map(x => 0) : [0, 0, 0, 0, 0, 0];
            }
          })
          .catch();
      }, 50)
    },
    getStatisticsMonth(groupCode, itemQH) {
      let vm = this;
      vm.isLoading = true;
      let originUrl = window.location.origin;
      let config = {};
      if (groupCode === "XA_PHUONG") {
        vm.groupCode = "XA_PHUONG"
        vm.quanhuyenSelected = itemQH
        config = {
          url: originUrl + "/o/rest/statistics",
          headers: {
            groupId: window.themeDisplay.getScopeGroupId(),
            Accept: "application/json"
          },
          params: {
            domain: "total",
            year: vm.yearSelected2,
            month: vm.monthSelected,
            groupCode: groupCode,
            parentAgency: itemQH.itemCode
          }
        };
      } else {
        config = {
          url: originUrl + "/o/rest/statistics",
          headers: {
            groupId: window.themeDisplay.getScopeGroupId(),
            Accept: "application/json"
          },
          params: {
            domain: "total",
            year: vm.yearSelected2,
            month: vm.monthSelected,
            groupCode: groupCode
          }
        };
      }

      axios
        .request(config)
        .then(function(response) {
          vm.statisticalMonth[0].data = [];
          vm.statisticalMonth[1].data = [];
          vm.chartOptionsMonth.xaxis.categories = [];
          if (response.data.data) {
            vm.danhSachThongKeThang = response.data.data;
            let currentData = response.data.data[0]
            // if(!config.params.hasOwnProperty('parentAgency')){
              vm.danhSachThongKeThang.shift()
            // }
            for (let i = 0; i < vm.danhSachThongKeThang.length; i++) {
              vm.statisticalMonth[0].data.push(
                response.data.data[i].onegateCount
              );
              vm.statisticalMonth[1].data.push(
                response.data.data[i].onlineCount
              );
              vm.chartOptionsMonth.xaxis.categories.push(
                response.data.data[i].govAgencyName
              );
              vm.isLoading = false;
            }
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
          } else {
            vm.setTotalCounter()
          }
        })
        .catch();
    },
    setTotalCounter () {
      let vm = this
      vm.statisticalMonth[0].data = []
      vm.statisticalMonth[1].data = []
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
    },
    getLabelPieChartConfig () {
      let vm = this
      if (vm.labelPieChartConfig) {
        vm.chartOptionsSoQuanXa = {
          labels: vm.labelPieChartConfig.map(x => x['text']),
          colors: vm.labelPieChartConfig.map(x => x['color']),
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
          legend: {
            fontFamily: 'Roboto, Arial, sans-serif',
            formatter: function(seriesName, opts) {
              return '<span style="color:' + opts.w.globals.colors[opts.seriesIndex]+ '">' +
              opts.w.globals.series[opts.seriesIndex] + '</span>&nbsp;' + seriesName
            }
          },
          dataLabels: {
            enabled: true,
            formatter: function(val) {
              if (Number(val) > 3) {return val.toFixed(1) + '%'}
              return ''
            }
          }
        }
      }
      if (vm.thongKeHauGiang) {
        vm.chartOptionsSoQuanXa = vm.chartOptionsYearHauGiang
      }
    },
    sumReport () {
      let vm = this
      let itemsGroups = ['SBN', 'QUAN_HUYEN', 'XA_PHUONG']
      let arrAction = []
      for (let index in itemsGroups) {
        arrAction.push(
          new Promise((resolve, reject) => {
            let config = {
              url: "/o/rest/statistics",
              headers: {
                groupId: window.themeDisplay.getScopeGroupId(),
                Accept: "application/json"
              },
              params: {
                domain: "total",
                agency: "total",
                year: vm.yearSelected,
                month: 0,
                groupCode: itemsGroups[index]
              }
            };
            axios
            .request(config)
            .then(function(response) {
              if (response.data.data) {
                resolve(response.data.data[0])
              } else {
                reject({})
              }
            }).catch(function() {
              reject({})
            })
          })
        )
      }
      vm.statisticSum = ''
      let sumReport = {
        releaseInAPeriodCount: 0,
        receivedCount: 0,
        releaseCount: 0,
        processingCount: 0,
        betimesCount: 0,
        ontimeCount: 0,
        overtimeCount: 0
      }
      Promise.all(arrAction).then(results => {
        sumReport.receivedCount = results[0]['receivedCount'] + results[1]['receivedCount'] + results[2]['receivedCount']
        sumReport.releaseCount = results[0]['releaseCount'] + results[1]['releaseCount'] + results[2]['releaseCount']
        sumReport.releaseInAPeriodCount = results[0]['releaseInAPeriodCount'] + results[1]['releaseInAPeriodCount'] + results[2]['releaseInAPeriodCount']
        sumReport.processingCount = results[0]['processingInAPeriodCount'] +results[1]['processingInAPeriodCount'] + results[2]['processingInAPeriodCount']
        sumReport.betimesCount = results[0]['betimesCount'] +results[1]['betimesCount'] + results[2]['betimesCount']
        sumReport.ontimeCount = results[0]['ontimeCount'] +results[1]['ontimeCount'] + results[2]['ontimeCount']
        sumReport.overtimeCount = results[0]['overtimeCount'] +results[1]['overtimeCount'] + results[2]['overtimeCount']
        vm.processingTotal = sumReport.processingCount
        vm.statisticSum = sumReport
        vm.statisticalYear = [
          sumReport.ontimeCount + sumReport.betimesCount,
          sumReport.overtimeCount
        ]
      }).catch(xhr => {
      })
    }
  }
};
</script>
