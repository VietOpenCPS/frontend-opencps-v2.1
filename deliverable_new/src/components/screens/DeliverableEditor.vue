<template>
  <div v-scroll="onScroll">
    <v-form ref="form" v-model="valid" lazy-validation style="background: #ffffff;">
      <div class="row-header no__hidden_class">
        <div class="background-triangle-big"> 
          <span v-if="String(id) !== '0'">THÔNG TIN GIẤY PHÉP</span> 
          <span v-else>TẠO MỚI GIẤY PHÉP</span> 
        </div>
        <div class="layout row wrap header_tools row-blue">
          <div class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
            <span v-if="String(id) !== '0'">{{deName}}</span> 
            <span v-else>{{items[index]['typeName']}}</span> 
          </div>
          <div class="flex xs4 text-right" style="margin-left: auto;">
            <v-btn v-if="showComponent && String(id) !== '0'" color="blue darken-3" dark class="ml-0 btn-border-left mr-3 my-0" @click.stop="drawer = !drawer">
              <v-icon size="22">help_outline</v-icon> &nbsp;
              Thông tin giấy phép
            </v-btn>
            <v-btn v-else icon class="ml-0 btn-border-left mr-3 my-0" @click="backToList" active-class="temp_active">
              <v-icon size="16">reply</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
      <view-pdf ref="viewpdf" v-if="showComponent && String(id) !== '0' && !editDeliverable" :id="id" :datainput="detail"></view-pdf>
      <bbat-table-editor-component v-if="showComponent && editDeliverable" ref="bbatForm" :id="id" :formid="formId" :datainput="detail['formData']"></bbat-table-editor-component>
      <v-navigation-drawer
        v-model="drawer"
        absolute
        hide-overlay
        right
        temporary
      >
        <v-toolbar height="40" color="primary" dark flat class="mb-2">
          <v-btn icon @click.stop="drawer = !drawer">
            <v-icon size="22">chevron_right</v-icon>
          </v-btn>

          <v-toolbar-title class="ml-0" style="font-size: 16px">Thông tin giấy phép</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <bbat-table-editor-component-simple ref="bbatFormSimple" :id="id" :datainput="detail"></bbat-table-editor-component-simple>
      </v-navigation-drawer>
      
      <v-layout row wrap :class='{"fix_tool_bottom": offsetCheck > 300}'>
        <v-flex xs12 class="text-right pt-0 mt-4 ml-1 px-0 pr-3">
          <v-progress-linear v-if="loading" :indeterminate="true" class="my-0" color="blue darken-3"></v-progress-linear>
          <!-- <v-btn v-if="String(id) === '0'" color="teal darken-3" class="mr-0" dark  v-on:click.native="saveToData(-1)"
            :loading="loading"
            :disabled="loading"
          >Ghi lại và thêm mới</v-btn> -->
          <v-btn v-if="(getUser('QUAN_LY_GIAY_PHEP') || userPermission) && editDeliverable" color="blue darken-3" class="mr-1" dark  v-on:click.native="saveToData(0)"
            :loading="loading"
            :disabled="loading"
          >
            <v-icon>save</v-icon> &nbsp;
            <span v-if="String(id) === '0'">Tạo giấy phép</span>
            <span v-else>Cập nhật</span>
          </v-btn>
          <v-btn v-if="(getUser('QUAN_LY_GIAY_PHEP') || userPermission) && !editDeliverable && String(id) !== '0'" color="blue darken-3" class="mr-1" dark  v-on:click.native="uploadFileDeliverable"
            :loading="loading"
            :disabled="loading"
          >
          <v-icon>cloud_upload</v-icon> &nbsp;
          Tải giấy phép từ máy tính
          </v-btn>
          <v-btn v-if="(getUser('QUAN_LY_GIAY_PHEP') || userPermission) && !editDeliverable" color="blue darken-3" class="mr-1" dark  v-on:click.native="editDeliverable = true"
            :loading="loading"
            :disabled="loading"
          >
          <v-icon>edit</v-icon> &nbsp;
          Sửa giấy phép
          </v-btn>
          <v-btn v-if="String(id) !== '0' && !editDeliverable && detail['fileAttachs']" color="blue darken-3" class="mr-1" dark  v-on:click.native="viewFileAttach(detail)"
            :loading="loading"
            :disabled="loading"
          >
          <v-icon>visibility</v-icon> &nbsp;
            Tài liệu đính kèm
          </v-btn>
          <v-btn v-if="String(id) !== '0' && editDeliverable" color="blue darken-3" class="mr-1" dark  v-on:click.native="editDeliverable = false"
            :loading="loading"
            :disabled="loading"
          >
          <v-icon>visibility</v-icon> &nbsp;
          Xem giấy phép
          </v-btn>
          <v-btn color="red darken-3" class="mr-0" dark v-on:click.native="backToList">
            <v-icon>reply</v-icon> &nbsp;
            Quay lại
          </v-btn>
        </v-flex>

        <ejs-uploader style="display: none !important" :multiple="false" :autoUpload="auto" id='templateupload' name="UploadFiles" :allowedExtensions= 'extensions'
        ref="uploadObj" :dropArea= "dropArea" :maxFileSize="10485760"
        :success= "onSuccess" :uploading= "addHeaders">
        </ejs-uploader>
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
        pageAttachs: 1
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        // set permissionUser
        if (vm.items.length > 0) {
          vm.$store.commit('setUserPermission', vm.items[vm.index]['moderator'])
        }
        // 
        vm.editDeliverable = String(vm.id) === '0' ? true : false
        vm.$store.dispatch('getDeliverableTypes').then(function (result) {
          setTimeout(() => {
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
          console.log('watch editor')
          vm.isConnected = false
          let formId = vm.items[vm.index]['formScriptFileId']
          vm.deName = ''
          // vm.$store.dispatch('getContentFile', formId)
          vm.showComponent = false
          vm.$store.dispatch('getDeliverableById', vm.id).then(function (result) {
            if (String(vm.id) !== '0') {
              vm.detail = result
              // test multiple fileAttachs
              // vm.detail['fileAttachs'] = '1300487,1289275'
              // 
            }
            vm.deName = vm.detail['deliverableName']
            vm.showComponent = true
            vm.$store.dispatch('getContentFileSimple')
            vm.tempCounter = vm.pullCounter
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
              toastr.success('Tải giấy phép lên thành công')
              vm.loading = false
              vm.$store.dispatch('getDeliverableById', vm.id).then(function (result) {
                vm.detail = result
                vm.editDeliverable = false
                vm.showComponent = true
                vm.$refs.viewpdf.pullPDF(vm.detail['fileEntryId'])
              })
            }, 2000)
          }).catch(function() {
            toastr.error('Tải giấy phép lên thất bại')
            vm.loading = false
          })
        }, 200)
      })
    },
    methods: {
      onScroll (e) {
        this.offsetTop = window.pageYOffset || document.documentElement.scrollTop
        this.offsetCheck = document.getElementsByTagName('BODY')[0].offsetHeight - this.offsetTop
        console.log('this.offsetCheck', this.offsetCheck)
      },
      goBack () {
        window.history.back()
      },
      backToList () {
        let vm = this
        console.log('backToList')
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
          vm.loading = true
          // let bbatFormSimple = vm.$refs.bbatFormSimple
          let bbatForm = vm.$refs.bbatForm
          let submitDataObject = {}
          // if (bbatFormSimple !== null && bbatFormSimple !== undefined && bbatFormSimple !== 'undefined') {
          //   console.log('bbatFormSimple', bbatFormSimple.data)
          //   submitDataObject = bbatFormSimple.data
          // }
          if (bbatForm !== null && bbatForm !== undefined && bbatForm !== 'undefined') {
            submitDataObject['formData'] = {}
            submitDataObject['formData'] = bbatForm.getFormData()
          }
          submitDataObject['deliverableType'] = vm.items[vm.index]['typeCode']
          console.log('submitDataObject', submitDataObject)
          if (cmd === -1) {
            vm.detail = {}
          } else {
            // if (submitDataObject.hasOwnProperty('govAgenciesItems')) {
            //   delete submitDataObject.govAgenciesItems
            // }
            // if (submitDataObject.hasOwnProperty('applicantIdNoItems')) {
            //   delete submitDataObject.applicantIdNoItems
            // }
            if (String(vm.id) !== '0') {
              submitDataObject['deliverableCode'] = vm.detail['deliverableCode']
              submitDataObject['deliverableId'] = vm.detail['deliverableId']
            }
            vm.$store.dispatch('createDeliverable', submitDataObject).then(function (data) {
              if (String(vm.id) === '0') {
                vm.loading = false
                // vm.$refs.attachedObj.doUploadLate(data['createDeliverable']['deliverableId'])
                vm.backToList()
              } else {
                setTimeout(function () {
                  toastr.success('Cập nhật thành công')
                  vm.loading = false
                  vm.$store.dispatch('getDeliverableById', vm.id).then(function (result) {
                    vm.detail = result
                    vm.editDeliverable = false
                    vm.showComponent = true
                    setTimeout(function () {
                      vm.$refs.viewpdf.pullPDF(vm.detail['fileEntryId'])
                    }, 200)
                  })
                }, 2000)
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
      }
    }
  }
</script>
