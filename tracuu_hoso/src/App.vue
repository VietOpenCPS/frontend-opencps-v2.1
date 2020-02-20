<template>
  <v-app id="app_tracuu_hoso" style="background: #fff !important">
    <v-content style="width: 100%;max-width: 1300px;margin: 0 auto">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>

  export default {
    data: () => ({
      isMobile: false
    }),
    computed: {
      loading () {
        return this.$store.getters.loading
      }
    },
    created () {
      let vm = this
      vm.$nextTick(function () {
        let searchParams = window.location.search.replace('?','')
        if (searchParams) {
          let params = vm.parse_query_string(searchParams)
          if (params.hasOwnProperty('id') && params.id && params.hasOwnProperty('secretKey') && params.secretKey) {
            let url = window.location.origin + window.location.pathname + '#/?id=' + params.id + '&secretKey=' + params.secretKey
            window.location.href = url
          }
        }
      })
    },
    beforeDestroy () {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.onResize, { passive: true })
      }
    },
    mounted () {
      this.onResize()
      window.addEventListener('resize', this.onResize, { passive: true })
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentParams = newRoute.params
        let currentQuery = newRoute.query
      }
    },
    methods: {
      onResize () {
        let vm = this
        vm.isMobile = window.innerWidth < 1024
      },
      parse_query_string (query) {
        let vars = query.split('&')
        let query_string = {}
        for (let i = 0; i < vars.length; i++) {
          let pair = vars[i].split('=')
          let key = decodeURIComponent(pair[0])
          let value = decodeURIComponent(pair[1])
          if (typeof query_string[key] === 'undefined') {
            query_string[key] = decodeURIComponent(value)
          } else if (typeof query_string[key] === 'string') {
            let arr = [query_string[key], decodeURIComponent(value)]
            query_string[key] = arr
          } else {
            query_string[key].push(decodeURIComponent(value))
          }
        }
        return query_string
      }
    }
  }
</script>
