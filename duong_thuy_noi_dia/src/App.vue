<template>
  <v-app>
    <v-content v-if="!isKeToan">

      <!-- <v-btn color="primary" fab small dark @click="drawer = !drawer" class="show-draw">
        <v-icon>list</v-icon>
      </v-btn> -->

      <router-view></router-view>

      <!-- <v-speed-dial
        v-if="!showDraw"
        top
        left
        direction="top"
        open-on-hover
        transition="fade-transition"
      >
        
      </v-speed-dial> -->

      <!-- <v-btn color="primary" fab small dark @click="drawer = !drawer" class="show-draw">
        <v-icon>list</v-icon>
      </v-btn> -->

      <v-speed-dial fixed top right transition="slide-x-reverse-transition" v-model="fab" 
        v-if="tinMois.length > 0 && (initData.user.isKeHoach || initData.user.isThuTuc)"
        direction="left"
        >

        <v-btn slot="activator" v-model="fab" fab dark color="deep-orange darken-1">
          <v-icon>notifications_active</v-icon>
          <v-icon>close</v-icon>
        </v-btn>

        <v-menu :nudge-bottom="2" open-on-hover bottom offset-y>
          <v-btn slot="activator" color="indigo" dark v-if="initData.user.isThuTuc">
            <v-icon>new_releases</v-icon> &nbsp;
            Thủ tục
          </v-btn>
          <v-list v-for="(item, index) in tinMois" v-bind:key="index" v-if="item.role === 4 || item.role === '4' || item.role === 0 || item.role === '0'">
            <div class="px-3" style="cursor: pointer;" @click="toDetailNoti(item, false)">
              <div class="list__tile__title">
                <span class="text-bold primary--text">{{item.documentName}}</span> - {{item.latestDate | moment("DD/MM/YYYY | HH:mm")}}
              </div>
              <div class="list__tile__title">
                <span class="text-bold primary--text">{{item.nameThanhPhan}}</span> - {{item.remarks}}
              </div>
            </div>
          </v-list>
        </v-menu>
        
        <v-menu :nudge-bottom="2" open-on-hover bottom offset-y>
          <v-btn slot="activator" color="green" dark v-if="initData.user.isKeHoach">
            <v-icon>new_releases</v-icon> &nbsp;
            Kế hoạch
          </v-btn>
          <v-list v-for="(item, index) in tinMois" v-bind:key="index" v-if="item.role === 2 || item.role === '2' || item.role === 0 || item.role === '0'">
            <div class="px-3" style="cursor: pointer;" @click="toDetailNoti(item, true)">
              <div class="list__tile__title">
                <span class="text-bold primary--text">{{item.documentName}}</span> - {{item.latestDate | moment("DD/MM/YYYY | HH:mm")}}
              </div>
              <div class="list__tile__title">
                <span class="text-bold primary--text">{{item.nameThanhPhan}}</span> - {{item.remarks}}
              </div>
            </div>
          </v-list>
        </v-menu>

      </v-speed-dial>

    </v-content>

    <v-content v-else>
  
      <router-view></router-view>

    </v-content>
  </v-app>
</template>
<script>
  import $ from 'jquery'
  import router from '@/router'
  // import axios from 'axios'
  export default {
    data: () => ({
      fab: false,
      tinMois: [],
      initData: null,
      isKeToan: false,
      showDraw: false
    }),
    computed: {
      drawer: {
        get () {
          return this.$store.getters.drawer
        },
        set (val) {
          this.$store.commit('setDrawer', val)
        }
      }
    },
    created () {
      var vm = this
      // var dataPost = new URLSearchParams()
      // dataPost.append('payload', JSON.stringify([{ccc: 'cccc'}]))
      // axios.post('/ccccc', dataPost, {
      //   headers: {
      //     groupId: 55217
      //   }
      // })
      vm.$nextTick(function () {
        console.log('created app.vue')
        vm.$store.dispatch('loadInitResource').then(function (result) {
          vm.initData = result
          vm.isKeToan = vm.initData.user.isKeToan
          let emailNameHeader = document.getElementById('emailNameHeader')
          if (emailNameHeader !== null && emailNameHeader !== undefined && emailNameHeader !== 'undefined') {
            emailNameHeader.innerHTML = vm.initData.user.userName
          }
          if (vm.initData.user.isDongBo && !vm.initData.user.isLanhDao && !vm.initData.user.isVanThu) {
            let quanTriPageHeader = document.getElementById('quanTriPageHeader')
            quanTriPageHeader.innerHTML = '<a style="margin-right: 15px;" href="/group/dong-bo"><i style="font-size: 14px;" aria-hidden="true" class="icon material-icons">edit</i> Thông tin danh mục, chữ ký số</a>'
          }
          let currentParams = vm.$router.history.current.params
          if (currentParams.type === 'lanh_dao' && !vm.initData.user.isLanhDao) {
            router.push('/permission')
          } else if (currentParams.type === 'van_thu' && !vm.initData.user.isVanThu) {
            router.push('/permission')
          } else if (currentParams.type === 'ke_hoach' && !vm.initData.user.isKeHoach) {
            router.push('/permission')
          } else if (currentParams.type === 'thu_tuc' && !vm.initData.user.isThuTuc) {
            router.push('/permission')
          }
          $('#navigation>ul>li.extend').remove()
          let textTmp = ''
          if (currentParams.type === 'ke_hoach') {
            textTmp = 'Kế hoạch'
          } else {
            textTmp = 'Thủ tục'
          }
          $('#navigation>ul').append('<li class="extend" style="float: right;"><a href="javascript:;"><span style="color: #5093DA; font-weight: bold;">' + textTmp + '</span></a></li>')
        })
        vm.$store.dispatch('getTinMois').then(function (result) {
          if (result !== null && result !== undefined && result !== 'undefined') {
            vm.tinMois = result
          } else {
            vm.tinMois = []
          }
        })
      })
    },
    watch: {
      // 'drawer': function (val) {
      //   console.log('drawer+++++++++++', this.drawer)
      //   this.showDraw = this.drawer
      // },
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let newtype = newRoute.params.type
        console.log('newtype', newtype)
        if (vm.initData !== null && vm.initData !== undefined && vm.initData !== 'undefined') {
          vm.$store.dispatch('getTinMois').then(function (result) {
            if (result !== null && result !== undefined && result !== 'undefined') {
              vm.tinMois = result
            } else {
              vm.tinMois = []
            }
          })
          if (newtype === 'lanh_dao' && !vm.initData.user.isLanhDao) {
            router.push('/permission')
          } else if (newtype === 'van_thu' && !vm.initData.user.isVanThu) {
            router.push('/permission')
          } else if (newtype === 'ke_hoach' && !vm.initData.user.isKeHoach) {
            router.push('/permission')
          } else if (newtype === 'thu_tuc' && !vm.initData.user.isThuTuc) {
            router.push('/permission')
          } else if (newtype === 'ke_toan' && !vm.initData.user.isKeToan) {
            router.push('/permission')
          } else {
            $('#navigation>ul>li.extend').remove()
            let textTmp = ''
            if (newtype === 'ke_hoach') {
              textTmp = 'Kế hoạch'
            } else {
              textTmp = 'Thủ tục'
            }
            $('#navigation>ul').append('<li class="extend" style="float: right;"><a href="javascript:;"><span style="color: #5093DA; font-weight: bold;">' + textTmp + '</span></a></li>')
          }
        }
      }
    },
    destroyed () {
      $('#navigation>ul>li.extend').remove()
    },
    methods: {
      toDetailNoti (item, isKeHoach) {
        if (isKeHoach) {
          router.push('/ho-so/ke_hoach/' + item.documentName + '/' + item.documentYear + '/' + item.documentTypeCode + '/' + item.documentRequestState)
        } else {
          router.push('/ho-so/thu_tuc/' + item.documentName + '/' + item.documentYear + '/' + item.documentTypeCode + '/' + item.documentStatusCode)
        }
      }
    }
  }
</script>
