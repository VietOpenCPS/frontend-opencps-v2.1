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

    </v-breadcrumbs>

    <v-card class="px-2 mx-1" style="overflow: hidden;">
      <v-toolbar color="blue darken-3" dark height="48">
        <v-toolbar-title class="ml-2">
          <v-btn
            :loading="importLoading"
            :disabled="importLoading"
            color="blue darken-3"
            dark
            class="mx-0"
            @click.native="doImportData()"
          >
            Upload
            <v-icon right dark>cloud_upload</v-icon>
          </v-btn>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon dark>more_vert</v-icon>
        <v-btn dark icon>
          <v-icon>refresh</v-icon>
        </v-btn>
      </v-toolbar>
      <div style="overflow: hidden;overflow-x: auto;">
        <input
          type="file"
          ref="importData"
          name="importData"
          :accept="accept"
          @change="onFilePicked"
          v-show="false"
        >
        <v-alert
          :value="true"
          v-if="importMessage"
          color="success"
          icon="check_circle"
          outline
        >
          Gửi yêu cầu Import dữ liệu thành công.
        </v-alert>
        <v-alert
          :value="true"
          v-if="importMessage"
          color="success"
          outline
        >
          {{responseXMLSuccess}}
        </v-alert>
      </div>
    </v-card>
  </div>
</template>

<script>
  import axios from 'axios'
  
  export default {
    props: ['tableName'],
    data () {
      return {
        responseXMLSuccess: '',
        importMessage: false,
        importLoading: false,
        showFilter: false,
        accept: 'text/xml,application/zip',
        breadCrumbsitems: [
          {
            text: 'Import',
            disabled: false
          },
          {
            text: 'XML/ZIP',
            disabled: false
          }
        ]
      }
    },
    methods: {
      doImportData () {
        this.importLoading = true
        this.importMessage = false
        this.$refs.importData.click()
      },
      onFilePicked(event) {
        let vm = this
        const files = event.target.files || event.dataTransfer.files
        if (files && files[0]) {
          var bodyFormData = new FormData()
          bodyFormData.append('file', files[0])
          axios({
            method: 'post',
            url: '/o/rest/v2/dossiers/import/files',
            data: bodyFormData,
            config: { headers: {'Content-Type': 'multipart/form-data' }}
          })
          .then(function (response) {
            //handle success
            console.log(response)
            vm.responseXMLSuccess = response.data
            vm.importLoading = false
            vm.importMessage = true
          })
          .catch(function (response) {
            //handle error
            console.log(response)
            vm.importLoading = false
            vm.importMessage = false
          })
        }
      }
    }
  }
</script>
