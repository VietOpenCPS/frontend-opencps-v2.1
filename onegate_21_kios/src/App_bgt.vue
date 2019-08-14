<template>
  <v-app @mousemove="stopInterval()" @click="stopInterval()" style="background-image: url(/o/opencps-store/js/kios/img/bg_content.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 120% 110%;">
    <section :class="isKios && wrapStyle ? 'kios-content-wrapper' : ''" @mousemove="stopInterval()" @click="stopInterval()" >
      <router-view></router-view>
    </section>
    <v-btn v-if="enableToTop" fab fixed dark bottom right color="#002c46d4" style="width:56px;height:56px;"
      @click="$vuetify.goTo(0)">
      <v-icon dark size="40">keyboard_arrow_up</v-icon>
    </v-btn>
  </v-app>
</template>

<script>
  import router from '@/router'
  import $ from 'jquery'
  import GoTop from '@inotom/vue-go-top'
  export default {
    data: () => ({
      enableToTop: false,
      workingUnitList: [],
      govAgencyList: [],
      isDvc: true,
      currentIndex: 0,
      interVal: '',
      loading: true,
      isKios: true,
      wrapStyle: true,
      isMobile: false,
      drawer: null,
      active: 0,
      groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
      kiosItems: [
        {
          route: 'ketquahoso',
          icon: 'library_books',
          text: 'Tra cứu hồ sơ đã có kết quả'
        },
        {
          route: 'tiepnhanhoso',
          icon: 'move_to_inbox',
          text: 'Tra cứu hồ sơ đã tiếp nhận'
        },
        {
          route: 'tracuuhoso',
          icon: 'search',
          text: 'Tra cứu thông tin hồ sơ'
        },
        {
          route: 'tracuuthutuc',
          icon: 'pageview',
          text: 'Tra cứu thủ tục'
        },
        {
          route: 'danhgia',
          icon: 'stars',
          text: 'Đánh giá cán bộ'
        }
      ]
    }),
    components: {
      GoTop
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        let elem = document.documentElement
        if (elem.requestFullscreen) {
          elem.requestFullscreen()
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen()
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen()
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen()
        }
        $( "section.kios-content-wrapper" ).parent().css( "min-height", "calc(100vh - 182px)" )
        $('.navbar-container').css('display', 'none')
        let hrefs = window.location.href
        if (hrefs.indexOf('tra-cuu-ho-so-homepage') < 0) {
          vm.setInterval()
        }
        $(window).scroll(function () {
          vm.enableToTop = $(window).scrollTop() > 200
        })
        $('#navigation').css('display', 'none')
        vm.$store.commit('setGroupid', newQuery.hasOwnProperty('groupIds') ? newQuery['groupIds'] : '')
        if (!newQuery.hasOwnProperty('secretKey')) {
          // vm.setInterval()
          vm.isKios = true
          // console.log('isKios')
        } else {
          vm.isKios = false
          // console.log('NOT Kios')
        }
        if (current['path'] && current['path'] === '/tra-cuu-ho-so-homepage') {
          vm.wrapStyle = false
        } else {
          vm.wrapStyle = true
        }
        // 
        let href = window.location.search
        let dataParams = new URLSearchParams(href)
        let paramsValue = dataParams.get('QRSCAN')
        let dossierNoParam = paramsValue.split('-')[0]
        let secretKeyParam = paramsValue.split('-')[1]
        if (href.indexOf('QRSCAN') >=0 && paramsValue) {
          if (vm.interVal) {
            clearInterval(vm.interVal)
          }
          let queryString
          queryString = '/tra-cuu-thong-tin-ho-so/' + dossierNoParam + '?secretKey=' + secretKeyParam
          vm.$router.push({
            path: queryString,
            query: {
              renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
            }
          })
          console.log('newQuery KIOS 2', queryString)
        }
        // 
        vm.$store.dispatch('getGovAgency').then(function (result) {
          vm.govAgencyList = result
          vm.isDvc = vm.govAgencyList.length > 1
        }).catch(reject => {})
      })
    },
    beforeDestroy () {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.onResize, { passive: true })
      }
    },
    mounted () {
      let vm = this
      vm.$nextTick(function () {
        $('#navigation').css('display', 'none')
        $('.navbar-container').css('display', 'none')
      })
      let elem = document.documentElement
      if (elem.requestFullscreen) {
        elem.requestFullscreen()
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen()
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen()
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen()
      }
      $( "section.kios-content-wrapper" ).parent().css( "min-height", "calc(100vh - 182px)" )
      this.onResize()
      window.addEventListener('resize', this.onResize, { passive: true })
    },
    computed: {
      fullScreen () {
        return this.$store.getters.getFullScreen
      },
      groupIds () {
        return this.$store.getters.getGroupid
      }
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        $('.navbar-container').css('display', 'none')
        let vm = this
        let currentParams = newRoute.params
        let currentQuery = newRoute.query
        vm.$store.commit('setGroupid', currentQuery.hasOwnProperty('groupIds') ? currentQuery['groupIds'] : '')
        if (!currentQuery.hasOwnProperty('secretKey')) {
          vm.isKios = true
        } else {
          vm.isKios = false
        }
        if (newRoute['path'] && newRoute['path'] === '/tra-cuu-ho-so-homepage') {
          vm.wrapStyle = false
        } else {
          vm.wrapStyle = true
        }
      }
    },
    methods: {
      onResize () {
        let vm = this
        vm.isMobile = window.innerWidth < 1024
        vm.$store.commit('setIsMobile', vm.isMobile)
      },
      backKiosHome () {
        var vm = this
        this.interVal = setInterval(() => {
          vm.$router.push({
            path: '/'
          })
        }, 3 * 60 * 1000)
      },
      setInterval () {
        this.backKiosHome()
      },
      stopInterval () {
        var vm = this
        if (vm.interVal) {
          clearInterval(vm.interVal)
          vm.setInterval()
        }
      },
      goPage (page, index) {
        var vm = this
        vm.active = index
        vm.$store.commit('setActiveDetailService', false)
        let queryString
        if (page === 'ketquahoso') {
          queryString = '/ho-so-co-ket-qua'
        } else if (page === 'tiepnhanhoso') {
          queryString = '/tiep-nhan-ho-so'
        } else if (page === 'tracuuhoso') {
          queryString = '/tra-cuu-ho-so'
        } else if (page === 'tracuuthutuc') {
          queryString = '/tra-cuu-thu-tuc-bgt'
        } else if (page === 'danhgia') {
          if (vm.isDvc) {
            queryString = '/danh-gia-can-bo'
          } else {
            queryString = '/danh-sach-can-bo?agencyCode=' + vm.govAgencyList[0].administrationCode + '&agencyName=' + vm.govAgencyList[0].administrationName
          }
        }
        vm.$router.push({
          path: queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }
    }
  }
</script>
