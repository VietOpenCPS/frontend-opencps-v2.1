<template>
  <v-app id="app_home_page">
    <v-navigation-drawer app clipped floating width="310" v-model="drawer">
      <div class="text-center">
        <v-btn-toggle v-model="toggle_exclusive" mandatory class="mt-2" style="width: 100%">
          <v-btn flat style="width: 50%" to="/m">
            Mobile
          </v-btn>
          <v-btn flat style="width: 50%" to="/">
            Desktop
          </v-btn>
        </v-btn-toggle>
      </div>
      <div class="mx-3 mt-3"><v-btn to="/" block color="primary" dark>Trang chủ</v-btn></div>
      <div class="tab-item">
        <div class="left">
          <a href="javascript:;" @click="goPage('dangnhap')">
            <p class="icon pl-1 pr-2"><img width="32" class="mt-2" src="https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend/kios_mobile/img/icons-sign.png"></p>
            <p class="ml-2 my-0">
              <span class="text-bold">Đăng nhập</span>
            </p>
          </a>
          <a href="javascript:;" class="active" @click="goPage('ketquahoso')">
            <p class="icon px-2"><img width="32" class="mt-2" src="https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend/kios_mobile/img/icons-document.png"></p>
            <p class="ml-2 my-0">
              <span class="text-bold">Kết quả hồ sơ</span>
            </p>
          </a>
          <a href="javascript:;" class="active" @click="goPage('tracuuhoso')">
            <p class="icon px-2"><img width="32" class="mt-2" src="https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend/kios_mobile/img/icons-search-50.png"></p>
            <p class="ml-2 my-0">
              <span class="text-bold">Tra cứu hồ sơ</span>
            </p>
          </a>
          <a href="javascript:;" @click="goPage('tracuuthutuc')">
            <p class="icon px-2"><img width="32" class="mt-2" src="https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend/kios_mobile/img/icon-search-dc-50.png"></p>
            <p class="ml-2 my-0">
              <span class="text-bold">Tra cứu thủ tục</span>
            </p>
          </a>
          <a href="javascript:;" @click="goPage('danhgia')">
            <p class="icon pl-1 pr-2"><img width="32" class="mt-2" src="https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend/kios_mobile/img/icon-evaluation.png"></p>
            <p class="ml-2 my-0">
              <span class="text-bold">Đánh giá</span>
            </p>
          </a>
        </div>
      </div>
    </v-navigation-drawer>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-fab-transition>
    <v-btn
      color="pink"
      fab
      dark
      small
      fixed
      top
      right
      v-on:click.native="drawer = !drawer"
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
      drawer: false,
      hidden: false,
      toggle_exclusive: 0,
      workingUnitList: [],
      currentIndex: 0,
      loading: true
    }),
    computed: {
      fullScreen () {
        return this.$store.getters.getFullScreen
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
        }
        vm.$router.push({
          path: queryString
        })
      }
    }
  }
</script>
