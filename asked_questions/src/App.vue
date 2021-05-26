<template>
  <v-app id="app_asked_questions" style="background: #fff !important">
    <v-navigation-drawer app clipped floating width="255" v-if="getUser('Administrator') || getUser('Administrator_data') || getUser('Administrator_Employee')">
      <div class="">
        <v-btn class="px-0 my-0 ml-0" block color="primary" v-on:click.native="addQuestion"
          style="height:36px"
        >
          <v-icon size="22" color="white">add</v-icon>&nbsp;
          Thêm mới câu hỏi
        </v-btn>
      </div>
      <v-list class="pt-0">
        <v-list-tile :style="activeTab === 0 ? 'border-left: 7px solid #00aeef' : ''">
          <v-list-tile-content class="pl-2" @click="filterQuestion(0, 'all')">
            <v-list-tile-title>Tất cả câu hỏi</v-list-tile-title>
            <span class="status__counter" style="color:#0b72ba!important">
              {{totalQuestionCounter}}
            </span>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="my-0"></v-divider>
        <v-list-tile :style="activeTab === 5 ? 'border-left: 7px solid #00aeef' : ''">
          <v-list-tile-content class="pl-2" @click="filterQuestion(5, 'questionType=FAQ')">
            <v-list-tile-title>Công dân hỏi đáp</v-list-tile-title>
            <span class="status__counter" style="color:#0b72ba!important">
              {{totalFAQ}}
            </span>
          </v-list-tile-content>
        </v-list-tile>
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
    </v-navigation-drawer>
    <v-content :style="(!getUser('Administrator') && !getUser('Administrator_data') && !getUser('Administrator_Employee')) ? 'width: 100%;max-width: 1300px;margin: 0 auto' : ''">
      <router-view></router-view>
    </v-content>
    <v-dialog v-model="dialog_addQuestion" scrollable persistent max-width="1000px">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Thêm câu hỏi thường gặp</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialog_addQuestion = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="validForm" lazy-validation>
            <v-layout wrap class="px-2 mt-2 pb-3">
              <v-flex xs12>
                <div class="mb-1">Cơ quan tiếp nhận</div>
                <v-autocomplete
                  class="select-border"
                  :items="agencyList"
                  v-model="agencySelected"
                  placeholder="Chọn cơ quan tiếp nhận câu hỏi"
                  item-text="itemName"
                  item-value="itemCode"
                  return-object
                  :hide-selected="true"
                  box
                  @change="changeAgency"
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12 class="selectLvtt" >
                <div class="mb-1">Lĩnh vực thủ tục hành chính</div>
                <v-autocomplete
                  class="select-border"
                  :items="lvttList"
                  v-model="lvttSelectAdd"
                  placeholder="Chọn lĩnh vực"
                  item-text="domainName"
                  item-value="domainCode"
                  return-object
                  :hide-selected="true"
                  box
                  clearable
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12>
                <div class="mb-1">Nội dung câu hỏi <span style="color:red">(*)</span></div>
                <v-textarea
                  box
                  row="5"
                  placeholder="Nhập nội dung câu hỏi"
                  v-model="contentQuestion"
                  :rules="[rules.required]"
                  required
                ></v-textarea>
              </v-flex>
              <v-flex xs12>
                <div class="mb-1">Nội dung trả lời <span style="color:red">(*)</span></div>
                <v-textarea
                  box
                  row="5"
                  placeholder="Nhập nội dung trả lời"
                  v-model="contentAnswer"
                  :rules="[rules.required]"
                  required
                ></v-textarea>
              </v-flex>
              <v-flex xs12 md6 style="margin:0 auto">
                <captcha ref="captcha"></captcha>
              </v-flex>
              <v-flex xs12>
                <v-btn color="primary"
                  :loading="loadingAdd"
                  :disabled="loadingAdd"
                  @click="submitAddQuestion"
                >
                  <v-icon>save</v-icon> &nbsp;
                  Thêm câu hỏi
                </v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
  import Vue from 'vue'
  import $ from 'jquery'
  import Captcha from './components/screens/Captcha.vue'
  import toastr from 'toastr'
  Vue.use(toastr)
  toastr.options = {
    'closeButton': true,
    'timeOut': '5000'
  }
  export default {
    components: {
    'captcha': Captcha
    },
    data: () => ({
      activeTab: 0,
      totalQuestionCounter: 0,
      totalAnswered: 0,
      totalNotAnswer: 0,
      totalPublished: 0,
      totalNotPublish: 0,
      totalFAQ: 0,
      agencyList: [],
      dialog_addQuestion: false,
      agencySelected: '',
      lvttList: [],
      lvttSelectAdd: '',
      contentQuestion: '',
      contentAnswer: '',
      rules: {
        required: (value) => !!value || 'Nội dung bắt buộc'
      },
      loadingAdd: false,
      validForm: false
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
      typeFilterSelected () {
        return this.$store.getters.getTypeFilter
      },
      activeCounter () {
        return this.$store.getters.getCounter
      },
      isMobile () {
        return this.$store.getters.getIsMobile
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        vm.getQuestionList()
        vm.getCounter()
        vm.$store.dispatch('getGovAgency').then(function(result) {
          // agencyConfig = "govAgencyCode_1, govAgencyCode_2, ..." cấu hình trên fragment 
          try {
            if (agencyConfig) {
              vm.agencyList = []
              for (let index in result) {
                if (agencyConfig.split(',').filter(function (item) {
                  return item === result[index]['itemCode']
                }).length > 0) {
                  vm.agencyList.push(result[index])
                }
              }
            } else {
              vm.agencyList = result
            }
          } catch (error) {
            vm.agencyList = result
          }
        })
        let filter = {
          agency: ''
        }
        vm.$store.dispatch('getLvttList', filter).then(function(result) {
          vm.lvttList = result
        })
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
      if (this.isMobile) {
        $('section#content').css('padding-left', '0px')
      }
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
      changeAgency () {
        let vm = this
        setTimeout(function () {
          let filter = {
            agency: vm.agencySelected.itemCode
          }
          vm.lvttSelectAdd = ''
          vm.$store.dispatch('getLvttList', filter).then(function(result) {
            vm.lvttList = result
          })
        }, 100)
      },
      submitAddQuestion () {
        let vm = this
        if (!vm.$refs.captcha.requiredCapcha()) {
          toastr.error('Vui lòng nhập mã captcha')
          return
        } else {
          if (vm.$refs.form.validate()) {
            vm.loadingAdd = true
            let filter = {
              content: vm.contentQuestion,
              fullname: '',
              email: '',
              telNo: '',
              address: '',
              publish: 1,
              agencyCode: vm.agencySelected ? vm.agencySelected['itemCode'] : '',
              domainCode: vm.lvttSelectAdd ? vm.lvttSelectAdd['domainCode'] : '',
              domainName: vm.lvttSelectAdd ? vm.lvttSelectAdd['domainName'] : '',
              questionType: '',
              j_captcha_response: vm.$refs.captcha.j_captcha_response,
            }
            vm.$store.dispatch('addQuestion', filter).then(function (result) {
              setTimeout (function () {
                vm.loadingAdd = false
                let filter = {
                  questionId: result['questionId'],
                  content: vm.contentAnswer,
                  publish: 1
                }
                vm.$store.dispatch('addAnswer', filter).then(function (result) {
                  toastr.success('Thêm câu hỏi và nội dung trả lời thành công.')
                }).catch(function () {
                  toastr.error('Nội dung trả lời chưa được thêm thành công. Vui lòng thêm nội dung trả lời cho câu hỏi đã tạo.')
                })
                vm.$refs.form.reset()
                vm.$refs.form.resetValidation()
                vm.$refs.captcha.makeImageCap()
                vm.dialog_addQuestion = false
              }, 300)
            }).catch (function () {
              vm.$refs.captcha.makeImageCap()
              vm.loadingAdd = false
              toastr.error('Thêm câu hỏi không thành công')
            })
          }
        }
        
      },
      getQuestionList () {
        let vm = this
        let current = vm.$router.history.current
        let query = current.query
        let filter = {
          agencyCode: vm.agencyFilterSelected && vm.agencyFilterSelected['itemCode'] ? vm.agencyFilterSelected['itemCode'] : '',
          domainCode: vm.lvttFilterSelected ? vm.lvttFilterSelected['domainCode'] : '',
          subDomainCode: vm.lvdsFilterSelected ? vm.lvdsFilterSelected['itemCode'] : '',
          keyword: vm.keyword ? vm.keyword : '',
          publish: query.hasOwnProperty('publish') ? query['publish'] : '',
          answered: query.hasOwnProperty('answered') ? query['answered'] : '',
          questionType: vm.typeFilterSelected ? vm.typeFilterSelected : (query.hasOwnProperty('questionType') ? query['questionType'] : '')
        }
        try {
          if (agencyCodeSite) {
            filter.agencyCode = agencyCodeSite
          }
        } catch (error) {
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
          answered: ''
        }
        // vm.$store.commit('setLoading', true)
        try {
          if (agencyCodeSite) {
            filter.agencyCode = agencyCodeSite
          }
        } catch (error) {
        }
        
        vm.$store.dispatch('getQuestionsCounter', filter).then(function (result) {
          vm.$store.commit('setLoading', false)
          vm.totalQuestionCounter = result['total']
          // 
          let filter1 = {
            agencyCode: '',
            publish: 1,
            answered: ''
          }
          try {
            if (agencyCodeSite) {
              filter1.agencyCode = agencyCodeSite
            }
          } catch (error) {
          }
          
          // console.log('filterCounter 1', filter1)
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
            answered: true
          }
          try {
            if (agencyCodeSite) {
              filter2.agencyCode = agencyCodeSite
            }
          } catch (error) { 
          }
          // console.log('filterCounter 2', filter2)
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
            questionType: 'FAQ'
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
        vm.dialog_addQuestion = true
        vm.$refs.captcha.makeImageCap()
        // let current = vm.$router.history.current
        // let newQuery = current.query
        // if (current['name'] === 'Landing') {
        //   vm.$store.commit('setActiveAddQuestion', true)
        // } else {
        //   vm.$store.commit('setActiveAddQuestion', true)
        //   vm.$router.push({
        //     path: '/',
        //     query: {
        //       crtQ: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
        //     }
        //   })
        // }
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
      onResize () {
        let vm = this
        let isMobile = window.innerWidth < 1024
        vm.$store.commit('setIsMobile', isMobile)
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
