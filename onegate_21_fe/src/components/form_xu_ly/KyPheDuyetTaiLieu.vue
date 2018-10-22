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
            <!-- <v-tabs icons-and-text class='mb-4' v-model='tabActive'>
              <v-tabs-slider color='primary'></v-tabs-slider>
              <v-tab :key='1' href='#tabs-1' @click='changeActive'>
                <v-btn flat class='px-0 py-0 mx-0 my-0'>Ký kết quả hồ sơ</v-btn>
              </v-tab>
              <v-tab :key='2' href='#tabs-3' @click='changeActive'>
                <v-btn flat class='px-0 py-0 mx-0 my-0'>Không ký duyệt</v-btn>
              </v-tab>
              <v-tab :key='3' href='#tabs-4' @click='changeActive'>
                <v-btn flat class='px-0 py-0 mx-0 my-0'>Yêu cầu trình lại</v-btn>
              </v-tab>
              <v-tabs-items class='px-3 py-3'>
                <v-tab-item id='tabs-1' :key='1' reverse-transition='fade-transition' transition='fade-transition'>
                  <v-checkbox 
                    v-model='activeKS'
                    label='Sử dụng chữ ký số'
                  ></v-checkbox>
                </v-tab-item>
                <v-tab-item id='tabs-3' :key='2' reverse-transition='fade-transition' transition='fade-transition'>
                  Lý do:
                  <v-text-field
                    placeholder='Lý do không ký hồ sơ'
                    v-model='noteReason'
                    textarea
                    :rows='2'
                    class='pt-2'
                  ></v-text-field>
                </v-tab-item>
                <v-tab-item id='tabs-4' :key='3' reverse-transition='fade-transition' transition='fade-transition'>
                  <p class='mb-2'>Trình lại: <span class='text-bold'>{{detailDossier['govAgencyName']}}</span></p>
                  Lý do:
                  <v-text-field
                    placeholder='Lý do trình lại hồ sơ'
                    v-model='noteReason'
                    textarea
                    :rows='2'
                    class='pt-2'
                  ></v-text-field>
                </v-tab-item>
              </v-tabs-items>
            </v-tabs> -->
            <v-checkbox
              class="ml-3"
              v-model='activeKS'
              label='Sử dụng chữ ký số'
            ></v-checkbox>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>
<script>
import $ from 'jquery'
import toastr from 'toastr'
function plugin0 () {
  return document.getElementById('plugin0')
}
var plugin = plugin0
export default {
  props: {
    detailDossier: {}
  },
  data: () => ({
    tabActive: 'tabs-1',
    activeKS: true,
    noteReason: '',
    thongTinHoSo: {}
  }),
  created () {},
  mounted () {},
  methods: {
    changeActive () {
      var vm = this
      console.log('tabActive', vm.tabActive)
    },
    doExport () {
      let vm = this
      let exportData = {
        textValue: vm.noteReason,
        useKS: vm.activeKS
      }
      return exportData
    },
    kySo (item) {
      console.log('run ky so', item)
      var vm = this
      var fileArr = item.createFiles
      var idArr = []
      var waitingFiles = false
      if (fileArr) {
        var length = fileArr.length
        for (var i = 0; i < length; i++) {
          var fileDetail = fileArr[i]
          if (fileDetail.counter === 0) {
            waitingFiles = true
            break
          }
          var dossierFileId = fileDetail.dossierFileId
          var dossierPartId = fileDetail.dossierPartId
          if (dossierFileId && dossierPartId) {
            var strId = dossierFileId + ',' + dossierPartId
            idArr.push(strId)
          }
        }
      }
      var isKyOk = item.eSignature
      if (isKyOk) {
        if (!plugin().valid) {
          alert('Plugin is not working')
          isKyOk = false
          return
        }
        if (waitingFiles) {
          alert('Tệp điện tử chưa sẵn sàng. Xin vui lòng chờ trong giây lát')
          return
        }
        if (idArr) {
          var paramObj = {}
          paramObj.actionCode = item.actionCode
          paramObj.actionUser = window.themeDisplay.getUserName()
          paramObj.actionNote = ''
          paramObj.postStepCode = item.postStepCode
          var strIdArr = idArr.join(';')
          var actionName = item.actionName
          console.log(strIdArr)
          vm.kyDuyetYCGiamDinh(strIdArr, paramObj, actionName)
        }
      }
    },
    kyDuyetYCGiamDinh (strIdArr, paramObj, actionName) {
      var vm = this
      var url = '/o/rest/v2/digitalSignature/' + vm.detailDossier.dossierId + '/hashComputed'
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
              alert('Plugin is not working')
            }
          } else {
            alert('Cảnh báo: Không tìm thấy file bản thảo. Tạm dừng tiến trình ký số')
          }
        },
        error: function (result) {
        }
      })
    },
    completeKyDuyetManyYCGiamDinh (signs, signFieldNames, fileNames, fileEntryIds, paramObj, actionName) {
      var vm = this
      var url = '/o/rest/v2/digitalSignature/' + vm.detailDossier.dossierId + '/dossierFiles'
      $.ajax({
        type: 'PUT',
        url: url,
        async: false,
        dataType: 'json',
        headers: {
          'groupId': window.themeDisplay.getScopeGroupId()
        },
        data: {
          actionCode: paramObj['actionCode'],
          actionUser: paramObj['actionUser'],
          actionNote: paramObj['actionNote'],
          assignUserId: paramObj['assignUserId'],
          postStepCode: paramObj['postStepCode'],
          subUsers: paramObj['subUsers'],
          sign: signs,
          signFieldName: signFieldNames,
          fileName: fileNames,
          fileEntryId: fileEntryIds
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
    },
    completeKyDuyetYCGiamDinh (sign, signFieldName, fileName, fileEntryId, paramObj, actionName) {
      var vm = this
      var url = '/o/rest/v2/digitalSignature/' + vm.detailDossier.dossierId + '/dossierFile'
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
