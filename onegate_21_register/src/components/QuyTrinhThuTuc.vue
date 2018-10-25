<template>
  <div style="width:70%;margin:0 auto">
    <v-tabs v-model="active">
      <v-tabs-slider color="primary"></v-tabs-slider>
      <v-tab key="tab-1" href="#tab-1" ripple class="primary--text" @click="changeTab('process')">
        Thông tin quy trình
      </v-tab>
      <v-tab key="tab-2" href="#tab-2" ripple class="primary--text" @click="changeTab('step')">
        Bước
      </v-tab>
      <v-tab key="tab-3" href="#tab-3" ripple class="primary--text" @click="changeTab('action')">
        Thao tác
      </v-tab>
      <v-tab-item class="pt-3" id="tab-1" key="tab-1" transition="fade-transition" reverse-transition="fade-transition">
        <v-card>
          <v-form ref="formAddProcess" v-model="validAddProcess" lazy-validation class="px-3">
            <v-layout wrap>
              <v-flex xs12 sm3>
                <div>Số hiệu quy trình <span style="color:red">(*)</span></div>
              </v-flex>
              <v-flex xs12 sm9>
                <v-text-field
                  placeholder="Nhập số hiệu quy trình"
                  v-model="processNo"
                  box
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm3>
                <div>Tên quy trình <span style="color:red">(*)</span></div>
              </v-flex>
              <v-flex xs12 sm9>
                <v-text-field
                  placeholder="Nhập tên quy trình xử lý"
                  v-model="processName"
                  box
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm3>
                <div>Mô tả</div>
              </v-flex>
              <v-flex xs12 sm9>
                <v-text-field
                  placeholder="Nhập mô tả quy trình"
                  v-model="description"
                  box
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm3>
                <div>Thời gian xử lý <span style="color:red">(*)</span></div>
              </v-flex>
              <v-flex xs12 sm9>
                <v-layout wrap>
                  <v-flex xs12 sm7>
                    <v-text-field
                      placeholder="Nhập thời gian xử lý"
                      v-model="durationCount"
                      box
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm5 class="pl-3">
                    <v-radio-group v-model="durationUnit" row>
                      <v-radio label="Tính theo ngày" :value="0"></v-radio>
                      <v-radio label="Tính theo giờ" :value="1"></v-radio>
                    </v-radio-group>
                  </v-flex>
                </v-layout>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm3>
                <div>Vai trò xử lý</div>
              </v-flex>
              <v-flex xs12 sm9>
                <v-layout wrap>
                  <v-flex xs12 sm7 class="input-group--text-field-box">
                    <v-select
                      class="select-border"
                      :items="jobposList"
                      v-model="roleId"
                      item-text="title"
                      item-value="roleId"
                      :hide-selected="true"
                      clearable
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 sm5 class="pl-3">
                    <v-radio-group v-model="moderator" row>
                      <v-radio label="Theo dõi" :value="0"></v-radio>
                      <v-radio label="Thực hiện" :value="1"></v-radio>
                    </v-radio-group>
                  </v-flex>
                  <v-flex xs12 sm7>
                    <v-text-field
                      placeholder="Điều kiện phân công xử lý"
                      v-model="condition"
                      box
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm3>
              </v-flex>
              <v-flex xs12 sm9>
                <v-layout wrap>
                  <v-flex xs12 sm6 class="pr-2">
                    <v-checkbox label="Tạo số tiếp nhận hồ sơ" v-model="generateDossierNo"></v-checkbox>
                    <v-text-field
                      placeholder="Cấu hình sinh mã số hồ sơ"
                      v-model="dossierNoPattern"
                      box
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 class="pl-2">
                    <v-checkbox label="Sinh ngày hẹn trả hồ sơ" v-model="generateDueDate"></v-checkbox>
                    <v-text-field
                      placeholder="Cấu hình sinh ngày hẹn trả"
                      v-model="dueDatePattern"
                      box
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm3>
              </v-flex>
              <v-flex xs12 sm9 class="mt-2">
                <v-layout wrap>
                  <v-flex xs12 sm6>
                    <v-checkbox label="Sinh mật mã tra cứu hồ sơ" v-model="generatePassword"></v-checkbox>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-checkbox label="Gửi thông báo cho chủ hồ sơ" v-model="directNotification"></v-checkbox>
                  </v-flex>
                </v-layout>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm3>
                <div>Server đồng bộ <span style="color:red">(*)</span></div>
              </v-flex>
              <v-flex xs12 sm9>
                <v-text-field
                  placeholder="Địa chỉ server đồng bộ "
                  v-model="serverNo"
                  box
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
            <div class="text-xs-center my-2">
              <v-btn color="primary"
                v-if="index === 0 || index === '0'"
                :loading="loading"
                :disabled="loading"
                @click="addProcess"
              >
                <v-icon>add_circle_outline</v-icon>&nbsp;
                Thêm mới
              </v-btn>
              <v-btn color="primary"
                v-else
                :loading="loading"
                :disabled="loading"
                @click="updateProcess"
              >
                <v-icon>save</v-icon>&nbsp;
                Cập nhật
              </v-btn>
              <v-btn color="primary"
                :loading="loading"
                :disabled="loading"
              >
                <v-icon>reply</v-icon>&nbsp;
                Quay lại
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-tab-item>
      <!-- Process Step -->
      <v-tab-item id="tab-2" key="tab-2" transition="fade-transition" reverse-transition="fade-transition">
        <!-- Danh sách step -->
        <v-card class="py-2 px-3" v-if="!activeStepDetail">
          <v-btn color="primary"
            :loading="loading"
            :disabled="loading"
            class="mb-2"
          >
            <v-icon>add_circle_outline</v-icon>&nbsp;
            Thêm bước xử lý
          </v-btn>
          <v-data-table
            :headers="headerStep"
            :items="stepList"
            hide-actions
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.stepName }}</td>
              <td class="text-xs-left">{{ props.item.stepName }}</td>
              <td class="text-xs-left">{{ props.item.dossierStatus }}</td>
              <td class="text-xs-left">{{ props.item.durationCount }}</td>
              <td class="justify-center layout px-0">
                <v-icon
                  small
                  class="mr-2"
                  @click="editStep(props.item)"
                >
                  edit
                </v-icon>
                <v-icon
                  small
                  @click="deleteStep(props.item)"
                >
                  delete
                </v-icon>
              </td>
            </template>
            <template slot="no-data">
            </template>
          </v-data-table>
        </v-card>
        <!-- Chi tiết step -->
        <v-card class="pt-2" v-else>
          <v-form ref="formAddStep" v-model="validAddStep" lazy-validation class="px-3">
            <v-layout wrap>
              <v-flex xs12 sm6 class="pr-2">
                <div>Tên bước <span style="color:red">(*)</span></div>
                <v-text-field
                  placeholder="Nhập tên bước"
                  v-model="currentStep.stepName"
                  box
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 class="pl-2">
                <div>Số thứ tự</div>
                <v-text-field
                  placeholder="Nhập tên bước"
                  v-model="currentStep.sequenceNo"
                  box
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm6 class="input-group--text-field-box pr-2">
                <div>Trạng thái chính <span style="color:red">(*)</span></div>
                <v-select
                  class="select-border"
                  :items="dossierStatusList"
                  v-model="currentStep.dossierStatus"
                  item-text="title"
                  item-value="roleId"
                  :hide-selected="true"
                  clearable
                  :rules="[rules.required]"
                  required
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 class="pl-2">
                <div>Mã bước quy trình <span style="color:red">(*)</span></div>
                <v-text-field
                  placeholder="Nhập tên bước"
                  v-model="currentStep.stepCode"
                  box
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm6 class="input-group--text-field-box pr-2">
                <div>Trạng thái phụ</div>
                <v-select
                  class="select-border"
                  :items="dossierSubStatusList"
                  v-model="currentStep.dossierSubStatus"
                  item-text="title"
                  item-value="roleId"
                  :hide-selected="true"
                  clearable
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 class="pl-2">
                <div>Thời gian xử lý</div>
                <v-text-field
                  placeholder="Nhập thời gian xử lý"
                  v-model="currentStep.durationCount"
                  box
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm12>
                <v-layout wrap>
                  <v-flex xs12>
                    <div>Vai trò xử lý</div>
                  </v-flex>
                  <v-flex xs12 sm6 class="input-group--text-field-box">
                    <v-select
                      class="select-border"
                      :items="jobposList"
                      v-model="currentStep.roleId"
                      item-text="title"
                      item-value="roleId"
                      :hide-selected="true"
                      clearable
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 sm6 class="pl-3">
                    <v-radio-group v-model="currentStep.moderator" row>
                      <v-radio label="Theo dõi" :value="0"></v-radio>
                      <v-radio label="Thực hiện" :value="1"></v-radio>
                    </v-radio-group>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field
                      placeholder="Điều kiện phân công xử lý"
                      v-model="currentStep.condition"
                      box
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm12>
                <div>Lock State</div>
                <v-text-field
                  placeholder=""
                  v-model="currentStep.lockState"
                  box
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm12>
                <div>Hướng dẫn</div>
                <v-text-field
                  placeholder=""
                  v-model="currentStep.stepInstruction"
                  box
                  row
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm12>
                <div>Tóm tắt hồ sơ</div>
                <v-text-field
                  placeholder=""
                  v-model="currentStep.briefNote"
                  box
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm12>
                <div>Nhúng ajax của phần nghiệp vụ</div>
                <v-text-field
                  placeholder=""
                  v-model="currentStep.customProcessUrl"
                  box
                ></v-text-field>
              </v-flex>
            </v-layout>
            <div class="text-xs-center my-2">
              <v-btn color="primary"
                v-if="stepId === 0 || stepId === '0'"
                :loading="loading"
                :disabled="loading"
                @click="addStep"
              >
                <v-icon>add_circle_outline</v-icon>&nbsp;
                Thêm mới
              </v-btn>
              <v-btn color="primary"
                v-else
                :loading="loading"
                :disabled="loading"
                @click="updateStep"
              >
                <v-icon>save</v-icon>&nbsp;
                Cập nhật
              </v-btn>
              <v-btn color="primary"
                :loading="loading"
                :disabled="loading"
              >
                <v-icon>reply</v-icon>&nbsp;
                Quay lại
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-tab-item>
      <!-- Process Action -->
      <v-tab-item id="tab-3" key="tab-3" transition="fade-transition" reverse-transition="fade-transition">
        <!-- Danh sách Action -->
        <v-card class="py-2 px-3" v-if="!activeActionDetail">
          <v-btn color="primary"
            :loading="loading"
            :disabled="loading"
            class="mb-2"
          >
            <v-icon>add_circle_outline</v-icon>&nbsp;
            Thêm bước thao tác
          </v-btn>
          <v-data-table
            :headers="headerAction"
            :items="actionList"
            hide-actions
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.actionName }}</td>
              <td class="text-xs-left">{{ props.item.actionName }}</td>
              <td class="text-xs-left">{{ props.item.preStepName }}</td>
              <td class="text-xs-left">{{ props.item.postStepName }}</td>
              <td class="justify-center layout px-0">
                <v-icon
                  small
                  class="mr-2"
                  @click="editAction(props.item)"
                >
                  edit
                </v-icon>
                <v-icon
                  small
                  @click="deleteAction(props.item)"
                >
                  delete
                </v-icon>
              </td>
            </template>
            <template slot="no-data">
            </template>
          </v-data-table>
        </v-card>
        <!-- Chi tiết Action -->
        <v-card class="pt-2" v-else>
          <v-form ref="formAddStep" v-model="validAddStep" lazy-validation class="px-3">
            <v-layout wrap>
              <v-flex xs12 sm6 class="pr-2">
                <div>Tên thao tác <span style="color:red">(*)</span></div>
                <v-text-field
                  placeholder="Nhập tên thao tác"
                  v-model="currentAction.actionName"
                  box
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 class="pl-2">
                <div>Mã thao tác</div>
                <v-text-field
                  placeholder="Nhập mã thao tác"
                  v-model="currentAction.actionCode"
                  box
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm6 class="pr-2">
                <div>Điều kiện kiểm tra</div>
                <v-text-field
                  placeholder="Nhập mã thao tác"
                  v-model="currentAction.preCondition"
                  box
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 class="input-group--text-field-box pl-2">
                <div>Kích hoạt sự kiện</div>
                <v-select
                  class="select-border"
                  :items="autoEventList"
                  v-model="currentAction.autoEvent"
                  item-text="name"
                  item-value="value"
                  :hide-selected="true"
                  clearable
                ></v-select>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm6 class="input-group--text-field-box pr-2">
                <div>Bước thực hiện thao tác <span style="color:red">(*)</span></div>
                <v-select
                  class="select-border"
                  :items="stepActionList"
                  v-model="currentAction.preStepCode"
                  item-text="title"
                  item-value="roleId"
                  :hide-selected="true"
                  clearable
                  :rules="[rules.required]"
                  required
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 class="input-group--text-field-box pl-2">
                <div>Bước sau thực hiện thao tác <span style="color:red">(*)</span></div>
                <v-select
                  class="select-border"
                  :items="stepActionList"
                  v-model="currentAction.postStepCode"
                  item-text="title"
                  item-value="roleId"
                  :hide-selected="true"
                  clearable
                  :rules="[rules.required]"
                  required
                ></v-select>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm6 class="input-group--text-field-box pr-2">
                <div>Phân công người thực hiện</div>
                <v-select
                  class="select-border"
                  :items="assignTypeList"
                  v-model="currentAction.allowAssignUser"
                  item-text="text"
                  item-value="value"
                  :hide-selected="true"
                  clearable
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 class="pl-2">
                <div></div>
                <v-checkbox label="Cho phép rollback" v-model="currentAction.rollbackable"></v-checkbox>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm12>
                <v-flex xs12>
                  <div>Mẫu hồ sơ</div>
                </v-flex>
                <v-flex xs12 sm12 class="input-group--text-field-box">
                  <v-select
                    class="select-border"
                    :items="dossierTemplateList"
                    v-model="currentAction.dossierTemplateNo"
                    item-text="title"
                    item-value="roleId"
                    :hide-selected="true"
                    clearable
                  ></v-select>
                </v-flex>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm6 class="pr-2">
                <div>Tạo tài liệu mới</div>
                <v-text-field
                  placeholder=""
                  v-model="currentAction.createDossierFiles"
                  box
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 class="pl-2">
                <div>Kết quả trả về</div>
                <v-text-field
                  placeholder=""
                  v-model="currentAction.returnDossierFiles"
                  box
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm12>
                <v-flex xs12>
                  <div>Yêu cầu thanh toán</div>
                </v-flex>
                <v-flex xs12 sm12 class="input-group--text-field-box">
                  <v-select
                    class="select-border"
                    :items="requestPaymentList"
                    v-model="currentAction.requestPayment"
                    item-text="title"
                    item-value="roleId"
                    :hide-selected="true"
                    clearable
                  ></v-select>
                </v-flex>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm12>
                <div>Mã đồng bộ</div>
                <v-text-field
                  placeholder=""
                  v-model="currentAction.syncActionCode"
                  box
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm12>
                <div>Cấu hình cơ quan</div>
                <v-text-field
                  placeholder=""
                  v-model="currentAction.syncActionCode"
                  box
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm12>
                <div>Cấu hình panel nhập ý kiến</div>
                <v-text-field
                  placeholder=""
                  v-model="currentAction.configNote"
                  box
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm12>
                <v-layout wrap>
                  <v-flex xs12 sm6 class="pr-2">
                    <v-checkbox label="Sinh mã số tiếp nhận" v-model="currentAction.createDossierNo"></v-checkbox>
                  </v-flex>
                  <v-flex xs12 sm6 class="pl-2">
                    <v-checkbox label="Có ký số điện tử" v-model="currentAction.eSignature"></v-checkbox>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
            <div class="text-xs-center my-2">
              <v-btn color="primary"
                v-if="stepId === 0 || stepId === '0'"
                :loading="loading"
                :disabled="loading"
                @click="addAction"
              >
                <v-icon>add_circle_outline</v-icon>&nbsp;
                Thêm mới
              </v-btn>
              <v-btn color="primary"
                v-else
                :loading="loading"
                :disabled="loading"
                @click="updateAction"
              >
                <v-icon>save</v-icon>&nbsp;
                Cập nhật
              </v-btn>
              <v-btn color="primary"
                :loading="loading"
                :disabled="loading"
              >
                <v-icon>reply</v-icon>&nbsp;
                Quay lại
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
  export default {
    props: ['index'],
    data () {
      return {
        activeStep: false,
        activeStepDetail: false,
        activeAction: false,
        activeActionDetail: false,
        loading: false,
        active: null,
        processNo: '',
        processName: '',
        description: '',
        durationCount: '',
        durationUnit: 0,
        jobposList: [],
        roleId: '',
        condition: '',
        moderator: 0,
        serverNo: '',
        generateDossierNo: '',
        dossierNoPattern: '',
        generateDueDate: '',
        dueDatePattern: '',
        generatePassword: false,
        directNotification: false,
        validAddProcess: false,
        // PROCESS STEP DATA
        headerStep: [
          {
            text: 'STT',
            align: 'center',
            sortable: false
          },
          {
            text: 'Tên bước',
            align: 'center',
            sortable: false
          },
          {
            text: 'Trạng thái',
            align: 'center',
            sortable: false
          },
          {
            text: 'Thời gian xử lý',
            align: 'center',
            sortable: false
          },
          {
            text: 'Thao tác',
            align: 'center',
            sortable: false
          }
        ],
        stepList: [],
        currentStep: {
          stepName: '',
          dossierStatus: '',
          dossierSubStatus: '',
          durationCount: '',
          stepCode: '',
          roleId: '',
          moderator: '',
          condition: '',
          lockState: '',
          stepInstruction: '',
          briefNote: '',
          customProcessUrl: ''
        },
        validAddStep: false,
        dossierStatusList: [],
        dossierSubStatusList: [],
        // PROCESS ACTION DATA
        headerAction: [
          {
            text: 'STT',
            align: 'center',
            sortable: false
          },
          {
            text: 'Tên thao tác',
            align: 'center',
            sortable: false
          },
          {
            text: 'Bước thực hiện thao tác',
            align: 'center',
            sortable: false
          },
          {
            text: 'Bước sau',
            align: 'center',
            sortable: false
          },
          {
            text: 'Thao tác',
            align: 'center',
            sortable: false
          }
        ],
        actionList: [],
        stepActionList: [],
        autoEventList: [],
        assignTypeList: [],
        dossierTemplateList: [],
        requestPaymentList: [],
        currentAction: {
          actionName: '',
          actionCode: '',
          preCondition: '',
          autoEvent: '',
          preStepCode: '',
          postStepCode: '',
          allowAssignUser: '',
          rollbackable: false,
          dossierTemplateNo: '',
          createDossierFiles: '',
          returnDossierFiles: '',
          requestPayment: '',
          syncActionCode: '',
          configNote: '',
          createDossierNo: false,
          eSignature: false
        },
        validAddAction: false,
        //
        rules: {
          required: (value) => !!value || 'Trường dữ liệu bắt buộc'
        }
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        let currentQuery = vm.$router.history.current.query
        let currentParams = vm.$router.history.current.params
        console.log('currentQuery', currentQuery)
        console.log('currentParams', currentParams)
        vm.activeStep = currentQuery.hasOwnProperty('step') && currentQuery.step === 'true'
        vm.activeStepDetail = vm.activeStep && currentQuery.hasOwnProperty('stepCode') && currentQuery.stepCode
        vm.activeAction = currentQuery.hasOwnProperty('action') && currentQuery.action === 'true'
        vm.activeActionDetail = vm.activeAction && currentQuery.hasOwnProperty('actionCode') && currentQuery.actionCode
        if (vm.activeStep) {
          vm.active = 'tab-2'
        } else if (vm.activeAction) {
          vm.active = 'tab-3'
        }
      })
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentParams = newRoute.params
        let currentQuery = newRoute.query
        vm.activeStep = currentQuery.hasOwnProperty('step') && currentQuery.step === 'true'
        vm.activeStepDetail = vm.activeStep && currentQuery.hasOwnProperty('stepCode') && currentQuery.stepCode
        vm.activeAction = currentQuery.hasOwnProperty('action') && currentQuery.action === 'true'
        vm.activeActionDetail = vm.activeAction && currentQuery.hasOwnProperty('actionCode') && currentQuery.actionCode
        if (vm.activeStep) {
          vm.active = 'tab-2'
        } else if (vm.activeAction) {
          vm.active = 'tab-3'
        }
      }
    },
    methods: {
      addProcess () {},
      updateProcess () {},
      editStep (itemStep) {},
      deleteStep (itemStep) {},
      addStep () {},
      updateStep () {},
      editAction (itemAction) {},
      deleteAction (itemAction) {},
      addAction () {},
      updateAction () {},
      changeTab (tab) {},
      backToList () {
        let vm = this
        let currentPath = vm.$router.history.current.path
        vm.$router.push(currentPath.substring(0, currentPath.indexOf('/editor/')))
      }
    }
  }
</script>
