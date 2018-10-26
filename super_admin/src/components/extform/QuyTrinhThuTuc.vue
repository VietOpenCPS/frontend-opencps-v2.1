<template>
  <div>
    <v-tabs v-model="active">
      <v-tabs-slider color="blue"></v-tabs-slider>
      <v-tab key="tab-1" href="#tab-1" ripple @click="changeTab('process')">
        Thông tin quy trình
      </v-tab>
      <v-tab key="tab-2" :disabled="Number(id)>0?false:true" href="#tab-2" ripple @click="changeTab('step')">
        Bước
      </v-tab>
      <v-tab key="tab-3" :disabled="Number(id)>0?false:true" href="#tab-3" ripple @click="changeTab('action')">
        Thao tác
      </v-tab>
      <v-tab-item class="pt-3" id="tab-1" key="tab-1" transition="fade-transition" reverse-transition="fade-transition">
        <v-card style="margin-bottom:40px">
          <v-form ref="formAddProcess" v-model="validAddProcess" lazy-validation class="px-3">
            <v-layout wrap>
              <v-flex xs12 sm3>
                <div>Số hiệu quy trình <span style="color:red">(*)</span></div>
              </v-flex>
              <v-flex xs12 sm9>
                <v-text-field
                  placeholder="Nhập số hiệu quy trình"
                  v-model="currentProcess.processNo"
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
                  v-model="currentProcess.processName"
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
                  v-model="currentProcess.description"
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
                      v-model="currentProcess.durationCount"
                      box
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm5 class="pl-3">
                    <v-radio-group v-model="currentProcess.durationUnit" row>
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
                  <v-flex xs12 sm6>
                    <v-select
                      box
                      :items="jobposList"
                      v-model="currentProcess.roleId"
                      item-text="title"
                      item-value="jobPosId"
                      :hide-selected="true"
                      clearable
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 sm4 class="pl-2">
                    <v-radio-group v-model="currentProcess.moderator" row>
                      <v-radio label="Theo dõi" :value="0"></v-radio>
                      <v-radio label="Thực hiện" :value="1"></v-radio>
                    </v-radio-group>
                  </v-flex>
                  <v-flex xs12 sm2 class="pl-2">
                    <v-btn color="blue"
                      class="mb-2"
                      @click="createProcessRole"
                    >
                      <v-icon size="24">add</v-icon>&nbsp;
                      Thêm
                    </v-btn>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field
                      placeholder="Điều kiện phân công xử lý"
                      v-model="currentProcess.condition"
                      box
                    ></v-text-field>
                  </v-flex>
                  <!--  -->
                  <v-flex xs12 sm10>
                    <v-data-table
                      v-if="processRoleList.length>0"
                      :headers="headerProcessRoles"
                      :items="processRoleList"
                      hide-actions
                      class="elevation-1"
                    >
                      <template slot="items" slot-scope="props">
                        <td class="text-xs-left">{{ props.item.role }}</td>
                        <td class="text-xs-left">{{ props.item.moderatorText }}</td>
                        <td class="text-xs-left">{{ props.item.condition }}</td>
                        <td class="justify-center layout px-0">
                          <v-icon small class="mr-2" @click="editStep(props.item)">
                            edit
                          </v-icon>
                          <v-icon small @click="deleteStep(props.item)">
                            delete
                          </v-icon>
                        </td>
                      </template>
                    </v-data-table>
                  </v-flex>
                  <!--  -->
                </v-layout>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm3>
              </v-flex>
              <v-flex xs12 sm9>
                <v-layout wrap>
                  <v-flex xs12 sm6 class="pr-2">
                    <v-checkbox label="Tạo số tiếp nhận hồ sơ" v-model="currentProcess.generateDossierNo"></v-checkbox>
                    <v-text-field
                      placeholder="Cấu hình sinh mã số hồ sơ"
                      v-model="currentProcess.dossierNoPattern"
                      box
                      :rules="currentProcess.generateDossierNo ? [rules.required] : []"
                      :required="currentProcess.generateDossierNo"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 class="pl-2">
                    <v-checkbox label="Sinh ngày hẹn trả hồ sơ" v-model="currentProcess.generateDueDate"></v-checkbox>
                    <v-text-field
                      placeholder="Cấu hình sinh ngày hẹn trả"
                      v-model="currentProcess.dueDatePattern"
                      box
                      :rules="currentProcess.dueDatePattern ? [rules.required] : []"
                      :required="currentProcess.dueDatePattern"
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
                    <v-checkbox label="Sinh mật mã tra cứu hồ sơ" v-model="currentProcess.generatePassword"></v-checkbox>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-checkbox label="Gửi thông báo cho chủ hồ sơ" v-model="currentProcess.directNotification"></v-checkbox>
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
                  v-model="currentProcess.serverNo"
                  box
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-flex xs12 class="text-right" style="
              position: fixed;
              bottom: 0;
              width: -webkit-calc( 100% - 300px );
              width: calc( 100% - 300px );
              background: white;
              z-index: 2;
            ">
              <v-btn color="blue"
                v-if="id === 0 || id === '0'"
                :loading="loading"
                :disabled="loading"
                @click="updateProcess('add')"
              >
                <v-icon>add_circle_outline</v-icon>&nbsp;
                Thêm mới
              </v-btn>
              <v-btn color="blue"
                v-else
                :loading="loading"
                :disabled="loading"
                @click="updateProcess('update')"
              >
                <v-icon>save</v-icon>&nbsp;
                Cập nhật
              </v-btn>
            </v-flex>
          </v-form>
        </v-card>
      </v-tab-item>
      <!-- Process Step -->
      <v-tab-item id="tab-2" key="tab-2" transition="fade-transition" reverse-transition="fade-transition">
        <!-- Danh sách step -->
        <v-card class="py-2 px-3" v-if="!activeStepDetail" style="margin-bottom:40px">
          <v-btn color="blue"
            :loading="loading"
            :disabled="loading"
            class="mb-2"
            @click="createStep"
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
              <td class="text-xs-center">
                <div>
                  <span>{{listStepPage * 15 - 15 + props.index + 1}}</span>
                </div>
              </td>
              <td class="text-xs-left">{{ props.item.stepName }}</td>
              <td class="text-xs-left">{{ props.item.dossierStatusText }}</td>
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
        <v-card class="pt-2" v-else style="margin-bottom:40px">
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
                  placeholder="Nhập số thứ tự"
                  v-model="currentStep.sequenceNo"
                  box
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm6 class="pr-2">
                <div>Trạng thái chính <span style="color:red">(*)</span></div>
                <v-select
                  box
                  :items="dossierStatusList"
                  v-model="currentStep.dossierStatus"
                  item-text="itemName"
                  item-value="itemCode"
                  :hide-selected="true"
                  clearable
                  :rules="[rules.required]"
                  required
                  @change="changeDossierStatus"
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
              <v-flex xs12 sm6 class="pr-2">
                <div>Trạng thái phụ</div>
                <v-select
                  box
                  :items="dossierSubStatusList"
                  v-model="currentStep.dossierSubStatus"
                  item-text="itemName"
                  item-value="itemCode"
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
                  <v-flex xs12 sm6 class="">
                    <v-select
                      box
                      :items="jobposList"
                      v-model="currentStep.roleId"
                      item-text="title"
                      item-value="jobPosId"
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
            <v-flex xs12 class="text-right" style="
              position: fixed;
              bottom: 0;
              width: -webkit-calc( 100% - 300px );
              width: calc( 100% - 300px );
              background: white;
              z-index: 2;
            ">
              <v-btn color="blue"
                v-if="currentStepId === 0 || currentStepId === '0'"
                :loading="loading"
                :disabled="loading"
                @click="updateStep('add')"
              >
                <v-icon>add_circle_outline</v-icon>&nbsp;
                Thêm mới
              </v-btn>
              <v-btn color="blue"
                v-else
                :loading="loading"
                :disabled="loading"
                @click="updateStep('update')"
              >
                <v-icon>save</v-icon>&nbsp;
                Cập nhật
              </v-btn>
              <v-btn color="blue"
                :loading="loading"
                :disabled="loading"
                @click="goBackStepList"
              >
                <v-icon>reply</v-icon>&nbsp;
                Quay lại
              </v-btn>
            </v-flex>
          </v-form>
        </v-card>
      </v-tab-item>
      <!-- Process Action -->
      <v-tab-item id="tab-3" key="tab-3" transition="fade-transition" reverse-transition="fade-transition">
        <!-- Danh sách Action -->
        <v-card class="py-2 px-3" v-if="!activeActionDetail" style="margin-bottom:40px">
          <v-btn color="blue"
            :loading="loading"
            :disabled="loading"
            class="mb-2"
            @click="createAction"
          >
            <v-icon>add_circle_outline</v-icon>&nbsp;
            Thêm thao tác
          </v-btn>
          <v-data-table
            :headers="headerAction"
            :items="actionList"
            hide-actions
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td class="text-xs-center">
                <div>
                  <span>{{listActionPage * 15 - 15 + props.index + 1}}</span>
                </div>
              </td>
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
        <v-card class="pt-2" v-else style="margin-bottom:40px">
          <v-form ref="formAddAction" v-model="validAddAction" lazy-validation class="px-3">
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
              <v-flex xs12 sm6 class="pl-2">
                <div>Kích hoạt sự kiện</div>
                <v-select
                  box
                  :items="autoEventList"
                  v-model="currentAction.autoEvent"
                  item-text="text"
                  item-value="value"
                  :hide-selected="true"
                  clearable
                ></v-select>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm6 class="pr-2">
                <div>Bước thực hiện thao tác <span style="color:red">(*)</span></div>
                <v-select
                  box
                  :items="stepList"
                  v-model="currentAction.preStepCode"
                  item-text="stepName"
                  item-value="stepCode"
                  :hide-selected="true"
                  clearable
                  :rules="[rules.required]"
                  required
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 class="pl-2">
                <div>Bước sau thực hiện thao tác <span style="color:red">(*)</span></div>
                <v-select
                  box
                  :items="stepList"
                  v-model="currentAction.postStepCode"
                  item-text="stepName"
                  item-value="stepCode"
                  :hide-selected="true"
                  clearable
                  :rules="[rules.required]"
                  required
                ></v-select>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm6 class="pr-2">
                <div>Phân công người thực hiện</div>
                <v-select
                  box
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
              <v-flex xs12 sm6 class="pr-2">
                <div>Người được chọn ngầm định</div>
                <v-select
                  box
                  :items="employeeList"
                  v-model="currentAction.assignUserId"
                  item-text="fullName"
                  item-value="employeeId"
                  :hide-selected="true"
                  clearable
                ></v-select>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm12>
                <v-flex xs12>
                  <div>Mẫu hồ sơ</div>
                </v-flex>
                <v-flex xs12 sm12 class="">
                  <v-select
                    box
                    :items="dossierTemplateList"
                    v-model="currentAction.dossierTemplateNo"
                    item-text="templateName"
                    item-value="dossierTemplateId"
                    :hide-selected="true"
                    clearable
                    @change="getDossierParts"
                  ></v-select>
                </v-flex>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm6 class="pr-2">
                <v-flex xs12 sm12 class="">
                  <div>Tài liệu tạo mới</div>
                </v-flex>
                <v-flex xs12 sm12 class="">
                  <v-select
                    box
                    :items="dossierPartList"
                    v-model="currentAction.createDossierFiles"
                    item-text="partName"
                    item-value="fileTemplateNo"
                    :hide-selected="true"
                    clearable
                  ></v-select>
                </v-flex>
              </v-flex>
              <v-flex xs12 sm6 class="pl-2">
                <v-flex xs12 sm12 class="">
                  <div>Kết quả trả về</div>
                </v-flex>
                <v-flex xs12 sm12 class="">
                  <v-select
                    box
                    :items="dossierPartList"
                    v-model="currentAction.returnDossierFiles"
                    item-text="partName"
                    item-value="fileTemplateNo"
                    :hide-selected="true"
                    clearable
                  ></v-select>
                </v-flex>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm12>
                <v-flex xs12>
                  <div>Yêu cầu thanh toán</div>
                </v-flex>
                <v-flex xs12 sm12 class="">
                  <v-select
                    box
                    :items="requestPaymentList"
                    v-model="currentAction.requestPayment"
                    item-text="text"
                    item-value="value"
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
                  v-model="currentAction.createDossier"
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
            <v-flex xs12 class="text-right" style="
              position: fixed;
              bottom: 0;
              width: -webkit-calc( 100% - 300px );
              width: calc( 100% - 300px );
              background: white;
              z-index: 2;
            ">
              <v-btn color="blue"
                v-if="currentActionId === 0 || currentActionId === '0'"
                :loading="loading"
                :disabled="loading"
                @click="updateAction('add')"
              >
                <v-icon>add_circle_outline</v-icon>&nbsp;
                Thêm mới
              </v-btn>
              <v-btn color="blue"
                v-else
                :loading="loading"
                :disabled="loading"
                @click="updateAction('update')"
              >
                <v-icon>save</v-icon>&nbsp;
                Cập nhật
              </v-btn>
              <v-btn color="blue"
                :loading="loading"
                :disabled="loading"
                @click="goBackActionList"
              >
                <v-icon>reply</v-icon>&nbsp;
                Quay lại
              </v-btn>
            </v-flex>
          </v-form>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
  export default {
    props: ['id'],
    data () {
      return {
        activeStep: false,
        activeStepDetail: false,
        currentStepId: '',
        activeAction: false,
        activeActionDetail: false,
        currentActionId: '',
        loading: false,
        active: null,
        processRoleList: [
          {
            role: 'Nguyễn Văn Nam',
            roleId: 102,
            moderator: 0,
            moderatorText: 'Theo dõi',
            condition: 'viaPostal'
          },
          {
            role: 'Vũ Văn Hùng',
            roleId: 103,
            moderator: 1,
            moderatorText: 'Thực hiện',
            condition: 'eSignature'
          }
        ],
        headerProcessRoles: [
          {
            text: 'Tên',
            align: 'center',
            sortable: false
          },
          {
            text: 'Vai trò',
            align: 'center',
            sortable: false
          },
          {
            text: 'Điều kiện',
            align: 'center',
            sortable: false
          },
          {
            text: 'Thao tác',
            align: 'center',
            sortable: false
          }
        ],
        // serviceProcesses Data
        currentProcess: {
          processNo: '',
          processName: '',
          description: '',
          durationCount: '',
          durationUnit: 0,
          roleId: '',
          condition: '',
          moderator: 0,
          serverNo: '',
          generateDossierNo: '',
          dossierNoPattern: '',
          generateDueDate: '',
          dueDatePattern: '',
          generatePassword: false,
          directNotification: false
        },
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
        listStepPage: 1,
        listActionPage: 1,
        currentStep: {
          stepName: '',
          dossierStatus: '',
          dossierSubStatus: '',
          durationCount: '',
          stepCode: '',
          roleId: '',
          moderator: 0,
          condition: '',
          lockState: '',
          stepInstruction: '',
          briefNote: '',
          customProcessUrl: '',
          sequenceNo: ''
        },
        validAddStep: false,
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
        autoEventList: [
          { text: 'listener', value: 'listener' },
          { text: 'timmer', value: 'timmer' },
          { text: 'special', value: 'special' }
        ],
        assignTypeList: [
          { text: 'Không phân công', value: 0 },
          { text: 'Chỉ phân công người thực hiện', value: 1 },
          { text: 'Phân công thực hiện và phối hợp', value: 2 },
          { text: 'Phân công thực hiện,phối hợp và theo dõi', value: 3 }
        ],
        dossierTemplateList: [],
        dossierPartList: [],
        employeeList: [],
        requestPaymentList: [
          { text: 'Không thay đổi trạng thái', value: 0 },
          { text: 'Yêu cầu nộp tiền tạm ứng', value: 1 },
          { text: 'Yêu cầu quyết toán phí', value: 2 },
          { text: 'Báo đã nộp phí trực tuyến', value: 3 },
          { text: 'Yêu cầu nộp lại phí trực tuyến', value: 4 },
          { text: 'Xác nhận hoàn thành thu phí', value: 5 }
        ],
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
          createDossierFiles: null,
          returnDossierFiles: null,
          requestPayment: '',
          createDossier: '',
          syncActionCode: '',
          configNote: '',
          createDossierNo: false,
          eSignature: false
        },
        validAddAction: false,
        //
        rules: {
          required: (value) => (!!value || value === 0) || 'Trường dữ liệu bắt buộc'
        }
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        let currentQuery = vm.$router.history.current.query
        let currentParams = vm.$router.history.current.params
        console.log('currentParams', currentParams)
        vm.getJobpos()
        vm.getDossierStatus()
        vm.activeStep = currentQuery.hasOwnProperty('step') && currentQuery.step === 'true'
        vm.activeStepDetail = vm.activeStep && currentQuery.hasOwnProperty('stepCode') && currentQuery.stepCode
        vm.currentStepId = vm.activeStep && currentQuery.hasOwnProperty('stepCode') && currentQuery.stepCode ? Number(currentQuery.stepCode) : 0
        vm.activeAction = currentQuery.hasOwnProperty('action') && currentQuery.action === 'true'
        vm.activeActionDetail = vm.activeAction && currentQuery.hasOwnProperty('actionCode') && currentQuery.actionCode
        vm.currentActionId = vm.activeAction && currentQuery.hasOwnProperty('actionCode') && currentQuery.actionCode ? Number(currentQuery.actionCode) : 0
        console.log('currentActionId', vm.currentActionId)
        if (vm.activeStep) {
          vm.active = 'tab-2'
        } else if (vm.activeAction) {
          vm.active = 'tab-3'
        }
        vm.doDetailContent()
      })
    },
    computed: {
      jobposList () {
        return this.$store.getters.getJobPosList
      },
      dossierStatusList () {
        return this.$store.getters.getDossierStatusList
      },
      dossierSubStatusList () {
        return this.$store.getters.getDossierSubStatusList
      }
    },
    watch: {
      '$route': function (newRoute) {
        let vm = this
        let currentQuery = newRoute.query
        vm.activeStep = currentQuery.hasOwnProperty('step') && currentQuery.step === 'true'
        vm.activeStepDetail = vm.activeStep && currentQuery.hasOwnProperty('stepCode') && currentQuery.stepCode
        vm.currentStepId = vm.activeStep && currentQuery.hasOwnProperty('stepCode') && currentQuery.stepCode ? Number(currentQuery.stepCode) : 0
        vm.activeAction = currentQuery.hasOwnProperty('action') && currentQuery.action === 'true'
        vm.activeActionDetail = vm.activeAction && currentQuery.hasOwnProperty('actionCode') && currentQuery.actionCode
        vm.currentActionId = vm.activeAction && currentQuery.hasOwnProperty('actionCode') && currentQuery.actionCode ? Number(currentQuery.actionCode) : 0
        if (vm.activeStep) {
          vm.active = 'tab-2'
        } else if (vm.activeAction) {
          vm.active = 'tab-3'
        } else {
          vm.active = 'tab-1'
        }
        vm.doDetailContent()
      }
    },
    methods: {
      getJobpos () {
        var vm = this
        vm.$store.dispatch('getJobposList').then(function (result) {
          vm.$store.commit('setJobPosList', result)
        }).catch(reject => {
          console.log(reject)
        })
      },
      getDossierStatus () {
        var vm = this
        vm.$store.dispatch('getDossierStatusList').then(function (result) {
          vm.$store.commit('setDossierStatusList', result)
        }).catch(reject => {
          console.log(reject)
        })
      },
      changeDossierStatus () {
        var vm = this
        let dossierStatus = vm.currentStep.dossierStatus
        if (dossierStatus) {
          vm.getDossierSubStatus(dossierStatus)
        } else {
          vm.$store.commit('setDossierSubStatusList', [])
        }
      },
      getDossierSubStatus (dossierStatus) {
        var vm = this
        vm.$store.dispatch('getDossierSubStatusList', dossierStatus).then(function (result) {
          vm.$store.commit('setDossierSubStatusList', result)
        }).catch(reject => {
          console.log(reject)
        })
      },
      getProcessDetail (id) {
        var vm = this
        vm.$store.dispatch('getProcessDetail', id).then(function (result) {
          vm.currentProcess = result
        }).catch(reject => {
          console.log(reject)
        })
      },
      getProcessStepsDetail (stepCode) {
        var vm = this
        let filter = {
          processId: vm.id,
          stepCode: stepCode
        }
        vm.$store.dispatch('getProcessStepsDetail', filter).then(function (result) {
          vm.currentStep = result
          vm.changeDossierStatus()
        }).catch(reject => {
          console.log(reject)
        })
      },
      getEmployees () {
        var vm = this
        vm.$store.dispatch('getEmployee').then(function (result) {
          vm.employeeList = result
        }).catch(reject => {
          console.log(reject)
        })
      },
      getDossierTemplates () {
        var vm = this
        vm.$store.dispatch('getDossierTemplate').then(function (result) {
          vm.dossierTemplateList = result
        }).catch(reject => {
          console.log(reject)
        })
      },
      getDossierParts () {
        var vm = this
        if (vm.currentAction.dossierTemplateNo) {
          vm.$store.dispatch('getDossierPart', vm.currentAction.dossierTemplateNo).then(function (result) {
            vm.dossierPartList = result
          }).catch(reject => {
            console.log(reject)
          })
        } else {
          vm.dossierPartList = []
        }
      },
      getProcessSteps (id) {
        var vm = this
        let currentQuery = vm.$router.history.current.query
        let filter = {
          processId: id,
          page: currentQuery.page ? currentQuery.page : 1
        }
        vm.$store.dispatch('getProcessStep', filter).then(function (result) {
          vm.stepList = result
        }).catch(reject => {
          console.log(reject)
        })
      },
      getProcessActions () {
        var vm = this
        let currentQuery = vm.$router.history.current.query
        let filter = {
          processId: vm.id,
          page: currentQuery.page ? currentQuery.page : 1
        }
        vm.$store.dispatch('getProcessAction', filter).then(function (result) {
          vm.actionList = result
        }).catch(reject => {
          console.log(reject)
        })
      },
      getProcessActionDetail (actionCode) {
        var vm = this
        let filter = {
          processId: vm.id,
          actionCode: actionCode
        }
        vm.$store.dispatch('getProcessActionsDetail', filter).then(function (result) {
          vm.currentAction = result
        }).catch(reject => {
          console.log(reject)
        })
      },
      getProcessRoles () {},
      //
      doDetailContent () {
        var vm = this
        let currentQuery = vm.$router.history.current.query
        // let currentParams = vm.$router.history.current.params
        if (Number(vm.id) > 0 && !vm.activeStep && !vm.activeAction) {
          vm.getProcessDetail(vm.id)
        } else if (vm.activeStep && !vm.activeStepDetail) {
          vm.getProcessSteps(vm.id)
        } else if (vm.activeStep && vm.activeStepDetail) {
          vm.currentStep = {
            stepName: '',
            dossierStatus: '',
            dossierSubStatus: '',
            durationCount: '',
            stepCode: '',
            roleId: '',
            moderator: 0,
            condition: '',
            lockState: '',
            stepInstruction: '',
            briefNote: '',
            customProcessUrl: '',
            sequenceNo: ''
          }
          if (Number(currentQuery.stepCode) > 0) {
            vm.getProcessStepsDetail(currentQuery.stepCode)
          }
        } else if (vm.activeAction && !vm.activeActionDetail) {
          vm.getProcessActions(vm.id)
        } else if (vm.activeAction && vm.activeActionDetail) {
          vm.getProcessSteps(vm.id)
          vm.getDossierTemplates()
          vm.getEmployees()
          vm.currentAction = {
            actionName: '',
            actionCode: '',
            preCondition: '',
            autoEvent: '',
            preStepCode: '',
            postStepCode: '',
            allowAssignUser: '',
            rollbackable: false,
            dossierTemplateNo: '',
            createDossierFiles: null,
            returnDossierFiles: null,
            requestPayment: '',
            syncActionCode: '',
            configNote: '',
            createDossierNo: false,
            eSignature: false
          }
          if (Number(currentQuery.actionCode) > 0) {
            vm.getProcessActionDetail(currentQuery.actionCode)
          }
        }
      },
      updateProcess (type) {
        var vm = this
        let currentPath = vm.$router.history.current.path
        if (vm.$refs.formAddProcess.validate()) {
          vm.currentProcess['type'] = type
          vm.$store.dispatch('postProcess', vm.currentProcess).then(function (result) {
            if (type === 'add') {
              vm.$router.push({
                path: currentPath.replace(0, result.serviceProcessId),
                query: {
                  renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
                }
              })
              // vm.$router.push(currentPath.replace(0, result.serviceProcessId))
            } else {
              vm.currentProcess = result
            }
          }).catch(reject => {
            console.log(reject)
          })
        }
      },
      createStep () {
        var vm = this
        let currentPath = vm.$router.history.current.path
        vm.$router.push({
          path: currentPath + '?step=true&stepCode=0',
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
        // vm.$router.push(currentPath + '?step=true&stepCode=0')
      },
      updateStep (type) {
        var vm = this
        let currentPath = vm.$router.history.current.path
        if (vm.$refs.formAddStep.validate()) {
          vm.currentStep['type'] = type
          vm.currentStep['currentProcess'] = vm.id
          vm.$store.dispatch('postProcessStep', vm.currentStep).then(function (result) {
            if (type === 'add') {
              vm.$router.push({
                path: currentPath + '?step=true&stepCode=' + result.stepCode,
                query: {
                  renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
                }
              })
              // vm.$router.push(currentPath + '?step=true&stepCode=' + result.stepCode)
            } else {
              vm.currentStep = result
            }
          }).catch(reject => {
            console.log(reject)
          })
        }
      },
      editStep (itemStep) {
        var vm = this
        let currentPath = vm.$router.history.current.path
        vm.$router.push({
          path: currentPath + '?step=true&stepCode=' + itemStep.stepCode,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
        // vm.$router.push(currentPath + '?step=true&stepCode=' + itemStep.stepCode)
      },
      deleteStep (itemStep) {
        var vm = this
        let filter = {
          currentProcess: vm.id,
          stepCode: itemStep.stepCode
        }
        vm.$store.dispatch('deleteProcessStep', filter).then(function (result) {
          console.log(result)
          vm.getProcessSteps(vm.id)
        }).catch(reject => {
          console.log(reject)
        })
      },
      createAction () {
        var vm = this
        let currentPath = vm.$router.history.current.path
        vm.$router.push({
          path: currentPath + '?action=true&actionCode=0',
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
        // vm.$router.push(currentPath + '?action=true&actionCode=0')
      },
      updateAction (type) {
        var vm = this
        let currentPath = vm.$router.history.current.path
        if (vm.$refs.formAddAction.validate()) {
          vm.currentAction['type'] = type
          vm.currentAction['currentProcess'] = vm.id
          vm.$store.dispatch('postProcessAction', vm.currentAction).then(function (result) {
            if (type === 'add') {
              vm.$router.push({
                path: currentPath + '?action=true&actionCode=' + result.actionCode,
                query: {
                  renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
                }
              })
              // vm.$router.push(currentPath + '?action=true&actionCode=' + result.actionCode)
            } else {
              vm.currentAction = result
            }
          }).catch(reject => {
            console.log(reject)
          })
        }
      },
      editAction (itemAction) {
        var vm = this
        let currentPath = vm.$router.history.current.path
        vm.$router.push({
          path: currentPath + '?action=true&actionCode=' + itemAction.actionCode,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
        // vm.$router.push(currentPath + '?action=true&actionCode=' + itemAction.actionCode)
      },
      deleteAction (itemAction) {
        var vm = this
        let filter = {
          currentProcess: vm.id,
          actionCode: itemAction.actionCode
        }
        vm.$store.dispatch('deleteProcessAction', filter).then(function (result) {
          console.log(result)
          vm.getProcessActions(vm.id)
        }).catch(reject => {
          console.log(reject)
        })
      },
      changeTab (tab) {
        let vm = this
        let currentPath = vm.$router.history.current.path
        if (tab === 'process') {
          vm.$router.push(currentPath)
        } else if (tab === 'step') {
          if (Number(vm.id) > 0) {
            vm.$router.push({
              path: currentPath + '?step=true&page=' + vm.listStepPage,
              query: {
                renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
              }
            })
            // vm.$router.push(currentPath + '?step=true&page=' + vm.listStepPage)
          } else {
            vm.$router.push(currentPath)
          }
        } else {
          vm.$router.push({
            path: currentPath + '?action=true&page=' + vm.listActionPage,
            query: {
              renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
            }
          })
          // vm.$router.push(currentPath + '?action=true&page=' + vm.listActionPage)
        }
      },
      createProcessRole () {},
      goBackStepList () {
        let vm = this
        let currentPath = vm.$router.history.current.path
        vm.$router.push(currentPath + '?step=true')
      },
      goBackActionList () {
        let vm = this
        let currentPath = vm.$router.history.current.path
        vm.$router.push(currentPath + '?action=true')
      },
      backToList () {
        let vm = this
        let currentPath = vm.$router.history.current.path
        vm.$router.push(currentPath.substring(0, currentPath.indexOf('/editor/')))
      }
    }
  }
</script>
