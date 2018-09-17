<template>
	<div class="form-chitiet" style="background-color: #ffff;">
		<v-layout row wrap>
      <v-flex xs12 sm12>
        <div class="row-header">
          <div class="background-triangle-big"> <span>TÊN THỦ TỤC</span> </div>
          <div class="layout row wrap header_tools row-blue">
            <div class="flex xs8 sm10 pl-3 text-ellipsis text-bold" :title="thongTinChungHoSo.serviceName">
              {{thongTinChungHoSo.serviceName}}
            </div>
            <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
            </div>
          </div> 
        </div>
      </v-flex>
		  <v-flex xs12 sm12 class="text-xs-center mt-4">
		    <h3 class="text-xs-center">NỘP HỒ SƠ THÀNH CÔNG</h3>
		    <p class="text-center">
		    	Mã hồ sơ đã nộp: <span class="text-light-blue">{{thongTinChungHoSo.dossierNo}}</span>
		    	<span class="text-bold" style="color: green;"></span>
		    </p>
		  </v-flex>
		  <v-flex xs12 sm12 class="ml-3">
		    <p style="margin-bottom: 5px !important;">
		    	<i class="fa fa-book" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;
		    	<span class="text-bold">THÔNG TIN HỒ SƠ ĐÃ NỘP</span>
		    </p>
        <ul class="col-sm-12" style="margin-bottom: 15px; margin-left: 15px; list-style: none;" id="infoDossierFiled">
          <li class="mr-3" style="margin-left: 15px" v-for="(item, index) in dossierTemplateSendItems">- <span role="option"> {{item.partName}}</span> <br></li>
        </ul>
		  </v-flex>
		  <v-flex xs12 sm12 style="margin-bottom: 10px;" class="ml-3">
		    <p style="margin-bottom: 5px !important;">
		    	<i class="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;
		    	<span class="text-bold">ĐỊA ĐIỂM HOÀN TẤT THỦ TỤC</span>
		    </p>
        <div style="margin-left: 30px;">
          <span class="text-bold">Trụ sở <span>{{thongTinChungHoSo.govAgencyName}}</span> tại:</span> <br>
          <p class="text-bold">
            Địa chỉ: </span data-bind=""> Đường Trần Phú, phường Tân Dân, thành phố Việt Trì, tỉnh Phú Thọ <span> <br>
            Số điện thoại: 
            </span data-bind="">0986 997 029
          </p>
        </div>
		  </v-flex>
      <v-flex xs12 sm12 style="">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6250.742357296262!2d105.39868453969463!3d21.322328524330093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31348d5405556a21%3A0xb103363bf1d9d9d7!2zVUJORCB04buJbmggUGjDuiBUaOG7jQ!5e0!3m2!1svi!2s!4v1536293308132" width="100%" height="450" frameborder="0" style="border:0" allowfullscreen></iframe>
      </v-flex>
      <v-flex xs12 sm12>
        <v-btn color="primary" @click="goBack()">Quay lại danh sách &nbsp; <v-icon size="16">undo</v-icon></v-btn>
      </v-flex>
		</v-layout>
	</div>
</template>

<script>
  import router from '@/router'
  // import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
  export default {
    props: {
      id: {
        type: Number,
        default: () => 0
      },
      index: {
        type: Number,
        default: () => 0
      }
    },
    data: () => ({
      thongTinChungHoSo: {
      },
      dossierTemplateItems: [],
      dossierFilesItems: [],
      dossierTemplateSendItems: []
    }),
    created () {
      var vm = this
      vm.$nextTick(function () {
        vm.$store.dispatch('getDetailDossier', vm.id).then(resultDossier => {
          vm.thongTinChungHoSo = resultDossier
          let arrTemp = []
          arrTemp.push(vm.$store.dispatch('loadDossierTemplates', resultDossier))
          arrTemp.push(vm.$store.dispatch('loadDossierFiles', resultDossier.dossierId))
          Promise.all(arrTemp).then(results => {
            vm.dossierTemplateItems = results[0]
            vm.dossierFilesItems = results[1]
            vm.dossierTemplateSendItems = vm.filterDossierTemplateSend()
          }).catch(xhr => {
          })
        })
      })
    },
    computed: {
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      initData (data) {
        var vm = this
        vm.thongTinChungHoSo = data
      },
      goBack () {
        let vm = this
        // let currentParams = vm.$router.history.current.params
        // let currentQuery = vm.$router.history.current.query
        // vm.$router.push({
        //   path: '/danh-sach-ho-so/' + currentParams.index,
        //   query: currentQuery
        // })
        router.push({
          path: '/danh-sach-ho-so/' + 0,
          query: {
            recount: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
            q: '/o/rest/v2/dossiers/todo?owner=true&order=true&step=110,130,510'
          }
        })
        // window.history.back()
      },
      filterDossierTemplateSend () {
        var vm = this
        let arrTemp = []
        if (vm.dossierTemplateItems.length > 0 && vm.dossierFilesItems.length > 0) {
          vm.dossierTemplateItems.forEach(template => {
            let indexTemp = vm.dossierFilesItems.findIndex(file => {
              return template.partNo === file.dossierPartNo
            })
            if (indexTemp !== -1) {
              arrTemp.push(template)
            }
          })
          return arrTemp
        } else {
          return []
        }
      },
      back () {
        // var vm = this
      },
      dateTimeView (arg) {
        if (arg) {
          let value = new Date(arg)
          return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
        }
      },
      formatDateInput (date) {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
      }
    },
    filters: {
      dateTimeView (arg) {
        if (arg) {
          let value = new Date(arg)
          return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
        } else {
          return ''
        }
      }
    }
  }
</script>
