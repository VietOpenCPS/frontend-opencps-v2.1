<template>
  <div :class="!isMobile ? 'pt-3' : 'pt-0'" style="max-width:1300px;height: 100%; background-color: #ffff;" >
    <v-layout row wrap v-if="surveyLayoutVersion !== 2">
      <v-flex xs12 md9 v-if="votingItems.length > 0">
        <v-layout row wrap>
          <v-flex xs12 sm12 class="mb-4 px-2" v-if="!isMobile">
            <div id="title" class="text-bold" style="color:#034687">
            </div>
          </v-flex>
          <v-flex xs12 sm12 class="mb-2" v-else>
            <div class="row-header" style="background-color: #0054a6">
              <div class="ml-2 py-2 text-bold white--text"> <span>KHẢO SÁT MỨC ĐỘ HÀI LÒNG</span> </div>
              <div class="layout row wrap header_tools row-blue">
                <div class="flex text-right" style="margin-left: auto;">
                  <v-btn icon class="my-0 white--text" @click="dialogMobile = true">
                    <v-icon size="18">star</v-icon>
                  </v-btn>
                </div>
              </div> 
            </div>
          </v-flex>
          <v-flex xs12 sm12>
            <div v-for="(item, index) in votingItems" style="margin-bottom: 5px;" :key="index">
              <v-layout wrap class="text-bold" v-if="!isMobile">
                <div class="flex px-3 py-1" style="height:26px;max-width:87px;background-color: #034687;transform: skew(-25deg)">
                  <span class="d-block white--text" style="transform: skew(25deg)">Chỉ số {{index + 1}} : </span>
                </div>
                <div class="flex pl-3 pr-2" style="max-width:calc(100% - 100px);color:#034687">
                  {{ ksBgt ? item.title : item.subject }}
                </div>
              </v-layout>
              <div class="text-bold px-2" v-if="isMobile">
                <div class="" style="text-align: justify;color:#034687">
                  Chỉ số {{index + 1}}: {{ ksBgt ? item.title : item.subject }}
                </div>
              </div>
              <div :class="!isMobile ? 'ml-4' : 'ml-2'">
                <!-- <div v-if="ksBgt && (index === 4 || index === 5 || index === 7 || index === 8)" class="mt-2">
                  <span style="color: red">(*) </span> <i>Chỉ số giành cho cơ quan quản lý đánh giá</i>
                </div>
                <v-radio-group v-model="item.selected" column class="mt-1">
                  <v-radio :disabled="ksBgt && (index === 4 || index === 5 || index === 7 || index === 8)" :value="indexChoise + 1" v-for="(itemChoise, indexChoise) in item['choices']" :key="'rd' + indexChoise">
                    <div v-if="ksBgt && (index === 4 || index === 5 || index === 7 || index === 8)" style="text-align: justify; opacity: 0.7; color: black" slot="label">{{itemChoise.subject}}</div>
                    <div v-else style="text-align: justify;" :style="item.selected === indexChoise + 1 ? 'color:#034687' : 'color:black'" slot="label">{{ksBgt ? itemChoise.subject : itemChoise}}</div>
                  </v-radio>
                </v-radio-group> -->

                <v-radio-group v-model="item.selected" column class="mt-1">
                  <v-radio :value="indexChoise + 1" v-for="(itemChoise, indexChoise) in item['choices']" :key="'rd' + indexChoise">
                    <div style="text-align: justify;" :style="item.selected === indexChoise + 1 ? 'color:#034687' : 'color:black'" slot="label">{{ksBgt ? itemChoise.subject : itemChoise}}</div>
                  </v-radio>
                </v-radio-group>
              </div>
            </div>
            <v-flex xs12 sm12 class="mx-2 my-3" v-if="showCaptcha">
              <div style="max-width: 400px;background: #dedede;margin: 0 auto;" class="pb-2">
                <v-flex xs12 class="py-2" style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                ">
                  <div id="captcha" class="d-inline-block text-xs-center" style="padding-top: 15px;background: #fff;border-radius: 5px;"></div>
                  <v-btn class="right ml-3 mx-0 my-0" title="refresh" flat icon v-on:click.native="createCaptcha">
                    <v-icon color="primary" size="32">refresh</v-icon>
                  </v-btn>
                </v-flex>
                <v-text-field
                  class="mx-3"
                  single-lines
                  hide-details
                  solo
                  flat
                  height="36"
                  min-height="36"
                  clearable
                  v-model="captchaValue"
                  placeholder="Nhập mã captcha"
                ></v-text-field>
              </div>
              
            </v-flex>
            <v-flex xs12 sm12 :class="!isMobile ? 'text-xs-left mt-2' : 'text-xs-left my-2 px-2'">
              <v-btn class="white--text" @click="showFormVerify" color="#004C98" :loading="btnLoading" :disabled="btnLoading">
                <v-icon>save</v-icon>&nbsp;
                Gửi đánh giá
              </v-btn>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 md9 v-else>
        <div class="px-3">
          <v-alert outline color="warning" icon="priority_high" :value="true">
            Chưa có câu hỏi khảo sát
          </v-alert>
        </div>
      </v-flex>
      <v-flex xs12 md3 v-if="!isMobile">
        <div >
          <v-card color="#034687" flat class="white--text px-2 py-2" style="border-radius: 7px;">
            <v-card-text class="px-2 py-1 pr-0 ">
              <div class="text-xs-center text-bold">Tổng số lượt đánh giá</div>
              <div class="text-xs-center" v-if="!ksBgt"> trong năm {{(new Date()).getFullYear()}}</div>
              <div class="text-xs-center text-bold" style="font-size:24px">{{totalAnswer}}</div>
              <div class="text-xs-center">lượt đánh giá</div>
            </v-card-text>
          </v-card>
          <v-card color="#0072bc" flat :class="isMobile ? 'px-2 py-2 mt-4' : 'px-2 py-2 mt-2'" style="border-radius: 7px;">
            <v-card-text class="px-2 py-1 pr-0">
              <div class="text-xs-center white--text text-bold">Kết quả đánh giá các chỉ số</div>
              <div class="text-xs-center white--text" v-if="!ksBgt">Năm {{(new Date()).getFullYear()}}</div>
              <div class="text-xs-center mt-2">
                <v-autocomplete
                  v-if="ksBgt"
                  class="select-search d-inline-block"
                  :items="agencyList"
                  v-model="agency"
                  item-text="govAgencyName"
                  item-value="govAgencyCode"
                  hide-details
                  hide-no-data
                  solo
                  flat
                  height="26"
                  min-height="26"
                  return-object
                ></v-autocomplete>
              </div>
              <div class="text-xs-center pt-4" v-if="loadingChangeAgency" style="height: 100px">
                <v-progress-circular
                  indeterminate
                  color="white"
                ></v-progress-circular>
              </div>
              <div v-else>
                <v-flex v-if="!ksBgt" xs12 v-for="(item, index) in votingItems" :key="index" class="white--text mt-2">
                  <v-layout row justify-center v-if="!ksBgt">
                    <v-flex xs7 class="text-xs-center">
                      <span>Chỉ số {{index + 1}}: </span>
                      <span style="color:#6dcff6">{{item.answersCount ? item.averageScore + ' / 2 điểm' : 'Chưa có đánh giá'}}</span>
                    </v-flex>
                  </v-layout>
                  <v-layout row justify-center v-else>
                    <v-flex xs7 class="text-xs-center">
                      <span>Chỉ số {{index + 1}}: </span>
                      <span style="color:#6dcff6">{{item.answersCount ? item.averageScore + ' / 2 điểm' : 'Chưa có đánh giá'}}</span>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex v-if="ksBgt" xs12 v-for="(item, index) in votingResult" :key="index" class="white--text mt-2">
                  <v-layout row justify-center>
                    <v-flex xs7 class="text-xs-center">
                      <span>Chỉ số {{index + 1}}: </span>
                      <!-- <span v-if="index === 4 || index === 5 || index === 7 || index === 8" style="color:#6dcff6">2 / 2 điểm</span> -->
                      <span style="color:#6dcff6">{{item.point ? item.point + ' điểm' : 'Chưa có đánh giá'}}</span>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </div>
            </v-card-text>
          </v-card>
          
          <!-- Thống kê chi tiết các chỉ số. Sử dụng sau -->
          <!-- <v-card v-for="(item, index) in votingItems" :key="index" color="#0072bc" flat class="px-2 py-2 mt-4" style="border-radius: 7px;">
            <v-card-text class="px-2 py-1 pr-0">
              <div class="text-xs-center white--text text-bold">Kết quả đánh giá Chỉ số {{index + 1}}</div>
              <div class="text-xs-center white--text" >Năm {{(new Date()).getFullYear()}}</div>
              <div class="mt-3" v-for="(item1, index1) in item['answerPercent']" :key="index1">
                <v-layout wrap class="mb-2">
                  <div class="flex white--text" style="width:70px">{{item1.name}} : </div>
                  <progress-bar class="flex pt-1" size="13" :spacing="1" bar-transition="all 1s ease"
                  :val="Number(item1.percent)" 
                  bg-color="#e0e0e0" bar-color="#6dcff6" text-fg-color="#fff" style="z-index:10000;width: calc(100% - 120px)">
                  </progress-bar>
                  <div style="width:50px;color:#6dcff6" class="flex pl-2 text-bold">{{item1.percent}} % </div>
                </v-layout>
              </div>
            </v-card-text>
          </v-card> -->
        </div>
      </v-flex>
      <v-flex xs12 sm1>
      </v-flex>
    </v-layout>
    <div v-if="surveyLayoutVersion === 2" style="border: 2px solid #e9e9e9;border-radius: 5px;">
      <v-tabs
        color="white"
        dark
        icons-and-text
      >
        <v-tabs-slider color="blue"></v-tabs-slider>
    
        <v-tab href="#tab-1" class="ml-3 mr-4 black--text" >
          <span style="font-size: 16px">THỰC HIỆN ĐÁNH GIÁ</span>
          <v-icon class="black--text" size=26>done_all</v-icon>
        </v-tab>
    
        <v-tab href="#tab-2" class="black--text">
          <span style="font-size: 16px">KẾT QUẢ ĐÁNH GIÁ</span>
          <v-icon class="black--text" size=26>ballot</v-icon>
        </v-tab>
    
        <v-tab-item
          value="tab-1"
        >
          <v-card flat>
            <v-card-text class="mt-2">
              <v-layout row wrap class="ml-2">
                <v-flex xs12 sm12>
                  <div v-for="(item, index) in votingItems" style="margin-bottom: 5px;" :key="index">
                    <v-layout wrap class="text-bold" v-if="!isMobile">
                      <div class="flex px-3 py-1" style="height:26px;max-width:87px;background-color: #034687;transform: skew(-25deg)">
                        <span class="d-block white--text" style="transform: skew(25deg)">Chỉ số {{index + 1}} : </span>
                      </div>
                      <div class="flex pl-3 pr-2" style="max-width:calc(100% - 100px);color:#034687">
                        {{ item.title}}
                      </div>
                    </v-layout>
                    <div class="text-bold px-2" v-if="isMobile">
                      <div class="" style="text-align: justify;color:#034687">
                        Chỉ số {{index + 1}}: {{ item.title }}
                      </div>
                    </div>
                    <div :class="!isMobile ? 'ml-4' : 'ml-2'">
                    <v-radio-group v-model="item.selected" column class="mt-1">
                      <v-radio :value="indexChoise + 1" v-for="(itemChoise, indexChoise) in item['choices']" :key="'rd' + indexChoise">
                        <div style="text-align: justify;" :style="item.selected === indexChoise + 1 ? 'color:#034687' : 'color:black'" slot="label">{{itemChoise.subject}}</div>
                      </v-radio>
                    </v-radio-group>
                  </div>
                </div>
                <v-flex xs12 sm12 class="mx-2 my-3" v-if="showCaptcha">
                  <div style="max-width: 400px;background: #dedede;margin: 0 auto;" class="pb-2">
                    <v-flex xs12 class="py-2" style="
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    ">
                      <div id="captcha" class="d-inline-block text-xs-center" style="padding-top: 15px;background: #fff;border-radius: 5px;"></div>
                      <v-btn class="right ml-3 mx-0 my-0" title="refresh" flat icon v-on:click.native="createCaptcha">
                        <v-icon color="primary" size="32">refresh</v-icon>
                      </v-btn>
                    </v-flex>
                    <v-text-field
                      class="mx-3"
                      single-lines
                      hide-details
                      solo
                      flat
                      height="36"
                      min-height="36"
                      clearable
                      v-model="captchaValue"
                      placeholder="Nhập mã captcha"
                    ></v-text-field>
                  </div>
                  
                </v-flex>
                <v-flex xs12 sm12 :class="!isMobile ? 'text-xs-left mt-2' : 'text-xs-left my-2 px-2'">
                  <v-btn class="white--text" @click="showFormVerify" color="#004C98" :loading="btnLoading" :disabled="btnLoading">
                    <v-icon>save</v-icon>&nbsp;
                    Gửi đánh giá
                  </v-btn>
                </v-flex>
              </v-flex>
            </v-layout>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item
          value="tab-2"
        >
          <v-card flat>
            <v-card-text class="reportTable">
              <table class="my-2" hide-default-footer>
                <thead>
                  <tr>
                    <th class="text-center px-2">
                      <span>STT</span>
                    </th>
                    <th class="text-center px-2">
                      <span>Chỉ số đánh giá</span>
                    </th>
                    <th class="text-center px-2">
                      <span>Tiêu chí đánh giá</span>
                    </th>
                    <th class="text-center px-2 py-1">
                      <span>Số điểm</span>
                    </th>
                  </tr>
                </thead>

                <tbody v-for="(item,index) in statisticGovAgency" :key="index">
                  <tr>
                    <td align="left" colspan="4"  class="px-2 text-bold">{{item.govAgencyName}}</td>
                  </tr>
                  
                  <tr v-for="(item2,index2) in item['votings']" :key="index2">
                    <td align="center" class="px-2">{{index2 + 1}}</td>
                    <td align="left"  class="px-2">Chỉ số {{index2 + 1}}</td>
                    <td align="left"  class="px-2">{{item2.title}}</td>
                    <td align="center"  class="px-2">{{item2.point}}</td>
                  </tr>
                </tbody>
              </table>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </div>
    <v-dialog v-model="dialogVerify" persistent max-width="500">
      <v-card>
        <v-card-title class="headline">
          <div style="text-align: center;width: 100%;">Quý khách vui lòng nhập thông tin để gửi đánh giá</div>
        </v-card-title>
        <v-card-text class="py-2 px-2">
          <v-form ref="formVerify" v-model="validVerify" lazy-validation class="px-2 pt-2">
            <v-flex xs12>
              <p>Mã hồ sơ <span style="color: red">(*)</span></p>
              <v-text-field
                box
                placeholder="Nhập mã hồ sơ"
                v-model="dossierNo"
                :rules="[v => !!v || 'Mã hồ sơ là bắt buộc']"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <p>Số CMND/ mã số thuế <span style="color: red">(*)</span></p>
              <v-text-field
                box
                placeholder="Nhập số CMND/ mã số thuế"
                v-model="applicantIdNo"
                :rules="[v => !!v || 'Số CMND/ mã số thuế là bắt buộc']"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 class="">
              <p>Mã bảo mật <span style="color: red">(*)</span></p>
              <v-layout wrap>
                <v-flex style="width: calc(100% - 200px)">
                  <v-text-field
                    box
                    class="mr-2"
                    clearable
                    v-model="captchaValue"
                    placeholder="Nhập mã bảo mật"
                    :rules="[v => !!v || 'Mã bảo mật là bắt buộc']"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex style="width: 200px">
                  <div id="captcha" class="d-inline-block text-xs-center" style="background: #d4d4d4;border-radius: 5px;"></div>
                  <v-btn outline class="right mx-0 my-0 mt-2" flat v-on:click.native="createCaptcha">
                    <v-icon color="primary" size="32">refresh</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
              
            </v-flex>
          </v-form>
        </v-card-text>
        <v-card-actions class="mx-2">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="submitForm">
            <v-icon>how_to_reg</v-icon>&nbsp;
              Xác nhận
          </v-btn>
          <v-btn color="primary" @click="dialogVerify = false">
            <v-icon>clear</v-icon>&nbsp;
              Hủy
          </v-btn>
          
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-if="!ksBgt" v-model="dialog_voting_result" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title class="pl-5">Kết quả đánh giá</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon dark @click="dialog_voting_result = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs12 sm1></v-flex>
            <v-flex xs12 sm10 class="pl-4">
              <v-card flat class="py-1" v-if="Array.isArray(votingItems) && votingItems.length > 0">
                <div v-for="(item, index) in votingItems" :key="index">
                  <div class="text-bold primary--text">
                    {{index + 1}}. {{ item.subject }}
                    <i style="color:#ad1717"> (Số lượt đánh giá: {{item.answersCount}})</i>
                  </div>
                  <v-card flat class="pl-2">
                    <v-card-text class="px-2 py-1 pr-0">
                      <div v-for="(itemChoise, indexChoise) in item['choices']" :key="'rd' + indexChoise">
                        <v-layout wrap class="mb-2">
                          <div class="flex xs6 sm8 pr-2">{{itemChoise}} <span class="text-bold" :style="'color:' + barColor[indexChoise]">({{item.answers[indexChoise]}})</span> </div>
                          <progress-bar v-if="item.answersCount > 0" class="flex xs6 sm4" size="16" :spacing="1" bar-transition="all 1s ease"
                          :val="getPercent(item.answers, indexChoise)" :text="getPercent(item.answers, indexChoise) !== 0 ? getPercent(item.answers, indexChoise) + '%' : ''" 
                          text-position="inside" bg-color="#e0e0e0" :bar-color="barColor[indexChoise]" text-fg-color="#fff" style="z-index:10000">
                          </progress-bar>
                        </v-layout>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </v-card>
              <div class="px-3" v-else>
                <v-alert outline color="warning" icon="priority_high" :value="true">
                  Không có câu hỏi khảo sát
                </v-alert>
              </div>
              <v-flex xs12 sm12 class="mt-4 text-xs-right">
                <v-btn @click="dialog_voting_result = false" color="primary">
                  <v-icon size="16">reply</v-icon>&nbsp;
                  Quay lại 
                </v-btn>
              </v-flex>
            </v-flex>
            <v-flex xs12 sm1></v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogMobile" width="320">
      <v-card>
        <v-card-text class="px-1 py-1">
          <div>
            <v-card color="#034687" flat class="white--text px-2 py-2" style="border-radius: 7px;">
              <v-card-text class="px-2 py-1 pr-0 ">
                <div class="text-xs-center text-bold">Tổng số lượt đánh giá</div>
                <div class="text-xs-center"> trong năm {{(new Date()).getFullYear()}}</div>
                <div class="text-xs-center text-bold" style="font-size:24px">{{totalAnswer}}</div>
                <div class="text-xs-center">lượt đánh giá</div>
              </v-card-text>
            </v-card>
            <v-card color="#0072bc" flat :class="isMobile ? 'px-2 py-2 mt-4' : 'px-2 py-2 mt-2'" style="border-radius: 7px;">
              <v-card-text class="px-2 py-1 pr-0">
                <div class="text-xs-center white--text text-bold">Kết quả đánh giá các chỉ số</div>
                <div class="text-xs-center white--text" >Năm {{(new Date()).getFullYear()}}</div>
                <v-flex xs12 v-for="(item, index) in votingItems" :key="index" class="white--text mt-2">
                  <v-layout row justify-center>
                    <v-flex xs7 class="text-xs-center">
                      <span>Chỉ số {{index + 1}}: </span>
                      <span style="color:#6dcff6">{{item.answersCount ? item.averageScore + ' / 2 điểm' : 'Chưa có đánh giá'}}</span>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-card-text>
            </v-card>
          </div>
        </v-card-text>
        <v-divider class="my-0"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            small
            color="primary"
            @click="dialogMobile = false"
          >
            Thoát
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import Vue from 'vue'
import toastr from 'toastr'
import ProgressBar from 'vue-simple-progress'
Vue.use(toastr)
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  props: ['index'],
  components: {
    ProgressBar
  },
  data: () => ({
    votingItems: [],
    btnLoading: false,
    showCaptcha: false,
    barColor: ['#5cb85c', '#f0ad4e', '#d9534f', '#2e4fc8', '#2ec8bad9', '#142f14'],
    dialog_voting_result: false,
    resultTotal: [],
    totalAnswer: 0,
    dialogMobile: false,
    captchaCode: '',
    captchaValue: '',
    applicantIdNo: '',
    dossierNo: '',
    dialogVerify: false,
    ksBgt: false,
    surveyLayoutVersion: 1,
    statisticGovAgency: [],
    agencyList: [],
    agency: '',
    loadingChangeAgency: false,
    votingResult: []
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    isMobile () {
      return this.$store.getters.getIsMobile
    }
  },
  created () {
    var vm = this
    try {
      vm.surveyLayoutVersion = surveyLayoutVersion ? surveyLayoutVersion : 1
    } catch (error) {
    }
    try {
      vm.ksBgt = ksBgt
    } catch (error) {
    }
    try {
      vm.agencyList = agencyList
      // vm.agency = vm.agencyList[0]
    } catch (error) {
    }
    vm.$nextTick(function () {
      if (vm.ksBgt) {
        vm.$store.dispatch('loadVotingNew', {
          className: 'survey'
        }).then(function(result) {
          vm.votingItems = result
          let sortVote = function (voteList) {
            function compare(a, b) {
              if (a.voteCode < b.voteCode)
                return -1
              if (a.voteCode > b.voteCode)
                return 1
              return 0
            }
            return voteList.sort(compare)
          }
          vm.votingItems = sortVote(vm.votingItems)
          vm.getReportAgency()
        }).catch(xhr => {
        })
        vm.getCounter()
      } else {
        vm.$store.dispatch('loadVoting', {
          className: 'survey',
          classPk: 0
        }).then(result => {
          vm.votingItems = result
          vm.totalAnswer = 0
          for (let i = 0; i < vm.votingItems.length; i++) {
            vm.totalAnswer += Number(vm.votingItems[i]['answersCount'])
            vm.getPercentItem(vm.votingItems[i], i)
          }
        }).catch(xhr => {
        })
      }
      
    })
  },
  watch: {
  },
  methods: {
    viewListEmployee (item) {
     this.$router.push({
        path: '/danh-sach-can-bo/' + item.itemCode,
        query: {
          itemName: item.itemName
        }
      })
    },
    showFormVerify () {
      let vm = this
      let valid = false
      console.log('votingItems', vm.votingItems)
      for (let key in vm.votingItems) {
        if (String(vm.votingItems[key]['selected']) !== '0') {
          valid = true
        }
      }
      console.log('valid5555', valid)
      if (valid) {
        vm.dialogVerify = true
        vm.$refs.formVerify.resetValidation()
        vm.createCaptcha()
      } else {
        toastr.error('Bạn chưa chọn đánh giá nào')
      }
    },
    submitForm () {
      let vm = this
      if (vm.$refs.formVerify.validate()) {
        let valid = vm.validateCaptcha()
        if (!valid) {
          return
        } else {
          vm.checkDossierInfo()
        }
      } else {
        setTimeout (function () {
          vm.createCaptcha()
        }, 100)
        return
      }
    },
    checkDossierInfo () {
      let vm = this
      let filter = {
        dossierNo: vm.dossierNo
      }
      vm.$store.dispatch('loadingDataHoSo', filter).then(function (result) {
        if (String(result.dossierNo) === String(vm.dossierNo)) {
          if (String(result.applicantIdNo) === String(vm.applicantIdNo)) {
            if (vm.ksBgt) {
              vm.doVottingResultSubmitNew()
            } else {
              vm.doVottingResultSubmit()
            }
          } else {
            toastr.error('Hồ sơ ' + vm.dossierNo + ' không phải hồ sơ quý khách đã đăng ký. Quý khách vui lòng kiểm tra lại.')
          }
        } else {
          toastr.error('Hồ sơ ' + vm.dossierNo + ' không tồn tại. Quý khách vui lòng kiểm tra lại.')
        }
      }).catch(function () {
        toastr.error('Hồ sơ ' + vm.dossierNo + ' không tồn tại. Quý khách vui lòng kiểm tra lại.')
      })
    },
    increCounter () {
      let vm = this
      let data = {
        dossierNo: vm.dossierNo
      }
      vm.$store.dispatch('increCounter', data).then(function (result) {})
    },
    getCounter () {
      let vm = this
      vm.$store.dispatch('getCounter',{}).then(function (result) {
        vm.totalAnswer = result
      })
    },
    doVottingResultSubmit () {
      var vm = this
      vm.btnLoading = true
      let arrAction = []
      let valid = false
      for (var key in vm.votingItems) {
        vm.votingItems[key]['className'] = 'survey' 
        vm.votingItems[key]['classPk'] = 0
        if (String(vm.votingItems[key]['selected']) !== '0') {
          valid = true
          if (vm.ksBgt) {
            if (key == 0 || key == 1 || key == 2 || key == 3 || key == 6) {
              arrAction.push(vm.$store.dispatch('submitVoting', vm.votingItems[key]))
            }
          } else {
            arrAction.push(vm.$store.dispatch('submitVoting', vm.votingItems[key]))
          }
        }
      }
      if (valid) {
        Promise.all(arrAction).then(results => {
          toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          vm.dialogVerify = false
          vm.createCaptcha()
          vm.captchaValue = ''
          vm.btnLoading = false
          vm.$store.dispatch('loadVoting', {
            className: 'survey',
            classPk: 0
          }).then(result => {
            vm.votingItems = result
            vm.totalAnswer = 0
            for (let i = 0; i < vm.votingItems.length; i++) {
              vm.totalAnswer += Number(vm.votingItems[i]['answersCount'])
              vm.getPercentItem(vm.votingItems[i], i)
            }
            // vm.getPercentTotal(vm.votingItems)
          }).catch( function () {
          })
        }).catch(xhr => {
          toastr.error('Yêu cầu của bạn thực hiện thất bại.')
          vm.btnLoading = false
        })
      } else {
        vm.btnLoading = false
        toastr.error('Bạn chưa chọn đánh giá nào')
      }
      
    },
    doVottingResultSubmitNew () {
      var vm = this
      vm.btnLoading = true
      let arrAction = []
      let valid = false
      for (var key in vm.votingItems) {
        vm.votingItems[key]['className'] = 'survey'
        if (String(vm.votingItems[key]['selected']) !== '0') {
          valid = true
          let indexChoice = vm.votingItems[key]['selected'] - 1
          // if (key == 0 || key == 1 || key == 2 || key == 3 || key == 6) {
            arrAction.push(vm.$store.dispatch('submitVotingNew', Object.assign(vm.votingItems[key]['choices'][indexChoice], {dossierNo: vm.dossierNo})))
          // }
        }
      }
      if (valid) {
        Promise.all(arrAction).then(results => {
          toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          vm.increCounter()
          vm.dialogVerify = false
          vm.createCaptcha()
          vm.captchaValue = ''
          vm.btnLoading = false
          vm.$store.dispatch('loadVotingNew', {
            className: 'survey'
          }).then(result => {
            vm.votingItems = result
            let sortVote = function (voteList) {
              function compare(a, b) {
                if (a.voteCode < b.voteCode)
                  return -1
                if (a.voteCode > b.voteCode)
                  return 1
                return 0
              }
              return voteList.sort(compare)
            }
            vm.votingItems = sortVote(vm.votingItems)
            vm.getReportAgency()
          }).catch( function () {
          })
        }).catch(xhr => {
          toastr.error('Yêu cầu của bạn thực hiện thất bại.')
          vm.btnLoading = false
        })
      } else {
        vm.btnLoading = false
        toastr.error('Bạn chưa chọn đánh giá nào')
      }
      
    },
    showVotingResult () {
      let vm = this
      vm.$store.dispatch('loadVoting', {
        className: 'survey',
        classPk: 0
      }).then(result => {
        vm.votingItems = result
        vm.dialog_voting_result = true
      }).catch(xhr => {
      })
    },
    getPercent (answers, index) {
      let totalVoted = 0
      let percent = 0
      for (var i = 0; i < answers.length; i++) {
        totalVoted += answers[i]
      }
      percent = ((answers[index] / totalVoted) * 100).toFixed(1)
      return percent
    },
    getPercentItem (votingItems, index) {
      let vm = this
      let votingPercent = []
      let lengthVotingAnswer = votingItems['answers'].length
      let totalScore = 0
      for (var i = lengthVotingAnswer - 1; i >= 0; i--) {
        totalScore += Number(votingItems['answers'][i]*(lengthVotingAnswer - i - 1))
        let indexAnswer = lengthVotingAnswer - i - 1
        let result = {
          name: 'Điểm ' + indexAnswer,
          count: Number(votingItems['answersCount']),
          percent: Number(((Number(votingItems['answers'][i]) / Number(votingItems['answersCount'])) * 100).toFixed(2))
        }
        votingPercent.push(result)
      }
      vm.votingItems[index]['answerPercent'] = votingPercent.reverse()
      vm.votingItems[index]['averageScore'] = (Number(totalScore) / Number(votingItems['answersCount'])).toFixed(2)
    },
    getPercentTotal (votingItems) {
      let vm = this
      if (votingItems && votingItems.length > 0) {
        let votingPercent = []
        let totalAnswer = 0
        for (var i = votingItems[0]['answers'].length - 1; i >= 0; i--) {
          // let result = {
          //   name: 'Điểm ' + (i + 1),
          //   count: 0,
          //   percent: 0
          // }
          let result = {
            name: 'Điểm ' + (i),
            count: 0,
            percent: 0
          }
          votingPercent.push(result)
        }
        for (var j = votingItems.length -1 ; j >= 0; j--) {
          totalAnswer += votingItems[j]['answersCount']
          let itemAnswer
          for (var k = votingItems[j]['answers'].length - 1; k >= 0; k--) {
            votingPercent[k]['count'] += votingItems[j]['answers'][k]
          }
        }
        // for (var i = votingPercent.length - 1; i >= 0; i--) {
        //   totalAnswer += votingPercent[i]['count']
        // }
        for (var i = votingPercent.length - 1; i >= 0; i--) {
          if (totalAnswer) {
            let percent = ((votingPercent[i]['count'] / totalAnswer) * 100).toFixed(0)
            votingPercent[i]['percent'] = percent
          } else {
            votingPercent[i]['percent'] = 0
          }
        }
        vm.totalAnswer = totalAnswer
        vm.resultTotal = votingPercent
        console.log('votingPercent', votingPercent)
      }
    },
    changeVoting () {
    },
    getQuarters () {
      let month = (new Date()).getMonth() + 1;
      return (Math.ceil(month / 3));
    },
    createCaptcha () {
      let vm = this
      document.getElementById('captcha').innerHTML = "";
      let charsArray = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#&*"
      let lengthOtp = 6
      let captcha = []
      for (var i = 0; i < lengthOtp; i++) {
        var index = Math.floor(Math.random() * charsArray.length + 1)
        if (captcha.indexOf(charsArray[index]) == -1)
          captcha.push(charsArray[index])
        else i--
      }
      let canv = document.createElement("canvas")
      canv.id = "captcha"
      canv.width = 150
      canv.height = 50
      let ctx = canv.getContext("2d")
      ctx.font = "32px Georgia"
      ctx.strokeText(captcha.join(""), 0, 30)
      vm.captchaCode = captcha.join("")
      document.getElementById("captcha").appendChild(canv)
    },
    createCaptcha () {
      let vm = this
      document.getElementById('captcha').innerHTML = "";
      let charsArray = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#&*"
      let lengthOtp = 6
      let captcha = []
      for (var i = 0; i < lengthOtp; i++) {
        var index = Math.floor(Math.random() * charsArray.length + 1)
        if (captcha.indexOf(charsArray[index]) == -1)
          captcha.push(charsArray[index])
        else i--
      }
      let canv = document.createElement("canvas")
      canv.id = "captcha"
      canv.width = 140
      canv.height = 42
      let ctx = canv.getContext("2d")
      ctx.font = "32px Georgia"
      ctx.strokeText(captcha.join(""), 0, 30)
      vm.captchaCode = captcha.join("")
      document.getElementById("captcha").appendChild(canv)
    },
    changeAgency () {
      let vm = this
      vm.loadingChangeAgency = true
      setTimeout(function () {
        vm.$store.dispatch('loadVotingResult', {
          govAgencyCode: vm.agency ? vm.agency['govAgencyCode'] : ''
        }).then(result => {
          vm.votingResult = []
          vm.votingItems.forEach(element => {
            let itemPoint = element
            if (result && result.length > 0) {
              let kq = result.filter(function (item) {
                return item.voteCode == element.voteCode
              })
              if (kq && kq.length > 0) {
                itemPoint['point'] = kq[0]['point']
              } else {
                itemPoint['point'] = 0
              }
            } else {
              itemPoint['point'] = 0
            }
            vm.votingResult.push(itemPoint)
          })
          vm.loadingChangeAgency = false
        }).catch(xhr => {
          vm.loadingChangeAgency = false
        })
      }, 500)
    },
    getReportAgency () {
      let vm = this
      vm.$store.dispatch('loadVotingResult', {
        govAgencyCode: ''
      }).then(function(result) {
        let voteStatistic = result
        let sortVote = function (voteList) {
          function compare(a, b) {
            if (a.voteCode < b.voteCode)
              return -1
            if (a.voteCode > b.voteCode)
              return 1
            return 0
          }
          return voteList.sort(compare)
        }
        voteStatistic = sortVote(voteStatistic)
        if (voteStatistic && voteStatistic.length) {
          let statistic = []
          voteStatistic.forEach(element => {
            let indexSt = statistic.findIndex(function(st) {
              return st.govAgencyCode == element.govAgencyCode
            })
            if (indexSt >= 0) {
              statistic[indexSt]['votings'].push(element)
            } else {
              let itemSt = {
                govAgencyCode: element.govAgencyCode,
                govAgencyName: element.govAgencyName,
                votings: [element]
              }
              statistic.push(itemSt)
            }
          })
          vm.statisticGovAgency = statistic
          console.log('statisticGovAgency', vm.statisticGovAgency)
        }
      }).catch(xhr => {
      })
    },
    validateCaptcha () {
      let vm = this
      if (vm.captchaValue == vm.captchaCode) {
        return true
      } else {
        toastr.error('Mã captcha không đúng. Vui lòng thử lại.')
        vm.createCaptcha()
        return false
      }
    }
  },
  filters: {
  }
}
</script>
