<template>
  <v-app id="app_deliverable">
    <v-navigation-drawer app clipped floating width="316">
      <v-text-field
        v-model="keywordFilter"
        class="search-input-appbar input-search d-inline-block"
        style="width: 100%;
          border: 1px solid #dedede;
          border-radius: 3px;"
        single-lines
        hide-details
        solo
        flat
        height="32"
        min-height="32"
        clearable
        @keyup.enter="filterDeliverableType"
        @input="filterDeliverableType"
        placeholder="Nhập từ khóa tìm kiếm"
        autofocus
      ></v-text-field>
      <v-list dense>
        <v-list-tile
          v-for="(item, indexItem) in items"
          :key="indexItem"
          @click="menuSelect(indexItem)"
        >
          <v-list-tile-action>
            <v-icon v-if="String(indexItem) === String(index)" color="blue darken-3">description</v-icon>
            <v-icon v-else>description</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title :title="item.typeName" :style="String(indexItem) === String(index) ? 'color: #658a04 !important' : ''">{{ item.typeName }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-snackbar
      v-model="snackbarerror"
      :bottom="false"
      :left="false"
      :multi-line="false"
      :right="true"
      :timeout="2000"
      :top="true"
      :vertical="false"
      color="red darken-3"
    >
      Yêu cầu thực hiện thất bại
      <v-btn
        icon
        @click="closeError()"
      >
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="snackbarsocket"
      :bottom="true"
      :left="false"
      :multi-line="true"
      :right="false"
      :timeout="0"
      :top="true"
      :vertical="false"
      color="red darken-3"
    >
      <v-progress-circular
        :size="20"
        :width="1"
        color="white"
        indeterminate
      ></v-progress-circular>
      &nbsp;
      Mất kết nối, tự động kết nối lại trong giây lát ... 
      
      <v-btn
        icon
        @click="reloadPage()"
      >
        <v-icon>replay</v-icon>
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
  export default {
    props: ['index'],
    data: () => ({
      dialog: false,
      drawer: null,
      dataSocket: {},
      keywordFilter: '',
      functionTimeOut: null
    }),
    created () {
      let vm = this
      vm.$nextTick(function () {
        let params = vm.$router.history.current.params
        vm.index = params['index']
        vm.keywordFilter = ''
      })
    },
    computed: {
      // items () {
      //   return this.$store.getters.getDeliverableTypes
      // },
      items () {
        return this.$store.getters.getDeliverableTypesFilter
      },
      snackbarerror: {
        // getter
        get: function() {
          return this.$store.getters.getsnackbarerror
        },
        // setter
        set: function(newValue) {
          this.$store.commit('setsnackbarerror', newValue)
        }
      },
      snackbarsocket: {
        // getter
        get: function() {
          return this.$store.getters.getsnackbarsocket
        },
        // setter
        set: function(newValue) {
          this.$store.commit('setsnackbarsocket', newValue)
        }
      }
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentQuery = newRoute.query
        let params = newRoute.params
        vm.index = params['index']
        console.log('newRoute', newRoute)
        console.log('currentQuery', currentQuery)
        if (newRoute.path === '/' && newRoute.hash === '') {
          window.history.back()
        }
      }
    },
    methods: {
      filterDeliverableType () {
        let vm = this
        let keyword = String(vm.keywordFilter).toLowerCase().replace(/\n/g, "").trim()
        let listViewFull = vm.$store.getters.getDeliverableTypes
        let listViewFilter = listViewFull.filter(function (item) {
          return String(item.typeName).toLowerCase().replace(/\n/g, "").indexOf(keyword) >= 0
        })
        if (vm.functionTimeOut) {
          clearTimeout(vm.functionTimeOut)
        }
        vm.functionTimeOut = setTimeout(function () {
          if (keyword && keyword.length >= 3) {
            if (listViewFilter && listViewFilter.length) {
              vm.$store.commit('setDeliverableTypesFilter', listViewFilter)
            } else {
              vm.$store.commit('setDeliverableTypesFilter', listViewFull)
            }
          } else {
            vm.$store.commit('setDeliverableTypesFilter', listViewFull)
          }
        }, 500)
      },
      menuSelect (index) {
        let vm = this
        vm.$router.push('/danh-sach-giay-to/' + index + '?t=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1)
      },
      redirectFilter(val) {
        this.$router.push(val + '?state_change=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1)
      },
      closeError() {
        this.$store.commit('setsnackbarerror', false)
      },
      reloadPage() {
        window.location.reload(true)
      },
      deliverableRouter (item) {
        console.log(item)
      }
    }
  }
</script>