<template>
  <v-app id="app_asked_questions" style="background: #fff !important">
    <v-navigation-drawer app clipped floating width="255" v-if="gopY || getUser('Administrator') || getUser('Administrator_data') || getUser('tra_loi_hoi_dap')">
      <div class="" v-if="gopY">
        <v-btn class="px-0 my-0 ml-0" block color="primary" v-on:click.native="addQuestion"
          style="height:36px"
        >
          <v-icon size="22" color="white">add</v-icon>&nbsp;
          Gửi góp ý
        </v-btn>
      </div>
      <v-list class="pt-0" v-if="!phanAnhKienNghi && !gopY">
        <v-list-tile :style="activeTab === 0 ? 'border-left: 7px solid #00aeef' : ''">
          <v-list-tile-content class="pl-2" @click="filterQuestion(0, 'all')">
            <v-list-tile-title>Tất cả câu hỏi</v-list-tile-title>
            <span class="status__counter" style="color:#0b72ba!important">
              {{totalQuestionCounter}}
            </span>
          </v-list-tile-content>
        </v-list-tile>
        <!-- <v-divider class="my-0"></v-divider>
        <v-list-tile :style="activeTab === 5 ? 'border-left: 7px solid #00aeef' : ''">
          <v-list-tile-content class="pl-2" @click="filterQuestion(5, 'questionType=FAQ')">
            <v-list-tile-title>Công dân hỏi đáp</v-list-tile-title>
            <span class="status__counter" style="color:#0b72ba!important">
              {{totalFAQ}}
            </span>
          </v-list-tile-content>
        </v-list-tile> -->
        <v-divider class="my-0"></v-divider>
        <v-list-tile :style="activeTab === 1 ? 'border-left: 7px solid #00aeef' : ''">
          <v-list-tile-content class="pl-2" @click="filterQuestion(1, 'answered=true')">
            <v-list-tile-title>Câu hỏi đã trả lời</v-list-tile-title>
            <span class="status__counter" style="color:#0b72ba!important">
              {{totalAnswered}}
            </span>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="my-0"></v-divider>
        <v-list-tile :style="activeTab === 2 ? 'border-left: 7px solid #00aeef' : ''">
          <v-list-tile-content class="pl-2" @click="filterQuestion(2, 'answered=false')">
            <v-list-tile-title>Câu hỏi chưa trả lời</v-list-tile-title>
            <span class="status__counter" style="color:#0b72ba!important">
              {{totalNotAnswer}}
            </span>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="my-0"></v-divider>
        <v-list-tile :style="activeTab === 3 ? 'border-left: 7px solid #00aeef' : ''">
          <v-list-tile-content class="pl-2" @click="filterQuestion(3, 'publish=1')">
            <v-list-tile-title>Câu hỏi công khai</v-list-tile-title>
            <span class="status__counter" style="color:#0b72ba!important">
              {{totalPublished}}
            </span>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="my-0"></v-divider>
        <v-list-tile :style="activeTab === 4 ? 'border-left: 7px solid #00aeef' : ''">
          <v-list-tile-content class="pl-2" @click="filterQuestion(4, 'publish=0')">
            <v-list-tile-title>Câu hỏi không công khai</v-list-tile-title>
            <span class="status__counter" style="color:#0b72ba!important">
              {{totalNotPublish}}
            </span>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="my-0"></v-divider>
      </v-list>
      <!--  -->
      <v-list class="pt-0" v-if="phanAnhKienNghi">
        <v-list-tile :style="activeTab === 0 ? 'border-left: 7px solid #00aeef' : ''">
          <v-list-tile-content class="pl-2" @click="filterQuestion(0, 'questionType=PAKN')">
            <v-list-tile-title>Tổng số kiến nghị</v-list-tile-title>
            <span class="status__counter" style="color:#0b72ba!important">
              {{totalQuestionCounter}}
            </span>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="my-0"></v-divider>

        <v-list-tile :style="activeTab === 1 ? 'border-left: 7px solid #00aeef' : ''">
          <v-list-tile-content class="pl-2" @click="filterQuestion(1, 'questionType=PAKN&answered=true')">
            <v-list-tile-title>Kiến nghị đã trả lời</v-list-tile-title>
            <span class="status__counter" style="color:#0b72ba!important">
              {{totalAnswered}}
            </span>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="my-0"></v-divider>
        <v-list-tile :style="activeTab === 2 ? 'border-left: 7px solid #00aeef' : ''">
          <v-list-tile-content class="pl-2" @click="filterQuestion(2, 'questionType=PAKN&answered=false')">
            <v-list-tile-title>Kiến nghị chưa trả lời</v-list-tile-title>
            <span class="status__counter" style="color:#0b72ba!important">
              {{totalNotAnswer}}
            </span>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="my-0"></v-divider>
        <v-list-tile :style="activeTab === 3 ? 'border-left: 7px solid #00aeef' : ''">
          <v-list-tile-content class="pl-2" @click="filterQuestion(3, 'questionType=PAKN&publish=1')">
            <v-list-tile-title>Kiến nghị công khai</v-list-tile-title>
            <span class="status__counter" style="color:#0b72ba!important">
              {{totalPublished}}
            </span>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="my-0"></v-divider>
        <v-list-tile :style="activeTab === 4 ? 'border-left: 7px solid #00aeef' : ''">
          <v-list-tile-content class="pl-2" @click="filterQuestion(4, 'questionType=PAKN&publish=0')">
            <v-list-tile-title>Kiến nghị không công khai</v-list-tile-title>
            <span class="status__counter" style="color:#0b72ba!important">
              {{totalNotPublish}}
            </span>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="my-0"></v-divider>
      </v-list>
      <!--  -->
      <v-list class="pt-0" v-if="gopY">
        <v-list-tile :style="activeTab === 0 ? 'border-left: 7px solid #00aeef' : ''">
          <v-list-tile-content class="pl-2" @click="filterQuestion(0, 'questionType=GOPY')">
            <v-list-tile-title>Tổng số góp ý</v-list-tile-title>
            <span class="status__counter" style="color:#0b72ba!important">
              {{totalQuestionCounter}}
            </span>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="my-0"></v-divider>

        <v-list-tile :style="activeTab === 1 ? 'border-left: 7px solid #00aeef' : ''">
          <v-list-tile-content class="pl-2" @click="filterQuestion(1, 'questionType=GOPY&answered=true')">
            <v-list-tile-title>Góp ý đã được trả lời</v-list-tile-title>
            <span class="status__counter" style="color:#0b72ba!important">
              {{totalAnswered}}
            </span>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="my-0"></v-divider>
        <v-list-tile :style="activeTab === 2 ? 'border-left: 7px solid #00aeef' : ''">
          <v-list-tile-content class="pl-2" @click="filterQuestion(2, 'questionType=GOPY&answered=false')">
            <v-list-tile-title>Góp ý chưa được trả lời</v-list-tile-title>
            <span class="status__counter" style="color:#0b72ba!important">
              {{totalNotAnswer}}
            </span>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-content :style="(!gopY && !getUser('Administrator') && !getUser('Administrator_data') && !getUser('tra_loi_hoi_dap')) ? 'width: 100%;max-width: 1300px;margin: 0 auto' : ''">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  import axios from 'axios'
  export default {
    data: () => ({
      activeTab: 0,
      totalQuestionCounter: 0,
      totalAnswered: 0,
      totalNotAnswer: 0,
      totalPublished: 0,
      totalNotPublish: 0,
      totalFAQ: 0,
      agencyList: [],
      phanAnhKienNghi: false,
      gopY: false,
      admin_gopy: false,
      titleData: 'câu hỏi',
      agencyCurrent: ''
    }),
    computed: {
      loading () {
        return this.$store.getters.loading
      },
      questionList () {
        return this.$store.getters.getQuestionList
      },
      activeAddQuestion () {
        return this.$store.getters.getActiveAddQuestion
      },
      activeGetQuestion () {
        return this.$store.getters.getActiveGetQuestion
      },
      keyword () {
        return this.$store.getters.getKeywordFilter
      },
      agencyFilterSelected () {
        return this.$store.getters.getAgencyFilter
      },
      lvdsFilterSelected () {
        return this.$store.getters.getLvdsFilter
      },
      lvttFilterSelected () {
        return this.$store.getters.getLvttFilter
      },
      activeCounter () {
        return this.$store.getters.getCounter
      }
    },
    created () {
      var vm = this
      try {
        vm.phanAnhKienNghi = phanAnhKienNghiPage
        if (vm.phanAnhKienNghi) {
          vm.titleData = 'kiến nghị'
        }
      } catch (error) {
      }
      try {
        vm.gopY = gopY
        if (vm.gopY) {
          vm.titleData = 'góp ý'
        }
      } catch (error) {
      }
      try {
        vm.admin_gopy = admin_gopy
      } catch (error) {
      }
      vm.$nextTick(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        if (vm.gopY && !vm.admin_gopy) {
          if (vm.agencyCurrent) {
            vm.getQuestionList()
            vm.getCounter()
          } else {
            vm.getAgencyConfigs()
          }
        } else {
          vm.getQuestionList()
          vm.getCounter()
        }
      })
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentParams = newRoute.params
        let currentQuery = newRoute.query
        vm.getQuestionList()
      },
      activeGetQuestion () {
        let vm = this
        vm.getQuestionList()
        vm.getCounter()
      },
      activeCounter () {
        let vm = this
        vm.getQuestionList()
        vm.getCounter()
      }
    },
    methods: {
      getQuestionList () {
        let vm = this
        let current = vm.$router.history.current
        let query = current.query
        let filter = {
          agencyCode: vm.agencyFilterSelected && vm.agencyFilterSelected['itemCode'] ? vm.agencyFilterSelected['itemCode'] : '',
          domainCode: vm.lvttFilterSelected ? vm.lvttFilterSelected['domainCode'] : '',
          keyword: vm.keyword ? vm.keyword : '',
          publish: query.hasOwnProperty('publish') ? query['publish'] : '',
          answered: query.hasOwnProperty('answered') ? query['answered'] : '',
          subDomainCode: vm.lvdsFilterSelected ? vm.lvdsFilterSelected['itemCode'] : '',
          questionType: vm.typeFilterSelected ? vm.typeFilterSelected : (query.hasOwnProperty('questionType') ? query['questionType'] : '')
        }
        try {
          if (agencyCodeSite) {
            filter.agencyCode = agencyCodeSite
          }
        } catch (error) {
        }
        if (vm.phanAnhKienNghi) {
          filter.questionType = "PAKN"
        }
        if (vm.gopY) {
          filter.questionType = "GOPY"
        }
        if (vm.gopY && !vm.admin_gopy) {
          filter.agencyCode = vm.agencyCurrent['code']
        }
        if (vm.admin_gopy) {
          filter.agencyCode = vm.agencyFilterSelected ? vm.agencyFilterSelected['code'] : ''
        }
        vm.$store.commit('setLoading', true)
        vm.$store.dispatch('getQuestions', filter).then(function (result) {
          vm.$store.commit('setLoading', false)
          let questionList = []
          if (Array.isArray(result)) {
            questionList = result
            vm.$store.commit('setQuestionList', questionList)
          } else {
            questionList = [result]
            vm.$store.commit('setQuestionList', questionList)
          }
        }).catch(function (reject) {
          vm.$store.commit('setLoading', false)
          vm.$store.commit('setQuestionList', reject)
        })
      },
      getCounter () {
        let vm = this
        let current = vm.$router.history.current
        let query = current.query
        let filter = {
          agencyCode: '',
          publish: '',
          answered: '',
          questionType: vm.phanAnhKienNghi ? 'PAKN' : '',
          gopY: vm.gopY
        }
        if (vm.gopY) {
          filter.questionType = 'GOPY'
        }
        // vm.$store.commit('setLoading', true)
        try {
          if (agencyCodeSite) {
            filter.agencyCode = agencyCodeSite
          }
        } catch (error) {
        }
        if (vm.gopY && !vm.admin_gopy) {
          filter.agencyCode = vm.agencyCurrent['code']
        }
        vm.$store.dispatch('getQuestionsCounter', filter).then(function (result) {
          vm.$store.commit('setLoading', false)
          vm.totalQuestionCounter = result['total']
          // 
          let filter1 = {
            agencyCode: '',
            publish: 1,
            answered: '',
            questionType: vm.phanAnhKienNghi ? 'PAKN' : '',
            gopY: vm.gopY
          }
          if (vm.gopY) {
            filter1.questionType = 'GOPY'
          }
          try {
            if (agencyCodeSite) {
              filter1.agencyCode = agencyCodeSite
            }
          } catch (error) {
          }
          if (vm.gopY && !vm.admin_gopy) {
            filter1.agencyCode = vm.agencyCurrent['code']
          }
          vm.$store.dispatch('getQuestionsCounter', filter1).then(function (result1) {
            vm.totalPublished = result1['total']
            vm.totalNotPublish = Number(vm.totalQuestionCounter) - Number(vm.totalPublished)
          }).catch(function(reject) {
            vm.totalPublished = 0
            vm.totalNotPublish = Number(vm.totalQuestionCounter) - Number(vm.totalPublished)
          })
          //
          let filter2 = {
            agencyCode: '',
            publish: '',
            answered: true,
            questionType: vm.phanAnhKienNghi ? 'PAKN' : '',
            gopY: vm.gopY
          }
          if (vm.gopY) {
            filter2.questionType = 'GOPY'
          }
          try {
            if (agencyCodeSite) {
              filter2.agencyCode = agencyCodeSite
            }
          } catch (error) {
          }
          if (vm.gopY && !vm.admin_gopy) {
            filter2.agencyCode = vm.agencyCurrent['code']
          }
          console.log('filterCounter 2', filter2)
          vm.$store.dispatch('getQuestionsCounter', filter2).then(function (result2) {
            vm.totalAnswered = result2['total']
            vm.totalNotAnswer = Number(vm.totalQuestionCounter) - Number(vm.totalAnswered)
          }).catch(function(reject) {
            vm.totalAnswered = 0
            vm.totalNotAnswer = Number(vm.totalQuestionCounter) - Number(vm.totalAnswered)
          })
          // 
          let filter3 = {
            agencyCode: '',
            publish: '',
            questionType: vm.phanAnhKienNghi ? 'PAKN' : 'FAQ'
          }
          if (vm.gopY) {
            filter3.questionType = 'GOPY'
          }
          if (vm.gopY && !vm.admin_gopy) {
            filter3.agencyCode = vm.agencyCurrent['code']
          }
          vm.$store.dispatch('getQuestionsCounter', filter3).then(function (result2) {
            vm.totalFAQ = result2['total']
          }).catch(function(reject) {
            vm.totalFAQ = 0
          })
        }).catch(function (reject) {
          vm.totalQuestionCounter = 0
          vm.totalPublished = 0
          vm.totalNotPublish = 0
          vm.totalAnswered = 0
          vm.totalNotAnswer = 0
          vm.totalFAQ = 0
        })
      },
      filterQuestion (index, target) {
        let vm = this
        vm.$store.commit('setAgencyFilter', '')
        vm.$store.commit('setKeywordFilter', '')
        vm.activeTab = index
        vm.$router.push({
          path: '/?' + target 
        })
      },
      addQuestion () {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        if (current['name'] === 'Landing') {
          vm.$store.commit('setActiveAddQuestion', true)
        } else {
          vm.$store.commit('setActiveAddQuestion', true)
          vm.$router.push({
            path: '/',
            query: {
              crtQ: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
            }
          })
        }
      },
      getAgencyConfigs () {
        let vm = this
        let param = {
          headers: {
            groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
            Token: window.Liferay ? window.Liferay.authToken : ''
          }
        }
        
        let dataGet = {}
        let dataPost = new URLSearchParams()
        dataPost.append('method', 'GET')
        dataPost.append('serverCode', 'SERVER_DVC')
        dataPost.append('url', '/serverconfigs/GROUP_ID_SITE_MOTCUA')
        dataPost.append('data', JSON.stringify(dataGet))
        axios.post('/o/rest/v2/proxy', dataPost, param).then(function (response) {
          let serializable = response.data
          let configs = JSON.parse(serializable.configs)
          let agency = configs['groupIds']
          try {
            vm.agencyCurrent = agency.filter(function (item) {
              return item.value == window.themeDisplay.getScopeGroupId()
            })[0]
            if (vm.agencyCurrent) {
              vm.getQuestionList()
              vm.getCounter()
            }
          } catch (error) {
          }
          
        }).catch(function (xhr) {
        })

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
      },
      convertString(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
        str = str.replace(/đ/g, 'd')
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
        str = str.replace(/Đ/g, 'D')
        str = str.toLocaleLowerCase().replace(/\s/g, '')
        return str
      }
    }
  }
</script>
