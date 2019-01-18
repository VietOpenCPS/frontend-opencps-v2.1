<template>
  <div>
    <content-placeholders class="mt-3" v-if="loading">
      <content-placeholders-text :lines="1" />
    </content-placeholders>
    <div v-else class="row-header" style="margin-top: 6px;">
      <div class="background-triangle-big"> Thông tin chung </div> 
      <div class="layout row wrap header_tools row-blue">
        <div class="flex solo text-ellipsis">

        </div> 
        <div class="flex text-right" style="margin-left: auto;">
          <v-btn flat class="my-0 mx-0 btn-border-left" @click="goBack" active-class="temp_active">
            Quay lại &nbsp;
            <v-icon size="16">undo</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
    <v-layout row wrap>
      <v-flex xs12 sm12>
        <v-card class="mb-2">
          <!-- <v-toolbar dark color="primary" height="40">
          <v-toolbar-title class="white--text" style="font-size: 15px;">Thông tin chung</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar> -->
          <v-card-title primary-title>
            <v-layout row wrap>
              <v-flex xs12 sm6 class="mb-2">
                <span>Loại hồ sơ: </span> 
              </v-flex>
              <v-flex xs12 sm6>
                <v-chip small class="pl-0">
                  Hồ sơ trực tuyến
                </v-chip>
              </v-flex>
              <v-flex xs12 sm6 class="mb-2">
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <span v-else>Mã hồ sơ: {{thongTinChiTietHoSo.dossierIdCTN}}</span> 
              </v-flex>
              <v-flex xs12 sm6 class="mb-2">
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <span v-else>Ngày tiếp nhận: {{thongTinChiTietHoSo.receiveDate}}</span>
              </v-flex>
              <v-flex xs12 sm6 class="mb-2">
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <span v-else>Chủ hồ sơ: {{thongTinChiTietHoSo.applicantName}}</span>
              </v-flex>
              <v-flex xs12 sm6 class="mb-2">
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <span v-else>Mã số: {{thongTinChiTietHoSo.dossierId}}</span>
              </v-flex>
              <v-flex xs12 sm12 class="mb-2">
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <span v-else>Địa chỉ: {{thongTinChiTietHoSo.address}}</span>
              </v-flex>
              <v-flex xs12 sm12 class="mb-2">
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <span v-else>Ngày hẹn trả: {{thongTinChiTietHoSo.releaseDate|dateTimeView}}</span> | {{thongTinChiTietHoSo.durationDate}} ngày giải quyết
              </v-flex>
              <v-flex xs12 sm12 class="mb-2">
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <span v-else>Trạng thái hồ sơ: {{thongTinChiTietHoSo.dossierStatusText}}</span>
              </v-flex>
              <v-flex xs12 sm6 class="mb-2">
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <span v-else>Ngày hoàn thành: {{thongTinChiTietHoSo.releaseDate|dateTimeView}}</span>
              </v-flex>
              <v-flex xs12 sm6 class="mb-2">
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <span v-else>Ngày trả kết quả: {{thongTinChiTietHoSo.releaseDate|dateTimeView}}</span>
              </v-flex>
            </v-layout>
          </v-card-title>
        </v-card>
        <content-placeholders class="mt-1" v-if="loading">
          <content-placeholders-text :lines="1" />
        </content-placeholders>
        <v-expansion-panel expand v-else>
          <v-expansion-panel-content key="1" value="false">
            <div slot="header">Thành phần hồ sơ nộp vào</div>
            <div slot="header" class="text-right">Xem tài liệu</div>
            <v-card>
              <v-card-text class="grey lighten-3">
                <div v-for="(item, index) in dossierTemplateIn" :key="item.partNo" class="mb-2">
                 <span class="text-bold mr-2">{{index + 1}}.</span>
                 <span >{{item.partName}} <i v-if="item.hasForm">Form trực tuyến</i></span>
                </div>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <content-placeholders class="mt-1" v-if="loading">
          <content-placeholders-text :lines="1" />
        </content-placeholders>
        <v-expansion-panel expand v-else>
          <v-expansion-panel-content key="1" value="false">
            <div slot="header">Văn bản ban hành</div>
            <v-card>
              <v-card-text class="grey lighten-3">
              
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <content-placeholders class="mt-1" v-if="loading">
          <content-placeholders-text :lines="1" />
        </content-placeholders>
        <v-expansion-panel expand v-else>
          <v-expansion-panel-content key="1" value="false">
            <div slot="header">Thành phần kết quả giải quyết</div>
            <div slot="header" class="text-right">Xem tài liệu</div>
            <v-card>
              <v-card-text class="grey lighten-3">
                <div v-for="(item, index) in dossierTemplateOut" slot="header" :key="item.partNo" class="mb-2">
                 <span class="text-bold mr-2">{{index + 1}}.</span>
                 <span>{{item.partName}}</span>
                </div>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <content-placeholders class="mt-1" v-if="loading">
          <content-placeholders-text :lines="1" />
        </content-placeholders>
        <v-expansion-panel expand v-else>
          <v-expansion-panel-content key="1" value="false">
            <div slot="header">Tiến độ giải quyết</div>
            <v-card>
              <v-card-text class="grey lighten-3">

              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <content-placeholders class="mt-1" v-if="loading">
          <content-placeholders-text :lines="1" />
        </content-placeholders>
        <v-expansion-panel expand v-else>
          <v-expansion-panel-content key="1" value="false">
            <div slot="header">Nhật ký hồ sơ</div>
            <v-card>
              <v-card-text class="grey lighten-3">

              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <content-placeholders class="mt-1" v-if="loading">
          <content-placeholders-text :lines="1" />
        </content-placeholders>
        <v-expansion-panel expand v-else>
          <v-expansion-panel-content key="1" value="false">
            <div slot="header">Hỏi đáp trực tuyến</div>
            <v-card>
              <v-card-text class="grey lighten-3">
              
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <content-placeholders class="mt-1" v-if="loading">
          <content-placeholders-text :lines="1" />
        </content-placeholders>
        <v-expansion-panel expand v-else>
          <v-expansion-panel-content key="1" value="false">
            <div slot="header">Trao đổi ý kiến trực tuyến</div>
            <v-card>
              <v-card-text class="grey lighten-3">

              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
  export default {
    data: () => ({
      dossierTemplateIn: [{
        partNo: '1',
        partName: 'Van ban abcxyz'
      },
      {
        partNo: '2',
        partName: 'Van ban abcxyz'
      },
      {
        partNo: '3',
        partName: 'Van ban abcxyz'
      }],
      dossierTemplateOut: [{
        partNo: '4',
        partName: 'Van ban abcxyz'
      },
      {
        partNo: '5',
        partName: 'Van ban abcxyz'
      },
      {
        partNo: '6',
        partName: 'Van ban abcxyz'
      }],
      thongTinChiTietHoSo: {
        dossierIdCTN: '182CB683',
        receiveDate: 1529409276000,
        applicantName: 'Lê việt Đức',
        dossierId: '67501',
        address: 'Phường Tân Hồng, Thị xã Từ Sơn, Tỉnh Bắc Ninh',
        releaseDate: 1529409276000,
        dossierStatusText: 'Đang xử lý',
        durationDate: 3
      }
    }),
    computed: {
      loading () {
        return this.$store.getters.loading
      }
    },
    created () {
    },
    watch: {
    },
    methods: {
      initData (data) {
        var vm = this
        vm.$store.dispatch('getDetailDossier', data).then(resultDossier => {
          vm.thongTinChiTietHoSo = resultDossier
          vm.$store.dispatch('loadAllDossierTemplates', resultDossier).then(function (result) {
            var dossierTemplateInTemp = result.filter(val => {
              return val.partType === 1
            })
            var dossierTemplateOutTemp = result.filter(val => {
              return val.partType === 2
            })
            vm.dossierTemplateIn = dossierTemplateInTemp
            vm.dossierTemplateOut = dossierTemplateOutTemp
            vm.$store.dispatch('loadDossierFiles')
          })
        })
      },
      getDuedate () {
        var vm = this
        let dueDateMs = (new Date(vm.thongTinChungHoSo.dueDate).getTime() - new Date(vm.thongTinChungHoSo.receiveDate).getTime())
        if (Math.ceil(dueDateMs / 1000 / 60 / 60 / 24) <= 0) {
          return 1
        }
        return Math.ceil(dueDateMs / 1000 / 60 / 60 / 24)
      },
      getCurentDateTime (type) {
        let date = new Date()
        if (type === 'datetime') {
          return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} | ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
        } else if (type === 'date') {
          return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate()}`
        }
      },
      goBack () {
        window.history.back()
      }
    },
    filters: {
      dateTimeView (arg) {
        if (arg) {
          let value = new Date(arg)
          return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} | ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
        }
        //  else {
        //   if (!arg) {
        //     return ''
        //   }
        //   const [date, time] = date.split(' ')
        //   const [day, month, year] = date.split('/')
        //   const [hour, minute] = time.split(':')
        //   return `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year} | ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        // }
      }
    }
  }
</script>
