<template>
  <v-app id="app_report_charts">
    <v-content>
      <router-view></router-view>
      <div style="position:fixed;top:250px;right:0;width: 34px;background-color:#ffffff;
        border-radius:15px;border-top-right-radius: 0;border-bottom-right-radius: 0;border: 1.5px solid #dedede;border-right: 0">
        <v-tooltip left>
          <v-btn slot="activator" flat icon color="blue" class="mx-0 my-0" style="width: 32px; height:32px" @click="goTo('thong-ke')">
            <v-icon size="20">pie_chart</v-icon>
          </v-btn>
          <span>Thống kê chung</span>
        </v-tooltip>
        <v-tooltip left>
          <v-btn slot="activator" flat icon color="green" class="mx-0 my-0" style="width: 32px;height:32px" @click="goTo('tra-cuu-ho-so')">
            <v-icon size="20">book</v-icon>
          </v-btn>
          <span>Theo dõi tình hình giải quyết</span>
        </v-tooltip>
        <v-tooltip left>
          <v-btn slot="activator" flat icon color="teal" class="mx-0 my-0" style="width: 32px;height:32px" @click="goTo('thong-ke#/danh-gia-hai-long')">
            <v-icon size="20">assignment_turned_in</v-icon>
          </v-btn>
          <span>Đánh giá sự hài lòng của NLTT khi thực hiện dịch vụ công trực tuyến</span>
        </v-tooltip>
        <v-tooltip left>
          <v-btn slot="activator" flat icon color="orange" class="mx-0 my-0" style="width: 32px;height:32px" @click="goTo('thong-ke#/chi-so-danh-gia')">
            <v-icon size="20">assignment_turned_in</v-icon>
          </v-btn>
          <span>Đánh giá chỉ số giải quyết thủ tục hành hính</span>
        </v-tooltip>
        <!-- <v-menu left offset-x open-on-hover>
          <v-btn slot="activator" flat icon color="teal" class="mx-0 my-0" style="width: 32px;height:32px">
            <v-icon size="20">assignment_turned_in</v-icon>
          </v-btn>
          <v-list>
            <p class="text-bold primary--text px-3 pt-2">TÌNH HÌNH ĐÁNH GIÁ THỦ THỤC HÀNH CHÍNH<p>
            <v-list-tile @click="goTo('thong-ke#/danh-gia-hai-long')">
              <v-list-tile-title >Đánh giá DVC mức độ 3, 4</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="goTo('thong-ke#/chi-so-danh-gia')">
              <v-list-tile-title @click="goTo('thong-ke#/chi-so-danh-gia')">Chỉ số đánh giá giải quyết TTHC</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu> -->
        <!-- <v-tooltip left>
          <v-btn slot="activator" flat icon color="orange" class="mx-0 my-0" style="width: 32px;height:32px" @click="goTo('tra-cuu-ho-so')">
            <v-icon size="20">search</v-icon>
          </v-btn>
          <span>Tra cứu thông tin hồ sơ</span>
        </v-tooltip> -->
        <!-- <v-menu left offset-x open-on-hover>
          <v-btn slot="activator" flat icon color="orange" class="mx-0 my-0" style="width: 32px;height:32px">
            <v-icon size="20">perm_identity</v-icon>
          </v-btn>
          <v-list>
            <p class="text-bold primary--text px-3 pt-2">TÌNH HÌNH ĐÁNH GIÁ CÁN BỘ<p>
            <v-list-tile @click="goTo('thong-ke#/danh-gia-can-bo')">
              <v-list-tile-title>Đánh giá cán bộ qua Kiosk</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="goTo('thong-ke#/tinh-hinh-giai-quyet')">
              <v-list-tile-title>Tình hình xử lý hồ sơ của cán bộ</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu> -->
      </div>
    </v-content>
  </v-app>
</template>

<script>
  import GoTop from '@inotom/vue-go-top'

  export default {
    props: ['index'],
    data: () => ({
      dialog: false,
      loadingDelay: false,
      drawer: null,
      dataSocket: {}
    }),
    components: {
      GoTop
    },
    computed: {
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
    methods: {
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
      },
      changeReportType (data) {
        let vm = this
        for (let key in vm.itemsReports) {
          if (vm.itemsReports[key]['document'] === data) {
            vm.$router.push('/bao-cao/' + vm.itemsReports[key]['code'])
            break
          }
        }
      },
      goTo (page) {
        let vm = this
        let url = window.themeDisplay.getSiteAdminURL().split('/~')[0].replace('group','web')
        window.location.href = url + '/' + page
      }
    }
  }
</script>
