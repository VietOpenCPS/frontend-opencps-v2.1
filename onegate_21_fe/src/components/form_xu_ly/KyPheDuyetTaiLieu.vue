<template>  
  <div class='phancong' style='background-color: white;width:100%'>
    <v-expansion-panel :value="[true]" expand  class='expansion-pl ext__form'>
      <v-expansion-panel-content :key="1">
        <div slot='header' v-if="esignType !== '' && esignType !== 'digital' && esignType !== 'plugin'">
          <div class='background-triangle-small'> 
            <v-icon size='18' color='white'>star_rate</v-icon> 
          </div>
          <span>Duyệt hồ sơ</span>
        </div>
        <div slot='header' v-if="esignType === 'plugin'">
          <div class='background-triangle-small'> 
            <v-icon size='18' color='white'>star_rate</v-icon> 
          </div>
          <span>Tài liệu ký duyệt, đóng dấu</span>
          <v-btn class="ml-2 my-0" flat icon color="indigo" title="Cấu hình hệ thống ký số" @click.stop="showConfigSignService">
            <v-icon size="16">fa fa-cog</v-icon>
          </v-btn>
        </div>
        <v-card >
          <v-card-text class='px-0 py-0'>
            <!--  -->
            <v-flex xs12 sm12 v-if="esignType === 'plugin'" class="pl-5 py-2">
              <div v-for="(item, index) in filesPdfSignPlugin" :key="index">
                <span @click="viewFileKySo(item, index)" class="ml-3" style="cursor: pointer;">
                  <v-icon class="mr-1" color="red" v-if="!item.fileSigned" size="14">
                    fa fa-file-pdf-o
                  </v-icon>
                  <v-icon v-else class="mr-1" color="green" size="16">
                    fa-check-square-o
                  </v-icon>
                  {{item.fileName}} - 
                  <i>{{item.time}}</i>
                </span>
                <v-btn flat icon color="indigo" title="Ký duyệt, đóng dấu" v-on:click.stop="signAction(item, index)" class="ml-2 my-0">
                  <v-icon size="18">fa fa-pencil-square-o</v-icon>
                </v-btn>
              </div>
            </v-flex>
            <!--  -->
            <v-flex xs12 sm12 class="my-3" v-if="esignType === 'captcha'">
              <span class="ml-3" style="color:#ec0f0f">(*) Xác thực ký duyệt hồ sơ</span>
              <v-captcha ref="captcha"></v-captcha>
            </v-flex>
            <v-flex xs12 sm4 class="my-3 pl-3" v-if="esignType === 'password'">
              <span class="ml-3" style="color:#ec0f0f">(*) Xác thực ký duyệt hồ sơ</span>
              <v-text-field
                box
                label="Nhập mật khẩu xác thực"
                :append-icon="e1 ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (e1 = !e1)"
                :rules="[v => !!v || 'Yêu cầu nhập mật khẩu']"
                :type="e1 ? 'password' : 'text'"
                name="input-10-2"
                v-model="passWord"
                required
              ></v-text-field>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>
<script>
  import $ from 'jquery'
  import toastr from 'toastr'
  import VueCaptcha from './Captcha.vue'
  toastr.options = {
    'closeButton': true,
    'timeOut': '5000'
  }
  function plugin0 () {
    return document.getElementById('plugin0')
  }
  var plugin = plugin0
  export default {
    props: {
      detailDossier: {},
      dataEsign: {},
      filesPdfSignPlugin: {
        type: Array,
        default: () => []
      }
    },
    components: {
      'v-captcha': VueCaptcha
    },
    data: () => ({
      tabActive: 'tabs-1',
      filesSign: [],
      activeKS: false,
      noteReason: '',
      thongTinHoSo: {},
      passWord: '',
      e1: true
    }),
    created () {
      if (this.esignType === '' || this.esignType === 'digital') {
        this.activeKS = true
      }
    },
    computed: {
      kysoSuccess () {
        return this.$store.getters.kysoSuccess
      },
      esignType () {
        return this.dataEsign.signatureType
      }
    },
    watch: {
    },
    mounted () {
      if (this.esignType === '' || this.esignType === 'digital') {
        this.activeKS = true
      }
    },
    methods: {
      changeActive () {
        var vm = this
        console.log('tabActive', vm.tabActive)
      },
      doExport () {
        let vm = this
        let exportData = {
          textValue: vm.noteReason,
          required: (vm.esignType === 'password') ? vm.passWord : (vm.esignType === 'digital' || vm.esignType === '' ? vm.activeKS : vm.$refs.captcha.checkValidCatcha())
        }
        console.log('exportData', exportData)
        return exportData
      },
      checkCreateFile (item) {
        var vm = this
        var fileArr
        if (Array.isArray(item.createFiles)) {
          fileArr = item.createFiles
        } else {
          fileArr = [item.createFiles]
        }
        var idArr = []
        var waitingFiles = false
        if (fileArr.length > 0) {
          var length = fileArr.length
          for (var i = 0; i < length; i++) {
            var fileDetail = fileArr[i]
            if (fileDetail.counter === 0) {
              waitingFiles = true
            }
          }
        } else {
          waitingFiles = true
        }
        return waitingFiles
      },
      showConfigSignService () {
        vgca_show_config()
      },
      viewFileKySo (item, index) {},
      signAction (item, index) {
        let vm = this
        let signFileCallBack = function (rv) {
          let received_msg = JSON.parse(rv)
          console.log(received_msg)
          if (received_msg.Status === 0) {
            // document.getElementById('_signature').value = received_msg.FileName + ':' + received_msg.FileServer + ':' + received_msg.DocumentNumber + ':' + received_msg.DocumentDate
            // document.getElementById('file1').value = received_msg.FileServer
            // document.getElementById('file2').value = received_msg.FileServer
          } else {
            // document.getElementById('_signature').value = received_msg.Message
          }
        }
        let prms = {}
        prms['FileUploadHandler'] = ''
        prms['SessionId'] = ''
        prms['FileName'] = item['url']

        let json_prms = JSON.stringify(prms)
        vgca_sign_approved(json_prms, signFileCallBack)
      },
      kySo (item) {
        console.log('run ky so data payload', item)
        var vm = this
        var fileArr
        if (Array.isArray(item.createFiles)) {
          fileArr = item.createFiles
        } else {
          fileArr = [item.createFiles]
        }
        var idArr = []
        var waitingFiles = false
        if (fileArr.length > 0) {
          var length = fileArr.length
          for (var i = 0; i < length; i++) {
            var fileDetail = fileArr[i]
            if (fileDetail.counter === 0) {
              waitingFiles = true
              break
            }
            var dossierFileId = fileDetail.dossierFileId
            var dossierPartId = fileDetail.dossierPartId
            if (dossierFileId && dossierPartId && vm.esignType === 'digital') {
              let strId = dossierFileId + ',' + dossierPartId
              idArr.push(strId)
            } else if (dossierFileId && vm.esignType !== 'digital') {
              let strId1 = dossierFileId
              idArr.push(strId1)
            }
          }
        } else {
          alert('Không tồn tại tệp điện tử. Vui lòng kiểm tra lại')
        }
        console.log('idArr', idArr)
        var isKyOk = item.eSignature
        if (isKyOk) {
          if (waitingFiles) {
            alert('Tệp điện tử chưa sẵn sàng. Xin vui lòng chờ trong giây lát')
            return
          }
          if (idArr) {
            var paramObj = {}
            var strIdArr
            paramObj.actionCode = item.actionCode
            paramObj.actionUser = window.themeDisplay.getUserName() ? window.themeDisplay.getUserName() : ''
            paramObj.actionNote = ''
            paramObj.postStepCode = item.postStepCode ? item.postStepCode : ''
            paramObj.payload = item.payload ? item.payload : ''
            paramObj.assignUsers = item.assignUsers ? item.assignUsers : ''
            paramObj.payment = item.payment ? item.payment : ''
            paramObj.userNote = item.userNote ? item.userNote : ''
            strIdArr = idArr.join(',')
            var actionName = item.actionName
            console.log('strIdArr', strIdArr)
            console.log('paramObj', paramObj)
            if (vm.esignType === 'digital') {
              if (!plugin().valid) {
                isKyOk = false
                alert('Plugin ký số không hoạt động')
                return
              }
              vm.kyDuyetYCGiamDinh(strIdArr, paramObj, actionName)
            } else if (vm.esignType === 'captcha' || vm.esignType === 'password' || vm.esignType === '') {
              vm.completeKyDuyetCaptchaSignature(strIdArr, paramObj, actionName)
            }
          }
        }
      },
      kyDuyetYCGiamDinh (strIdArr, paramObj, actionName) {
        var vm = this
        var url = '/o/rest/v2/defaultsignature/digitalSignature/' + vm.detailDossier.dossierId + '/hashComputed'
        console.log(vm.detailDossier.dossierId)
        $.ajax({
          type: 'POST',
          url: url,
          async: false,
          dataType: 'json',
          headers: {
            'groupId': window.themeDisplay.getScopeGroupId(),
            'Token': window.Liferay.authToken
          },
          data: {
            strIdArr: strIdArr,
            actionCode: paramObj.actionCode,
            postStepCode: paramObj.postStepCode
          },
          success: function (result) {
            console.log(result)
            var msgs = result.msg
            if (msgs !== 'fileEntryId') {
              var hashComputers = result.hashComputers
              var signFieldNames = result.signFieldNames
              var fileNames = result.fileNames
              var fileEntryIds = result.fileEntryId
              console.log('hashComputers: ' + hashComputers)
              console.log('signFieldNames: ' + signFieldNames)
              console.log('fileNames: ' + fileNames)
              console.log('msgs: ' + msgs)
              var signs = []
              if (plugin().valid) {
                for (var i = 0; i < hashComputers.length; i++) {
                  var hashComputer = hashComputers[i]
                  var code = plugin().Sign(hashComputer)
                  if (code === 0 || code === 7) {
                    var sign = plugin().Signature
                    var signFieldName = signFieldNames[i]
                    var fileName = fileNames[i]
                    console.log('sign: ' + sign)
                    console.log('signFieldName: ' + signFieldName)
                    console.log('fileName: ' + fileName)
                    signs.push(sign)
                  } else {
                    alert(plugin().ErrorMessage)
                  }
                }
                vm.completeKyDuyetManyYCGiamDinh(signs.join(','), signFieldNames.join(','), fileNames.join(','), fileEntryIds.join(','), paramObj, actionName)
              } else {
                alert('Plugin ký số không hoạt động')
              }
            } else {
              alert('Không tìm thấy file bản thảo. Tạm dừng tiến trình ký số')
            }
          },
          error: function (result) {
          }
        })
      },
      completeKyDuyetManyYCGiamDinh (signs, signFieldNames, fileNames, fileEntryIds, paramObj, actionName) {
        var vm = this
        var url = '/o/rest/v2/defaultsignature/digitalSignature/' + vm.detailDossier.dossierId + '/dossierFiles'
        $.ajax({
          type: 'PUT',
          url: url,
          async: false,
          dataType: 'json',
          headers: {
            'groupId': window.themeDisplay.getScopeGroupId(),
            'Token': window.Liferay.authToken
          },
          data: {
            actionCode: paramObj['actionCode'],
            actionUser: paramObj['actionUser'],
            actionNote: paramObj['actionNote'],
            assignUserId: paramObj['assignUserId'],
            postStepCode: paramObj['postStepCode'],
            subUsers: paramObj['subUsers'],
            payload: paramObj['payload'] ? JSON.stringify(paramObj['payload']) : '',
            assignUsers: paramObj['assignUsers'],
            payment: paramObj['payment'] ? JSON.stringify(paramObj['payment']) : '',
            userNote: paramObj['userNote'],
            sign: signs,
            signFieldName: signFieldNames,
            fileName: fileNames,
            fileEntryId: fileEntryIds
          },
          success: function (result) {
            console.log(result)
            var msg = result.msg
            if (msg === 'success') {
              vm.$store.commit('setKysoSuccess', true)
              toastr.success('Thực hiện ký số thành công')
            } else if (msg === 'fileEntryId') {
              alert('Không tìm thấy file bản thảo. Tạm dừng tiến trình ký số')
            } else {
              alert(msg)
            }
          },
          error: function () {
            alert('Thực hiện ký số thất bại')
          }
        })
      },
      completeKyDuyetCaptchaSignature (strIdArr, paramObj, actionName) {
        var vm = this
        var url = '/o/rest/v2/defaultsignature/' + vm.detailDossier.dossierId + '/dossierFiles'
        $.ajax({
          type: 'PUT',
          url: url,
          async: false,
          dataType: 'json',
          headers: {
            'groupId': window.themeDisplay.getScopeGroupId() ? window.themeDisplay.getScopeGroupId() : '',
            'Token': window.Liferay.authToken ? window.Liferay.authToken : ''
          },
          data: {
            actionCode: paramObj['actionCode'],
            actionUser: paramObj['actionUser'],
            actionNote: paramObj['actionNote'],
            assignUserId: paramObj['assignUserId'],
            postStepCode: paramObj['postStepCode'],
            subUsers: paramObj['subUsers'],
            payload: paramObj['payload'] ? JSON.stringify(paramObj['payload']) : '',
            assignUsers: paramObj['assignUsers'],
            payment: paramObj['payment'] ? JSON.stringify(paramObj['payment']) : '',
            userNote: paramObj['userNote'],
            fileEntryId: strIdArr
          },
          success: function (result) {
            vm.$store.commit('setKysoSuccess', true)
            toastr.success('Thực hiện ký số thành công.')
          },
          error: function () {
            toastr.error('Thực hiện ký số thất bại')
          }
        })
      },
      completeKyDuyetYCGiamDinh (sign, signFieldName, fileName, fileEntryId, paramObj, actionName) {
        var vm = this
        var url = '/o/rest/v2/defaultsignature/digitalSignature/' + vm.detailDossier.dossierId + '/dossierFile'
        $.ajax({
          type: 'PUT',
          url: url,
          async: false,
          dataType: 'json',
          headers: {
            'groupId': window.themeDisplay.getScopeGroupId(),
            'Token': window.Liferay ? window.Liferay.authToken : '',
            'Cache-Control': 'no-cache'
          },
          data: {
            actionCode: paramObj['actionCode'],
            actionUser: paramObj['actionUser'],
            actionNote: paramObj['actionNote'],
            assignUserId: paramObj['assignUserId'],
            postStepCode: paramObj['postStepCode'],
            subUsers: paramObj['subUsers'],
            sign: sign,
            signFieldName: signFieldName,
            fileName: fileName,
            fileEntryId: fileEntryId
          },
          success: function (result) {
            console.log(result)
            var msg = result.msg
            if (msg === 'success') {
              toastr.success('Yêu cầu của bạn được thực hiện thành công.')
            } else if (msg === 'fileEntryId') {
              alert('Cảnh báo: Không tìm thấy file bản thảo. Tạm dừng tiến trình đóng dấu số')
            } else {
              alert(msg)
            }
          },
          error: function () {
            alert('ky so false')
          }
        })
      }
    }
  }
</script>
