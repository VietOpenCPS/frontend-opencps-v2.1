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
		  </v-flex>
		  <v-flex xs12 v-html="thongTinChungHoSo.submissionNote">
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
