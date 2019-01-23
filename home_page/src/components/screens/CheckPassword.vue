<template>
  <v-flex xs12 sm6 class="px-2 text-xs-center" style="margin:70px auto">
    <div>
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field
            label="Nhập mã tra cứu"
            v-model="passCheck"
            box
            @keyup.enter="submitPass"
            append-icon="search"
            @click:append="submitPass"
            :rules="[v => !!v || 'Yêu cầu nhập mã tra cứu']"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>
      <div class="text-center text-bold mt-3" style="color:#065694">
        <p class="mb-1">Mã tra cứu là dãy số gồm 4 ký tự được in trên</p>
        <p> GIẤY TIẾP NHẬN HỒ SƠ VÀ HẸN TRẢ KẾT QUẢ</p>
      </div>
    </div>
    <v-dialog v-model="dialogError" persistent max-width="290">
      <v-card>
        <v-card-title>Bạn không có quyền truy cập hồ sơ 
          <span>{{dossierDetail.dossierNo}}</span>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="dialogError = false">Đồng ý</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- <v-btn class="back-btn" @click="goBack" fab color="primary">
      <v-icon dark>arrow_back</v-icon>
    </v-btn> -->
  </v-flex>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
Vue.use(toastr)
export default {
  props: [],
  components: {},
  data: () => ({
    loading: false,
    loadingAction: false,
    dialogError: false,
    valid: false,
    passCheck: '',
    validPass: true,
    targetCheckPass: ''
  }),
  computed: {
    filterDossierKey () {
      return this.$store.getters.getFilterDossierKey
    },
    dossierDetail () {
      return this.$store.getters.getDetailDossier
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      vm.passCheck = ''
      let current = vm.$router.history.current
      let newQuery = current.query
      vm.targetCheckPass = newQuery['target']
    })
  },
  watch: {},
  methods: {
    submitPass () {
      var vm = this
      if (vm.passCheck !== '') {
        vm.validPass = true
        let current = vm.$router.history.current
        let newQuery = current.query
        console.log('newQuery', newQuery)
        let filter = {
          password: vm.passCheck,
          dossierId: newQuery.hasOwnProperty('id') ? newQuery.id : ''
        }
        if (filter.dossierId) {
          vm.$store.dispatch('getDossierDetailPass', filter).then(function (result) {
            vm.loading = false
            vm.clearDialog()
            if (result.status && result.status.toString() === '200') {
              vm.$store.commit('setDossierNoSearch', result.data.dossierNo)
              vm.$store.commit('setDossierDetail', result.data)
              vm.$router.push({
                path: '/thong-tin-ho-so/' + filter.dossierId
              })
            } else {
              // vm.dialogError = true
              toastr.error('Mã tra cứu không chính xác. Vui lòng thử lại.')
            }
          }).catch(function (reject) {
            vm.loading = false
            // vm.dialogError = true
            toastr.error('Lỗi hệ thống.')
            console.log('reject', reject)
          })
        }
      }
    },
    clearDialog () {
      $('#passCheck').val('')
      this.validPass = true
    },
    clear (id) {
      $(`#${id}`).val('')
    },
    goBack () {
      window.history.back()
    }
  }
}
</script>
