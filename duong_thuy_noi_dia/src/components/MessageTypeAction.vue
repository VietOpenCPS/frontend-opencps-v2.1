<template>
  <div v-if="!isKeToan">
    <!-- START NC -->
    <div v-if="documentTypeCode === 'NC' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" 
        v-if="( requestState === 11 || requestState === 27 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '30')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Tiếp nhận bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2" >
          Bổ sung bản khai
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 4, true, 1, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="( requestState === 14 || requestState === 114 ) && messageType === '70'">
        <v-alert :value="true" outline color="info" icon="info" v-if="ghichu != null && ghichu.length > 0" class="mx-4 mb-2">
          {{ghichu}}
        </v-alert>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-else>
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1" v-if="btn_role_status !== 2">
            Chuyển lãnh đạo ký số
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2" v-if="btn_role_status !== 2">
            Duyệt kế hoạch điều động
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3" v-if="btn_role_status !== 2">
            Sửa kế hoạch điều động
          </v-tab>
          <v-tab :key="4" href="#tabthanhphan3" v-if="btn_role_status === 2">
            Cấp kế hoạch điều động
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 11, 14, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 7, -1, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  
                  <jx-hanghai-detail-lenh-dieu-dong
                    :type="type"
                    :document_type_code="documentTypeCode"
                    :document_status_code="documentStatusCode"
                    :document_name="documentName"
                    :document_year="documentYear"
                    ref="lenhDieuDong"
                  >
                  </jx-hanghai-detail-lenh-dieu-dong>

                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 1, 1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>
      
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="requestState === 15 && documentStatusCodeUse !== 19 && documentStatusCodeUse !== 12 && documentStatusCodeUse !== 10 && messageType === '70'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Cấp lại kế hoạch điều động
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Hủy kế hoạch điều động
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 101, 14, true, 2, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 3, 16, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <div v-else-if="documentTypeCode === 'NC' && type === 'thu_tuc'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && messageType === '52'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '20' || messageType === '50' || messageType === '51' || messageType === '53')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Duyệt bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 9, true, 1, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 25">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Yêu cầu xuất trình
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Chấp nhận
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3">
            Yêu cầu bổ sung
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1991, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1993, -1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1992, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 && availablePheDuyet === 0">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Duyệt hoàn thành thủ tục
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Hủy
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 19, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 10, true, 0, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 25">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Xác nhận hoàn thành thủ tục
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Từ chối hoàn thành thủ tục
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 19, true, 0, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <div v-else-if="documentTypeCode === 'NC' && type === 'lanh_dao'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '70'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Trả lại hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Ký số BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 13, -1, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="17"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>

    </div>
    <div v-else-if="documentTypeCode === 'NC' && type === 'van_thu'">

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '70'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Đóng dấu BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="71"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>
    </div>
    <!-- END NC -->
    <!-- START XC -->
    <div v-else-if="documentTypeCode === 'XC' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" 
        v-if="( requestState === 11 || requestState === 27 ) && String(thanhPhanState) === '-1' && messageType === '31'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Tiếp nhận bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2" >
          Bổ sung bản khai
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 4, true, 1, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

    </div>
    <div v-else-if="documentTypeCode === 'XC' && type === 'thu_tuc'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && messageType === '52'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '20' || messageType === '50' || messageType === '51' || messageType === '53')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Duyệt bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 9, true, 1, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014' && thanhPhanState !== 1">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 25">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Yêu cầu xuất trình
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Chấp nhận
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3">
            Yêu cầu bổ sung
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1991, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1993, -1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1992, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 && availablePheDuyet === 0">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Duyệt hoàn thành thủ tục
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Hủy
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 20, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 10, true, 0, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 25">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Xác nhận hoàn thành thủ tục
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Từ chối hoàn thành thủ tục
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 19, true, 0, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="( documentStatusCodeUse === 20 || documentStatusCodeUse === 120 ) && messageType === '60'">
        <v-alert :value="true" outline color="info" icon="info" v-if="ghichu != null && ghichu.length > 0" class="mx-4 mb-2">
          {{ghichu}}
        </v-alert>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-else>
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1" v-if="btn_role_status !== 2">
            Chuyển lãnh đạo ký số
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2" v-if="btn_role_status !== 2">
            Duyệt giấy phép rời cảng
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3" v-if="btn_role_status !== 2">
            Sửa giấy phép rời cảng
          </v-tab>
          <v-tab :key="4" href="#tabthanhphan3" v-if="btn_role_status === 2">
            Cấp giấy phép rời cảng
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 11, 20, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 7, -1, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  
                  <jx-hanghai-detail-giay-phep-roi-cang
                    :port_clearance="port_clearance"
                    :port_clearance_table="port_clearance_table"
                    :document_name="documentName"
                    :document_year="documentYear"
                    :document_type_code="documentTypeCode"
                    ref="giayPhepRoiCang"
                  >
                  </jx-hanghai-detail-giay-phep-roi-cang>

                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1, 1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 19 && messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Cấp lại giấy phép rời cảng
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Hủy giấy phép rời cảng
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 101, 20, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 3, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

    </div>
    <div v-else-if="documentTypeCode === 'XC' && type === 'lanh_dao'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Trả lại hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Ký số BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 13, -1, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="17"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>

    </div>
    <div v-else-if="documentTypeCode === 'XC' && type === 'van_thu'">

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Đóng dấu BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="71"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>
    </div>
    <!-- END XC -->
    <!-- START XC -->
    <div v-else-if="documentTypeCode === '14' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" 
        v-if="( requestState === 11 || requestState === 27 ) && String(thanhPhanState) === '-1' && messageType === '31'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Tiếp nhận bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2" >
          Bổ sung bản khai
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 4, true, 1, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

    </div>
    <div v-else-if="documentTypeCode === '14' && type === 'thu_tuc'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && messageType === '52'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '20' || messageType === '50' || messageType === '51' || messageType === '53')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Duyệt bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 9, true, 1, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014' && thanhPhanState !== 1">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn, chứng chỉ chuyên môn thuyền viên (TNĐ)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 25">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Yêu cầu xuất trình
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Chấp nhận
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3">
            Yêu cầu bổ sung
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1991, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1993, -1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1992, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 && availablePheDuyet === 0">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Duyệt hoàn thành thủ tục
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Hủy
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 20, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 10, true, 0, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 25">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Xác nhận hoàn thành thủ tục
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Từ chối hoàn thành thủ tục
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 19, true, 0, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="( documentStatusCodeUse === 20 || documentStatusCodeUse === 120 ) && messageType === '60'">
        <v-alert :value="true" outline color="info" icon="info" v-if="ghichu != null && ghichu.length > 0" class="mx-4 mb-2">
          {{ghichu}}
        </v-alert>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-else>
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1" v-if="btn_role_status !== 2">
            Chuyển lãnh đạo ký số
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2" v-if="btn_role_status !== 2">
            Duyệt giấy phép vào cảng
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3" v-if="btn_role_status !== 2">
            Sửa giấy phép vào cảng
          </v-tab>
          <v-tab :key="4" href="#tabthanhphan3" v-if="btn_role_status === 2">
            Cấp giấy phép vào cảng
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 11, 20, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 7, -1, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  
                  <jx-hanghai-detail-giay-phep-roi-cang
                    :port_clearance="port_clearance"
                    :port_clearance_table="port_clearance_table"
                    :document_name="documentName"
                    :document_year="documentYear"
                    :document_type_code="documentTypeCode"
                    ref="giayPhepRoiCang"
                  >
                  </jx-hanghai-detail-giay-phep-roi-cang>

                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1, 1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 19 && messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Cấp lại giấy phép vào cảng
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Hủy giấy phép vào cảng
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 101, 20, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 3, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

    </div>
    <div v-else-if="documentTypeCode === '14' && type === 'lanh_dao'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Trả lại hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Ký số BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 13, -1, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="17"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn, chứng chỉ chuyên môn thuyền viên (TNĐ)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>

    </div>
    <div v-else-if="documentTypeCode === '14' && type === 'van_thu'">

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Đóng dấu BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="71"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn, chứng chỉ chuyên môn thuyền viên (TNĐ)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>
    </div>
    <!-- END XC -->
    <!-- START XC -->
    <div v-else-if="documentTypeCode === '15' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" 
        v-if="( requestState === 11 || requestState === 27 ) && String(thanhPhanState) === '-1' && messageType === '31'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Tiếp nhận bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2" >
          Bổ sung bản khai
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 4, true, 1, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

    </div>
    <div v-else-if="documentTypeCode === '15' && type === 'thu_tuc'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && messageType === '52'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '20' || messageType === '50' || messageType === '51' || messageType === '53')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Duyệt bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 9, true, 1, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014' && thanhPhanState !== 1">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn, chứng chỉ chuyên môn thuyền viên (TNĐ)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 25">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Yêu cầu xuất trình
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Chấp nhận
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3">
            Yêu cầu bổ sung
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1991, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1993, -1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1992, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 && availablePheDuyet === 0">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Duyệt hoàn thành thủ tục
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Hủy
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 20, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 10, true, 0, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 25">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Xác nhận hoàn thành thủ tục
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Từ chối hoàn thành thủ tục
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 19, true, 0, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="( documentStatusCodeUse === 20 || documentStatusCodeUse === 120 ) && messageType === '60'">
        <v-alert :value="true" outline color="info" icon="info" v-if="ghichu != null && ghichu.length > 0" class="mx-4 mb-2">
          {{ghichu}}
        </v-alert>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-else>
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1" v-if="btn_role_status !== 2">
            Chuyển lãnh đạo ký số
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2" v-if="btn_role_status !== 2">
            Duyệt giấy phép rời cảng
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3" v-if="btn_role_status !== 2">
            Sửa giấy phép rời cảng
          </v-tab>
          <v-tab :key="4" href="#tabthanhphan3" v-if="btn_role_status === 2">
            Cấp giấy phép rời cảng
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 11, 20, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 7, -1, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  
                  <jx-hanghai-detail-giay-phep-roi-cang
                    :port_clearance="port_clearance"
                    :port_clearance_table="port_clearance_table"
                    :document_name="documentName"
                    :document_year="documentYear"
                    :document_type_code="documentTypeCode"
                    ref="giayPhepRoiCang"
                  >
                  </jx-hanghai-detail-giay-phep-roi-cang>

                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1, 1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 19 && messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Cấp lại giấy phép rời cảng
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Hủy giấy phép rời cảng
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 101, 20, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 3, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

    </div>
    <div v-else-if="documentTypeCode === '15' && type === 'lanh_dao'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Trả lại hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Ký số BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 13, -1, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="17"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn, chứng chỉ chuyên môn thuyền viên (TNĐ)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>

    </div>
    <div v-else-if="documentTypeCode === '15' && type === 'van_thu'">

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Đóng dấu BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="71"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn, chứng chỉ chuyên môn thuyền viên (TNĐ)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>
    </div>
    <!-- END XC -->
    <!-- START QC -->
    <div v-else-if="documentTypeCode === 'QC' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" 
        v-if="( requestState === 11 || requestState === 27 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '32')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Tiếp nhận bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2" >
          Bổ sung bản khai
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 4, true, 1, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="( requestState === 14 || requestState === 114 ) && messageType === '70'">
        <v-alert :value="true" outline color="info" icon="info" v-if="ghichu != null && ghichu.length > 0" class="mx-4 mb-2">
          {{ghichu}}
        </v-alert>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-else>
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1" v-if="btn_role_status !== 2">
            Chuyển lãnh đạo ký số
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2" v-if="btn_role_status !== 2">
            Duyệt kế hoạch điều động
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3" v-if="btn_role_status !== 2">
            Sửa kế hoạch điều động
          </v-tab>
          <v-tab :key="4" href="#tabthanhphan3" v-if="btn_role_status === 2">
            Cấp kế hoạch điều động
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 11, 14, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 7, -1, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  
                  <jx-hanghai-detail-lenh-dieu-dong
                    :type="type"
                    :document_type_code="documentTypeCode"
                    :document_status_code="documentStatusCode"
                    :document_name="documentName"
                    :document_year="documentYear"
                    ref="lenhDieuDong"
                  >
                  </jx-hanghai-detail-lenh-dieu-dong>

                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 1, 1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>
      
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="requestState === 15 && documentStatusCodeUse !== 19 && documentStatusCodeUse !== 12 && documentStatusCodeUse !== 10 && messageType === '70'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Cấp lại kế hoạch điều động
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Hủy kế hoạch điều động
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 101, 14, true, 2, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 3, 16, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <div v-else-if="documentTypeCode === 'QC' && type === 'thu_tuc'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && messageType === '52'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '20' || messageType === '50' || messageType === '51' || messageType === '53')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Duyệt bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 9, true, 1, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 25">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Yêu cầu xuất trình
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Chấp nhận
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3">
            Yêu cầu bổ sung
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1991, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1993, -1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1992, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 && availablePheDuyet === 0">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Duyệt hoàn thành thủ tục
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Hủy
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 20, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 10, true, 0, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 25">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Xác nhận hoàn thành thủ tục
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Từ chối hoàn thành thủ tục
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 19, true, 0, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="( documentStatusCodeUse === 20 || documentStatusCodeUse === 120 ) && messageType === '90'">
        <v-alert :value="true" outline color="info" icon="info" v-if="ghichu != null && ghichu.length > 0" class="mx-4 mb-2">
          {{ghichu}}
        </v-alert>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-else>
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1" v-if="btn_role_status !== 2">
            Chuyển lãnh đạo ký số
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2" v-if="btn_role_status !== 2">
            Duyệt giấy phép quá cảnh
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3" v-if="btn_role_status !== 2">
            Sửa giấy phép quá cảnh
          </v-tab>
          <v-tab :key="4" href="#tabthanhphan3" v-if="btn_role_status === 2">
            Cấp giấy phép quá cảnh
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 11, 20, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 7, -1, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <jx-hanghai-detail-giay-phep-qua-canh
                    :port_clearance="port_clearance"
                    :port_clearance_table="port_clearance_table"
                    :document_name="documentName"
                    :document_year="documentYear"
                    :document_type_code="documentTypeCode"
                    ref="giayPhepQuaCanh"
                  >
                  </jx-hanghai-detail-giay-phep-qua-canh>

                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1, 1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 19 && messageType === '90'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Cấp lại giấy phép quá cảnh
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Hủy giấy phép quá cảnh
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 101, 20, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 3, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

    </div>
    <div v-else-if="documentTypeCode === 'QC' && type === 'lanh_dao'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="((requestState === 14 || requestState === 15) && messageType === '70') || ((documentStatusCodeUse === 19 || documentStatusCodeUse === 20) && messageType === '90')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Trả lại hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Ký số BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 13, -1, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="17"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>

    </div>
    <div v-else-if="documentTypeCode === 'QC' && type === 'van_thu'">

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="((requestState === 14 || requestState === 15) && messageType === '70') || ((documentStatusCodeUse === 19 || documentStatusCodeUse === 20) && messageType === '90')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Đóng dấu BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="71"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>
    </div>
    <!-- END QC -->
    <!-- START TT4 -->
    <div v-else-if="documentTypeCode === '8' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" 
        v-if="( requestState === 11 || requestState === 27 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '30')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Tiếp nhận bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2" >
          Bổ sung bản khai
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 4, true, 1, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="( requestState === 14 || requestState === 114 ) && messageType === '70'">
        <v-alert :value="true" outline color="info" icon="info" v-if="ghichu != null && ghichu.length > 0" class="mx-4 mb-2">
          {{ghichu}}
        </v-alert>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-else>
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1" v-if="btn_role_status !== 2">
            Chuyển lãnh đạo ký số
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2" v-if="btn_role_status !== 2">
            Duyệt kế hoạch điều động
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3" v-if="btn_role_status !== 2">
            Sửa kế hoạch điều động
          </v-tab>
          <v-tab :key="4" href="#tabthanhphan3" v-if="btn_role_status === 2">
            Cấp kế hoạch điều động
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 11, 14, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 7, -1, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  
                  <jx-hanghai-detail-lenh-dieu-dong
                    :type="type"
                    :document_type_code="documentTypeCode"
                    :document_status_code="documentStatusCode"
                    :document_name="documentName"
                    :document_year="documentYear"
                    ref="lenhDieuDong"
                  >
                  </jx-hanghai-detail-lenh-dieu-dong>

                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 1, 1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>
      
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="requestState === 15 && documentStatusCodeUse !== 19 && documentStatusCodeUse !== 12 && documentStatusCodeUse !== 10 && messageType === '70'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Cấp lại kế hoạch điều động
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Hủy kế hoạch điều động
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 101, 14, true, 2, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 3, 16, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <div v-else-if="documentTypeCode === '8' && type === 'thu_tuc'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && messageType === '52'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '20' || messageType === '50' || messageType === '51' || messageType === '53')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Duyệt bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 9, true, 1, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 25">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Yêu cầu xuất trình
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Chấp nhận
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3">
            Yêu cầu bổ sung
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1991, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1993, -1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1992, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 && availablePheDuyet === 0">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Duyệt hoàn thành thủ tục
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Hủy
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 19, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 10, true, 0, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 25">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Xác nhận hoàn thành thủ tục
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Từ chối hoàn thành thủ tục
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 19, true, 0, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <div v-else-if="documentTypeCode === '8' && type === 'lanh_dao'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '70'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Trả lại hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Ký số BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 13, -1, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="17"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>

    </div>
    <div v-else-if="documentTypeCode === '8' && type === 'van_thu'">

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '70'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Đóng dấu BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="71"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>
    </div>
    <!-- END TT4 -->
    <!-- START TT5 -->
    <div v-else-if="documentTypeCode === '9' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" 
        v-if="( requestState === 11 || requestState === 27 ) && String(thanhPhanState) === '-1' && messageType === '31'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Tiếp nhận bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2" >
          Bổ sung bản khai
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 4, true, 1, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <div v-else-if="documentTypeCode === '9' && type === 'thu_tuc'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && messageType === '52'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '20' || messageType === '50' || messageType === '51' || messageType === '53')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Duyệt bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 9, true, 1, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 25">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Yêu cầu xuất trình
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Chấp nhận
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3">
            Yêu cầu bổ sung
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1991, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1993, -1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1992, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 && availablePheDuyet === 0">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Duyệt hoàn thành thủ tục
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Hủy
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 20, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 10, true, 0, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 25">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Xác nhận hoàn thành thủ tục
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Từ chối hoàn thành thủ tục
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 19, true, 0, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="( documentStatusCodeUse === 20 || documentStatusCodeUse === 120 ) && messageType === '60'">
        <v-alert :value="true" outline color="info" icon="info" v-if="ghichu != null && ghichu.length > 0" class="mx-4 mb-2">
          {{ghichu}}
        </v-alert>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-else>
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1" v-if="btn_role_status !== 2">
            Chuyển lãnh đạo ký số
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2" v-if="btn_role_status !== 2">
            Duyệt giấy phép rời cảng
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3" v-if="btn_role_status !== 2">
            Sửa giấy phép rời cảng
          </v-tab>
          <v-tab :key="4" href="#tabthanhphan3" v-if="btn_role_status === 2">
            Cấp giấy phép rời cảng
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 11, 20, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 7, -1, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  
                  <jx-hanghai-detail-giay-phep-roi-cang
                    :port_clearance="port_clearance"
                    :port_clearance_table="port_clearance_table"
                    :document_name="documentName"
                      :document_year="documentYear"
                    ref="giayPhepRoiCang"
                  >
                  </jx-hanghai-detail-giay-phep-roi-cang>

                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1, 1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 19 && messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Cấp lại giấy phép rời cảng
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Hủy giấy phép rời cảng
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 101, 20, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 3, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <div v-else-if="documentTypeCode === '9' && type === 'lanh_dao'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Trả lại hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Ký số BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 13, -1, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="17"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>

    </div>
    <div v-else-if="documentTypeCode === '9' && type === 'van_thu'">

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Đóng dấu BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="71"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>
    </div>
    <!-- END TT5 -->
    <!-- START TT6 -->
    <div v-else-if="documentTypeCode === '10' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" 
        v-if="( requestState === 11 || requestState === 27 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '30')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Tiếp nhận bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2" >
          Bổ sung bản khai
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 4, true, 1, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="( requestState === 14 || requestState === 114 ) && messageType === '70'">
        <v-alert :value="true" outline color="info" icon="info" v-if="ghichu != null && ghichu.length > 0" class="mx-4 mb-2">
          {{ghichu}}
        </v-alert>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-else>
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1" v-if="btn_role_status !== 2">
            Chuyển lãnh đạo ký số
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2" v-if="btn_role_status !== 2">
            Duyệt kế hoạch điều động
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3" v-if="btn_role_status !== 2">
            Sửa kế hoạch điều động
          </v-tab>
          <v-tab :key="4" href="#tabthanhphan3" v-if="btn_role_status === 2">
            Cấp kế hoạch điều động
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 11, 14, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 7, -1, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  
                  <jx-hanghai-detail-lenh-dieu-dong
                    :type="type"
                    :document_type_code="documentTypeCode"
                    :document_status_code="documentStatusCode"
                    :document_name="documentName"
                    :document_year="documentYear"
                    ref="lenhDieuDong"
                  >
                  </jx-hanghai-detail-lenh-dieu-dong>

                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 1, 1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>
      
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="requestState === 15 && documentStatusCodeUse !== 19 && documentStatusCodeUse !== 12 && documentStatusCodeUse !== 10 && messageType === '70'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Cấp lại kế hoạch điều động
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Hủy kế hoạch điều động
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 101, 14, true, 2, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 3, 16, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <div v-else-if="documentTypeCode === '10' && type === 'thu_tuc'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && messageType === '52'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '20' || messageType === '50' || messageType === '51' || messageType === '53')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Duyệt bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 9, true, 1, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 25">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Yêu cầu xuất trình
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Chấp nhận
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3">
            Yêu cầu bổ sung
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1991, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1993, -1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1992, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 && availablePheDuyet === 0">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Duyệt hoàn thành thủ tục
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Hủy
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 19, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 10, true, 0, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 25">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Xác nhận hoàn thành thủ tục
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Từ chối hoàn thành thủ tục
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 19, true, 0, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <div v-else-if="documentTypeCode === '10' && type === 'lanh_dao'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '70'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Trả lại hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Ký số BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 13, -1, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="17"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>

    </div>
    <div v-else-if="documentTypeCode === '10' && type === 'van_thu'">

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '70'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Đóng dấu BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="71"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>
    </div>
    <!-- END TT6 -->
    <!-- START TT7 -->
    <div v-else-if="documentTypeCode === '11' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" 
        v-if="( requestState === 11 || requestState === 27 ) && String(thanhPhanState) === '-1' && messageType === '31'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Tiếp nhận bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2" >
          Bổ sung bản khai
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 4, true, 1, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

    </div>
    <div v-else-if="documentTypeCode === '11' && type === 'thu_tuc'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && messageType === '52'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '20' || messageType === '50' || messageType === '51' || messageType === '53')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Duyệt bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 9, true, 1, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 25">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Yêu cầu xuất trình
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Chấp nhận
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3">
            Yêu cầu bổ sung
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1991, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1993, -1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1992, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 && availablePheDuyet === 0">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Duyệt hoàn thành thủ tục
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Hủy
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 20, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 10, true, 0, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 25">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Xác nhận hoàn thành thủ tục
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Từ chối hoàn thành thủ tục
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 19, true, 0, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="( documentStatusCodeUse === 20 || documentStatusCodeUse === 120 ) && messageType === '60'">
        <v-alert :value="true" outline color="info" icon="info" v-if="ghichu != null && ghichu.length > 0" class="mx-4 mb-2">
          {{ghichu}}
        </v-alert>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-else>
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1" v-if="btn_role_status !== 2">
            Chuyển lãnh đạo ký số
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2" v-if="btn_role_status !== 2">
            Duyệt giấy phép rời cảng
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3" v-if="btn_role_status !== 2">
            Sửa giấy phép rời cảng
          </v-tab>
          <v-tab :key="4" href="#tabthanhphan3" v-if="btn_role_status === 2">
            Cấp giấy phép rời cảng
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 11, 20, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 7, -1, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  
                  <jx-hanghai-detail-giay-phep-roi-cang
                    :port_clearance="port_clearance"
                    :port_clearance_table="port_clearance_table"
                    :document_name="documentName"
                      :document_year="documentYear"
                    ref="giayPhepRoiCang"
                  >
                  </jx-hanghai-detail-giay-phep-roi-cang>

                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1, 1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 19 && messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Cấp lại giấy phép rời cảng
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Hủy giấy phép rời cảng
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 101, 20, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 3, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <div v-else-if="documentTypeCode === '11' && type === 'lanh_dao'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Trả lại hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Ký số BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 13, -1, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="17"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>

    </div>
    <div v-else-if="documentTypeCode === '11' && type === 'van_thu'">

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Đóng dấu BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="71"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>
    </div>
    <!-- END TT7 -->
    <!-- START TT8 -->
    <div v-else-if="documentTypeCode === '4' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" 
        v-if="( requestState === 11 || requestState === 27 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '30')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Tiếp nhận bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2" >
          Bổ sung bản khai
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 4, true, 1, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="( requestState === 14 || requestState === 114 ) && messageType === '70'">
        <v-alert :value="true" outline color="info" icon="info" v-if="ghichu != null && ghichu.length > 0" class="mx-4 mb-2">
          {{ghichu}}
        </v-alert>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-else>
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1" v-if="btn_role_status !== 2">
            Chuyển lãnh đạo ký số
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2" v-if="btn_role_status !== 2">
            Duyệt kế hoạch điều động
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3" v-if="btn_role_status !== 2">
            Sửa kế hoạch điều động
          </v-tab>
          <v-tab :key="4" href="#tabthanhphan3" v-if="btn_role_status === 2">
            Cấp kế hoạch điều động
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 11, 14, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 7, -1, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  
                  <jx-hanghai-detail-lenh-dieu-dong
                    :type="type"
                    :document_type_code="documentTypeCode"
                    :document_status_code="documentStatusCode"
                    :document_name="documentName"
                    :document_year="documentYear"
                    ref="lenhDieuDong"
                  >
                  </jx-hanghai-detail-lenh-dieu-dong>

                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 1, 1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>
      
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="requestState === 15 && documentStatusCodeUse !== 19 && documentStatusCodeUse !== 12 && documentStatusCodeUse !== 10 && messageType === '70'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Cấp lại kế hoạch điều động
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Hủy kế hoạch điều động
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 101, 14, true, 2, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 3, 16, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <div v-else-if="documentTypeCode === '4' && type === 'thu_tuc'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && messageType === '52'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '20' || messageType === '50' || messageType === '51' || messageType === '53')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Duyệt bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 9, true, 1, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 25">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Yêu cầu xuất trình
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Chấp nhận
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3">
            Yêu cầu bổ sung
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1991, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1993, -1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1992, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 && availablePheDuyet === 0">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Duyệt hoàn thành thủ tục
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Hủy
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 19, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 10, true, 0, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 25">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Xác nhận hoàn thành thủ tục
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Từ chối hoàn thành thủ tục
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 19, true, 0, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <div v-else-if="documentTypeCode === '4' && type === 'lanh_dao'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '70'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Trả lại hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Ký số BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 13, -1, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="17"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>

    </div>
    <div v-else-if="documentTypeCode === '4' && type === 'van_thu'">

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '70'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Đóng dấu BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="71"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>
    </div>
    <!-- END TT8 -->
    <!-- START TT9 -->
    <div v-else-if="documentTypeCode === '5' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" 
        v-if="( requestState === 11 || requestState === 27 ) && String(thanhPhanState) === '-1' && messageType === '31'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Tiếp nhận bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2" >
          Bổ sung bản khai
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 4, true, 1, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <div v-else-if="documentTypeCode === '5' && type === 'thu_tuc'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && messageType === '52'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '20' || messageType === '50' || messageType === '51' || messageType === '53')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Duyệt bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 9, true, 1, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014' && thanhPhanState !== 1">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 25">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Yêu cầu xuất trình
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Chấp nhận
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3">
            Yêu cầu bổ sung
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1991, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1993, -1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1992, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 && availablePheDuyet === 0">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Duyệt hoàn thành thủ tục
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Hủy
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 20, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 10, true, 0, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 25">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Xác nhận hoàn thành thủ tục
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Từ chối hoàn thành thủ tục
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 19, true, 0, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="( documentStatusCodeUse === 20 || documentStatusCodeUse === 120 ) && messageType === '60'">
        <v-alert :value="true" outline color="info" icon="info" v-if="ghichu != null && ghichu.length > 0" class="mx-4 mb-2">
          {{ghichu}}
        </v-alert>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-else>
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1" v-if="btn_role_status !== 2">
            Chuyển lãnh đạo ký số
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2" v-if="btn_role_status !== 2">
            Duyệt giấy phép rời cảng
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3" v-if="btn_role_status !== 2">
            Sửa giấy phép rời cảng
          </v-tab>
          <v-tab :key="4" href="#tabthanhphan3" v-if="btn_role_status === 2">
            Cấp giấy phép rời cảng
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 11, 20, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 7, -1, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  
                  <jx-hanghai-detail-giay-phep-roi-cang
                    :port_clearance="port_clearance"
                    :port_clearance_table="port_clearance_table"
                    :document_name="documentName"
                    :document_year="documentYear"
                    :document_type_code="documentTypeCode"
                    ref="giayPhepRoiCang"
                  >
                  </jx-hanghai-detail-giay-phep-roi-cang>

                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1, 1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 19 && messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Cấp lại giấy phép rời cảng
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Hủy giấy phép rời cảng
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 101, 20, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 3, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <div v-else-if="documentTypeCode === '5' && type === 'lanh_dao'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Trả lại hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Ký số BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 13, -1, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="17"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>

    </div>
    <div v-else-if="documentTypeCode === '5' && type === 'van_thu'">

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Đóng dấu BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="71"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>
    </div>
    <!-- END TT9 -->
    <!-- START TT10 -->
    <div v-else-if="documentTypeCode === '12' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" 
        v-if="( requestState === 11 || requestState === 27 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '30')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Tiếp nhận bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2" >
          Bổ sung bản khai
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 4, true, 1, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="( requestState === 14 || requestState === 114 ) && messageType === '70'">
        <v-alert :value="true" outline color="info" icon="info" v-if="ghichu != null && ghichu.length > 0" class="mx-4 mb-2">
          {{ghichu}}
        </v-alert>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-else>
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1" v-if="btn_role_status !== 2">
            Chuyển lãnh đạo ký số
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2" v-if="btn_role_status !== 2">
            Duyệt kế hoạch điều động
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3" v-if="btn_role_status !== 2">
            Sửa kế hoạch điều động
          </v-tab>
          <v-tab :key="4" href="#tabthanhphan3" v-if="btn_role_status === 2">
            Cấp kế hoạch điều động
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 11, 14, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 7, -1, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  
                  <jx-hanghai-detail-lenh-dieu-dong
                    :type="type"
                    :document_type_code="documentTypeCode"
                    :document_status_code="documentStatusCode"
                    :document_name="documentName"
                    :document_year="documentYear"
                    ref="lenhDieuDong"
                  >
                  </jx-hanghai-detail-lenh-dieu-dong>

                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 1, 1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>
      
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="requestState === 15 && documentStatusCodeUse !== 19 && documentStatusCodeUse !== 12 && documentStatusCodeUse !== 10 && messageType === '70'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Cấp lại kế hoạch điều động
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Hủy kế hoạch điều động
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 101, 14, true, 2, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 3, 16, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <div v-else-if="documentTypeCode === '12' && type === 'thu_tuc'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && messageType === '52'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '20' || messageType === '50' || messageType === '51' || messageType === '53')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Duyệt bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 9, true, 1, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 25">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Yêu cầu xuất trình
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Chấp nhận
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3">
            Yêu cầu bổ sung
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1991, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1993, -1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1992, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 && availablePheDuyet === 0">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Duyệt hoàn thành thủ tục
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Hủy
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 19, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 10, true, 0, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 25">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Xác nhận hoàn thành thủ tục
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Từ chối hoàn thành thủ tục
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 19, true, 0, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <div v-else-if="documentTypeCode === '12' && type === 'lanh_dao'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '70'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Trả lại hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Ký số BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 13, -1, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="17"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>

    </div>
    <div v-else-if="documentTypeCode === '12' && type === 'van_thu'">

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '70'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Đóng dấu BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="71"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>
    </div>
    <!-- END TT10 -->
    <!-- START TT11 -->
    <div v-else-if="documentTypeCode === '13' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" 
        v-if="( requestState === 11 || requestState === 27 ) && String(thanhPhanState) === '-1' && messageType === '31'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Tiếp nhận bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2" >
          Bổ sung bản khai
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 4, true, 1, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

    </div>
    <div v-else-if="documentTypeCode === '13' && type === 'thu_tuc'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && messageType === '52'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '20' || messageType === '50' || messageType === '51' || messageType === '53')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Duyệt bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 9, true, 1, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014' && thanhPhanState !== 1">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 25">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Yêu cầu xuất trình
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Chấp nhận
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3">
            Yêu cầu bổ sung
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1991, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1993, -1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1992, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 && availablePheDuyet === 0">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Duyệt hoàn thành thủ tục
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Hủy
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 20, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 10, true, 0, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 25">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Xác nhận hoàn thành thủ tục
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Từ chối hoàn thành thủ tục
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 19, true, 0, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="( documentStatusCodeUse === 20 || documentStatusCodeUse === 120 ) && messageType === '60'">
        <v-alert :value="true" outline color="info" icon="info" v-if="ghichu != null && ghichu.length > 0" class="mx-4 mb-2">
          {{ghichu}}
        </v-alert>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-else>
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1" v-if="btn_role_status !== 2">
            Chuyển lãnh đạo ký số
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2" v-if="btn_role_status !== 2">
            Duyệt giấy phép rời cảng
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3" v-if="btn_role_status !== 2">
            Sửa giấy phép rời cảng
          </v-tab>
          <v-tab :key="4" href="#tabthanhphan3" v-if="btn_role_status === 2">
            Cấp giấy phép rời cảng
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 11, 20, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 7, -1, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  
                  <jx-hanghai-detail-giay-phep-roi-cang
                    :port_clearance="port_clearance"
                    :port_clearance_table="port_clearance_table"
                    :document_name="documentName"
                    :document_year="documentYear"
                    :document_type_code="documentTypeCode"
                    ref="giayPhepRoiCang"
                  >
                  </jx-hanghai-detail-giay-phep-roi-cang>

                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1, 1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 19 && messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Cấp lại giấy phép rời cảng
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Hủy giấy phép rời cảng
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 101, 20, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 3, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

    </div>
    <div v-else-if="documentTypeCode === '13' && type === 'lanh_dao'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Trả lại hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Ký số BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 13, -1, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="17"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>

    </div>
    <div v-else-if="documentTypeCode === '13' && type === 'van_thu'">

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Đóng dấu BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="71"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>
    </div>
    <!-- START NC 16 -->
    <div v-if="documentTypeCode === '16' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" 
        v-if="( requestState === 11 || requestState === 27 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '30')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Tiếp nhận bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2" >
          Bổ sung bản khai
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 4, true, 1, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="( requestState === 14 || requestState === 114 ) && messageType === '70'">
        <v-alert :value="true" outline color="info" icon="info" v-if="ghichu != null && ghichu.length > 0" class="mx-4 mb-2">
          {{ghichu}}
        </v-alert>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-else>
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1" v-if="btn_role_status !== 2">
            Chuyển lãnh đạo ký số
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2" v-if="btn_role_status !== 2">
            Duyệt kế hoạch điều động
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3" v-if="btn_role_status !== 2">
            Sửa kế hoạch điều động
          </v-tab>
          <v-tab :key="4" href="#tabthanhphan3" v-if="btn_role_status === 2">
            Cấp kế hoạch điều động
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 11, 14, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 7, -1, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  
                  <jx-hanghai-detail-lenh-dieu-dong
                    :type="type"
                    :document_type_code="documentTypeCode"
                    :document_status_code="documentStatusCode"
                    :document_name="documentName"
                    :document_year="documentYear"
                    ref="lenhDieuDong"
                  >
                  </jx-hanghai-detail-lenh-dieu-dong>

                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 1, 1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>
      
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="requestState === 15 && documentStatusCodeUse !== 19 && documentStatusCodeUse !== 12 && documentStatusCodeUse !== 10 && messageType === '70'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Cấp lại kế hoạch điều động
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Hủy kế hoạch điều động
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 101, 14, true, 2, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 3, 16, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <div v-else-if="documentTypeCode === '16' && type === 'thu_tuc'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && messageType === '52'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '20' || messageType === '50' || messageType === '51' || messageType === '53')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Duyệt bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 9, true, 1, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 25">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Yêu cầu xuất trình
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Chấp nhận
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3">
            Yêu cầu bổ sung
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1991, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1993, -1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1992, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 && availablePheDuyet === 0">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Duyệt hoàn thành thủ tục
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Hủy
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 19, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 10, true, 0, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 25">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Xác nhận hoàn thành thủ tục
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Từ chối hoàn thành thủ tục
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 19, true, 0, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <div v-else-if="documentTypeCode === '16' && type === 'lanh_dao'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '70'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Trả lại hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Ký số BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 13, -1, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="17"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>

    </div>
    <div v-else-if="documentTypeCode === '16' && type === 'van_thu'">

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '70'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Đóng dấu BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="71"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>
    </div>
    <!-- END NC 16 -->
    <!-- START XC 17 -->
    <div v-else-if="documentTypeCode === '17' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" 
        v-if="( requestState === 11 || requestState === 27 ) && String(thanhPhanState) === '-1' && messageType === '31'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Tiếp nhận bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2" >
          Bổ sung bản khai
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 4, true, 1, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <div v-else-if="documentTypeCode === '17' && type === 'thu_tuc'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && messageType === '52'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '20' || messageType === '50' || messageType === '51' || messageType === '53')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Duyệt bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 9, true, 1, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014' && thanhPhanState !== 1">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 25">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Yêu cầu xuất trình
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Chấp nhận
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3">
            Yêu cầu bổ sung
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1991, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1993, -1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1992, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 && availablePheDuyet === 0">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Duyệt hoàn thành thủ tục
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Hủy
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 20, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 10, true, 0, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 25">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Xác nhận hoàn thành thủ tục
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Từ chối hoàn thành thủ tục
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 19, true, 0, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="( documentStatusCodeUse === 20 || documentStatusCodeUse === 120 ) && messageType === '60'">
        <v-alert :value="true" outline color="info" icon="info" v-if="ghichu != null && ghichu.length > 0" class="mx-4 mb-2">
          {{ghichu}}
        </v-alert>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-else>
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1" v-if="btn_role_status !== 2">
            Chuyển lãnh đạo ký số
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2" v-if="btn_role_status !== 2">
            Duyệt giấy phép rời cảng
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3" v-if="btn_role_status !== 2">
            Sửa giấy phép rời cảng
          </v-tab>
          <v-tab :key="4" href="#tabthanhphan3" v-if="btn_role_status === 2">
            Cấp giấy phép rời cảng
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 11, 20, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 7, -1, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  
                  <jx-hanghai-detail-giay-phep-roi-cang
                    :port_clearance="port_clearance"
                    :port_clearance_table="port_clearance_table"
                    :document_name="documentName"
                    :document_year="documentYear"
                    :document_type_code="documentTypeCode"
                    ref="giayPhepRoiCang"
                  >
                  </jx-hanghai-detail-giay-phep-roi-cang>

                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1, 1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 19 && messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Cấp lại giấy phép rời cảng
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Hủy giấy phép rời cảng
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 101, 20, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 3, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <div v-else-if="documentTypeCode === '17' && type === 'lanh_dao'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Trả lại hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Ký số BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 13, -1, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="17"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>

    </div>
    <div v-else-if="documentTypeCode === '17' && type === 'van_thu'">

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Đóng dấu BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="71"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>
    </div>
    <!-- END XC 17 -->
    <!-- START NC 18 -->
    <div v-if="documentTypeCode === '18' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" 
        v-if="( requestState === 11 || requestState === 27 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '30')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Tiếp nhận bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2" >
          Bổ sung bản khai
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 4, true, 1, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="( requestState === 14 || requestState === 114 ) && messageType === '70'">
        <v-alert :value="true" outline color="info" icon="info" v-if="ghichu != null && ghichu.length > 0" class="mx-4 mb-2">
          {{ghichu}}
        </v-alert>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-else>
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1" v-if="btn_role_status !== 2">
            Chuyển lãnh đạo ký số
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2" v-if="btn_role_status !== 2">
            Duyệt kế hoạch điều động
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3" v-if="btn_role_status !== 2">
            Sửa kế hoạch điều động
          </v-tab>
          <v-tab :key="4" href="#tabthanhphan3" v-if="btn_role_status === 2">
            Cấp kế hoạch điều động
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 11, 14, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 7, -1, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  
                  <jx-hanghai-detail-lenh-dieu-dong
                    :type="type"
                    :document_type_code="documentTypeCode"
                    :document_status_code="documentStatusCode"
                    :document_name="documentName"
                    :document_year="documentYear"
                    ref="lenhDieuDong"
                  >
                  </jx-hanghai-detail-lenh-dieu-dong>

                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 1, 1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>
      
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="requestState === 15 && documentStatusCodeUse !== 19 && documentStatusCodeUse !== 12 && documentStatusCodeUse !== 10 && messageType === '70'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Cấp lại kế hoạch điều động
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Hủy kế hoạch điều động
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 101, 14, true, 2, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, 3, 16, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <div v-else-if="documentTypeCode === '18' && type === 'thu_tuc'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && messageType === '52'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 || documentStatusCodeUse === 18 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '20' || messageType === '50' || messageType === '51' || messageType === '53')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Duyệt bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 9, true, 1, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 25">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Yêu cầu xuất trình
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Chấp nhận
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3">
            Yêu cầu bổ sung
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1991, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1993, -1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1992, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 && availablePheDuyet === 0">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Duyệt hoàn thành thủ tục
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Hủy
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 19, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 10, true, 0, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 25">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Xác nhận hoàn thành thủ tục
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Từ chối hoàn thành thủ tục
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 19, true, 0, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <div v-else-if="documentTypeCode === '18' && type === 'lanh_dao'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '70'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Trả lại hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Ký số BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 13, -1, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="17"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>

    </div>
    <div v-else-if="documentTypeCode === '18' && type === 'van_thu'">

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '70'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Đóng dấu BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="71"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>
    </div>
   <!-- END NC 18 -->
   <!-- START XC 19-->
   <div v-else-if="documentTypeCode === '19' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" 
        v-if="( requestState === 11 || requestState === 27 ) && String(thanhPhanState) === '-1' && messageType === '31'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Tiếp nhận bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2" >
          Bổ sung bản khai
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 4, true, 1, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <div v-else-if="documentTypeCode === '19' && type === 'thu_tuc'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && messageType === '52'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="( documentStatusCodeUse === 12 || documentStatusCodeUse === 25 ) && String(thanhPhanState) === '-1' && (messageType === '10' || messageType === '20' || messageType === '50' || messageType === '51' || messageType === '53')">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Duyệt bản khai
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Bổ sung hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 9, true, 1, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 5, true, 1, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014' && thanhPhanState !== 1">
                <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 25">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Yêu cầu xuất trình
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Chấp nhận
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3">
            Yêu cầu bổ sung
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1991, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1993, -1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1992, -1, true, 2, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
          v-if="documentStatusCodeUse === 12 && availablePheDuyet === 0">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1">
            Duyệt hoàn thành thủ tục
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2">
            Hủy
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 20, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="valid" :ref="activeTab">
                    Nhập lý do <span class="red--text text--darken-3">*</span>:
                    <v-text-field
                      v-model="ykienReject"
                      textarea
                      :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                      required
                    ></v-text-field> 
                    <v-card-actions>
                      <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, -1, 10, true, 0, true)"
                        :loading="loading_process_btn"
                        :disabled="loading_process_btn || !valid"
                      >
                        Xác nhận
                        <span slot="loader">Loading...</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 25">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Xác nhận hoàn thành thủ tục
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Từ chối hoàn thành thủ tục
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                Bạn có muốn tiếp tục xử lý?
                <v-card-actions>
                  <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 19, true, 0, false)"
                    :loading="loading_process_btn"
                    :disabled="loading_process_btn"
                  >
                    Xác nhận
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="( documentStatusCodeUse === 20 || documentStatusCodeUse === 120 ) && messageType === '60'">
        <v-alert :value="true" outline color="info" icon="info" v-if="ghichu != null && ghichu.length > 0" class="mx-4 mb-2">
          {{ghichu}}
        </v-alert>
        <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-else>
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabthanhphan1" v-if="btn_role_status !== 2">
            Chuyển lãnh đạo ký số
          </v-tab>
          <v-tab :key="2" href="#tabthanhphan2" v-if="btn_role_status !== 2">
            Duyệt giấy phép rời cảng
          </v-tab>
          <v-tab :key="3" href="#tabthanhphan3" v-if="btn_role_status !== 2">
            Sửa giấy phép rời cảng
          </v-tab>
          <v-tab :key="4" href="#tabthanhphan3" v-if="btn_role_status === 2">
            Cấp giấy phép rời cảng
          </v-tab>
          <v-tabs-items>
            <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 11, 20, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 7, -1, true, 0, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tabthanhphan3" reverse-transition="fade-transition" transition="fade-transition">
              <v-card flat>
                <v-card-text>
                  
                  <jx-hanghai-detail-giay-phep-roi-cang
                    :port_clearance="port_clearance"
                    :port_clearance_table="port_clearance_table"
                    :document_name="documentName"
                    :document_year="documentYear"
                    :document_type_code="documentTypeCode"
                    ref="giayPhepRoiCang"
                  >
                  </jx-hanghai-detail-giay-phep-roi-cang>

                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 1, 1, true, 2, false)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="documentStatusCodeUse === 19 && messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Cấp lại giấy phép rời cảng
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Hủy giấy phép rời cảng
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 101, 20, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 3, 10, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <div v-else-if="documentTypeCode === '19' && type === 'lanh_dao'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Trả lại hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tabthanhphan2">
          Ký số BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <v-form v-model="valid" :ref="activeTab">
                  Nhập lý do <span class="red--text text--darken-3">*</span>:
                  <v-text-field
                    v-model="ykienReject"
                    textarea
                    :rules="[v => !!v || 'lý do bắt buộc phải nhập']"
                    required
                  ></v-text-field> 
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messageType, 13, -1, true, 0, true)"
                      :loading="loading_process_btn"
                      :disabled="loading_process_btn || !valid"
                    >
                      Xác nhận
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabthanhphan2" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="17"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>

    </div>
    <div v-else-if="documentTypeCode === '19' && type === 'van_thu'">

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false"
        v-if="messageType === '60'">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabthanhphan1">
          Đóng dấu BCY
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tabthanhphan1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                <jx-hanghai-crypto
                  :messagetype="messageType"
                  :actiontype="71"
                  @kyso-submit-func="kySoFUNC" ref="kysocrypto" ></jx-hanghai-crypto>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>

      <div v-if="messageType === '2014'">
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Danh sách giấy tờ xuất trình cho phương tiện"
          name_column_1=""
          :items="itemsGiayToXuatTrinhChoPhuongTien"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận khả năng chuyên môn thuyền viên làm việc trên tàu biển Việt Nam"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_39"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Sổ thuyền viên"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_40"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Các Giấy xác nhận việc cấp Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng tổng quát (GOC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_48"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận vô tuyến điện viên hệ GMDSS hạng hạn chế (ROC)"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_49"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
        <jx-hanghai-detail-giay-to-xuat-trinh
          title_name="Giấy chứng nhận xác nhận giấy huấn luyện nghiệp vụ đặc biệt cho tàu chuyên dùng"
          name_column_1="Thuyền viên"
          :items="itemsGiayToXuatTrinh_50"
        ></jx-hanghai-detail-giay-to-xuat-trinh>
      </div>

      <div v-if="messageType === '23'">
        <jx-hanghai-detail-ket-qua-xac-nhan
          :document_name="documentName"
          :document_year="documentYear"
          :document_type="documentTypeCode"
          :type="type"
          :thanh_phan_lists="thanhPhanLists"
          thanh_phan_code="NC_1,NC_6,NC_7,NC_9"
          :detail_model="detail"
          ref="hanghaidetailxacnhan"
        >
        </jx-hanghai-detail-ket-qua-xac-nhan>
      </div>
    </div>
     <!-- END XC 19 -->
    <object id="plugin0" type="application/x-cryptolib05plugin" width="0" height="0"></object>

  </div>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
import toastr from 'toastr'
// import { eventBus } from '../event-bus/eventBus.js'
import LenhDieuDongForm from './hang_hai/hanghai_detail_lenh_dieu_dong.vue'
import GiayToXuatTrinhForm from './hang_hai/hanghai_detail_giay_to_xuat_trinh.vue'
import KetQuaXacNhanForm from './hang_hai/hanghai_detail_ket_qua_xac_nhan.vue'
import GiayPhepRoiCangForm from './hang_hai/hanghai_detail_giay_phep_roi_cang.vue'
import GiayPhepQuaCanhForm from './hang_hai/hanghai_detail_giay_phep_qua_canh.vue'
import HHCrypto from './hang_hai/hanghai_crypto.vue'

function plugin0 () {
  return document.getElementById('plugin0')
}
var plugin = plugin0

export default {
  props: ['type', 'documentName', 'documentYear', 'documentTypeCode', 'documentStatusCode', 'messageType', 'requestCode', 'state'],
  components: {
    'jx-hanghai-detail-lenh-dieu-dong': LenhDieuDongForm,
    'jx-hanghai-detail-giay-to-xuat-trinh': GiayToXuatTrinhForm,
    'jx-hanghai-detail-ket-qua-xac-nhan': KetQuaXacNhanForm,
    'jx-hanghai-detail-giay-phep-roi-cang': GiayPhepRoiCangForm,
    'jx-hanghai-detail-giay-phep-qua-canh': GiayPhepQuaCanhForm,
    'jx-hanghai-crypto': HHCrypto
  },
  data: () => ({
    loading_process_btn: false,
    initData: null,
    detail: null,
    activeTab: 0,
    ykienReject: '',
    ykien: '',
    FileServer: '',
    sign: null,
    signFieldName: '',
    filePath: '',
    valid: true,
    requestState: '',
    documentStatusCodeUse: '',
    ghichu: '',
    thanhPhanState: -1,
    btn_role_status: 2,
    availablePheDuyet: 0,
    getLenhDieuDongEXT: '',
    userSigns: [],
    callBack: true,
    callBackInit: true,
    getGiayToXuatTrinhPhuongTien: '',
    getGiayToXuatTrinh_39: '',
    getGiayToXuatTrinh_40: '',
    getGiayToXuatTrinh_48: '',
    getGiayToXuatTrinh_49: '',
    getGiayToXuatTrinh_50: '',
    getMessageType60EXT: '',
    getMessageType90EXT: '',
    getMessageType60EXTTable: '',
    getMessageType60EXTTableQC: '',
    getMessageType23EXT: '',
    getComputerHash: '',
    itemsGiayToXuatTrinhChoPhuongTien: [],
    itemsGiayToXuatTrinh_39: [],
    itemsGiayToXuatTrinh_40: [],
    itemsGiayToXuatTrinh_48: [],
    itemsGiayToXuatTrinh_49: [],
    itemsGiayToXuatTrinh_50: [],
    thanhPhanLists: [],
    port_clearance: {},
    port_clearance_table: [],
    customMessage: '',
    cryptoFlag: 2,
    signLocation: '',
    isKeToan: false
  }),
  beforeCreate () {
    let vm = this
    vm.$nextTick(function () {
      let filter = {
        'documentType': vm.documentTypeCode,
        'documentName': vm.documentName,
        'documentYear': vm.documentYear,
        'messageType': vm.messageType,
        'REQUEST_CODE': vm.requestCode
      }
      if (vm.type === 'ke_hoach') {
        filter['roleType'] = -1
      } else if (vm.type === 'thu_tuc') {
        filter['roleType'] = -2
      } else if (vm.type === 'lanh_dao') {
        filter['roleType'] = -3
      } else if (vm.type === 'van_thu') {
        filter['roleType'] = -4
      }
      vm.$store.dispatch('loadUserSigns', filter).then(function (result) {
        vm.userSigns = result.userSigns
        vm.btn_role_status = result.data
      })
      vm.$store.dispatch('loadInitResource').then(function (result) {
        vm.initData = result
        vm.thanhPhanState = vm.state
        if (vm.initData != null) {
          vm.getLenhDieuDongEXT = vm.initData.getLenhDieuDongEXT
          vm.getGiayToXuatTrinhPhuongTien = vm.initData.getGiayToXuatTrinhPhuongTien
          vm.getGiayToXuatTrinh_39 = vm.initData.getGiayToXuatTrinh_39
          vm.getGiayToXuatTrinh_40 = vm.initData.getGiayToXuatTrinh_40
          vm.getGiayToXuatTrinh_48 = vm.initData.getGiayToXuatTrinh_48
          vm.getGiayToXuatTrinh_49 = vm.initData.getGiayToXuatTrinh_49
          vm.getGiayToXuatTrinh_50 = vm.initData.getGiayToXuatTrinh_50
          vm.getMessageType60EXT = vm.initData.getMessageType60EXT
          vm.getMessageType90EXT = vm.initData.getMessageType90EXT
          vm.getMessageType60EXTTable = vm.initData.getMessageType60EXTTable
          vm.getMessageType60EXTTableQC = vm.initData.getMessageType60EXTTableQC
          vm.getComputerHash = vm.initData.getComputerHash
          vm.getThanhPhanHoSo = vm.initData.getThanhPhanHoSo
          vm.getMessageType23EXT = vm.initData.getThanhPhanHoSo
          vm.getThanhPhan()
        }
        setTimeout(() => {
          vm.detail = vm.$parent.pullDetail()
          vm.requestState = vm.detail.requestState
          vm.documentStatusCodeUse = vm.detail.documentStatusCode
          vm.ghichu = vm.detail.ghichu
          let kysocrypto = vm.$refs.kysocrypto
          if (kysocrypto !== null && kysocrypto !== undefined && kysocrypto !== 'undefined') {
            vm.process_ky_so()
          }
        }, 500)
      })
    })
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      vm.$store.dispatch('loadInitResource').then(function (result) {
        let initData = result
        vm.isKeToan = initData.user.isKeToan
      })
    })
  },
  updated () {
    let vm = this
    vm.$nextTick(function () {
      let filter = {
        'documentType': vm.documentTypeCode,
        'documentName': vm.documentName,
        'documentYear': vm.documentYear,
        'messageType': vm.messageType,
        'REQUEST_CODE': vm.requestCode
      }
      if (vm.type === 'ke_hoach') {
        filter['roleType'] = -1
      } else if (vm.type === 'thu_tuc') {
        filter['roleType'] = -2
      } else if (vm.type === 'lanh_dao') {
        filter['roleType'] = -3
      } else if (vm.type === 'van_thu') {
        filter['roleType'] = -4
      }
      vm.$store.dispatch('loadUserSigns', filter).then(function (result) {
        vm.userSigns = result.userSigns
        vm.btn_role_status = result.data
      })
      if (vm.messageType === '90' && vm.callBack) {
        vm.callBack = false
        vm.detail = vm.$parent.pullDetail()
        setTimeout(() => {
          let giayPhepQuaCanh = vm.$refs.giayPhepQuaCanh
          if (giayPhepQuaCanh !== null && giayPhepQuaCanh !== undefined && giayPhepQuaCanh !== 'undefined') {
            vm.process_all_giay_phep_qua()
          }
          let kysocrypto = vm.$refs.kysocrypto
          if (kysocrypto !== null && kysocrypto !== undefined && kysocrypto !== 'undefined') {
            vm.process_ky_so()
          }
        }, 300)
      }
      if (vm.messageType === '60' && vm.callBack) {
        vm.callBack = false
        vm.detail = vm.$parent.pullDetail()
        setTimeout(() => {
          let giayPhepRoiCang = vm.$refs.giayPhepRoiCang
          if (giayPhepRoiCang !== null && giayPhepRoiCang !== undefined && giayPhepRoiCang !== 'undefined') {
            vm.process_all_giay_phep_roi()
          }
          let kysocrypto = vm.$refs.kysocrypto
          if (kysocrypto !== null && kysocrypto !== undefined && kysocrypto !== 'undefined') {
            vm.process_ky_so()
          }
        }, 300)
      }
      if (vm.messageType === '23') {
        vm.detail = vm.$parent.pullDetail()
        setTimeout(() => {
          let hanghaidetailxacnhan = vm.$refs.hanghaidetailxacnhan
          if (hanghaidetailxacnhan !== null && hanghaidetailxacnhan !== undefined && hanghaidetailxacnhan !== 'undefined') {
            if (hanghaidetailxacnhan.detail_model !== null && hanghaidetailxacnhan.detail_model !== undefined && hanghaidetailxacnhan.detail_model['maritimeName'] !== '') {
            } else {
              hanghaidetailxacnhan.loadXacNhanDetail(vm.detail, vm.thanhPhanLists)
            }
          }
        }, 300)
      }
      if (vm.messageType === '2014' && vm.callBack) {
        vm.callBack = false
        setTimeout(() => {
          vm.process_all_giay_to()
        }, 300)
      }
      if (vm.messageType === '70' && vm.callBack) {
        vm.callBack = false
        setTimeout(() => {
          let lenhDieuDong = vm.$refs.lenhDieuDong
          if (lenhDieuDong !== null && lenhDieuDong !== undefined && lenhDieuDong !== 'undefined') {
            vm.process_lenh_dieu_dong()
          }
          let kysocrypto = vm.$refs.kysocrypto
          if (kysocrypto !== null && kysocrypto !== undefined && kysocrypto !== 'undefined') {
            vm.process_ky_so()
          }
        }, 300)
      }
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      vm.thanhPhanState = newRoute.params.state
      let filter = {
        'documentType': vm.documentTypeCode,
        'documentName': vm.documentName,
        'documentYear': vm.documentYear,
        'messageType': vm.messageType,
        'REQUEST_CODE': vm.requestCode
      }
      if (vm.type === 'ke_hoach') {
        filter['roleType'] = -1
      } else if (vm.type === 'thu_tuc') {
        filter['roleType'] = -2
      } else if (vm.type === 'lanh_dao') {
        filter['roleType'] = -3
      } else if (vm.type === 'van_thu') {
        filter['roleType'] = -4
      }
      vm.$store.dispatch('loadUserSigns', filter).then(function (result) {
        vm.userSigns = result.userSigns
        vm.btn_role_status = result.data
      })
      if (vm.messageType === '90') {
        setTimeout(() => {
          let giayPhepQuaCanh = vm.$refs.giayPhepQuaCanh
          if (giayPhepQuaCanh !== null && giayPhepQuaCanh !== undefined && giayPhepQuaCanh !== 'undefined') {
            vm.process_all_giay_phep_qua()
          }
          let kysocrypto = vm.$refs.kysocrypto
          if (kysocrypto !== null && kysocrypto !== undefined && kysocrypto !== 'undefined') {
            vm.process_ky_so()
          }
        }, 300)
      }
      if (vm.messageType === '60') {
        setTimeout(() => {
          let giayPhepRoiCang = vm.$refs.giayPhepRoiCang
          if (giayPhepRoiCang !== null && giayPhepRoiCang !== undefined && giayPhepRoiCang !== 'undefined') {
            vm.process_all_giay_phep_roi()
          }
          let kysocrypto = vm.$refs.kysocrypto
          if (kysocrypto !== null && kysocrypto !== undefined && kysocrypto !== 'undefined') {
            vm.process_ky_so()
          }
        }, 300)
      }
      if (vm.messageType === '23') {
        setTimeout(() => {
          console.log('23', vm.detail)
          let hanghaidetailxacnhan = vm.$refs.hanghaidetailxacnhan
          if (hanghaidetailxacnhan !== null && hanghaidetailxacnhan !== undefined && hanghaidetailxacnhan !== 'undefined') {
            hanghaidetailxacnhan.loadXacNhanDetail(vm.detail, vm.thanhPhanLists)
          }
        }, 300)
      }
      if (vm.messageType === '2014') {
        setTimeout(() => {
          vm.process_all_giay_to()
        }, 300)
      }
      if (vm.messageType === '70') {
        setTimeout(() => {
          let lenhDieuDong = vm.$refs.lenhDieuDong
          if (lenhDieuDong !== null && lenhDieuDong !== undefined && lenhDieuDong !== 'undefined') {
            vm.process_lenh_dieu_dong()
          }
          let kysocrypto = vm.$refs.kysocrypto
          if (kysocrypto !== null && kysocrypto !== undefined && kysocrypto !== 'undefined') {
            vm.process_ky_so()
          }
        }, 300)
      }
    }
  },
  methods: {
    changeTabs: function () {
      this.ykienReject = ''
      this.ykien = ''
      let vm = this
      if (vm.messageType === '90') {
        setTimeout(() => {
          let giayPhepQuaCanh = vm.$refs.giayPhepQuaCanh
          if (giayPhepQuaCanh !== null && giayPhepQuaCanh !== undefined && giayPhepQuaCanh !== 'undefined') {
            vm.process_all_giay_phep_qua()
          }
          let kysocrypto = vm.$refs.kysocrypto
          if (kysocrypto !== null && kysocrypto !== undefined && kysocrypto !== 'undefined') {
            vm.process_ky_so()
          }
        }, 300)
      }
      if (vm.messageType === '60') {
        setTimeout(() => {
          let giayPhepRoiCang = vm.$refs.giayPhepRoiCang
          if (giayPhepRoiCang !== null && giayPhepRoiCang !== undefined && giayPhepRoiCang !== 'undefined') {
            vm.process_all_giay_phep_roi()
          }
          let kysocrypto = vm.$refs.kysocrypto
          if (kysocrypto !== null && kysocrypto !== undefined && kysocrypto !== 'undefined') {
            vm.process_ky_so()
          }
        }, 300)
      }
      if (vm.messageType === '70') {
        setTimeout(() => {
          let lenhDieuDong = vm.$refs.lenhDieuDong
          if (lenhDieuDong !== null && lenhDieuDong !== undefined && lenhDieuDong !== 'undefined') {
            vm.process_lenh_dieu_dong()
          }
          let kysocrypto = vm.$refs.kysocrypto
          if (kysocrypto !== null && kysocrypto !== undefined && kysocrypto !== 'undefined') {
            vm.process_ky_so()
          }
        }, 300)
      }
    },
    callActionKeHoachAllInOneURL: function (item, messageType, actionType, desStatus, isConfirm, returnState, isValidate) {
      let vm = this
      if ((vm.$refs[vm.activeTab] != null && vm.$refs[vm.activeTab].validate()) || !isValidate) {
        if (isConfirm) {
          let x = confirm('Bạn có muốn thực hiện hành động này?')
          if (x) {
            vm._actionKeHoachAllInOneURL(item, messageType, actionType, desStatus, returnState)
          } else {
            return false
          }
        } else {
          vm._actionKeHoachAllInOneURL(item, messageType, actionType, desStatus, returnState)
        }
      } else {
        alert('lý do bắt buộc phải nhập')
      }
    },
    callActionThuTucAllInOneURL: function (item, messageType, actionType, desStatus, isConfirm, returnState, isValidate) {
      let vm = this
      if ((vm.$refs[vm.activeTab] != null && vm.$refs[vm.activeTab].validate()) || !isValidate) {
        if (isConfirm) {
          let x = confirm('Bạn có muốn thực hiện hành động này?')
          if (x) {
            vm._actionThuTucAllInOneURL(item, messageType, actionType, desStatus, returnState)
          } else {
            return false
          }
        } else {
          vm._actionThuTucAllInOneURL(item, messageType, actionType, desStatus, returnState)
        }
      } else {
        alert('lý do bắt buộc phải nhập')
      }
    },
    _actionKeHoachAllInOneURL: function (item, messageType, actionType, desStatus, returnState) {
      let vm = this
      let configParam = {
      }
      let params = new FormData()
      params.append('DOCUMENT_NAME', item.documentName)
      params.append('DOCUMENT_YEAR', item.documentYear)
      params.append('MESSAGE_TYPE', messageType)
      params.append('ACTION_TYPE', actionType)
      params.append('DOCUMENT_YEAR', item.documentYear)
      params.append('REQUEST_STATE', vm.requestState)
      params.append('DOCUMENT_TYPE', vm.detail.documentTypeCode)
      params.append('DOCUMENT_STATUS_CODE', vm.documentStatusCode)
      params.append('DES_STATUS', desStatus)
      params.append('REQUEST_CODE', vm.requestCode)
      params.append('ykienReject', vm.ykienReject)
      params.append('sign', vm.sign)
      params.append('signFieldName', vm.signFieldName)
      params.append('filePath', vm.filePath)
      params.append('signLocation', vm.signLocation)
      if (vm.FileServer) {
        params.append('FileServer', vm.FileServer)
      }
      let lenhDieuDong = vm.$refs.lenhDieuDong
      let isOkSubmit = true
      if (messageType === '70' && vm.type !== 'van_thu' && vm.type !== 'lanh_dao') {
        if (lenhDieuDong !== null && lenhDieuDong !== undefined && lenhDieuDong !== 'undefined') {
          params.append('representative', lenhDieuDong.giamDoc.representative)
          params.append('shiftingDate', lenhDieuDong.shiftingDate)
          params.append('tugBoat', lenhDieuDong.detail_shifting.tugBoat)
          params.append('nameOfShip', lenhDieuDong.detail_shifting.nameOfShip)
          params.append('shownDraftxF', lenhDieuDong.detail_shifting.shownDraftxF)
          params.append('shownDraftxA', lenhDieuDong.detail_shifting.shownDraftxA)
          params.append('from', lenhDieuDong.detail_shifting.from)
          params.append('anchoringPortCode', JSON.stringify(lenhDieuDong.detail_shifting.anchoringPortCode))
          params.append('portHarbourCode', JSON.stringify(lenhDieuDong.detail_shifting.portHarbourCode))
          params.append('shiftingPortWharfCode', JSON.stringify(lenhDieuDong.detail_shifting.shiftingPortWharfCode))
          params.append('dwt', lenhDieuDong.detail_shifting.dwt)
          params.append('loa', lenhDieuDong.detail_shifting.loa)
          params.append('chanel', JSON.stringify(lenhDieuDong.chanel))
          isOkSubmit = lenhDieuDong.doValidate()
          console.log('isOKSUBMIT:', isOkSubmit)
        }
      }
      if (isOkSubmit) {
        vm.loading_process_btn = true
        axios.post(
          vm.initData.actionKeHoachAllInOneURL,
          params,
          configParam
        ).then(function (response) {
          vm.loading_process_btn = false
          vm.requestState = desStatus
          toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          if ((messageType === '70' || messageType === '60' || messageType === '90') && (vm.type === 'ke_hoach' || vm.type === 'thu_tuc' || vm.type === 'lanh_dao')) {
            window.location.reload(true)
          } else {
            vm.$router.push({ path: '/ho-so/' + vm.type + '/' + vm.documentName + '/' + vm.documentYear + '/' + vm.documentTypeCode + '/' + desStatus,
              query: {
                'renew': 1
              }
            })
          }
          let kysocrypto = vm.$refs.kysocrypto
          if (kysocrypto !== null && kysocrypto !== undefined && kysocrypto !== 'undefined') {
            kysocrypto.loading_process_btn = false
          }
        }).catch(function (error) {
          console.log(error)
          vm.loading_process_btn = false
          toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          let kysocrypto = vm.$refs.kysocrypto
          if (kysocrypto !== null && kysocrypto !== undefined && kysocrypto !== 'undefined') {
            kysocrypto.loading_process_btn = false
          }
        })
      } else {
        alert('Trường thông tin (*) bắt buộc phải nhập.')
      }
    },
    _actionThuTucAllInOneURL: function (item, messageType, actionType, desStatus, returnState) {
      let vm = this
      let hanghaidetailxacnhan = vm.$refs.hanghaidetailxacnhan
      let configParam = {
      }
      let params = new FormData()
      params.append('DOCUMENT_NAME', item.documentName)
      params.append('DOCUMENT_YEAR', item.documentYear)
      params.append('MESSAGE_TYPE', messageType)
      params.append('ACTION_TYPE', actionType)
      params.append('DOCUMENT_YEAR', item.documentYear)
      params.append('REQUEST_STATE', vm.requestState)
      params.append('DOCUMENT_TYPE', vm.detail.documentTypeCode)
      params.append('DOCUMENT_STATUS_CODE', vm.documentStatusCode)
      params.append('DES_STATUS', desStatus)
      params.append('REQUEST_CODE', vm.requestCode)
      params.append('ykienReject', vm.ykienReject)
      params.append('sign', vm.sign)
      params.append('signFieldName', vm.signFieldName)
      params.append('filePath', vm.filePath)
      params.append('signLocation', vm.signLocation)
      if (vm.FileServer) {
        params.append('FileServer', vm.FileServer)
      }
      let giayPhepRoiCang = vm.$refs.giayPhepRoiCang
      let giayPhepQuaCanh = vm.$refs.giayPhepQuaCanh
      let isOkSubmit = true
      if (messageType === '60' && vm.type !== 'van_thu' && vm.type !== 'lanh_dao' && giayPhepRoiCang != null) {
        if (giayPhepRoiCang !== null && giayPhepRoiCang !== undefined && giayPhepRoiCang !== 'undefined') {
          params.append('representative', giayPhepRoiCang.giamDoc.representative)
          params.append('detail_clearance', JSON.stringify(giayPhepRoiCang.detail_clearance))
          params.append('detail_clearance_data', JSON.stringify(giayPhepRoiCang.khaiBaoItems))
          params.append('timeOfDeparture', moment(giayPhepRoiCang.timeOfDeparture, 'DD/MM/YYYY HH:mm').add(7, 'hours').toDate().toISOString())
          params.append('timeOfValidUntil', moment(giayPhepRoiCang.timeOfValidUntil, 'DD/MM/YYYY HH:mm').add(7, 'hours').toDate().toISOString())
          params.append('issueDate', moment(giayPhepRoiCang.issueDate, 'DD/MM/YYYY HH:mm').add(7, 'hours').toDate().toISOString())
          isOkSubmit = giayPhepRoiCang.doValidate()
        }
      }
      if (messageType === '90' && vm.type !== 'van_thu' && vm.type !== 'lanh_dao' && giayPhepQuaCanh != null) {
        if (giayPhepQuaCanh !== null && giayPhepQuaCanh !== undefined && giayPhepQuaCanh !== 'undefined') {
          params.append('representative', giayPhepQuaCanh.giamDoc.representative)
          params.append('detail_clearance', JSON.stringify(giayPhepQuaCanh.detail_clearance))
          params.append('detail_clearance_data', JSON.stringify(giayPhepQuaCanh.khaiBaoItems))
          params.append('timeOfDeparture', moment(giayPhepQuaCanh.timeOfDeparture, 'DD/MM/YYYY HH:mm').add(7, 'hours').toDate().toISOString())
          params.append('timeOfValidUntil', moment(giayPhepQuaCanh.timeOfValidUntil, 'DD/MM/YYYY HH:mm').add(7, 'hours').toDate().toISOString())
          params.append('issueDate', moment(giayPhepQuaCanh.issueDate, 'DD/MM/YYYY HH:mm').add(7, 'hours').toDate().toISOString())
          isOkSubmit = giayPhepQuaCanh.doValidate()
        }
      }
      if (messageType === '2014') {
        params.append('itemsGiayToXuatTrinhChoPhuongTien', JSON.stringify(vm.itemsGiayToXuatTrinhChoPhuongTien))
        params.append('itemsGiayToXuatTrinh_39', JSON.stringify(vm.itemsGiayToXuatTrinh_39))
        params.append('itemsGiayToXuatTrinh_40', JSON.stringify(vm.itemsGiayToXuatTrinh_40))
      }
      if ((messageType === '23' || messageType === '1985') && hanghaidetailxacnhan !== null && hanghaidetailxacnhan !== undefined && hanghaidetailxacnhan !== 'undefined') {
        params.append('soChungNhan', hanghaidetailxacnhan.soChungNhan)
        params.append('ngayPheDuyet', moment(hanghaidetailxacnhan.ngayPheDuyet, 'DD/MM/YYYY HH:mm').add(7, 'hours').toDate().toISOString())
        params.append('lePhi', hanghaidetailxacnhan.lePhi)
        isOkSubmit = hanghaidetailxacnhan.doValidate()
        if (desStatus === 10 || desStatus === '10') {
          isOkSubmit = true
        }
      }
      if (isOkSubmit) {
        vm.loading_process_btn = true
        axios.post(
          vm.initData.actionThuTucAllInOneURL,
          params,
          configParam
        ).then(function (response) {
          vm.loading_process_btn = false
          vm.documentStatusCodeUse = desStatus
          toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          if ((messageType === '70' || messageType === '60' || messageType === '90') && (vm.type === 'ke_hoach' || vm.type === 'thu_tuc')) {
            window.location.reload(true)
          } else {
            vm.$router.push({ path: '/ho-so/' + vm.type + '/' + vm.documentName + '/' + vm.documentYear + '/' + vm.documentTypeCode + '/' + desStatus,
              query: {
                'renew': 1
              }
            })
          }
          let kysocrypto = vm.$refs.kysocrypto
          if (kysocrypto !== null && kysocrypto !== undefined && kysocrypto !== 'undefined') {
            kysocrypto.loading_process_btn = false
          }
        }).catch(function (error) {
          console.log(error)
          vm.loading_process_btn = false
          toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          let kysocrypto = vm.$refs.kysocrypto
          if (kysocrypto !== null && kysocrypto !== undefined && kysocrypto !== 'undefined') {
            kysocrypto.loading_process_btn = false
          }
        })
      } else {
        if ((messageType === '23' || messageType === '1985') && hanghaidetailxacnhan !== null && hanghaidetailxacnhan !== undefined && hanghaidetailxacnhan !== 'undefined') {
          alert('Kiểm tra thông tin đối chiếu hồ sơ, trường thông tin (*) bắt buộc phải nhập.')
        } else {
          alert('Trường thông tin (*) bắt buộc phải nhập.')
        }
      }
    },
    process_lenh_dieu_dong: function () {
      let vm = this
      let lenhDieuDong = vm.$refs.lenhDieuDong
      let config = {
        params: {
          documentName: vm.documentName,
          documentYear: vm.documentYear
        }
      }
      axios
        .get(vm.getLenhDieuDongEXT, config)
        .then(function (response) {
          let serializable = response.data
          console.log("serializable: " , serializable)
          console.log("vm.userSigns: " , vm.userSigns)
          serializable['userSigns'] = vm.userSigns
          lenhDieuDong.bindData(serializable)
        })
        .catch(function (error) {
          console.log(error)
          lenhDieuDong.clearLoading()
        })
    },
    process_all_giay_to: function () {
      let vm = this
      let config = {
        params: {
          documentName: vm.documentName,
          documentYear: vm.documentYear,
          documentTypeCode: vm.documentTypeCode
        }
      }
      axios
        .get(vm.getGiayToXuatTrinhPhuongTien, config)
        .then(function (response) {
          let serializable = response.data
          vm.itemsGiayToXuatTrinhChoPhuongTien = serializable
        })
        .catch(function (error) {
          console.log(error)
        })
      axios
        .get(vm.getGiayToXuatTrinh_39, config)
        .then(function (response) {
          let serializable = response.data
          vm.itemsGiayToXuatTrinh_39 = serializable
        })
        .catch(function (error) {
          console.log(error)
        })
      axios
        .get(vm.getGiayToXuatTrinh_40, config)
        .then(function (response) {
          let serializable = response.data
          vm.itemsGiayToXuatTrinh_40 = serializable
        })
        .catch(function (error) {
          console.log(error)
        })
      axios
        .get(vm.getGiayToXuatTrinh_48, config)
        .then(function (response) {
          let serializable = response.data
          vm.itemsGiayToXuatTrinh_48 = serializable
        })
        .catch(function (error) {
          console.log(error)
        })
      axios
        .get(vm.getGiayToXuatTrinh_49, config)
        .then(function (response) {
          let serializable = response.data
          vm.itemsGiayToXuatTrinh_49 = serializable
        })
        .catch(function (error) {
          console.log(error)
        })
      axios
        .get(vm.getGiayToXuatTrinh_50, config)
        .then(function (response) {
          let serializable = response.data
          vm.itemsGiayToXuatTrinh_50 = serializable
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    process_all_giay_phep_roi () {
      let vm = this
      let giayPhepRoiCang = vm.$refs.giayPhepRoiCang
      let config = {
        params: {
          documentName: vm.documentName,
          documentYear: vm.documentYear,
          'REQUEST_CODE': vm.requestCode
        }
      }
      if (vm.type === 'ke_hoach') {
        config.params['roleType'] = -1
      } else if (vm.type === 'thu_tuc') {
        config.params['roleType'] = -2
      } else if (vm.type === 'lanh_dao') {
        config.params['roleType'] = -3
      } else if (vm.type === 'van_thu') {
        config.params['roleType'] = -4
      }
      giayPhepRoiCang.loadingPDF = true
      axios.get(vm.getMessageType60EXT, config).then(function (response) {
        var serializable = response.data
        serializable['userSigns'] = vm.userSigns
        giayPhepRoiCang.bindData(serializable)
        giayPhepRoiCang.loadingPDF = false
        giayPhepRoiCang.loadingPDFTableXC = true
        axios.get(vm.getMessageType60EXTTable, config).then(function (response) {
          var serializable = response.data
          giayPhepRoiCang.bindDataTable(serializable)
          giayPhepRoiCang.loadingPDFTableXC = false
        }).catch(function (error) {
          console.log(error)
          giayPhepRoiCang.loadingPDFTableXC = false
        })
      }).catch(function (error) {
        console.log(error)
        giayPhepRoiCang.loadingPDF = false
      })
    },
    process_all_giay_phep_qua () {
      let vm = this
      let giayPhepQuaCanh = vm.$refs.giayPhepQuaCanh
      let config = {
        params: {
          documentName: vm.documentName,
          documentYear: vm.documentYear,
          'REQUEST_CODE': vm.requestCode
        }
      }
      if (vm.type === 'ke_hoach') {
        config.params['roleType'] = -1
      } else if (vm.type === 'thu_tuc') {
        config.params['roleType'] = -2
      } else if (vm.type === 'lanh_dao') {
        config.params['roleType'] = -3
      } else if (vm.type === 'van_thu') {
        config.params['roleType'] = -4
      }
      giayPhepQuaCanh.loadingPDF = true
      axios.get(vm.getMessageType90EXT, config).then(function (response) {
        var serializable = response.data
        serializable['userSigns'] = vm.userSigns
        giayPhepQuaCanh.bindData(serializable)
        giayPhepQuaCanh.loadingPDF = false
        giayPhepQuaCanh.loadingPDFTable = true
        axios.get(vm.getMessageType60EXTTableQC, config).then(function (response) {
          var serializable = response.data
          giayPhepQuaCanh.bindDataTable(serializable)
          giayPhepQuaCanh.loadingPDFTable = false
        }).catch(function (error) {
          console.log(error)
          giayPhepQuaCanh.loadingPDFTable = false
        })
      }).catch(function (error) {
        console.log(error)
        giayPhepQuaCanh.loadingPDF = false
      })
    },
    process_ky_so () {
      let vm = this
      let kysocrypto = vm.$refs.kysocrypto
      if (kysocrypto !== null && kysocrypto !== undefined && kysocrypto !== 'undefined') {
        kysocrypto.bindData(vm.documentTypeCode, vm.documentName, vm.documentYear, vm.type)
      }
    },
    kysoSubmit: function (config) {
      let vm = this
      console.log(config)
      this.sign = config.sign
      this.signFieldName = config.signFieldName
      this.filePath = config.filePath
      this.signLocation = config.signLocation
      if (config.hasOwnProperty('FileServer') && config.FileServer) {
        vm.FileServer = config.FileServer
      }
      if (config.messageType === 70) {
        this.callActionKeHoachAllInOneURL(config.item, config.messageType, config.actionType, config.desStatus, config.isConfirm, config.returnState, false)
      } else {
        this.callActionThuTucAllInOneURL(config.item, config.messageType, config.actionType, config.desStatus, config.isConfirm, config.returnState, false)
      }
    },
    kySoFUNC (configOBJ) {
      let vm = this
      let config = {
        params: {
          'documentName': vm.documentName,
          'documentYear': vm.documentYear,
          'messageType': vm.messageType
        }
      }
      
      if (configOBJ.hasOwnProperty('FileServer')) {
        // Nghiệp vụ ký số mới (ký số plugin vgca signservice)
        let configAction = {
          item: configOBJ.item,
          messageType: configOBJ.messageType,
          actionType: configOBJ.actionType,
          desStatus: configOBJ.desStatus,
          isConfirm: configOBJ.isConfirm,
          returnState: configOBJ.returnState,
          sign: '',
          signFieldName: '',
          filePath: '',
          signLocation: configOBJ.signLocation ? configOBJ.signLocation : '',
          FileServer: configOBJ.hasOwnProperty('FileServer') && configOBJ.FileServer ? configOBJ.FileServer : ''
        }
        console.log("configAction: ", configAction);
        vm.kysoSubmit(configAction)
        // end
      } else {
        // Nghiệp vụ ký số cũ
        let kysocrypto = vm.$refs.kysocrypto
        kysocrypto.loading_process_btn = true
        if (plugin().valid) {
          axios.get(vm.getComputerHash, config).then(function (response) {
            var serializable = response.data
            let jsonData = serializable
            let hashComputers = jsonData.hashComputers
            let signFieldNames = jsonData.signFieldNames
            let filePaths = jsonData.filePaths
            let msgs = jsonData.msg
            for (let i = 0; i < hashComputers.length; i++) {
              let hashComputer = hashComputers[i]
              vm.signFieldName = signFieldNames[i]
              vm.filePath = filePaths[i]
              let msg = msgs[i]
              vm.msgKey = msg
              vm.cryptoFlag = 2
              if (plugin().valid) {
                if (msg === 'success') {
                  let code = plugin().Sign(hashComputer)
                  console.log(code)
                  if (code === 0 || code === 7) {
                    vm.sign = plugin().Signature
                    vm.cryptoFlag = 0
                  } else {
                    vm.customMessage = 'Không ký được hồ sơ (' + code + ')'
                    vm.cryptoFlag = 1
                  }
                } else {
                  vm.customMessage = msg
                  vm.cryptoFlag = 2
                }
              }
              break
            }
            if (vm.cryptoFlag === 0) {
              var config = {
                item: configOBJ.item,
                messageType: configOBJ.messageType,
                actionType: configOBJ.actionType,
                desStatus: configOBJ.desStatus,
                isConfirm: configOBJ.isConfirm,
                returnState: configOBJ.returnState,
                sign: vm.sign,
                signFieldName: vm.signFieldName,
                filePath: vm.filePath,
                signLocation: configOBJ.signLocation
              }
              if (kysocrypto.doValidate()) {
                vm.kysoSubmit(config)
              } else {
                alert('Trường thông tin (*) bắt buộc phải nhập.')
              }
            } else {
              alert(vm.customMessage)
            }
            kysocrypto.loading_process_btn = false
          }).catch(function (error) {
            console.log(error)
            kysocrypto.loading_process_btn = false
          })
        } else {
          setTimeout(() => {
            kysocrypto.loading_process_btn = false
            alert('CryptoLib05Plugin trên trình duyệt không hoạt động')
          }, 500)
        }
      }
      // end
    },
    getThanhPhan: function () {
      var vm = this
      vm.thanhPhanLists = []
      let config = {
        params: {
          'documentType': vm.documentTypeCode,
          'documentName': vm.documentName,
          'documentYear': vm.documentYear,
          'roleUserFilterselectedType': 0
        }
      }
      axios
        .get(vm.getThanhPhanHoSo, config)
        .then(function (response) {
          var serializable = response.data
          vm.thanhPhanLists = serializable
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>
