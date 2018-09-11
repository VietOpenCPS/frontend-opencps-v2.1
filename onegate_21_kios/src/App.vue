<template>
  <v-app>
    <v-content>
    <header>
      <a href="/web/cong-dich-vu-cong">
        <img src="./assets/logo.png">
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
            <p class="icon px-2"><img src="./assets/icons-search-50.png"></p>
            <p class="ml-2 my-0">
              <span class="text-bold">Tra cứu hồ sơ</span><br>
              <span>Tra cứu thông tin hồ sơ</span>
            </p>
          </a>
          <a href="javascript:;" @click="goPage('tracuuthutuc')">
            <p class="icon px-2"><img src="./assets/icon-search-dc-50.png"></p>
            <p class="ml-2 my-0">
              <span class="text-bold">Tra cứu thủ tục</span><br>
              <span>Tra cứu thông tin thủ tục</span>
            </p>
          </a>
          <a href="javascript:;" @click="goPage('danhgia')">
            <p class="icon pl-1 pr-2"><img src="./assets/icon-evaluation.png"></p>
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
  export default {
    data: () => ({
      workingUnitList: [],
      currentIndex: 0,
      loading: true
    }),
    created () {
      var vm = this
      vm.$nextTick(function () {})
    },
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
