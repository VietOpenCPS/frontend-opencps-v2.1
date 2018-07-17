<template>
  <v-app>
    
    <v-navigation-drawer app clipped floating width="240">
      <div class="row-header" style="margin-top: 6px;">
        <div class="background-triangle-big"> <v-icon dark size="18">storage</v-icon> Tables </div> 
        <div class="layout row wrap header_tools row-blue">
          
        </div>
      </div>
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="7" />
        </content-placeholders>
      <v-list v-else class="py-0 nav_trang_thai_ho_so">
        <v-list-tile v-for="(item, index) in trangThaiHoSoList" :key="item.id" @click="toTableIndexing(item, index)">
          <v-list-tile-action>
            <v-icon size="18" color="primary" v-if="index == currentIndex">{{item.action_active}}</v-icon>
            <v-icon size="18" v-else>{{item.action}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    
    <v-content>
      <router-view></router-view>
    </v-content>
    
  </v-app>
</template>

<script>
  import router from '@/router'
  export default {
    data: () => ({
      isCallBack: true
    }),
    computed: {
      loading () {
        return this.$store.getters.loading
      },
      currentIndex () {
        return this.$store.getters.index
      },
      trangThaiHoSoList () {
        return this.$store.getters.loadtrangThaiHoSoList
      }
    },
    updated () {
      var vm = this
      vm.$nextTick(function () {
        let currentParams = vm.$router.history.current.params
        if (currentParams.hasOwnProperty('index') && vm.isCallBack) {
          vm.isCallBack = false
          vm.$store.commit('setIndex', currentParams.index)
        }
      })
    },
    methods: {
      toTableIndexing (item, index) {
        this.$store.commit('setIndex', index)
        router.push('/danh-sach-ho-so/' + index)
      }
    }
  }
</script>
