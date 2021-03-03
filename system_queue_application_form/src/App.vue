<template>
  <v-app id="app_application_form" style="max-width:1300px;margin:0 auto">
    <v-navigation-drawer app clipped floating width="310" v-if="false">
    </v-navigation-drawer>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  import GoTop from '@inotom/vue-go-top'
  export default {
    data: () => ({
      active: null,
      activeAll: false,
      activeTab: 0,
      activeService: '',
      pathRouter: '/thu-tuc-hanh-chinh',
      currentAgency: '',
      currentDomain: '',
      currentLevel: '',
      currentMethod: '',
      countAllService: 0,
      isDetail: false,
      text: '',
      menuServiceInfos: [
        {
          id: 1,
          name: 'Thủ tục nhóm 1',
          code: '13213',
          count: 2,
          children: []
        },
        {
          id: 2,
          name: 'Thủ tục nhóm 2',
          code: '132113',
          count: 2,
          children: []
        },
        {
          id: 3,
          name: 'Thủ tục nhóm 3',
          code: '1321313',
          count: 2,
          children: []
        },
        {
          id: 4,
          name: 'Thủ tục nhóm 4',
          code: '132413',
          count: 2,
          children: []
        }
      ],
      serviceInfoList: [
      ],
    }),
    components: {
      GoTop
    },
    computed: {
    },

    created () {
      var vm = this
      let isMobile = window.innerWidth < 1264
      vm.$store.commit('setIsMobile', isMobile)
      vm.$nextTick(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        // vm.doLoadingThuTuc()
      })
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentParams = newRoute.params
        let currentQuery = newRoute.query
      }
    },
    methods: {
      doLoadingThuTuc () {
        var vm = this
        vm.serviceInfoList = []
        vm.loading = true
        let currentQuery = vm.$router.history.current.query
        var filter = null
        filter = {
          page: currentQuery.page ? currentQuery.page : 1
        }
        vm.$store.dispatch('getServiceLists', filter).then(function (result) {
          vm.loading = false
          if (result.data) {
            vm.serviceInfoList = result.data
            vm.totalThuTuc = result.total
            vm.menuServiceInfos[0]['children'] = [vm.serviceInfoList[0], vm.serviceInfoList[1]]
            vm.menuServiceInfos[1]['children'] = [vm.serviceInfoList[2], vm.serviceInfoList[3]]
            vm.menuServiceInfos[2]['children'] = [vm.serviceInfoList[4], vm.serviceInfoList[5]]
            vm.menuServiceInfos[3]['children'] = [vm.serviceInfoList[6], vm.serviceInfoList[7]]
          } else {
            vm.totalThuTuc = 0
            vm.serviceInfoList = []
          }
          vm.serviceItemTotal = result.total
        }).catch(reject => {
          vm.loading = false
          vm.serviceInfoList = []
        })
      },
      getEformServiceInfo (index, item1) {
        let vm = this
        vm.activeService = item1.serviceInfoId
        vm.$store.commit('setServiceinfoSelected', item1)
        vm.$store.dispatch('getFileTemplateEform', item1).then(response => {
          if (response.data) {
            let templateFile = Object.assign({}, response.data[0], {serviceInfoId: item1.serviceInfoId})
            vm.$store.commit('setFileTemplateSelected', templateFile)
            vm.$store.dispatch('loadFormScript', templateFile).then(resFormScript => {
              vm.$store.commit('setFormScriptEform', resFormScript)
              if (resFormScript) {
                setTimeout(function () {
                  let pstEl = $('#formAlpacaEform').offset().top + 100
                  let offsetLeft = $('#eform-btn').offset().left
                  $(window).scroll(function () {
                    if ($(window).scrollTop() > pstEl) {
                      $('#eform-btn').css({'position':'fixed', 'top':0, 'left': `${offsetLeft}px`})
                    } else {
                      $('#eform-btn').css({'position':'relative', 'top':0, 'right': '30px'})
                    }
                  })
                }, 300)
              }
              vm.$store.dispatch('loadFormData', templateFile).then(resFormData => {
                // vm.$store.commit('setFormDataEform', resFormData)
              })
            })
          }
        })
      },
      goBack () {
        window.history.back()
      }
    }
  }
</script>
<style>
  .service__info__menu .tabs__container {
    border-bottom: 1px solid #0072c0;
  }
</style>
