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
    <v-breadcrumbs>
      <v-icon slot="divider">chevron_right</v-icon>

      <v-breadcrumbs-item
        v-for="item in breadCrumbsitems2"
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
            :loading="importExcelLoading"
            :disabled="importExcelLoading"
            color="blue darken-3"
            dark
            class="mx-0"
            @click.native="doImportExcelData()"
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
          ref="importExcelData"
          name="importExcelData"
          
          @change="onFileExcelPicked"
          v-show="false"
        >
      </div>
    </v-card>
    <v-breadcrumbs>
      <v-icon slot="divider">chevron_right</v-icon>

      <v-breadcrumbs-item
        v-for="item in breadCrumbsitems3"
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
            :loading="importPhongBanLoading"
            :disabled="importPhongBanLoading"
            color="blue darken-3"
            dark
            class="mx-0"
            @click.native="doImportPhongBanExcelData()"
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
          ref="importPhongBanData"
          name="importPhongBanData"
          
          @change="onFilePhongBanPicked"
          v-show="false"
        >
      </div>
    </v-card>
    <v-snackbar
      v-model="snackbarsuccess"
      :bottom="false"
      :left="false"
      :multi-line="false"
      :right="true"
      :timeout="2000"
      :top="true"
      :vertical="false"
      color="success"
    >
      Yêu cầu thực hiện thành công
      <v-btn
        icon
        @click="snackbarsuccess = false"
      >
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="snackbarerror"
      :bottom="false"
      :left="false"
      :multi-line="false"
      :right="true"
      :timeout="2000"
      :top="true"
      :vertical="false"
      color="#EF5350"
    >
      Yêu cầu thực hiện thất bại
      <v-btn
        icon
        @click="snackbarerror = false"
      >
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import axios from 'axios'
  
  export default {
    props: ['tableName'],
    data () {
      return {
        snackbarerror: false,
        snackbarsuccess: false,
        responseXMLSuccess: '',
        importMessage: false,
        importLoading: false,
        importExcelLoading: false,
        importPhongBanLoading: false,
        showFilter: false,
        accept: 'text/xml,application/zip',
        breadCrumbsitems: [
          {
            text: 'Import',
            disabled: false
          },
          {
            text: 'XML/ZIP/EXCEL',
            disabled: false
          }
        ],
        breadCrumbsitems2: [
            {
              text: 'Import',
              disabled: false
            },
            {
              text: 'Người dùng',
              disabled: false
            }
        ],
        breadCrumbsitems3: [
            {
              text: 'Import',
              disabled: false
            },
            {
              text: 'Phòng ban',
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
      doImportExcelData () {
        this.importExcelLoading = true
        this.importMessage = false
        this.$refs.importExcelData.click()
      },
      doImportPhongBanExcelData () {
        this.importPhongBanLoading = true
        this.importMessage = false
        this.$refs.importPhongBanData.click()  
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
      },
      onFileExcelPicked(event) {
        let vm = this
        const files = event.target.files || event.dataTransfer.files
        if (files && files[0]) {
          var bodyFormData = new FormData()
          bodyFormData.append('file', files[0])
          axios({
            method: 'post',
            url: '/o/rest/v2/dossiers/import/excel',
            data: bodyFormData,
            config: { headers: {'Content-Type': 'multipart/form-data' }}
          })
          .then(function (response) {
            //handle success
            console.log(response)
            vm.snackbarsuccess = true
            vm.importExcelLoading = false
        
          })
          .catch(function (response) {
            //handle error
            console.log(response)
            vm.importExcelLoading = false
            vm.snackbarerror =  true
          })
        }
      },
      onFilePhongBanPicked(event) {
        let vm = this
        const files = event.target.files || event.dataTransfer.files
        if (files && files[0]) {
          var bodyFormData = new FormData()
          bodyFormData.append('file', files[0])
          axios({
            method: 'post',
            url: '/o/rest/v2/workingunits/import/files',
            data: bodyFormData,
            config: { headers: {'Content-Type': 'multipart/form-data' }}
          })
          .then(function (response) {
            //handle success
            console.log(response)
            vm.snackbarsuccess = true
            vm.importPhongBanLoading = false
        
          })
          .catch(function (response) {
            //handle error
            console.log(response)
            vm.importPhongBanLoading = false
            vm.snackbarerror =  true
          })
        }
      },
    }
  }
</script>
