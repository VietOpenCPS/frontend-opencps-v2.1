<template>
<div class="py-0 kios-item">
  <v-card color="transparent" flat style="">
    <div>
      <v-btn v-if="!showDanhSachThuTuc && !showDanhSachThuTucXa" style="position: absolute;right: 0; top: 0px;z-index: 1000;" flat icon color="#903938" @click="showFilter = !showFilter">
        <v-icon>settings</v-icon>
      </v-btn>
    </div>
    <div v-if="showFilter" class="adv_search my-2 px-2" style="max-width: 1500px;margin:0px auto;">
      <div class="searchAdvanced-content py-0 pl-4">
        <v-layout wrap>
          <v-flex xs12 class="mb-3 px-2">
            <div>
              <div class="d-inline-block text-bold" style="font-weight:450;width: 130px;color: #fff">Cấp thực hiện:</div>
              <v-autocomplete
                style="min-width: 450px;"
                placeholder="Chọn cấp"
                class="select-search d-inline-block"
                :items="choncoquanquanlyItems"
                v-model="choncoquanquanlyModel"
                item-text="name"
                item-value="value"
                @change="(e) => selectCoQuanQuanLy(e)"
                hide-details
                hide-no-data
                solo
                flat
              ></v-autocomplete>
            </div>
          </v-flex>
        </v-layout>
      </div>
    </div>
    <div class="v-content__wrap">
      <div class="pt-4" style="max-width: 1500px;margin:0px auto;">
        <div class="pa-0">
          <div class="layout row wrap">
            <div class="flex xs12" style="position:relative">
              <img src="/o/tinhdongthap-theme/images/logo-new.png"
                class="anh-logo"
                style="width: 70px;height: 70px">
              <!-- bảng show danh sách cấp Huyện -->
              <div v-if="showDanhSachCapHuyen">
                <div style="text-align: center;
                  font-size: 24px;
                  color: #fff;
                  text-transform: uppercase;height: 70px;">
                  Bảng niêm yết các thủ tục hành chính thuộc phạm vi giải quyết của UBND Huyện
                </div>                
                <v-container fluid grid-list-xl class="wrap-list-content" style="padding-top: 0px">
                  <v-layout wrap align-center>
                    <v-flex xs12 sm3 d-flex v-bind:key="item.domainCode" v-for="item in danhSachUbndCapHuyen">
                      <v-btn
                          style="
                            background: #1d4501;
                            cursor:pointer;
                            border: 1px; 
                            height: 75px; width: 100%;
                            box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 3px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
                          "
                          @click='getThuTucHanhChinh(item)'
                      >
                        <label style="color:yellow; font-weight: 600; margin-top: 10px;
                          font-size:14px; height: 75px; width: 100%; position: absolute; 
                          white-space: normal; overflow: hidden; text-overflow: ellipses;
                          "
                        >
                          Lĩnh vực {{item.domainName}}
                        </label>
                        <label style="color:white;font-size:12px;
                          height: 68px; width: 100%; display: flex;
                          justify-content: center; align-items: flex-end;
                        ">
                          Có {{item.count}} thủ tục
                          <span class="material-icons" style="font-size: 18px;">forward</span>
                        </label>
                      </v-btn>
                    </v-flex> 
                  </v-layout>
                </v-container>
              </div>
              <!-- bảng show danh sách thủ tục của cấp Huyện -->
              <div v-if="showDanhSachThuTuc">
                <div>
                  <v-btn class="btn-go-back" style="position: absolute;right: 0;top: -10px;" outline  color="yellow"
                   @click="getBangNiemYet()">Quay lại</v-btn>
                  <div  style="text-align: center;
                    font-size: 24px;
                    color: #fff;
                    text-transform: uppercase;height: 70px;">
                    Thủ tục hành chính cấp huyện thuộc lĩnh vực: {{linhVucChon.domainName}}
                  </div>
                </div>
                <v-container fluid grid-list-xl class="wrap-list-content" style="padding-top: 0px">
                  <v-layout wrap align-center>
                    <v-flex xs12 sm6 d-flex v-bind:key="item.serviceInfoId" v-for="item in danhSachThuTucHanhChinh"> 
                      <v-btn 
                        style="
                          background-color:#1d4501 !important; 
                          cursor: pointer; 
                          border:1px;
                          height: 65px; width: 100%;
                          box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 3px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
                        "
                      >
                        <img style="width: 55px;height:55px;object-fit:cover;object-position:left;"
                              src="/o/tinhdongthap-theme/images/logo-header.png">
                        <div style="color:yellow;font-size:14px; 
                              height: 60px; width: 100%;
                              justify-content: left; display: flex; text-align: left;padding: 10px; align-items: center;
                              white-space: normal; overflow: hidden; text-overflow: ellipses;
                        ">{{item.serviceName}}</div>
                      </v-btn>
                    </v-flex> 
                  </v-layout>
                </v-container>
              </div>

              <!-- bảng show danh sách cấp Xã -->
              <div v-if="showDanhSachCapXa">
                <div style="text-align: center;
                  font-size: 24px;
                  color: #fff;
                  text-transform: uppercase;height: 70px;">
                  Bảng niêm yết các thủ tục hành chính thuộc phạm vi giải quyết của UBND Xã
                </div>
                <v-container fluid grid-list-xl class="wrap-list-content" style="padding-top: 0px">
                  <v-layout wrap align-center>
                    <v-flex xs12 sm3 d-flex v-bind:key="item.domainCode" v-for="item in danhSachUbndCapXa">
                    <v-btn
                        style="
                          background: #1d4501;
                          cursor:pointer;
                          border: 1px; 
                          height: 75px; width: 100%;
                        "
                        @click='getThuTucHanhChinhXa(item)'
                    >
                      <label style="color:yellow; font-weight: 600; margin-top: 10px;
                        font-size:14px; height: 75px; width: 100%; position: absolute; 
                        white-space: normal; overflow: hidden; text-overflow: ellipses;
                        box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 3px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
                        "
                      >
                        Lĩnh vực {{item.domainName}}
                      </label>
                      <label style="color:white;font-size:12px;
                        height: 68px; width: 100%; display: flex;
                        justify-content: center; align-items: flex-end;
                      ">
                        Có {{item.count}} thủ tục
                        <span class="material-icons" style="font-size: 18px;">forward</span>
                      </label>
                    </v-btn>
                  </v-flex> 
                </v-layout>
              </v-container>
              </div>
              
              <!-- bảng show danh sách thủ tục của cấp Xã -->
              <div v-if="showDanhSachThuTucXa">
                <div>
                  <v-btn class="btn-go-back" style="position: absolute;right: 0;top: -10px;" outline  color="yellow"
                   @click="getBangNiemYet()">Quay lại</v-btn>
                  <div  style="text-align: center;
                    font-size: 24px;
                    color: #fff;
                    text-transform: uppercase;height: 70px;">
                    Thủ tục hành chính cấp xã thuộc lĩnh vực: {{linhVucChon.domainName}}
                  </div>
                </div>
                <v-container fluid grid-list-xl class="wrap-list-content" style="padding-top: 0px">
                  <v-layout wrap align-center>
                    <v-flex xs12 sm6 d-flex v-bind:key="item.serviceInfoId" v-for="item in danhSachThuTucHanhChinhXa">
                      <v-btn 
                            style="
                              background-color:#1d4501 !important; 
                              cursor: pointer; 
                              border:1px;
                              height: 65px; width: 100%;
                            "
                      >
                        <img style="width: 55px;height:55px;object-fit:cover;object-position:left;"
                              src="/o/tinhdongthap-theme/images/logo-header.png">
                        <label style="color:yellow;font-size:14px; 
                              height: 60px; width: 100%;
                              justify-content: left; display: flex;padding: 10px; align-items: center; text-align: left;
                              white-space: normal; overflow: hidden; text-overflow: ellipses;
                              box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 3px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
                        ">{{item.serviceName}}</label>
                      </v-btn>
                    </v-flex> 
                  </v-layout>
                </v-container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-card>
</div>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    showFilter: false,
    linhVucChon: '',
    danhSachUbndCapHuyen: [],
    danhSachThuTucHanhChinh: [],
    danhSachUbndCapXa: [],
    danhSachThuTucHanhChinhXa: [],
    showDanhSachCapHuyen: false,
    showDanhSachThuTuc: false,
    showDanhSachCapXa: false,
    showDanhSachThuTucXa: false,
    choncoquanquanlyItems: [{name: "UBND Cấp Huyện", value: 1}, {name: "UBND Cấp Xã", value: 2}],
    choncoquanquanlyModel: 1,
    
  }),
  created () {
    let vm = this
    vm.selectCoQuanQuanLy(1)
  },
  watch () {
    let vm = this
    vm.selectCoQuanQuanLy(value)
  },
  methods: {
    getBangNiemYet() {
      let vm = this
      vm.showDanhSachCapHuyen = true
      vm.showDanhSachThuTuc = false
      vm.showDanhSachCapXa = false
      vm.showDanhSachThuTucXa = false

      let config = {
        method: 'get',
        url: '/o/rest/v2/serviceinfos/statistics/domains?agency=CAP_HUYEN&sort=siblingSearch',
        headers: { 
          'Accept': 'application/json',
          'groupId': window.themeDisplay.getScopeGroupId()
        }
      };
      axios(config).then(function (response) {
        vm.danhSachUbndCapHuyen = response.data.data
      })
      .catch(function (error) {
        console.log(error);
      });
      
    },
    getThuTucHanhChinh(item) {
      let vm = this
      vm.linhVucChon = item
      vm.showDanhSachCapHuyen = false
      vm.showDanhSachThuTuc = true
      vm.showDanhSachCapXa = false
      vm.showDanhSachThuTucXa = false
      
      vm.domainCode = item.domainCode
      let config = {
        method: 'get',
        url: '/o/rest/v2/serviceinfos?start=0&end=15&administration=CAP_HUYEN&agency=&keyword=&level=0&domain=' + vm.domainCode + '&sort=siblingSearch',
        headers: { 
          'Accept': 'application/json, text/plain, */*', 
          'groupId': window.themeDisplay.getScopeGroupId()
        }
      };
      axios(config).then(function (response) {
        vm.danhSachThuTucHanhChinh = response.data.data
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    
    getBangNiemYetXa() {
      let vm = this
      vm.showDanhSachCapHuyen = false
      vm.showDanhSachThuTuc = false
      vm.showDanhSachCapXa = true
      vm.showDanhSachThuTucXa = false
      let config = {
        method: 'get',
        url: '/o/rest/v2/serviceinfos/statistics/domains?agency=CAP_XA&sort=siblingSearch',
        headers: { 
          'Accept': 'application/json, text/plain, */*', 
          'groupId': window.themeDisplay.getScopeGroupId()
        }
      };
      axios(config).then(function (response) {
        vm.danhSachUbndCapXa = response.data.data
      })
      .catch(function (error) {
        console.log(error);
      });
      
    },
    getThuTucHanhChinhXa(item) {
      let vm = this
      vm.linhVucChon = item
      vm.showDanhSachCapHuyen = false
      vm.showDanhSachThuTuc = false
      vm.showDanhSachCapXa = false
      vm.showDanhSachThuTucXa = true
      
      vm.domainCode = item.domainCode
      let config = {
        method: 'get',
        url: '/o/rest/v2/serviceinfos?start=0&end=15&administration=CAP_XA&agency=&keyword=&level=0&domain=' + vm.domainCode + '&sort=siblingSearch',
        headers: { 
          'Accept': 'application/json, text/plain, */*', 
          'groupId': window.themeDisplay.getScopeGroupId()
        }
      };
      axios(config).then(function (response) {
        vm.danhSachThuTucHanhChinhXa = response.data.data
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    
    selectCoQuanQuanLy(value) {
      let vm = this
      if (value === 1) {
        return (
          vm.getBangNiemYet()
        )
      }
      if (value === 2) {
        return (
          vm.getBangNiemYetXa()
        )
      } 
    },
  }
}

</script>

<style>
</style>
