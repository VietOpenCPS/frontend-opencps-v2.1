<template>
  <div>    
    <v-content>
			<div class="px-3 pt-2">
				<img src="/o/opencps-store/js/kios/img/logo_banner.png" alt="">
			</div>
      <section class="py-3" :class="isKios && wrapStyle ? 'kios-content-wrapper' : ''"  style="height: calc(100vh - 170px)">
        <div :class="isKios ? 'tab-item' : ''">
          <div v-if="!fullScreen" class="left" :class="fullScreen ? 'smallScreen' : ''">
            <v-container class="px-3" grid-list-xl style="height: 100%;">
              <v-layout column style="height: 100%;">
                <v-flex class="item-menu py-0" style="height: 85px">
                  <a href="javascript:;" class="active" @click="goPage('ketquahoso')" >
                    <p class="icon px-2" ><img src="/o/opencps-store/js/kios/img/icons-document.png"></p>
                    <p class="ml-2 my-0">
                      <span class="">Tra cứu hồ sơ đã có kết quả</span>
                    </p>
                  </a>
                </v-flex>
                <v-flex class="item-menu py-0" style="height: 85px">
                  <a href="javascript:;" class="active" @click="goPage('tiepnhanhoso')">
                    <p class="icon px-2"><img src="/o/opencps-store/js/kios/img/icons8-open-file-50.png"></p>
                    <p class="ml-2 my-0">
                      <span class="">Tra cứu hồ sơ đã tiếp nhận</span>
                    </p>
                  </a>
                </v-flex>
                <v-flex class="item-menu py-0" style="height: 85px">
                  <a href="javascript:;" class="active" @click="goPage('tracuuhoso')">
                    <p class="icon px-2"><img src="/o/opencps-store/js/kios/img/icons-search-50.png"></p>
                    <p class="ml-2 my-0">
                      <span class="">Tra cứu thông tin hồ sơ</span>
                    </p>
                  </a>
                </v-flex>
                <v-flex class="item-menu py-0" style="height: 85px">
                  <a href="javascript:;" @click="goPage('tracuuthutuc')">
                    <p class="icon px-2"><img src="/o/opencps-store/js/kios/img/icon-search-dc-50.png"></p>
                    <p class="ml-2 my-0">
                      <span class="">Tra cứu thủ tục</span>
                    </p>
                  </a>
                </v-flex>
                <v-flex class="item-menu py-0" style="height: 85px">
                  <a href="javascript:;" @click="goPage('danhgia')">
                    <p class="icon pl-1 pr-2"><img src="/o/opencps-store/js/kios/img/icon-evaluation.png"></p>
                    <p class="ml-2 my-0">
                      <span class="">Đánh giá cán bộ</span>
                    </p>
                  </a>
                </v-flex>
              </v-layout>
            </v-container>
          </div>
          <div class="right" :class="fullScreen ? 'fullScreen' : ''">
            <div class="right-content" style="background-image: url('/o/opencps-store/js/kios/img/logo_trangchu.png');
            background-position: right top;
            background-repeat: no-repeat;
            background-size: 95% 100%">
              
            </div>
          </div>
        </div>
      </section>
      <div class="px-3" style="height:70px">
				<v-flex class="px-0" style="color:#0669b2">
          <div class="text-bold d-inline-block">
            BỘ GIAO THÔNG VẬN TẢI <br>
            TRUNG TÂM CÔNG NGHỆ THÔNG TIN
          </div>
          <div class="d-inline-block right">
            Bản quyền thuộc về Bộ Giao thông vận tải
          </div>
        </v-flex>
			</div>
    </v-content>
    <v-btn v-if="enableToTop" fab fixed dark bottom right color="#002c46d4" style="width:56px;height:56px;"
      @click="$vuetify.goTo(0)">
      <v-icon dark size="40">keyboard_arrow_up</v-icon>
    </v-btn>
  </div>
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
        $('.navbar-container').css('display', 'none')
        // vm.setInterval()
        $(window).scroll(function () {
          vm.enableToTop = $(window).scrollTop() > 200
        })
        $('#navigation').css('display', 'none')
        let current = vm.$router.history.current
        let newQuery = current.query
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
			$('header').css('display', 'block')
			$('footer').css('display', 'block')
    },
    mounted () {
			$('header').css('display', 'none')
			$('footer').css('display', 'none')
      this.onResize()
			window.addEventListener('resize', this.onResize, { passive: true })
			setTimeout(function () {
				$('footer').css('display', 'none')
			}, 300)
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
