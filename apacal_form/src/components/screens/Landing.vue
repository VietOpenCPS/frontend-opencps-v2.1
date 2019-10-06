<template>
  <div>
    <v-layout wrap>
      <v-flex xs12 class="form-script" :class="fullScreenScript ? 'sm8' : 'sm4'">
        <v-toolbar class="toolbar-script" flat height="36" dark color="#222">
          <v-btn class="mr-0" icon @click="formatScript(true)" title="Json viewer">
            <v-icon size="16" :class="formatS === '1' ? 'blue--text' : 'white--text'">format_align_right</v-icon>
          </v-btn>
          <v-btn class="ml-0" icon @click="formatScript(false)" title="String viewer">
            <v-icon size="16" :class="formatS === '-1' ? 'blue--text' : 'white--text'">format_align_left</v-icon>
          </v-btn>
          <v-toolbar-title class="white--text">Form script</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn round dark small color="blue" @click="viewForm"
            :loading="loading"
            :disabled="loading"
          >
            <v-icon size="18" class="white--text">description</v-icon> &nbsp; View form
          </v-btn>
          <v-btn round dark small color="green" @click="viewPdf"
            :loading="loading"
            :disabled="loading"
          >
            <v-icon size="16" class="white--text">fa fa-file-pdf-o</v-icon> &nbsp; View pdf
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-toolbar>
        <v-jsoneditor class="content-script" ref="editorScript" v-model="form_script" :options="options" :plus="true" height="100%" @error="onError">
      </v-flex>
      <v-flex xs12 sm4 class="form-data" :class="fullScreenScript ? 'sm4' : 'sm8'">
        <v-toolbar class="toolbar-data" flat height="36" dark color="#222">
          <v-btn class="mr-0" icon @click="formatData(true)" title="Json viewer">
            <v-icon size="16" :class="formatD === '1' ? 'blue--text' : 'white--text'">format_align_right</v-icon>
          </v-btn>
          <v-btn class="ml-0" icon @click="formatData(false)" title="String viewer">
            <v-icon size="16" :class="formatD === '-1' ? 'blue--text' : 'white--text'">format_align_left</v-icon>
          </v-btn>
          <v-toolbar-title class="white--text">Form data</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon v-if="!fullScreenScript" @click="fullScreenScript = !fullScreenScript">
            <v-icon>fullscreen_exit</v-icon>
          </v-btn>
          <v-btn icon v-else @click="fullScreenScript = !fullScreenScript">
            <v-icon>zoom_out_map</v-icon>
          </v-btn>
        </v-toolbar>
        <v-jsoneditor class="content-data" ref="editorData" v-model="form_data" :options="options" :plus="true" height="100%" @error="onError">
        
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <div class="mb-4">
        <v-toolbar class="toolbar-script" flat height="36" dark color="#1867c0">
          <v-toolbar-title class="white--text">
            <span v-if="viewFormInput">Form input</span>
            <span v-else>Form pdf</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn v-if="!viewFormInput" round dark small color="blue" @click="viewForm"
            :loading="loading"
            :disabled="loading"
          >
            <v-icon size="18" class="white--text">description</v-icon> &nbsp; View form
          </v-btn>
          <v-btn v-else round dark small color="green" @click="viewPdf" class="mr-2"
            :loading="loading"
            :disabled="loading"
          >
            <v-icon size="16" class="white--text">fa fa-file-pdf-o</v-icon> &nbsp; View pdf
            <span slot="loader">Loading...</span>
          </v-btn>
          <v-btn flat small color="blue" icon @click="closeDialog">
            <v-icon size="28" class="white--text">clear</v-icon>
          </v-btn>
        </v-toolbar>
        <div v-if="viewFormInput === true" id="formInput"></div>
        <iframe v-else id="pdfPreview" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;" frameborder="0">
        </iframe>
      </div>
    </v-dialog>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import VJsoneditor from 'v-jsoneditor'
import toastr from 'toastr'
import axios from 'axios'
Vue.use(toastr)
Vue.use(VJsoneditor)
export default {
  props: [],
  components: {
    VJsoneditor
  },
  data: () => ({
    loading: false,
    form_script: {
      "hello": "alpaca editor"
    },
    form_data: {
      "hello": "alpaca editor"
    },
    formatS: 0,
    formatD: 0,
    fullScreenScript: true,
    fullScreenData: false,
    dialog: false,
    viewFormInput: true, 
    options: {
      mode: 'code' 
    }
  }),
  computed: {
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      if (typeof(Storage) !== 'undefined') {
        // vm.form_script = localStorage.getItem('formScript') ? localStorage.getItem('formScript') : ''
        // vm.form_data = localStorage.getItem('formData') ? localStorage.getItem('formData') : ''
        // setInterval(() => {
        //   localStorage.setItem('formScript', vm.form_script)
        //   localStorage.setItem('formData', vm.form_data)
        // }, 3000)
      }
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
    }
  },
  methods: {
    formatScript (active) {
      let vm = this
      if (active) {
        vm.formatS = '1'
        console.log('run', vm.$refs.editorScript.editor.getText())
        vm.$refs.editorScript.editor.format()
      } else {
        vm.formatS = '-1'
        vm.$refs.editorScript.editor.compact()
      }
      
    },
    formatData (active) {
      let vm = this
      if (active) {
        vm.formatD = '1'
        vm.$refs.editorData.editor.format()
      } else {
        vm.formatD = '-1'
        vm.$refs.editorData.editor.compact()
      }
    },
    viewForm () {
      let vm = this
      let formScript, formData
      /* eslint-disable */
      try {
        formScript =  eval('(' + vm.$refs.editorScript.editor.getText() + ')')
      } catch (error) {
        formScript = {}
        console.log('formScript emty or error parse')
        return
      }
      formData = {}
      /* eslint-disable */
      try {
        formScript.data = vm.$refs.editorData.editor.get()
        vm.viewFormInput = true
        vm.dialog = true
        setTimeout(function () {
          window.$('#formInput').empty()
          window.$('#formInput').alpaca(formScript)
        }, 200)
      } catch (error) {
        formScript.data = {}
        console.log('formData emty or error parse')
        if (vm.$refs.editorData.editor.getText() === '') {
          vm.viewFormInput = true
          vm.dialog = true
          setTimeout(function () {
            window.$('#formInput').empty()
            window.$('#formInput').alpaca(formScript)
          }, 200)
        }
      }
      
    },
    viewPdf () {
      let vm = this
      let formScript, formData
      if (vm.$refs.editorScript.editor.getText() === '') {
        return
      }
      try {
        formScript = vm.$refs.editorScript.editor.get()
      } catch (error) {
        console.log('formScript error')
        return
      }
      try {
        formData = vm.$refs.editorData.editor.getText() ? vm.$refs.editorData.editor.get() : {}
      } catch (error) {
        if (vm.$refs.editorData.editor.getText()) {
          console.log('formData error')
          return
        }
      }
      vm.loading = true
      let options = {
        headers: {
          groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic dGVzdEBsaWZlcmF5LmNvbTpraG9uZ2JpZXQ=',
        },
        responseType: 'blob'
      }
      let dataCreate = new URLSearchParams()
      dataCreate.append('scriptStr', JSON.stringify(formScript))
      dataCreate.append('jsonDataStr', JSON.stringify(formData))
      axios.post('/o/rest/v2/jaspers/preview', dataCreate, options).then(function (response) {
        vm.loading = false
        vm.dialog = true
        vm.viewFormInput = false
        console.log('respond create pdf', response.data)
        let serializable = response.data
        let file = window.URL.createObjectURL(serializable)
        setTimeout(() => {
          document.getElementById('pdfPreview').src = file
        }, 200);
      }).catch(function (response) {
        vm.loading = false
        vm.dialog = true
        vm.viewFormInput = false
        console.log('respond create pdf 2', response.data)
        let serializable = response.data
        let file = window.URL.createObjectURL(serializable)
        setTimeout(() => {
          document.getElementById('pdfPreview').src = file
        }, 200);
      })
    },
    closeDialog () {
      let vm = this
      try {
        let control = window.$('#formInput').alpaca('get')
        let formData = control.getValue()
        if (formData) {
          vm.form_data = formData
        }
      } catch (error) {
      }
      vm.dialog = false
    },
    onError () {}
  }
}
</script>
