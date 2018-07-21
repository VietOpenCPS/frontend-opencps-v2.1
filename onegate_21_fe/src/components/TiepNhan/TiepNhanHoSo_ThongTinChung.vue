<template>
  <div>
    <v-card>
      <v-card-text>
        <v-layout wrap>
          <v-flex xs12 sm2>
            <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-subheader v-else class="pl-0">Thủ tục: </v-subheader>
          </v-flex>
          <v-flex xs12 sm10>
            <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-subheader v-if="loading === false" style="float:left;height: 100%">
              <i>{{thongTinChungHoSo.serviceName}}</i>
            </v-subheader>
          </v-flex>
          <v-flex xs12></v-flex>
          <!--  -->
          <v-flex xs12 sm2>
            <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-subheader v-else class="pl-0" >
              Mã hồ sơ: 
            </v-subheader>
          </v-flex>
          <v-flex xs12 sm4>
            <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-subheader v-else style="float:left"><i>{{thongTinChungHoSo.dossierNo}}</i></v-subheader>
          </v-flex>
          <v-flex xs12 sm2>
            <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-subheader v-else class="pl-0">Thời gian giải quyết: </v-subheader>
          </v-flex>
          <v-flex xs12 sm4>
            <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-subheader v-if="!loading&&thongTinChungHoSo.durationDate" style="float:left"><i>{{durationText(thongTinChiTietHoSo.durationUnit, thongTinChiTietHoSo.durationCount)}} làm việc</i></v-subheader>
          </v-flex>
          <!-- <v-flex xs12 sm2>
            <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-subheader v-else class="pl-0" >
              Mã tham chiếu: 
            </v-subheader>
          </v-flex>
          <v-flex xs12 sm4>
            <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-subheader v-else style="float:left"><i>{{thongTinChungHoSo.dossierIdCTN}}</i></v-subheader>
          </v-flex> -->
          <v-flex xs12></v-flex>
          <!--  -->
          <!--  -->
          <v-flex xs12 sm2>
            <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-subheader v-else class="pl-0">Ngày tiếp nhận: </v-subheader>
          </v-flex>
          <v-flex xs12 sm4>
            <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-subheader v-else style="float:left"><i>{{thongTinChungHoSo.receiveDate}}</i></v-subheader>
          </v-flex>
          <v-flex xs12 sm2>
            <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-subheader v-else class="pl-0">Ngày hẹn trả: </v-subheader>
          </v-flex>
          <v-flex xs12 sm4>
            <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-subheader v-else style="float:left;height: 100%">
                {{thongTinChungHoSo.dueDate}}
            </v-subheader>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-btn flat class="absolute__btn" @click="goBack">
      Quay lại &nbsp;
      <v-icon>undo</v-icon>
    </v-btn>
  </div>
</template>

<script>
  // import router from '@/router'
  export default {
    data: () => ({
      minDate: null,
      dataPostDossier: {
        serviceCode: '',
        govAgencyCode: '',
        processOptionId: ''
      },
      thongTinChungHoSo: {
        serviceName: '',
        dossierTemplateName: '',
        serviceConfig: '',
        serviceOption: '',
        dossierNo: '',
        receiveDate: '',
        dueDate: '',
        durationDate: '',
        dossierId: '',
        dossierIdCTN: '',
        dossierStatus: '',
        dossierStatusText: ''
      }
    }),
    created () {
      var vm = this
      vm.$nextTick(function () {
        vm.minDate = vm.getCurentDateTime('date')
        // vm.$store.commit('setThongTinChungHoSoDueDate', (new Date()).toString())
        // vm.$store.commit('setThongTinChungHoSoReceiveDate', vm.getCurentDateTime('datetime'))
      })
    },
    computed: {
      loading () {
        return this.$store.getters.loading
      },
      isDetail () {
        return this.$store.getters.isDetail
      }
    },
    watch: {},
    methods: {
      initData (data) {
        var vm = this
        console.log(data)
        let thongTinChungHoSoTemp = {
          serviceName: data.serviceName,
          dossierTemplateName: data.dossierTemplateName,
          dossierNo: data.dossierNo,
          receiveDate: data.receiveDate,
          dueDate: data.dueDate,
          durationDate: data.durationDate,
          dossierId: data.dossierId,
          dossierIdCTN: data.dossierIdCTN,
          dossierStatus: data.dossierStatus,
          dossierStatusText: data.dossierStatusText
        }
        console.log('thongTinChungHoSoTemp++++++++++', thongTinChungHoSoTemp)
        vm.thongTinChungHoSo = thongTinChungHoSoTemp
      },
      getCurentDateTime (type) {
        let date = new Date()
        if (type === 'datetime') {
          return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} | ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
        } else if (type === 'date') {
          return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate()}`
        }
      },
      getDuedate () {
        var vm = this
        let dueDateMs = (new Date(vm.thongTinChungHoSo.dueDate).getTime() - new Date(vm.thongTinChungHoSo.receiveDate).getTime())
        if (Math.ceil(dueDateMs / 1000 / 60 / 60 / 24) <= 0) {
          return 1
        }
        return Math.ceil(dueDateMs / 1000 / 60 / 60 / 24)
      },
      durationText (durationUnit, durationCount) {
        var durationText
        if (durationUnit === 1 && durationCount > 8) {
          let day = Math.floor(durationCount / 8) + ' ngày'
          let hours
          if (durationCount % 8 !== 0) {
            hours = ((durationCount / 8) - Math.floor(durationCount / 8)) * 8 + ' giờ'
          } else {
            hours = ''
          }
          durationText = `${day} ${hours}`
        } else if (durationUnit === 0) {
          durationText = durationCount + ' ngày'
        } else if (durationUnit === 1 && durationCount <= 8) {
          durationText = durationCount + ' giờ'
        }
        return durationText
      },
      goBack () {
        let vm = this
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
          return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} | ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
        }
      }
    }
  }
</script>
