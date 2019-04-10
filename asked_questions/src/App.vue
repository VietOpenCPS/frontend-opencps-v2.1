<template>
  <v-app id="app_asked_questions" style="background: #fff !important">
    <v-navigation-drawer app clipped floating width="250" v-if="getUser('Administrator')">
      <div class="mx-2 mb-2">
        <v-btn class="mx-0" block color="primary" v-on:click.native="addQuestion()"
        >
          <v-icon>add</v-icon>&nbsp;
          Thêm mới câu hỏi
        </v-btn>
      </div>
      <v-list class="pt-0">
        <v-list-tile @click="viewList">
          <v-list-tile-action class="ml-3">
            <v-icon color="primary">dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-badge color="blue" right class="mt-1">
              <span slot="badge">{{totalQuestion}}</span>
              <span class="mr-2">Danh sách câu hỏi</span>
            </v-badge>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <!-- <v-list-tile @click="getQuestionList" v-if="getUser('Administrator')">
          <v-list-tile-action class="ml-3">
            <v-icon color="green">question_answer</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-badge color="green" right class="mt-1">
              <span slot="badge" >{{questionListNew.length}}</span>
              <span class="mr-2">Câu hỏi mới</span>
            </v-badge>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider v-if="getUser('Administrator')"></v-divider> -->
      </v-list>
    </v-navigation-drawer>
    <v-content :style="!getUser('Administrator') ? 'width: 100%;max-width: 1200px;margin: 0 auto' : ''">
      <!-- <v-btn v-if="!getUser('Administrator')" @click.native="addQuestion()" round color="primary" dark style="position:absolute;top:0px;right:20px;z-index:101">
        <v-icon>near_me</v-icon>&nbsp;
        Gửi câu hỏi
      </v-btn> -->
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
    }),
    computed: {
      loading () {
        return this.$store.getters.loading
      },
      questionList () {
        return this.$store.getters.getQuestionList
      },
      questionListNew () {
        let vm = this
        return vm.getQuestionListNew(vm.questionList)
      },
      activeAddQuestion () {
        return this.$store.getters.getActiveAddQuestion
      },
      activeGetQuestion () {
        return this.$store.getters.getActiveGetQuestion
      },
      totalQuestion () {
        return this.$store.getters.getTotalQuestion
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        vm.getQuestionList()
      })
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentParams = newRoute.params
        let currentQuery = newRoute.query
      },
      activeGetQuestion () {
        let vm = this
        vm.getQuestionList()
      }
    },
    methods: {
      getQuestionList () {
        let vm = this
        vm.$store.commit('setLoading', true)
        vm.$store.dispatch('getQuestions').then(function (result) {
          vm.$store.commit('setLoading', false)
          if (Array.isArray(result)) {
            vm.$store.commit('setQuestionList', result)
          } else {
            vm.$store.commit('setQuestionList', [result])
          }
        }).catch(function (reject) {
          vm.$store.commit('setLoading', false)
        })
      },
      getQuestionListNew (questionList) {
        let vm = this
        let readed = []
        if (questionList.length > 0) {
          readed = questionList.filter(function (item) {
            return item.hasOwnProperty('read') && item['read'] === false
          })
        }
        return readed
      },
      addQuestion () {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        if (current['name'] === 'Landing') {
          vm.$store.commit('setActiveAddQuestion', true)
          setTimeout (function () {
            let elmnt = document.getElementById("contentQuestion")
            elmnt.scrollIntoView()
          }, 300)
        } else {
          vm.$router.push({
            path: '/',
            query: {
              crtQ: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
            }
          })
        }
      },
      getUser (roleItem) {
        let vm = this
        let roles = vm.$store.getters.getUser.role
        if (!roles) {
          return false
        }
        let roleExits = roles.findIndex(item => item === roleItem)
        return (roleExits >= 0)
      },
      viewList () {
        let vm = this
        vm.$router.push({
          path: '/'
        })
      }
    }
  }
</script>
