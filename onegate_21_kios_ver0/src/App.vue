<template>
  <v-app>
    <v-content>
      <header v-if="!isOneGate">
        <a href="/web/cong-dich-vu-cong" :class="!isKios?'mobile':''">
          <img src="/o/opencps-store/js/kios_ver0/img/logo.png">
          <div>
            <p class="text-bold"></p>
            <span class="text-bold"></span>
          </div>
        </a>
      </header>
      <section :class="!isMobile && isKios && wrapStyle ? 'kios-content-wrapper' : ''" @mousemove="stopInterval()" @click="stopInterval()">
        <div :class="isKios ? 'tab-item' : ''">
          <div v-if="!fullScreen" class="left" :class="fullScreen ? 'smallScreen' : ''">
            <a href="javascript:;" class="active" @click="goPage('ketquahoso')">
              <p class="icon px-2 pt-3"><img src="/o/opencps-store/js/kios_ver0/img/icons-document.png"></p>
              <p class="ml-2 my-0">
                <span class="text-bold">Kết quả hồ sơ</span><br>
                <span>Danh sách hồ sơ có kết quả</span>
              </p>
            </a>
            <a href="javascript:;" class="active" @click="goPage('tiepnhanhoso')">
              <p class="icon px-2 pt-3"><img src="/o/opencps-store/js/kios_ver0/img/icons8-open-file-50.png"></p>
              <p class="ml-2 my-0">
                <span class="text-bold">Tiếp nhận hồ sơ</span><br>
                <span>Danh sách hồ sơ đã tiếp nhận</span>
              </p>
            </a>
            <a href="javascript:;" class="active" @click="goPage('tracuuhoso')">
              <p class="icon px-2 pt-3"><img src="/o/opencps-store/js/kios_ver0/img/icons-search-50.png"></p>
              <p class="ml-2 my-0">
                <span class="text-bold">Tra cứu hồ sơ</span><br>
                <span>Tra cứu thông tin hồ sơ</span>
              </p>
            </a>
            <a href="javascript:;" @click="goPage('tracuuthutuc')">
              <p class="icon px-2 pt-3"><img src="/o/opencps-store/js/kios_ver0/img/icon-search-dc-50.png"></p>
              <p class="ml-2 my-0">
                <span class="text-bold">Tra cứu thủ tục</span><br>
                <span>Tra cứu thông tin thủ tục</span>
              </p>
            </a>
            <!-- <a href="javascript:;" @click="goPage('danhgia')">
              <p class="icon pl-1 pr-2 pt-3"><img src="/o/opencps-store/js/kios_ver0/img/icon-evaluation.png"></p>
              <p class="ml-2 my-0">
                <span class="text-bold">Khảo sát</span><br>
                <span>Khảo sát mức độ hài lòng</span>
              </p>
            </a> -->
            <a href="javascript:;" @click="goPage('danhgiamucdohailong')">
              <p class="icon pl-1 pr-2 pt-3"><img src="/o/opencps-store/js/kios_ver0/img/icon-evaluation.png"></p>
              <p class="ml-2 my-0">
                <span class="text-bold">Đánh giá</span><br>
                <span>Đánh giá mức độ hài lòng</span>
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
      interVal: '',
      loading: true,
      isKios: true,
      wrapStyle: true,
      isMobile: false,
      isOneGate: false
    }),
    created () {
      var vm = this
      vm.$nextTick(function () {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        vm.$store.commit('setGroupid', newQuery.hasOwnProperty('groupIds') ? newQuery['groupIds'] : '')
        $('.mWrapper > header').css('display', 'none')
        $('.mWrapper > nav').css('display', 'none')
        $('.mWrapper > footer').css('display', 'none')
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
        try{
          if(typeof isOneGate !== 'undefined'){
            vm.isOneGate = isOneGate
          }
        }catch(err){
          
        }
      })
    },
    computed: {
      fullScreen () {
        return this.$store.getters.getFullScreen
      },
      groupIds () {
        return this.$store.getters.getGroupid
      }
    },
    mounted () {
      var vm = this
      vm.$nextTick(function () {
        $('.mWrapper > header').css('display', 'none')
        $('.mWrapper > nav').css('display', 'none')
        $('.mWrapper > footer').css('display', 'none')
      })
      this.onResize()
      window.addEventListener('resize', this.onResize, { passive: true })
    },
    beforeDestroy () {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.onResize, { passive: true })
      }
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentParams = newRoute.params
        let currentQuery = newRoute.query
        console.log('currentQuery', currentQuery)
        console.log('newRoute', newRoute)
        vm.$store.commit('setGroupid', currentQuery.hasOwnProperty('groupIds') ? currentQuery['groupIds'] : '')
        if (!currentQuery.hasOwnProperty('secretKey')) {
          // vm.setInterval()
          vm.isKios = true
          // console.log('isKios')
        } else {
          vm.isKios = false
          // console.log('NOT Kios')
        }
        if (newRoute['path'] && newRoute['path'] === '/tra-cuu-ho-so-homepage') {
          vm.wrapStyle = false
        } else {
          vm.wrapStyle = true
        }
      },
      isMobile (val) {
        let vm = this
        console.log('isMobile', val)
        if (val) {
          vm.$store.commit('setFullScreen', true)
          vm.$store.commit('setIsMobile', true)
        } else {
          vm.$store.commit('setIsMobile', false)
        }
      }
    },
    methods: {
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
      goPage (page) {
        var vm = this
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
          queryString = '/danh-gia-cldv'
        } else if (page === 'danhgiamucdohailong') {
          queryString = '/danh-gia-mdhl'
        }
        vm.$router.push({
          path: queryString,
          query: {
            groupIds: vm.groupIds,
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      },
      onResize () {
        let vm = this
        vm.isMobile = window.innerWidth < 1024
        vm.$store.commit('setIsMobile', vm.isMobile)
      }
    }
  }
</script>
