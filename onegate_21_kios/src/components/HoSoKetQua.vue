<template>
  <div class="px-2 py-0">
    <div>
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="10" />
      </content-placeholders>
      <v-card v-else>
        <div style="background-color: #ffffff" :class="visible ? 'overlayActive': ''">
          <div class="mt-3 pt-2 text-center total-result-search-blue">
            <span>DANH SÁCH HỒ SƠ CÓ KẾT QUẢ &nbsp; ({{dossierItemTotal}})</span>
          </div>
          <div class="dossierList">
            <div class="wrap-list" :style="{ color: activeColor, fontSize: fontSize + 'px' }">
              <v-layout class="wrap" v-for="(item, index) in dossierList" 
              :key="item.dossierId" :class="index%2==1 ? 'active': ''">
                <v-flex class="px-3 py-2" style="width: 250px"><span>{{item.dossierNo}}</span></v-flex>
                <v-flex class="px-3 py-2" style="width: calc(100% - 450px)"><span> {{item.applicantName}}</span></v-flex>
                <v-flex class="px-3 py-2 text-right" style="width: 200px"><span>{{item.dueDate}}</span></v-flex>
              </v-layout>
            </div>
          </div>
        </div>
        <div class="virtual-keyboard" v-if="visible">
          <vue-touch-keyboard v-if="visible" :layout="layout" :cancel="hide" :accept="accept" :input="input" :next="next" :options="options" />
        </div>
      </v-card>
      <v-dialog v-model="dialogCheckPass" content-class="dialog-keyboard" persistent max-width="500px">
        <v-form ref="form" v-model="valid">
          <v-card>
            <v-card-title style="color: #fff;background-color: #0b72ba">
              <span class="headline">Mã bí mật truy cập hồ sơ</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <!-- <v-text-field v-model="passCheck"
                    placeholder="Nhập mã bí mật đã được cấp"
                    :rules="[v => !!v || 'Mã bí mật là bắt buộc']"
                    required
                    data-layout="normal" @focus="show"></v-text-field> -->
                    <div class="input-group input-group--placeholder input-group--text-field primary--text">
                      <div class="input-group__input">
                        <input id="passCheck" data-layout="normal" @focus="show"
                        aria-label="Số hồ sơ" placeholder="Nhập mã bí mật đã được cấp" type="text">
                        <i v-if="visible" @click="clear('passCheck')" aria-hidden="true" class="icon material-icons input-group__append-icon input-group__icon-cb input-group__icon-clearable">clear</i>
                      </div>
                      <div class="input-group__details">
                        <div v-if="!validPass" class="input-group__messages" style="color:red">* Mã bí mật là bắt buộc</div>
                      </div>
                    </div>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat="flat" @click.native="submitViewDetail"
                :loading="loading"
                :disabled="loading"
              >
                <v-icon>save</v-icon>&nbsp;
                Truy cập hồ sơ
                <span slot="loader">Loading...</span>
              </v-btn>
              <v-btn color="red darken-3" flat="flat" @click.native="dialogCheckPass = false"
                :loading="loading"
                :disabled="loading"
                @click="clearDialog"
              >
                <v-icon>undo</v-icon>&nbsp;
                Thoát
                <span slot="loader">Loading...</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <v-dialog v-model="dialogError" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Bạn không có quyền truy cập hồ sơ 
            <span>{{dossierDetail.dossierNo}}</span>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click.native="dialogError = false">Đồng ý</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import $ from 'jquery'
export default {
  props: [],
  components: {},
  data: () => ({
    loading: false,
    loadingAction: false,
    dossierList: [],
    dossierItemTotal: 0,
    validateTracuu: false,
    dialogCheckPass: false,
    dialogError: false,
    dossierDetail: '',
    valid: false,
    validPass: true,
    passCheck: '',
    //
    visible: false,
    layout: 'normal',
    input: null,
    options: {
      useKbEvents: false
    }
  }),
  computed: {},
  created () {
    let vm = this
    vm.$nextTick(function () {
      vm.doLoadingDataHoSo()
    })
  },
  watch: {},
  methods: {
    doLoadingDataHoSo () {
      let vm = this
      vm.dossierList = []
      vm.loading = true
      var filter = null
      filter = {}
      vm.$store.dispatch('loadingDataHoSoKQ', filter).then(function (result) {
        vm.loading = false
        vm.dossierList = result.data
        vm.dossierItemTotal = result.total
      }).catch(reject => {
        vm.loading = false
        vm.dossierList = []
        vm.dossierItemTotal = 0
      })
    },
    viewDetail (item) {
      var vm = this
      vm.dossierDetail = item
      vm.dialogCheckPass = true
      // router.push('/tra-cuu-ho-so/' + item.dossierId)
    },
    submitViewDetail () {
      var vm = this
      if ($('#passCheck').val() !== '') {
        vm.validPass = true
        vm.loading = true
        let filter = {
          // password: vm.passCheck ? vm.passCheck : '',
          password: $('#passCheck').val(),
          dossierId: vm.dossierDetail.dossierId
        }
        vm.$store.dispatch('getDossierDetailPass', filter).then(function (result) {
          vm.loading = false
          vm.dialogCheckPass = false
          vm.clearDialog()
          if (result.status && result.status.toString() === '203') {
            vm.dialogError = true
          } else if (result.status && result.status.toString() === '200') {
            router.push('/ho-so/' + vm.dossierDetail.dossierId)
          }
        }).catch(function (reject) {
          vm.loading = false
          console.log('reject', reject)
        })
      } else {
        vm.validPass = false
      }
    },
    clearDialog () {
      $('#passCheck').val('')
      this.validPass = true
      this.visible = false
    },
    //
    clear (id) {
      $(`#${id}`).val('')
    },
    accept (text) {
      this.hide()
    },
    show (e) {
      this.validPass = true
      this.input = e.target
      if (!this.visible) {
        this.visible = true
      }
      this.bindClick()
    },
    hide () {
      this.visible = false
    },
    next () {
      let inputs = document.querySelectorAll('input')
      let found = false
      let arr1 = []
      arr1.forEach.call(inputs, (item, i) => {
        if (!found && item === this.input && i < inputs.length - 1) {
          found = true
          this.$nextTick(() => {
            inputs[i + 1].focus()
          })
        }
      })
      if (!found) {
        this.input.blur()
        this.hide()
      }
    },
    bindClick () {
      var vm = this
      setTimeout(function () {
        $('.keyboard .line:nth-child(3) .key:last-child').unbind('click')
        $('.keyboard .line:nth-child(3) .key:last-child').bind('click', function () {
          vm.submitViewDetail()
        })
      }, 300)
    }
  }
}
</script>
