<template>
  <div>
    <!-- layout for desktop -->
    <div class="list-thu-tuc" v-if="!isMobile">
      <div class="row-header no__hidden_class">
        <div v-if="trangThaiHoSoList !== null" class="background-triangle-big">
          <span v-if="!setAgency">DANH SÁCH THỦ TỤC HÀNH CHÍNH</span>
          <span v-else style="text-transform: uppercase;">THỦ TỤC HÀNH CHÍNH {{govAgencySelectedName}}</span>
        </div>
        <div class="layout row wrap header_tools row-blue">
          <div class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
            <v-text-field
              v-model="serviceNameKey"
              placeholder="Tìm kiếm theo tên thủ tục, mã thủ tục ..."
              solo
              chips
              multiple
              deletable-chips
              item-value="value"
              item-text="text"
              @keyup.enter="filterServiceName"
              content-class="adv__search__select"
              return-object
            ></v-text-field>
          </div>
          <div class="flex text-right" style="margin-left: auto;max-width: 50px;">
            <v-btn icon class="my-0 mx-2" v-on:click.native="filterServiceName">
              <v-icon size="16">search</v-icon>
            </v-btn>
          </div>
        </div> 
      </div>
      <v-layout wrap class="white py-2">
        <v-flex :class="hasCoQuanThucHien ? 'xs12 sm3' : 'xs12 sm4'" class="px-2" v-if="!setAgency">
          <v-autocomplete
            class="select-border"
            :items="govAgencyList"
            v-model="govAgencySelected"
            placeholder="Chọn cơ quan quản lý"
            item-text="administrationName"
            item-value="administrationCode"
            :hide-selected="true"
            clearable
            @change="changeAdministration"
            box
          ></v-autocomplete>
        </v-flex>
        <v-flex v-if="hasCoQuanThucHien && !setAgency" :class="hasCoQuanThucHien ? 'xs12 sm3' : 'xs12 sm4'" class="px-2">
          <v-autocomplete
            class="select-border"
            :items="govAgencyListThucHien"
            v-model="govAgencyThucHienSelected"
            placeholder="Chọn cơ quan thực hiện"
            item-text="govAgencyName"
            item-value="govAgencyCode"
            :hide-selected="true"
            clearable
            @change="changeGovAgencyThucHien"
            box
          ></v-autocomplete>
        </v-flex>
        <v-flex :class="setAgency ? 'xs12 sm6' : (hasCoQuanThucHien ? 'xs12 sm3' : 'xs12 sm4')" class="px-2">
          <v-autocomplete
            class="select-border"
            :items="domainListCurrent"
            v-model="domainSelected"
            placeholder="Chọn lĩnh vực"
            item-text="domainName"
            item-value="domainCode"
            :hide-selected="true"
            clearable
            @change="changeDomain"
            box
          ></v-autocomplete>
        </v-flex>
        <v-flex :class="setAgency ? 'xs12 sm6' : (hasCoQuanThucHien ? 'xs12 sm3' : 'xs12 sm4')" class="px-2">
          <v-autocomplete
            class="select-border"
            :items="levelList"
            v-model="levelSelected"
            placeholder="Chọn mức độ"
            item-text="levelName"
            item-value="level"
            :hide-selected="true"
            @change="changeLevel"
            clearable
            box
          >
          </v-autocomplete>
        </v-flex>

      </v-layout>
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="10" />
      </content-placeholders>
      <div v-else class="service__info__table">
        <v-data-table
          :headers="headers"
          :items="serviceInfoList"
          hide-actions
          class="table-landing table-bordered"
        >
          <template slot="items" slot-scope="props">
            <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;">
              <td class="text-xs-center" @click="viewDetail(props.item)">
                <content-placeholders v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{thutucPage * 15 - 15 + props.index + 1}}</span><br>
                </div>
              </td>
              <td class="text-xs-left" style="min-width: 135px;" @click="viewDetail(props.item)">
                <content-placeholders v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.serviceCodeDVCQG ? props.item.serviceCodeDVCQG : props.item.serviceCode}}</span>
                </div>
              </td>
              <td class="text-xs-left" @click="viewDetail(props.item)">
                <content-placeholders v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.serviceName}}</span>
                </div>
              </td>
              <td class="text-xs-left" style="min-width: 135px" @click="viewDetail(props.item)">
                <content-placeholders v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>
                    <span>{{props.item.domainName}}</span>
                  </span>
                </div>
              </td>
              <td class="text-xs-center" @click="viewDetail(props.item)">
                <content-placeholders v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <v-btn class="mx-0 my-0 mt-1 white--text" depressed readonly small :color="getColor(props.item.maxLevel)"
                  style="pointer-events: none;min-width: 110px;">Mức độ {{props.item.maxLevel}}</v-btn>
                </div>
              </td>
              <td class="text-xs-center" v-if="!setAgency && (!userLoginInfomation || !userLoginInfomation.hasOwnProperty('className') || (userLoginInfomation && userLoginInfomation.hasOwnProperty('className') &&  userLoginInfomation.className !== 'org.opencps.usermgt.model.Employee'))">
                <content-placeholders v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>

                  <v-menu bottom right offset-y v-if="props.item.serviceConfigs && serviceConfigs(props.item.serviceConfigs).length > 1 && serviceConfigs(props.item.serviceConfigs).length <= 5">
                    <v-btn small slot="activator" color="primary" v-if="props.item.maxLevel >= 3" style="min-width: 110px;">
                      <span v-if="!formToKhai">{{titleNopHoSo ? titleNopHoSo : 'Nộp hồ sơ'}}</span>
                      <span v-else>Tạo tờ khai</span>
                    </v-btn>
                    <v-btn small slot="activator" color="primary" v-else style="min-width: 110px;">Hướng dẫn</v-btn>
                    <v-list v-if="props.item.serviceConfigs">
                      <v-list-tile v-for="(item2, index) in serviceConfigs(props.item.serviceConfigs)" :key="index" :class="item2.govAgencyCode+'-'+item2.serviceConfigId">
                        <v-list-tile-title v-if="item2.serviceLevel >= 3" @click="createDossier(item2, props.item)" >{{item2.govAgencyName}}</v-list-tile-title>
                        <v-list-tile-title v-else @click="viewGuide(item2, props.item.serviceCode, props.item)">{{item2.govAgencyName}}</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>

                  <v-btn small color="primary" class="my-1" style="min-width: 110px;"
                    v-if="props.item.maxLevel >= 3 && props.item.serviceConfigs && serviceConfigs(props.item.serviceConfigs).length > 5"
                    @click="showSelectGov(props.item, props.item.serviceConfigs)"
                  >
                    <span v-if="!formToKhai">{{titleNopHoSo ? titleNopHoSo : 'Nộp hồ sơ'}}</span>
                    <span v-else>Tạo tờ khai</span>
                  </v-btn>

                  <v-btn small color="primary" class="my-1" style="min-width: 110px;"
                    v-if="props.item.maxLevel < 3 && props.item.serviceConfigs && serviceConfigs(props.item.serviceConfigs).length > 5"
                    @click="showSelectGov(props.item, props.item.serviceConfigs, 'guide')"
                  >
                    Hướng dẫn
                  </v-btn>

                  <v-btn small color="primary" class="my-1" style="min-width: 110px;"
                    v-if="props.item.serviceConfigs && serviceConfigs(props.item.serviceConfigs).length === 1 && Number(serviceConfigs(props.item.serviceConfigs)[0]['serviceLevel']) > 2"
                    @click="createDossier(serviceConfigs(props.item.serviceConfigs)[0], props.item)"
                  >
                    <span v-if="!formToKhai">{{titleNopHoSo ? titleNopHoSo : 'Nộp hồ sơ'}}</span>
                    <span v-else>Tạo tờ khai</span>
                  </v-btn>

                  <v-btn small color="primary" class="my-1" style="min-width: 110px;"
                    v-if="props.item.serviceConfigs && serviceConfigs(props.item.serviceConfigs).length === 1 
                      && Number(serviceConfigs(props.item.serviceConfigs)[0]['serviceLevel']) <= 2 && !formToKhai"
                    @click="viewGuide(serviceConfigs(props.item.serviceConfigs)[0], props.item.serviceCode, props.item)"
                  >
                    Hướng dẫn
                  </v-btn>

                  <v-btn small color="primary" class="my-1" style="min-width: 110px;"
                    v-if="props.item.serviceConfigs && serviceConfigs(props.item.serviceConfigs).length === 1 
                      && Number(serviceConfigs(props.item.serviceConfigs)[0]['serviceLevel']) <= 2 && formToKhai"
                    @click="createDossier(serviceConfigs(props.item.serviceConfigs)[0], props.item)"
                  >
                    Tạo tờ khai
                  </v-btn>
                </div>
              </td>
            </tr>
          </template>
          <template slot="no-data">
            <div class="text-xs-center mt-2">
              Không có thủ tục nào được tìm thấy
            </div>
          </template>
        </v-data-table>
        <div class="text-xs-right layout wrap mt-2" style="position: relative;">
          <div class="flex pagging-table px-2"> 
            <tiny-pagination :total="totalThuTuc" :page="thutucPage" custom-class="custom-tiny-class" 
              @tiny:change-page="paggingData" ></tiny-pagination> 
          </div>
        </div>
      </div>
      <v-dialog scrollable v-model="dialogGuide" persistent max-width="600">
        <v-card>
          <v-card-title class="headline">Hướng dẫn nộp hồ sơ</v-card-title>
          <v-card-text v-if="serviceDetail" style="max-height: 400px">
            <div  v-html="serviceDetail.serviceInstruction"></div>
            <p class="mt-1">
              <a href="javascript:;" @click="viewTphs" style="color: #001fff;text-decoration: underline;font-style: italic;">Thành phần hồ sơ</a>
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat="flat" @click.native="dialogGuide = false">
              Đóng
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <!-- layout for mobile -->
    <div class="list-thu-tuc" v-else>
      <div class="row-header" style="background-color: #0054a6">
        <div class="ml-2 py-2 text-bold white--text"> 
          <span v-if="!setAgency">DANH SÁCH THỦ TỤC HÀNH CHÍNH</span>
          <span v-else style="text-transform: uppercase;">THỦ TỤC HÀNH CHÍNH {{govAgencySelectedName}}</span>
        </div>
        <div class="layout row wrap header_tools row-blue">
          <div class="flex text-right" style="margin-left: auto;">
            <v-btn flat class="my-0 mx-0 btn-border-left white--text" @click="goBack" active-class="temp_active">
              <v-icon size="18">reply</v-icon> &nbsp; Quay lại
            </v-btn>
          </div>
        </div> 
      </div>
      <v-layout wrap class="white py-2">
        <v-flex xs12 sm6 md3 class="px-2 input-group--text-field-box">
          <v-select
            class="select-border"
            :items="govAgencyList"
            v-model="govAgencySelected"
            placeholder="Chọn cơ quan"
            item-text="administrationName"
            item-value="administrationCode"
            :hide-selected="true"
            :clearable="setAgency ? false : true"
            @change="changeAdministration"
            box
            :style="setAgency ? 'pointer-events: none;' : ''"
          ></v-select>
        </v-flex>
        <v-flex xs12 sm6 md3 class="px-2 input-group--text-field-box">
          <v-select
            class="select-border"
            :items="domainListCurrent"
            v-model="domainSelected"
            placeholder="Chọn lĩnh vực"
            item-text="domainName"
            item-value="domainCode"
            :hide-selected="true"
            clearable
            @change="changeDomain"
            box
          ></v-select>
        </v-flex>
        <v-flex xs12 sm6 md3 class="px-2 input-group--text-field-box">
          <v-select
            class="select-border"
            :items="levelList"
            v-model="levelSelected"
            autocomplete
            placeholder="Chọn mức độ"
            item-text="levelName"
            item-value="level"
            :hide-selected="true"
            @change="changeLevel"
            clearable
            box
          >
          </v-select>
        </v-flex>
        <v-flex xs12 sm6 md3 class="pl-2 pr-2">
          <div style="position:relative">
            <v-text-field class="input-border input-search"
              placeholder="Tên thủ tục, mã thủ tục..."
              v-model="serviceNameKey"
              @keyup.enter="filterServiceName()"
              box
              append-icon="search"
              :append-icon-cb="filterServiceName"
              hide-details
            ></v-text-field>
          </div>
        </v-flex>
      </v-layout>
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="10" />
      </content-placeholders>
      <div v-else class="service__info__table mt-2">
        <v-card class="">
          <div class="px-2 py-2 text-bold white--text" style="background: #0054a6;">
            STT | Thủ tục hành chính (tổng số: {{totalThuTuc}} thủ tục)
          </div>
          <v-list class="py-0">
            <template v-for="(item, index) in serviceInfoList" >
              <v-layout wrap :key="index" style="border-bottom:1px solid #dedede;height:auto">
                <v-flex xs1 class="text-xs-center text-bold">
                  <span>{{index + 1}}</span>
                </v-flex>
                <v-flex xs10 @click="viewDetail(item)">
                  <div style="color:#0054a6; text-align:justify;">{{item.serviceName}}</div>
                  <div> <span class="text-bold">Lĩnh vực: </span> <span>{{item.domainName}}</span> </div>
                  <div> <span class="text-bold">Mức độ: </span> <span>{{item.maxLevel}}</span> </div>
                </v-flex>
                <v-flex xs1 class="text-xs-center mt-1">
                  <v-menu :close-on-content-click="false" left style="position:relative !important;">
                    <v-btn slot="activator" icon class="mx-0 my-0" style="width:100%">
                      <v-icon color="primary lighten-1">more_vert</v-icon>
                    </v-btn>
                    <v-list>
                      <v-menu :close-on-content-click="false" bottom right offset-y v-if="item.serviceConfigs && serviceConfigs(item.serviceConfigs).length > 1 && serviceConfigs(item.serviceConfigs).length <=5" style="position:relative !important;">
                        <v-btn class="mx-0 my-0" small slot="activator" color="primary" v-if="item.maxLevel >= 3">
                          <span v-if="!formToKhai">{{titleNopHoSo ? titleNopHoSo : 'Nộp hồ sơ'}}</span>
                          <span v-if="formToKhai">Tạo tờ khai</span> &nbsp; 
                          <v-icon size="18">arrow_drop_down</v-icon>
                        </v-btn>
                        <v-btn class="mx-0 my-0" small slot="activator" color="primary" v-else>Xem hướng dẫn &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                        <v-list v-if="item.serviceConfigs">
                          <v-list-tile v-for="(item2, index) in serviceConfigs(item.serviceConfigs)" :key="index" :class="item2.govAgencyCode+'-'+item2.serviceConfigId">
                            <v-list-tile-title v-if="item2.serviceLevel >= 3" @click="createDossier(item2, item)" >{{item2.govAgencyName}}</v-list-tile-title>
                            <v-list-tile-title v-else @click="viewGuide(item2, item.serviceCode, item)">{{item2.govAgencyName}}</v-list-tile-title>
                          </v-list-tile>
                        </v-list>
                      </v-menu>

                      <v-btn class="mx-0 my-0" small color="primary" 
                        v-if="item.maxLevel >= 3 && item.serviceConfigs && serviceConfigs(item.serviceConfigs).length > 5"
                        @click="showSelectGov(item, item.serviceConfigs)"
                      >
                        <span v-if="!formToKhai">{{titleNopHoSo ? titleNopHoSo : 'Nộp hồ sơ'}}</span>
                        <span v-else>Tạo tờ khai</span>
                      </v-btn>
                      <v-btn small color="primary" class="my-1" style="min-width: 110px;"
                        v-if="item.maxLevel < 3 && item.serviceConfigs && serviceConfigs(item.serviceConfigs).length > 5"
                        @click="showSelectGov(item, item.serviceConfigs, 'guide')"
                      >
                        Hướng dẫn
                      </v-btn>
                      <v-btn class="mx-0 my-0" small color="primary" 
                        v-if="item.serviceConfigs && serviceConfigs(item.serviceConfigs).length === 1 && Number(serviceConfigs(item.serviceConfigs)[0]['serviceLevel']) > 2"
                        @click="createDossier(serviceConfigs(item.serviceConfigs)[0], item)"
                      >
                        <span v-if="!formToKhai">{{titleNopHoSo ? titleNopHoSo : 'Nộp hồ sơ'}}</span>
                        <span v-else>Tạo tờ khai</span>
                      </v-btn>
                      <v-btn class="mx-0 my-0" small color="primary" 
                        v-if="item.serviceConfigs && serviceConfigs(item.serviceConfigs).length === 1 && Number(serviceConfigs(item.serviceConfigs)[0]['serviceLevel']) <= 2"
                        @click="viewGuide(serviceConfigs(item.serviceConfigs)[0], item.serviceCode, item)"
                      >
                        Xem hướng dẫn
                      </v-btn>
                    </v-list>
                  </v-menu>
                </v-flex>
              </v-layout>
            </template>
          </v-list>
        </v-card>
        <div :class="!viewMobile ? 'text-xs-right layout wrap mt-2' : 'mt-2'" style="position: relative;">
          <div class="flex pagging-table px-2"> 
            <tiny-pagination :total="totalThuTuc" :page="thutucPage" custom-class="custom-tiny-class" 
              @tiny:change-page="paggingData" ></tiny-pagination> 
          </div>
        </div>
      </div>
      <v-dialog scrollable v-model="dialogGuide" persistent max-width="600">
        <v-card>
          <v-card-title class="headline">Hướng dẫn nộp hồ sơ</v-card-title>
          <v-card-text v-if="serviceDetail" style="max-height: 400px">
            <div  v-html="serviceDetail.serviceInstruction"></div>
            <p class="mt-1">
              <a href="javascript:;" @click="viewTphs" style="color: #001fff;text-decoration: underline;font-style: italic;">Thành phần hồ sơ</a>
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat="flat" @click.native="dialogGuide = false">
              Đóng
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog_createDossier" scrollable persistent max-width="700px">
        <v-card>
          <v-toolbar flat dark color="primary">
            <v-toolbar-title>NỘP HỒ SƠ TRỰC TUYẾN</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click.native="dialog_createDossier = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
          </v-card-text>
          <v-card-actions>
            <v-layout wrap>
              <v-flex xs6 class="pr-2">
                <v-btn class="mr-3" color="primary" @click="doLogin">
                  <i class="fa fa-sign-in text-bold mr-2" style="font-size: 14px;"></i>
                  ĐĂNG NHẬP HỆ THỐNG
                </v-btn>
              </v-flex>
              <v-flex xs6 class="pl-2">
                <v-btn class="mr-3" color="primary" >
                  <i class="fa fa-paper-plane mr-2" style="font-size: 13px;"></i>
                  NỘP HỒ SƠ KHÔNG CẦN TÀI KHOẢN
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <v-dialog v-model="dialogVerifycation" max-width="350">
      <v-card class="px-0">
        <v-card-title color="primary" class="headline">Yêu cầu xác minh tài khoản</v-card-title>
        <v-divider class="my-0"></v-divider>
        <v-card-text>Tài khoản chỉ được phép nộp tối đa 3 hồ sơ trực tuyến khi chưa được xác minh. <br>
          Để tiếp tục nộp hồ sơ trực tuyến vui lòng mang chứng minh thư nhân dân/ thẻ căn cước đến Bộ phận tiếp nhận và trả kết quả để được xác minh.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click="dialogVerifycation = false">Đóng</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  -->
    <v-dialog v-model="dialogLogin" max-width="550">
      <v-card class="px-0">
        <v-card-text class="px-0 py-0">
          <v-flex v-if="!isSigned" xs12>
            <nav class="toolbar theme--dark primary py-2" data-booted="true">
              <div class="toolbar__content"  style="justify-content: center">
                <div class="white--text text-bold" style="font-size: 1.25em;">ĐĂNG NHẬP</div>
              </div>
            </nav>
            <v-flex xs12 class="px-2 pb-2" style="border: 1px solid #dddddd;">
              <v-form ref="form" v-model="valid" lazy-validation class="mt-3">
                <v-flex xs12>
                  <v-text-field
                    box
                    placeholder="Email đăng nhập"
                    v-model="userName"
                    :rules="[v => !!v || 'Email đăng nhập là bắt buộc']"
                    required
                    prepend-inner-icon="person_outline"
                    @keyup.enter="submitConfirmLogin"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 class="">
                  <v-text-field
                    box
                    placeholder="Mật khẩu"
                    v-model="passWord"
                    :type="'password'"
                    :rules="[v => !!v || 'Mật khẩu là bắt buộc']"
                    required
                    prepend-inner-icon="vpn_key"
                    @keyup.enter="submitConfirmLogin"
                  ></v-text-field>
                </v-flex>
                <v-layout wrap class="ml-2">
                  <v-flex @click="getPassword" style="font-size: 12px;cursor: pointer;padding:7px">
                    <div class="primary--text right" >
                      Quên mật khẩu?
                    </div>
                  </v-flex>
                </v-layout>
                <!--  -->
                <v-flex v-if="captcha" class="py-2 text-xs-center" xs12 style="
                  align-items: center;
                  background: #dedede;
                  justify-content: center;
                ">
                  <img :src="chapchablob" alt="capcha" style="border-radius: 5px;">
                  <v-btn flat icon v-on:click.native="makeImageCap">
                    <v-icon color="white" size="26">refresh</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs12 class="mt-2 text-xs-center" v-if="captcha">
                  <v-text-field
                    box
                    v-model="j_captcha_response"
                    placeholder="Nhập captcha"
                    :rules="[v => !!v || 'Mã captcha là bắt buộc']"
                    required
                  ></v-text-field>
                </v-flex>
                <!--  -->
                <v-flex xs12 class="text-xs-left text-xs-center">
                  <v-btn class="ml-0 mr-1 my-0 white--text" color="primary"
                    :loading="loadingLogin"
                    :disabled="loadingLogin"
                    @click="submitConfirmLogin"
                  >
                    <v-icon>how_to_reg</v-icon>&nbsp;
                    Đăng nhập
                  </v-btn>
                  <!-- <v-btn class="ml-1 my-0 white--text" color="primary"
                    :loading="loadingLogin"
                    :disabled="loadingLogin"
                    @click="register"
                  >
                    <v-icon>create</v-icon>&nbsp;
                    Đăng ký
                  </v-btn> -->
                  <v-btn @click="dialogLogin = false" color="primary">
                    <v-icon>reply</v-icon>&nbsp;
                    Thoát
                  </v-btn>
                </v-flex>
                
              </v-form>
            </v-flex>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!--  -->
    <v-dialog v-model="dialogLoginDvcqg" max-width="450">
      <v-card class="px-0">
        <v-card-text class="px-0 py-0">
          <v-flex v-if="!isSigned" xs12>
            <nav class="toolbar theme--dark primary py-2" data-booted="true">
              <div class="toolbar__content"  style="justify-content: center">
                <div class="white--text text-bold" style="font-size: 1.25em;">ĐĂNG NHẬP HỆ THỐNG</div>
              </div>
            </nav>
            <v-flex xs12 class="px-2 pb-2 pt-3" style="border: 1px solid #dddddd;">
              <v-flex xs12 class="text-xs-left text-xs-center">
                <v-btn class="ml-0 mr-1 my-0 white--text" color="primary"
                  @click="checkOnlyLoginDvcqg"
                >
                  <v-icon>how_to_reg</v-icon>&nbsp;
                  Đồng ý
                </v-btn>

                <v-btn @click="dialogLoginDvcqg = false" color="primary">
                  <v-icon>reply</v-icon>&nbsp;
                  Thoát
                </v-btn>
              </v-flex>
            </v-flex>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!--  -->
    <v-dialog v-model="dialog_selectAgency" scrollable persistent max-width="700px">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Chọn cơ quan tiếp nhận</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialog_selectAgency = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="formSelect" v-model="validFormSelectGov" lazy-validation>
            <v-autocomplete
              v-if="luaChonXaPhuong"
              class="mt-3"
              placeholder="Quận, huyện, thị xã"
              :items="danhSachQuanHuyen"
              v-model="quanHuyen"
              item-text="itemName"
              item-value="itemCode"
              clearable
              return-object
              @change="changeQuanHuyen"
            ></v-autocomplete>
            <v-autocomplete
              class="mt-3"
              :placeholder="luaChonXaPhuong === true ? 'Xã, phường, thị trấn' : 'Chọn cơ quan'"
              :items="govAgencyListTiepNhanFilters"
              v-model="govAgencyTiepNhanSelected"
              item-text="govAgencyName"
              item-value="govAgencyCode"
              clearable
              :rules="[v => !!v || 'Chọn cơ quan tiếp nhận']"
              required
              return-object
            ></v-autocomplete>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="submitSelectGov">
            <v-icon size="20">save</v-icon>&nbsp; Đồng ý
          </v-btn>
          <v-btn class="white--text" color="red"  @click="dialog_selectAgency = false">
            <v-icon size="20">clear</v-icon>&nbsp; Thoát
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  -->
    <v-dialog v-model="dialog_selectTemplateEform" scrollable persistent max-width="700px">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Chọn tờ khai trực tuyến</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialog_selectTemplateEform = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="formSelectEform" v-model="validFormSelectTemplateEform" lazy-validation>
            <v-autocomplete
              class="mt-3"
              placeholder="Chọn tờ khai"
              :items="templateFormList"
              v-model="templateFormSelected"
              item-text="templateName"
              item-value="fileTemplateNo"
              :rules="[v => !!v || 'Chọn tờ khai']"
              required
              return-object
            ></v-autocomplete>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="submitSelectTemplateForm">
            <v-icon size="20">save</v-icon>&nbsp; Đồng ý
          </v-btn>
          <v-btn class="white--text" color="red"  @click="dialog_selectTemplateEform = false">
            <v-icon size="20">clear</v-icon>&nbsp; Thoát
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import support from '../../store/support.json'
import TinyPagination from './Pagination.vue'
Vue.use(toastr)
export default {
  props: ['index'],
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    formToKhai: false,
    templateFormList: '',
    dialog_selectTemplateEform: false,
    validFormSelectTemplateEform: false,
    templateFormSelected: '',
    serviceInfoSelected: '',
    dialog_selectAgency: false,
    dialog_createDossier: false,
    dialogVerifycation: false,
    dialogLogin: false,
    dialogLoginDvcqg: false,
    dialog_loginDVCQG: false,
    tempDVCQG: '',
    valid: false,
    userName: '',
    passWord: '',
    loadingLogin: false,
    pathRouter: '/thu-tuc-hanh-chinh/',
    serviceInfoList: [],
    totalThuTuc: 0,
    thutucPage: 1,
    govAgencySelected: {},
    govAgencySelectedName: '',
    govAgencyThucHienSelected: {},
    domainListCurrent: [],
    domainSelected: {},
    levelSelected: {},
    serviceNameKey: '',
    serviceDetail: '',
    dialogGuide: false,
    loading: true,
    headers: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Mã thủ tục',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tên thủ tục',
        align: 'center',
        sortable: false
      },
      {
        text: 'Lĩnh vực',
        align: 'center',
        sortable: false
      },
      {
        text: 'Mức độ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thao tác',
        align: 'center',
        sortable: false,
        type: 'action'
      }
    ],
    isLogin: false,
    verificationApplicantCreateDossier: false,
    serviceSelected: '',
    hasCoQuanThucHien: false,
    configUrl: '',
    keyCodeDvcqg: '',
    userInfoDvcqg: '',
    mapping: false,
    dataMapping: '',
    doCreateDossier: false,
    captcha: false,
    j_captcha_response: '',
    chapchablob: '',
    validFormSelectGov: false,
    danhSachQuanHuyen: [],
    quanHuyen: '',
    govAgencyListTiepNhan: [],
    govAgencyTiepNhanSelected: '',
    govAgencyListTiepNhanFilters: [],
    selectGuide: false,
    onlyLoginDvcqg: false,
    titleNopHoSo: '',
    setAgency: false,     /**fix 1 đơn vị */
    luaChonXaPhuong: false
  }),
  computed: {
    govAgencyList () {
      return this.$store.getters.getAgencyList
    },
    govAgencyListThucHien () {
      return this.$store.getters.getAgencyListThucHien
    },
    domainList () {
      return this.$store.getters.getDomainList
    },
    levelList () {
      return this.$store.getters.getLevelList
    },
    isMobile () {
      return this.$store.getters.getIsMobile
    },
    userLoginInfomation () {
      return this.$store.getters.getUserLogin
    }
  },
  created () {
    let vm = this
    // 
    try {
      vm.formToKhai = toKhaiTrucTuyen ? true : false 
    } catch (error) {
      vm.formToKhai = false
    }
    // 
    try {
      vm.hasCoQuanThucHien = hasCoQuanThucHien
    } catch (error) {
      vm.hasCoQuanThucHien = false
    }
    // 
    try {
      vm.configUrl = configSso 
    } catch (error) {
    }
    // 
    try {
      vm.verificationApplicantCreateDossier = hasVerificationCreateDossier
    } catch (error) {
    }
    // 
    try {
      vm.keyCodeDvcqg = keyCodeDvcqg
    } catch (error) {
    }
    // 
    try {
      vm.onlyLoginDvcqg = hasOnlyLoginDvcqg
    } catch (error) {
    }
    //
    try {
      vm.titleNopHoSo = titleNopHoSo ? titleNopHoSo : ''
    } catch (error) {
    }
    // 
    if ( typeof(Storage) !== 'undefined') {
      let count = sessionStorage.getItem('isbot')
      if (window.themeDisplay.isSignedIn() || !count) {
        sessionStorage.setItem('isbot', '0')
      }
      if (Number(sessionStorage.getItem('isbot')) >= 5) {
        vm.captcha = true
      }
    }
    // 
    vm.$nextTick(function () {
      vm.makeImageCap()
      let current = vm.$router.history.current
      let currentQuery = current.query
      if (currentQuery.hasOwnProperty('setAgency')) {
        vm.setAgency = true
      }
      if (vm.keyCodeDvcqg) {
        if (currentQuery.hasOwnProperty(vm.keyCodeDvcqg) && currentQuery[vm.keyCodeDvcqg]) {
          let url = window.location.href.split('?')[0] + '/' + currentQuery[vm.keyCodeDvcqg] + '?' + window.location.href.split('?')[1]
          window.location.href = url
        } else {
          vm.initData()
        }
      } else {
        if (currentQuery.hasOwnProperty('MaTTHCDP') && currentQuery['MaTTHCDP']) {
          let serviceCode_dvcqg = currentQuery['MaTTHCDP']
          let filter = {
            keyword: serviceCode_dvcqg
          }
          vm.$store.dispatch('checkServiceExits', filter).then(function (result) {
            if (result) {
              // case trùng serviceCode
              console.log('result', result)
              let serviceCodeLocal = result[0]['serviceInfoId']
              let path = vm.confirmEnding(window.location.href.split('?')[0], '/')
              console.log('path', path)
              let url = path ? window.location.href.split('?')[0] + serviceCodeLocal + '?' + window.location.href.split('?')[1] : window.location.href.split('?')[0] + '/' + serviceCodeLocal + '?' + window.location.href.split('?')[1]
              console.log('url', url)
              window.location.href = url
            } else {
              // case khác serviceCode
              if (currentQuery.hasOwnProperty('vnconnect') && String(currentQuery['vnconnect']) === '1' && !window.themeDisplay.isSignedIn()) {
                let searchParams = window.location.href.split("?")
                if (searchParams[1]) {
                  let dataDVCQG = decodeURIComponent(String(vm.getSearchParams(searchParams[1], "data")))
                  // console.log('dataDVCQG', dataDVCQG)
                  if (dataDVCQG) {
                    let dataObj = JSON.parse(atob(dataDVCQG))
                    console.log('dataObj', dataObj)
                    if (dataObj && dataObj.hasOwnProperty('userId') && String(dataObj.userId) === '0') {
                      vm.mapping = true
                      vm.dataMapping = dataObj
                      vm.dialogLogin = true
                      console.log('mapping', vm.mapping)
                    }
                  }
                }
                vm.initData()
              }
            }
          }).catch(function () {
            vm.initData()
          })
        } else {
          vm.initData()
        }
      }
      // Auto mapping
      let sync = false
      if ( typeof(Storage) !== 'undefined') {
        sync = sessionStorage.getItem('sync')
      }
      if (window.themeDisplay.isSignedIn() && sync) {
        window.callback_dvcqg = vm.callback_dvcqg
        vm.checkVNConectAutoMapping()  
      }
      // 
    })
  },
  updated () {},
  mounted () {
    if (this.isMobile) {
      $('.input-search input').css('margin-top', '5px')
      $('.input-search .v-input__slot').css('min-height', '36px')
      $('.input-search .v-input__append-inner').css('margin-top', '10px')
    }
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
      if (currentQuery.hasOwnProperty('setAgency')) {
        vm.setAgency = true
      }
      vm.domainListCurrent = []
      if ((currentQuery.hasOwnProperty('agency') && currentQuery['agency']) || vm.index) {
        let filterDomain = {
          agencyCode: currentQuery['agency']
        }
        vm.$store.dispatch('getDomain', filterDomain).then(function (result) {
          vm.domainListCurrent = result
        })
      } else {
        vm.domainListCurrent = vm.domainList
      }
      vm.govAgencySelected = vm.govAgencyThucHienSelected = vm.domainSelected = vm.levelSelected = vm.serviceNameKey = ''
      vm.govAgencySelected = currentQuery.hasOwnProperty('agency') && currentQuery.agency ? currentQuery.agency : (vm.index !== 'thu-tuc-hanh-chinh' ? vm.index : '')
      if (vm.setAgency && vm.govAgencySelected) {
        vm.govAgencySelectedName = vm.govAgencyList.filter(function(item) {
          return item.administrationCode === vm.govAgencySelected
        })[0]['administrationName']
      }
      vm.govAgencyThucHienSelected = currentQuery.hasOwnProperty('agencyth') && currentQuery.agencyth ? currentQuery.agencyth : ''
      vm.domainSelected = currentQuery.hasOwnProperty('domain') ? currentQuery.domain : ''
      vm.levelSelected = currentQuery.hasOwnProperty('level') && !isNaN(currentQuery.hasOwnProperty('level')) ? Number(currentQuery.level) : ''
      vm.serviceNameKey = currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : ''
      vm.doLoadingThuTuc()
    },
    userLoginInfomation (val) {
      let vm = this
      if (val.className === 'org.opencps.usermgt.model.Employee' || vm.setAgency) {
        vm.headers = vm.headers.filter(function (item) {
          return !item.hasOwnProperty('type')
        })
      }
    },
    govAgencyList (val) {
      let vm = this
      vm.$nextTick(function () {
        if (vm.setAgency && vm.govAgencySelected && vm.govAgencyList && vm.govAgencyList.length > 0) {
          vm.govAgencySelectedName = vm.govAgencyList.filter(function(item) {
            return item.administrationCode === vm.govAgencySelected
          })[0]['administrationName']
        }
      })
    }
  },
  methods: {
    initData () {
      let vm = this
      // 
      let current = vm.$router.history.current
      let currentQuery = current.query
      vm.govAgencySelected = vm.govAgencyThucHienSelected = vm.domainSelected = vm.levelSelected = vm.serviceNameKey = ''
      vm.govAgencySelected = currentQuery.hasOwnProperty('agency') && currentQuery.agency ? currentQuery.agency : (vm.index !== 'thu-tuc-hanh-chinh' ? vm.index : '')
      if (vm.setAgency && vm.govAgencySelected && vm.govAgencyList && vm.govAgencyList.length > 0) {
        vm.govAgencySelectedName = vm.govAgencyList.filter(function(item) {
          return item.administrationCode === vm.govAgencySelected
        })[0]['administrationName']
      }
      vm.govAgencyThucHienSelected = currentQuery.hasOwnProperty('agencyth') && currentQuery.agencyth ? currentQuery.agencyth : ''
      vm.domainSelected = currentQuery.hasOwnProperty('domain') ? currentQuery.domain : ''
      vm.levelSelected = currentQuery.hasOwnProperty('level') && !isNaN(currentQuery.hasOwnProperty('level')) ? Number(currentQuery.level) : ''
      vm.serviceNameKey = currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : ''
      if (currentQuery.hasOwnProperty('agency')) {
        let filterDomain = {
          agencyCode: currentQuery['agency']
        }
        vm.$store.dispatch('getDomain', filterDomain).then(function (result) {
          vm.domainListCurrent = result
        })
      } else {
        let filterDomain = {
          agencyCode: ''
        }
        vm.$store.dispatch('getDomain', filterDomain).then(function (result) {
          vm.domainListCurrent = result
        })
      }
      if (vm.userLoginInfomation && vm.userLoginInfomation.className === 'org.opencps.usermgt.model.Employee' || vm.setAgency) {
        vm.headers = vm.headers.filter(function (item) {
          return !item.hasOwnProperty('type')
        })
      }
      vm.doLoadingThuTuc()
    },
    changeAdministration () {
      let vm = this
      setTimeout(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['agency'] = vm.govAgencySelected
        newQuery['agencyth'] = ''
        newQuery['domain'] = ''
        newQuery['keyword'] = ''
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: vm.pathRouter + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }, 100)
    },
    changeGovAgencyThucHien () {
      let vm = this
      setTimeout(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['agencyth'] = vm.govAgencyThucHienSelected
        newQuery['agency'] = ''
        newQuery['domain'] = ''
        newQuery['keyword'] = ''
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: vm.pathRouter + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }, 100)
    },
    changeDomain () {
      let vm = this
      setTimeout(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['domain'] = vm.domainSelected
        newQuery['keyword'] = vm.serviceNameKey
        newQuery['agencyth'] = ''
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: vm.pathRouter + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }, 100)
    },
    changeLevel () {
      let vm = this
      setTimeout(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['level'] = vm.levelSelected
        newQuery['keyword'] = vm.serviceNameKey
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: vm.pathRouter + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }, 100)
    },
    filterServiceName () {
      let vm = this
      setTimeout(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['keyword'] = vm.serviceNameKey
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: vm.pathRouter + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }, 100)
    },
    doLoadingThuTuc () {
      let vm = this
      vm.serviceInfoList = []
      vm.loading = true
      let currentQuery = vm.$router.history.current.query
      let filter = {
        page: currentQuery.page ? currentQuery.page : 1,
        administration: currentQuery.hasOwnProperty('agency') && currentQuery.agency ? currentQuery.agency : (vm.index !== 'thu-tuc-hanh-chinh' ? vm.index : ''),
        agency: currentQuery.hasOwnProperty('agencyth') && currentQuery.agencyth ? currentQuery.agencyth : '',
        keyword: currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : '',
        level: currentQuery.hasOwnProperty('level') ? currentQuery.level : '',
        domain: currentQuery.hasOwnProperty('domain') ? currentQuery.domain : ''
      }
      vm.$store.dispatch('getServiceLists', filter).then(function (result) {
        vm.loading = false
        if (result.data) {
          vm.serviceInfoList = result.data
          vm.thutucPage = Number(currentQuery.page) ? Number(currentQuery.page) : 1
          vm.totalThuTuc = result.total
        } else {
          vm.totalThuTuc = 0
          vm.serviceInfoList = []
        }
        vm.serviceItemTotal = result.total
      }).catch(reject => {
        vm.loading = false
        vm.serviceInfoList = []
        vm.totalThuTuc = 0
        vm.thutucPage = 1
      })
    },
    makeImageCap () {
      let vm = this
      vm.chapchablob = ''
      vm.$store.dispatch('makeImageCapLogin').then(function (result) {
        vm.chapchablob = result
      }).catch(function (reject) {
        vm.chapchablob = ''
      })
    },
    submitConfirmLogin () {
      let vm = this
      let current = vm.$router.history.current
      let filter = {
        npmreactlogin_login: vm.userName,
        npmreactlogin_password: vm.passWord,
        j_captcha_response: vm.j_captcha_response
      }
      if (vm.$refs.form.validate() && vm.userName && vm.passWord) {
        vm.loadingLogin = true
        vm.$store.dispatch('goToDangNhap', filter).then(function(result) {
          vm.loadingLogin = false
          if (vm.mapping && result === 'success') {
            vm.doMappingDvcqg()
          }
          if (result === 'success') {
            vm.dialogLogin = false
            if (vm.doCreateDossier) {
              vm.isLogin = true
              vm.createDossier(vm.serviceSelected)
            } else {
              if ( typeof(Storage) !== 'undefined') {
                sessionStorage.setItem('sync','true')
              }
              let url = window.themeDisplay.getLayoutURL() + '/thu-tuc-hanh-chinh#' + current.path
              window.location.href = url
              setTimeout(() => {
                window.location.reload()
              }, 100)
            }
          }
          if (result !== 'success') {
            if ( typeof(Storage) !== 'undefined') {
              let count = Number(sessionStorage.getItem('isbot'))
              count+=1
              sessionStorage.setItem('isbot', String(count))
              if (count === 5) {
                vm.captcha = true
                vm.makeImageCap()
              }
            }
          } else {
            if ( typeof(Storage) !== 'undefined') {
              sessionStorage.setItem('isbot', '0')
            }
          }
          if (result === 'captcha') {
            vm.captcha = true
            vm.makeImageCap()
          }
        }).catch(function(){
          vm.loadingLogin = false
          if ( typeof(Storage) !== 'undefined') {
            let count = Number(sessionStorage.getItem('isbot'))
            count+=1
            sessionStorage.setItem('isbot', String(count))
            if (count === 5) {
              vm.captcha = true
              vm.makeImageCap()
            }
          }
        })
      }
    },
    checkServiceExits (key) {
      let vm = this
      let filter = {
        keyword: key
      }
      vm.$store.dispatch('checkServiceExits', filter).then(function(result) {
        vm.loadingLogin = false
        if (result === 'success') {
          vm.dialogLogin = false
          vm.isLogin = true
          vm.createDossier(vm.serviceSelected)
        }          
      }).catch(function(){
        vm.loadingLogin = false
      })

    },
    checkVNConect () {
      let vm = this
      let current = vm.$router.history.current
      let query = vm.$router.history.current.query
      let filter = {
        state: '',
        redirectURL: window.location.href.split("?")[0]
      }
      setTimeout (function () {
        if (!vm.isSigned) {
          vm.$store.dispatch('getVNConect', filter).then(function (result) {
            if (result) {
              window.location.href = result
            } else {
              alert('Chức năng đang cập nhật')
            }
          }).catch(function () {
            if (!vm.isSigned) {
              vm.doCreateDossier = false
              vm.dialogLogin = true
            }
          })
        }
      }, 300)
    },
    checkOnlyLoginDvcqg () {
      let vm = this
      let current = vm.$router.history.current
      let query = vm.$router.history.current.query
      let codeDvcqg = vm.serviceInfoSelected.hasOwnProperty('serviceCodeDVCQG') && vm.serviceInfoSelected.serviceCodeDVCQG ? vm.serviceInfoSelected.serviceCodeDVCQG : ''
      let filter = {
        state: '',
        redirectURL: codeDvcqg ? window.location.href.split("?")[0] + '/' + vm.serviceInfoSelected.serviceInfoId + '?code=' +  codeDvcqg + '&serviceCreate=' + vm.serviceSelected.serviceConfigId : window.location.href.split("?")[0] + '/' + vm.serviceInfoSelected.serviceInfoId + '?serviceCreate=' + vm.serviceSelected.serviceConfigId
      }
      setTimeout (function () {
        if (!vm.isSigned) {
          vm.$store.dispatch('getVNConect', filter).then(function (result) {
            if (result) {
              window.location.href = result
            } else {
              alert('Chức năng đang cập nhật')
            }
          }).catch(function () {
          })
        }
      }, 300)
    },
    doMappingDvcqg () {
      let vm = this
      let filter = {
        dataMapping: vm.dataMapping
      }
      vm.$store.dispatch('mappingDvcqg', filter).then(function (result) {
      }).catch(function () {
      })
    },
    getSearchParams (prams, key) {
      let value = ""
      let headers = prams.split("&")
      headers.forEach(function (header) {
        header = header.split("=");
        let keyHeader = header[0];
        if (keyHeader === key) {
          value = header[1]
        }
      });
      return value
    },
    checkVNConectAutoMapping () {
      let vm = this
      let current = vm.$router.history.current
      let query = vm.$router.history.current.query
      let filter = {
        state: 'mapping'
      }
      setTimeout (function () {
        vm.$store.dispatch('getVNConect', filter).then(function (result) {
          if (result) {
            vm.dialog_loginDVCQG = true
            setTimeout(function () {
              vm.tempDVCQG = result
            }, 200)
          }
        }).catch(function () {
        })
      }, 300)
    },
    callback_dvcqg (data) {
      let vm = this
      // vm.userInfoDvc = data
      let current = vm.$router.history.current
      let currentQuery = current.query
      // remove auto mapping
      let sync = false
      if ( typeof(Storage) !== 'undefined') {
        sync = sessionStorage.getItem('sync')
      }
      if (vm.isSigned && sync) {
        vm.dialog_loginDVCQG = false
        sessionStorage.removeItem('sync')
      } else {
        if (String(data['userId']) !== '0') {
          let url = window.themeDisplay.getLayoutURL() + '#' + current.path
          vm.dialog_loginDVCQG = false
          window.location.reload()
        } else {
          vm.dialog_loginDVCQG = false
          // vm.doCreateDossier = false
          vm.dialogLogin = true
          vm.userInfoDvcqg = data
        }
      }
    },
    confirmEnding (string, target) {
      return string.substr(-target.length) === target
    },
    register () {
      let vm = this
      if (vm.userInfoDvcqg && String(vm.userInfoDvcqg['userId']) === '0') {
        let name = vm.userInfoDvcqg['HoVaTen'] ? vm.userInfoDvcqg['HoVaTen'] : ''
        let mail = vm.userInfoDvcqg['ThuDienTu'] ? vm.userInfoDvcqg['ThuDienTu'] : ''
        let tel = vm.userInfoDvcqg['SoDienThoai'] ? vm.userInfoDvcqg['SoDienThoai'] : ''
        let credit = vm.userInfoDvcqg['SoCMND'] ? vm.userInfoDvcqg['SoCMND'] : ''
        let type = vm.userInfoDvcqg['LoaiTaiKhoan'] ? vm.userInfoDvcqg['LoaiTaiKhoan'] : ''

        let query = '#/?name=' + name + '&mail=' + mail + '&tel=' + tel + '&credit=' + credit + '&type=' + type
        let url = vm.configUrl.hasOwnProperty('registerUrl') ? vm.configUrl['registerUrl'] + query : window.themeDisplay.getPortalURL() + '/web/cong-dich-vu-cong/register' + query
        window.location.href = url
      } else {
        window.location.href = vm.configUrl.hasOwnProperty('registerUrl') ? vm.configUrl['registerUrl'] : window.themeDisplay.getPortalURL() + '/web/cong-dich-vu-cong/register'
      }
    },
    getPassword () {
      let vm = this
      window.location.href = vm.configUrl.hasOwnProperty('registerUrl') ? vm.configUrl['registerUrl'] + '/#/cap-lai-mat-khau' : window.themeDisplay.getPortalURL() + '/web/cong-dich-vu-cong/register/#/cap-lai-mat-khau'
    },
    paggingData (config) {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['page'] = ''
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null && newQuery[key] !== 'null') {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      queryString += 'page=' + config.page
      vm.$router.push({
        path: current.path + queryString
      })
    },
    viewDetail (item, activeTab) {
      let vm = this
      let urlRedirect = vm.pathRouter + item.serviceInfoId
      if (item.serviceCodeDVCQG) {
        urlRedirect = urlRedirect + '?code=' + item.serviceCodeDVCQG + '&notCreate=true'
      }
      if (vm.setAgency) {
        urlRedirect = vm.pathRouter + item.serviceInfoId + '?setAgency=true&notCreate=true'
      }
      if (activeTab) {
        if (item.serviceCodeDVCQG || vm.setAgency) {
          urlRedirect = urlRedirect + '&active=' + activeTab
        } else {
          urlRedirect = urlRedirect + '?active=' + activeTab
        }
      }
      vm.$router.push({
        path: urlRedirect
      })
    },
    viewTphs () {
      let vm = this
      vm.viewDetail(vm.serviceInfoSelected, 2)
    },
    createDossier (item, serviceInfoItem) {
      let vm = this
      vm.serviceSelected = item
      if (item.serviceUrl) {
        window.location.href = item.serviceUrl
      } else {
        if (!vm.formToKhai) {
          let isSigned = window.themeDisplay ? window.themeDisplay.isSignedIn() : ''
          if (isSigned || vm.isLogin) {
            if (vm.verificationApplicantCreateDossier && vm.userLoginInfomation && vm.userLoginInfomation['verification'] && String(vm.userLoginInfomation['verification']) === '2') {
              vm.dialogVerifycation = true
            } else {
              let redirectURL = window.themeDisplay.getLayoutRelativeURL().substring(0, window.themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
              let url = redirectURL + '/dich-vu-cong#/add-dvc/' + item.serviceConfigId
              window.open(url, '_self') 
            }
          } else {
            if (!vm.onlyLoginDvcqg) {
              vm.doCreateDossier = true
              vm.dialogLogin = true
            } else {
              vm.serviceInfoSelected = serviceInfoItem
              vm.dialogLoginDvcqg = true
            }
            
          }
        } else {
          vm.trackingBTTT(serviceInfoItem.serviceCode)
          vm.serviceInfoSelected = serviceInfoItem
          let filterSearch = {
            serviceInfoId: serviceInfoItem.serviceInfoId
          }
          vm.$store.dispatch('getFileTemplateEform', filterSearch).then(function (result) {
            if (result.data) {
              vm.templateFormList = result.data
              if (vm.templateFormList.length > 1) {
                vm.dialog_selectTemplateEform = true
              } else {
                let url = window.themeDisplay.getSiteAdminURL().split('/~')[0].replace('group','web') + '/to-khai-truc-tuyen#/thong-tin-to-khai?service='+ serviceInfoItem.serviceInfoId + '&template=' + vm.templateFormList[0].fileTemplateNo
                window.location.href = url
              }
            }
          }).catch(function () {
          })
        }
      }
    },
    doLogin () {
      let vm = this
      let redirectURL = window.themeDisplay.getLayoutRelativeURL().substring(0, window.themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
      let url = redirectURL + '/dich-vu-cong#/add-dvc/' + item.serviceConfigId
      window.open(url, '_self')
    },
    viewGuide (item, serviceCode, serviceInfo) {
      let vm = this
      vm.serviceDetail = item
      vm.dialogGuide = true
      vm.trackingBTTT(serviceCode)
      if (serviceInfo) {
        vm.serviceInfoSelected = serviceInfo
      }
    },
    showSelectGov (serviceInfo, govList, guide) {
      let vm = this
      vm.serviceInfoSelected = serviceInfo
      vm.govAgencyTiepNhanSelected = ''
      vm.selectGuide = guide ? true : false
      vm.govAgencyListTiepNhan = vm.serviceConfigs(govList)
      vm.govAgencyListTiepNhanFilters = vm.govAgencyListTiepNhan
      if (vm.serviceInfoSelected.administrationCode === 'CAP_XA') {
        vm.luaChonXaPhuong = true
        let filterSearch = {
          collection: 'QUAN_HUYEN'
        }
        vm.$store.dispatch('getDict', filterSearch).then(function (result) {
          vm.danhSachQuanHuyen = result
        })
      } else {
        vm.luaChonXaPhuong = false
      }
      vm.dialog_selectAgency = true
    },
    changeQuanHuyen () {
      let vm = this
      setTimeout(function () {
        if (vm.quanHuyen) {
          let filterSearch = {
            parent: vm.quanHuyen.itemCode
          }
          vm.$store.dispatch('getDictFromParent', filterSearch).then(function (result) {
            let donViXa = result
            vm.govAgencyListTiepNhanFilters = vm.govAgencyListTiepNhan.filter(function(item) {
              return donViXa.filter(function(item1) {
                return item1.itemCode === item.govAgencyCode
              }).length > 0
            })
          })
        } else {
          vm.govAgencyListTiepNhanFilters = vm.govAgencyListTiepNhan
        }
        
      }, 50)
    },
    submitSelectGov () {
      let vm = this
      if (vm.$refs.formSelect.validate()) {
        if (vm.selectGuide) {
          vm.dialog_selectAgency = false
          setTimeout(function () {
            vm.viewGuide(vm.govAgencyTiepNhanSelected)
          }, 200)
        } else {
          vm.createDossier(vm.govAgencyTiepNhanSelected, vm.serviceInfoSelected)
        }
      }
    },
    submitSelectTemplateForm () {
      let vm = this
      if (vm.$refs.formSelectEform.validate()) {
        let url = window.themeDisplay.getSiteAdminURL().split('/~')[0].replace('group','web') + '/to-khai-truc-tuyen#/thong-tin-to-khai?service='+ vm.serviceInfoSelected.serviceInfoId + '&template=' + vm.templateFormSelected.fileTemplateNo
        window.location.href = url
      }
    },
    serviceConfigs (config) {
      if (Array.isArray(config)) {
        return config
      } else {
        if (config.hasOwnProperty('serviceConfigId')) {
          return [config]
        } else {
          return []
        }
      }
    },
    goBack () {
      window.history.back()
    },
    getColor (level) {
      if (level === 2) {
        return 'green'
      } else if (level === 3) {
        return 'orange darken-1'
      } else if (level === 4) {
        return 'red'
      }
    },
    trackingBTTT (serviceCode) {
      try {
        console.log('trackDVC serviceCode', serviceCode)
        if (_govaq) {
          _govaq.push(['trackDVC', serviceCode, '-1', ''])
        }
      } catch (error) { 
      }
    }
  }
}
</script>
