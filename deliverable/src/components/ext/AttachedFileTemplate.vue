<template>
  <v-layout row wrap class="mb-5">
    <v-flex xs12 sm5 class="control-section uploader customdroparea">
      <div class="control_wrapper px-3 mx-1 py-3">
        <div class="sample_wrapper tai_giay_to">
            <div id="dropArea">
                <span id="drop" class="droparea"> Tải giấy phép, <a href="javascript:;" id="browse">Chọn từ máy tính &nbsp; 📤</a></span>
                <ejs-uploader id='templateupload' name="UploadFiles" :allowedExtensions= 'extensions' :asyncSettings= "path" ref="uploadObj" :dropArea= "dropArea" :success= "onSuccess" :removing= "onFileRemove" :uploading= "addHeaders">
                </ejs-uploader>
            </div>
        </div>
      </div>
    </v-flex>
    <v-flex xs12 sm7 class="tai_giay_to">
      <div class="my-3 mx-3 text-center">Giấy tờ đã tải lên</div>
      <div class="e-upload-done-list" v-if="fileTemplateTotal > 0">
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
                  margin-top: 10px;
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
                  top: 0;
                ">
                <v-icon size="14">link</v-icon>
              </v-btn>
              <v-btn flat icon color="red darken-3" 
                v-on:click.native="processDeleteFileAttach(item)"
                :loading="loadingRemove"
                :disabled="loadingRemove"
                style="
                  position: absolute;
                  right: 5px;
                  margin-top: -10px;
                ">
                <v-icon size="14">delete</v-icon>
              </v-btn>
              </span>
            </div>
          </li>
        </ul>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
  import Vue from 'vue'
  import { UploaderPlugin } from '@syncfusion/ej2-vue-inputs'
  import { detach } from '@syncfusion/ej2-base'

  Vue.use(UploaderPlugin)

  export default {
    data () {
      return {
        loadingRemove: false,
        loading: false,
        fileTemplateData: [],
        fileTemplateTotal: 0,
        path:  {
          saveUrl: '',
          removeUrl: ''
        },
        extensions: '.pdf',
        dropArea: "dropArea",
        rawData: [],
        className: ''
      }
    },
    props: ['pk'],
    created() {
      var vm = this
      vm.$nextTick(function() {
        vm.loadFileTemplate()
      })
    },
    mounted: function () {
      this.path = {
        saveUrl: '/o/v1/opencps/users/upload/opencps_deliverable/org.opencps.deliverable.model.OpenCPSDeliverableFileEntryId' + '/' + this.pk,
        removeUrl: '/' + this.pk,
      }
      this.className = 'org.opencps.deliverable.model.OpenCPSDeliverableFileEntryId'
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
      processDeleteFileAttach (item) {
        let vm = this
        item['className'] = vm.className
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
        item['className'] = vm.className
        vm.$store.dispatch('downloadServiceFileTemplate', item).then(function () {
          vm.loading = false
        }).catch(reject => {
          vm.loading = false
          alert('Tải file xảy ra lỗi.' + reject)
        })
      }
    }
  }
</script>
