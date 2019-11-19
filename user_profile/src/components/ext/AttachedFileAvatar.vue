<template>
  <v-layout row wrap>
    <v-flex xs12 class="control-section file-preview py-0">
      <div class="control_wrapper">
        <div id="dropArea" :style="'background-image: url(' + avatarData + ');'" style="height: 250px;overflow: auto;position: relative;border: 1px dashed #949494;text-align: center;padding: 15px;background-size: cover;">
          <span id="dropPreview" style="position: absolute;left: 0;top: 0;height: 100%;width: 100%;"> 
            <a href="javascript:;" id="browseAvata">
              <i v-if="type === 'image'" aria-hidden="true" class="v-icon material-icons" style="font-size: 54px;opacity: .2;position: absolute;top: 0;right: 0;">camera_alt</i>
              <i v-else aria-hidden="true" class="v-icon material-icons" style="font-size: 54px;opacity: .2;position: absolute;top: 0;right: 0;">insert_drive_file</i>
            </a>
          </span>
          <ejs-uploader id='imagePreview' name="UploadFiles" :allowedExtensions= "type === 'image' ? extensions : extensionsDocument" :asyncSettings= "path" ref="uploadObj" :dropArea= "dropArea"
           :success= "onSuccess" :removing= "onFileRemove" :uploading= "addHeaders">
          </ejs-uploader>
          <svg v-if="noAvatar && type === 'image'" style="width: 100px;margin: 0 auto;margin-top: 45px;enable-background:new 0 0 563.43 563.43;"
            version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
              viewBox="0 0 563.43 563.43" xml:space="preserve">
            <path d="M280.79,314.559c83.266,0,150.803-67.538,150.803-150.803S364.055,13.415,280.79,13.415S129.987,80.953,129.987,163.756
              S197.524,314.559,280.79,314.559z M280.79,52.735c61.061,0,111.021,49.959,111.021,111.021S341.851,274.776,280.79,274.776
              s-111.021-49.959-111.021-111.021S219.728,52.735,280.79,52.735z"/>
            <path d="M19.891,550.015h523.648c11.102,0,19.891-8.789,19.891-19.891c0-104.082-84.653-189.198-189.198-189.198H189.198
              C85.116,340.926,0,425.579,0,530.124C0,541.226,8.789,550.015,19.891,550.015z M189.198,380.708h185.034
              c75.864,0,138.313,56.436,148.028,129.524H41.17C50.884,437.607,113.334,380.708,189.198,380.708z"/>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
          </svg>
          <img v-if="!noAvatar && type === 'document'" src="https://img.icons8.com/color/100/000000/new-resume-template.png" style="width: 100px;margin: 0 auto;margin-top: 45px;enable-background:new 0 0 563.43 563.43;">
          <img v-if="noAvatar && type === 'document'" src="https://img.icons8.com/ios/100/000000/new-resume-template.png" style="width: 100px;margin: 0 auto;margin-top: 45px;enable-background:new 0 0 563.43 563.43;">
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
  import Vue from 'vue'
  import {
    UploaderPlugin
  } from '@syncfusion/ej2-vue-inputs'

  Vue.use(UploaderPlugin)
  
  export default {
    data() {
      return {
        noAvatar: true,
        avatarData: '',
        loadingRemove: false,
        loading: false,
        fileTemplateData: [],
        fileTemplateTotal: 0,
        path: {
          saveUrl: '',
          removeUrl: ''
        },
        extensions: '.jpg, .png',
        extensionsDocument: '.cer',
        dropArea: "dropArea",
        rawData: [],
        className: ''
      }
    },
    props: ['type', 'pickItem', 'pk', 'code'],
    created() {
      var vm = this
      vm.$nextTick(function() {
        if (this.pk) {
          this.className = this.pickItem['class_name']
          this.loadImageComponent()
        }
      })
    },
    mounted: function() {
      console.log('this.pk', this.pk)
      this.path = {
        saveUrl: this.pickItem['upload_api'] + '/' + this.pk,
        removeUrl: this.pickItem['remove_api'] + '/' + this.pk,
      }
      this.className = this.pickItem['class_name']
      document.getElementById('browseAvata').onclick = function() {
        document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button').click();
        return false;
      }
    },
    watch: {
      pk (val) {
        this.path = {
          saveUrl: this.pickItem['upload_api'] + '/' + this.pk,
          removeUrl: this.pickItem['remove_api'] + '/' + this.pk,
        }
        this.className = this.pickItem['class_name']
        this.loadImageComponent()
      }
    },
    methods: {
      addHeaders(args) {
        let vm = this
        args.currentRequest.setRequestHeader('Token', vm.getAuthToken())
        args.currentRequest.setRequestHeader('groupId', vm.getScopeGroupId())
      },
      loadImageComponent() {
        let vm = this
        console.log('vm.pk', vm.pk)
        let filter = {
          pk: vm.pk,
          className: vm.className
        }
        vm.noAvatar = true
        vm.avatarData = ''
        vm.$store.dispatch('getImageComponent', filter).then(function (data) {
          if (data !== '' && data !== null) {
            vm.noAvatar = false
            let portalURL = ''
            if (window.themeDisplay !== null && window.themeDisplay !== undefined) {
              portalURL = window.themeDisplay.getPortalURL()
            }
            vm.avatarData = portalURL + data
          }
        })
      },
      onSuccess: function() {
        let vm = this
        setTimeout(() => {
          document.getElementById('dropArea').querySelectorAll(".e-upload-success").forEach(e => e.parentNode.removeChild(e))
          vm.loadImageComponent()
        }, 2000)
      },
      onFileRemove: function(args) {
        args.postRawFile = false
      }
    }
  }
</script>
