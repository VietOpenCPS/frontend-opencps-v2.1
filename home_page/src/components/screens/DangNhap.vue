<template>
  <v-card flat class="pb-3 login_mobile">
    <v-form ref="form" v-model="valid" lazy-validation class="px-3" style="max-width:500px;margin:0 auto">
      <v-layout wrap class="text-xs-center" style="max-width:500px;">
        <v-flex xs12 class="my-4 text-xs-center">
          <h3 class="blue--text">ĐĂNG NHẬP HỆ THỐNG</h3>
        </v-flex>
        <v-flex xs12 class="mb-2">
          <v-text-field
            prepend-inner-icon="person"
            placeholder="Email hoặc số điện thoại"
            v-model="applicantName"
            box
            :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
            required
          ></v-text-field>
        </v-flex>
        <v-flex xs12 class="mb-2">
          <v-text-field
            box
            placeholder="Nhập mật khẩu"
            prepend-inner-icon="lock"
            :append-icon="e1 ? 'visibility' : 'visibility_off'"
            @click:append="() => (e1 = !e1)"
            :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
            :type="e1 ? 'password' : 'text'"
            name="input-10-2"
            v-model="passWord"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>
      <div class="text-xs-center">
        <v-btn color="primary"
          :loading="loading"
          :disabled="loading"
          @click="submitSignIn"
        >
          <v-icon>how_to_reg</v-icon>&nbsp;
          Đăng nhập
        </v-btn>
      </div>
    </v-form>
  </v-card>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
export default {
  props: [],
  components: {},
  data: () => ({
    loading: false,
    loadingAction: false,
    valid: false,
    applicantName: '',
    passWord: '',
    e1: true
  }),
  computed: {
    fullScreen () {
      return this.$store.getters.getFullScreen
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
    })
  },
  watch: {},
  methods: {
    submitSignIn () {
      let vm = this
      let dataForm = {
        applicantName: vm.applicantName,
        password: vm.passWord
      }
      if (vm.$refs.form.validate()) {
        let filter = dataForm
        vm.$store.dispatch('goSignIn', filter).then(function (result) {
        }).catch(function (reject) {
        })
      }
    }
  }
}
</script>
