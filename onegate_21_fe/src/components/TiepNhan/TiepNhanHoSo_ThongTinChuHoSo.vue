<template>
  <div>
    <v-form v-model="valid_thongtinchuhoso" ref="formChuHoSo" lazy-validation>
      <div>
        <div style="position: relative;">
          <v-expansion-panel :value="[true]" expand  class="expansion-pl" v-if="!showApplicant">
            <v-expansion-panel-content>
              <div slot="header"> <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div> Thông tin chủ hồ sơ</div>
              <v-card>
                <v-tooltip left v-if="(thongTinChuHoSo.userType === '2' || (originality === 1 && thongTinChuHoSo.applicantIdType === 'business')) && bussinessExits"
                style="position:absolute;right:5px;z-index:101"
                >
                  <v-btn slot="activator" class="my-0 mt-1" fab icon small dark color="primary" @click.native="getApplicantInfos()" style="width:32px!important;height:32px!important">
                    <v-icon dark>account_balance</v-icon>
                  </v-btn>
                  <span>Đối chiếu thông tin doanh nghiệp</span>
                </v-tooltip>
                <v-card-text class="pt-3">
                  <v-layout wrap>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0"> {{ labelSwitch[thongTinChuHoSo.userType].cmtnd }} <span v-if="requiredOptions['applicantIdNo']" style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm2 style="position:relative">
                      <v-text-field
                        v-if="originality === 1 || originality === '1'"
                        v-model="thongTinChuHoSo.applicantIdNo"
                        @input="changeApplicantInfos"
                        :disabled="loadingVerify"
                        :rules="[rules.required, rules.varchar100]"
                        required
                        readonly
                        @change="thongTinChuHoSo.applicantIdNo=thongTinChuHoSo.applicantIdNo.trim()"
                      ></v-text-field>
                      <suggestions
                        v-if="originality === 3 || originality === '3'"
                        v-model="thongTinChuHoSo.applicantIdNo"
                        :options="searchOptions"
                        :onItemSelected="onSearchItemSelected"
                        :onInputChange="onInputChange"
                        :class="loadingVerify ? 'input-group--disabled' : ''"
                        :style="loadingVerify ? 'color:#00000061' : ''"
                        >
                        <div slot="item" slot-scope="props" class="single-item">
                          <v-list-tile-content>
                            <v-list-tile-title v-html="props.item.applicantName"></v-list-tile-title>
                            <v-list-tile-sub-title v-html="props.item.applicantIdNo"></v-list-tile-sub-title>
                          </v-list-tile-content>
                        </div>
                      </suggestions>
                      <span style="color:#ff5252;font-size: 12px;" v-if="(originality === 3 || originality === '3') && applicantIdRequired">Thông tin bắt buộc</span>
                      <v-tooltip top v-if="(originality === 3 || originality === '3') && applicantConfig">
                        <v-btn @click="showDialogApplicantList('ChuHoSo')" slot="activator" class="mx-0 my-0" flat icon color="primary" style="position: absolute;top:0;right:-5px">
                          <v-icon size="14">fas fa fa-address-card</v-icon>
                        </v-btn>
                        <span>Danh sách công dân, tổ chức, doanh nghiệp</span>
                      </v-tooltip>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0"> {{ labelSwitch[thongTinChuHoSo.userType].nguoi_nop }}<span v-if="requiredOptions['applicantName']" style="color:red"> &nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-text-field
                        v-else
                        v-model="thongTinChuHoSo.applicantName"
                        @input="changeApplicantInfos"
                        @change="thongTinChuHoSo.applicantName=thongTinChuHoSo.applicantName.trim()"
                        :disabled="loadingVerify"
                        :rules="requiredOptions['applicantName'] ? [rules.required,rules.varchar500] : ''"
                        :required="requiredOptions['applicantName']"
                        :readonly="originality === 1 || originality === '1'"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Địa chỉ <span v-if="requiredOptions['address']" style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm10>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-textarea
                      v-else
                      v-model="thongTinChuHoSo.address"
                      rows="2"
                      :rules="requiredOptions['address'] ? [rules.required,rules.varchar500] : ''"
                      :required="requiredOptions['address']"
                      ></v-textarea>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Tỉnh/Thành phố <span v-if="requiredOptions['cityCode']" style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-autocomplete
                      v-else
                      :items="citys"
                      item-text="itemName"
                      item-value="itemCode"
                      v-model="thongTinChuHoSo.cityCode"
                      @change="onChangeCity"
                      :rules="requiredOptions['cityCode'] ? [rules.required] : ''"
                      :required="requiredOptions['cityCode']"
                      ></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Quận/Huyện <span v-if="requiredOptions['districtCode']" style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-autocomplete
                      v-else
                      :items="districts"
                      item-text="itemName"
                      item-value="itemCode"
                      v-model="thongTinChuHoSo.districtCode"
                      @change="onChangeDistrict"
                      :rules="requiredOptions['districtCode'] ? [rules.required] : ''"
                      :required="requiredOptions['districtCode']"
                      ></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Xã/Phường <span v-if="requiredOptions['wardCode']" style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-autocomplete
                      v-else
                      :items="wards"
                      item-text="itemName"
                      item-value="itemCode"
                      v-model="thongTinChuHoSo.wardCode"
                      @change="onChangeWard"
                      :rules="requiredOptions['wardCode'] ? [rules.required] : ''"
                      :required="requiredOptions['wardCode']"
                      ></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Số điện thoại <span v-if="requiredOptions['contactTelNo']" style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-text-field
                      v-else
                      v-model="thongTinChuHoSo.contactTelNo"
                      @change="thongTinChuHoSo.contactTelNo=thongTinChuHoSo.contactTelNo.trim()"
                      append-icon="phone"
                      :rules="requiredOptions['contactTelNo'] ? [rules.telNo, rules.required] : [rules.telNo]"
                      :required="requiredOptions['contactTelNo']"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Địa chỉ email <span v-if="requiredOptions['contactEmail']" style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-text-field
                      v-else
                      v-model="thongTinChuHoSo.contactEmail"
                       @change="thongTinChuHoSo.contactEmail=thongTinChuHoSo.contactEmail.trim()"
                      :rules="requiredOptions['contactEmail'] ? [rules.email, rules.required, rules.varchar100] : (thongTinChuHoSo.contactEmail ? [rules.email, rules.varchar100] : '')"
                      :required="requiredOptions['contactEmail']"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <div class="absolute__btn" :style="hasOrganization ? 'width: 420px;' : 'width: 350px;'" v-if="originality !== 1">
            <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-radio-group class="mt-2" v-if="!loading && !hasOrganization" v-model="thongTinChuHoSo.userType" row @change="checkApplicantInfos">
              <v-radio label="Công dân" :value="'1'"></v-radio>
              <v-radio label="Tổ chức, doanh nghiệp" :value="'2'"></v-radio>
            </v-radio-group>
            <v-radio-group class="mt-2" v-if="!loading && hasOrganization" v-model="thongTinChuHoSo.userType" row @change="checkApplicantInfos">
              <v-radio label="Công dân" :value="'1'"></v-radio>
              <v-radio label="Doanh nghiệp" :value="'2'"></v-radio>
              <v-radio label="Cơ quan, tổ chức" :value="'3'"></v-radio>
            </v-radio-group>
          </div>
          <div style="position: relative;" v-if="originality !== 1  && !showDelegate">
            <v-expansion-panel :value="[true]" expand  class="expansion-pl">
              <v-expansion-panel-content>
                <div slot="header"> <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div> Thông tin người nộp hồ sơ</div>
                <v-card>
                  <v-card-text>
                    <v-layout wrap>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-subheader v-else class="pl-0">CMND/Hộ chiếu <span v-if="requiredOptions['delegateIdNo']" style="color:red">&nbsp;*</span>: </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm2 style="position:relative">
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-text-field
                          v-if="originality === 1 || originality === '1'"
                          v-model="thongTinNguoiNopHoSo.delegateIdNo"
                          :rules="[rules.required, rules.varchar100]"
                          required
                          @change="thongTinNguoiNopHoSo.delegateIdNo=thongTinNguoiNopHoSo.delegateIdNo.trim()"
                        ></v-text-field>
                        <!--  -->
                        <suggestions
                          v-if="originality === 3 || originality === '3'"
                          v-model="thongTinNguoiNopHoSo.delegateIdNo"
                          :options="searchOptions"
                          :onItemSelected="onSearchItemSelected1"
                          :onInputChange="onInputChange1">
                          <div slot="item" slot-scope="props" class="single-item">
                            <v-list-tile-content>
                              <v-list-tile-title v-html="props.item.applicantName"></v-list-tile-title>
                              <v-list-tile-sub-title v-html="props.item.applicantIdNo"></v-list-tile-sub-title>
                            </v-list-tile-content>
                          </div>
                        </suggestions>
                        <span style="color:#ff5252;font-size: 12px" v-if="(originality === 3 || originality === '3') && checkDelegateIdNo">Thông tin bắt buộc</span>
                        <v-tooltip top v-if="(originality === 3 || originality === '3') && applicantConfig">
                          <v-btn @click="showDialogApplicantList('NguoiNop')" slot="activator" class="mx-0 my-0" flat icon color="primary" style="position: absolute;top:0;right:-5px">
                            <v-icon size="14">fas fa fa-address-card</v-icon>
                          </v-btn>
                          <span>Danh sách công dân, tổ chức, doanh nghiệp</span>
                        </v-tooltip>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-subheader v-else class="pl-0">Họ và tên <span v-if="requiredOptions['delegateName']" style="color:red">&nbsp;*</span>: </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-text-field
                        v-else
                        v-model="thongTinNguoiNopHoSo.delegateName"
                        :rules="requiredOptions['delegateName'] ? [rules.required, rules.varchar500] : ''"
                        :required="requiredOptions['delegateName']"
                        @change="thongTinNguoiNopHoSo.delegateName=thongTinNguoiNopHoSo.delegateName.trim()"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-subheader v-else class="pl-0">Địa chỉ <span v-if="requiredOptions['delegateAddress']" style="color:red">&nbsp;*</span>: </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm10>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-textarea
                        v-else
                        v-model="thongTinNguoiNopHoSo.delegateAddress"
                        rows="2"
                        :rules="requiredOptions['delegateAddress'] ? [rules.required, rules.varchar500] : ''"
                        :required="requiredOptions['delegateAddress']"
                        ></v-textarea>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-subheader v-else class="pl-0">Tỉnh/Thành phố <span v-if="requiredOptions['delegateCityCode']" style="color:red">&nbsp;*</span>: </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-autocomplete
                        v-else
                        :items="citys"
                        item-text="itemName"
                        item-value="itemCode"
                        @change="onChangeDelegateCity"
                        v-model="thongTinNguoiNopHoSo.delegateCityCode"
                        :rules="requiredOptions['delegateCityCode'] ? [rules.required] : ''"
                        :required="requiredOptions['delegateCityCode']"
                        ></v-autocomplete>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-subheader v-else class="pl-0">Quận/Huyện <span v-if="requiredOptions['delegateDistrictCode']" style="color:red">&nbsp;*</span>: </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-autocomplete
                        v-else
                        :items="delegateDistricts"
                        item-text="itemName"
                        item-value="itemCode"
                        @change="onChangeDelegateDistrict"
                        v-model="thongTinNguoiNopHoSo.delegateDistrictCode"
                        :rules="requiredOptions['delegateDistrictCode'] ? [rules.required] : ''"
                        :required="requiredOptions['delegateDistrictCode']"
                        ></v-autocomplete>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-subheader v-else class="pl-0">Xã/Phường <span v-if="requiredOptions['delegateWardCode']" style="color:red">&nbsp;*</span>: </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-autocomplete
                        v-else
                        :items="delegateWards"
                        item-text="itemName"
                        item-value="itemCode"
                        v-model="thongTinNguoiNopHoSo.delegateWardCode"
                        :rules="requiredOptions['delegateWardCode'] ? [rules.required] : ''"
                        :required="requiredOptions['delegateWardCode']"
                        ></v-autocomplete>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-subheader v-else class="pl-0">Số điện thoại <span v-if="requiredOptions['delegateTelNo']" style="color:red">&nbsp;*</span>: </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-text-field
                        v-else
                        v-model="thongTinNguoiNopHoSo.delegateTelNo"
                        append-icon="phone"
                        @change="thongTinNguoiNopHoSo.delegateName=thongTinNguoiNopHoSo.delegateName.trim()"
                        :rules="requiredOptions['delegateTelNo'] ? [rules.telNo, rules.required] : [rules.telNo]"
                        :required="requiredOptions['delegateTelNo']"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-subheader v-else class="pl-0">Địa chỉ email <span v-if="requiredOptions['delegateEmail']" style="color:red">&nbsp;*</span>: </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-text-field
                        v-else
                        v-model="thongTinNguoiNopHoSo.delegateEmail"
                        @change="thongTinNguoiNopHoSo.delegateEmail=thongTinNguoiNopHoSo.delegateEmail.trim()"
                        :rules="requiredOptions['delegateEmail'] ? [rules.email, rules.required] : (thongTinNguoiNopHoSo.delegateEmail ? [rules.email] : '')"
                        :required="requiredOptions['delegateEmail']"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <div class="absolute__btn" style="width: 200px;margin-top: 4px;" v-if="!showApplicant">
              <content-placeholders class="mt-1" v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-checkbox class="mt-1"
              v-else
              label="Là chủ hồ sơ"
              v-model="thongTinNguoiNopHoSo.sameUser"
              ></v-checkbox>
            </div>
          </div>
        </div>
      </div>
    </v-form>
    <v-dialog v-model="dialog_applicantInfos" scrollable persistent max-width="700px">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Thông tin doanh nghiệp</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialog_applicantInfos = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="py-1">
          <v-layout wrap class="py-1 align-center">
            <v-flex xs12 class="px-2">
              <div class="my-2"><span class="text-bold">Tên tổ chức, doanh nghiệp: </span> <span>{{applicantInfos.applicantName}}</span></div>
            </v-flex>
            <v-flex xs12 class="px-2">
              <div class="my-2"><span class="text-bold">Mã số thuế: </span> <span>{{applicantInfos.applicantIdNo}}</span></div>
            </v-flex>
            <v-flex xs12 class="px-2">
              <div class="my-2"><span class="text-bold">Loại hình doanh nghiệp: </span> <span>{{applicantInfos.companyType}}</span></div>
            </v-flex>
            <v-flex xs12 class="px-2">
              <div class="my-2"><span class="text-bold">Địa chỉ:</span> <span>{{applicantInfos.address}}</span></div>
            </v-flex>
            <v-flex xs12 class="px-2">
              <div class="my-2"><span class="text-bold">Người đại diện: </span> <span>{{applicantInfos.representatives}}</span></div>
            </v-flex>
            <v-flex xs12 class="px-2">
              <div class="my-2"><span class="text-bold">Tình trạng: </span> <span>{{applicantInfos.companyStatus}}</span></div>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-3" color="primary" @click.native="dialog_applicantInfos = false">
            <v-icon>clear</v-icon> &nbsp;
            Thoát
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  -->
    <v-dialog v-model="dialog_applicantList" scrollable persistent max-width="1200px">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Danh sách công dân, tổ chức, doanh nghiệp</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialog_applicantList = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="py-1">
          <v-layout wrap class="mt-3">
            <v-flex xs12 sm7 class="pr-2 input-group--text-field-box">
              <v-text-field
                  label="Tìm kiếm theo tên người dùng"
                  v-model="keySearch"
                  @keyup.enter="searchKeyword"
                  append-icon="search"
                  box
                  clear-icon="clear"
                  clearable
                  @click:clear="clearKeySearch"
                  @click:append="searchKeyword"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm5 class="pl-2 pr-2">
              <div style="position:relative">
                <v-radio-group class="mt-1" v-model="typeSearch" row @change="changeTypeSearch">
                  <v-radio label="Tất cả" :value="''" ></v-radio>
                  <v-radio label="Công dân" :value="'citizen'"></v-radio>
                  <v-radio label="Doanh nghiệp" :value="'business'"></v-radio>
                  <v-radio label="Cơ quan, tổ chức" :value="'organization'"></v-radio>
                </v-radio-group>
              </div>
            </v-flex>
          </v-layout>
          <v-data-table
            :headers="applicantListHeader"
            :items="applicantLists"
            hide-actions
            class="table-landing table-bordered"
            style="border-left: 1px solid #dedede"
          >
            <template slot="items" slot-scope="props">
              <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;">
                <td class="text-xs-center" style="width:50px;height:36px">
                  <content-placeholders v-if="loadingTable">
                    <content-placeholders-text :lines="1" />
                  </content-placeholders>
                  <div v-else>
                    <span>{{ applicantPage * numberPerPage - numberPerPage + props.index + 1 }}</span>
                  </div>
                </td>
                <td class="text-xs-left" style="height:36px">
                  <content-placeholders v-if="loadingTable">
                    <content-placeholders-text :lines="1" />
                  </content-placeholders>
                  <div v-else>
                    <span>{{props.item.applicantName}}</span>
                  </div>
                </td>
                <td class="text-xs-left" style="height:36px">
                  <content-placeholders v-if="loadingTable">
                    <content-placeholders-text :lines="1" />
                  </content-placeholders>
                  <div v-else>
                    <span>{{props.item.applicantIdType === 'citizen' ? 'Công dân' : (props.item.applicantIdType === 'business' ? 'Doanh nghiệp' : 'Cơ quan, tổ chức')}}</span>
                  </div>
                </td>
                <td class="text-xs-left" style="height:36px">
                  <content-placeholders v-if="loadingTable">
                    <content-placeholders-text :lines="1" />
                  </content-placeholders>
                  <div v-else>
                    <span>{{props.item.applicantIdNo}}</span>
                  </div>
                </td>
                <td class="text-xs-left" style="height:36px;min-width:200px">
                  <content-placeholders v-if="loadingTable">
                    <content-placeholders-text :lines="1" />
                  </content-placeholders>
                  <div v-else>
                    <span>{{fullAddress(props.item['address'], props.item['cityName'], props.item['districtName'], props.item['wardName'])}}</span>
                  </div>
                </td>
                <td class="text-xs-center" style="height:36px;width: 100px">
                  <content-placeholders v-if="loadingTable">
                    <content-placeholders-text :lines="1" />
                  </content-placeholders>
                  <v-tooltip top v-if="!loadingTable">
                    <v-btn @click="showEditApplicant(props.item)" color="green" slot="activator" flat icon class="mx-0 my-0">
                      <v-icon>edit</v-icon>
                    </v-btn>
                    <span>Sửa thông tin</span>
                  </v-tooltip>
                  
                  <v-tooltip top v-if="!loadingTable">
                    <v-btn @click="bindInfoApplicant(props.item)" color="blue" slot="activator" flat icon class="mx-0 my-0">
                      <v-icon>beenhere</v-icon>
                    </v-btn>
                    <span>Sử dụng</span>
                  </v-tooltip>
                </td>
              </tr>
            </template>
          </v-data-table>
          <!--  -->
          <div class="my-2" v-if="totalApplicantSearch > numberPerPage">
            <div class="text-xs-right layout wrap" style="position: relative;">
              <div class="flex pagging-table px-2"> 
                <tiny-pagination :total="totalApplicantSearch" :page="applicantPage" :numberPerPage="numberPerPage" nameRecord="người dùng" custom-class="custom-tiny-class" 
                  @tiny:change-page="changePage" ></tiny-pagination> 
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-4" color="primary" @click.native="dialog_applicantList = false">
            <v-icon>clear</v-icon> &nbsp;
            Thoát
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  -->
    <v-dialog v-model="dialog_editApplicant" scrollable persistent max-width="700px">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>{{titleEdit}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialog_editApplicant = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="py-1">
          <v-form ref="form" v-model="valid" lazy-validation class="py-3 px-0 grid-list">
            <v-layout row wrap class="px-0 py-3">
              <v-flex xs12 sm12>
                <v-text-field v-model="applicantEdit['applicantName']" box :rules="[v => !!v || 'Trường dữ liệu bắt buộc']" required  @change="applicantEdit['applicantName']=applicantEdit['applicantName'].trim()">
                  <template slot="label"> 
                    <span v-if="applicantEdit['applicantIdType'] === 'business'">Tên doanh nghiệp</span>
                    <span v-if="applicantEdit['applicantIdType'] === 'citizen'">Họ tên</span> 
                    <span v-if="applicantEdit['applicantIdType'] === 'organization'">Tên cơ quan, tổ chức</span> 
                    <span class="red--text darken-3"> *</span>
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="applicantEdit['applicantIdNo']" box 
                  :rules="[v => !!v || 'Trường dữ liệu bắt buộc']" required 
                  disabled style="pointer-events: none"
                  @change="applicantEdit['applicantIdNo']=applicantEdit['applicantIdNo'].trim()"
                >
                  <template slot="label"> 
                    <span v-if="applicantEdit['applicantIdType'] === 'business'">Mã số thuế</span>
                    <span v-if="applicantEdit['applicantIdType'] === 'citizen'">Số CMND/ Căn cước</span> 
                    <span v-if="applicantEdit['applicantIdType'] === 'organization'">Mã cơ quan, tổ chức</span> 
                    <span class="red--text darken-3"> *</span>
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-menu
                  ref="menuBirthDate"
                  :close-on-content-click="false"
                  v-model="menuBirthDate"
                  :nudge-right="40"
                  lazy
                  transition="fade-transition"
                  offset-y
                  full-width
                  max-width="290px"
                  min-width="290px"
                >
                  <v-text-field
                    slot="activator"
                    box append-icon="event"
                    v-model="applicantEdit['applicantIdDate']"
                    label="Ngày cấp"
                    @change="applicantEdit['applicantIdDate']=applicantEdit['applicantIdDate'].trim()"
                    @blur="ngayCap = parseDate(applicantEdit['applicantIdDate'])"
                  ></v-text-field>
                  <v-date-picker ref="picker" min="1950-01-01" :max="getMaxdate()" :first-day-of-week="1" locale="vi"
                  v-model="ngayCap" no-title @input="changeBirthDate"></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field label="Số điện thoại" v-model="applicantEdit['contactTelNo']" box @change="applicantEdit['contactTelNo']=applicantEdit['contactTelNo'].trim()"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field label="Thư điện tử" v-model="applicantEdit['contactEmail']" box disabled @change="applicantEdit['contactEmail']=applicantEdit['contactEmail'].trim()"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12>
                <v-text-field label="Địa chỉ" v-model="applicantEdit['address']" box clearable @change="applicantEdit['address']=applicantEdit['address'].trim()"></v-text-field>
              </v-flex>
              <v-flex xs12 sm4>
                <v-autocomplete :items="cityItems" label="Tỉnh/thành phố" v-model="applicantEdit['cityCode']" item-text="itemName" item-value="itemCode" :hide-selected="true" box @change="onChangeCityEditApplicant($event)"></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm4>
                <v-autocomplete :items="districtItems" label="Quận/huyện" v-model="applicantEdit['districtCode']" item-text="itemName" item-value="itemCode" :hide-selected="true" box @change="onChangeDistrictEditApplicant($event)"></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm4>
                <v-autocomplete label="Xã/phường" :items="wardItems" v-model="applicantEdit['wardCode']" item-text="itemName" item-value="itemCode" :hide-selected="true" box @change="onChangeWardEditApplicant($event)"></v-autocomplete>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-2" color="primary" @click.native="exitDialogEditApplicant">
            <v-icon>clear</v-icon> &nbsp;
            Thoát
          </v-btn>
          <v-btn class="mr-3" color="primary" @click.native="updateApplicant">
            <v-icon>save</v-icon> &nbsp;
            Cập nhật
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import Suggestions from 'v-suggestions'
import toastr from 'toastr'
import TinyPagination from '../../components/pagging/opencps_pagination'
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  components: {
    'suggestions': Suggestions,
    'tiny-pagination': TinyPagination
  },
  props: ['requiredConfig', 'showApplicant', 'showDelegate', 'formCode', 'applicantIdRequired'],
  data: () => ({
    checkDelegateIdNo: false,
    checkApplicantId: false,
    requiredOptions: {
      applicantIdNo: true,
      applicantName: true,
      address: true,
      cityCode: true,
      districtCode: true,
      wardCode: true,
      contactTelNo: true,
      contactEmail: false,
      delegateIdNo: true,
      delegateName: true,
      delegateAddress: true,
      delegateCityCode: true,
      delegateDistrictCode: true,
      delegateWardCode: true,
      delegateTelNo: true,
      delegateEmail: false
    },
    valid_thongtinchuhoso: false,
    loadingVerify: false,
    citys: [],
    delegateDistricts: [],
    districts: [],
    delegateWards: [],
    wards: [],
    applicantItems: [],
    applicantItems2: [],
    applicantIdNo: '',
    applicantLists: [],
    applicantListHeader: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tên công dân, tổ chức, doanh nghiệp',
        align: 'center',
        sortable: false
      },
      {
        text: 'Loại thông tin người dùng',
        align: 'center',
        sortable: false
      },
      {
        text: 'Số CMND/ căn cước, mã tổ chức, doanh nghiệp',
        align: 'center',
        sortable: false
      },
      {
        text: 'Địa chỉ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thao tác',
        align: 'center',
        sortable: false
      }
    ],
    labelSwitch: {
      '1': {
        cmtnd: 'CMND/ Hộ chiếu',
        nguoi_nop: 'Họ và tên'
      },
      '2': {
        cmtnd: 'Mã số thuế',
        nguoi_nop: 'Tên tổ chức, doanh nghiệp'
      }
    },
    thongTinChuHoSo: {
      userType: '1',
      cityCode: '',
      districtCode: '',
      wardCode: '',
      applicantIdNo: '',
      applicantIdType: '',
      contactEmail: '',
      contactTelNo: '',
      contactName: '',
      address: '',
      applicantName: ''
    },
    thongTinNguoiNopHoSo: {
      sameUser: false,
      delegateName: '',
      delegateCityCode: '',
      delegateAddress: '',
      delegateDistrictCode: '',
      delegateWardCode: '',
      delegateEmail: '',
      delegateTelNo: '',
      delegateIdNo: ''
    },
    applicantInfos: {
      applicantName: '',
      applicantIdNo: '',
      companyType: '',
      companyStatus: '',
      address: '',
      representatives: ''
    },
    numberPerPage: 10,
    applicantPage: 1,
    totalApplicantSearch: 0,
    bussinessExits: false,
    validBussinessInfos: true,
    messageCheckApplicant: '',
    search: null,
    search2: null,
    searchQuery: '',
    selectedSearchItem: null,
    searchOptions: {},
    functionTimeOut: null,
    dialog_applicantInfos: false,
    dialog_applicantList: false,
    applicantConfig: false,
    titleEdit: 'Thông tin công dân, tổ chức, doanh nghiệp',
    applicantEdit: '',
    dialog_editApplicant: false,
    rules: {
      required: (value) => !!value || 'Thông tin bắt buộc',
      cmndHoChieu: (value) => {
        const pattern = /^(?![0-9]{4,12})[0-9a-zA-Z]{4,12}$/
        return pattern.test(value) || 'Gồm các ký tự 0-9, a-z và ít nhất 4-12 ký tự'
      },
      email: (value) => {
        value = value.trim()
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Địa chỉ Email không hợp lệ'
      },
      passWord: (value) => {
        const pattern = /^(?![0-9]{6,})[0-9a-zA-Z]{6,}$/
        return pattern.test(value) || 'Gồm các ký tự 0-9, a-z và ít nhất 6 ký tự'
      },
      telNo: (value) => {
        const pattern = /^([0-9]{0,})$/
        value = value.trim()
        return pattern.test(value) || 'Gồm các ký tự 0-9'
      },
      varchar100: (val) => {
          val = val.trim()
          return val.length < 100 ? true : 'Không được nhập quá 100 ký tự'    
      },
      varchar255: (val) => {
          val = val.trim()
          return val.length < 255 ? true : 'Không được nhập quá 255 ký tự'      
      },
      varchar500: (val) => {
        val = val.trim()
        return val.length < 500 ? true : 'Không được nhập quá 500 ký tự'     
      },
      varchar5000: (val) => {
        val = val.trim()
        return val.length < 5000 ? true : 'Không được nhập quá 5000 ký tự'      
      },
    },
    typeSearch: '',
    keySearch: '',
    menuBirthDate: false,
    ngayCap: null,
    toDateFormatted: null,
    cityItems: [],
    districtItems: [],
    wardItems: [],
    valid: false,
    loadingTable: false,
    hasOrganization: false
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    forGroupDossier () {
      return this.$store.getters.getForGroupDossier
    },
    originality () {
      var vm = this
      console.log('originality', vm.getOriginality())
      return vm.getOriginality()
    },
    viaPostal () {
      return this.$store.getters.viaPostal
    },
    dichVuChuyenPhatKetQua () {
      return this.$store.getters.dichVuChuyenPhatKetQua
    },
    ThongTinChuHoSoBindChuyenPhat () {
      let data = {
        cityCode: this.thongTinChuHoSo.cityCode,
        address: this.thongTinChuHoSo.address,
        districtCode: this.thongTinChuHoSo.districtCode,
        wardCode: this.thongTinChuHoSo.wardCode,
        contactTelNo: this.thongTinChuHoSo.contactTelNo
      }
      return data
    }
  },
  created () {
    let vm = this
    if (vm.formCode === "NEW") {
      vm.thongTinNguoiNopHoSo.sameUser = true
    }
    if (vm.hasOrganization) {
      vm.labelSwitch = {
        '1': {
          cmtnd: 'CMND/ Hộ chiếu',
          nguoi_nop: 'Họ và tên'
        },
        '2': {
          cmtnd: 'Mã số thuế',
          nguoi_nop: 'Tên doanh nghiệp'
        },
        '3': {
          cmtnd: 'Mã cơ quan, tổ chức',
          nguoi_nop: 'Tên cơ quan, tổ chức'
        }
      }
    }
    if (vm.requiredConfig && vm.requiredConfig['applicant']) {
      vm.requiredOptions = Object.assign(vm.requiredOptions, vm.requiredConfig['applicant'])
    }
  },
  watch: {
    thongTinChuHoSo: {
      handler: function (value) {
        let vm = this
        if(!value.applicantIdNo) {
          vm.checkApplicantId = true
        }
        vm.$store.commit('setThongTinChuHoSo', value)
        let tempData = {
          delegateName: value.applicantName,
          delegateCityCode: value.cityCode,
          delegateAddress: value.address,
          delegateDistrictCode: value.districtCode,
          delegateWardCode: value.wardCode,
          delegateEmail: value.contactEmail,
          delegateTelNo: value.contactTelNo,
          delegateIdNo: value.applicantIdNo
        }

        if (vm.thongTinNguoiNopHoSo.sameUser) {
          if (value.cityCode && value.cityCode !== vm.thongTinNguoiNopHoSo['delegateCityCode']) {
            vm.onChangeDelegateCity(value.cityCode)
          }
          if (value.districtCode && value.districtCode !== vm.thongTinNguoiNopHoSo['delegateDistrictCode']) {
            vm.onChangeDelegateDistrict(value.districtCode)
          }
          vm.thongTinNguoiNopHoSo = Object.assign(vm.thongTinNguoiNopHoSo, tempData)
        }
        // set requiredOptions
        // if (value.userType === '2') {
        //   vm.requiredOptions = {
        //     applicantIdNo: false,
        //     applicantName: true,
        //     address: true,
        //     cityCode: true,
        //     districtCode: true,
        //     wardCode: true,
        //     contactTelNo: true,
        //     contactEmail: false,
        //     delegateIdNo: false,
        //     delegateName: false,
        //     delegateAddress: false,
        //     delegateCityCode: false,
        //     delegateDistrictCode: false,
        //     delegateWardCode: false,
        //     delegateTelNo: false,
        //     delegateEmail: false
        //   }
        // } else {
        //   vm.requiredOptions = {
        //     applicantIdNo: true,
        //     applicantName: true,
        //     address: true,
        //     cityCode: true,
        //     districtCode: true,
        //     wardCode: true,
        //     contactTelNo: true,
        //     contactEmail: false,
        //     delegateIdNo: false,
        //     delegateName: false,
        //     delegateAddress: false,
        //     delegateCityCode: false,
        //     delegateDistrictCode: false,
        //     delegateWardCode: false,
        //     delegateTelNo: false,
        //     delegateEmail: false
        //   }
        // }
        // end
      },
      deep: true
    },
    thongTinNguoiNopHoSo: {
      handler: function (value) {
        var vm = this
        let dataChuHoSo = vm.thongTinChuHoSo
        if(!value.delegateIdNo) {
          vm.checkDelegateIdNo = true
        }
        if (value.sameUser) {
          let dataNguoiNopHoSo = {
            delegateName: dataChuHoSo.applicantName,
            delegateCityCode: dataChuHoSo.cityCode,
            delegateAddress: dataChuHoSo.address,
            delegateDistrictCode: dataChuHoSo.districtCode,
            delegateWardCode: dataChuHoSo.wardCode,
            delegateEmail: dataChuHoSo.contactEmail,
            delegateTelNo: dataChuHoSo.contactTelNo,
            delegateIdNo: dataChuHoSo.applicantIdNo
          }
          if (dataChuHoSo.cityCode && dataChuHoSo.cityCode !== vm.thongTinNguoiNopHoSo['delegateCityCode']) {
            vm.onChangeDelegateCity(dataChuHoSo.cityCode)
          }
          if (dataChuHoSo.districtCode && dataChuHoSo.districtCode !== vm.thongTinNguoiNopHoSo['delegateDistrictCode']) {
            vm.onChangeDelegateDistrict(dataChuHoSo.districtCode)
          }
          vm.thongTinNguoiNopHoSo = Object.assign(vm.thongTinNguoiNopHoSo, dataNguoiNopHoSo)
        } else {
          this.$store.dispatch('resetThongTinNguoiNopHoSo')
        }
      },
      deep: true
    },
    ThongTinChuHoSoBindChuyenPhat (val) {
      this.$store.commit('setThongTinChuHoSoBindChuyenPhat', val)
    },
    search (val) {
      val && this.querySelections(val)
    },
    search2 (val) {
      val && this.querySelections2(val)
    },
    typeSearch (val) {
      let vm = this
      if (val === '') {
        vm.applicantListHeader[1].text = 'Tên công dân, tổ chức, doanh nghiệp'
        vm.applicantListHeader[3].text = 'Số CMND/ căn cước, mã số thuế doanh nghiệp'
      } else if (val === 'citizen') {
        vm.applicantListHeader[1].text = 'Tên công dân'
        vm.applicantListHeader[3].text = 'Số CMND/ căn cước'
      } else if (val === 'business') {
        vm.applicantListHeader[1].text = 'Tên doanh nghiệp'
        vm.applicantListHeader[3].text = 'Mã số thuế doanh nghiệp'
      } else {
        vm.applicantListHeader[1].text = 'Tên cơ quan, tổ chức'
        vm.applicantListHeader[3].text = 'Mã cơ quan, tổ chức'
      }
    },
    ngayCap(val) {
      this.toDateFormatted = this.formatDate(val)
      this.applicantEdit['applicantIdDate'] = this.toDateFormatted
    },
  },
  methods: {
    initData (data) {
      var vm = this
      vm.$store.commit('setApplicantId', data.applicantIdNo)
      let tempData = {
        delegateName: data.delegateName,
        delegateCityCode: data.delegateCityCode,
        delegateAddress: data.delegateAddress,
        delegateDistrictCode: data.delegateDistrictCode,
        delegateWardCode: data.delegateWardCode,
        delegateEmail: data.delegateEmail,
        delegateTelNo: data.delegateTelNo,
        delegateIdNo: data.delegateIdNo
      }
      let thongTinNguoiNopHoSoTemp = Object.assign(vm.thongTinNguoiNopHoSo, tempData)
      vm.thongTinNguoiNopHoSo = thongTinNguoiNopHoSoTemp
      let userTypeCondition = '1'
      if (data.applicantIdType === 'business') {
        userTypeCondition = '2'
      } else if (data.applicantIdType === 'organization') {
        userTypeCondition = '3'
      }
      let tempDataChuHs = {
        userType: userTypeCondition,
        cityCode: data.cityCode,
        districtCode: data.districtCode,
        wardCode: data.wardCode,
        applicantIdNo: data.applicantIdNo,
        applicantIdType: data.applicantIdType,
        contactEmail: data.contactEmail,
        contactName: data.contactName,
        contactTelNo: data.contactTelNo,
        address: data.address,
        applicantName: data.applicantName,
        cityName: data.cityName,
        districtName: data.districtName,
        wardName: data.wardName
      }
      let thongTinChuHoSoTemp = Object.assign(vm.thongTinChuHoSo, tempDataChuHs)
      vm.thongTinChuHoSo = thongTinChuHoSoTemp
      vm.checkApplicantInfos()
      vm.$nextTick(function () {
        var filter = {
          collectionCode: 'ADMINISTRATIVE_REGION',
          level: 0,
          parent: 0
        }
        vm.$store.getters.getDictItems(filter).then(function (result) {
          vm.citys = result.data
          // set default cityCode
          // if (vm.formCode === "NEW") {
          //   vm.thongTinChuHoSo['cityCode'] = 87
          //   vm.thongTinChuHoSo['cityName'] = 'Tỉnh Đồng Tháp'
          // }
          
        })
        setTimeout(function () {
          if (data.cityCode) {
            vm.$store.getters.getDictItems({
              collectionCode: 'ADMINISTRATIVE_REGION',
              level: 1,
              parent: data.cityCode
            }).then(function (resultDistricts) {
              vm.districts = resultDistricts.data
            })
          }
          if (data.districtCode) {
            vm.$store.getters.getDictItems({
              collectionCode: 'ADMINISTRATIVE_REGION',
              level: 1,
              parent: data.districtCode
            }).then(function (resultWards) {
              vm.wards = resultWards.data
            })
          }
          if (data.delegateCityCode) {
            vm.$store.getters.getDictItems({
              collectionCode: 'ADMINISTRATIVE_REGION',
              level: 1,
              parent: data.delegateCityCode
            }).then(function (resultDeDistricts) {
              vm.delegateDistricts = resultDeDistricts.data
            })
          }
          if (data.delegateDistrictCode) {
            vm.$store.getters.getDictItems({
              collectionCode: 'ADMINISTRATIVE_REGION',
              level: 1,
              parent: data.delegateDistrictCode
            }).then(function (resultDeWards) {
              vm.delegateWards = resultDeWards.data
            })
          }
        }, 200)
      })
      vm.$refs.formChuHoSo.resetValidation()
    },
    onChangeCity (data, editDelegate) {
      var vm = this
      let filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 1,
        parent: data
      }
      if (!editDelegate) {
        vm.thongTinChuHoSo.districtCode = ''
        vm.thongTinChuHoSo.wardCode = ''
        vm.$store.commit('setCityVal', data)
      }
      vm.$store.getters.getDictItems(filter).then(function (result) {
        if (!editDelegate) {
          vm.districts = result.data
          vm.wards = []
        }

        if (editDelegate || vm.thongTinNguoiNopHoSo.sameUser || (!vm.thongTinNguoiNopHoSo.sameUser && vm.showApplicant && !vm.showDelegate)) {
          vm.delegateDistricts = result.data
          vm.delegateWards = []
        }
      })
    },
    onChangeDistrict (data, editDelegate) {
      var vm = this
      let filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 1,
        parent: data
      }
      if (!editDelegate) {
        vm.thongTinChuHoSo.wardCode = ''
        vm.$store.commit('setDistrictVal', data)
      }
      
      vm.$store.getters.getDictItems(filter).then(function (result) {
        if (!editDelegate) {
          vm.wards = result.data
        }
        
        if (editDelegate || vm.thongTinNguoiNopHoSo.sameUser || (!vm.thongTinNguoiNopHoSo.sameUser && vm.showApplicant && !vm.showDelegate)) {
          vm.delegateWards = result.data
        }
      })
    },
    onChangeWard (data) {
      this.$store.commit('setWardVal', data)
    },
    querySelections (val) {
      var vm = this
      let params = {
        idNo: val
      }
      vm.$store.dispatch('getUserInfoFromApplicantIdNo', params).then(result => {
        vm.applicantItems = result
      }).catch(xhr => {
      })
    },
    querySelections2 (val) {
      var vm = this
      let params = {
        idNo: val
      }
      vm.$store.dispatch('getUserInfoFromApplicantIdNo', params).then(result => {
        vm.applicantItems2 = result
      }).catch(xhr => {
      })
    },
    onChangeDelegateCity (data) {
      var vm = this
      vm.thongTinNguoiNopHoSo.delegateDistrictCode = ''
      vm.thongTinNguoiNopHoSo.delegateWardCode = ''
      let filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 1,
        parent: data
      }
      vm.$store.getters.getDictItems(filter).then(function (result) {
        vm.delegateDistricts = result.data
        if (vm.thongTinNguoiNopHoSo.sameUser) {
          vm.districts = result.data
        }
      })
    },
    showValid () {
      var vm = this
      let applicantIdRequired = true
      if (vm.requiredOptions['applicantIdNo'] && !vm.thongTinChuHoSo.applicantIdNo) {
        applicantIdRequired = false
      }
      if (vm.originality !== 1  && !vm.showDelegate && vm.requiredOptions['delegateIdNo'] && !vm.thongTinNguoiNopHoSo.delegateIdNo) {
        applicantIdRequired = false
      }
      let result = {
        validForm: vm.$refs.formChuHoSo.validate() && applicantIdRequired,
        message: vm.messageCheckApplicant,
        validApplicant: vm.validBussinessInfos,
        applicantIdRequired: applicantIdRequired
      }
      return result
    },
    onChangeDelegateDistrict (data) {
      var vm = this
      vm.thongTinNguoiNopHoSo.delegateWardCode = ''
      let filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 1,
        parent: data
      }
      vm.$store.getters.getDictItems(filter).then(function (result) {
        vm.delegateWards = result.data
        if (vm.thongTinNguoiNopHoSo.sameUser) {
          vm.wards = result.data
        }
      })
    },
    onInputChange (query) {
      let vm = this
      vm.thongTinChuHoSo.applicantIdNo = query.trim()
      if (vm.functionTimeOut) {
        clearTimeout(vm.functionTimeOut)
      }
      vm.functionTimeOut = setTimeout(function () {
        if ((vm.originality === 3 && vm.thongTinChuHoSo.userType === '2') || (vm.originality === 1 && vm.thongTinChuHoSo.applicantIdType === 'business')) {
          vm.checkApplicantInfos()
          vm.thongTinChuHoSo.applicantIdNo = query.trim()
        }
        vm.$store.commit('setApplicantId', query)
      }, 2000)
      if (query.trim().length === 0 ) {
        return null
      }
      let url = `/o/rest/v2/applicants?start=0&end=5&idNo=${query}`

      // if (vm.functionTimeOutApplicant) {
      //   clearTimeout(vm.functionTimeOutApplicant)
      // }
      // vm.functionTimeOutApplicant = setTimeout(function () {
        return new Promise(resolve => {
          vm.$store.dispatch('loadInitResource').then(result => {
            let param = {
              headers: {
              }
            }
            axios.get(url, param).then(response => {
              let items = []
              if (response.data.hasOwnProperty('data')) {
                items = response.data.data
                if(query.trim().length >= 100) {
                  toastr.error(vm.labelSwitch[vm.thongTinChuHoSo.userType].cmtnd  + ' phải ít hơn 100 kí tự')
                  vm.thongTinChuHoSo.applicantIdNo = ''
                  return null
                } else {
                  vm.thongTinChuHoSo.applicantIdNo = query.trim()
                }
              } else {
                  if(query.trim().length >= 100) {
                    toastr.error(vm.labelSwitch[vm.thongTinChuHoSo.userType].cmtnd  + ' phải ít hơn 100 kí tự')
                    vm.thongTinChuHoSo.applicantIdNo = ''
                    return null
                  } else {
                    vm.thongTinChuHoSo.applicantIdNo = query.trim()
                  }
              }
              resolve(items)
            })
          })
        })
      // }, 1000)
    },
    onInputChange1 (query) {
      let vm = this
      vm.thongTinNguoiNopHoSo.delegateIdNo = query.trim()
      if (query.trim().length === 0) {
        return null
      }
      let url = `/o/rest/v2/applicants?start=0&end=5&idNo=${query}`

      // if (vm.functionTimeOutApplicant) {
      //   clearTimeout(vm.functionTimeOutApplicant)
      // }
      // vm.functionTimeOutApplicant = setTimeout(function () {
        return new Promise(resolve => {
          vm.$store.dispatch('loadInitResource').then(result => {
            let param = {
              headers: {
              }
            }
            axios.get(url, param).then(response => {
              let items = []
              if (response.data.hasOwnProperty('data')) {
                items = response.data.data
              } else {
              }
              resolve(items)
            })
          })
        })
      // }, 1000)
    },
    onSearchItemSelected (item) {
      var vm = this
      vm.selectedSearchItem = item
      // console.log('selectedSearchItem', vm.selectedSearchItem)
      if (item['applicantIdType'] === 'business') {
        vm.thongTinChuHoSo.userType = '2'
        // vm.thongTinNguoiNopHoSo.sameUser = false
      } else if (item['applicantIdType'] === 'citizen') {
        vm.thongTinChuHoSo.userType = '1'
      } else {
        vm.thongTinChuHoSo.userType = '3'
      }
      vm.thongTinChuHoSo['applicantIdNo'] = item.applicantIdNo.toString()
      //
      vm.thongTinChuHoSo['applicantName'] = item['applicantName'] ? item['applicantName'] : ''
      vm.thongTinChuHoSo['address'] = item['address'] ? item['address'] : ''
      vm.thongTinChuHoSo['contactTelNo'] = item['contactTelNo'] ? item['contactTelNo'] : ''
      vm.thongTinChuHoSo['contactEmail'] = item['contactEmail'] ? item['contactEmail'] : ''
      vm.thongTinChuHoSo.cityCode = item['cityCode'] ? item['cityCode'] : ''
      setTimeout(function () {
        vm.$store.commit('setApplicantId', vm.thongTinChuHoSo['applicantIdNo'])
        vm.checkApplicantInfos()
      }, 2100)
      
      function changeCity (data) {
        return new Promise((resolve, reject) => {
          setTimeout(
            () => {
              vm.onChangeCity(data)
              resolve()
            }, Math.floor(Math.random() * 100) + 1
          )
        })
      }
      function changeDistrict (data) {
        return new Promise((resolve, reject) => {
          setTimeout(
            () => {
              vm.onChangeDistrict(data)
              resolve()
            }, Math.floor(Math.random() * 100) + 1
          )
        })
      }
      if (vm.thongTinChuHoSo['cityCode'] !== '' && vm.thongTinChuHoSo['cityCode'] !== null && vm.thongTinChuHoSo['cityCode'] !== undefined && vm.thongTinChuHoSo['cityCode'] !== 0 && vm.thongTinChuHoSo['cityCode'] !== '0') {
        changeCity(vm.thongTinChuHoSo['cityCode']).then(function () {
          vm.thongTinChuHoSo.districtCode = item['districtCode'] ? item['districtCode'] : ''
          if (vm.thongTinChuHoSo['districtCode'] !== '' && vm.thongTinChuHoSo['districtCode'] !== null && vm.thongTinChuHoSo['districtCode'] !== undefined && vm.thongTinChuHoSo['districtCode'] !== 0 && vm.thongTinChuHoSo['districtCode'] !== '0') {
            changeDistrict(vm.thongTinChuHoSo['districtCode']).then(function () {
              vm.thongTinChuHoSo.wardCode = item['wardCode'] ? item['wardCode'] : ''
            })
          }
        })
      }
    },
    onSearchItemSelected1 (item) {
      var vm = this
      vm.selectedSearchItem = item
      console.log('selectedSearchItem1', item)
      vm.thongTinNguoiNopHoSo['delegateIdNo'] = item.applicantIdNo.toString()
      //
      vm.thongTinNguoiNopHoSo['delegateName'] = item['applicantName'] ? item['applicantName'] : ''
      vm.thongTinNguoiNopHoSo['delegateAddress'] = item['address'] ? item['address'] : ''
      vm.thongTinNguoiNopHoSo['delegateTelNo'] = item['contactTelNo'] ? item['contactTelNo'] : ''
      vm.thongTinNguoiNopHoSo['delegateEmail'] = item['contactEmail'] ? item['contactEmail'] : ''
      vm.thongTinNguoiNopHoSo['delegateCityCode'] = item['cityCode'] ? item['cityCode'] : ''
      function changeCity (data) {
        return new Promise((resolve, reject) => {
          setTimeout(
            () => {
              vm.onChangeCity(data, 'true')
              resolve()
            }, Math.floor(Math.random() * 100) + 1
          )
        })
      }
      function changeDistrict (data) {
        return new Promise((resolve, reject) => {
          setTimeout(
            () => {
              vm.onChangeDistrict(data, 'true')
              resolve()
            }, Math.floor(Math.random() * 100) + 1
          )
        })
      }
      console.log('thongTinNguoiNopHoSo', vm.thongTinNguoiNopHoSo)
      if (vm.thongTinNguoiNopHoSo['delegateCityCode'] && vm.thongTinNguoiNopHoSo['delegateCityCode'] !== '0') {
        changeCity(vm.thongTinNguoiNopHoSo['delegateCityCode']).then(function () {
          vm.thongTinNguoiNopHoSo['delegateDistrictCode'] = item['districtCode'] ? item['districtCode'] : ''
          if (vm.thongTinNguoiNopHoSo['delegateDistrictCode'] && vm.thongTinNguoiNopHoSo['delegateDistrictCode'] !== '0') {
            changeDistrict(vm.thongTinNguoiNopHoSo['delegateDistrictCode']).then(function () {
              vm.thongTinNguoiNopHoSo['delegateWardCode'] = item['wardCode'] ? item['wardCode'] : ''
            })
          }
        })
      }
    },
    getThongTinChuHoSo () {
      return this.thongTinChuHoSo
    },
    getThongTinNguoiNopHoSo () {
      return this.thongTinNguoiNopHoSo
    },
    changeApplicantInfos () {
      let vm = this
      if (vm.functionTimeOut) {
        clearTimeout(vm.functionTimeOut)
      }
      vm.functionTimeOut = setTimeout(function () {
        if ((vm.originality === 3 && vm.thongTinChuHoSo.userType === '2') || (vm.originality === 1 && vm.thongTinChuHoSo.applicantIdType === 'business')) {
          vm.checkApplicantInfos()
        }
        vm.$store.commit('setApplicantId', vm.thongTinChuHoSo.applicantIdNo)
      }, 2000)
    },
    checkApplicantInfos () {
      let vm = this
      if ((vm.originality === 3 && vm.thongTinChuHoSo.userType === '2' && vm.thongTinChuHoSo.applicantIdNo) || (vm.originality === 1 && vm.thongTinChuHoSo.applicantIdType === 'business')) {
        let filter = {
          applicantIdNo: vm.thongTinChuHoSo.applicantIdNo,
          applicantName: vm.thongTinChuHoSo.applicantName
        }
        // vm.loadingVerify = true
        vm.$store.dispatch('checkApplicantInfos', filter).then(result => {
          // vm.loadingVerify = false
          if (result && result.hasOwnProperty('error') && result.error === true) {
            vm.bussinessExits = false
            vm.validBussinessInfos = false
            // vm.$store.commit('setApplicantBussinessExit', false)
            vm.messageCheckApplicant = result.message
            // toastr.error(result.message + ' Vui lòng kiểm tra lại mã số thuế')
          } else if (result && result.hasOwnProperty('warning') && result.warning === true) {
            vm.bussinessExits = true
            vm.validBussinessInfos = false
            // vm.$store.commit('setApplicantBussinessExit', false)
            vm.messageCheckApplicant = result.message
            // toastr.error(result.message + ' Vui lòng đối chiếu thông tin doanh nghiệp')
          } else if (result && !result.hasOwnProperty('error') && !result.hasOwnProperty('warning')) {
            vm.bussinessExits = true
            vm.validBussinessInfos = true
            // vm.$store.commit('setApplicantBussinessExit', filter['applicantIdNo'])
          }
        }).catch(function () {
          vm.loadingVerify = false
        })
      }
    },
    getApplicantInfos () {
      let vm = this
      let filter = {
        applicantIdNo: vm.thongTinChuHoSo.applicantIdNo
      }
      vm.$store.dispatch('getApplicantInfos', filter).then(result => {
        vm.applicantInfos['applicantName'] = result['MainInformation']['NAME']
        vm.applicantInfos['applicantIdNo'] = result['MainInformation']['ENTERPRISE_GDT_CODE']
        vm.applicantInfos['address'] = result['HOAdress']['AddressFullText']
        vm.applicantInfos['representatives'] = result['Representatives']['FULL_NAME']
        vm.applicantInfos['companyType'] = result['MainInformation']['ENTERPRISE_TYPE_NAME']
        vm.applicantInfos['companyStatus'] = result['MainInformation']['ENTERPRISE_STATUS_NAME']
        vm.dialog_applicantInfos = true
      })
    },
    getApplicantList () {
      let vm = this
      let url = '/o/rest/v2/applicants'
      vm.loadingTable = true
      return new Promise(resolve => {
        vm.$store.dispatch('loadInitResource').then(result => {
          let param = {
            headers: {
            },
            params: {
              start: vm.applicantPage * vm.numberPerPage - vm.numberPerPage,
              end: vm.applicantPage * vm.numberPerPage,
              type: vm.typeSearch,
              applicantName: vm.keySearch
            }
          }
          axios.get(url, param).then(response => {
            let items = []
            if (response.data.hasOwnProperty('data')) {
              items = response.data.data
            } else {
            }
            let dataOut = {
              data: items,
              total: response.data['total']
            }
            vm.loadingTable = false
            resolve(dataOut)
          }).catch(function () {
            vm.loadingTable = false
          })
        })
      })
    },
    showDialogApplicantList (type) {
      let vm = this
      vm.typeApplicantBind = type
      vm.applicantPage = 1
      vm.getApplicantList().then(function(result) {
        vm.totalApplicantSearch = result['total']
        vm.applicantLists = result['data']
        vm.dialog_applicantList = true
      }).catch(function () {
        toastr.error('Không lấy được danh sách công dân, tổ chức, doanh nghiệp')
      })
    },
    searchKeyword () {
      let vm = this
      setTimeout(function () {
        if (String(vm.keySearch).length >= 3) {
          vm.applicantPage = 1
          vm.getApplicantList().then(function(result) {
            vm.totalApplicantSearch = result['total']
            vm.applicantLists = result['data']
          }).catch(function () {
          })
        }
      }, 200)
    },
    clearKeySearch () {
      let vm = this
      vm.keySearch = ''
      setTimeout(function () {
        vm.applicantPage = 1
        vm.getApplicantList().then(function(result) {
          vm.totalApplicantSearch = result['total']
          vm.applicantLists = result['data']
        }).catch(function () {
        })
      }, 200)
    },
    changeTypeSearch () {
      let vm = this
      setTimeout(function () {
        vm.applicantPage = 1
        vm.getApplicantList().then(function(result) {
          vm.totalApplicantSearch = result['total']
          vm.applicantLists = result['data']
        }).catch(function () {
        })
      }, 200)
    },
    changePage (config) {
      let vm = this
      vm.applicantPage = config.page
      vm.getApplicantList().then(function(result) {
        vm.totalApplicantSearch = result['total']
        vm.applicantLists = result['data']
      }).catch(function () {
      })
    },
    bindInfoApplicant (item) {
      let vm = this
      if (vm.typeApplicantBind === 'ChuHoSo') {
        vm.onSearchItemSelected(item)
      } else if (vm.typeApplicantBind === 'NguoiNop') {
        vm.onSearchItemSelected1(item)
      }
      vm.dialog_applicantList = false
    },
    showEditApplicant (item) {
      let vm = this
      vm.applicantEdit = item
      if (vm.cityItems.length === 0) {
        let filterCity = {
          collectionCode: 'ADMINISTRATIVE_REGION',
          level: 0,
          parent: 0,
          commit: ''
        }
        vm.$store.dispatch('loadDictItems', filterCity).then(function (result) {
          vm.cityItems = result.data
        })
      }
      if (vm.applicantEdit['cityCode']) {
        vm.$store.dispatch('loadDictItems', {
          collectionCode: 'ADMINISTRATIVE_REGION',
          level: 1,
          parent: vm.applicantEdit['cityCode']
        }).then(function (resultDistricts) {
          vm.districtItems = resultDistricts.data
        })
      }
      if (vm.applicantEdit['districtCode']) {
        vm.$store.dispatch('loadDictItems', {
          collectionCode: 'ADMINISTRATIVE_REGION',
          level: 1,
          parent: vm.applicantEdit['districtCode']
        }).then(function (resultWards) {
          vm.wardItems = resultWards.data
        })
      }
      if (vm.applicantEdit['applicantIdType'] === 'citizen') {
        vm.titleEdit = "Thông tin công dân"
      } else if (vm.applicantEdit['applicantIdType'] === 'business') {
        vm.titleEdit = "Thông tin tổ chức, doanh nghiệp"
      }
      vm.dialog_editApplicant = true
      vm.$refs.form.resetValidation()
    },
    changeBirthDate () {
      let vm = this
      vm.menuBirthDate = false
      vm.applicantEdit['applicantIdDate'] = vm.formatDate(vm.ngayCap)
    },
    formatDate(date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    getMaxdate () {
      let date = new Date()
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
    },
    parseDateInput (dateInput) {
      if (dateInput) {
        let date = ''
        if (isNaN(dateInput)) {
          date = new Date(dateInput)
        } else {
          date = new Date(Number(dateInput))
        }
        let dateFormated = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
        return dateFormated
      }
    },
    parseDate(date) {
      if (!date) return null
      const [day, month, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    onChangeCityEditApplicant (data) {
      let vm = this
      vm.applicantEdit['cityName'] = vm.cityItems.filter(function (item) {
        return item['itemCode'] === data
      })[0]['itemName']
      let filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 1,
        parent: data
      }
      vm.$store.dispatch('loadDictItems', filter).then(function (result) {
        vm.districtItems = result.data
        vm.wardItems = []
      })
    },
    onChangeDistrictEditApplicant (data) {
      let vm = this
      vm.applicantEdit['districtName'] = vm.districtItems.filter(function (item) {
        return item['itemCode'] === data
      })[0]['itemName']
      let filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 1,
        parent: data
      }
      vm.$store.dispatch('loadDictItems', filter).then(function (result) {
        vm.wardItems = result.data
      })
    },
    onChangeWardEditApplicant (data) {
      let vm = this
      vm.applicantEdit['wardName'] = vm.wardItems.filter(function (item) {
        return item['itemCode'] === data
      })[0]['itemName']
    },
    updateApplicant () {
      let vm = this
      if (vm.$refs.form.validate()) {
        vm.loading = true
        // console.log('user put data', vm.applicantEdit)
        vm.$store.dispatch('putUser', vm.applicantEdit).then(function () {
          toastr.clear()
          toastr.success('Yêu cầu thực hiện thành công')
          vm.dialog_editApplicant = false
        }).catch(function () {
          toastr.clear()
          toastr.error('Yêu cầu thực hiện thất bại')
        })
      }
    },
    exitDialogEditApplicant () {
      let vm = this
      vm.dialog_editApplicant = false
      vm.getApplicantList().then(function(result) {
        vm.totalApplicantSearch = result['total']
        vm.applicantLists = result['data']
      }).catch(function () {
        toastr.error('Không lấy được danh sách công dân, tổ chức, doanh nghiệp')
      })
    },
    fullAddress (address, city, district, ward) {
      let fullAddress = ''
      if (address) {
        fullAddress += (address + ', ')
      }
      if (ward) {
        fullAddress += (ward + ' - ')
      }
      if (district) {
        fullAddress += (district + ' - ')
      }
      if (city) {
        fullAddress += city
      }
      return fullAddress
    }
  }
}
</script>
