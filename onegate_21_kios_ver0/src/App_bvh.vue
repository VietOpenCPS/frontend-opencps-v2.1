<template>
  <v-app>
    <v-content>
      <section :class="isKios ? 'kios-content-wrapper' : ''" >
        <div :class="isKios ? 'tab-item' : ''" style="overflow:visible!important">
          <div class="left" :class="fullScreen ? 'smallScreen' : ''">
            <a href="javascript:;" class="active" @click="goPage('ketquahoso')">
              <p class="icon px-2"><img src="https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend/kios/img/icons-document.png"></p>
              <p class="ml-2 my-0">
                <span class="text-bold">Kết quả hồ sơ</span><br>
                <span>Tra cứu kết quả hồ sơ</span>
              </p>
            </a>
            <a href="javascript:;" class="active" @click="goPage('tracuuhoso')">
              <p class="icon px-2"><img src="https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend/kios/img/icons-search-50.png"></p>
              <p class="ml-2 my-0">
                <span class="text-bold">Tra cứu hồ sơ</span><br>
                <span>Tra cứu thông tin hồ sơ</span>
              </p>
            </a>
            <a href="javascript:;" @click="goPage('tracuuthutuc')">
              <p class="icon px-2"><img src="https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend/kios/img/icon-search-dc-50.png"></p>
              <p class="ml-2 my-0">
                <span class="text-bold">Tra cứu thủ tục</span><br>
                <span>Tra cứu thông tin thủ tục</span>
              </p>
            </a>
            <a href="javascript:;" @click="goPage('danhgia')">
              <p class="icon pl-1 pr-2"><img src="https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend/kios/img/icon-evaluation.png"></p>
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
      interVal: '',
      loading: true,
      isKios: true
    }),
    created () {
      var vm = this
      vm.$nextTick(function () {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        console.log('current', current)
        $('.mWrapper > header').css('display', 'none')
        $('.mWrapper > nav').css('display', 'none')
        $('.mWrapper > footer').css('display', 'none')
        if (!newQuery.hasOwnProperty('secretKey')) {
          vm.isKios = true
          // console.log('isKios')
        } else {
          vm.isKios = false
          // console.log('NOT Kios')
        }
        // 
        let href = window.location.search
        let dataParams = new URLSearchParams(href)
        let paramsValue = dataParams.get('QRSCAN')
        if (paramsValue) {
          let dossierNoParam = paramsValue.split('-')[0]
          let secretKeyParam = paramsValue.split('-')[1]
          if (href.indexOf('QRSCAN') >= 0 && paramsValue) {
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
            console.log('newQuery KIOS 555', queryString)
          }
        }
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
        console.log('newRoute', newRoute)
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
        } else if (page === 'tracuuhoso') {
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
