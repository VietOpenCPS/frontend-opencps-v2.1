<template>
  <v-app>
    <v-content>
      <router-view></router-view>
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
      loading: true
    }),
    created () {
      var vm = this
      vm.$nextTick(function () {
        $('.mWrapper > header').css('display', 'none')
        $('.mWrapper > nav').css('display', 'none')
        $('.mWrapper > footer').css('display', 'none')
        vm.setInterval()
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
