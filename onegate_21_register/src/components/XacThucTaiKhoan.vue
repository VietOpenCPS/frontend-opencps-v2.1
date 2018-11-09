<template>
  <div>
    <v-layout class="mt-4" wrap style="max-width:550px;margin: 0 auto">
      <nav class="toolbar theme--dark primary py-2" data-booted="true">
        <div class="toolbar__content"  style="justify-content: center">
          <h4>XÁC THỰC TÀI KHOẢN</h4>
        </div>
      </nav>
      <v-flex xs12>
        <v-form ref="form" v-model="valid" lazy-validation class="px-3 pt-3" style="border: 1px solid #ddd;border-top:0px;background-color: white;border-radius:2px">
          <v-flex xs12>
            <p>Vui lòng nhập mã PIN đã được gửi về email của bạn</p>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              box
              placeholder="Nhập mã pin"
              v-model="pinCode"
              :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
              required
            ></v-text-field>
          </v-flex>
          <div class="text-xs-center my-2">
            <v-btn color="primary"
              :loading="loading"
              :disabled="loading"
              @click="submitConfirmPIN"
            >
              <v-icon>how_to_reg</v-icon>&nbsp;
              Xác thực
            </v-btn>
          </div>
        </v-form>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import $ from 'jquery'
import support from '../store/support.json'
export default {
  props: [],
  components: {},
  data: () => ({
    loading: false,
    valid: false,
    pinCode: ''
  }),
  computed: {
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      var vm = this
      let current = vm.$router.history.current
      let currentQuery = current.query
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  watch: {
  },
  methods: {
    submitConfirmPIN () {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      let currentParams = vm.$router.history.current.params
      let dataForm = {
        userId: currentQuery.hasOwnProperty('active_user_id') ? currentQuery.active_user_id : '',
        pinCode: vm.pinCode
      }
      console.log('dataForm', dataForm)
      if (vm.$refs.form.validate() && dataForm.userId) {
        vm.loading = true
        let filter = dataForm
        vm.$store.dispatch('confirmPIN', filter).then(function (result) {
          vm.loading = false
          setTimeout(function () {
            $('input[name=_npmreactlogin_login]').val(result.email)
            $('input[name=_npmreactlogin_password]').val(result.token)
            $('.action-btn-login-input button.btn-login').click()
            // $('form[name=login_form] #input_action').val('confirm_account')
            // $('form[name=login_form]').submit()
          }, 2000)
        }).catch(function (reject) {
          vm.loading = false
        })
      }
    }
  }
}
</script>
