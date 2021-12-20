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
    <bbat-table :table-name="tableName" @cloneProcess="cloneProcessEmitted" @cloneTemplate="cloneTemplateEmitted"></bbat-table>
    <v-dialog v-model="dialog_cloneServiceProcess" scrollable persistent max-width="700px">
      <v-card>
        <v-card-title class="headline pb-2">
          <span>Sao chép quy trình: {{oldProcessName}}</span>
        </v-card-title>
        <v-card-text class="pt-3">
          <v-form ref="formCloneServiceProcess" v-model="validForm" lazy-validation>
            <v-layout wrap class="py-1 align-center row-list-style">
              <v-flex xs12>
                  <v-text-field
                    label="Số hiệu quy trình tạo mới"
                    box
                    v-model="processNo"
                    :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                    :required="true"
                  ></v-text-field>
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
            Sao chép
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
        dialogLoadingSync: false
      }
    },
    methods: {
      cloneProcessEmitted (id, processNo, processName) {
        this.quyTrinhSaoChep = processNo
        this.oldProcessName = processName
        this.dialog_cloneServiceProcess = true
      },
      cloneTemplateEmitted (id, processNo, processName) {
        this.cloneMauHoSo(id, processNo, processName)
      },
      cloneServiceProcess () {
        let vm = this
        if (vm.$refs.formCloneServiceProcess.validate()) {
          vm.loading = true
          let dataPost = new URLSearchParams()
          dataPost.append('processNo', vm.processNo)
          dataPost.append('processName', vm.processName)
          axios.post('/o/rest/v2/serviceprocesses/' + vm.serviceProcessId + '/clone',
            dataPost, {})
          .then(function (response) {
            vm.loading = false
            vm.dialog_cloneServiceProcess = false
            vm.$refs.formCloneServiceProcess.reset()
          }).catch(function (error) {
            vm.loading = false
          })
        }
      },
      cloneQuyTrinh () {
        let vm = this
        if (vm.$refs.formCloneServiceProcess.validate()) {
          vm.dialog_cloneServiceProcess = false
          vm.$confirm({
            title: 'SAO CHÉP QUY TRÌNH THỦ TỤC',
            message: 'Bạn có chắc chắn thực hiện sao chép quy trình này',
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
                    'groupId': window.themeDisplay.getScopeGroupId(),
                    'Accept': 'application/json',
                    'Content-Type': "application/x-www-form-urlencoded",
                    'Token': window.Liferay !== undefined ? window.Liferay.authToken : ''
                  }
                }
                let dataPostdossier = new URLSearchParams()
                dataPostdossier.append('type', 'processes')
                dataPostdossier.append('processNo', vm.quyTrinhSaoChep)
                dataPostdossier.append('toProcessNo', vm.processNo)
                dataPostdossier.append('fromServerNo', "")
                dataPostdossier.append('toServerNo', "")
                vm.titleAction = 'ĐANG SAO CHÉP'
                axios.post('/o/rest/v2/backupDatas/exportProcess', dataPostdossier, options).then(function (response) {
                  vm.loading = false
                  vm.dialogLoadingSync = false
                  toastr.success('Quy trình đã được sao chép thành công')
                }).catch(function () {
                  vm.loading = false
                  vm.dialogLoadingSync = false
                  toastr.error('Sao chép thất bại')
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
                  'groupId': window.themeDisplay.getScopeGroupId(),
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
              axios.post('/o/rest/v2/backupDatas/exportProcess', dataPostdossier, options).then(function (response) {
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
