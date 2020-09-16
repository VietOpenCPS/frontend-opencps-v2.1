<template>
  <div v-scroll="onScroll">
    <v-form ref="form" v-model="valid" lazy-validation style="background: #ffffff;">
      <div class="row-header no__hidden_class">
        <div class="background-triangle-big"> 
          <span v-if="String(id) !== '0'">THÔNG TIN&nbsp;{{String(loaiDuLieu).toUpperCase()}}</span> 
          <span v-else>TẠO MỚI&nbsp;{{String(loaiDuLieu).toUpperCase()}}</span> 
        </div>
        <div class="layout row wrap header_tools row-blue">
          <div class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
            <span v-if="String(id) !== '0'">{{deName}}</span> 
            <span v-else>{{items[index]['typeName']}}</span> 
          </div>
          <!-- <div class="flex xs4 text-right" style="margin-left: auto;">
            <v-btn v-if="showComponent && String(id) !== '0'" color="blue darken-3" dark class="ml-0 btn-border-left mr-3 my-0" @click.stop="drawer = !drawer">
              <v-icon size="22">help_outline</v-icon> &nbsp;
              Thông tin giấy phép
            </v-btn>
            <v-btn v-else icon class="ml-0 btn-border-left mr-3 my-0" @click="backToList" active-class="temp_active">
              <v-icon size="16">reply</v-icon>
            </v-btn>
          </div> -->
        </div>
      </div>
      <view-pdf ref="viewpdf" v-if="showComponent && String(id) !== '0' && !editDeliverable" :id="id" :datainput="detail"></view-pdf>
      <bbat-table-editor-component v-if="showComponent && editDeliverable" ref="bbatForm" :id="id" :formid="formId" :datainput="detail['formData']"></bbat-table-editor-component>
      <v-flex xs12 class="px-4" v-if="String(id) === '0' || (String(id) !== '0' && editDeliverable)">
        <div class="mb-2" style="font-size: 14px">
          Tài liệu đính kèm <span v-if="requiredAttachFile" style="color:red">(*) </span>:
          <a v-if="detail['fileAttachs'] && detail['fileAttachs'] !== '0'" :href="urlFileAttach" download
           style="color:blue; font-style: italic; text-decoration: underline;"> Tải xuống </a>
        </div>
        <div v-if="fileNameAttach" class="ml-1">
          <span class="ml-0">
            <v-icon class="mr-1" color="blue" size="16px">
              fas fa fa-paperclip
            </v-icon> &nbsp;
            {{fileNameAttach}} 
            <i>({{fileNameAttachDate}})</i>
          </span>
        </div>
        
        <input type="file" id="documentFileAttach" @input="onUploadSingleFile($event, 0)" style="display:none">
        <input type="file" id="documentFileAttachSub" @input="onUploadSingleFile($event, 1)" style="display:none">
        <v-btn small color="primary" class="mx-0 mt-2" dark @click.native="uploadFile">
          <v-icon>fas fa fa-upload</v-icon> &nbsp; &nbsp;
          <span v-if="String(id) !== '0' && editDeliverable && detail['fileAttachs'] && detail['fileAttachs'] !== '0'">Cập nhật tài liệu đính kèm</span>
          <span v-else>Chọn tài liệu tải lên</span>
        </v-btn>
        
      </v-flex>
      <v-navigation-drawer
        v-model="drawer"
        absolute
        hide-overlay
        right
        temporary
      >
        <!-- <v-toolbar height="40" color="primary" dark flat class="mb-2">
          <v-btn icon @click.stop="drawer = !drawer">
            <v-icon size="22">chevron_right</v-icon>
          </v-btn>

          <v-toolbar-title class="ml-0" style="font-size: 16px">Thông tin giấy phép</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar> -->
        <!-- <bbat-table-editor-component-simple ref="bbatFormSimple" :id="id" :datainput="detail"></bbat-table-editor-component-simple> -->
      </v-navigation-drawer>
      
      <v-layout row wrap :class='{"fix_tool_bottom": offsetCheck > 300}'>
        <v-flex xs12 class="text-right pt-0 mt-4 ml-1 px-0 pr-3">
          <v-progress-linear v-if="loading" :indeterminate="true" class="my-0" color="blue darken-3"></v-progress-linear>
          <!-- <v-btn v-if="String(id) === '0'" color="teal darken-3" class="mr-0" dark  v-on:click.native="saveToData(-1)"
            :loading="loading"
            :disabled="loading"
          >Ghi lại và thêm mới</v-btn> -->
          <v-btn v-if="(getUser('QUAN_LY_GIAY_PHEP') || userPermission) && editDeliverable" color="blue darken-3" class="mr-1" dark  
            v-on:click.native="saveToData(0)"
            :loading="loading"
            :disabled="loading"
          >
            <v-icon>save</v-icon> &nbsp;
            <span v-if="String(id) === '0'">Tạo&nbsp;{{String(loaiDuLieu).toLowerCase()}}</span>
            <span v-else>Cập nhật</span>
          </v-btn>
          <v-btn v-if="(getUser('QUAN_LY_GIAY_PHEP') || userPermission) && !editDeliverable && String(id) !== '0'" color="blue darken-3" class="mr-1" dark  v-on:click.native="uploadFileDeliverable"
            :loading="loading"
            :disabled="loading"
          >
          <v-icon>cloud_upload</v-icon> &nbsp;
          Tải&nbsp;{{String(loaiDuLieu).toLowerCase()}}&nbsp;từ máy tính
          </v-btn>
          <v-btn v-if="(getUser('QUAN_LY_GIAY_PHEP') || userPermission) && !editDeliverable && detail.dossierId === '0'" color="blue darken-3" class="mr-1" dark  v-on:click.native="editDeliverableAction()"
            :loading="loading"
            :disabled="loading"
          >
          <v-icon>edit</v-icon> &nbsp;
          Sửa&nbsp;{{String(loaiDuLieu).toLowerCase()}}
          </v-btn>
          <!-- <v-btn v-if="String(id) !== '0' && !editDeliverable && detail['fileAttachs']" color="blue darken-3" class="mr-1" dark  v-on:click.native="viewFileAttach(detail)"
            :loading="loading"
            :disabled="loading"
          >
          <v-icon>visibility</v-icon> &nbsp;
            Tài liệu đính kèm
          </v-btn> -->
          <v-btn v-if="String(id) !== '0' && editDeliverable && detail['fileAttachs'] && detail['fileAttachs'] !== '0'" color="blue darken-3" class="mr-1" dark  v-on:click.native="editDeliverable = false"
            :loading="loading"
            :disabled="loading"
          >
          <v-icon>visibility</v-icon> &nbsp;
          Xem&nbsp;{{String(loaiDuLieu).toLowerCase()}}
          </v-btn>
          <v-btn color="blue darken-3" class="mr-0" dark v-on:click.native="backToList">
            <v-icon>reply</v-icon> &nbsp;
            Quay lại
          </v-btn>
        </v-flex>
        <div style="display: none">
          <ejs-uploader :multiple="false" :autoUpload="auto" id='templateupload' name="UploadFiles" :allowedExtensions= 'extensions'
          ref="uploadObj" :dropArea= "dropArea" :maxFileSize="10485760"
          :success= "onSuccess" :uploading= "addHeaders">
          </ejs-uploader>
        </div>
        
      </v-layout>
    </v-form>
    <v-dialog v-model="dialogPDF" max-width="1200" transition="fade-transition" fullscreen>
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Tài liệu đính kèm</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogPDF = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <div v-if="dialogPDFLoading" style="
          min-height: 650px;
          text-align: center;
          margin: auto;
          padding: 25%;
        ">
          <v-progress-circular
            :size="100"
            :width="1"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>
        <v-card-text class="px-0 py-0 my-0 py-0">
          <iframe v-show="!dialogPDFLoading" id="pdfViewerListComponent" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 650px;" frameborder="0">
          </iframe>
        </v-card-text>
        
        <v-card-actions v-if="fileEntryIdAttachs.length > 1" class="py-0">
          <span class="left primary--text text-bold" style="font-size: 1.25em">Tổng số: <span class="red--text">{{fileEntryIdAttachs.length}}</span> tài liệu</span>
          <div class="text-xs-center" style="width: calc(100% - 150px);">
            <v-pagination
              v-model="pageAttachs"
              :length="fileEntryIdAttachs.length"
              circle
              @input="changePage(pageAttachs)"
              :total-visible="5"
            ></v-pagination>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import $ from 'jquery'
  import { BbatTableEditorComponent, BbatTableEditorComponentSimple, ViewPdf, ViewLogs, AttachedFileTemplate } from '@/components'
  import toastr from 'toastr'
  import { UploaderPlugin } from '@syncfusion/ej2-vue-inputs'
  import { detach } from '@syncfusion/ej2-base'

  Vue.use(UploaderPlugin)
  export default {
    props: ['index', 'id'],
    components: {
      BbatTableEditorComponentSimple,
      BbatTableEditorComponent,
      ViewPdf,
      ViewLogs,
      AttachedFileTemplate
    },
    data () {
      return {
        drawer: null,
        offsetTop: 0,
        offsetCheck: 400,
        deName: '',
        valid: false,
        active: -1,
        loading: false,
        dataSocket: {},
        tempCounter: 0,
        detail: {},
        showComponent: false,
        formId: '',
        editDeliverable: false,
        extensions: '.pdf',
        dialogPDF: false,
        dialogPDFLoading: false,
        fileEntryIdAttachs: [],
        pageAttachs: 1,
        loaiDuLieu: '',
        fileNameAttach: '',
        fileNameAttachDate: '',
        extensionsFileUpLoad: '',
        maxSizeFileUpLoad: '',
        requiredAttachFile: false,
        urlFileAttach: '',
        indexFile: 0
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        let currentQuery = vm.$router.history.current.query
        // set permissionUser
        if (vm.items.length > 0) {
          vm.$store.commit('setUserPermission', vm.items[vm.index]['moderator'])
        }
        // 
        vm.editDeliverable = String(vm.id) === '0' || (currentQuery.hasOwnProperty('editForm') && currentQuery.editForm) ? true : false
        vm.$store.dispatch('getDeliverableTypes').then(function (result) {
          setTimeout(() => {
            let tableConfig = eval('( ' + vm.items[vm.index]['tableConfig'] + ' )')
            if (tableConfig.hasOwnProperty('loaiDuLieu') && tableConfig.loaiDuLieu) {
              vm.loaiDuLieu = tableConfig.loaiDuLieu
            } else {
              vm.loaiDuLieu = "giấy phép"
            }
            if (tableConfig.hasOwnProperty('extensions') && tableConfig.extensions) {
              vm.extensionsFileUpLoad = tableConfig.extensions
            } else {
              vm.extensionsFileUpLoad = ''
            }
            if (tableConfig.hasOwnProperty('attachFile') && tableConfig.attachFile) {
              vm.requiredAttachFile = tableConfig.attachFile
            } else {
              vm.requiredAttachFile = false
            }
            if (tableConfig.hasOwnProperty('maxSize') && tableConfig.maxSize) {
              vm.maxSizeFileUpLoad = tableConfig.maxSize
            } else {
              vm.maxSizeFileUpLoad = ''
            }
            vm.formId = vm.items[vm.index]['formScriptFileId']
            vm.deName = ''
            // vm.$store.dispatch('getContentFile', formId)
            vm.showComponent = false
            vm.$store.dispatch('getDeliverableById', vm.id).then(function (result) {
              if (String(vm.id) !== '0') {
                vm.detail = result
                // test multiple fileAttachs
                // vm.detail['fileAttachs'] = '1300487,1289275'
                // 
                if (vm.detail['fileAttachs'] && vm.detail['fileAttachs'] !== '0') {
                  vm.getFileAttach()
                }
              }
              vm.deName = vm.detail['deliverableName']
              vm.showComponent = true
              vm.$store.dispatch('getContentFileSimple')
              vm.tempCounter = vm.pullCounter
            })
          }, 100)
        })
      })
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        if (vm.isConnected) {
          // console.log('watch editor')
          vm.isConnected = false
          let formId = vm.items[vm.index]['formScriptFileId']
          let tableConfig = eval('( ' + vm.items[vm.index]['tableConfig'] + ' )')
          if (tableConfig.hasOwnProperty('loaiDuLieu') && tableConfig.loaiDuLieu) {
            vm.loaiDuLieu = tableConfig.loaiDuLieu
          } else {
            vm.loaiDuLieu = "giấy phép"
          }
          if (tableConfig.hasOwnProperty('extensions') && tableConfig.extensions) {
            vm.extensionsFileUpLoad = tableConfig.extensions
          } else {
            vm.extensionsFileUpLoad = ''
          }
          if (tableConfig.hasOwnProperty('attachFile') && tableConfig.attachFile) {
            vm.requiredAttachFile = tableConfig.attachFile
          } else {
            vm.requiredAttachFile = false
          }
          if (tableConfig.hasOwnProperty('maxSize') && tableConfig.maxSize) {
            vm.maxSizeFileUpLoad = tableConfig.maxSize
          } else {
            vm.maxSizeFileUpLoad = ''
          }
          vm.deName = ''
          // vm.$store.dispatch('getContentFile', formId)
          vm.showComponent = false
          vm.$store.dispatch('getDeliverableById', vm.id).then(function (result) {
            if (String(vm.id) !== '0') {
              vm.detail = result
              // test multiple fileAttachs
              // vm.detail['fileAttachs'] = '1300487,1289275'
              // 
              if (vm.detail['fileAttachs'] && vm.detail['fileAttachs'] !== '0') {
                vm.getFileAttach()
              }
            }
            vm.deName = vm.detail['deliverableName']
            vm.showComponent = true
            vm.$store.dispatch('getContentFileSimple')
            vm.tempCounter = vm.pullCounter
            if (String(vm.id) === '0' || (String(vm.id) !== '0' && vm.editDeliverable)) {
              vm.indexFile = 0
              document.getElementById('documentFileAttach').value = ''
              vm.fileNameAttach = ''
            }
          })
          
        }
      },
      items (val) {
        var vm = this
        // set permissionUser
        if (vm.items.length > 0) {
          vm.$store.commit('setUserPermission', vm.items[vm.index]['moderator'])
        }
        // 
      }
    },
    computed: {
      items () {
        return this.$store.getters.getDeliverableTypes
      },
      userPermission () {
        return this.$store.getters.getUserPermission
      },
      pullCounter: {
        // getter
        get: function() {
          return this.$store.getters.pullCounter
        },
        // setter
        set: function(newValue) {
          this.$store.commit('setpullCounter', newValue)
        }
      },
      isConnected: {
        // getter
        get: function() {
          return this.$store.getters.getisConnected
        },
        // setter
        set: function(newValue) {
          this.$store.commit('setisConnected', newValue)
        }
      }
    },
    mounted: function () {
      let vm = this
      $('.e-upload').css('display', 'none')
      $('#templateupload').unbind()
      $('#templateupload').change(function() {
        setTimeout(() => {
          vm.loading = true
          let uploadData = {
            id: vm.id
          }
          vm.$store.dispatch('uploadSingleFile', uploadData).then(function(result) {
            setTimeout(function () {
              toastr.success('Tải ' + String(vm.loaiDuLieu).toLowerCase() + ' lên thành công')
              vm.loading = false
              vm.$store.dispatch('getDeliverableById', vm.id).then(function (result) {
                vm.detail = result
                vm.editDeliverable = false
                vm.showComponent = true
                vm.$refs.viewpdf.pullPDF(vm.detail['fileEntryId'])
              })
            }, 2000)
          }).catch(function() {
            toastr.error('Tải ' + String(vm.loaiDuLieu).toLowerCase() + ' lên thất bại')
            vm.loading = false
          })
        }, 200)
      })
    },
    methods: {
      onScroll (e) {
        this.offsetTop = window.pageYOffset || document.documentElement.scrollTop
        this.offsetCheck = document.getElementsByTagName('BODY')[0].offsetHeight - this.offsetTop
        // console.log('this.offsetCheck', this.offsetCheck)
      },
      goBack () {
        window.history.back()
      },
      backToList () {
        let vm = this
        // console.log('backToList')
        let current = vm.$router.history.current
        let newQuery = current.query
        let currentPath = current.path
        let queryString = '?'
        newQuery['state_change'] = '0'
        newQuery['renew'] = ''
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        queryString += 'renew=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1
        vm.$router.push({
          path: '/danh-sach-giay-to/' + vm.index + queryString
        })
      },
      saveToData (cmd) {
        let vm = this
        if (vm.$refs.form.validate()) {
          // 
          try {
            let field = window.$('#formDelivert').alpaca('get').childrenByPropertyId
            if (field) {
              for (let prop in field) {
                if (field[prop].isRequired() && field[prop].getValue() === '') {
                  toastr.clear()
                  toastr.error(field[prop].options.title ? field[prop].options.title + ' là trường dữ liệu bắt buộc' : field[prop].options['name'] + ' là trường dữ liệu bắt buộc')
                  return
                }
              }
            }
          } catch (error) {
          }
          // 
          let fileCheck = vm.indexFile == 0 ? window.$('#documentFileAttachSub')[0].files : window.$('#documentFileAttach')[0].files
          console.log('fileNameAttach', fileCheck)
          if (vm.requiredAttachFile && (!vm.detail['fileEntryId'] || vm.detail['fileEntryId'] == '0') && fileCheck.length === 0) {
            toastr.error('Vui lòng đính kèm tài liệu!')
            vm.loading = false
            return
          }
          // 
          vm.loading = true
          let bbatForm = vm.$refs.bbatForm
          let submitDataObject = {}
          if (bbatForm !== null && bbatForm !== undefined && bbatForm !== 'undefined') {
            submitDataObject['formData'] = {}
            submitDataObject['formData'] = bbatForm.getFormData()
          }
          submitDataObject['deliverableType'] = vm.items[vm.index]['typeCode']
          // console.log('submitDataObject', submitDataObject)
          if (cmd === -1) {
            vm.detail = {}
          } else {
            if (String(vm.id) !== '0') {
              submitDataObject['deliverableCode'] = vm.detail['deliverableCode']
              submitDataObject['deliverableId'] = vm.detail['deliverableId']
            }
            vm.$store.dispatch('createDeliverable', submitDataObject).then(function (data) {
              let attachFiles = function () {
                let deliverableId = data.createDeliverable.deliverableId
                let files = vm.indexFile == 0 ? window.$('#documentFileAttachSub')[0].files : window.$('#documentFileAttach')[0].files
                let file = files ? files[0] : ''
                if (file) {
                  let formData = new FormData()
                  formData.append('UploadFiles', file)
                  axios.post('/o/v1/opencps/users/upload/opencps_deliverable/org.opencps.deliverable.model.OpenCPSDeliverableFileEntryId/' + deliverableId, formData, {
                    headers: {
                      'groupId': window.themeDisplay.getScopeGroupId(),
                      'Content-Type': 'multipart/form-data'
                    }
                  }).then(function (){}).catch(function () {
                    toastr.error('Đính kèm tài liệu không thành công')
                  })
                }
              }
              
              if (String(vm.id) === '0') {
                attachFiles()
                vm.loading = false
                vm.backToList()
              } else {
                setTimeout(function () {
                  attachFiles()
                  setTimeout(function () {
                    toastr.success('Cập nhật thành công')
                    vm.backToList()
                    vm.loading = false
                    // vm.$store.dispatch('getDeliverableById', vm.id).then(function (result) {
                    //   vm.detail = result
                    //   vm.editDeliverable = false
                    //   vm.showComponent = true
                    //   setTimeout(function () {
                    //     vm.$refs.viewpdf.pullPDF(vm.detail['fileEntryId'])
                    //   }, 200)
                    // })
                  }, 2000)
                  
                }, 500)
              }
            }).catch(function() {
              vm.loading = false
            })
          }
        }
      },
      viewFileAttach (detail) {
        let vm = this
        vm.fileEntryIdAttachs = String(detail['fileAttachs']).split(',')
        vm.loading = true
        vm.dialogPDFLoading = true
        vm.$store.dispatch('viewPDF', vm.fileEntryIdAttachs[0]).then(function (result) {
          vm.loading = false
          vm.dialogPDFLoading = false
          vm.dialogPDF = true
          document.getElementById('pdfViewerListComponent').src = result
        }).catch(function () {
          vm.loading = false
          vm.dialogPDFLoading = false
        })
      },
      editDeliverableAction() {
        let vm = this
        vm.editDeliverable = true
        setTimeout(function(){
          if (String(vm.id) === '0' || (String(vm.id) !== '0' && vm.editDeliverable)) {
            vm.indexFile = 0
            document.getElementById('documentFileAttach').value = ''
            vm.fileNameAttach = ''
          }
        }, 100)
      },
      changePage(page) {
        let vm = this
        let index = Number(page) - 1
        vm.dialogPDFLoading = true
        vm.$store.dispatch('viewPDF', vm.fileEntryIdAttachs[index]).then(function (result) {
          vm.dialogPDFLoading = false
          document.getElementById('pdfViewerListComponent').src = result
        }).catch(function () {
          vm.dialogPDFLoading = false
        })
      },
      uploadFileDeliverable () {
        let vm = this
        document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button').click()
        return false
      },
      getUser (roleItem) {
        let vm = this
        let roles = vm.$store.getters.getUser.role
        if (!roles) {
          return false
        }
        let roleExits = roles.findIndex(item => String(item).indexOf(roleItem) >= 0)
        return (roleExits >= 0)
      },
      uploadFile () {
        let vm = this
        if (vm.indexFile === 0) {
          document.getElementById('documentFileAttach').value = ''
          document.getElementById('documentFileAttach').click()
        } else {
          document.getElementById('documentFileAttachSub').value = ''
          document.getElementById('documentFileAttachSub').click()
        }
      },
      onUploadSingleFile (event, index) {
        let vm = this
        let file
        if (vm.indexFile == 0) {
          file = window.$('#documentFileAttach')[0].files[0]
        } else {
          file = window.$('#documentFileAttachSub')[0].files[0]
        }
        // 
        let fileUpload = {
          file: file
        }
        let valid = vm.validFileUpload(fileUpload)
        // 
        if (valid) {
          if (vm.indexFile == 0) {
            vm.indexFile = 1
          } else {
            vm.indexFile = 0
          }
          vm.fileNameAttach = file.name
          vm.fileNameAttachDate = vm.getCurentDateTime()
        } else {
          if (vm.indexFile == 0) {
            document.getElementById('documentFileAttach').value = ''
          } else {
            document.getElementById('documentFileAttachSub').value = ''
          }
        }
        
      },
      validFileUpload (fileUpload) {
        let vm = this
        let validation = true
        console.log('fileUpload', fileUpload)
        console.log('fileUploadValid', vm.extensionsFileUpLoad, vm.maxSizeFileUpLoad)
        let getFileType = fileUpload.file.name ? fileUpload.file.name.split('.') : ''
        let fileType = getFileType ? getFileType[getFileType.length - 1] : ''
        let tips = {
          extensions: vm.extensionsFileUpLoad,
          maxSize: vm.maxSizeFileUpLoad
        }
        let fileTypeAllow = tips['extensions'] ? (tips['extensions'] + ',' + tips['extensions'].toUpperCase()).split(',') : ''
        let fileSizeAllow = tips['maxSize']
        let fileTypeInput = fileTypeAllow ? fileTypeAllow.filter(function (item) {
          return item === fileType
        }) : ''
        validation = false
        if (fileTypeInput && fileTypeInput.length > 0) {
          if (Number(fileUpload.file.size) <= tips['maxSize'] * 1048576 || !tips['maxSize']) {
            validation = true
          } else {
            toastr.clear()
            toastr.error('Tài liệu tải lên dung lượng tối đa là ' + tips['maxSize'] + ' MB')
            validation = false
          }
        } else {
          if (!tips['extensions']) {
            validation = true
          } else {
            toastr.clear()
            toastr.error('Tài liệu tải lên chỉ chấp nhận các định dạng ' + tips['extensions'])
            validation = false
          }
        }

        return validation
      },
      getCurentDateTime () {
        let date = new Date()
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} | ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
      },
      getFileAttach () {
        let vm = this
        vm.$store.dispatch('viewPDF', vm.detail['fileAttachs']).then(function (result) {
          vm.urlFileAttach = result
        }).catch(function () {
          vm.urlFileAttach = ''
        })
      }
    }
  }
</script>
