<template>
  <div>
    <bbat-table :table-name="tableName" @cloneProcess="cloneProcessEmitted"></bbat-table>
    <v-dialog v-model="dialog_cloneServiceProcess" scrollable persistent max-width="700px">
      <v-card>
        <v-card-title class="headline pb-2">
          <span>Sao chép quy trình: {{oldProcessName}}</span>
        </v-card-title>
        <v-card-text class="pt-0">
          <v-form ref="formCloneServiceProcess" v-model="validForm" lazy-validation>
            <v-layout wrap class="py-1 align-center row-list-style">
              <v-flex xs12>
                <v-text-field
                  label="Tên quy trình"
                  box
                  v-model="processName"
                  :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                  :required="true"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions class="px-3">
          <v-spacer></v-spacer>
          <v-btn color="blue darken-3" dark
            :loading="loading"
            :disabled="loading"
            @click="cloneServiceProcess"
          >
            <v-icon>save</v-icon>&nbsp;
            Sao chép
          </v-btn>
          <v-btn color="red darken-3" class="mr-0" dark v-on:click="dialog_cloneServiceProcess = false">
            <v-icon>clear</v-icon>&nbsp;
            Hủy
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import { BbatTable } from '@/components'

  export default {
    props: ['tableName'],
    components: {
      BbatTable
    },
    data () {
      return {
        loading: false,
        dialog_cloneServiceProcess: false,
        validForm: false,
        processName: '',
        oldProcessName: ''
      }
    },
    methods: {
      cloneProcessEmitted (id, processNo, processName) {
        this.serviceProcessId = id
        this.processNo = processNo
        this.oldProcessName = processName
        this.dialog_cloneServiceProcess = true
      },
      cloneServiceProcess () {
        let vm = this
        if (vm.$refs.formCloneServiceProcess.validate()) {
          vm.loading = true
          let dataPost = new URLSearchParams()
          dataPost.append('processNo', vm.processNo)
          dataPost.append('processName', vm.processName)
          axios.post('/o/rest/v2/serviceprocesses/' + vm.serviceProcessId + '/clone',
            dataPost, {})
          .then(function (response) {
            vm.loading = false
            vm.dialog_cloneServiceProcess = false
            vm.$refs.formCloneServiceProcess.reset()
          }).catch(function (error) {
            vm.loading = false
          })
        }
      }
    }
  }
</script>
