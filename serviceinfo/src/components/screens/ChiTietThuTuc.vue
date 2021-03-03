<template>
  <div>
    <div v-if="!isMobile">
      <v-card>
        <div class="row-header">
          <div class="background-triangle-big"> <span>THÔNG TIN THỦ TỤC HÀNH CHÍNH</span> </div>
          <div class="layout row wrap header_tools row-blue">
            <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
              <v-btn flat class="my-0 mx-0 btn-border-left" @click="goBack" active-class="temp_active">
                <v-icon size="18">reply</v-icon> &nbsp; Quay lại
              </v-btn>
            </div>
          </div> 
        </div>
        <content-placeholders class="mt-3" v-if="loading">
          <content-placeholders-text :lines="10" />
        </content-placeholders>
        <div v-else>
          <div class="mt-3 ml-2">
            <p class="text-bold">{{serviceDetail.serviceName}}</p>
          </div>
          <div v-if="!setAgency && (!userLoginInfomation || !userLoginInfomation.hasOwnProperty('className') || (userLoginInfomation && userLoginInfomation.hasOwnProperty('className') &&  userLoginInfomation.className !== 'org.opencps.usermgt.model.Employee'))">
            <v-menu bottom right offset-y class="ml-2 my-2" style="display: inline-block;position:relative !important;"
              v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length > 1 && serviceConfigs(serviceDetail.serviceConfigs).length <= 5"
            >
              <v-btn small slot="activator" color="primary" v-if="serviceDetail.maxLevel >= 3">
                <span v-if="!formToKhai">{{titleNopHoSo ? titleNopHoSo : 'Nộp hồ sơ'}}</span>
                <span v-if="formToKhai">Tạo tờ khai</span> &nbsp; <v-icon size="18">arrow_drop_down</v-icon>
              </v-btn>
              <v-btn small slot="activator" color="primary" v-else>Hướng dẫn &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
              <v-list v-if="serviceDetail.serviceConfigs">
                <v-list-tile v-for="(item2, index) in serviceConfigs(serviceDetail.serviceConfigs)" :key="index" :class="item2.govAgencyCode+'-'+item2.serviceConfigId">
                  <v-list-tile-title v-if="item2.serviceLevel >= 3" @click="createDossier(item2)" >{{item2.govAgencyName}}</v-list-tile-title>
                  <v-list-tile-title v-else @click="viewGuide(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
            <v-btn class="mx-2 my-2" small color="primary" 
              v-if="serviceDetail.maxLevel >= 3 && serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length > 5"
              @click="showSelectGov(serviceDetail.serviceConfigs)"
            >
              <span v-if="!formToKhai">{{titleNopHoSo ? titleNopHoSo : 'Nộp hồ sơ'}}</span>
              <span v-else>Tạo tờ khai</span>
            </v-btn>
            <v-btn small color="primary" class="mx-2 my-2" style="min-width: 110px;"
              v-if="serviceDetail.maxLevel < 3 && serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length > 5"
              @click="showSelectGov(serviceDetail.serviceConfigs, 'guide')"
            >
              Hướng dẫn
            </v-btn>
            <v-btn small color="primary" class="mx-3 my-2" 
              v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) > 2"
              @click="createDossier(serviceConfigs(serviceDetail.serviceConfigs)[0])"
            >
              <span v-if="!formToKhai">{{titleNopHoSo ? titleNopHoSo : 'Nộp hồ sơ'}}</span>
              <span v-else>Tạo tờ khai</span>
            </v-btn>
            <v-btn small color="primary" class="mx-2 my-2" 
              v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 
                && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) <= 2 && !formToKhai"
              @click="viewGuide(serviceConfigs(serviceDetail.serviceConfigs)[0])"
            >
              Hướng dẫn
            </v-btn>
            <v-btn small color="primary" class="mx-2 my-2" 
              v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 
                && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) <= 2 && formToKhai"
              @click="createDossier(serviceConfigs(serviceDetail.serviceConfigs)[0])"
            >
              Tạo tờ khai
            </v-btn>
          </div>  
          <div class="mt-1">
            <v-tabs
              icons-and-text
              v-model="active"
            >
              <v-tabs-slider color="primary"></v-tabs-slider>
              <v-tab :key="1" ripple class="mr-2"> Thông tin chung </v-tab>
              <v-tab :key="2" ripple class="mr-2"> Trình tự thực hiện</v-tab>
              <v-tab :key="3" ripple class="mr-2"> Thành phần hồ sơ </v-tab>
              <v-tab :key="4" ripple class="mr-2"> Yêu cầu điều kiện </v-tab>
              <!--  -->
              <v-tab-item :key="1" transition="fade-transition" reverse-transition="fade-transition">
                <v-card>
                  <v-card-text class="px-0 py-0">
                    <div class="table-detail-domain table-bordered">
                      <div class="table__overflow">
                        <table class="datatable table">
                          <tbody>
                            <tr>
                              <td width="200"><span class="text-bold">Mã thủ tục</span></td>
                              <td><span>{{serviceDetail.serviceCodeDVCQG ? serviceDetail.serviceCodeDVCQG : serviceDetail.serviceCode}}</span></td>
                            </tr>
                            <tr>
                              <td width="200"><span class="text-bold">Mức độ</span></td>
                              <td>
                                <div>
                                  <v-chip class="mx-0 my-0" small disabled label :color="getColor(serviceDetail.maxLevel)" text-color="white" style="height:px">
                                    Mức độ {{serviceDetail.maxLevel}}
                                  </v-chip>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td width="200"><span class="text-bold">Cơ quan quản lý</span></td>
                              <td><span>{{serviceDetail.administrationName}}</span></td>
                            </tr>
                            <tr>
                              <td><span class="text-bold">Lĩnh vực</span></td>
                              <td><span>{{serviceDetail.domainName}}</span></td>
                            </tr>
                            <tr>
                              <td><span class="text-bold">Cách thực hiện</span></td>
                              <td><span v-html="serviceDetail.methodText"></span></td>
                            </tr>
                            <tr>
                              <td><span class="text-bold">Thời gian giải quyết</span></td>
                              <td><span v-html="serviceDetail.durationText"></span></td>
                            </tr>
                            <tr>
                              <td><span class="text-bold">Đối tượng</span></td>
                              <td><span v-html="serviceDetail.applicantText"></span></td>
                            </tr>
                            <tr>
                              <td><span class="text-bold">Kết quả giải quyết</span></td>
                              <td><span v-html="serviceDetail.resultText"></span></td>
                            </tr>
                            <tr>
                              <td><span class="text-bold">Lệ phí</span></td>
                              <td><span v-html="serviceDetail.feeText"></span></td>
                            </tr>
                            <tr>
                              <td><span class="text-bold">Căn cứ pháp lý</span></td>
                              <td><span v-html="serviceDetail.regularText"></span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item :key="2" transition="fade-transition" reverse-transition="fade-transition">
                <v-card>
                  <v-card-text>
                    <div v-html="serviceDetail.processText"></div>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item :key="3" transition="fade-transition" reverse-transition="fade-transition">
                <v-card>
                  <v-card-text>
                    <div v-html="serviceDetail.dossierText" class="mb-2"></div>
                    <!-- tải file biểu mẫu -->
                    <div v-if="serviceDetail.fileTemplates && fileTemplate(serviceDetail.fileTemplates)">
                      <div class="text-bold mb-2">File biểu mẫu</div>
                      <div v-for="item in fileTemplate(serviceDetail.fileTemplates)" :key="item.fileTemplateNo" class="hover-pointer mb-1">
                        <span v-on:click.stop="downloadFileTemplate(item)" slot="activator">
                          <v-icon style="color: #0d71bb;" size="16" color="primary">save_alt</v-icon>
                          <span class="pl-2 text-bold">{{item.templateName}}</span>
                        </span>
                      </div>
                    </div>
                  </v-card-text>                 
                </v-card>
              </v-tab-item>
              <v-tab-item :key="4" transition="fade-transition" reverse-transition="fade-transition">
                <v-card>
                  <v-card-text>
                    <div v-html="serviceDetail.conditionText"></div>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </div>
        </div>
      </v-card>
      <v-dialog scrollable v-model="dialogGuide" persistent max-width="600">
        <v-card>
          <v-card-title class="headline">Hướng dẫn nộp hồ sơ</v-card-title>
          <v-card-text v-if="serviceConfigDetail" style="max-height: 400px">
            <div  v-html="serviceConfigDetail.serviceInstruction"></div>
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
    <div v-else>
      <v-card>
        <div class="row-header" style="background-color: #0054a6">
          <div class="ml-2 py-2 text-bold white--text"> <span>THÔNG TIN THỦ TỤC HÀNH CHÍNH</span> </div>
          <div class="layout row wrap header_tools row-blue">
            <div class="flex text-right" style="margin-left: auto;">
              <v-btn flat class="my-0 mx-0 btn-border-left white--text" @click="goBack" active-class="temp_active">
                <v-icon size="18">reply</v-icon> &nbsp; Quay lại
              </v-btn>
            </div>
          </div> 
        </div>
        <content-placeholders class="mt-3" v-if="loading">
          <content-placeholders-text :lines="10" />
        </content-placeholders>
        <div v-else>
          <div class="mt-2 mx-1">
            <p class="text-bold" style="text-align: justify;">{{serviceDetail.serviceName}}</p>
          </div>
          <div v-if="!setAgency && (!userLoginInfomation || !userLoginInfomation.hasOwnProperty('className') || (userLoginInfomation && userLoginInfomation.hasOwnProperty('className') &&  userLoginInfomation.className !== 'org.opencps.usermgt.model.Employee'))">
            <v-menu bottom right offset-y class="ml-2 my-2" style="display: inline-block;position:relative !important;"
              v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length > 1 && serviceConfigs(serviceDetail.serviceConfigs).length <= 5"
            >
              <v-btn small slot="activator" color="primary" v-if="serviceDetail.maxLevel >= 3">
                <span v-if="!formToKhai">{{titleNopHoSo ? titleNopHoSo : 'Nộp hồ sơ'}}</span>
                <span v-if="formToKhai">Tạo tờ khai</span> &nbsp; <v-icon size="18">arrow_drop_down</v-icon>
              </v-btn>
              <v-btn small slot="activator" color="primary" v-else>Hướng dẫn &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
              <v-list v-if="serviceDetail.serviceConfigs">
                <v-list-tile v-for="(item2, index) in serviceConfigs(serviceDetail.serviceConfigs)" :key="index" :class="item2.govAgencyCode+'-'+item2.serviceConfigId">
                  <v-list-tile-title v-if="item2.serviceLevel >= 3" @click="createDossier(item2)" >{{item2.govAgencyName}}</v-list-tile-title>
                  <v-list-tile-title v-else @click="viewGuide(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
            <v-btn class="mx-2 my-2" small color="primary" 
              v-if="serviceDetail.maxLevel >= 3 && serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length > 5"
              @click="showSelectGov(serviceDetail.serviceConfigs)"
            >
              <span v-if="!formToKhai">{{titleNopHoSo ? titleNopHoSo : 'Nộp hồ sơ'}}</span>
              <span v-else>Tạo tờ khai</span>
            </v-btn>
            <v-btn small color="primary" class="mx-2 my-2" style="min-width: 110px;"
              v-if="serviceDetail.maxLevel < 3 && serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length > 5"
              @click="showSelectGov(serviceDetail.serviceConfigs, 'guide')"
            >
              Hướng dẫn
            </v-btn>
            <v-btn small color="primary" class="mx-3 my-2" 
              v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) > 2"
              @click="createDossier(serviceConfigs(serviceDetail.serviceConfigs)[0])"
            >
              <span v-if="!formToKhai">{{titleNopHoSo ? titleNopHoSo : 'Nộp hồ sơ'}}</span>
              <span v-else>Tạo tờ khai</span>
            </v-btn>
            <v-btn small color="primary" class="mx-2 my-2" 
              v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 
                && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) <= 2 && !formToKhai"
              @click="viewGuide(serviceConfigs(serviceDetail.serviceConfigs)[0])"
            >
              Hướng dẫn
            </v-btn>
            <v-btn small color="primary" class="mx-2 my-2" 
              v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 
                && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) <= 2 && formToKhai"
              @click="createDossier(serviceConfigs(serviceDetail.serviceConfigs)[0])"
            >
              Tạo tờ khai
            </v-btn>
          </div> 
          <!--  -->
          <div :class="!isMobile ? 'mt-3' : 'mt-2'">
            <v-tabs
              icons-and-text
              v-model="active"
            >
              <v-tabs-slider color="primary"></v-tabs-slider>
              <v-tab key="1" ripple class="mr-2"> Thông tin chung </v-tab>
              <v-tab key="2" ripple class="mr-2"> Trình tự thực hiện</v-tab>
              <v-tab key="3" ripple class="mr-2"> Thành phần hồ sơ </v-tab>
              <v-tab key="4" ripple class="mr-2"> Yêu cầu điều kiện </v-tab>
              <!--  -->
              <v-tab-item key="1" transition="fade-transition" reverse-transition="fade-transition">
                <v-card>
                  <v-card-text class="px-0 py-0">
                    <div class="table-detail-domain table-bordered">
                      <div class="table__overflow">
                        <table class="datatable table">
                          <tbody>
                            <tr>
                              <td width="130" class="px-1"><span class="text-bold">Mã thủ tục</span></td>
                              <td class="px-1"><span>{{serviceDetail.serviceCodeDVCQG ? serviceDetail.serviceCodeDVCQG : serviceDetail.serviceCode}}</span></td>
                            </tr>
                            <tr>
                              <td><span class="text-bold">Mức độ</span></td>
                              <td>
                                <div>
                                  <v-chip class="mx-0 my-0" small disabled label :color="getColor(serviceDetail.maxLevel)" text-color="white" style="height:px">
                                    Mức độ {{serviceDetail.maxLevel}}
                                  </v-chip>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td class="px-1"><span class="text-bold">Cơ quan quản lý</span></td>
                              <td class="px-1"><span>{{serviceDetail.administrationName}}</span></td>
                            </tr>
                            <tr>
                              <td class="px-1"><span class="text-bold">Lĩnh vực</span></td>
                              <td class="px-1"><span>{{serviceDetail.domainName}}</span></td>
                            </tr>
                            <tr>
                              <td class="px-1"><span class="text-bold">Cách thực hiện</span></td>
                              <td class="px-1"><span v-html="serviceDetail.methodText"></span></td>
                            </tr>
                            <tr>
                              <td class="px-1"><span class="text-bold">Thời gian giải quyết</span></td>
                              <td class="px-1"><span v-html="serviceDetail.durationText"></span></td>
                            </tr>
                            <tr>
                              <td class="px-1"><span class="text-bold">Đối tượng</span></td>
                              <td class="px-1"><span v-html="serviceDetail.applicantText"></span></td>
                            </tr>
                            <tr>
                              <td class="px-1"><span class="text-bold">Kết quả giải quyết</span></td>
                              <td class="px-1"><span v-html="serviceDetail.resultText"></span></td>
                            </tr>
                            <tr>
                              <td class="px-1"><span class="text-bold">Lệ phí</span></td>
                              <td class="px-1"><span v-html="serviceDetail.feeText"></span></td>
                            </tr>
                            <tr>
                              <td class="px-1"><span class="text-bold">Căn cứ pháp lý</span></td>
                              <td class="px-1"><span v-html="serviceDetail.regularText"></span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item key="2" transition="fade-transition" reverse-transition="fade-transition">
                <v-card>
                  <v-card-text>
                    <div v-html="serviceDetail.processText"></div>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item key="3" transition="fade-transition" reverse-transition="fade-transition">
                <v-card>
                  <v-card-text>
                    <div v-html="serviceDetail.dossierText" class="mb-2"></div>
                    <!-- tải file biểu mẫu -->
                    <div v-if="serviceDetail.fileTemplates && fileTemplate(serviceDetail.fileTemplates)">
                      <div class="text-bold mb-2">File biểu mẫu</div>
                      <div v-for="item in fileTemplate(serviceDetail.fileTemplates)" :key="item.fileTemplateNo" class="hover-pointer mb-1">
                        <span v-on:click.stop="downloadFileTemplate(item)" slot="activator">
                          <v-icon style="color: #0d71bb;" size="16" color="primary">save_alt</v-icon>
                          <span class="pl-2 text-bold">{{item.templateName}}</span>
                        </span>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item key="4" transition="fade-transition" reverse-transition="fade-transition">
                <v-card>
                  <v-card-text>
                    <div v-html="serviceDetail.conditionText"></div>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </div>
        </div>
      </v-card>
      <v-dialog scrollable v-model="dialogGuide" persistent max-width="600">
        <v-card>
          <v-card-title class="headline">Hướng dẫn nộp hồ sơ</v-card-title>
          <v-card-text v-if="serviceConfigDetail" style="max-height: 400px">
            <div  v-html="serviceConfigDetail.serviceInstruction"></div>
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

                <v-btn class="white--text" @click="dialogLoginDvcqg = false" color="primary">
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
    <v-dialog class="my-0" v-model="dialog_loginDVCQG" max-width="1200px" style="width:100%;max-height: 100%;">
      <v-card>
        <v-card-text class="px-0 py-0">

        </v-card-text>
      </v-card>
    </v-dialog>
    <!--  -->
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
        <v-card-actions class="mx-2">
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
import toastr from 'toastr'
import $ from 'jquery'
Vue.use(toastr)
export default {
  props: ['index'],
  components: {},
  data: () => ({
    formToKhai: false,
    templateFormList: '',
    dialog_selectTemplateEform: false,
    validFormSelectTemplateEform: false,
    templateFormSelected: '',
    serviceInfoSelected: '',
    dialog_selectAgency: false,
    validFormSelectGov: false,
    govAgencyListTiepNhan: [],
    govAgencyListTiepNhanFilters: [],
    govAgencyTiepNhanSelected: '',
    loading: true,
    loadingAction: false,
    loadingLogin: false,
    serviceDetail: '',
    serviceConfigDetail: '',
    active: null,
    dialogGuide: false,
    dialogVerifycation: false,
    dialog_loginDVCQG: false,
    dialogLoginDvcqg: false,
    dialogLogin: false,
    tempDVCQG: '',
    userName: '',
    passWord: '',
    valid: false,
    configUrl: {},
    isSigned: window.themeDisplay ? window.themeDisplay.isSignedIn() : false,
    doCreateDossier: false,
    serviceSelected: '',
    isLogin: false,
    verificationApplicantCreateDossier: false,
    userInfoDvc: '',
    userInfoDvcqg: '',
    mapping: false,
    dataMapping: '',
    captcha: false,
    j_captcha_response: '',
    chapchablob: '',
    onlyLoginDvcqg: false,
    titleNopHoSo: '',
    setAgency: false,
    luaChonXaPhuong: false,
    danhSachQuanHuyen: [],
    quanHuyen: ''
  }),
  computed: {
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
    vm.makeImageCap()
    // 
    vm.$nextTick(function () {
      let current = vm.$router.history.current
      let query = vm.$router.history.current.query
      if (query.hasOwnProperty('active')) {
        vm.active = Number(query.active)
      }
      if (query.hasOwnProperty('setAgency')) {
        vm.setAgency = true
      }
      if (query.hasOwnProperty('vnconnect') && String(query['vnconnect']) === '1' && !window.themeDisplay.isSignedIn()) {
        // window.callback_dvcqg = vm.callback_dvcqg
        vm.checkVNConect()
      }
      // Auto redirect create dossier
      if (query.hasOwnProperty('serviceCreate') && query.serviceCreate && window.themeDisplay.isSignedIn()) {
        let redirectURL = window.themeDisplay.getLayoutRelativeURL().substring(0, window.themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
        let url = redirectURL + '/dich-vu-cong#/add-dvc/' + query.serviceCreate
        window.open(url, '_self')
      }
      // 
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
      vm.loading = true
      let filter = {
        index: vm.index
      }
      vm.$store.dispatch('getServiceDetail', filter).then(function (result) {
        vm.serviceDetail = result
        if (!query.hasOwnProperty('notCreate') && (query.hasOwnProperty('code') && query.code) || (query.hasOwnProperty('MaTTHCDP') && query.MaTTHCDP)) {
          if (window.themeDisplay.isSignedIn()) {
            let redirectURL = window.themeDisplay.getLayoutRelativeURL().substring(0, window.themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
            if (Array.isArray(vm.serviceDetail['serviceConfigs']) && vm.serviceDetail['serviceConfigs'].length === 1) {
              let url = redirectURL + '/dich-vu-cong#/add-dvc/' + vm.serviceDetail['serviceConfigs'][0]['serviceConfigId']
              window.open(url, '_self')
            } else if (!Array.isArray(vm.serviceDetail['serviceConfigs'])) {
              let url = redirectURL + '/dich-vu-cong#/add-dvc/' + vm.serviceDetail['serviceConfigs']['serviceConfigId']
              window.open(url, '_self')
            } else {
              vm.showSelectGov(vm.serviceDetail['serviceConfigs'])
            }
          }
        }
        if (query.hasOwnProperty('code') && query.code) {
          vm.serviceDetail.serviceCodeDVCQG = query.code
        }
        if (query.hasOwnProperty('MaTTHCDP') && query.MaTTHCDP) {
          vm.serviceDetail.serviceCodeDVCQG = query.MaTTHCDP
        }
        vm.trackingBTTT(vm.serviceDetail.serviceCode)
        vm.loading = false
      }).catch(function (reject) {
        vm.loading = false
      })
    })
  },
  mounted () {
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
      if (currentQuery.hasOwnProperty('setAgency')) {
        vm.setAgency = true
      }
    }
  },
  methods: {
    createDossier (item) {
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
              vm.dialogLoginDvcqg = true
            }
          }
        } else {
          // vm.trackingBTTT(vm.serviceDetail.serviceCode)
          let filterSearch = {
            serviceInfoId: vm.serviceDetail.serviceInfoId
          }
          vm.$store.dispatch('getFileTemplateEform', filterSearch).then(function (result) {
            if (result.data) {
              vm.templateFormList = result.data
              if (vm.templateFormList.length > 1) {
                vm.dialog_selectTemplateEform = true
              } else {
                let url = window.themeDisplay.getSiteAdminURL().split('/~')[0].replace('group','web') + '/to-khai-truc-tuyen#/thong-tin-to-khai?service='+ vm.serviceDetail.serviceInfoId + '&template=' + vm.templateFormList[0].fileTemplateNo
                window.location.href = url
              }
            }
          }).catch(function () {
          })
        }
        
      }
    },
    submitSelectTemplateForm () {
      let vm = this
      if (vm.$refs.formSelectEform.validate()) {
        let url = window.themeDisplay.getSiteAdminURL().split('/~')[0].replace('group','web') + '/to-khai-truc-tuyen#/thong-tin-to-khai?service='+ vm.serviceDetail.serviceInfoId + '&template=' + vm.templateFormSelected.fileTemplateNo
        window.location.href = url
      }
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
              // if ( typeof(Storage) !== 'undefined') {
              //   sessionStorage.setItem('sync','true')
              // }
              // let url = window.themeDisplay.getLayoutURL() + '/thu-tuc-hanh-chinh#' + current.path
              // window.location.href = url
              // setTimeout(() => {
              //   window.location.reload()
              // }, 100)
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
    viewGuide (item) {
      var vm = this
      vm.serviceConfigDetail = item
      vm.dialogGuide = true
      // vm.trackingBTTT(vm.serviceDetail.serviceCode)
    },
    viewTphs () {
      let vm = this
      vm.active = 2
      vm.dialogGuide = false
    },
    downloadFileTemplate (item) {
      var vm = this
      let url = '/o/rest/v2/serviceinfos/' + vm.serviceDetail.serviceInfoId + '/filetemplates/' + item.fileTemplateNo
      window.open(url)
    },
    fileTemplate (fileData) {
      if (Array.isArray(fileData)) {
        return fileData
      } else {
        if (fileData.hasOwnProperty('fileTemplateNo')) {
          return [fileData]
        } else {
          return false
        }
      }
    },
    showSelectGov (govList, guide) {
      let vm = this
      vm.govAgencyTiepNhanSelected = ''
      vm.selectGuide = guide ? true : false
      vm.govAgencyListTiepNhan = vm.serviceConfigs(govList)
      vm.govAgencyListTiepNhanFilters = vm.govAgencyListTiepNhan
      if (vm.serviceDetail.administrationCode === 'CAP_XA') {
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
          vm.createDossier(vm.govAgencyTiepNhanSelected)
        }
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
    checkVNConect () {
      let vm = this
      let current = vm.$router.history.current
      let query = vm.$router.history.current.query
      let codeDvcqg = ''
      if (query.hasOwnProperty('code') && query.code) {
        codeDvcqg = query.code
      }
      if (query.hasOwnProperty('MaTTHCDP') && query.MaTTHCDP) {
        codeDvcqg = query.MaTTHCDP
      }
      let filter = {
        state: '',
        redirectURL: codeDvcqg ? window.location.href.split("?")[0] + '?code=' +  codeDvcqg : window.location.href.split("?")[0]
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
    makeImageCap () {
      var vm = this
      vm.chapchablob = ''
      vm.$store.dispatch('makeImageCapLogin').then(function (result) {
        vm.chapchablob = result
      }).catch(function (reject) {
        vm.chapchablob = ''
      })
    },
    checkOnlyLoginDvcqg () {
      let vm = this
      let current = vm.$router.history.current
      let query = vm.$router.history.current.query
      let codeDvcqg = ''
      if (query.hasOwnProperty('code') && query.code) {
        codeDvcqg = query.code
      }
      if (query.hasOwnProperty('MaTTHCDP') && query.MaTTHCDP) {
        codeDvcqg = query.MaTTHCDP
      }
      let filter = {
        state: '',
        redirectURL: codeDvcqg ? window.location.href.split("?")[0] + '?code=' +  codeDvcqg + '&serviceCreate=' + vm.serviceSelected.serviceConfigId : window.location.href.split("?")[0] + '?serviceCreate=' + vm.serviceSelected.serviceConfigId
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
          console.log('url', url)
          vm.dialog_loginDVCQG = false
          window.location.href = url
          window.location.reload()
        } else {
          vm.dialog_loginDVCQG = false
          vm.doCreateDossier = false
          vm.dialogLogin = true
          vm.userInfoDvcqg = data
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
        return 'orange'
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
