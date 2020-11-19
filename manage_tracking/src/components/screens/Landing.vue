<template>
  <div style="width: 1300px; margin: 0 auto; background-color: #eaf0f7;">
    <v-layout wrap class="px-2">
      <v-flex xs12 md6 class="px-2">
        <v-layout wrap class="">
          <v-flex xs6 class="pr-2 py-3">
            <div class="px-3 py-3" style="background: #17c6b4;border-radius: 7px;">
              <div class="">
                <div class="">
                  <i class="fa fa-paper-plane" style="color: #fff;font-size: 20px;background: #FFC107;
                    padding: 10px;border-radius: 50%;float:right;width:45px;height:45px;font-weight: 500;"></i>
                </div>
                <div class="white--text">
                  <h6 class="mb-2" style="font-size: 14px;font-weight: 500;">LƯỢT TRUY CẬP</h6>
                  <h4 class=""><label style="margin-bottom: 0px;font-size: 26px">11.146</label></h4>
                </div>
              </div>
            </div>
          </v-flex>
          <v-flex xs6 class="pl-2 py-3">
            <div class="px-3 py-3" style="background: #17c6b4;border-radius: 7px;">
              <div class="">
                <div class="">
                  <i class="fa fa-user-plus" style="color: #fff;font-size: 20px;background: #FFC107;
                  padding: 10px;border-radius: 50%;float:right;width:45px;height:45px;font-weight:500;"></i>
                </div>
                <div class="white--text">
                  <h6 class="mb-2" style="font-size: 14px;font-weight: 500;">NGƯỜI DÙNG</h6>
                  <h4 class=""><label style="margin-bottom: 0px;font-size: 26px">5.146</label></h4>
                </div>
              </div>
            </div>
          </v-flex>
          <v-flex xs12 class="">
            <div class="v-sheet theme--light" style="border-radius: 7px;">
              <div class="pl-3" style="height: 42px;
                font-size: 14px;
                font-weight: 500;
                background: #17c6b4;
                line-height: 42px;
                color: #fff;border-top-left-radius: 7px;border-top-right-radius: 7px;">
                <div class="">ĐANG TRUY CẬP</div>
              </div>
              <v-card-text class="px-0 py-0">
                <v-layout wrap class="custom-class" style="height: 250px">
                  <v-flex xs6 class="px-2" style="">
                    <div class="text-xs-center" style="color: #1d9488">
                      <div style="font-size: 48px; font-weight: 900; margin: 0px 20px;">
                        <span><label style="margin-bottom: 0px;">198</label></span>
                      </div>
                      <span>
                        <b>198 </b> lượt truy cập và <b>368 </b> hành động <br> trong <b>3 </b> phút gần đây 
                      </span>
                    </div>
                    <div class="mt-3">
                      <table class="dataTable" cellspacing="0" style="background: #17c6b4; border-radius: 3px;color: #fff;">
                        <thead>
                          <tr>
                            <th id="label" class="sortable label first py-2" style="cursor: auto;border-bottom: 1px dotted #fff;border-right: 1px dotted #fff;">
                              <div>Thời gian</div>
                            </th>
                            <th class="sortable py-2" style="cursor: auto;border-bottom: 1px dotted #fff;border-right: 1px dotted #fff;">
                              <div>Truy cập</div>
                            </th>
                            <th class="sortable py-2" style="cursor: auto;border-bottom: 1px dotted #fff;">
                              <div>Hành động</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr class="">
                            <td class="label column pl-2 py-2 text-bold" style="border-bottom: 1px dotted #fff;border-right: 1px dotted #fff;">24 giờ qua</td>
                            <td class="column text-xs-center text-bold" style="border-bottom: 1px dotted #fff;border-right: 1px dotted #fff;">7</td>
                            <td class="column text-xs-center text-bold" style="border-bottom: 1px dotted #fff;">61</td>
                          </tr>
                          <tr class="">
                            <td class="label column pl-2 py-2 text-bold" style="border-right: 1px dotted #fff;">30 phút qua</td>
                            <td class="column text-xs-center text-bold" style="border-right: 1px dotted #fff;">1</td>
                            <td class="column text-xs-center text-bold">0</td>
                          </tr>
                        </tbody>
                    </table>
                    </div>
                  </v-flex>
                  <v-flex xs6 style="position: relative;">
                    <div class="px-2" style="
                        height: 20px;
                    ">
                      <i class="" style="
                          position: absolute;
                          top: 5px;
                          font-weight: bold;
                          right: 10px;
                          color: #1d9488;
                      ">Truy cập 24 giờ qua</i>
                    </div>
                    <div id="contentListVisitor" style="max-height: 245px;overflow: hidden auto;">
                      <v-list three-line>
                        <v-list-tile
                          v-for="item in visitorList"
                          :key="item.idVisit"
                          avatar
                          @click=""
                        >
                          <v-list-tile-content class="pl-2">
                            <v-list-tile-title>
                              Thứ {{ (new Date (item.serverDatePretty)).getDay() + 1 }}, 
                              {{ (new Date (item.serverDatePretty)).getDate()}}/{{ (new Date (item.serverDatePretty)).getMonth() + 1}}/{{ (new Date (item.serverDatePretty)).getFullYear()}}
                              - {{item.serverTimePretty}} <i>(ip: {{item.visitIp}})</i>
                            </v-list-tile-title>
                            <v-list-tile-sub-title>
                              <span class="visitorDetails" style="margin-right: 10px">
                                <v-tooltip bottom>
                                  <img style="width: 16px;" slot="activator" :src="'http://thongke.fds.vn/' + item.browserIcon">
                                  <span>{{ item.browser }}</span>
                                </v-tooltip>
                              </span>
                              <span class="visitorDetails" style="margin-right: 10px">
                                <v-tooltip bottom>
                                  <img style="width: 16px;" slot="activator" :src="'http://thongke.fds.vn/' + item.operatingSystemIcon">
                                  <span>{{ item.operatingSystem }}</span>
                                </v-tooltip>
                              </span>
                              <span class="visitorDetails" style="margin-right: 10px">
                                <v-tooltip bottom>
                                  <img style="width: 16px;" slot="activator" :src="'http://thongke.fds.vn/' + item.deviceTypeIcon">
                                  <span>{{ item.deviceType }}</span>
                                </v-tooltip>
                              </span>
                              <span class="visitorDetails">
                                <v-tooltip bottom>
                                  <i slot="activator" class="fa fa-address-card-o" style="color: #1867c0;font-size: 14px;"></i>
                                  <span>Chi tiết truy cập</span>
                                </v-tooltip>
                              </span>
                            </v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                      </v-list>
                    </div>
                  </v-flex>
                </v-layout>
                
              </v-card-text>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 md6 class="my-3 px-2">
        <div class="v-sheet theme--light" style="border-radius: 7px;">
          <div class="pl-3" style="height: 42px;
            font-size: 14px;
            font-weight: 500;
            background: #17c6b4;
            line-height: 42px;
            color: #fff;border-top-left-radius: 7px;border-top-right-radius: 7px;">
            <div class="">TRUY CẬP THEO THỜI GIAN</div>
          </div>
          <v-card-text class="px-0 py-0">
            <v-layout wrap class="custom-class">
              <v-flex xs12>
                <apexchart type="line" height="350" ref="chart" :options="chartOptionsLineType" :series="seriesLineType"></apexchart>
              </v-flex>
            </v-layout>
          </v-card-text>
        </div>
      </v-flex>
      <v-flex xs12 md6 class="pa-2">
        <div class="v-sheet theme--light" style="border-radius: 7px;">
          <div class="pl-3" style="height: 42px;
            font-size: 14px;
            font-weight: 500;
            background: #17c6b4;
            line-height: 42px;
            color: #fff;border-top-left-radius: 7px;border-top-right-radius: 7px;">
            <div class="">TRÌNH DUYỆT TRUY CẬP</div>
          </div>
          <v-card-text class="px-0 py-0">
            <v-layout wrap class="custom-class">
              <v-flex xs12>
                
              </v-flex>
            </v-layout>
          </v-card-text>
        </div>
      </v-flex>
      <v-flex xs12 md6 class="pa-2">
        <div class="v-sheet theme--light" style="border-radius: 7px;">
          <div class="pl-3" style="height: 42px;
            font-size: 14px;
            font-weight: 500;
            background: #17c6b4;
            line-height: 42px;
            color: #fff;border-top-left-radius: 7px;border-top-right-radius: 7px;">
            <div class="">THIẾT BỊ TRUY CẬP</div>
          </div>
          <v-card-text class="px-0 py-0">
            <v-layout wrap class="custom-class">
              <v-flex xs12>
                <!-- <apexchart class="colum-chart" type="bar" height="300" :options="chartOptionsColumn" :series="seriesColumn"></apexchart> -->
              </v-flex>
            </v-layout>
          </v-card-text>
        </div>
      </v-flex>
    </v-layout>
    <!--  -->
    <v-dialog v-model="dialog_visitor" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title class="">Thông tin người dùng</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon dark @click="dialog_visitor = false">
              <v-icon size="24">clear</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios"
import TinyPagination from './Pagination.vue'
export default {
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    loading: false,
    dialog_visitor: false,
    visitorList: [
    {
        "idSite": "1",
        "idVisit": "25",
        "visitIp": "101.96.0.0",
        "visitorId": "9add0157f78b306d",
        "fingerprint": "30c2bd98dea86f14",
        "actionDetails": [
        ],
        "goalConversions": 0,
        "siteCurrency": "USD",
        "siteCurrencySymbol": "$",
        "serverDate": "2020-11-19",
        "visitServerHour": "5",
        "lastActionTimestamp": 1605762514,
        "lastActionDateTime": "2020-11-19 05:08:34",
        "siteName": "DVC-HG-QA",
        "serverTimestamp": 1605762514,
        "firstActionTimestamp": 1605759800,
        "serverTimePretty": "12:08:34",
        "serverDatePretty": "Thursday, November 19, 2020",
        "serverDatePrettyFirstAction": "Thursday, November 19, 2020",
        "serverTimePrettyFirstAction": "11:23:20",
        "userId": null,
        "visitorType": "returning",
        "visitorTypeIcon": "plugins/Live/images/returningVisitor.png",
        "visitConverted": "0",
        "visitConvertedIcon": null,
        "visitCount": "11",
        "visitEcommerceStatus": "none",
        "visitEcommerceStatusIcon": null,
        "daysSinceFirstVisit": "2",
        "daysSinceLastEcommerceOrder": "0",
        "visitDuration": "2715",
        "visitDurationPretty": "45 min 15s",
        "searches": "0",
        "actions": "13",
        "interactions": "13",
        "referrerType": "direct",
        "referrerTypeName": "Direct Entry",
        "referrerName": "",
        "referrerKeyword": "",
        "referrerKeywordPosition": null,
        "referrerUrl": null,
        "referrerSearchEngineUrl": null,
        "referrerSearchEngineIcon": null,
        "referrerSocialNetworkUrl": null,
        "referrerSocialNetworkIcon": null,
        "languageCode": "en-us",
        "language": "Language code en-us",
        "deviceType": "Desktop",
        "deviceTypeIcon": "plugins/Morpheus/icons/dist/devices/desktop.png",
        "deviceBrand": "Unknown",
        "deviceModel": "Generic Desktop",
        "operatingSystem": "Windows 10",
        "operatingSystemName": "Windows",
        "operatingSystemIcon": "plugins/Morpheus/icons/dist/os/WIN.png",
        "operatingSystemCode": "WIN",
        "operatingSystemVersion": "10",
        "browserFamily": "Blink",
        "browserFamilyDescription": "Blink (Chrome, Opera)",
        "browser": "Chrome 86.0",
        "browserName": "Chrome",
        "browserIcon": "plugins/Morpheus/icons/dist/browsers/CH.png",
        "browserCode": "CH",
        "browserVersion": "86.0",
        "totalEcommerceRevenue": "0.00",
        "totalEcommerceConversions": "0",
        "totalEcommerceItems": "0",
        "totalAbandonedCartsRevenue": "0.00",
        "totalAbandonedCarts": "0",
        "totalAbandonedCartsItems": "0",
        "events": "0",
        "continent": "North America",
        "continentCode": "amn",
        "country": "United States",
        "countryCode": "us",
        "countryFlag": "plugins/Morpheus/icons/dist/flags/us.png",
        "region": null,
        "regionCode": null,
        "city": null,
        "location": "United States",
        "latitude": null,
        "longitude": null,
        "visitLocalTime": "11:23:18",
        "visitLocalHour": "11",
        "daysSinceLastVisit": "0",
        "customVariables": [],
        "resolution": "1536x864",
        "plugins": "cookie, pdf",
        "pluginsIcons": [
            {
                "pluginIcon": "plugins/Morpheus/icons/dist/plugins/cookie.png",
                "pluginName": "cookie"
            },
            {
                "pluginIcon": "plugins/Morpheus/icons/dist/plugins/pdf.png",
                "pluginName": "pdf"
            }
        ]
    },
    {
        "idSite": "1",
        "idVisit": "26",
        "visitIp": "101.96.0.0",
        "visitorId": "fcc82f19c12b1a7d",
        "fingerprint": "f7ad8c54cab9fe6a",
        "actionDetails": [
        ],
        "goalConversions": 0,
        "siteCurrency": "USD",
        "siteCurrencySymbol": "$",
        "serverDate": "2020-11-19",
        "visitServerHour": "5",
        "lastActionTimestamp": 1605762012,
        "lastActionDateTime": "2020-11-19 05:00:12",
        "siteName": "DVC-HG-QA",
        "serverTimestamp": 1605762012,
        "firstActionTimestamp": 1605760199,
        "serverTimePretty": "12:00:12",
        "serverDatePretty": "Thursday, November 19, 2020",
        "serverDatePrettyFirstAction": "Thursday, November 19, 2020",
        "serverTimePrettyFirstAction": "11:29:59",
        "userId": null,
        "visitorType": "returning",
        "visitorTypeIcon": "plugins/Live/images/returningVisitor.png",
        "visitConverted": "0",
        "visitConvertedIcon": null,
        "visitCount": "7",
        "visitEcommerceStatus": "none",
        "visitEcommerceStatusIcon": null,
        "daysSinceFirstVisit": "2",
        "daysSinceLastEcommerceOrder": "0",
        "visitDuration": "1814",
        "visitDurationPretty": "30 min 14s",
        "searches": "0",
        "actions": "9",
        "interactions": "9",
        "referrerType": "direct",
        "referrerTypeName": "Direct Entry",
        "referrerName": "",
        "referrerKeyword": "",
        "referrerKeywordPosition": null,
        "referrerUrl": "http://hanoi.fds.vn:8074/c/portal/logout",
        "referrerSearchEngineUrl": null,
        "referrerSearchEngineIcon": null,
        "referrerSocialNetworkUrl": null,
        "referrerSocialNetworkIcon": null,
        "languageCode": "en-us",
        "language": "Language code en-us",
        "deviceType": "Desktop",
        "deviceTypeIcon": "plugins/Morpheus/icons/dist/devices/desktop.png",
        "deviceBrand": "Unknown",
        "deviceModel": "Generic Desktop",
        "operatingSystem": "Windows 10",
        "operatingSystemName": "Windows",
        "operatingSystemIcon": "plugins/Morpheus/icons/dist/os/WIN.png",
        "operatingSystemCode": "WIN",
        "operatingSystemVersion": "10",
        "browserFamily": "Blink",
        "browserFamilyDescription": "Blink (Chrome, Opera)",
        "browser": "Chrome 86.0",
        "browserName": "Chrome",
        "browserIcon": "plugins/Morpheus/icons/dist/browsers/CH.png",
        "browserCode": "CH",
        "browserVersion": "86.0",
        "totalEcommerceRevenue": "0.00",
        "totalEcommerceConversions": "0",
        "totalEcommerceItems": "0",
        "totalAbandonedCartsRevenue": "0.00",
        "totalAbandonedCarts": "0",
        "totalAbandonedCartsItems": "0",
        "events": "0",
        "continent": "North America",
        "continentCode": "amn",
        "country": "United States",
        "countryCode": "us",
        "countryFlag": "plugins/Morpheus/icons/dist/flags/us.png",
        "region": null,
        "regionCode": null,
        "city": null,
        "location": "United States",
        "latitude": null,
        "longitude": null,
        "visitLocalTime": "11:29:57",
        "visitLocalHour": "11",
        "daysSinceLastVisit": "1",
        "customVariables": [],
        "resolution": "1536x864",
        "plugins": "cookie, pdf",
        "pluginsIcons": [
            {
                "pluginIcon": "plugins/Morpheus/icons/dist/plugins/cookie.png",
                "pluginName": "cookie"
            },
            {
                "pluginIcon": "plugins/Morpheus/icons/dist/plugins/pdf.png",
                "pluginName": "pdf"
            }
        ]
    }],
    seriesLineType: [
      {data: [20, 31, 31, 39, 56, 61, 85, 195, 163, 190, 205, 252, 299, 353, 415]}
    ],
    chartOptionsLineType: {
      chart: {
        height: 350,
        type: "line",
        group: "detail",
        id: "areachart-1",
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      grid: {
        padding: {
          right: 30,
          left: 20
        }
      },

      labels: ["14 Mar 2020", "15 Mar 2020", "16 Mar 2020", "17 Mar 2020", "18 Mar 2020", "19 Mar 2020", "20 Mar 2020", "21 Mar 2020",
      "22 Mar 2020",
      "23 Mar 2020",
      "24 Mar 2020",
      "25 Mar 2020",
      "26 Mar 2020",
      "27 Mar 2020",
      "28 Mar 2020"],
      xaxis: {
        type: "datetime"
      }
    },
  }),
  computed: {
    
  },
  created() {
    let vm = this
    vm.$nextTick(() => {

    })
  },
  watch: {
    
  },
  methods: {
    getStatisticsYear() {
      let vm = this
      let config = {
        url: "/o/rest/statistics",
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
            vm.statisticalYear = [
              response.data.data[0].ontimeCount + response.data.data[0].betimesCount,
              response.data.data[0].overtimeCount
            ];
          } else {
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
    }
  }
};
</script>
