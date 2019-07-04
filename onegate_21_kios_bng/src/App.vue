<template>
  <v-app @mousemove="stopInterval()" @click="stopInterval()">
    <v-btn v-if="isMobile" 
      class="elevation-0"
      color="grey"
      dark
      fab
      fixed
      style="top: 70px;width:56px;height:56px;
      right:0px;border-radius: 6px;
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
      background-color: #002c46d4!important;"
      top
      right
      @click.stop="drawer = !drawer"
    >
      <v-icon size="32">list</v-icon>
    </v-btn>
    <v-navigation-drawer
      style="background: #002c46d4;position:fixed;top:0px;left:0px"
      v-if="isMobile"
      v-model="drawer"
      dark
      temporary
    >
      <v-img
        :src="image"
        height="100%"
      >
        <v-layout
          class="fill-height"
          tag="v-list"
          column
        >
          <v-list-tile
            v-for="(item, index) in kiosItems"
            :key="index"
            @click="goPage(item.route, index)"
            :class="active === index ? 'active_drawer' : ''"
            avatar
            class="v-list-item"
          >
            <v-list-tile-action class="mx-2">
              <v-icon size="26">{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-title style="font-size: 16px"
              v-text="item.text"
            />
          </v-list-tile>
        </v-layout>
      </v-img>
    </v-navigation-drawer>
    <v-content v-if="isMobile">
      <router-view></router-view>
    </v-content>
    
    <v-content v-else>
      <v-card flat color="#0f66dd" style="font-family: 'Times New Roman', Times, serif;height: 130px;">
        <v-flex xs12 class="header_dhxh text-xs-center pt-1">
          <div class="logo d-inline-block">
            <div class="d-inline-block px-3 pt-2" style="position:absolute;top:0;left:0">
              <img style="width:70px;" :src="'/documents/' + groupId + '/0/logo.png'">
              <div style="font-size:16px;color:#e5e0e0" class="text-xs-center mt-3">BỘ NGOẠI GIAO</div>
            </div>
            <div class="d-inline-block px-2 pt-2" style="position:absolute;top:0;right:0">
              <img class="img-slogan mb-3" style="width:70px;"  :src="'/documents/' + groupId + '/0/ct.png'">
              <div style="font-size:14px;color:#e5e0e0" class="text-xs-center">CHUNG TAY CẢI CÁCH</div>
              <div style="font-size:14px;color:#e5e0e0" class="text-xs-center mt-1">THỦ TỤC HÀNH CHÍNH</div>
            </div>
            <div style="font-size:26px;color:#e5e0e0" class="mb-1 mt-2">BỘ PHẬN TIẾP NHẬN HỒ SƠ VÀ TRẢ KẾT QUẢ</div>
            <v-flex style="line-height: 5px">
              <div class="underline-white" style="width:350px;height:2px"></div>
            </v-flex>
            <v-flex xs12 class="text-xs-center pt-3">
              <div style="font-size:32px; color: #f7d900;height:50px" class="">
                TRA CỨU THÔNG TIN
              </div>
            </v-flex>
          </div>
        </v-flex>
      </v-card>
      <section :class="isKios && wrapStyle ? 'kios-content-wrapper' : ''" @mousemove="stopInterval()" @click="stopInterval()">
        <div :class="isKios ? 'tab-item' : ''">
          <div v-if="!fullScreen" class="left" :class="fullScreen ? 'smallScreen' : ''">
            <a href="javascript:;" class="active" @click="goPage('ketquahoso')">
              <p class="icon px-2"><img src="/o/opencps-store/js/kios/img/icons-document.png"></p>
              <p class="ml-2 my-0">
                <span class="text-bold">Hồ sơ đã có kết quả</span>
              </p>
            </a>
            <a href="javascript:;" class="active" @click="goPage('tiepnhanhoso')">
              <p class="icon px-2"><img src="/o/opencps-store/js/kios/img/icons8-open-file-50.png"></p>
              <p class="ml-2 my-0">
                <span class="text-bold">Hồ sơ đã tiếp nhận</span>
              </p>
            </a>
            <a href="javascript:;" class="active" @click="goPage('tracuuhoso')">
              <p class="icon px-2"><img src="/o/opencps-store/js/kios/img/icons-search-50.png"></p>
              <p class="ml-2 my-0">
                <span class="text-bold">Tra cứu hồ sơ</span>
              </p>
            </a>
            <a href="javascript:;" @click="goPage('tracuuthutuc')">
              <p class="icon px-2"><img src="/o/opencps-store/js/kios/img/icon-search-dc-50.png"></p>
              <p class="ml-2 my-0">
                <span class="text-bold">Tra cứu thủ tục</span>
              </p>
            </a>
            <a href="javascript:;" @click="goPage('danhgia')">
              <p class="icon pl-1 pr-2"><img src="/o/opencps-store/js/kios/img/icon-evaluation.png"></p>
              <p class="ml-2 my-0">
                <span class="text-bold">Đánh giá cán bộ</span>
              </p>
            </a>
          </div>
          <div class="right" :class="fullScreen ? 'fullScreen' : ''">
            <div class="right-content">
              <router-view></router-view>
            </div>
          </div>
        </div>
      </section>
    </v-content>
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
          text: 'Hồ sơ đã có kết quả'
        },
        {
          route: 'tiepnhanhoso',
          icon: 'move_to_inbox',
          text: 'Hồ sơ đã tiếp nhận'
        },
        {
          route: 'tracuuhoso',
          icon: 'search',
          text: 'Tra cứu hồ sơ'
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
        $('header').css('display', 'none')
        $('.navbar-container').css('display', 'none')
        vm.setInterval()
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
    },
    mounted () {
      let vm = this
      vm.$nextTick(function () {
        $('#navigation').css('display', 'none')
        $('header').css('display', 'none')
        $('.navbar-container').css('display', 'none')
      })
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
        $('header').css('display', 'none')
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
          queryString = '/tra-cuu-thu-tuc'
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