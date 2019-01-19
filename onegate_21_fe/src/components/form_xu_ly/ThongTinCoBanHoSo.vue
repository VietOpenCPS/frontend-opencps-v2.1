<template>

    <v-expansion-panel
        :value="[true]"
        expand
      >
        <v-expansion-panel-content
        >
          <div slot="header">Item</div>
          <v-card>
            <v-card-text class="grey lighten-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
      
</template>
<script>
  export default {
    props: {
      detailDossier: {
        type: Object,
        default: () => {}
      }
    },
    watch: {
      detailDossier (val) {
        console.log('watch', val)
        var vm = this
        vm.thongTinChiTietHoSo = val
      }
    },
    components: {
    },
    data: () => ({
      thongTinChiTietHoSo: {},
      showContactDetail: false
    }),
    computed: {
      loading () {
        return this.$store.getters.loading
      },
      originality () {
        var vm = this
        return vm.getOriginality()
      }
    },
    created () {
      var vm = this
      vm.thongTinChiTietHoSo = vm.detailDossier
    },
    mounted () {
      var vm = this
      vm.thongTinChiTietHoSo = vm.detailDossier
    },
    methods: {
      initData (data) {
        var vm = this
        vm.$store.dispatch('getDetailDossier', data).then(resultDossier => {
          vm.thongTinChiTietHoSo = resultDossier
          console.log('thongTinChiTietHoSo', vm.thongTinChiTietHoSo)
        })
      },
      goBack () {
        window.history.back()
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
      }
    },
    filters: {
      dateTimeView (arg) {
        if (arg) {
          let value = new Date(arg)
          return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} | ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
        } else {
          return ''
        }
      }
    }
  }
</script>
