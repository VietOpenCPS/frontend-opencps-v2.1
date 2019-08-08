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
      <!-- <bbat-table-editor-component-simple v-if="showComponent" ref="bbatFormSimple" :id="id" :datainput="detail"></bbat-table-editor-component-simple> -->
      <!-- <v-tabs
        icons-and-text centered
        v-model="active"
      >
        <v-tabs-slider></v-tabs-slider>
    
        <v-tab
          href="#tab-1"
          :key="1"
          v-if="String(id) !== '0'"
        >
          <v-btn flat class="px-0 py-0 mx-0 my-0">
            XEM GIẤY PHÉP
          </v-btn>
        </v-tab>
        <v-tab
          href="#tab-2"
          :key="2"
        >
          <v-btn flat class="px-0 py-0 mx-0 my-0" @click="">
            THÔNG TIN MỞ RỘNG
          </v-btn>
        </v-tab>
        <v-tab
          href="#tab-3"
          :key="3"
        >
          <v-btn flat class="px-0 py-0 mx-0 my-0">
            TẢI GIẤY PHÉP TỪ MÁY TÍNH
          </v-btn>
        </v-tab>
        <v-tab :key="4" href="#tab-4" 
          v-if="String(id) !== '0'"> 
          <v-btn flat class="px-0 py-0 mx-0 my-0">
            LỊCH SỬ CẬP NHẬT GIẤY PHÉP
          </v-btn>
        </v-tab>

        <v-tabs-items reverse-transition="fade-transition" transition="fade-transition">
          <v-tab-item
            value="tab-1"
            :key="1"
            reverse-transition="fade-transition" transition="fade-transition"
            v-if="String(id) !== '0'"
          >
            <view-pdf ref="viewpdf" v-if="showComponent" :id="id" :datainput="detail"></view-pdf>
          </v-tab-item>
          <v-tab-item
            value="tab-2"
            :key="2"
            reverse-transition="fade-transition" transition="fade-transition"
          >
            <bbat-table-editor-component v-if="showComponent" ref="bbatForm" :id="id" :formid="formId" :datainput="detail['formData']"></bbat-table-editor-component>
          </v-tab-item>

          <v-tab-item
            value="tab-3"
            :key="3"
            reverse-transition="fade-transition" transition="fade-transition"
          >
            <attached-file-template ref="attachedObj" :pk="id" :auto="String(id) === '0' ? false : true"></attached-file-template>
          </v-tab-item>
          <v-tab-item
            value="tab-4"
            :key="4"
            reverse-transition="fade-transition" transition="fade-transition"
            v-if="String(id) !== '0'"
          >
            <view-logs v-if="showComponent" :id="id" :datainput="detail"></view-logs>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs> -->
      <v-layout row wrap :class='{"fix_tool_bottom": offsetCheck > 300}'>
        <v-flex xs12 class="text-right pt-0 mt-4 ml-1 px-0 pr-3">
          <v-progress-linear v-if="loading" :indeterminate="true" class="my-0" color="blue darken-3"></v-progress-linear>
          <!-- <v-btn v-if="String(id) === '0'" color="teal darken-3" class="mr-0" dark  v-on:click.native="saveToData(-1)"
            :loading="loading"
            :disabled="loading"
          >Ghi lại và thêm mới</v-btn> -->
          <v-btn v-if="editDeliverable" color="blue darken-3" class="mr-1" dark  v-on:click.native="saveToData(0)"
            :loading="loading"
            :disabled="loading"
          >
          <v-icon>save</v-icon> &nbsp;
          <span v-if="String(id) === '0'">Tạo giấy phép</span>
          <span v-else>Cập nhật</span>
          </v-btn>
          <v-btn v-if="!editDeliverable && String(id) !== '0'" color="blue darken-3" class="mr-1" dark  v-on:click.native="uploadFileDeliverable"
            :loading="loading"
            :disabled="loading"
          >
          <v-icon>cloud_upload</v-icon> &nbsp;
          Tải giấy phép từ máy tính
          </v-btn>
          <v-btn v-if="!editDeliverable" color="blue darken-3" class="mr-1" dark  v-on:click.native="editDeliverable = true"
            :loading="loading"
            :disabled="loading"
          >
          <v-icon>edit</v-icon> &nbsp;
          Sửa giấy phép
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
        extensions: '.pdf'
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
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
            }
            vm.deName = vm.detail['deliverableName']
            vm.showComponent = true
            vm.$store.dispatch('getContentFileSimple')
            vm.tempCounter = vm.pullCounter
          })
          
        }
      }
    },
    computed: {
      items () {
        return this.$store.getters.getDeliverableTypes
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
      uploadFileDeliverable () {
        let vm = this
        document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button').click()
        return false
      }
    }
  }
</script>
