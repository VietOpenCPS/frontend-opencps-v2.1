<template>
  <v-layout wrap>
    <v-flex xs12 style="position:relative" class="control-section uploader customdroparea">
      <div class="control_wrapper">
        <div class="sample_wrapper">
            <div id="dropArea">
                <span id="drop" class="droparea" style="" >  <a href="javascript:;" id="browse">Chọn từ máy tính &nbsp; 📤</a></span>
                <ejs-uploader id='templateupload' name="UploadFiles" :allowedExtensions= 'extensions' :asyncSettings= "path" ref="uploadObj" :dropArea= "dropArea" :success= "onSuccess" :removing= "onFileRemove" :uploading= "addHeaders" :selected= "onFileSelect">
                </ejs-uploader>
                <div class="e-upload-done-list" v-if="fileTemplateTotal > 0 && code === 'opencps_serviceinfo'">
                  <ul class="e-upload-files">
                    <li class="e-upload-file-list" v-for="(item, index) in fileTemplateData" v-bind:key="index">
                      <div class='container' style="position: relative;">
                        <span class='wrapper' style="
                          line-height: 10px;
                        ">
                          <span :class="['icon sf-icon-' + item['extension']]"></span>
                          <div class='name file-name'>
                            <span>{{item['templateName']}}</span>
                            <p style="
                              margin-top: 5px;
                              font-size: 10px;
                              margin-bottom: 0;
                            ">
                              ( {{(item['size']/(1024*1024)).toFixed(2)}} MB )
                            </p>
                          </div>
                          <v-btn flat icon color="primary" 
                            v-on:click.native="processDownloadFileAttach(item)"
                            :loading="loading"
                            :disabled="loading"
                            style="
                              position: absolute;
                              right: 5px;
                              top: 32px;
                            ">
                            <v-icon size="14">link</v-icon>
                          </v-btn>
                          <v-btn flat icon color="primary" 
                            v-on:click.native="processUpdateFileAttach(item, index)"
                            style="
                              position: absolute;
                              right: 5px;
                              top: 52px;
                            ">
                            <v-icon size="14">create</v-icon>
                          </v-btn>
                          <v-btn flat icon color="red darken-3" 
                            v-on:click.native="processDeleteFileAttach(item)"
                            :loading="loadingRemove"
                            :disabled="loadingRemove"
                            style="
                              position: absolute;
                              right: 5px;
                            ">
                            <v-icon size="14">delete</v-icon>
                          </v-btn>
                          <v-layout row wrap>
                            <v-form ref="form" v-model="valid" lazy-validation>
                              <v-layout wrap class="mt-3">
                                <v-flex xs12 md4>
                                  <input
                                    type="file"
                                    style="display: none"
                                    ref="refFileUpdate"
                                    id="inputFileUpdate"
                                    @change="onFileUpdatePicked">
                                  <v-text-field
                                    label="Số biểu mẫu" 
                                    v-model="item['fileTemplateNo']"
                                    @change="processUpdateDataFileAttach($event, item, index)"
                                  >
                                  </v-text-field>
                                </v-flex>
                                <v-flex xs12 md8>
                                  <v-text-field
                                    label="Tên biểu mẫu" 
                                    v-model="item['templateName']"
                                    @change="processUpdateDataFileAttach($event, item, index)"
                                  >
                                  </v-text-field>
                                </v-flex>
                                <v-flex xs12 md4>
                                  <v-text-field
                                    label="Mã pattern" 
                                    v-model="item['EFormNoPattern']"
                                    @change="changeDataEform(item)"
                                  >
                                  </v-text-field>
                                </v-flex>
                                
                                <v-flex xs12 md8 class="py-0">
                                  <v-checkbox
                                    v-model="item['EForm']"
                                    @change="changeDataEform(item)"
                                    label="Form trực tuyến"
                                    color="primary"
                                    hide-details
                                    class="d-inline-block mt-3"
                                  ></v-checkbox>
                                </v-flex>
                              </v-layout>
                            </v-form>
                          </v-layout>
                          
                        </span>
                      </div>
                      <!-- Cập nhật formScript, formReport -->
                      <div class="px-4 mt-2">
                        <input
                        type="file"
                        style="display: none"
                        id="fileFormScript"
                        accept="application/json"
                        @change="onUploadFileScript(item)"
                        >
                        <span>
                          <v-icon size="14" color="#0064c7">insert_link</v-icon>
                        </span>
                        <span class="ml-2">File formScript - 
                          <span style="font-style: italic;color: green;">{{Number(item['formScriptFileId']) ? item['fileTemplateNo'] + '.json' : '(chưa có)'}}</span>
                        </span>
                        <v-tooltip left class="ml-2">
                          <v-btn slot="activator" icon class="mx-0 my-0" @click="pickFileScript()">
                            <v-badge>
                              <v-icon size="24" color="#004b94">cloud_upload</v-icon>
                            </v-badge>
                          </v-btn>
                          <span>Tải lên formScript</span>
                        </v-tooltip>
                      </div>
                      <div class="px-4" style="border-bottom: 1px dashed #c3c3cd;">
                        <input
                        type="file"
                        style="display: none"
                        id="fileFormReport"
                        accept="text/xml"
                        @change="onUploadFileReport(item)"
                        >
                        <v-icon size="14" color="#0064c7">insert_link</v-icon>
                        <span class="ml-2">File formReport - 
                          <span style="font-style: italic;color: green;">{{Number(item['formReportFileId']) ? item['fileTemplateNo'] + '.xml' : '(chưa có)'}}</span>
                        </span>
                        <v-tooltip left class="ml-2">
                          <v-btn slot="activator" icon class="mx-0 my-0" @click="pickFileReport()">
                            <v-badge>
                              <v-icon size="24" color="#004b94">cloud_upload</v-icon>
                            </v-badge>
                          </v-btn>
                          <span>Tải lên formReport</span>
                        </v-tooltip>
                      </div>
                      <!--  -->
                    </li>
                  </ul>
                </div>
                <div class="e-upload-done-list" v-if="fileTemplateTotal > 0 && code !== 'opencps_serviceinfo'">
                  <ul class="e-upload-files">
                    <li class="e-upload-file-list" v-for="(item, index) in fileTemplateData" v-bind:key="index">
                      <div class='container' style="position: relative;min-height: 75px;">
                        <span class='wrapper' style="
                          line-height: 10px;
                        ">
                        <span :class="['icon sf-icon-' + item['extension']]"></span>
                        <div class='name file-name'>
                          <span>{{item['fileName']}}</span>
                          <p style="
                            margin-top: 5px;
                            font-size: 10px;
                            margin-bottom: 0;
                          ">
                            ( {{(item['size']/(1024*1024)).toFixed(2)}} MB )
                          </p>
                        </div>
                        <v-btn flat icon color="primary" 
                          v-on:click.native="processDownloadFileAttach(item)"
                          :loading="loading"
                          :disabled="loading"
                          style="
                            position: absolute;
                            right: 5px;
                            top: 32px;
                          ">
                          <v-icon size="14">link</v-icon>
                        </v-btn>
                        <v-btn flat icon color="primary" 
                          v-if="code !== 'opencps_deliverabletype'"
                          v-on:click.native="processUpdateFileAttach(item, index)"
                          style="
                            position: absolute;
                            right: 5px;
                            top: 32px;
                          ">
                          <v-icon size="14">create</v-icon>
                        </v-btn>
                        <v-btn flat icon color="red darken-3" 
                          v-if="code !== 'opencps_deliverabletype'"
                          v-on:click.native="processDeleteFileAttach(item)"
                          :loading="loadingRemove"
                          :disabled="loadingRemove"
                          style="
                            position: absolute;
                            right: 5px;
                          ">
                          <v-icon size="14">delete</v-icon>
                        </v-btn>
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
            </div>
        </div>
      </div>
    </v-flex>
    
  </v-layout>
</template>

<script>
  import Vue from 'vue'
  import { UploaderPlugin } from '@syncfusion/ej2-vue-inputs'
  import { detach } from '@syncfusion/ej2-base'
  import axios from 'axios'
  import toastr from 'toastr'

  Vue.use(toastr)
  Vue.use(UploaderPlugin)

  export default {
    data () {
      return {
        loadingRemove: false,
        loading: false,
        valid: false,
        fileTemplateData: [],
        fileTemplateTotal: 0,
        path:  {
          saveUrl: '',
          removeUrl: ''
        },
        extensions: '.pdf, .txt, .rtf, .doc, .docx, .xls, .xlsx, .jpg, .png',
        dropArea: "dropArea",
        rawData: [],
        className: '',
        fileUpdate: null,
        indexFile: null
      }
    },
    props: ['pickItem', 'pk', 'code'],
    created() {
      var vm = this
      vm.$nextTick(function() {
        vm.loadFileTemplate()
      })
    },
    mounted: function () {
      if(this.code === 'opencps_deliverabletype'){
        if(this.pickItem.fileTemplateId === 1 || this.pickItem.fileTemplateId === 0) {
          this.path = {
            saveUrl: '',
            removeUrl: '',
          }
        } else {
          this.path = {
            saveUrl: '',
            removeUrl: '',
          }
        }
      } else {
        this.path = {
          saveUrl: this.pickItem['upload_api'] + '/' + this.pk,
          removeUrl: this.pickItem['remove_api'] + '/' + this.pk,
        }
        console.log('pathUpload', this.path)
      }

      this.className = this.pickItem['class_name']
      document.getElementById('browse').onclick = function() {
          document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button').click();
          return false;
      };
      document.getElementById('dropArea').onclick = (args) => {
        if (args.target.classList.contains('e-file-delete-btn')) {
          for (var i = 0; i < this.$refs.uploadObj.getFilesData().length; i++) {
            if (args.target.closest('li').getAttribute('data-file-name') === this.$refs.uploadObj.getFilesData()[i].name) {
              this.$refs.uploadObj.remove(this.$refs.uploadObj.getFilesData()[i]);
            }
          }
        }
        else if (args.target.classList.contains('e-file-remove-btn')) {
          detach(args.target.closest('li'))
        }
      }
    },
    methods: {
      addHeaders (args) {
        let vm = this
        args.currentRequest.setRequestHeader('Token', vm.getAuthToken())
        args.currentRequest.setRequestHeader('groupId', vm.getScopeGroupId())
        console.log('addHeaders', vm.getAuthToken(), vm.getScopeGroupId())
      },
      loadFileTemplate () {
        let vm = this
        if (vm.code === 'opencps_serviceinfo') {
          vm.$store.dispatch('getServiceFileTemplate', vm.pk).then(function (result) {
            vm.fileTemplateData = result.data
            vm.fileTemplateTotal = result.total
            for (let key in vm.fileTemplateData) {
              vm.rawData.push({
                fileTemplateNo: vm.fileTemplateData[key]['fileTemplateNo'],
                serviceInfoId: vm.fileTemplateData[key]['serviceInfoId']
              })
            }
            let rightAttachedCounter = document.getElementById('rightAttachedCounter')
            if (rightAttachedCounter !== null && rightAttachedCounter !== undefined && vm.fileTemplateTotal > 0) {
              rightAttachedCounter.innerHTML = 'Tổng số: ' + vm.fileTemplateTotal + ' '
            }
          }).catch(reject => {
            console.log(reject)
          })
        } else if(vm.code === 'opencps_deliverabletype') {
          console.log(vm.pickItem)
          vm.fileTemplateData = []
          vm.$store.dispatch('getFileattachsVersions', vm.pickItem.fileTemplateId).then(function (result) {
            console.log(result)
            vm.fileTemplateTotal = result.total
            for(let i = 0; i < result.data.length ; i++){
              vm.fileTemplateData.push(JSON.parse(result.data[i]))
            }
            
          }).catch(reject => {
            console.log(reject)
          })              
        } else {
          let filter = {
            className: vm.className,
            pk: vm.pk
          }
          vm.$store.dispatch('getAttachFileData', filter).then(function (result) {
            vm.fileTemplateData = result.data
            vm.fileTemplateTotal = result.total
            let rightAttachedCounter = document.getElementById('rightAttachedCounter')
            if (rightAttachedCounter !== null && rightAttachedCounter !== undefined && vm.fileTemplateTotal > 0) {
              rightAttachedCounter.innerHTML = 'Tổng số: ' + vm.fileTemplateTotal + ' '
            }
          }).catch(reject => {
            console.log(reject)
          })
        }
      },
      onSuccess: function() {
        setTimeout(() => {
          document.getElementById('dropArea').querySelectorAll(".e-upload-success").forEach(e => e.parentNode.removeChild(e))
          document.getElementById('dropArea').querySelectorAll(".e-upload .e-upload-files").forEach(e => e.parentNode.removeChild(e))
          this.loadFileTemplate()
        }, 2000)
      },
      onFileRemove: function (args) {
        args.postRawFile = false
      },
      processDeleteFileAttach (item) {
        let vm = this
        if (confirm('Bạn có chắc muốn xoá bản ghi này?')) {
          vm.loadingRemove = true
          vm.$store.dispatch('removeServiceFileTemplate', item).then(function () {
            vm.loadingRemove = false
            vm.loadFileTemplate()
          }).catch(reject => {
            vm.loadingRemove = false
            alert('Xoá file xảy ra lỗi.' + reject)
          })
        }
        
      },
      processDownloadFileAttach (item) {
        let vm = this
        vm.loading = true
        if(vm.code === 'opencps_deliverabletype') {
          vm.$store.dispatch('detailFileAttachsVersions', item).then(function () {
            vm.loading = false
          }).catch(reject => {
            vm.loading = false
            alert('Tải file xảy ra lỗi.' + reject)
          })
        } else {
          vm.$store.dispatch('downloadServiceFileTemplate', item).then(function () {
            vm.loading = false
          }).catch(reject => {
            vm.loading = false
            alert('Tải file xảy ra lỗi.' + reject)
          })
        }
      },
      processUpdateFileAttach (item, index ) {
        // this.$refs.refFileUpdate.click()
        console.log(item)
        let vm = this
        vm.fileUpdate = item
        vm.indexFile = index
        document.getElementById("inputFileUpdate").click()
      },
      onFileUpdatePicked(){
        let vm = this
        const files = event.target.files
        if(files.length){
          const file = files[0]
          console.log(file)
          let filter = {
            fileEntryId: vm.fileUpdate.fileEntryId,
            file: file,
            fileName: files[0].name,
            fileType:files[0].type,
            fileSize:files[0].size,
          }
          vm.$store.dispatch('putFileAttach', filter).then(function () {
              vm.loading = true
              let data = {
                item: vm.rawData[vm.indexFile],
                fileTemplateNo: vm.fileUpdate['fileTemplateNo'],
                templateName: files[0].name
              }
              vm.$store.dispatch('updateServiceFileTemplate', data).then(function () {
                vm.loadFileTemplate()
                vm.loading = false
              }).catch(reject => {
                vm.loading = false
                alert('Tải file xảy ra lỗi.' + reject)
              })
          }).catch(reject => {
            alert('Tải file xảy ra lỗi.' + reject)
            alert('Tải file xảy ra lỗi.' + reject)
          }) 
        }
      },
      processUpdateDataFileAttach (val, item, index) {
        let vm = this
        vm.loading = true
        let data = {
          item: vm.rawData[index],
          fileTemplateNo: item['fileTemplateNo'],
          templateName: item['templateName']
        }
        vm.$store.dispatch('updateServiceFileTemplate', data).then(function () {
          vm.loading = false
        }).catch(reject => {
          vm.loading = false
          alert('Tải file xảy ra lỗi.' + reject)
        })
      },
      onFileSelect (arr) {
        console.log('onFileSelect', arr)
        let vm = this
        let param = {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          }
        }
        let dataPost = new FormData()
        dataPost.append('UploadFiles', arr.filesData[0].rawFile)
        axios.post(vm.path.saveUrl, dataPost, param).then(function (result) {
          toastr.success('Thực hiện thành công')
          vm.onSuccess()
        }).catch(xhr => {
          toastr.error('Thực hiện thất bại')
        })
        if(vm.code === 'opencps_deliverabletype'){
          if(vm.pickItem.fileTemplateId !== 1 && vm.pickItem.fileTemplateId !== 0) {
            const file = arr.filesData[0].rawFile
            let filter = {
              fileEntryId: vm.pickItem.fileTemplateId,
              file: file,
              fileName: file.name,
              fileType:file.type,
              fileSize:file.size,
            }
            vm.$store.dispatch('putFileAttach', filter).then(function () {
              vm.loadFileTemplate()
            }).catch(reject => {
              alert('Tải file xảy ra lỗi.' + reject)
              alert('Tải file xảy ra lỗi.' + reject)
            }) 
          } else {
            const file = arr.filesData[0].rawFile
            let filter = {
              deliverableTypeId: vm.pickItem.deliverableTypeId,
              file: file,
            }
            vm.$store.dispatch('postDeliverabletypes', filter).then(function (res) {
              vm.pickItem['fileTemplateId'] = res.fileTemplateId
              vm.loadFileTemplate()
            }).catch(reject => {
              alert('Tải file xảy ra lỗi.' + reject)
              alert('Tải file xảy ra lỗi.' + reject)
            }) 
          }  
        }
      },
      pickFileScript() {
        document.getElementById('fileFormScript').value = ''
        document.getElementById('fileFormScript').click()
      },
      pickFileReport() {
        document.getElementById('fileFormReport').value = ''
        document.getElementById('fileFormReport').click()
      },
      onUploadFileScript (item) {
        let vm = this
        let files = $('input[id="fileFormScript"]')[0].files
        if (files) {
          let file = files[0]
          let fileName = file['name']
          if (file['name']) {
            fileName = file['name'].replace(/\%/g, '')
            fileName = fileName.replace(/\//g, '')
            fileName = fileName.replace(/\\/g, '')
          }
          let formData = new FormData()
          console.log('formScript', file.type, fileName)
          if (file.size) {

            formData.append('fileScript', file, fileName)
            formData.append('eFormNoPattern', item.EFormNoPattern)
            formData.append('templateName', '')
            formData.append('fileEntryId', '')
            formData.append('formScriptFileId', '')
            formData.append('eFormNamePattern', '')

            axios.put('/o/rest/v2/serviceinfos/' + item.serviceInfoId + '/filetemplates/' + item.fileTemplateNo, formData, {
              headers: {
                'groupId': window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
                'Content-Type': 'multipart/form-data'
              }
            }).then(function (response) {
              toastr.success('Cập nhật thành công')
              vm.loadFileTemplate()
            }).catch(function (xhr) {
              toastr.clear()
              toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            })
          }
          
        }
      },
      onUploadFileReport (item) {
        let vm = this
        let files = $('input[id="fileFormReport"]')[0].files
        if (files) {
          let file = files[0]
          let fileName = file['name']
          if (file['name']) {
            fileName = file['name'].replace(/\%/g, '')
            fileName = fileName.replace(/\//g, '')
            fileName = fileName.replace(/\\/g, '')
          }
          let formData = new FormData()
          console.log('formScript', file.type, fileName)
          if (file.size) {
            formData.append('fileReport', file, fileName)
            formData.append('eFormNoPattern', item.EFormNoPattern)
            formData.append('templateName', '')
            formData.append('fileEntryId', '')
            formData.append('formScriptFileId', '')
            formData.append('eFormNamePattern', '')

            axios.put('/o/rest/v2/serviceinfos/' + item.serviceInfoId + '/filetemplates/' + item.fileTemplateNo, formData, {
              headers: {
                'groupId': window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
                'Content-Type': 'multipart/form-data'
              }
            }).then(function (response) {
              toastr.success('Cập nhật thành công')
              vm.loadFileTemplate()
            }).catch(function (xhr) {
              toastr.clear()
              toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            })
          }
          
        }
      },
      changeDataEform (item) {
        let vm = this
        setTimeout(function () {
          let formData = new FormData()
          formData.append('eForm', item['EForm'])
          formData.append('eFormNoPattern', item['EFormNoPattern'])
          axios.put('/o/rest/v2/serviceinfos/' + item.serviceInfoId + '/filetemplates/' + item.fileTemplateNo, formData, {
            headers: {
              'groupId': window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
              'Content-Type': 'multipart/form-data'
            }
          }).then(function (response) {
            toastr.success('Cập nhật thành công')
          }).catch(function (xhr) {
            toastr.clear()
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
          })
        }, 100)
      }
    }
  }
</script>
