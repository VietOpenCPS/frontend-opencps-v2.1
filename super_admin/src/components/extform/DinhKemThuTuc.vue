<template>
<div>
    <v-breadcrumbs>
      <v-icon slot="divider">chevron_right</v-icon>

      <v-breadcrumbs-item
        v-for="item in breadCrumbsitems"
        :disabled="item.disabled"
        :key="item.text"
      >
        {{ item.text }}
      </v-breadcrumbs-item>
      <a href="javascript:;" style="
        text-decoration: none;
        font-weight: bold;
      "></a>
    </v-breadcrumbs>
    <v-card class="px-2 mx-1">
      <v-toolbar color="blue darken-3" dark height="48">
        <v-btn dark icon>
          <v-icon>edit</v-icon>
        </v-btn>
        <v-toolbar-title class="ml-0">
          Đính kèm thủ tục
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn dark icon v-on:click.native="backToList">
          <v-icon>reply</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="grid-list mt-3">
        <!-- Đồng bộ danh mục cơ quan-->
        <v-layout row wrap>
            <v-flex xs12 style="position:relative" class="control-section uploader customdroparea">
            <div class="control_wrapper">
                <div class="sample_wrapper">
                    <div id="dropArea">
                        <!-- <span id="drop" class="droparea" style="" > Kéo thả tệp tin hoặc <a href="javascript:;" id="browse">Chọn từ máy tính &nbsp; 📤</a></span>
                        <ejs-uploader id='templateupload' name="UploadFiles" :allowedExtensions= 'extensions' :asyncSettings= "path" ref="uploadObj" :dropArea= "dropArea" :success= "onSuccess" :removing= "onFileRemove" :uploading= "addHeaders" :selected= "onFileSelect">
                        </ejs-uploader> -->
                        <div class="e-upload-done-list">
                        <ul class="e-upload-files">
                            <li class="e-upload-file-list" v-for="(item, index) in fileTemplateData" v-bind:key="index">
                            <div class='container' style="position: relative;min-height: 75px;">
                                <span class='wrapper' style="
                                line-height: 10px;
                                ">
                                <span :class="['icon sf-icon-' + item['extension']]"></span>
                                <div class='name file-name'>
                                <span>{{item['fileName']}}</span>
                                <span class="mx-2"><strong>Phiên bản {{item['version']}}</strong></span>
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
      </div>
    </v-card>
</div>

</template>

<script>
  import Vue from 'vue'
  import { UploaderPlugin } from '@syncfusion/ej2-vue-inputs'
  import { detach } from '@syncfusion/ej2-base'

  Vue.use(UploaderPlugin)

  export default {
    data () {
      return {
        breadCrumbsitems: [
        {
            text: 'Đính kèm thủ tục',
            disabled: false
        },
        {
            text: '',
            disabled: false
        }
        ],
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
    props: ['id'],
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
      }
      
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
      },
      loadFileTemplate () {
        let vm = this
     
        vm.fileTemplateData = []
        vm.$store.dispatch('getFileattachsVersions', vm.id).then(function (result) {
        console.log(result)
        vm.fileTemplateTotal = result.total
        for(let i = 0; i < result.data.length ; i++){
            vm.fileTemplateData.push(JSON.parse(result.data[i]))
        }
        
        }).catch(reject => {
        console.log(reject)
        })  
      },
      onSuccess: function() {
        setTimeout(() => {
          document.getElementById('dropArea').querySelectorAll(".e-upload-success").forEach(e => e.parentNode.removeChild(e))
          this.loadFileTemplate()
        }, 2000)
      },
      onFileRemove: function (args) {
        args.postRawFile = false
      },
    //   processDeleteFileAttach (item) {
    //     let vm = this
    //     if (confirm('Bạn có chắc muốn xoá bản ghi này?')) {
    //       vm.loadingRemove = true
    //       vm.$store.dispatch('removeServiceFileTemplate', item).then(function () {
    //         vm.loadingRemove = false
    //         vm.loadFileTemplate()
    //       }).catch(reject => {
    //         vm.loadingRemove = false
    //         alert('Xoá file xảy ra lỗi.' + reject)
    //       })
    //     }
        
    //   },
      processDownloadFileAttach (item) {
        let vm = this
        vm.loading = true
        vm.$store.dispatch('detailFileAttachsVersions', item).then(function () {
        vm.loading = false
        }).catch(reject => {
        vm.loading = false
        alert('Tải file xảy ra lỗi.' + reject)
        })
      }, 
        backToList () {
            window.history.back()
        }
    //   processUpdateFileAttach (item, index ) {
    //     // this.$refs.refFileUpdate.click()
    //     console.log(item)
    //     let vm = this
    //     vm.fileUpdate = item
    //     vm.indexFile = index
    //     document.getElementById("inputFileUpdate").click()
    //   },
    //   onFileUpdatePicked(){
    //     let vm = this
    //     const files = event.target.files
    //     if(files.length){
    //       const file = files[0]
    //       console.log(file)
    //       let filter = {
    //         fileEntryId: vm.fileUpdate.fileEntryId,
    //         file: file,
    //         fileName: files[0].name,
    //         fileType:files[0].type,
    //         fileSize:files[0].size,
    //       }
    //       vm.$store.dispatch('putFileAttach', filter).then(function () {
    //           vm.loading = true
    //           let data = {
    //             item: vm.rawData[vm.indexFile],
    //             fileTemplateNo: vm.fileUpdate['fileTemplateNo'],
    //             templateName: files[0].name
    //           }
    //           vm.$store.dispatch('updateServiceFileTemplate', data).then(function () {
    //             vm.loadFileTemplate()
    //             vm.loading = false
    //           }).catch(reject => {
    //             vm.loading = false
    //             alert('Tải file xảy ra lỗi.' + reject)
    //           })
    //       }).catch(reject => {
    //         alert('Tải file xảy ra lỗi.' + reject)
    //         alert('Tải file xảy ra lỗi.' + reject)
    //       }) 
    //     }
    //   },
    //   processUpdateDataFileAttach (val, item, index) {
    //     let vm = this
    //     vm.loading = true
    //     let data = {
    //       item: vm.rawData[index],
    //       fileTemplateNo: item['fileTemplateNo'],
    //       templateName: item['templateName']
    //     }
    //     vm.$store.dispatch('updateServiceFileTemplate', data).then(function () {
    //       vm.loading = false
    //     }).catch(reject => {
    //       vm.loading = false
    //       alert('Tải file xảy ra lỗi.' + reject)
    //     })
    //   },
    //   onFileSelect (arr) {
    //     console.log(arr)
    //     let vm = this
    //     if(vm.code === 'opencps_deliverabletype'){
    //       if(vm.pickItem.fileTemplateId !== 1 && vm.pickItem.fileTemplateId !== 0) {
    //         const file = arr.filesData[0].rawFile
    //         let filter = {
    //           fileEntryId: vm.pickItem.fileTemplateId,
    //           file: file,
    //           fileName: file.name,
    //           fileType:file.type,
    //           fileSize:file.size,
    //         }
    //         vm.$store.dispatch('putFileAttach', filter).then(function () {
    //           vm.loadFileTemplate()
    //         }).catch(reject => {
    //           alert('Tải file xảy ra lỗi.' + reject)
    //           alert('Tải file xảy ra lỗi.' + reject)
    //         }) 
    //       } else {
    //         const file = arr.filesData[0].rawFile
    //         let filter = {
    //           deliverableTypeId: vm.pickItem.deliverableTypeId,
    //           file: file,
    //         }
    //         vm.$store.dispatch('postDeliverabletypes', filter).then(function (res) {
    //           vm.pickItem['fileTemplateId'] = res.fileTemplateId
    //           vm.loadFileTemplate()
    //         }).catch(reject => {
    //           alert('Tải file xảy ra lỗi.' + reject)
    //           alert('Tải file xảy ra lỗi.' + reject)
    //         }) 
    //       }  
    //     }
    //   }
    }
  }
</script>
