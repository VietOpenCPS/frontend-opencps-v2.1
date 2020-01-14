<template>
  <div>
    <div v-if="!isMobile">
      <v-card>
        <div class="row-header">
          <div class="background-triangle-big"> <span>CHI TIẾT THỦ TỤC HÀNH CHÍNH</span> </div>
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
          <v-layout class="wrap mt-3 ml-2">
            <div class="pb-2" style="width: 100px">
              <v-chip class="mx-0 my-0" small disabled label :color="getColor(serviceDetail.maxLevel)" text-color="white" style="height:px">
                Mức độ {{serviceDetail.maxLevel}}
              </v-chip>
            </div>
            <div style="width:calc(100% - 100px)">
              <span class="text-bold">{{serviceDetail.serviceName}}</span>
            </div>    
          </v-layout>
          <div class="mt-3">
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
                              <td width="200"><span class="text-bold">Mã thủ tục</span></td>
                              <td><span>{{serviceDetail.serviceCode}}</span></td>
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
                  <v-menu bottom right offset-y class="ml-2 my-2" style="display: inline-block;position:relative !important;"
                    v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length > 1"
                  >
                    <v-btn small slot="activator" color="primary" v-if="serviceDetail.maxLevel >= 3">Nộp hồ sơ &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                    <v-btn small slot="activator" color="primary" v-else>Hướng dẫn &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                    <v-list v-if="serviceDetail.serviceConfigs">
                      <v-list-tile v-for="(item2, index) in serviceConfigs(serviceDetail.serviceConfigs)" :key="index">
                        <v-list-tile-title v-if="item2.serviceLevel >= 3" @click="createDossier(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                        <v-list-tile-title v-else @click="viewGuide(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                  <v-btn small color="primary" class="mx-3 my-2" 
                    v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) > 2"
                    @click="createDossier(serviceConfigs(serviceDetail.serviceConfigs)[0])"
                  >
                    Nộp hồ sơ
                  </v-btn>
                  <v-btn small color="primary" class="mx-2 my-2" 
                    v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) <= 2"
                    @click="viewGuide(serviceConfigs(serviceDetail.serviceConfigs)[0])"
                  >
                    Hướng dẫn
                  </v-btn>
                </v-card>
              </v-tab-item>
              <v-tab-item key="2" transition="fade-transition" reverse-transition="fade-transition">
                <v-card>
                  <v-card-text>
                    <div v-html="serviceDetail.processText"></div>
                  </v-card-text>
                  <v-menu bottom right offset-y class="ml-2 mb-2" style="display: inline-block;position:relative !important;"
                    v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length > 1"
                  >
                    <v-btn small slot="activator" color="primary" v-if="serviceDetail.maxLevel >= 3">Nộp hồ sơ &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                    <v-btn small slot="activator" color="primary" v-else>Hướng dẫn &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                    <v-list v-if="serviceDetail.serviceConfigs">
                      <v-list-tile v-for="(item2, index) in serviceConfigs(serviceDetail.serviceConfigs)" :key="index">
                        <v-list-tile-title v-if="item2.serviceLevel >= 3" @click="createDossier(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                        <v-list-tile-title v-else @click="viewGuide(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                  <v-btn small color="primary" class="mx-3 my-2" 
                    v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) > 2"
                    @click="createDossier(serviceConfigs(serviceDetail.serviceConfigs)[0])"
                  >
                    Nộp hồ sơ
                  </v-btn>
                  <v-btn small color="primary" class="mx-2 my-2" 
                    v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) <= 2"
                    @click="viewGuide(serviceConfigs(serviceDetail.serviceConfigs)[0])"
                  >
                    Hướng dẫn
                  </v-btn>
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
                  <v-menu bottom right offset-y class="ml-2 mb-2" style="display: inline-block;position:relative !important;"
                    v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length > 1"
                  >
                    <v-btn small slot="activator" color="primary" v-if="serviceDetail.maxLevel >= 3">Nộp hồ sơ &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                    <v-btn small slot="activator" color="primary" v-else>Hướng dẫn &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                    <v-list v-if="serviceDetail.serviceConfigs">
                      <v-list-tile v-for="(item2, index) in serviceConfigs(serviceDetail.serviceConfigs)" :key="index">
                        <v-list-tile-title v-if="item2.serviceLevel >= 3" @click="createDossier(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                        <v-list-tile-title v-else @click="viewGuide(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                  <v-btn small color="primary" class="mx-3 my-2" 
                    v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) > 2"
                    @click="createDossier(serviceConfigs(serviceDetail.serviceConfigs)[0])"
                  >
                    Nộp hồ sơ
                  </v-btn>
                  <v-btn small color="primary" class="mx-2 my-2" 
                    v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) <= 2"
                    @click="viewGuide(serviceConfigs(serviceDetail.serviceConfigs)[0])"
                  >
                    Hướng dẫn
                  </v-btn>
                </v-card>
              </v-tab-item>
              <v-tab-item key="4" transition="fade-transition" reverse-transition="fade-transition">
                <v-card>
                  <v-card-text>
                    <div v-html="serviceDetail.conditionText"></div>
                  </v-card-text>
                  <v-menu bottom right offset-y class="ml-2 mb-2" style="display: inline-block;position:relative !important;"
                    v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length > 1"
                  >
                    <v-btn small slot="activator" color="primary" v-if="serviceDetail.maxLevel >= 3">Nộp hồ sơ &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                    <v-btn small slot="activator" color="primary" v-else>Hướng dẫn &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                    <v-list v-if="serviceDetail.serviceConfigs">
                      <v-list-tile v-for="(item2, index) in serviceConfigs(serviceDetail.serviceConfigs)" :key="index">
                        <v-list-tile-title v-if="item2.serviceLevel >= 3" @click="createDossier(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                        <v-list-tile-title v-else @click="viewGuide(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                  <v-btn small color="primary" class="mx-3 my-2" 
                    v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) > 2"
                    @click="createDossier(serviceConfigs(serviceDetail.serviceConfigs)[0])"
                  >
                    Nộp hồ sơ
                  </v-btn>
                  <v-btn small color="primary" class="mx-2 my-2" 
                    v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) <= 2"
                    @click="viewGuide(serviceConfigs(serviceDetail.serviceConfigs)[0])"
                  >
                    Hướng dẫn
                  </v-btn>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </div>
        </div>
      </v-card>
      <v-dialog scrollable v-model="dialogGuide" persistent max-width="600">
        <v-card>
          <v-card-title class="headline">Hướng dẫn nộp hồ sơ</v-card-title>
          <v-card-text v-if="serviceConfigDetail" style="max-height: 400px" v-html="serviceConfigDetail.serviceInstruction"></v-card-text>
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
        <div class="row-header" style="background-color: #070f52">
          <div class="ml-2 py-2 text-bold white--text"> <span>CHI TIẾT THỦ TỤC HÀNH CHÍNH</span> </div>
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
          <v-layout class="wrap mt-3 ml-2">
            <div class="pb-2" style="width: 100px">
              <v-chip class="mx-0 my-0" small disabled label :color="getColor(serviceDetail.maxLevel)" text-color="white" style="height:px">
                Mức độ {{serviceDetail.maxLevel}}
              </v-chip>
            </div>
            <div style="width:calc(100% - 100px)">
              <span class="text-bold">{{serviceDetail.serviceName}}</span>
            </div>    
          </v-layout>
          <div class="mt-3">
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
                              <td width="150"><span class="text-bold">Cơ quan quản lý</span></td>
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
                  <v-menu bottom right offset-y class="ml-2 my-2" style="display: inline-block;position:relative !important;"
                    v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length > 1"
                  >
                    <v-btn small slot="activator" color="primary" v-if="serviceDetail.maxLevel >= 3">Nộp hồ sơ &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                    <v-btn small slot="activator" color="primary" v-else>Xem hướng dẫn &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                    <v-list v-if="serviceDetail.serviceConfigs">
                      <v-list-tile v-for="(item2, index) in serviceConfigs(serviceDetail.serviceConfigs)" :key="index">
                        <v-list-tile-title v-if="item2.serviceLevel >= 3" @click="createDossier(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                        <v-list-tile-title v-else @click="viewGuide(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                  <v-btn small color="primary" class="mx-2 my-2" 
                    v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) > 2"
                    @click="createDossier(serviceConfigs(serviceDetail.serviceConfigs)[0])"
                  >
                    Nộp hồ sơ
                  </v-btn>
                  <v-btn small color="primary" class="mx-2 my-2" 
                    v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) <= 2"
                    @click="viewGuide(serviceConfigs(serviceDetail.serviceConfigs)[0])"
                  >
                    Xem hướng dẫn
                  </v-btn>
                </v-card>
              </v-tab-item>
              <v-tab-item key="2" transition="fade-transition" reverse-transition="fade-transition">
                <v-card>
                  <v-card-text>
                    <div v-html="serviceDetail.processText"></div>
                  </v-card-text>
                  <v-menu bottom right offset-y class="ml-2 mb-2" style="display: inline-block;position:relative !important;"
                    v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length > 1"
                  >
                    <v-btn small slot="activator" color="primary" v-if="serviceDetail.maxLevel >= 3">Nộp hồ sơ &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                    <v-btn small slot="activator" color="primary" v-else>Xem hướng dẫn &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                    <v-list v-if="serviceDetail.serviceConfigs">
                      <v-list-tile v-for="(item2, index) in serviceConfigs(serviceDetail.serviceConfigs)" :key="index">
                        <v-list-tile-title v-if="item2.serviceLevel >= 3" @click="createDossier(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                        <v-list-tile-title v-else @click="viewGuide(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                  <v-btn small color="primary" class="mx-2 my-2" 
                    v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) > 2"
                    @click="createDossier(serviceConfigs(serviceDetail.serviceConfigs)[0])"
                  >
                    Nộp hồ sơ
                  </v-btn>
                  <v-btn small color="primary" class="mx-2 my-2" 
                    v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) <= 2"
                    @click="viewGuide(serviceConfigs(serviceDetail.serviceConfigs)[0])"
                  >
                    Xem hướng dẫn
                  </v-btn>
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
                  <v-menu bottom right offset-y class="ml-2 mb-2" style="display: inline-block;position:relative !important;"
                    v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length > 1"
                  >
                    <v-btn small slot="activator" color="primary" v-if="serviceDetail.maxLevel >= 3">Nộp hồ sơ &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                    <v-btn small slot="activator" color="primary" v-else>Xem hướng dẫn &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                    <v-list v-if="serviceDetail.serviceConfigs">
                      <v-list-tile v-for="(item2, index) in serviceConfigs(serviceDetail.serviceConfigs)" :key="index">
                        <v-list-tile-title v-if="item2.serviceLevel >= 3" @click="createDossier(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                        <v-list-tile-title v-else @click="viewGuide(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                  <v-btn small color="primary" class="mx-2 my-2" 
                    v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) > 2"
                    @click="createDossier(serviceConfigs(serviceDetail.serviceConfigs)[0])"
                  >
                    Nộp hồ sơ
                  </v-btn>
                  <v-btn small color="primary" class="mx-2 my-2" 
                    v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) <= 2"
                    @click="viewGuide(serviceConfigs(serviceDetail.serviceConfigs)[0])"
                  >
                    Xem hướng dẫn
                  </v-btn>
                </v-card>
              </v-tab-item>
              <v-tab-item key="4" transition="fade-transition" reverse-transition="fade-transition">
                <v-card>
                  <v-card-text>
                    <div v-html="serviceDetail.conditionText"></div>
                  </v-card-text>
                  <v-menu bottom right offset-y class="ml-2 mb-2" style="display: inline-block;position:relative !important;"
                    v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length > 1"
                  >
                    <v-btn small slot="activator" color="primary" v-if="serviceDetail.maxLevel >= 3">Nộp hồ sơ &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                    <v-btn small slot="activator" color="primary" v-else>Xem hướng dẫn &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                    <v-list v-if="serviceDetail.serviceConfigs">
                      <v-list-tile v-for="(item2, index) in serviceConfigs(serviceDetail.serviceConfigs)" :key="index">
                        <v-list-tile-title v-if="item2.serviceLevel >= 3" @click="createDossier(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                        <v-list-tile-title v-else @click="viewGuide(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                  <v-btn small color="primary" class="mx-2 my-2" 
                    v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) > 2"
                    @click="createDossier(serviceConfigs(serviceDetail.serviceConfigs)[0])"
                  >
                    Nộp hồ sơ
                  </v-btn>
                  <v-btn small color="primary" class="mx-2 my-2" 
                    v-if="serviceDetail.serviceConfigs && serviceConfigs(serviceDetail.serviceConfigs).length === 1 && Number(serviceConfigs(serviceDetail.serviceConfigs)[0]['serviceLevel']) <= 2"
                    @click="viewGuide(serviceConfigs(serviceDetail.serviceConfigs)[0])"
                  >
                    Xem hướng dẫn
                  </v-btn>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </div>
        </div>
      </v-card>
      <v-dialog scrollable v-model="dialogGuide" persistent max-width="600">
        <v-card>
          <v-card-title class="headline">Hướng dẫn nộp hồ sơ</v-card-title>
          <v-card-text v-if="serviceConfigDetail" style="max-height: 400px" v-html="serviceConfigDetail.serviceInstruction"></v-card-text>
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
                <h3 class="white--text">ĐĂNG NHẬP</h3>
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
                <v-flex xs12 class="text-xs-left text-xs-center">
                  <v-btn class="ml-0 mr-1 my-0 white--text" color="#0b72ba"
                    :loading="loadingLogin"
                    :disabled="loadingLogin"
                    @click="submitConfirmLogin"
                  >
                    <v-icon>how_to_reg</v-icon>&nbsp;
                    Đăng nhập
                  </v-btn>
                  <v-btn class="ml-1 my-0 white--text" color="#0b72ba"
                    :loading="loadingLogin"
                    :disabled="loadingLogin"
                    @click="register"
                  >
                    <v-icon>create</v-icon>&nbsp;
                    Đăng ký
                  </v-btn>
                </v-flex>
                
              </v-form>
            </v-flex>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!--  -->
    <v-dialog class="my-0" v-model="dialog_loginDVCQG" max-width="1200px" style="width:100%;max-height: 100%;">
      <v-card>
        <v-card-text class="px-0 py-0">
          <iframe id="iframeLoginDVCQG" :src="tempDVCQG" style="
            width: 100%;
            height: 650px;
            border: none;
          "></iframe>
        </v-card-text>
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
    loading: true,
    loadingAction: false,
    loadingLogin: false,
    serviceDetail: '',
    serviceConfigDetail: '',
    active: null,
    dialogGuide: false,
    dialogVerifycation: false,
    dialog_loginDVCQG: false,
    dialogLogin: false,
    tempDVCQG: '',
    userName: '',
    passWord: '',
    valid: false,
    configUrl: {},
    isSigned: window.themeDisplay ? window.themeDisplay.isSignedIn() : false,
    doCreateDossier: false,
    serviceSelected: '',
    userInfoDvc: '',
    userInfoDvcqg: ''
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
    try {
      vm.configUrl = configSso 
    } catch (error) {
    }
    vm.$nextTick(function () {
      let current = vm.$router.history.current
      let query = vm.$router.history.current.query
      if (query.hasOwnProperty('vnconnect') && String(query['vnconnect']) === '1' && !window.themeDisplay.isSignedIn()) {
        window.callback_dvcqg = vm.callback_dvcqg
        vm.checkVNConect()
      }
      vm.loading = true
      let filter = {
        index: vm.index
      }
      vm.$store.dispatch('getServiceDetail', filter).then(function (result) {
        vm.serviceDetail = result
        vm.loading = false
      }).catch(function (reject) {
        vm.loading = false
      })
    })
  },
  mounted () {
    // let vm = this
    // let current = vm.$router.history.current
    // let query = vm.$router.history.current.query
    // if (query.hasOwnProperty('vnconnect') && String(query['vnconnect']) === '1' && String(window.themeDisplay.isSignedIn()) === 'false') {
    //   window.callback_dvcqg = vm.callback_dvcqg
    //   vm.checkVNConect()
    // }
  },
  watch: {
  },
  methods: {
    createDossier (item) {
      let vm = this
      vm.serviceSelected = item
      if (item.serviceUrl) {
        window.location.href = item.serviceUrl
      } else {
        let isSigned = window.themeDisplay ? window.themeDisplay.isSignedIn() : ''
        if (isSigned) {
          if (vm.userLoginInfomation && vm.userLoginInfomation['verification'] && String(vm.userLoginInfomation['verification']) === '2') {
            vm.dialogVerifycation = true
          } else {
            let redirectURL = window.themeDisplay.getLayoutRelativeURL().substring(0, window.themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
            let url = redirectURL + '/dich-vu-cong#/add-dvc/' + item.serviceConfigId
            window.open(url, '_self')
          }
        } else {
          alert('Vui lòng đăng nhập để nộp hồ sơ trực tuyến')
          // vm.doCreateDossier = true
          // vm.dialogLogin = true
        }
      }
    },
    submitConfirmLogin () {
      let vm = this
      let current = vm.$router.history.current
      let filter = {
        npmreactlogin_login: vm.userName,
        npmreactlogin_password: vm.passWord
      }
      if (vm.userName && vm.passWord) {
        vm.loadingLogin = true
        vm.$store.dispatch('goToDangNhap', filter).then(function(result) {
          vm.loadingLogin = false
          if (result === 'success') {
            vm.dialogLogin = false
            if (vm.doCreateDossier) {
              let redirectURL = window.location.host + window.themeDisplay.getLayoutRelativeURL().substring(0, window.themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
              let url = window.themeDisplay.getURLHome() + '/dich-vu-cong#/add-dvc/' + vm.serviceSelected.serviceConfigId
              setTimeout(() => {
                window.location.href = url
              }, 300)
            } else {
              // vm.doMappingDvcqg()
              let url = window.themeDisplay.getLayoutURL() + '/thu-tuc-hanh-chinh#' + current.path
              window.location.href = url
              setTimeout(() => {
                window.location.reload()
              }, 100)
            }
          }          
        }).catch(function(){
          vm.loadingLogin = false
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
    },
    downloadFileTemplate (item) {
      var vm = this
      let url = '/o/rest/v2/serviceinfos/' + vm.index + '/filetemplates/' + item.fileTemplateNo
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
      let filter = {
        state: 'auth'
      }
      setTimeout (function () {
        if (!vm.isSigned) {
          vm.$store.dispatch('getVNConect', filter).then(function (result) {
            if (result) {
              vm.dialog_loginDVCQG = true
              setTimeout(function () {
                vm.tempDVCQG = result
              }, 200)
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
    doMappingDvcqg () {
      let vm = this
      let current = vm.$router.history.current
      let query = vm.$router.history.current.query
      let filter = {
        userInfo: vm.userInfoDvc
      }
      vm.$store.dispatch('putVNConect', filter).then(function (result) {
      }).catch(function () {
      })
    },
    callback_dvcqg (data) {
      let vm = this
      // vm.userInfoDvc = data
      let current = vm.$router.history.current
      if (String(data['userId']) !== '0') {
        // let url = window.themeDisplay.getLayoutURL() + '/thu-tuc-hanh-chinh#' + current.path
        let url = window.themeDisplay.getLayoutURL() + '#' + current.path
        console.log('url', url)
        vm.dialog_loginDVCQG = false
        // window.location.href = url
        // alert('Đăng nhập thành công')
        // setTimeout(() => {
          window.open(url, '_self')
        // }, 100)
      } else {
        vm.dialog_loginDVCQG = false
        vm.doCreateDossier = false
        vm.dialogLogin = true
        vm.userInfoDvcqg = data
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
    }
  }
}
</script>
