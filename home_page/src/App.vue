<template>
  <v-app id="app_home_page">
    <v-navigation-drawer app clipped floating width="310" v-model="drawer" dark temporary fixed style="background-color: #004d7ff0;position:fixed;top: 0">
      <v-list class="px-2 py-2">
        <v-list-tile>
          <v-list-tile-content @click="goToHomePage">
            <v-list-tile-title style="font-size: 14px">HỆ THỐNG DỊCH VỤ CÔNG TRỰC TUYẾN</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon @click.stop="toogleDrw">
              <v-icon size="24">chevron_left</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <!--  -->
      <v-list class="pt-0" dense>
        <v-divider light></v-divider>

        <v-list-tile
          v-for="item in items"
          :key="item.title"
          @click="goPage(item.page)"
          class="px-2"
        >
          <v-list-tile-action class="mr-2">
            <v-icon size="24">{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title style="font-size: 14px">{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-fab-transition>
    <v-btn
      v-if="ism"
      color="#004d7ff0"
      fab
      dark
      small
      fixed
      top
      right
      @click="toogleDrw"
    >
      <v-icon>menu</v-icon>
    </v-btn>
  </v-fab-transition>
  </v-app>
</template>

<script>
  import $ from 'jquery'
  import { isMobile } from 'mobile-device-detect'
  export default {
    data: () => ({
      hidden: false,
      toggle_exclusive: 0,
      workingUnitList: [],
      currentIndex: 0,
      loading: true,
      items: [
        {icon: 'how_to_reg', title: 'Đăng nhập', page: 'dangnhap'},
        {icon: 'account_balance', title: 'Trang chủ', page: 'trangchu'},
        {icon: 'move_to_inbox', title: 'Hồ sơ có kết quả', page: 'ketquahoso'},
        {icon: 'find_in_page', title: 'Tra cứu hồ sơ', page: 'tracuuhoso'},
        {icon: 'pageview', title: 'Tra cứu thủ tục', page: 'tracuuthutuc'},
        {icon: 'insert_chart', title: 'Đánh giá', page: 'danhgia'}
      ]
    }),
    computed: {
      fullScreen () {
        return this.$store.getters.getFullScreen
      },
      drawer () {
        return this.$store.getters.getdrawer
      },
      ism () {
        return this.$store.getters.getism
      }
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentParams = newRoute.params
        let currentQuery = newRoute.query
        // console.log('currentParams', currentParams)
      }
    },
    methods: {
      toogleDrw () {
        var vm = this
        vm.$store.commit('setdrawer', !vm.drawer)
      },
      goToHomePage () {
        window.location.href = '/'
      },
      goPage (page) {
        var vm = this
        vm.$store.commit('setActiveDetailService', false)
        let queryString
        if (page === 'ketquahoso') {
          queryString = '/ho-so-co-ket-qua'
        } else if (page === 'tracuuhoso') {
          queryString = '/tra-cuu-ho-so'
        } else if (page === 'tracuuthutuc') {
          queryString = '/tra-cuu-thu-tuc'
        } else if (page === 'danhgia') {
          queryString = '/danh-gia-cldv'
        } else if (page === 'dangnhap') {
          queryString = '/dang-nhap'
        } else if (page === 'trangchu') {
          window.location.href = '/'
          return
        }
        vm.$router.push({
          path: queryString
        })
      }
    }
  }
</script>
