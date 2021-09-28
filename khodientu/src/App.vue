<template>
  <v-app id="khodientu" style="background-color: #f4f3ef !important;">
    <v-navigation-drawer app clipped floating width="0">
    </v-navigation-drawer>
    <v-content style="padding-top: 25px;">
      <v-layout wrap style="max-width: 1500px; margin: 0 auto; padding: 0 15px;">
        <v-flex xs12 md3 class="px-2">
          <v-card @click="redirectPage(1)" :color="activeTab === 1 ? '#11cdefeb' : 'white'" class="" hover style="border-radius: 12px;box-shadow: 0 6px 10px -4px rgb(0 0 0 / 15%);">
            <v-layout row>
              <v-flex style="max-width: 85px;">
                <v-img class="mx-3 my-3"
                  :src="activeTab === 1 ? '/documents/2832265/0/sohoa-icon1.png?t=3124231' : '/documents/2832265/0/sohoa-icon2.png'"
                  height="50px"
                  width="50px"
                  contain
                ></v-img>
              </v-flex>
              <v-flex>
                <v-card-title primary-title style="height: 100%;" class="px-2">
                  <div>
                    <div class="headline" :style="activeTab === 1 ? 'color: #ffffff;font-size: 20px !important' : 'color: #252422;font-size: 20px !important'">SỐ HÓA GIẤY TỜ</div>
                  </div>
                </v-card-title>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
        <v-flex xs12 md3 class="px-2">
          <v-card @click="redirectPage(2)" :color="activeTab === 2 ? '#11cdefeb' : 'white'" class="" hover style="border-radius: 12px;box-shadow: 0 6px 10px -4px rgb(0 0 0 / 15%);">
            <v-layout row>
              <v-flex style="max-width: 85px;">
                <v-img class="mx-3 my-3"
                  :src="activeTab === 2 ? '/documents/2832265/0/storage-icon1.png?t=93123123' : '/documents/2832265/0/storage-icon2.png'"
                  height="50px"
                  width="50px"
                  contain
                ></v-img>
              </v-flex>
              <v-flex>
                <v-card-title primary-title style="height: 100%;" class="px-2">
                  <div>
                    <div class="headline" :style="activeTab === 2 ? 'color: #ffffff;font-size: 20px !important' : 'color: #252422;font-size: 20px !important'">KHO GIẤY TỜ</div>
                  </div>
                </v-card-title>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
        <v-flex xs12 md3 class="px-2">
          <v-card @click="redirectPage(3)" :color="activeTab === 3 ? '#11cdefeb' : 'white'" class="" hover style="border-radius: 12px;box-shadow: 0 6px 10px -4px rgb(0 0 0 / 15%);">
            <v-layout row>
              <v-flex style="max-width: 85px;">
                <v-img class="mx-3 my-3"
                  :src="activeTab === 3 ? '/documents/2832265/0/list-icon1.png?t=9312312' : '/documents/2832265/0/list-icon2.png'"
                  height="45px"
                  width="45px"
                  contain
                ></v-img>
              </v-flex>
              <v-flex>
                <v-card-title primary-title style="height: 100%;" class="px-2">
                  <div>
                    <div class="headline" :style="activeTab === 3 ? 'color: #ffffff;font-size: 20px !important' : 'color: #252422;font-size: 20px !important'">DANH MỤC GIẤY TỜ</div>
                  </div>
                </v-card-title>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
        <!-- <v-flex xs12 md3 class="px-2">
          <v-card @click="redirectPage(4)" :color="activeTab === 4 ? '#11cdefeb' : 'white'" class="" hover style="border-radius: 12px;box-shadow: 0 6px 10px -4px rgb(0 0 0 / 15%);">
            <v-layout row>
              <v-flex style="max-width: 85px;">
                <v-img class="mx-3 my-3"
                  :src="activeTab === 4 ? '/documents/2832265/0/chart-icon1.png' : '/documents/2832265/0/chart-icon2.png'"
                  height="50px"
                  width="50px"
                  contain
                ></v-img>
              </v-flex>
              <v-flex>
                <v-card-title primary-title style="height: 100%;" class="px-2">
                  <div>
                    <div class="headline" :style="activeTab === 4 ? 'color: #ffffff;font-size: 20px !important' : 'color: #252422;font-size: 20px !important'">BÁO CÁO, THỐNG KÊ</div>
                  </div>
                </v-card-title>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex> -->
        <v-flex xs12 md3 class="px-2">
          <v-card @click="redirectPage(4)" :color="activeTab === 4 ? '#11cdefeb' : 'white'" class="" hover style="border-radius: 12px;box-shadow: 0 6px 10px -4px rgb(0 0 0 / 15%);">
            <v-layout row>
              <v-flex style="max-width: 85px;">
                <v-img class="mx-3 my-3"
                  :src="activeTab === 4 ? '/documents/2832265/0/applicant-icon1.png' : '/documents/2832265/0/applicant-icon2.png'"
                  height="50px"
                  width="50px"
                  contain
                ></v-img>
              </v-flex>
              <v-flex>
                <v-card-title primary-title style="height: 100%;" class="px-2">
                  <div>
                    <div class="headline" :style="activeTab === 4 ? 'color: #ffffff;font-size: 20px !important' : 'color: #252422;font-size: 20px !important'">
                      DỮ LIỆU NGƯỜI DÙNG  
                    </div>
                  </div>
                </v-card-title>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
      <transition name="slide-x-reverse-transition">
        <router-view></router-view>
      </transition>
    </v-content>
  </v-app>
</template>

<script>
  import axios from 'axios'
  export default {
    data: () => ({
      activeTab: 1
    }),
    components: {

    },
    computed: {
      
    },
    beforeDestroy () {

    },
    mounted () {
     
    },
    beforeCreate() {

    },
    created () {
      let vm = this
      if (!window.themeDisplay.isSignedIn()) {
        window.location.href = "/c/portal/logout"
      }
      try {
        let currentQuery = vm.$router.history.current
        if (currentQuery.name === 'SoHoaGiayTo') {
          vm.activeTab = 1
        } else if (currentQuery.name === 'KhoTaiLieu') {
          vm.activeTab = 2
        } else if (currentQuery.name === 'DanhMucGiayTo') {
          vm.activeTab = 3
        } else if (currentQuery.name === 'DuLieuCongDan') {
          vm.activeTab = 4
        }
      } catch (error) {
      }
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentParams = newRoute.params
        let currentQuery = newRoute.query
        try {
          if (newRoute.name === 'SoHoaGiayTo') {
            vm.activeTab = 1
          } else if (newRoute.name === 'KhoTaiLieu') {
            vm.activeTab = 2
          } else if (newRoute.name === 'DanhMucGiayTo') {
            vm.activeTab = 3
          } else if (newRoute.name === 'DuLieuCongDan') {
            vm.activeTab = 4
          }
        } catch (error) {
        }
      }
    },
    methods: {
      redirectPage (page) {
        let vm = this
        vm.activeTab = page
        let path = ''
        if (page === 1) {
          path = '/'
        } else if (page === 2) {
          path = '/kho-tai-lieu'
        } else if (page === 3) {
          path = '/danh-muc-giay-to'
        } else if (page === 4) {
          path = '/du-lieu-cong-dan'
        }
        vm.$router.push({
          path: path,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }
    }
  }
</script>

