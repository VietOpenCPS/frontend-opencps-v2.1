<template>
  <div>
    <v-expansion-panel expand class="expansion-p0">
      <v-expansion-panel-content :value="true">
        <div slot="header">
          <div class="background-triangle-small">I. </div>THÔNG TIN HỒ SƠ
        </div>
        <thongtinchunghoso :dataDetail="thongTinLienThong"></thongtinchunghoso>
        <v-card class="bdt-0">
          <v-card-text class="py-0">
            <v-layout wrap>
              <v-flex xs12 sm2>
                <v-subheader class="pl-0">Cơ quan liên thông: </v-subheader>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select
                  v-bind:items="govAgencyItems"
                  v-model="govAgency"
                  item-text="itemName"
                  item-value="itemCode"
                  placeholder="Chọn cơ quan liên thông"
                  autocomplete
                  return-object
                  hide-selected
                ></v-select>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <!--  -->
    <v-expansion-panel class="expansion-pl" style="position:relative">
      <v-expansion-panel-content :value="true" >
        <div slot="header">
          <div class="background-triangle-small"> II.</div>
          KẾT QUẢ LIÊN THÔNG
        </div>
        <!--  -->
        <thanh-phan-ho-so ref="thanhphanhoso"></thanh-phan-ho-so>
        <!--  -->
      </v-expansion-panel-content>
    </v-expansion-panel>
    <!--  -->
    <v-card-actions class="mt-2" style="float: right">
      <v-btn color="primary" @click="goBack"
        :loading="loadingAction"
        :disabled="loadingAction"
      >
        Đã nhận kết quả
        <span slot="loader">Loading...</span>
      </v-btn>
      <v-btn color="primary" @click="postDossierLienThong" style="height:30px"
        :loading="loadingAction"
        :disabled="loadingAction"
      >
        <v-icon>undo</v-icon> &nbsp;
        Quay lại
        <span slot="loader">Loading...</span>
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import router from '@/router'
import thongtinchunghoso from './form_xu_ly/ThongTinChungHoSo.vue'
import ThanhPhanHoSo from './TiepNhan/TiepNhanHoSo_ThanhPhanHoSo.vue'
export default {
  components: {
    'thongtinchunghoso': thongtinchunghoso,
    'thanh-phan-ho-so': ThanhPhanHoSo
  },
  data: () => ({
    thongTinLienThong: {},
    govAgencyItems: [],
    govAgency: '',
    loadingAction: false
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  watch: {},
  created () {
    var vm = this
    vm.$nextTick(function () {})
  },
  methods: {
    initData (classPK) {
      var vm = this
      vm.$store.dispatch('getDetailDossier', classPK).then(result => {
        vm.thongTinLienThong = result
        //
        vm.$refs.thanhphanhoso.initData(result)
      }).catch(reject => {
        console.log(reject)
      })
      vm.$store.dispatch('getGovAgency').then(result => {
        console.log('govAgency', result)
        vm.govAgencyItems = result
      }).catch(reject => {
        console.log(reject)
      })
    },
    postDossierLienThong () {
      var vm = this
      console.log('đã nhận kết quả')
    },
    goBack () {
      var vm = this
      let currentParams = vm.$router.history.current.params
      let currentQuery = vm.$router.history.current.query
      vm.$router.push({
        path: '/danh-sach-ho-so/' + currentParams.index,
        query: currentQuery
      })
    }
  },
  filters: {
    dateTimeView (arg) {
      if (arg) {
        let value = new Date(arg)
        return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()}  ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
      } else {
        return ''
      }
    }
  }
}
</script>
