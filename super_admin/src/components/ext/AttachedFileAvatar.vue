<template>
  <v-layout row wrap>
    <v-flex xs12 class="control-section file-preview">
      <div class="control_wrapper">
        <div id="dropArea" style="height: auto; overflow: auto">
          <span id="dropPreview"> <a href="javascript::" id="browse"><u>Chọn từ máy tính</u></a></span>
          <ejs-uploader id='imagePreview' name="UploadFiles" :allowedExtensions= 'extensions' :asyncSettings= "path" ref="uploadObj" :dropArea= "dropArea" :success= "onSuccess" :removing= "onFileRemove" :uploading= "addHeaders">
          </ejs-uploader>
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
  import {
    detach
  } from '@syncfusion/ej2-base'
  
  Vue.use(UploaderPlugin)
  
  export default {
    data() {
      return {
        loadingRemove: false,
        loading: false,
        fileTemplateData: [],
        fileTemplateTotal: 0,
        path: {
          saveUrl: '',
          removeUrl: ''
        },
        extensions: '.jpg, .png',
        dropArea: "dropArea",
        rawData: [],
        className: ''
      }
    },
    props: ['pickItem', 'pk', 'code'],
    created() {
      var vm = this
      vm.$nextTick(function() {
        vm.loadFileTemplate()
      })
    },
    mounted: function() {
      this.path = {
        saveUrl: this.pickItem['upload_api'] + '/' + this.pk,
        removeUrl: this.pickItem['remove_api'] + '/' + this.pk,
      }
      this.className = this.pickItem['class_name']
      document.getElementById('browse').onclick = function() {
        document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button').click();
        return false;
      }
    },
    methods: {
      addHeaders(args) {
        let vm = this
        args.currentRequest.setRequestHeader('Token', vm.getAuthToken())
        args.currentRequest.setRequestHeader('groupId', vm.getScopeGroupId())
      },
      loadFileTemplate() {
        let vm = this
      },
      onSuccess: function() {
        setTimeout(() => {
          document.getElementById('dropArea').querySelectorAll(".e-upload-success").forEach(e => e.parentNode.removeChild(e))
          this.loadFileTemplate()
        }, 2000)
      },
      onFileRemove: function(args) {
        args.postRawFile = false
      }
    }
  }
</script>
