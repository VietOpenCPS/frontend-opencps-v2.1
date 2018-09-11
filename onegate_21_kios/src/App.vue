<template>
  <v-app>
    <v-content>
    <header>
      <a href="/web/cong-dich-vu-cong">
        <img src="https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend/frontend_web_kios/img/logo.png">
        <div>
          <p class="text-bold">Tỉnh Phú Thọ</p>
          <span class="text-bold">Hệ thống một cửa điện tử và dịch vụ công trực tuyến</span>
        </div>
      </a>
    </header>
    <section class="kios-content-wrapper">
      <div class="tab-item">
        <div class="left" :class="fullScreen ? 'smallScreen' : ''">
          <a href="javascript:;" class="active" @click="goPage('tracuuhoso')">
            <p class="icon px-2"><img src="https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend/frontend_web_kios/img/icons-search-50.png"></p>
            <p class="ml-2 my-0">
              <span class="text-bold">Tra cứu hồ sơ</span><br>
              <span>Tra cứu thông tin hồ sơ</span>
            </p>
          </a>
          <a href="javascript:;" @click="goPage('tracuuthutuc')">
            <p class="icon px-2"><img src="https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend/frontend_web_kios/img/icon-search-dc-50.png"></p>
            <p class="ml-2 my-0">
              <span class="text-bold">Tra cứu thủ tục</span><br>
              <span>Tra cứu thông tin thủ tục</span>
            </p>
          </a>
          <a href="javascript:;" @click="goPage('danhgia')">
            <p class="icon pl-1 pr-2"><img src="https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend/frontend_web_kios/img/icon-evaluation.png"></p>
            <p class="ml-2 my-0">
              <span class="text-bold">Đánh giá</span><br>
              <span>Đánh giá chất lượng dịch vụ</span>
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
      currentIndex: 0,
      loading: true
    }),
    created () {
      var vm = this
      vm.$nextTick(function () {
        $('.mWrapper > header').css('display', 'none')
        $('.mWrapper > nav').css('display', 'none')
        $('.mWrapper > footer').css('display', 'none')
      })
    },
    computed: {
      fullScreen () {
        return this.$store.getters.getFullScreen
      }
    },
    mounted () {
      var vm = this
      vm.$nextTick(function () {
        $('.mWrapper > header').css('display', 'none')
        $('.mWrapper > nav').css('display', 'none')
        $('.mWrapper > footer').css('display', 'none')
      })
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
        let queryString
        if (page === 'tracuuhoso') {
          queryString = '/tra-cuu-ho-so'
        } else if (page === 'tracuuthutuc') {
          queryString = '/tra-cuu-thu-tuc'
        } else if (page === 'danhgia') {
          queryString = '/danh-gia-cldv'
        }
        vm.$router.push({
          path: queryString
        })
      }
    }
  }
</script>
