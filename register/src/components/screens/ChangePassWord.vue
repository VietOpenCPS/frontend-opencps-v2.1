<template>
  <div>
    <v-layout wrap class="mt-4" style="max-width:550px;margin: 0 auto">
      <nav class="v-toolbar elevation-0 theme--dark primary" data-booted="true" style="justify-content: center">
        <div class="v-toolbar__content" style="height: 40px;justify-content: center;">
          <span class="text-bold">CẬP NHẬT MẬT KHẨU</span>
        </div>
      </nav>
      <v-flex xs12>
        <v-form ref="form" v-model="valid" lazy-validation class="px-3 pt-3" style="border: 1px solid #ddd;border-top:0px;background-color: white;border-radius:2px">
          <v-flex xs12>
            <v-text-field
              box
              placeholder="Mật khẩu hiện tại"
              v-model="oldPassWord"
              :rules="[v => !!v || 'Mật khẩu hiện tại là bắt buộc']"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              box
              placeholder="Mật khẩu mới"
              v-model="newPassWord"
              :rules="[v => !!v || 'Mật khẩu mới là bắt buộc']"
              required
            ></v-text-field>
          </v-flex>

          <div class="text-xs-center my-2">
            <v-btn color="primary"
              :loading="loading"
              :disabled="loading"
              @click="submitChangePass"
            >
              <v-icon>how_to_reg</v-icon>&nbsp;
              Đồng ý
            </v-btn>
            <!-- <v-btn color="primary"
              @click="goBack"
            >
              <v-icon>reply</v-icon>&nbsp;
              Quay lại
            </v-btn> -->
            
          </div>
        </v-form>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import support from '../../store/support.json'
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  props: [],
  components: {
  },
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
      $('#app_login').css('display', 'none !important')
      $('#navigation').css('display', 'none')
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
    submitChangePass () {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      let currentParams = vm.$router.history.current.params
      if (vm.$refs.form.validate()) {
        vm.loading = true
        let filter = {
          oldPassword: vm.oldPassWord,
          newPassword: vm.newPassWord
        }
        vm.$store.dispatch('changePass', filter).then(function (result) {
          vm.loading = false
          toastr.success("Cập nhật mật khẩu thành công")
          let urlDvc = window.themeDisplay.getSiteAdminURL().split('/~/')[0].replace('group','web')
          window.location.href = urlDvc + '/dich-vu-cong'
        }).catch(function (reject) {
          vm.loading = false
          toastr.error("Cập nhật thất bại. Vui lòng thực hiện lại")
        })
      }
    },
    goBack () {
      window.history.back()
    }
  }
}
</script>
