<template>
  <div>
    <v-form v-model="valid_thongtincongvan" ref="formThongTinCongVan" lazy-validation>
      <div>
        <div style="position: relative;">
          <v-expansion-panel :value="[true]" expand  class="expansion-pl">
            <v-expansion-panel-content>
              <div slot="header"> <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div> Thông tin công văn</div>
              <v-card>
                <v-card-text class="pt-3">
                  <v-layout wrap>
                    <!--  -->
                    <v-flex xs12 sm2 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Số công văn <span style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-text-field
                      v-else
                      v-model="thongTinCongVan.documentNo"
                      :rules="[rules.required]"
                      required
                      ></v-text-field>
                    </v-flex>
                    <!--  -->
                    <v-flex xs12 sm2 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Ngày công văn <span  style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-menu
                        ref="menuDate"
                        :close-on-content-click="false"
                        v-model="menuDate"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                      >
                        <v-text-field
                          :rules="[rules.required]"
                          required
                          slot="activator"
                          v-model="dateFormated"
                          append-icon="event"
                          readonly
                          @blur="documentDate = parseDate(dateFormated)"
                        >
                        </v-text-field>
                        <v-date-picker :min="getMindate()" ref="picker" locale="vi"
                        :first-day-of-week="1" v-model="documentDate" no-title @input="menuDate = false"></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <!--  -->
                    <v-flex xs12 sm2 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Đơn vị gửi công văn<span style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-autocomplete
                      v-else
                      :items="govAgencySubmitList"
                      item-text="govAgencyName"
                      item-value="govAgencyCode"
                      v-model="agencySubmit"
                      :rules="[rules.required]"
                      required
                      ></v-autocomplete>
                    </v-flex>
                    <!--  -->
                    <v-flex xs12 sm2 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Ngày hẹn trả lời<span  style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-menu
                        ref="menuDueDate"
                        :close-on-content-click="false"
                        v-model="menuDueDate"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                      >
                        <v-text-field
                          :rules="[rules.required]"
                          required
                          slot="activator"
                          v-model="duedateFormated"
                          append-icon="event"
                          readonly
                          @blur="dueDate = parseDate(duedateFormated)"
                        >
                        </v-text-field>
                        <v-date-picker :min="getMindate()" ref="picker" locale="vi"
                        :first-day-of-week="1" v-model="dueDate" no-title @input="menuDueDate = false"></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <!--  -->
                    <v-flex xs12 sm2 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Nội dung tóm tắt <span style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm10 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-textarea
                      v-else
                      v-model="thongTinCongVan.briefNote"
                      rows="3"
                      :rules="[rules.required]"
                      required
                      ></v-textarea>
                    </v-flex>
                    <!--  -->
                    <v-flex xs12 sm2 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Số lượng hồ sơ đề nghị xét<span style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm10 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-text-field
                      v-else
                      v-model="thongTinCongVan.sampleCount"
                      :rules="[rules.required]"
                      required
                      ></v-text-field>
                    </v-flex>
                    <!--  -->
                    <v-flex xs12 sm2 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Số điện thoại : </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-text-field
                      v-else
                      v-model="thongTinCongVan.contactTelNo"
                      append-icon="phone"
                      :rules="thongTinCongVan.contactEmail ? [rules.telNo] : ''"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Địa chỉ email : </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-text-field
                      v-else
                      v-model="thongTinCongVan.contactEmail"
                      :rules="thongTinCongVan.contactEmail ? [rules.email] : ''"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </div>
      </div>
    </v-form>
  </div>
</template>

<script>
import axios from 'axios'
import Suggestions from 'v-suggestions'
import toastr from 'toastr'
import TinyPagination from '../../components/pagging/opencps_pagination'
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  components: {
    'suggestions': Suggestions,
    'tiny-pagination': TinyPagination
  },
  props: ['formCode'],
  data: () => ({
    loading: false,
    valid_thongtincongvan: true,
    thongTinCongVan: '',
    documentNo: '',
    menuDate: false,
    menuDueDate: false,
    documentDate: null,
    dateFormated: null,
    dueDate: null,
    duedateFormated: null,
    agencySubmit: '',
    govAgencySubmitList: '',
    briefNote: '',
    sampleCount: '',
    contactTelNo: '',
    contactEmail: '',
    rules: {
      required: (value) => !!value || 'Thông tin bắt buộc',
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Địa chỉ Email không hợp lệ'
      },
      passWord: (value) => {
        const pattern = /^(?![0-9]{6,})[0-9a-zA-Z]{6,}$/
        return pattern.test(value) || 'Gồm các ký tự 0-9, a-z và ít nhất 6 ký tự'
      },
      telNo: (value) => {
        const pattern = /^([0-9]{0,})$/
        return pattern.test(value) || 'Gồm các ký tự 0-9'
      }
    }
  }),
  computed: {
    originality () {
      var vm = this
      console.log('originality', vm.getOriginality())
      return vm.getOriginality()
    }
  },
  created () {
    let vm = this
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
    },
    documentDate (val) {
      this.dateFormated = this.formatDate(this.documentDate)
    },
    dueDate (val) {
      this.duedateFormated = this.formatDate(this.dueDate)
    }
    // thongTinCongVan: {
    //   handler: function (value) {
    //     let vm = this
    //     vm.dateFormated = vm.formatDate(value.documentDate)
    //     vm.duedateFormated = vm.formatDate(value.dueDate)
    //   },
    //   deep: true
    // }
  },
  methods: {
    initData (data) {
      let vm = this
      vm.thongTinCongVan = data
      vm.documentDate = vm.thongTinCongVan.hasOwnProperty('documentDate') ? vm.parseDate(vm.thongTinCongVan.documentDate) : ''
      vm.dueDate = vm.thongTinCongVan.hasOwnProperty('dueDate') ? vm.parseDate(vm.thongTinCongVan.dueDate) : ''
      vm.$refs.formThongTinCongVan.resetValidation()
      console.log('thongtincongvanInput', vm.thongTinCongVan)
    },
    getThongTinCongVan () {
      let vm = this
      vm.thongTinCongVan.dueDate = vm.parseDateToTimestamp(vm.dueDate)
      vm.thongTinCongVan.documentDate = vm.parseDateToTimestamp(vm.documentDate)
      console.log('thongtincongvanOutput', vm.thongTinCongVan)
      return vm.thongTinCongVan
    },
    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    parseDate (date) {
      if (!date) return null
      let dateF = date.split(' ')[0]
      const [day, month, year] = dateF.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    getCurrentDate: function () {
      let date = new Date()
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
    },
    getMindate () {
      let date = new Date()
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
    },
    parseDateToTimestamp (date) {
      if (!date) {
        return null
      }
      // let [day, month, year] = `${date}`.split('/')
      // let day2 = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      if (new Date(date) == 'Invalid Date') {
        return ''
      } else {
        return (new Date(date)).getTime()
      }
    },
  }
}
</script>
