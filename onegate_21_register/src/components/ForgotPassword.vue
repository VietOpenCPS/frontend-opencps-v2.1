<template>
  <div>
    <v-layout wrap class="mt-4" style="max-width:550px;margin: 0 auto">
      <nav class="toolbar theme--dark primary py-2" data-booted="true">
        <div class="toolbar__content" style="justify-content: center">
          <h4>CẤP LẠI MẬT KHẨU</h4>
        </div>
      </nav>
      <v-flex xs12>
        <v-form ref="form" v-model="valid" lazy-validation class="px-3 pt-3" style="border: 1px solid #ddd;border-top:0px;background-color: white;border-radius:2px">
          <v-flex xs12>
            <p>Vui lòng nhập Email hoặc số điện thoại để được cấp lại mật khẩu</p>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              box
              placeholder="Email hoặc số CMND/ Hộ chiếu/ Mã số thuế"
              v-model="confirmCode"
              :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
              required
            ></v-text-field>
          </v-flex>
          <div class="text-xs-center my-2">
            <v-btn color="primary"
              :loading="loading"
              :disabled="loading"
              @click="submitConfirmPASS"
            >
              <v-icon>how_to_reg</v-icon>&nbsp;
              Đồng ý
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
    confirmCode: ''
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
    submitConfirmPASS () {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      let currentParams = vm.$router.history.current.params
      let dataForm = {
        confirmCode: vm.confirmCode
      }
      console.log('dataForm', dataForm)
      if (vm.$refs.form.validate()) {
        vm.loading = true
        let filter = dataForm
        vm.$store.dispatch('confirmForgotPASS', filter).then(function (result) {
          vm.loading = false
          router.push({
            path: '/xac-thuc-cap-lai-mat-khau'
          })
        }).catch(function (reject) {
          vm.loading = false
        })
      }
    }
  }
}
</script>
