<template>
  <div style="width: 100%; position: relative;">
    <v-form v-model="extvaild" ref="extform">
      <div>
        <v-layout wrap>
          <!-- ký số bản mới dùng plugin -->
          <v-flex xs12 md12>
            <!-- <p><b>I. Ký số phiên bản mới</b></p> -->
            <div>
              <v-btn color="primary" v-on:click.native="vgcaSign()"
                :loading="loading_process_btn"
                :disabled="loading_process_btn"
              >
                <v-icon class="mr-2 white--text">edit</v-icon>
                Ký duyệt
                <span slot="loader">Loading...</span>
              </v-btn>
            </div>
          </v-flex>
          <!-- ký số bản cũ -->
          <!-- <v-flex xs12 md6 class="px-3">
            <v-layout wrap>
              <v-flex xs12>
                <p><b>II. Ký số phiên bản cũ</b></p>
              </v-flex>
              <v-flex xs12 sm2>
                Người ký <span class="red--text text--darken-3">*</span>:
              </v-flex>
              <v-flex xs12 sm4>
                {{canBoPheDuyet}}
              </v-flex>
              <v-flex xs12 sm6>
                
              </v-flex>
              
              <v-flex xs12 sm2>
                Ngày ký <span class="red--text text--darken-3">*</span>:
              </v-flex>
              <v-flex xs12 sm4>
                {{dateSign | moment("DD/MM/YYYY | HH:mm")}}
              </v-flex>
              <v-flex xs12 sm6>
                
              </v-flex>

              <v-flex xs12 sm2>
                Địa điểm ký <span class="red--text text--darken-3">*</span>:
              </v-flex>
              <v-flex xs12 sm4>
                <v-text-field
                  v-model="signLocation"
                  :rules="[v => !!v || 'địa điểm ký bắt buộc phải nhập']"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                
              </v-flex>
            </v-layout>
            
            <v-card-actions>
              <v-btn color="primary" v-on:click.native="callActionThuTucAllInOneURL(detail, messagetype, actiontype, -1, true, 0)"
                :loading="loading_process_btn"
                :disabled="loading_process_btn"
              >
                Xác nhận
                <span slot="loader">Loading...</span>
              </v-btn>
            </v-card-actions>
          </v-flex> -->

        </v-layout>
        
      </div>
    </v-form>
  </div>
</template>

<script>
const COMPONENT_NAME = 'jx-hanghai-crypto'
import axios from 'axios'
import toastr from 'toastr'
export default {
  name: COMPONENT_NAME,
  props: {
    name: String,
    detail: {
      canBoPheDuyet: '',
      signLocation: ''
    },
    messagetype: 0,
    actiontype: 0,
    computerhash: '',
    canBoPheDuyet: '',
    signLocation: ''
  },
  data () {
    return {
      loading_process_btn: false,
      pluginValid: false,
      sign: null,
      signFieldName: '',
      filePath: '',
      msgKey: 'error',
      cryptoFlag: 2,
      customMessage: '',
      dateSign: new Date(),
      previewURL: '',
      urlSign: '',
      FileServer: ''
    }
  },
  methods: {
    vgcaSign () {
      let vm = this
      if (!vm.urlSign) {
        vm.urlSign = document.querySelector('#dossierPDFView iframe').getAttribute('src').split("?")[0]
        if (vm.urlSign.indexOf('://') < 0) {
          vm.urlSign = window.location.origin + vm.urlSign
        }
      }
      let signFileCallBack = function (rv) {
        let received_msg = JSON.parse(rv)
        if (received_msg.Status === 0 && received_msg.FileServer) {
          vm.FileServer = received_msg.FileServer
          toastr.success('Tài liệu đã được ký duyệt')
          setTimeout(function () {
            vm.callActionThuTucAllInOneURL(vm.detail, vm.messagetype, vm.actiontype, -1, true, 0)
          }, 300)
        } else {
          if (received_msg.Message) {
            toastr.clear()
            toastr.error(received_msg.Message)
          } else {
            toastr.clear()
            toastr.error('Quá trình ký số bị hủy bỏ')
          }
        }
      }
      let prms = {}
      prms['FileUploadHandler'] = window.location.origin + '/web-servlet/UploadFileServlet'
      prms['SessionId'] = ''
      prms['FileName'] = vm.urlSign

      let json_prms = JSON.stringify(prms)
      vgca_sign_approved(json_prms, signFileCallBack)
    },
    doActionCallBack (data) {
      let vm = this
      let options = {}
      vm.loading_process_btn = true
      let dataPostServiceConfig = new URLSearchParams()
      dataPostServiceConfig.append('groupId', data.groupId)
      dataPostServiceConfig.append('folderId', data.folderId)
      dataPostServiceConfig.append('title', data.title)
      dataPostServiceConfig.append('FileServer', data.FileServer)
      axios.post(window.location.origin + '/web-servlet/UpdateDocumentServlet', dataPostServiceConfig, options).then(function (response) {
        toastr.clear()
        toastr.success('Tài liệu đã được ký duyệt')
        vm.loading_process_btn = false
        setTimeout(function () {
          window.location.reload()
        }, 200)
                
      }).catch(function (error) {
        toastr.clear()
        toastr.error('Ký duyệt không thành công')
        vm.loading_process_btn = false
      })
    },
    bindData (documentTypeCode, documentName, documentYear, type) {
      let vm = this
      let config = {
        'documentType': documentTypeCode,
        'documentName': documentName,
        'documentYear': documentYear,
        'type': type
      }
      vm.$store.dispatch('loadDetailHoSo', config).then(function (result) {
        vm.detail = result
        if (vm.detail !== null && vm.detail !== undefined && vm.detail !== 'undefined') {
          vm.canBoPheDuyet = vm.detail.canBoPheDuyet
          vm.signLocation = vm.detail.signLocation
        }
      })
    },
    doValidate () {
      let vm = this
      let result = false
      if (vm.$refs.extform.validate()) {
        result = true
      }
      return result
    },
    callActionThuTucAllInOneURL: function (item, messageType, actionType, desStatus, isConfirm, returnState) {
      let vm = this
      let config = {
        item: item,
        messageType: messageType,
        actionType: actionType,
        desStatus: desStatus,
        isConfirm: isConfirm,
        returnState: returnState,
        sign: vm.sign,
        signFieldName: vm.signFieldName,
        filePath: vm.filePath,
        signLocation: vm.signLocation,
        FileServer: vm.FileServer
      }
      vm.$emit('kyso-submit-func', config)
    }
  }
}
</script>
