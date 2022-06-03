<template>
  <div>
    <v-dialog
      v-model="dialogLoadingSync"
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          <div style="
              text-align: center;
          ">{{titleAction}}</div>
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <vue-confirm-dialog></vue-confirm-dialog>
    <bbat-table :table-name="tableName" @cloneProcess="cloneProcessEmitted" @cloneTemplate="cloneTemplateEmitted"
    @cloneProcessToOtherSite="cloneProcessToOtherSiteEmitted" @showCloneTemplateDonVi="showCloneTemplateDonViEmitted"
    @showCloneBuocXuLyDonVi="showCloneBuocXuLyDonViEmitted" @showCloneThaoTacXuLyDonVi="showCloneThaoTacXuLyDonViEmitted"
    ></bbat-table>
    <v-dialog v-model="dialog_cloneServiceProcess" scrollable persistent max-width="700px">
      <v-card>
        <v-card-title class="headline pb-2">
          <span v-if="!otherSite">Sao chép quy trình: {{oldProcessName}}</span>
          <span v-if="otherSite">Đồng bộ quy trình: {{oldProcessName}}</span>
        </v-card-title>
        <v-card-text class="pt-3">
          <v-form ref="formCloneServiceProcess" v-model="validForm" lazy-validation>
            <v-layout wrap class="py-1 align-center row-list-style">
              <v-flex xs12>
                  <div class="mb-2">Số hiệu quy trình tạo mới:</div>
                  <v-text-field
                    box
                    v-model="processNo"
                    :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                    :required="true"
                  ></v-text-field>
              </v-flex>
              <!-- <v-flex xs12>
                  <div class="my-2">Tên quy trình tạo mới:</div>
                  <v-text-field
                    box
                    v-model="processName"
                    :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                    :required="true"
                  ></v-text-field>
              </v-flex> -->
              <v-flex xs12 class="my-2" v-if="otherSite">
                <div>
                  <div class="my-2">Đồng bộ đến đơn vị:</div>
                  <v-autocomplete
                    placeholder="Chọn đơn vị"
                    :items="agencyListManager"
                    v-model="toAgency"
                    item-text="text"
                    item-value="value"
                    hide-details
                    hide-no-data
                    return-object
                    box
                    :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                    :required="true"
                  ></v-autocomplete>
                </div>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions class="px-3">
          <v-spacer></v-spacer>
          <v-btn color="red darken-3" class="mr-0" dark v-on:click="dialog_cloneServiceProcess = false">
            <v-icon class="white--text">clear</v-icon>&nbsp;
            Hủy
          </v-btn>
          <v-btn color="blue darken-3" dark
            :loading="loading"
            :disabled="loading"
            @click="cloneQuyTrinh"
          >
            <v-icon>save</v-icon>&nbsp;
            <span v-if="!otherSite">Sao chép</span>
            <span v-if="otherSite">Đồng bộ</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  -->
    <v-dialog v-model="dialog_cloneTemp" scrollable persistent max-width="700px">
      <v-card>
        <v-card-title class="headline pb-2">
          <span>Đồng bộ mẫu hồ sơ: {{oldTemplateName}}</span>
        </v-card-title>
        <v-card-text class="pt-3">
          <v-form ref="formCloneTemp" v-model="validFormCloneTemp" lazy-validation>
            <v-layout wrap class="py-1 align-center row-list-style">
              <v-flex xs12>
                  <div class="mb-2">Mã mẫu hồ sơ tạo mới:</div>
                  <v-text-field
                    box
                    v-model="tempNo"
                    :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                    :required="true"
                  ></v-text-field>
              </v-flex>
              <v-flex xs12 class="my-2">
                <div>
                  <div class="my-2">Đồng bộ đến đơn vị:</div>
                  <v-autocomplete
                    placeholder="Chọn đơn vị"
                    :items="agencyListManager"
                    v-model="toAgency"
                    item-text="text"
                    item-value="value"
                    hide-details
                    hide-no-data
                    return-object
                    box
                    :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                    :required="true"
                  ></v-autocomplete>
                </div>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions class="px-3">
          <v-spacer></v-spacer>
          <v-btn color="red darken-3" class="mr-0" dark v-on:click="dialog_cloneTemp = false">
            <v-icon class="white--text">clear</v-icon>&nbsp;
            Hủy
          </v-btn>
          <v-btn color="blue darken-3" dark
            :loading="loading"
            :disabled="loading"
            @click="cloneTempToOtherSite"
          >
            <v-icon>save</v-icon>&nbsp;
            <span>Đồng bộ</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  -->
    <v-dialog v-model="dialog_cloneStep" scrollable persistent max-width="700px">
      <v-card>
        <v-card-title class="headline pb-2">
          <span v-if="typeClone === 'step'">Đồng bộ bước xử lý: {{oldStepName}}</span>
          <span v-if="typeClone === 'action'">Đồng bộ thao tác xử lý: {{oldActionName}}</span>
        </v-card-title>
        <v-card-text class="pt-3">
          <v-form ref="formCloneTemp" v-model="validFormCloneStep" lazy-validation>
            <v-layout wrap class="py-1 align-center row-list-style">
              <v-flex xs12 class="my-2">
                <div>
                  <div class="my-2">Đồng bộ đến đơn vị:</div>
                  <v-autocomplete
                    placeholder="Chọn đơn vị"
                    :items="agencyListManager"
                    v-model="toAgency"
                    item-text="text"
                    item-value="value"
                    hide-details
                    hide-no-data
                    return-object
                    box
                    :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                    :required="true"
                  ></v-autocomplete>
                </div>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions class="px-3">
          <v-spacer></v-spacer>
          <v-btn color="red darken-3" class="mr-0" dark v-on:click="dialog_cloneStep = false">
            <v-icon class="white--text">clear</v-icon>&nbsp;
            Hủy
          </v-btn>
          <v-btn color="blue darken-3" dark
            :loading="loading"
            :disabled="loading"
            @click="cloneStepToOtherSite"
            v-if="typeClone === 'step'"
          >
            <v-icon>save</v-icon>&nbsp;
            <span>Đồng bộ</span>
          </v-btn>
          <v-btn color="blue darken-3" dark
            :loading="loading"
            :disabled="loading"
            @click="cloneActionToOtherSite"
            v-if="typeClone === 'action'"
          >
            <v-icon>save</v-icon>&nbsp;
            <span>Đồng bộ</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  -->
  </div>
</template>

<script>
  import Vue from 'vue'
  import toastr from 'toastr'
  import axios from 'axios'
  import { BbatTable } from '@/components'
  import VueConfirmDialog from 'vue-confirm-dialog'
  Vue.use(VueConfirmDialog)
  Vue.component('vue-confirm-dialog', VueConfirmDialog.default)

  toastr.options = {
    "positionClass": "toast-top-center"
  }

  export default {
    props: ['tableName'],
    components: {
      BbatTable
    },
    data () {
      return {
        loading: false,
        titleAction: 'ĐANG ĐỒNG BỘ',
        dialog_cloneServiceProcess: false,
        quyTrinhSaoChep: '',
        validForm: false,
        processName: '',
        processNo: '',
        oldProcessName: '',
        dialogLoadingSync: false,
        otherSite: false,
        toAgency: '',
        tempNo: '',
        validFormCloneTemp: false,
        dialog_cloneTemp: '',
        oldTemplateName: '',
        oldTempNo: '',
        dialog_cloneStep: '',
        oldStepName: '',
        validFormCloneStep: false,
        actionCodeClone: '',
        oldActionName: ''
      }
    },
    computed: {
      agencyListManager() {
        return this.$store.getters.getAgencyListManager
      },
      agencyManager () {
        return this.$store.getters.agencyManager
      },
      agencyCurrentSite () {
        return this.$store.getters.getCurrentSite
      }
    },
    methods: {
      cloneProcessEmitted (id, processNo, processName) {
        this.quyTrinhSaoChep = processNo
        this.oldProcessName = processName
        this.processName = processName
        this.otherSite = false
        this.dialog_cloneServiceProcess = true
      },
      cloneProcessToOtherSiteEmitted (id, processNo, processName) {
        this.quyTrinhSaoChep = processNo
        this.oldProcessName = processName
        this.processName = processName
        this.otherSite = true
        this.processNo = processNo
        this.dialog_cloneServiceProcess = true
      },
      cloneTemplateEmitted (id, processNo, processName) {
        this.cloneMauHoSo(id, processNo, processName)
      },
      showCloneBuocXuLyDonViEmitted (id, processNo, processName) {
        let vm = this
        vm.dialog_cloneStep = true
        vm.typeClone = 'step'
        vm.stepCodeClone = processNo
        vm.oldStepName = processName
      },
      cloneStepToOtherSite () {
        let vm = this
        if (vm.$refs.validFormCloneStep.validate()) {
          vm.$confirm({
            title: 'ĐỒNG BỘ BƯỚC XỬ LÝ',
            message: 'Bạn có chắc chắn đồng bộ bước xử lý này',
            button: {
              yes: 'Có',
              no: 'Không'
            },
            callback: confirm => {
              if (confirm == true) {
                vm.loading = true
                vm.dialogLoadingSync = true
                let options = {
                  headers: {
                    'groupId': vm.$store.getters.groupIdAgencyManager ? vm.$store.getters.groupIdAgencyManager : window.themeDisplay.getScopeGroupId(),
                    'Accept': 'application/json',
                    'Content-Type': "application/x-www-form-urlencoded",
                    'Token': window.Liferay !== undefined ? window.Liferay.authToken : ''
                  }
                }
                let dataPostdossier = new URLSearchParams()
                dataPostdossier.append('type', 'stepConfig')
                dataPostdossier.append('stepCode', vm.stepCodeClone)
                dataPostdossier.append('fromServerNo', vm.agencyManager ? vm.agencyManager['serveNo'] : vm.agencyCurrentSite['serveNo'])
                dataPostdossier.append('toServerNo', vm.toAgency['serveNo'])
                vm.titleAction = 'ĐANG ĐỒNG BỘ'
                axios.post('/o/rest/v2/backupDatas/syncMasterDataMC', dataPostdossier, options).then(function (response) {
                  vm.loading = false
                  vm.dialogLoadingSync = false
                  vm.dialog_cloneTemp = false
                  toastr.success('Bước xử lý đã được đồng bộ')
                }).catch(function () {
                  vm.loading = false
                  vm.dialogLoadingSync = false
                  toastr.error('Đồng bộ thất bại')
                })
              }
            }
          })
        }
      },
      showCloneThaoTacXuLyDonViEmitted (id, processNo, processName) {
        let vm = this
        vm.dialog_cloneStep = true
        vm.typeClone = 'action'
        vm.actionCodeClone = processNo
        vm.oldActionName = processName
      },
      cloneActionToOtherSite () {
        let vm = this
        if (vm.$refs.validFormCloneStep.validate()) {
          vm.$confirm({
            title: 'ĐỒNG BỘ THAO TÁC XỬ LÝ',
            message: 'Bạn có chắc chắn đồng bộ thao tác này',
            button: {
              yes: 'Có',
              no: 'Không'
            },
            callback: confirm => {
              if (confirm == true) {
                vm.loading = true
                vm.dialogLoadingSync = true
                let options = {
                  headers: {
                    'groupId': vm.$store.getters.groupIdAgencyManager ? vm.$store.getters.groupIdAgencyManager : window.themeDisplay.getScopeGroupId(),
                    'Accept': 'application/json',
                    'Content-Type': "application/x-www-form-urlencoded",
                    'Token': window.Liferay !== undefined ? window.Liferay.authToken : ''
                  }
                }
                let dataPostdossier = new URLSearchParams()
                dataPostdossier.append('type', 'actionConfig')
                dataPostdossier.append('actionCode', vm.actionCodeClone)
                dataPostdossier.append('fromServerNo', vm.agencyManager ? vm.agencyManager['serveNo'] : vm.agencyCurrentSite['serveNo'])
                dataPostdossier.append('toServerNo', vm.toAgency['serveNo'])
                vm.titleAction = 'ĐANG ĐỒNG BỘ'
                axios.post('/o/rest/v2/backupDatas/syncMasterDataMC', dataPostdossier, options).then(function (response) {
                  vm.loading = false
                  vm.dialogLoadingSync = false
                  vm.dialog_cloneTemp = false
                  toastr.success('Thao tác xử lý đã được đồng bộ')
                }).catch(function () {
                  vm.loading = false
                  vm.dialogLoadingSync = false
                  toastr.error('Đồng bộ thất bại')
                })
              }
            }
          })
        }
      },
      showCloneTemplateDonViEmitted (id, processNo, processName) {
        let vm = this
        vm.dialog_cloneTemp = true
        vm.tempNo = processNo
        vm.oldTempNo = processNo
        vm.oldTemplateName = processName
      },
      cloneTempToOtherSite () {
        let vm = this
        if (vm.$refs.formCloneTemp.validate()) {
          vm.$confirm({
            title: 'ĐỒNG BỘ MẪU HỒ SƠ',
            message: 'Bạn có chắc chắn đồng bộ mẫu hồ sơ này',
            button: {
              yes: 'Có',
              no: 'Không'
            },
            callback: confirm => {
              if (confirm == true) {
                vm.loading = true
                vm.dialogLoadingSync = true
                let options = {
                  headers: {
                    'groupId': vm.$store.getters.groupIdAgencyManager ? vm.$store.getters.groupIdAgencyManager : window.themeDisplay.getScopeGroupId(),
                    'Accept': 'application/json',
                    'Content-Type': "application/x-www-form-urlencoded",
                    'Token': window.Liferay !== undefined ? window.Liferay.authToken : ''
                  }
                }
                let dataPostdossier = new URLSearchParams()
                dataPostdossier.append('type', 'templates')
                dataPostdossier.append('templateNo', vm.oldTempNo)
                dataPostdossier.append('toTemplateNo', vm.tempNo)
                dataPostdossier.append('fromServerNo', vm.agencyManager ? vm.agencyManager['serveNo'] : vm.agencyCurrentSite['serveNo'])
                dataPostdossier.append('toServerNo', vm.toAgency['serveNo'])
                vm.titleAction = 'ĐANG ĐỒNG BỘ'
                axios.post('/o/rest/v2/backupDatas/syncMasterDataMC', dataPostdossier, options).then(function (response) {
                  vm.loading = false
                  vm.dialogLoadingSync = false
                  vm.dialog_cloneTemp = false
                  toastr.success('Mẫu hồ sơ đã được đồng bộ')
                }).catch(function () {
                  vm.loading = false
                  vm.dialogLoadingSync = false
                  toastr.error('Đồng bộ thất bại')
                })
              }
            }
          })
        }
      },
      cloneQuyTrinh () {
        let vm = this
        if (vm.$refs.formCloneServiceProcess.validate()) {
          vm.dialog_cloneServiceProcess = false
          vm.$confirm({
            title: vm.otherSite ? 'ĐỒNG BỘ QUY TRÌNH THỦ TỤC' : 'SAO CHÉP QUY TRÌNH THỦ TỤC',
            message: 'Bạn có chắc chắn muốn thực hiện hành động này?',
            button: {
              yes: 'Có',
              no: 'Không'
            },
            callback: confirm => {
              if (confirm == true) {
                vm.loading = true
                vm.dialogLoadingSync = true
                let options = {
                  headers: {
                    'groupId': vm.$store.getters.groupIdAgencyManager ? vm.$store.getters.groupIdAgencyManager : window.themeDisplay.getScopeGroupId(),
                    'Accept': 'application/json',
                    'Content-Type': "application/x-www-form-urlencoded",
                    'Token': window.Liferay !== undefined ? window.Liferay.authToken : ''
                  }
                }
                let urlApi = "/o/rest/v2/backupDatas/syncMasterDataDVC"
                let dataPostdossier = new URLSearchParams()
                dataPostdossier.append('type', 'processes')
                dataPostdossier.append('processNo', vm.quyTrinhSaoChep)
                dataPostdossier.append('toProcessNo', vm.processNo)
                if (vm.otherSite) {
                  urlApi = "/o/rest/v2/backupDatas/syncMasterDataMC"
                  let site = vm.agencyManager ? vm.agencyManager['serveNo'] : vm.agencyCurrentSite['serveNo']
                  dataPostdossier.append('fromServerNo', site)
                  dataPostdossier.append('toServerNo', vm.toAgency['serveNo'])
                } else {
                  urlApi = "/o/rest/v2/backupDatas/syncMasterDataMC"
                  dataPostdossier.append('fromServerNo', "")
                  dataPostdossier.append('toServerNo', "")
                }
                
                vm.titleAction = 'ĐANG THỰC HIỆN'
                axios.post(urlApi, dataPostdossier, options).then(function (response) {
                  vm.loading = false
                  vm.dialogLoadingSync = false
                  toastr.success('Thực hiện thành công')
                }).catch(function () {
                  vm.loading = false
                  vm.dialogLoadingSync = false
                  toastr.error('Thực hiện thất bại')
                })
              }
            }
          })
        }
        
      },
      cloneMauHoSo (id, processNo, processName) {
        let vm = this
        vm.$confirm({
          title: 'ĐỒNG BỘ MẪU HỒ SƠ',
          message: 'Bạn có chắc chắn đồng bộ mẫu hồ sơ này sang Cổng dịch vụ công',
          button: {
            yes: 'Có',
            no: 'Không'
          },
          callback: confirm => {
            if (confirm == true) {
              vm.loading = true
              vm.dialogLoadingSync = true
              let options = {
                headers: {
                  'groupId': vm.$store.getters.groupIdAgencyManager ? vm.$store.getters.groupIdAgencyManager : window.themeDisplay.getScopeGroupId(),
                  'Accept': 'application/json',
                  'Content-Type': "application/x-www-form-urlencoded",
                  'Token': window.Liferay !== undefined ? window.Liferay.authToken : ''
                }
              }
              let dataPostdossier = new URLSearchParams()
              dataPostdossier.append('type', 'templates')
              dataPostdossier.append('templateNo', processNo)
              dataPostdossier.append('toTemplateNo', processNo)
              dataPostdossier.append('fromServerNo', "")
              dataPostdossier.append('toServerNo', "SERVER_DVC")
              vm.titleAction = 'ĐANG ĐỒNG BỘ'
              axios.post('/o/rest/v2/backupDatas/syncMasterDataDVC', dataPostdossier, options).then(function (response) {
                vm.loading = false
                vm.dialogLoadingSync = false
                toastr.success('Mẫu hồ sơ đã được đồng bộ sang cổng Dịch vụ công')
              }).catch(function () {
                vm.loading = false
                vm.dialogLoadingSync = false
                toastr.error('Đồng bộ thất bại')
              })
            }
          }
        })
      },
    }
  }
</script>
