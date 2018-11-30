<template>  
  <div class='phancong' style='background-color: white;width:100%'>
    <v-expansion-panel class='expansion-pl'>
      <v-expansion-panel-content hide-actions value='1'>
        <div slot='header'>
          <div class='background-triangle-small'> 
            <v-icon size='18' color='white'>star_rate</v-icon> 
          </div>Duyệt hồ sơ
        </div>
        <v-card >
          <v-card-text class='px-0 py-0'>
            <v-checkbox v-if="esignType === 'digital'"
              class="ml-3"
              v-model='activeKS'
              label='Sử dụng chữ ký số'
            ></v-checkbox>
            <v-checkbox v-if="esignType === ''"
              class="ml-3"
              v-model='activeKS'
              label='Xác nhận ký số'
            ></v-checkbox>
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
function plugin0 () {
  return document.getElementById('plugin0')
}
var plugin = plugin0
export default {
  props: {
    detailDossier: {},
    dataEsign: {}
  },
  components: {
    'v-captcha': VueCaptcha
  },
  data: () => ({
    tabActive: 'tabs-1',
    activeKS: false,
    noteReason: '',
    thongTinHoSo: {},
    passWord: '',
    e1: true
  }),
  created () {
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
    if (this.esignType === '') {
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
          paramObj.actionCode = item.actionCode
          paramObj.actionUser = window.themeDisplay.getUserName()
          paramObj.actionNote = ''
          paramObj.postStepCode = item.postStepCode ? item.postStepCode : ''
          paramObj.payload = item.payload ? item.payload : ''
          paramObj.assignUsers = item.assignUsers ? item.assignUsers : ''
          paramObj.payment = item.payment ? item.payment : ''
          paramObj.userNote = item.userNote ? item.userNote : ''
          var strIdArr = idArr.join(';')
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
            toastr.success('Thực hiện ký số thành công.')
          } else if (msg === 'fileEntryId') {
            alert('Cảnh báo: Không tìm thấy file bản thảo. Tạm dừng tiến trình đóng dấu số')
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
