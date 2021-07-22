<template>
  <div v-if="!isKeToan">
    <!-- START NC -->
    <div v-if="documentTypeCode === 'NC' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 11 || requestState === 27">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp thuận
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo từ chối
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 14, true, 1, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 27, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 14">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo từ chối
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
      <!-- 1. Đã tiếp nhận, 2. Yêu cầu sửa đổi bổ sung -->
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 18 || documentStatusCodeUse === 13" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp nhận hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tab :key="4" href="#tab4" >
          Hủy hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 12, true, 0, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
          <v-tab-item id="tab4" reverse-transition="fade-transition" transition="fade-transition">
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

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 19" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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

      <!-- 3. Chờ phê duyệt hoàn thành thủ tục -->
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 12" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tabs-items>
          
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
    <!-- END NC -->
    <!-- START XC -->
    <div v-else-if="documentTypeCode === 'XC' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 11 || requestState === 27">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp thuận
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo từ chối
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 12, true, 1, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 27, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 14">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo từ chối
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 18 || documentStatusCodeUse === 13" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp nhận hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tab :key="4" href="#tab4" >
          Hủy hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 12, true, 0, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
          <v-tab-item id="tab4" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, 22, 10, true, 0, true)"
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

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 19" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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

      <!-- 3. Chờ phê duyệt hoàn thành thủ tục -->
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 20 || documentStatusCodeUse === 120" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tabs-items>
          
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
    <!-- END XC -->
    <!-- START XC -->
    <div v-else-if="documentTypeCode === '14' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 11 || requestState === 27">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp thuận
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo từ chối
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 12, true, 1, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 27, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 14">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo từ chối
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 18 || documentStatusCodeUse === 13" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp nhận hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tab :key="4" href="#tab4" >
          Hủy hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 12, true, 0, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
          <v-tab-item id="tab4" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, 22, 10, true, 0, true)"
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

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 19" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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

      <!-- 3. Chờ phê duyệt hoàn thành thủ tục -->
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 20 || documentStatusCodeUse === 120" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tabs-items>
          
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
    <!-- END XC -->
    <!-- START XC -->
    <div v-else-if="documentTypeCode === '15' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 11 || requestState === 27">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp thuận
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo từ chối
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 12, true, 1, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 27, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 14">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo từ chối
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 18 || documentStatusCodeUse === 13" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp nhận hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tab :key="4" href="#tab4" >
          Hủy hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 12, true, 0, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
          <v-tab-item id="tab4" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, 22, 10, true, 0, true)"
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

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 19" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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

      <!-- 3. Chờ phê duyệt hoàn thành thủ tục -->
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 20 || documentStatusCodeUse === 120" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tabs-items>
          
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
    <!-- END XC -->
    <!-- START QC -->
    <div v-else-if="documentTypeCode === 'QC' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 11 || requestState === 27">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp thuận
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo từ chối
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 14, true, 1, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 27, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 14">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo từ chối
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 18 || documentStatusCodeUse === 13" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp nhận hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tab :key="4" href="#tab4" >
          Hủy hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 12, true, 0, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
          <v-tab-item id="tab4" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, 22, 10, true, 0, true)"
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

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 19" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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

      <!-- 3. Chờ phê duyệt hoàn thành thủ tục -->
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 20 || documentStatusCodeUse === 120" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tabs-items>
          
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
    <!-- END QC -->
    <!-- START TT4 -->
    <div v-else-if="documentTypeCode === '8' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 11 || requestState === 27">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp thuận
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo từ chối
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 14, true, 1, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 27, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 14">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo từ chối
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 18 || documentStatusCodeUse === 13" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp nhận hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tab :key="4" href="#tab4" >
          Hủy hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 12, true, 0, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
          <v-tab-item id="tab4" reverse-transition="fade-transition" transition="fade-transition">
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

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 19" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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

      <!-- 3. Chờ phê duyệt hoàn thành thủ tục -->
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 12" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tabs-items>
          
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
    <!-- END TT4 -->
    <!-- START TT5 -->
    <div v-else-if="documentTypeCode === '9' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 11 || requestState === 27">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp thuận
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo từ chối
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 12, true, 1, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 27, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 14">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo từ chối
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 18 || documentStatusCodeUse === 13" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp nhận hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tab :key="4" href="#tab4" >
          Hủy hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 12, true, 0, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
          <v-tab-item id="tab4" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, 22, 10, true, 0, true)"
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

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 19" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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

      <!-- 3. Chờ phê duyệt hoàn thành thủ tục -->
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 20 || documentStatusCodeUse === 120" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tabs-items>
          
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
    <!-- END TT5 -->
    <!-- START TT6 -->
    <div v-else-if="documentTypeCode === '10' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 11 || requestState === 27">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp thuận
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo từ chối
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 14, true, 1, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 27, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 14">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo từ chối
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 18 || documentStatusCodeUse === 13" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp nhận hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tab :key="4" href="#tab4" >
          Hủy hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 12, true, 0, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
          <v-tab-item id="tab4" reverse-transition="fade-transition" transition="fade-transition">
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

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 19" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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

      <!-- 3. Chờ phê duyệt hoàn thành thủ tục -->
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 12" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tabs-items>
          
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
    <!-- END TT6 -->
    <!-- START TT7 -->
    <div v-else-if="documentTypeCode === '11' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 11 || requestState === 27">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp thuận
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo từ chối
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 12, true, 1, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 27, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 14">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo từ chối
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 18 || documentStatusCodeUse === 13" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp nhận hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tab :key="4" href="#tab4" >
          Hủy hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 12, true, 0, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
          <v-tab-item id="tab4" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, 22, 10, true, 0, true)"
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

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 19" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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

      <!-- 3. Chờ phê duyệt hoàn thành thủ tục -->
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 20 || documentStatusCodeUse === 120" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tabs-items>
          
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
    <!-- END TT7 -->
    <!-- START TT8 -->
    <div v-else-if="documentTypeCode === '4' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 11 || requestState === 27">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp thuận
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo từ chối
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 14, true, 1, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 27, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 14">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo từ chối
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 18 || documentStatusCodeUse === 13" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp nhận hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tab :key="4" href="#tab4" >
          Hủy hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 12, true, 0, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
          <v-tab-item id="tab4" reverse-transition="fade-transition" transition="fade-transition">
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

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 19" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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

      <!-- 3. Chờ phê duyệt hoàn thành thủ tục -->
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 12" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tabs-items>
          
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
    <!-- END TT8 -->
    <!-- START TT9 -->
    <div v-else-if="documentTypeCode === '5' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 11 || requestState === 27">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp thuận
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo từ chối
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 12, true, 1, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 27, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 14">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo từ chối
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 18 || documentStatusCodeUse === 13" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp nhận hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tab :key="4" href="#tab4" >
          Hủy hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 12, true, 0, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
          <v-tab-item id="tab4" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, 22, 10, true, 0, true)"
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

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 19" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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

      <!-- 3. Chờ phê duyệt hoàn thành thủ tục -->
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 20 || documentStatusCodeUse === 120" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tabs-items>
          
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
    <!-- END TT9 -->
    <!-- START TT10 -->
    <div v-else-if="documentTypeCode === '12' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 11 || requestState === 27">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp thuận
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo từ chối
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 14, true, 1, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 27, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 14">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo từ chối
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 18 || documentStatusCodeUse === 13" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp nhận hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tab :key="4" href="#tab4" >
          Hủy hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 12, true, 0, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
          <v-tab-item id="tab4" reverse-transition="fade-transition" transition="fade-transition">
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

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 19" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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

      <!-- 3. Chờ phê duyệt hoàn thành thủ tục -->
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 12" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tabs-items>
          
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
    <!-- END TT10 -->
    <!-- START TT11 -->
    <div v-else-if="documentTypeCode === '13' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 11 || requestState === 27">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp thuận
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo từ chối
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 12, true, 1, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 27, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 14">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo từ chối
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 18 || documentStatusCodeUse === 13" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp nhận hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tab :key="4" href="#tab4" >
          Hủy hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 12, true, 0, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
          <v-tab-item id="tab4" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, 22, 10, true, 0, true)"
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

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 19" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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

      <!-- 3. Chờ phê duyệt hoàn thành thủ tục -->
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 20 || documentStatusCodeUse === 120" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tabs-items>
          
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
    <!-- START NC 16 -->
    <div v-if="documentTypeCode === '16' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 11 || requestState === 27">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp thuận
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo từ chối
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 14, true, 1, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 27, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 14">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo từ chối
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
      <!-- 1. Đã tiếp nhận, 2. Yêu cầu sửa đổi bổ sung -->
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 18 || documentStatusCodeUse === 13" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp nhận hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tab :key="4" href="#tab4" >
          Hủy hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 12, true, 0, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
          <v-tab-item id="tab4" reverse-transition="fade-transition" transition="fade-transition">
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
      
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 19" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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

      <!-- 3. Chờ phê duyệt hoàn thành thủ tục -->
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 12" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tabs-items>
          
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
    <!-- END NC 16 -->
    <!-- START XC 17 -->
    <div v-else-if="documentTypeCode === '17' && type === 'ke_hoach'">
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 11 || requestState === 27">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp thuận
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo từ chối
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 12, true, 1, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 27, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs" :scrollable="false" v-if="requestState === 14">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo từ chối
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionKeHoachAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 18 || documentStatusCodeUse === 13" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo chấp nhận hồ sơ
        </v-tab>
        <v-tab :key="2" href="#tab2" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tab :key="3" href="#tab3" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tab :key="4" href="#tab4" >
          Hủy hồ sơ
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
            <v-card flat>
              <v-card-text>
                  Bạn có muốn tiếp tục xử lý?
                  <v-card-actions>
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 12, true, 0, false)"
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
          <v-tab-item id="tab2" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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
          <v-tab-item id="tab3" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
          <v-tab-item id="tab4" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, 22, 10, true, 0, true)"
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

      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 19" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Thông báo hướng dẫn DN bổ sung
        </v-tab>
        <v-tabs-items>
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 13, true, 0, true)"
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

      <!-- 3. Chờ phê duyệt hoàn thành thủ tục -->
      <v-tabs class="grey-opencps-panel-group-button" v-model="activeTab" @input="changeTabs"  :scrollable="false" v-if="documentStatusCodeUse === 12 || documentStatusCodeUse === 20 || documentStatusCodeUse === 120" >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tab1" >
          Dừng thủ tục điện tử để làm giấy
        </v-tab>
        <v-tabs-items>
          
          <v-tab-item id="tab1" reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, 1985, -1, 25, true, 0, true)"
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
    <!-- END XC 17 -->


  </div>
</template>

<script>
import axios from 'axios'
import toastr from 'toastr'

export default {
  props: ['type', 'documentName', 'documentYear', 'documentTypeCode', 'documentStatusCode', 'requestCode'],
  data: () => ({
    initData: null,
    detail: null,
    activeTab: 0,
    ykienReject: '',
    ykien: '',
    valid: true,
    requestState: '',
    documentStatusCodeUse: '',
    isKeToan: false
  }),
  beforeCreate () {
    var vm = this
    vm.$nextTick(function () {
      vm.$store.dispatch('loadInitResource').then(function (result) {
        vm.initData = result
        setTimeout(() => {
          vm.detail = vm.$parent.pullDetail()
          vm.requestState = vm.detail.requestState
          vm.documentStatusCodeUse = vm.detail.documentStatusCode
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
  methods: {
    changeTabs: function () {
      this.ykienReject = ''
      this.ykien = ''
    },
    callActionKeHoachAllInOneURL: function (item, messageType, actionType, desStatus, isConfirm, returnState, isValidate) {
      let vm = this
      if ((vm.$refs[vm.activeTab] != null && vm.$refs[vm.activeTab].validate()) || !isValidate) {
        if (isConfirm) {
          let x = confirm('Bạn có muốn thực hiện hành động này?')
          if (x) {
            vm.loading_process_btn = true
            vm._actionKeHoachAllInOneURL(item, messageType, actionType, desStatus, returnState)
          } else {
            return false
          }
        } else {
          vm.loading_process_btn = true
          vm._actionKeHoachAllInOneURL(item, messageType, actionType, desStatus, returnState)
        }
      } else {
        alert('lý do bắt buộc phải nhập')
      }
    },
    callActionThuTucAllInOneURL: function (item, messageType, actionType, desStatus, isConfirm, returnState, isValidate) {
      var vm = this
      if ((vm.$refs[vm.activeTab] != null && vm.$refs[vm.activeTab].validate()) || !isValidate) {
        if (isConfirm) {
          var x = confirm('Bạn có muốn thực hiện hành động này?')
          if (x) {
            vm.loading_process_btn = true
            vm._actionThuTucAllInOneURL(item, messageType, actionType, desStatus, returnState)
          } else {
            return false
          }
        } else {
          vm.loading_process_btn = true
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
      if (vm.type !== 'ke_hoach') {
        params.append('DOCUMENT_STATUS_CODE', vm.documentStatusCode)
      }
      params.append('DES_STATUS', desStatus)
      params.append('REQUEST_CODE', vm.requestCode)
      params.append('ykienReject', vm.ykienReject)
      params.append('sign', vm.sign)
      params.append('signFieldName', vm.signFieldName)
      params.append('filePath', vm.filePath)
      let lenhDieuDong = vm.$refs.lenhDieuDong
      if (messageType === '70' && vm.type !== 'van_thu' && vm.type !== 'lanh_dao') {
        if (lenhDieuDong !== null && lenhDieuDong !== undefined && lenhDieuDong !== 'undefined') {
          params.append('representative', lenhDieuDong.giamDoc.representative)
          params.append('shiftingDate', lenhDieuDong.shiftingDate)
          params.append('tugBoat', lenhDieuDong.detail_shifting.tugBoat)
          params.append('nameOfShip', lenhDieuDong.detail_shifting.nameOfShip)
          params.append('shownDraftxF', lenhDieuDong.detail_shifting.shownDraftxF)
          params.append('from', lenhDieuDong.detail_shifting.from)
          params.append('anchoringPortCode', JSON.stringify(lenhDieuDong.detail_shifting.anchoringPortCode))
          params.append('portHarbourCode', JSON.stringify(lenhDieuDong.detail_shifting.portHarbourCode))
          params.append('shiftingPortWharfCode', JSON.stringify(lenhDieuDong.detail_shifting.shiftingPortWharfCode))
          params.append('dwt', lenhDieuDong.detail_shifting.dwt)
          params.append('loa', lenhDieuDong.detail_shifting.loa)
          params.append('chanel', JSON.stringify(lenhDieuDong.chanel))
        }
      }
      axios.post(
        vm.initData.actionKeHoachAllInOneURL,
        params,
        configParam
      ).then(function (response) {
        vm.loading_process_btn = false
        if (response.data.hasOwnProperty('msg') && !response.data.msg) {
          toastr.error('Không có thông báo')
        } else {
          vm.requestState = desStatus
          toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          vm.$router.push({ path: '/ho-so/' + vm.type + '/' + vm.documentName + '/' + vm.documentYear + '/' + vm.documentTypeCode + '/' + desStatus,
            query: {
              'renew': Math.floor(Math.random() * (10 - 1 + 1)) + 1
            }
          })
        }
      }).catch(function (error) {
        console.log(error)
        vm.loading_process_btn = false
        toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
      })
    },
    _actionThuTucAllInOneURL: function (item, messageType, actionType, desStatus, returnState) {
      var vm = this
      var hanghaidetailxacnhan = vm.$refs.hanghaidetailxacnhan
      var configParam = {
      }
      var params = new FormData()
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
      var giayPhepRoiCang = vm.$refs.giayPhepRoiCang
      var giayPhepQuaCanh = vm.$refs.giayPhepQuaCanh
      if (messageType === '60' && vm.type !== 'van_thu' && vm.type !== 'lanh_dao' && giayPhepRoiCang != null) {
        if (giayPhepRoiCang !== null && giayPhepRoiCang !== undefined && giayPhepRoiCang !== 'undefined') {
          params.append('representative', giayPhepRoiCang.giamDoc.representative)
          params.append('detail_clearance', JSON.stringify(giayPhepRoiCang.detail_clearance))
          params.append('detail_clearance_data', JSON.stringify(giayPhepRoiCang.khaiBaoItems))
          params.append('timeOfDeparture', giayPhepRoiCang.timeOfDeparture)
          params.append('timeOfValidUntil', giayPhepRoiCang.timeOfValidUntil)
          params.append('issueDate', giayPhepRoiCang.issueDate)
        }
      }
      if (messageType === '90' && vm.type !== 'van_thu' && vm.type !== 'lanh_dao' && giayPhepQuaCanh != null) {
        if (giayPhepQuaCanh !== null && giayPhepQuaCanh !== undefined && giayPhepQuaCanh !== 'undefined') {
          params.append('representative', giayPhepQuaCanh.giamDoc.representative)
          params.append('detail_clearance', JSON.stringify(giayPhepQuaCanh.detail_clearance))
          params.append('detail_clearance_data', JSON.stringify(giayPhepQuaCanh.khaiBaoItems))
          params.append('timeOfDeparture', giayPhepQuaCanh.timeOfDeparture)
          params.append('timeOfValidUntil', giayPhepQuaCanh.timeOfValidUntil)
          params.append('issueDate', giayPhepQuaCanh.issueDate)
        }
      }
      if (messageType === '2014') {
        params.append('itemsGiayToXuatTrinhChoPhuongTien', JSON.stringify(vm.itemsGiayToXuatTrinhChoPhuongTien))
        params.append('itemsGiayToXuatTrinh_39', JSON.stringify(vm.itemsGiayToXuatTrinh_39))
        params.append('itemsGiayToXuatTrinh_40', JSON.stringify(vm.itemsGiayToXuatTrinh_40))
      }
      if (messageType === '23' && hanghaidetailxacnhan !== null && hanghaidetailxacnhan !== undefined && hanghaidetailxacnhan !== 'undefined') {
        params.append('soChungNhan', hanghaidetailxacnhan.soChungNhan)
        params.append('ngayPheDuyet', hanghaidetailxacnhan.ngayPheDuyet)
        params.append('lePhi', hanghaidetailxacnhan.lePhi)
      }
      if (messageType === '1985' && hanghaidetailxacnhan !== null && hanghaidetailxacnhan !== undefined && hanghaidetailxacnhan !== 'undefined') {
        params.append('soChungNhan', hanghaidetailxacnhan.soChungNhan)
        params.append('ngayPheDuyet', hanghaidetailxacnhan.ngayPheDuyet)
        params.append('lePhi', hanghaidetailxacnhan.lePhi)
      }
      axios.post(
        vm.initData.actionThuTucAllInOneURL,
        params,
        configParam
      ).then(function (response) {
        vm.loading_process_btn = false
        vm.documentStatusCodeUse = desStatus
        toastr.success('Yêu cầu của bạn được thực hiện thành công.')
        vm.$router.push({ path: '/ho-so/' + vm.type + '/' + vm.documentName + '/' + vm.documentYear + '/' + vm.documentTypeCode + '/' + desStatus,
          query: {
            'renew': Math.floor(Math.random() * (10 - 1 + 1)) + 1
          }
        })
      }).catch(function (error) {
        console.log(error)
        vm.loading_process_btn = false
        toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
      })
    }
  }
}
</script>
