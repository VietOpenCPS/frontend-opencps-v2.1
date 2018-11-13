<template>
  <div>
    <v-breadcrumbs>
      <v-icon slot="divider">chevron_right</v-icon>

      <v-breadcrumbs-item
        v-for="item in breadCrumbsitems"
        :disabled="item.disabled"
        :key="item.text"
      >
        {{ item.text }}
      </v-breadcrumbs-item>
      <a href="javascript:;" style="
        text-decoration: none;
        font-weight: bold;
      ">opencps_serviceprocess</a>
    </v-breadcrumbs>

    <v-card class="px-2 mx-1">
      <v-toolbar color="blue darken-3" dark height="48">
        <v-btn dark icon>
          <v-icon>edit</v-icon>
        </v-btn>
        <v-toolbar-title class="ml-0">
          {{currentProcessName}}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- <v-btn dark flat v-on:click.native="deleteRecord">
          <v-icon>delete</v-icon> &nbsp;
          Xoá bản ghi
        </v-btn> -->
        <v-icon dark>more_vert</v-icon>
        <v-btn dark icon v-on:click.native="backToList">
          <v-icon>undo</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="grid-list">
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
          <v-tab-item class="pt-3" value="tab-1" key="tab-1" transition="fade-transition" reverse-transition="fade-transition">
            <v-card style="margin-bottom:40px">
              <v-form ref="formAddProcess" class="px-2" v-model="validAddProcess" lazy-validation>
                <v-layout wrap>
                  <v-flex xs12 sm12>
                    <v-text-field
                      label="Số hiệu quy trình"
                      v-model="currentProcess.processNo"
                      box
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-flex>
                  <!--  -->
                  <v-flex xs12 sm12>
                    <v-text-field
                      label="Tên quy trình"
                      v-model="currentProcess.processName"
                      box
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-flex>
                  <!--  -->
                  <v-flex xs12 sm12>
                    <v-text-field
                      label="Mô tả"
                      v-model="currentProcess.description"
                      box
                    ></v-text-field>
                  </v-flex>
                  <!--  -->
                  <v-flex xs12 sm12>
                    <v-layout wrap>
                      <v-flex xs12 sm7 class="pl-0">
                        <v-text-field
                          label="Thời gian xử lý"
                          v-model="currentProcess.durationCount"
                          box
                          :rules="[rules.required]"
                          required
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm5 class="pl-2 pr-0">
                        <v-select
                          box
                          :items="[{text:'Tính theo ngày', value: 0}, {text:'Tính theo giờ', value: 1}]"
                          v-model="currentProcess.durationUnit"
                          item-text="text"
                          item-value="value"
                        ></v-select>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <!-- Vai trò xử lý -->
                  <v-flex xs12 sm12>
                    <v-layout wrap>
                      <v-flex xs12 sm4 class="pl-0">
                        <v-autocomplete
                          box
                          label="Vai trò xử lý"
                          :items="jobposList"
                          v-model="processRoleId"
                          item-text="title"
                          item-value="jobPosId"
                          :hide-selected="true"
                          return-object
                          clearable
                        ></v-autocomplete>
                      </v-flex>
                      <v-flex xs12 sm3 class="pl-2">
                        <v-select
                          box
                          :items="[{text:'Theo dõi', value: 0}, {text:'Thực hiện', value: 1}]"
                          v-model="processModerator"
                          item-text="text"
                          item-value="value"
                          :disabled="processRoleId?false:true"
                          return-object
                          cleable
                        ></v-select>
                      </v-flex>
                      <v-flex xs12 sm3 class="pl-2">
                        <v-text-field
                          label="Điều kiện phân công xử lý"
                          v-model="processCondition"
                          :disabled="processRoleId?false:true"
                          box
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm2 class="pl-2 text-xs-right">
                        <v-btn color="blue darken-3" dark
                          class="mr-0"
                          @click="createItemRole"
                          :disabled="processRoleId?false:true"
                        >
                          <v-icon size="24">add</v-icon>&nbsp;
                          Thêm
                        </v-btn>
                      </v-flex>
                      <!--  -->
                      <v-flex xs12 sm12>
                        <v-data-table
                          v-if="processRoleList.length>0"
                          :headers="headerProcessRoles"
                          :items="processRoleList"
                          hide-actions
                          class="elevation-1 table-bordered"
                          style="border: 1px solid #dedede"
                        >
                          <template slot="items" slot-scope="props">
                            <td class="text-xs-left" width="40%">{{ props.item.roleName }}</td>
                            <td class="text-xs-left" width="25%">{{ props.item.moderator|moderatorText }}</td>
                            <td class="text-xs-left" width="25%">{{ props.item.condition }}</td>
                            <td class="text-xs-center px-0" width="10%">
                              <v-icon small color="red" @click="deleteProcessRoles(props.item, props.index)">
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
                  <v-flex xs12 sm12>
                    <v-layout wrap>
                      <v-flex xs12 sm3 class="pl-0">
                        <v-text-field
                          label="Tên tiến trình"
                          v-model="sequenceName"
                          box
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm3 class="pl-2">
                        <v-text-field
                          label="Thứ tự thực hiện"
                          v-model="sequenceNo"
                          box
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm2 class="pl-2">
                        <v-text-field
                          label="Vai trò thực hiện"
                          v-model="sequenceRole"
                          box
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm2 class="pl-2">
                        <v-text-field
                          label="Thời hạn"
                          v-model="sequenceDurationCount"
                          box
                          type="Number"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm2 class="pl-2 text-xs-right">
                        <v-btn color="blue darken-3" dark
                          class="mr-0"
                          @click="createItemSequence"
                          :disabled="sequenceName&&sequenceRole&&sequenceNo&&sequenceDurationCount?false:true"
                        >
                          <v-icon size="24">add</v-icon>&nbsp;
                          Thêm
                        </v-btn>
                      </v-flex>
                      <!--  -->
                      <v-flex xs12 sm12>
                        <v-data-table
                          v-if="processSequenceList.length>0"
                          :headers="headerProcessSequence"
                          :items="processSequenceList"
                          hide-actions
                          class="elevation-1 table-bordered"
                          style="border: 1px solid #dedede"
                        >
                          <template slot="items" slot-scope="props">
                            <td class="text-xs-left" width="30%">{{ props.item.sequenceName }}</td>
                            <td class="text-xs-left" width="20%">{{ props.item.sequenceNo }}</td>
                            <td class="text-xs-left" width="20%">{{ props.item.sequenceRole }}</td>
                            <td class="text-xs-left" width="20%">{{ props.item.durationCount }}</td>
                            <td class="text-xs-center px-0" width="10%">
                              <v-icon small color="red" @click="deleteProcessSequence(props.item, props.index)">
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
                  <v-flex xs12 sm12>
                    <v-layout wrap>
                      <v-flex xs12 sm6 class="pr-2">
                        <v-switch label="Tạo số tiếp nhận hồ sơ" v-model="currentProcess.generateDossierNo"></v-switch>
                        <v-text-field
                          label="Cấu hình sinh mã số hồ sơ"
                          v-model="currentProcess.dossierNoPattern"
                          box
                          :rules="currentProcess.generateDossierNo ? [rules.required] : []"
                          :required="currentProcess.generateDossierNo"
                          :disabled="currentProcess.generateDossierNo?false:true"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 class="pl-2">
                        <v-switch label="Sinh ngày hẹn trả hồ sơ" v-model="currentProcess.generateDueDate"></v-switch>
                        <v-text-field
                          label="Cấu hình sinh ngày hẹn trả"
                          v-model="currentProcess.dueDatePattern"
                          box
                          :rules="currentProcess.generateDueDate ? [rules.required] : []"
                          :required="currentProcess.generateDueDate"
                          :disabled="currentProcess.generateDueDate?false:true"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <!--  -->
                  <v-flex xs12 sm12 class="mt-2">
                    <v-layout wrap>
                      <v-flex xs12 sm6>
                        <v-switch label="Sinh mật mã tra cứu hồ sơ" v-model="currentProcess.generatePassword"></v-switch>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-switch label="Gửi thông báo cho chủ hồ sơ" v-model="currentProcess.directNotification"></v-switch>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <!--  -->
                  <v-flex xs12 sm12>
                    <v-text-field
                      label="Server đồng bộ "
                      v-model="currentProcess.serverNo"
                      box
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-flex xs12 class="text-right pr-3" style="
                  position: fixed;
                  bottom: 0;
                  width: -webkit-calc( 100% - 300px );
                  width: calc( 100% - 300px );
                  background: white;
                  z-index: 2;
                ">
                  <v-btn color="blue darken-3" dark
                    v-if="id === 0 || id === '0'"
                    :loading="loading"
                    :disabled="loading"
                    @click="updateProcess('add')"
                  >
                    <v-icon>add_circle_outline</v-icon>&nbsp;
                    Thêm mới
                  </v-btn>
                  <v-btn color="blue darken-3" dark
                    v-else
                    :loading="loading"
                    :disabled="loading"
                    @click="updateProcess('update')"
                  >
                    <v-icon>save</v-icon>&nbsp;
                    Cập nhật
                  </v-btn>
                  <v-btn color="red darken-3" class="mr-0" dark v-on:click.native="backToList">
                    <v-icon>reply</v-icon>&nbsp;
                    Quay lại
                  </v-btn>
                </v-flex>
              </v-form>
            </v-card>
          </v-tab-item>
          <!-- Process Step -->
          <v-tab-item value="tab-2" key="tab-2" transition="fade-transition" reverse-transition="fade-transition">
            <!-- Danh sách step -->
            <v-card class="py-2 px-2" v-if="!activeStepDetail" style="margin-bottom:40px">
              <v-btn color="blue darken-3" dark
                :loading="loading"
                :disabled="loading"
                class="mb-3"
                @click="createStep"
              >
                <v-icon>add_circle_outline</v-icon>&nbsp;
                Thêm bước xử lý
              </v-btn>
              <v-data-table
                :headers="headerStep"
                :items="stepList"
                hide-actions
                class="elevation-1 table-bordered"
                style="border: 1px solid #dedede"
              >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-center" width="5%">
                    <div>
                      <span>{{listStepPage * 10 - 10 + props.index + 1}}</span>
                    </div>
                  </td>
                  <td class="text-xs-left" width="50%">{{ props.item.stepName }}</td>
                  <td class="text-xs-left" width="20%">{{ props.item.dossierStatusText }}</td>
                  <td class="text-xs-center" width="10%">{{ props.item.durationCount }}</td>
                  <td class="text-xs-center px-0" width="15%">
                    <v-icon
                      small color="blue"
                      class="mr-3"
                      @click="editStep(props.item)"
                    >
                      edit
                    </v-icon>
                    <v-icon
                      small color="red"
                      @click="deleteStep(props.item)"
                    >
                      delete
                    </v-icon>
                  </td>
                </template>
                <template slot="no-data">
                </template>
              </v-data-table>
              <v-flex xs12 class="text-right" style="
                position: fixed;
                bottom: 0;
                width: -webkit-calc( 100% - 300px );
                width: calc( 100% - 300px );
                background: white;
                z-index: 2;
              ">
                <div class="text-xs-right layout wrap mt-2 pr-2" style="position: relative;">
                  <v-flex xs12>
                    <tiny-pagination :total="pageTotalStep" :page="pageStep" @tiny:change-page="paggingStepData" custom-class="custom-tiny-class"></tiny-pagination> 
                  </v-flex>
                </div>
              </v-flex>
            </v-card>
            <!-- Chi tiết step -->
            <v-card class="pt-2" v-else style="margin-bottom:40px">
              <v-form ref="formAddStep" v-model="validAddStep" lazy-validation class="px-2">
                <v-layout wrap>
                  <v-flex xs12 sm6 class="pr-2">
                    <v-text-field
                      label="Tên bước"
                      v-model="currentStep.stepName"
                      box
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 class="pl-2">
                    <v-text-field
                      label="Số thứ tự"
                      v-model="currentStep.sequenceNo"
                      box
                    ></v-text-field>
                  </v-flex>
                  <!--  -->
                  <v-flex xs12 sm6 class="pr-2">
                    <v-autocomplete
                      box
                      label="Trạng thái chính "
                      :items="dossierStatusList"
                      v-model="currentStep.dossierStatus"
                      item-text="itemName"
                      item-value="itemCode"
                      :hide-selected="true"
                      clearable
                      :rules="[rules.required]"
                      required
                      @change="changeDossierStatus"
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs12 sm6 class="pl-2">
                    <v-text-field
                      label="Mã bước quy trình "
                      v-model="currentStep.stepCode"
                      box
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-flex>
                  <!--  -->
                  <v-flex xs12 sm6 class="pr-2">
                    <v-autocomplete
                      box
                      label="Trạng thái phụ"
                      :items="dossierSubStatusList"
                      v-model="currentStep.dossierSubStatus"
                      item-text="itemName"
                      item-value="itemCode"
                      :hide-selected="true"
                      clearable
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field
                      label="Thời gian xử lý"
                      v-model="currentStep.durationCount"
                      box
                    ></v-text-field>
                  </v-flex>
                  <!--  -->
                  <v-flex xs12 sm12>
                    <v-layout wrap>
                      <v-flex xs12 sm3 class="pl-0">
                        <v-autocomplete
                          label="Vai trò xử lý"
                          box
                          :items="jobposList"
                          v-model="stepRoleId"
                          item-text="title"
                          item-value="jobPosId"
                          :hide-selected="true"
                          return-object
                          clearable
                        ></v-autocomplete>
                      </v-flex>
                      <v-flex xs12 sm3 class="px-2">
                        <v-select
                          box
                          :items="[{text:'Theo dõi', value: 0}, {text:'Thực hiện', value: 1}]"
                          v-model="stepModerator"
                          item-text="text"
                          item-value="value"
                          :disabled="stepRoleId?false:true"
                          return-object
                          cleable
                        ></v-select>
                      </v-flex>
                      <v-flex xs12 sm4 class="pl-1">
                        <v-text-field
                          label="Điều kiện phân công xử lý"
                          v-model="stepCondition"
                          :disabled="stepRoleId?false:true"
                          box
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm2 class="pl-2 text-xs-right">
                        <v-btn color="blue darken-3" dark
                          class="mr-0"
                          @click="createItemStepRole"
                          :disabled="stepRoleId?false:true"
                        >
                          <v-icon size="24">add</v-icon>&nbsp;
                          Thêm
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <!--  -->
                  <v-flex xs12 sm12>
                    <v-data-table
                      v-if="stepRoleList.length>0"
                      :headers="headerProcessRoles"
                      :items="stepRoleList"
                      hide-actions
                      class="elevation-1 table-bordered"
                      style="border: 1px solid #dedede"
                    >
                      <template slot="items" slot-scope="props">
                        <td class="text-xs-left" width="40%">{{ props.item.roleName }}</td>
                        <td class="text-xs-left" width="25%">{{ props.item.moderator|moderatorText }}</td>
                        <td class="text-xs-left" width="25%">{{ props.item.condition }}</td>
                        <td class="text-xs-center px-0" width="10%">
                          <v-icon color="red" small @click="deleteStepRoles(props.item, props.index)">
                            delete
                          </v-icon>
                        </td>
                      </template>
                    </v-data-table>
                  </v-flex>
                  <!--  -->
                  <!-- <v-flex xs12 sm12>
                    <v-text-field
                      label="Lock State"
                      v-model="currentStep.lockState"
                      box
                    ></v-text-field>
                  </v-flex> -->
                  <!--  -->
                  <v-flex xs12 sm12>
                    <v-text-field
                      label="Hướng dẫn"
                      v-model="currentStep.stepInstruction"
                      box
                      row
                    ></v-text-field>
                  </v-flex>
                  <!--  -->
                  <v-flex xs12 sm12>
                    <v-text-field
                      label="Tóm tắt hồ sơ"
                      v-model="currentStep.briefNote"
                      box
                    ></v-text-field>
                  </v-flex>
                  <!--  -->
                  <v-flex xs12 sm12>
                    <v-text-field
                      label="Nhúng ajax của phần nghiệp vụ"
                      v-model="currentStep.customProcessUrl"
                      box
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 class="pl-2">
                    <v-switch label="Cho phép sửa hồ sơ" v-model="currentStep.editable"></v-switch>
                  </v-flex>
                </v-layout>
                <v-flex xs12 class="text-right pr-3" style="
                  position: fixed;
                  bottom: 0;
                  width: -webkit-calc( 100% - 300px );
                  width: calc( 100% - 300px );
                  background: white;
                  z-index: 2;
                ">
                  <v-btn color="blue darken-3" dark
                    v-if="currentStepId === 0 || currentStepId === '0'"
                    :loading="loading"
                    :disabled="loading"
                    @click="updateStep('add')"
                  >
                    <v-icon>add_circle_outline</v-icon>&nbsp;
                    Thêm mới
                  </v-btn>
                  <v-btn color="blue darken-3" dark
                    v-else
                    :loading="loading"
                    :disabled="loading"
                    @click="updateStep('update')"
                  >
                    <v-icon>save</v-icon>&nbsp;
                    Cập nhật
                  </v-btn>
                  <v-btn color="red darken-3" dark
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
          <v-tab-item value="tab-3" key="tab-3" transition="fade-transition" reverse-transition="fade-transition">
            <!-- Danh sách Action -->
            <v-card class="py-2 px-2" v-if="!activeActionDetail" style="margin-bottom:40px">
              <v-btn color="blue darken-3" dark
                :loading="loading"
                :disabled="loading"
                class="mb-3"
                @click="createAction"
              >
                <v-icon>add_circle_outline</v-icon>&nbsp;
                Thêm thao tác
              </v-btn>
              <v-data-table
                :headers="headerAction"
                :items="actionList"
                hide-actions
                class="elevation-1 table-bordered"
                style="border: 1px solid #dedede"
              >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-center" width="5%">
                    <div>
                      <span>{{listActionPage * 10 - 10 + props.index + 1}}</span>
                    </div>
                  </td>
                  <td class="text-xs-left" width="20%">{{ props.item.actionName }}</td>
                  <td class="text-xs-left" width="30%">{{ props.item.preStepName }}</td>
                  <td class="text-xs-left" width="30%">{{ props.item.postStepName }}</td>
                  <td class="text-xs-center px-0" width="15%">
                    <v-icon
                      small color="blue"
                      class="mr-3"
                      @click="editAction(props.item)"
                    >
                      edit
                    </v-icon>
                    <v-icon
                      small color="red"
                      @click="deleteAction(props.item)"
                    >
                      delete
                    </v-icon>
                  </td>
                </template>
                <template slot="no-data">
                </template>
              </v-data-table>
              <v-flex xs12 class="text-right" style="
                position: fixed;
                bottom: 0;
                width: -webkit-calc( 100% - 300px );
                width: calc( 100% - 300px );
                background: white;
                z-index: 2;
              ">
                <div class="text-xs-right layout wrap mt-2 pr-2" style="position: relative;">
                  <v-flex xs12>
                    <tiny-pagination :total="pageTotalAction" :page="pageAction" @tiny:change-page="paggingActionData" custom-class="custom-tiny-class"></tiny-pagination> 
                  </v-flex>
                </div>
              </v-flex>
            </v-card>
            <!-- Chi tiết Action -->
            <v-card class="pt-2" v-else style="margin-bottom:40px">
              <v-form ref="formAddAction" v-model="validAddAction" lazy-validation class="px-2">
                <v-layout wrap>
                  <v-flex xs12 sm6 class="pr-2">
                    <v-text-field
                      label="Tên thao tác"
                      v-model="currentAction.actionName"
                      box
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 class="pl-2">
                    <v-text-field
                      label="Mã thao tác"
                      v-model="currentAction.actionCode"
                      box
                    ></v-text-field>
                  </v-flex>
                  <!--  -->
                  <v-flex xs12 sm6 class="pr-2">
                    <v-text-field
                      label="Điều kiện kiểm tra"
                      v-model="currentAction.preCondition"
                      box
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 class="pl-2">
                    <v-select
                      box
                      label="Kích hoạt sự kiện"
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
                    <v-autocomplete
                      label="Bước thực hiện thao tác"
                      box
                      :items="stepListAction"
                      v-model="currentAction.preStepCode"
                      item-text="stepName"
                      item-value="stepCode"
                      :hide-selected="true"
                      clearable
                      :rules="[rules.required]"
                      required
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs12 sm6 class="pl-2">
                    <v-autocomplete
                      box
                      label="Bước sau thực hiện thao tác"
                      :items="stepListAction"
                      v-model="currentAction.postStepCode"
                      item-text="stepName"
                      item-value="stepCode"
                      :hide-selected="true"
                      clearable
                      :rules="[rules.required]"
                      required
                    ></v-autocomplete>
                  </v-flex>
                  <!--  -->
                  <v-flex xs12 sm6 class="pr-2">
                    <v-select
                      box
                      label="Phân công người thực hiện"
                      :items="assignTypeList"
                      v-model="currentAction.allowAssignUser"
                      item-text="text"
                      item-value="value"
                      :hide-selected="true"
                      clearable
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 sm6 class="pl-2">
                    <v-switch label="Cho phép rollback" v-model="currentAction.rollbackable"></v-switch>
                  </v-flex>
                  <!--  -->
                  <v-flex xs12 sm6 class="pr-2">
                    <v-autocomplete
                      box
                      label="Người được chọn ngầm định"
                      :items="employeeList"
                      v-model="currentAction.assignUserId"
                      item-text="fullName"
                      item-value="employeeId"
                      :hide-selected="true"
                      clearable
                    ></v-autocomplete>
                  </v-flex>
                  <!--  -->
                  <v-flex xs12 sm12>
                    <v-autocomplete
                      box
                      label="Mẫu hồ sơ"
                      :items="dossierTemplateList"
                      v-model="currentAction.dossierTemplateNo"
                      item-text="templateName"
                      item-value="dossierTemplateId"
                      :hide-selected="true"
                      clearable
                      @change="getDossierParts"
                    ></v-autocomplete>
                  </v-flex>
                  <!--  -->
                  <v-flex xs12 sm6 class="pr-2">
                    <v-autocomplete
                      box
                      label="Tài liệu tạo mới"
                      :items="dossierPartList"
                      v-model="currentAction.createDossierFiles"
                      item-text="partName"
                      item-value="fileTemplateNo"
                      multiple
                      clearable
                    >
                      <template
                        slot="selection"
                        slot-scope="{ item, index }"
                      >
                        <v-flex xs12>{{index + 1}}. {{item.partName}}</v-flex>
                      </template>
                    </v-autocomplete>
                  </v-flex>
                  <v-flex xs12 sm6 class="pl-2">
                    <v-autocomplete
                      box
                      label="Kết quả trả về"
                      :items="dossierPartList"
                      v-model="currentAction.returnDossierFiles"
                      item-text="partName"
                      item-value="fileTemplateNo"
                      multiple
                      clearable
                    >
                      <template
                        slot="selection"
                        slot-scope="{ item, index }"
                      >
                        <v-flex xs12>{{index + 1}}. {{item.partName}}</v-flex>
                      </template>
                    </v-autocomplete>
                  </v-flex>
                  <!--  -->
                  <v-flex xs12 sm12>
                    <v-select
                      box
                      label="Yêu cầu thanh toán"
                      :items="requestPaymentList"
                      v-model="currentAction.requestPayment"
                      item-text="text"
                      item-value="value"
                      :hide-selected="true"
                      clearable
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 sm12 v-if="Number(currentAction.requestPayment) > 0">
                    <v-text-field
                      label="Chuỗi cấu hình tính phí"
                      v-model="currentAction.paymentFee"
                      box
                    ></v-text-field>
                  </v-flex>
                  <!--  -->
                  <v-flex xs12 sm12>
                    <v-text-field
                      label="Mã đồng bộ"
                      v-model="currentAction.syncActionCode"
                      box
                    ></v-text-field>
                  </v-flex>
                  <!--  -->
                  <v-flex xs12 sm12>
                    <v-autocomplete
                      box
                      label="Cấu hình cơ quan"
                      :items="agencyLists"
                      v-model="currentAction.createDossier"
                      item-text="itemName"
                      item-value="itemCode"
                      multiple
                      clearable
                    >
                    </v-autocomplete>
                    <!-- <v-text-field
                      label="Cấu hình cơ quan"
                      v-model="currentAction.createDossier"
                      box
                    ></v-text-field> -->
                  </v-flex>
                  <!--  -->
                  <v-flex xs12 sm12>
                    <v-text-field
                      label="Cấu hình panel nhập ý kiến"
                      v-model="currentAction.configNote"
                      box
                    ></v-text-field>
                  </v-flex>
                  <!--  -->
                  <v-flex xs12 sm12>
                    <v-layout wrap>
                      <v-flex xs12 sm3 class="pr-2">
                        <v-switch label="Sinh mã số tiếp nhận" v-model="currentAction.createDossierNo"></v-switch>
                      </v-flex>
                      <v-flex xs12 sm3 class="pl-2">
                        <v-switch label="Có ký số điện tử" v-model="currentAction.eSignature"></v-switch>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
                <v-flex xs12 class="text-right pr-3" style="
                  position: fixed;
                  bottom: 0;
                  width: -webkit-calc( 100% - 300px );
                  width: calc( 100% - 300px );
                  background: white;
                  z-index: 2;
                ">
                  <v-btn color="blue darken-3" dark
                    v-if="currentActionId === 0 || currentActionId === '0'"
                    :loading="loading"
                    :disabled="loading"
                    @click="updateAction('add')"
                  >
                    <v-icon>add_circle_outline</v-icon>&nbsp;
                    Thêm mới
                  </v-btn>
                  <v-btn color="blue darken-3" dark
                    v-else
                    :loading="loading"
                    :disabled="loading"
                    @click="updateAction('update')"
                  >
                    <v-icon>save</v-icon>&nbsp;
                    Cập nhật
                  </v-btn>
                  <v-btn color="red darken-3" dark
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
    </v-card>
  </div>
</template>

<script>
  import TinyPagination from '../ext/TinyPagination.vue'
  export default {
    props: ['id'],
    components: {
      'tiny-pagination': TinyPagination
    },
    data () {
      return {
        breadCrumbsitems: [
          {
            text: 'Bảng dữ liệu',
            disabled: false
          },
          {
            text: '',
            disabled: false
          }
        ],
        nameScreen: '',
        currentProcessName: '',
        processRoleId: '',
        processModerator: '',
        processCondition: '',
        sequenceName: '',
        sequenceNo: '',
        sequenceRole: '',
        sequenceDurationCount: '',
        stepRoleId: '',
        stepModerator: '',
        stepCondition: '',
        activeStep: false,
        activeStepDetail: false,
        currentStepId: '',
        activeAction: false,
        activeActionDetail: false,
        currentActionId: '',
        loading: false,
        active: null,
        processRoleList: [],
        processSequenceList: [],
        stepRoleList: [],
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
        headerProcessSequence: [
          {
            text: 'Tên tiến trình',
            align: 'center',
            sortable: false
          },
          {
            text: 'Thứ tự thực hiện',
            align: 'center',
            sortable: false
          },
          {
            text: 'Vai trò',
            align: 'center',
            sortable: false
          },
          {
            text: 'Hạn xử lý',
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
        pageTotalStep: 0,
        pageStep: 1,
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
        stepListAction: [],
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
          stepInstruction: '',
          briefNote: '',
          customProcessUrl: '',
          sequenceNo: '',
          editable: false
        },
        validAddStep: false,
        // PROCESS ACTION DATA
        pageTotalAction: 0,
        pageAction: 1,
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
        agencyLists: [],
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
          createDossierFiles: [],
          returnDossierFiles: [],
          requestPayment: '',
          paymentFee: '',
          createDossier: [],
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
          vm.currentProcessName = result.processName
          vm.getProcessRoles()
          vm.getProcessSequence()
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
          vm.getStepRoles(result.stepCode)
          vm.changeDossierStatus()
        }).catch(reject => {
          console.log(reject)
        })
      },
      getAgencyLists () {
        var vm = this
        vm.$store.dispatch('getAgencyLists').then(function (result) {
          vm.agencyLists = result
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
      paggingStepData (config) {
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
      paggingActionData (config) {
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
      getProcessSteps (id) {
        var vm = this
        let currentQuery = vm.$router.history.current.query
        let filter = {
          processId: id,
          page: currentQuery.page ? currentQuery.page : 1
        }
        vm.pageTotalStep = 0
        vm.$store.dispatch('getProcessStep', filter).then(function (result) {
          vm.stepList = result.data
          vm.pageTotalStep = result.total
        }).catch(reject => {
          console.log(reject)
        })
      },
      getProcessStepAction (id) {
        var vm = this
        let filter = {
          processId: id
        }
        vm.$store.dispatch('getProcessStep', filter).then(function (result) {
          vm.stepListAction = result.data
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
        vm.pageTotalAction = 0
        vm.$store.dispatch('getProcessAction', filter).then(function (result) {
          vm.actionList = result.data
          vm.pageTotalAction = result.total
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
          vm.currentAction['createDossier'] = result.createDossiers ? result.createDossiers.split(',') : []
          vm.currentAction['createDossierFiles'] = result.createDossierFiles ? result.createDossierFiles.split(',') : []
          vm.currentAction['returnDossierFiles'] = result.returnDossierFiles ? result.returnDossierFiles.split(',') : []
        }).catch(reject => {
          console.log(reject)
        })
      },
      getProcessRoles () {
        var vm = this
        let filter = {
          processId: vm.id
        }
        vm.$store.dispatch('getProcessRole', filter).then(function (result) {
          vm.processRoleList = result
        }).catch(reject => {
          console.log(reject)
        })
      },
      getProcessSequence () {
        var vm = this
        let filter = {
          processId: vm.id
        }
        vm.$store.dispatch('getProcessSequence', filter).then(function (result) {
          vm.processSequenceList = result
        }).catch(reject => {
          console.log(reject)
        })
      },
      //
      doDetailContent () {
        var vm = this
        let currentQuery = vm.$router.history.current.query
        // let currentParams = vm.$router.history.current.params
        vm.getAgencyLists()
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
            stepInstruction: '',
            briefNote: '',
            customProcessUrl: '',
            sequenceNo: '',
            editable: false
          }
          vm.stepRoleList = []
          if (Number(currentQuery.stepCode) > 0) {
            vm.getProcessStepsDetail(currentQuery.stepCode)
          }
        } else if (vm.activeAction && !vm.activeActionDetail) {
          vm.getProcessActions(vm.id)
        } else if (vm.activeAction && vm.activeActionDetail) {
          vm.getProcessStepAction(vm.id)
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
            createDossierFiles: [],
            returnDossierFiles: [],
            requestPayment: '',
            syncActionCode: '',
            configNote: '',
            createDossierNo: false,
            eSignature: false,
            createDossier: []
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
              if (vm.processRoleList.length > 0) {
                for (let key in vm.processRoleList) {
                  vm.createProcessRoles(result.serviceProcessId, vm.processRoleList[key])
                }
              }
              if (vm.processSequenceList.length > 0) {
                for (let key in vm.processSequenceList) {
                  vm.createProcessSequence(result.serviceProcessId, vm.processSequenceList[key])
                }
              }
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
      createItemRole () {
        let vm = this
        let itemAdd = {
          roleId: vm.processRoleId.jobPosId,
          roleName: vm.processRoleId.title,
          moderator: vm.processModerator.value,
          moderatorText: vm.processModerator.text,
          condition: vm.processCondition
        }
        if (Number(vm.id) > 0) {
          vm.createProcessRoles(vm.id, itemAdd)
        } else {
          vm.processRoleList.unshift(itemAdd)
        }
      },
      createProcessRoles (processId, processRoles) {
        var vm = this
        let filter = {
          processId: processId,
          processRoles: processRoles
        }
        vm.$store.dispatch('postProcessRoles', filter).then(function (result) {
          console.log(result)
          vm.getProcessRoles()
        }).catch(reject => {
          console.log(reject)
        })
      },
      createItemSequence () {
        let vm = this
        let itemAdd = {
          sequenceName: vm.sequenceName,
          sequenceNo: vm.sequenceNo,
          durationCount: vm.sequenceDurationCount,
          sequenceRole: vm.sequenceRole
        }
        if (Number(vm.id) > 0) {
          vm.createProcessSequence(vm.id, itemAdd)
        } else {
          vm.processSequenceList.unshift(itemAdd)
        }
      },
      createProcessSequence (processId, processSequence) {
        var vm = this
        let filter = {
          processId: processId,
          processSequence: processSequence
        }
        vm.$store.dispatch('postProcessSequence', filter).then(function (result) {
          console.log(result)
          vm.getProcessSequence()
        }).catch(reject => {
          console.log(reject)
        })
      },
      deleteProcessRoles (processRoles, index) {
        var vm = this
        if (Number(vm.id) > 0) {
          let x = confirm('Xác nhận xóa dữ liệu')
          if (x) {
            let filter = {
              processId: vm.id,
              processRoles: processRoles
            }
            vm.$store.dispatch('deleteProcessRoles', filter).then(function (result) {
              console.log(result)
              vm.getProcessRoles()
            }).catch(reject => {
              console.log(reject)
            })
          }
        } else {
          vm.processRoleList.splice(index, 1)
        }
      },
      deleteProcessSequence (processSequence, index) {
        var vm = this
        if (Number(vm.id) > 0) {
          let x = confirm('Xác nhận xóa dữ liệu')
          if (x) {
            let filter = {
              processId: vm.id,
              processSequence: processSequence
            }
            vm.$store.dispatch('deleteProcessSequence', filter).then(function (result) {
              console.log(result)
              vm.getProcessSequence()
            }).catch(reject => {
              console.log(reject)
            })
          }
        } else {
          vm.processSequenceList.splice(index, 1)
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
              if (vm.stepRoleList.length > 0) {
                for (let key in vm.stepRoleList) {
                  vm.createStepRoles(result.stepCode, vm.stepRoleList[key])
                }
              }
              vm.$router.push({
                path: currentPath + '?step=true',
                query: {
                  renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
                }
              })
              // vm.$router.push(currentPath + '?step=true&stepCode=' + result.stepCode)
            } else {
              vm.$router.push({
                path: currentPath + '?step=true',
                query: {
                  renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
                }
              })
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
      createItemStepRole () {
        let vm = this
        let currentQuery = vm.$router.history.current.query
        let stepCode = currentQuery.hasOwnProperty('stepCode') ? currentQuery.stepCode : 0
        let itemAdd = {
          roleId: vm.stepRoleId.jobPosId,
          roleName: vm.stepRoleId.title,
          moderatorText: vm.stepModerator.text,
          moderator: vm.stepModerator.value,
          condition: vm.stepCondition
        }
        if (stepCode > 0) {
          vm.createStepRoles(stepCode, itemAdd)
        } else {
          vm.stepRoleList.unshift(itemAdd)
        }
      },
      createStepRoles (stepId, stepRoles) {
        var vm = this
        let filter = {
          processId: vm.id,
          stepRoles: stepRoles,
          stepId: stepId
        }
        vm.$store.dispatch('postStepRoles', filter).then(function (result) {
          console.log(result)
          vm.getStepRoles(stepId)
        }).catch(reject => {
          console.log(reject)
        })
      },
      deleteStepRoles (stepRoles, index) {
        var vm = this
        let currentQuery = vm.$router.history.current.query
        let stepId = currentQuery.hasOwnProperty('stepCode') ? currentQuery.stepCode : 0
        if (Number(stepId) > 0) {
          let x = confirm('Xác nhận xóa dữ liệu')
          if (x) {
            let filter = {
              processId: vm.id,
              stepRoles: stepRoles,
              stepId: stepId
            }
            vm.$store.dispatch('deleteStepRoles', filter).then(function (result) {
              console.log(result)
              vm.getStepRoles()
            }).catch(reject => {
              console.log(reject)
            })
          }
        } else {
          vm.stepRoleList.splice(index, 1)
        }
      },
      deleteStep (itemStep) {
        let x = confirm('Xác nhận xóa dữ liệu')
        if (x) {
          var vm = this
          let filter = {
            currentProcess: vm.id,
            stepCode: itemStep.stepCode
          }
          vm.$store.dispatch('deleteProcessStep', filter).then(function () {
            setTimeout (function () {
              vm.getProcessSteps(vm.id)
            }, 300)
          }).catch(reject => {
            console.log(reject)
          })
        }
      },
      getStepRoles (stepId) {
        var vm = this
        let filter = {
          processId: vm.id,
          stepId: stepId
        }
        vm.$store.dispatch('getStepRole', filter).then(function (result) {
          vm.stepRoleList = result
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
        console.log('currentAction', vm.currentAction)
        let currentPath = vm.$router.history.current.path
        if (vm.$refs.formAddAction.validate()) {
          vm.currentAction['type'] = type
          vm.currentAction['currentProcess'] = vm.id
          vm.$store.dispatch('postProcessAction', vm.currentAction).then(function (result) {
            vm.$router.push({
              path: currentPath + '?action=true',
              query: {
                renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
              }
            })
            console.log(result)
          }).catch(reject => {
            console.log(reject)
          })
        }
      },
      editAction (itemAction) {
        var vm = this
        let currentPath = vm.$router.history.current.path
        vm.$router.push({
          path: currentPath + '?action=true&actionCode=' + itemAction.processActionId,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
        // vm.$router.push(currentPath + '?action=true&actionCode=' + itemAction.actionCode)
      },
      deleteAction (itemAction) {
        let x = confirm('Xác nhận xóa dữ liệu')
        if (x) {
          var vm = this
          let filter = {
            currentProcess: vm.id,
            processActionId: itemAction.processActionId
          }
          vm.$store.dispatch('deleteProcessAction', filter).then(function (result) {
            console.log(result)
            vm.getProcessActions(vm.id)
          }).catch(reject => {
            console.log(reject)
          })
        }
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
        vm.$router.push(currentPath.substring(0, currentPath.indexOf('/ext/editor/')))
      }
    },
    filters: {
      moderatorText (arg) {
        if (arg === false || arg === 'false' || arg === 0 || arg === '0') {
          return 'Theo dõi'
        } else {
          return 'Thực hiện'
        }
      },
      parseArray (arg) {
        if (arg) {
          return arg.split(',')
        } else {
          return []
        }
      }
    }
  }
</script>
