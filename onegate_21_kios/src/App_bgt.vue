<template>
  <v-app>
    <v-btn v-if="isMobile"
      class="elevation-0"
      color="grey"
      dark
      fab
      fixed
      style="top: 50px;
      right:0px;border-radius: 6px;
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
      background-color: #002c46d4!important;"
      top
      right
      @click.stop="drawer = !drawer"
    >
      <v-icon>view_list</v-icon>
    </v-btn>
    <v-navigation-drawer
      style="background: #002c46d4"
      v-if="isMobile"
      v-model="drawer"
      absolute
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
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-title
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
      <section :class="isKios && wrapStyle ? 'kios-content-wrapper' : ''" @mousemove="stopInterval()" @click="stopInterval()">
        <div :class="isKios ? 'tab-item' : ''">
          <div v-if="!fullScreen" class="left" :class="fullScreen ? 'smallScreen' : ''">
            <a href="javascript:;" class="active" @click="goPage('ketquahoso')">
              <p class="icon px-2"><img src="https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend/kios/img/icons-document.png"></p>
              <p class="ml-2 my-0">
                <span class="text-bold">Hồ sơ đã có kết quả</span>
              </p>
            </a>
            <a href="javascript:;" class="active" @click="goPage('tiepnhanhoso')">
              <p class="icon px-2"><img src="https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend/kios/img/icons8-open-file-50.png"></p>
              <p class="ml-2 my-0">
                <span class="text-bold">Hồ sơ đã tiếp nhận</span>
              </p>
            </a>
            <a href="javascript:;" class="active" @click="goPage('tracuuhoso')">
              <p class="icon px-2"><img src="https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend/kios/img/icons-search-50.png"></p>
              <p class="ml-2 my-0">
                <span class="text-bold">Tra cứu hồ sơ</span>
              </p>
            </a>
            <a href="javascript:;" @click="goPage('tracuuthutuc')">
              <p class="icon px-2"><img src="https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend/kios/img/icon-search-dc-50.png"></p>
              <p class="ml-2 my-0">
                <span class="text-bold">Tra cứu thủ tục</span>
              </p>
            </a>
            <a href="javascript:;" @click="goPage('danhgia')">
              <p class="icon pl-1 pr-2"><img src="https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend/kios/img/icon-evaluation.png"></p>
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
  </v-app>
</template>

<script>
  import router from '@/router'
  import $ from 'jquery'
  export default {
    data: () => ({
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
    created () {
      var vm = this
      vm.$nextTick(function () {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        vm.$store.commit('setGroupid', newQuery.hasOwnProperty('groupIds') ? newQuery['groupIds'] : '')
        $('#navigation').css('display', 'none')
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
        vm.isMobile = window.innerWidth < 1020
        vm.$store.commit('setIsMobile', vm.isMobile)
      },
      backKiosHome () {
        var vm = this
        this.interVal = setInterval(() => {
          vm.$router.push({
            path: '/'
          })
        }, 5 * 60 * 1000)
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
          queryString = '/'
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
