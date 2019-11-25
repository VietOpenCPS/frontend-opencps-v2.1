<template>
  <div>
    <v-layout row wrap class="mx-2 py-2" id="contentFaq">
      <v-flex xs12 :class="(!getUser('Administrator') && !getUser('Administrator_data') && !getUser('tra_loi_hoi_dap')) ? 'sm7' : ''" class="pr-3">
        <h3 v-if="!getUser('Administrator') && !getUser('Administrator_data') && !getUser('tra_loi_hoi_dap')" class="text-bold mb-3" style="color:#034687">
          NHỮNG CÂU HỎI THƯỜNG GẶP
        </h3>
        <h3 v-if="getUser('Administrator') || getUser('Administrator_data') || getUser('tra_loi_hoi_dap')" class="text-bold mb-3 text-xs-center" style="color:#034687">
          DANH SÁCH CÂU HỎI
        </h3>
        <content-placeholders v-if="loading" class="mt-3">
          <content-placeholders-text :lines="10" />
        </content-placeholders>
        <div v-else>
          <v-layout wrap class="mt-2 pb-3">
            <v-flex xs12 sm6 class="pr-2" v-if="!agencyCodeSiteExits">
              <v-autocomplete
                class="select-border"
                :items="agencyList"
                v-model="agencyFilterSelected"
                placeholder="Cơ quan tiếp nhận câu hỏi"
                item-text="itemName"
                item-value="itemCode"
                return-object
                :hide-selected="true"
                box
                clearable
                @change="changeAdministration"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm6>
              <v-autocomplete
                class="select-border"
                :items="lvdsList"
                v-model="lvdsFilterSelected"
                placeholder="Lĩnh vực đời sống"
                item-text="itemName"
                item-value="itemCode"
                return-object
                :hide-selected="true"
                box
                clearable
                @change="changeLvds"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 :class="agencyCodeSiteExits ? 'sm6 pl-2' : 'sm12 pl-0'">
              <v-text-field
                box
                placeholder="Nội dung câu hỏi"
                v-model="keyword"
                @keyup.enter="filterKeyword"
                @click:append="filterKeyword"
                clearable
                append-icon="search"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <div v-if="questionList.length > 0">
            <v-expansion-panel v-for="(itemQuestion, indexQuestion) in questionList"
              :key="indexQuestion" class="mb-2" style="border: 1px solid #ddd;border-radius:5px;position:relative;">
            <!-- <v-expansion-panel v-for="(itemQuestion, indexQuestion) in questionList" :value="[false]" expand class="expansion-pl mb-2"
              :key="indexQuestion" style="border: 1px solid #ddd;border-radius:5px;position:relative;"
            > -->
              <v-menu offset-y v-if="getUser('Administrator') || getUser('Administrator_data') || getUser('tra_loi_hoi_dap')" style="display:inline-block;position:absolute;right:25px;top:5px;z-index:1">
                <v-btn class="mx-0 my-0" slot="activator" flat icon color="primary">
                  <v-icon>settings</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile @click.stop="addAnswer(itemQuestion, indexQuestion)">
                    <v-list-tile-title><v-icon color="primary" size="16px">notes</v-icon>&nbsp; Chi tiết</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile v-if="!itemQuestion['answered'] && (getUser('Administrator') || getUser('Administrator_data') || getUser('tra_loi_hoi_dap'))">
                    <v-list-tile-title @click.stop="addAnswer(itemQuestion, indexQuestion)">
                      <v-icon color="blue" size="16px">message</v-icon>&nbsp; Trả lời
                    </v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile v-if="getUser('Administrator')">
                    <v-list-tile-title @click.stop="changePublic(itemQuestion, indexQuestion)">
                      <v-icon color="primary" size="16px">{{ itemQuestion.publish === 1 ? 'visibility_off' : 'visibility' }}</v-icon>&nbsp;
                      {{ itemQuestion.publish === 1 ? 'Bỏ công khai' : 'Công khai' }}
                    </v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile v-if="getUser('Administrator')" @click.stop="deleteQuestion(itemQuestion)">
                    <v-list-tile-title><v-icon color="red" size="16px">delete</v-icon>&nbsp; Xóa</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
              <v-expansion-panel-content :key="indexQuestion" style="border-radius:5px">
                <v-icon slot="actions" color="primary" style="position:absolute;right:5px;top:10px" @click="getAnswers(itemQuestion, indexQuestion)">$vuetify.icons.expand</v-icon>
                <div class="ml-2" slot="header" @click="getAnswers(itemQuestion, indexQuestion)">
                  <span class="text-bold primary--text">Câu hỏi {{questionPage * 20 - 20 + indexQuestion + 1}}: </span>
                  <div class="primary--text" v-html="itemQuestion.content"></div>
                </div>
                <div v-if="itemQuestion['loading']">
                  <content-placeholders class="mt-3">
                    <content-placeholders-text :lines="3" />
                  </content-placeholders>
                </div>
                <div v-else>
                  <v-card flat v-if="itemQuestion['answers'].length > 0">
                    <div class="ml-2 py-1">
                      <span class="green--text text-bold">Trả lời: </span>
                    </div>
                    <v-card-text class="mx-2 my-0 py-0">
                      <div
                        class="mb-2"
                        v-for="(itemAnswer, indexAnswer) in itemQuestion['answers']"
                        :key="indexAnswer"
                      >
                        <div>
                          <div style="position:relative">
                            <div class="" v-html="itemAnswer.content"></div>
                            <v-menu offset-y v-if="getUser('Administrator') || getUser('Administrator_data') || getUser('tra_loi_hoi_dap')" style="display:inline-block;position:absolute;right:18px;top:-15px">
                              <v-btn class="mx-0 my-0" slot="activator" flat icon color="primary">
                                <v-icon>settings</v-icon>
                              </v-btn>
                              <v-list>
                                <v-list-tile>
                                  <v-list-tile-title v-if="getUser('Administrator') || getUser('Administrator_data')" @click.stop="changePublicAnswer(itemAnswer, indexAnswer)">
                                    <v-icon color="primary" size="16px">{{ itemAnswer.publish === 1 ? 'visibility_off' : 'visibility' }}</v-icon>&nbsp;
                                    {{ itemAnswer.publish === 1 ? 'Bỏ công khai' : 'Công khai' }}
                                  </v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile>
                                  <v-list-tile-title @click.stop="editAnswer(itemAnswer, indexAnswer, itemQuestion, indexQuestion)">
                                    <v-icon color="primary" size="16px">edit</v-icon>&nbsp;
                                    Sửa câu trả lời
                                  </v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click.stop="deleteAnswer(itemAnswer, itemQuestion, indexQuestion)">
                                  <v-list-tile-title><v-list-tile-title><v-icon color="red" size="16px">delete</v-icon>&nbsp; Xóa</v-list-tile-title>Xóa</v-list-tile-title>
                                </v-list-tile>
                              </v-list>
                            </v-menu>
                          </div>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                  <div class="px-3 py-2" v-else>
                    <v-alert outline color="warning" icon="priority_high" :value="true">
                      Chưa có câu trả lời nào
                    </v-alert>
                  </div>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </div>
          <div class="px-2 py-2" v-else>
            <v-alert outline color="warning" icon="priority_high" :value="true">
              Không có câu hỏi nào
            </v-alert>
          </div>
        </div>
        <div v-if="totalQuestion > 0" class="text-xs-right layout wrap mt-4" style="position: relative;">
          <div class="flex pagging-table"> 
            <tiny-pagination :total="totalQuestion" :page="questionPage" custom-class="custom-tiny-class" 
              @tiny:change-page="paggingData" ></tiny-pagination> 
          </div>
        </div>
      </v-flex>
      <v-flex xs12 sm5 v-if="!getUser('Administrator') && !getUser('Administrator_data') && !getUser('tra_loi_hoi_dap')">
        <v-card flat style="border: 1px solid #ddd;border-top: 0">
          <v-flex xs12 style="border-top: 1.5px solid #0053a4;">
            <div class="head-title">
              ĐẶT CÂU HỎI
            </div>
          </v-flex>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-layout wrap class="px-2 mt-2 pb-3">
              <v-flex xs12>
                <div class="mb-1">Cơ quan tiếp nhận <span style="color:red"></span></div>
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
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12>
                <div class="mb-1">Họ và tên người gửi <span style="color:red">(*)</span></div>
                <v-text-field
                  box
                  placeholder="Ghi rõ họ tên"
                  v-model="fullName"
                  :rules="[rules.required]"
                  min="6"
                  required
                ></v-text-field>
              </v-flex>
              <!-- <v-flex xs12>
                <div class="mb-1">Địa chỉ</div>
                <v-text-field
                  box
                  placeholder="Ghi rõ số nhà, tên đường, quận/ huyện, tỉnh thành."
                  v-model="address"
                ></v-text-field>
              </v-flex> -->
              <!-- <v-flex xs6 class="pr-1">
                <div class="mb-1">Số điện thoại</div>
                <v-text-field
                  box
                  placeholder="Nhập số điện thoại"
                  v-model="telNo"
                ></v-text-field>
              </v-flex> -->
              <v-flex xs12 class="">
                <div class="mb-1">Thư điện tử <span style="color:red">(*)</span></div>
                <v-text-field
                  placeholder="Nhập thư điện tử"
                  box
                  v-model="contactEmail"
                  :rules="contactEmail ? [rules.email] : [rules.required]"
                  required
                  name="input-10-2"
                  min="6"
                ></v-text-field>
              </v-flex>
              <!-- <v-flex xs12>
                <div class="mb-1">Tiêu đề</div>
                <v-text-field
                  box
                  placeholder="Nhập tiêu đề"
                  v-model="titleQuestion"
                ></v-text-field>
              </v-flex> -->
              <v-flex xs12>
                <div class="mb-1">Nội dung câu hỏi <span style="color:red">(*)</span></div>
                <v-textarea
                  box
                  row="5"
                  placeholder="Nhập nội dung câu hỏi"
                  v-model="content"
                  :rules="[rules.required]"
                  required
                ></v-textarea>
              </v-flex>
              <v-flex xs12 style="margin:0 auto">
                <captcha ref="captcha"></captcha>
              </v-flex>
              <v-flex xs12>
                <v-btn color="primary"
                  :loading="loading"
                  :disabled="loading"
                  @click="submitAddQuestion"
                >
                  Gửi câu hỏi
                </v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card>
      </v-flex>
      <!-- <v-dialog v-model="dialog_addQuestion" scrollable persistent max-width="700px">
        <v-card>
          <v-toolbar flat dark color="primary">
            <v-toolbar-title>Thêm mới câu hỏi</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click.native="dialog_addQuestion = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-layout wrap class="px-2 mt-2 pb-3">
                <v-flex xs12>
                  <div class="mb-1">Cơ quan tiếp nhận <span style="color:red"></span></div>
                  <v-autocomplete
                    class="select-border"
                    :items="agencyList"
                    v-model="agencySelected"
                    placeholder="Chọn cơ quan tiếp nhận câu hỏi"
                    item-text="agencyName"
                    item-value="agencyCode"
                    return-object
                    :hide-selected="true"
                    box
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12>
                  <div class="mb-1">Họ và tên người gửi <span style="color:red">(*)</span></div>
                  <v-text-field
                    box
                    placeholder="Ghi rõ họ tên"
                    v-model="fullName"
                    :rules="[rules.required]"
                    min="6"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <div class="mb-1">Địa chỉ</div>
                  <v-text-field
                    box
                    placeholder="Ghi rõ số nhà, tên đường, quận/ huyện, tỉnh thành."
                    v-model="address"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6 class="pr-1">
                  <div class="mb-1">Số điện thoại</div>
                  <v-text-field
                    box
                    placeholder="Nhập số điện thoại"
                    v-model="telNo"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6 class="pl-1">
                  <div class="mb-1">Thư điện tử <span style="color:red">(*)</span></div>
                  <v-text-field
                    placeholder="Nhập thư điện tử"
                    box
                    v-model="contactEmail"
                    :rules="contactEmail ? [rules.email] : [rules.required]"
                    required
                    name="input-10-2"
                    min="6"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <div class="mb-1">Tiêu đề</div>
                  <v-text-field
                    box
                    placeholder="Nhập tiêu đề"
                    v-model="titleQuestion"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <div class="mb-1">Nội dung câu hỏi <span style="color:red">(*)</span></div>
                  <v-textarea
                    box
                    row="5"
                    placeholder="Nhập nội dung câu hỏi"
                    v-model="content"
                    :rules="[rules.required]"
                    required
                  ></v-textarea>
                </v-flex>
                <v-flex xs12 style="margin:0 auto">
                  <captcha ref="captcha"></captcha>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card-text>
          <v-card-actions class="mx-3">
            <v-spacer></v-spacer>
            <v-btn color="primary"
              :loading="loading"
              :disabled="loading"
              @click="submitAddQuestion"
            >
              Gửi câu hỏi
            </v-btn>
            <v-btn @click="dialog_addQuestion = false" color="primary">
              <v-icon>clear</v-icon>&nbsp;
              Hủy
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog> -->
    </v-layout>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import support from '../../store/support.json'
import toastr from 'toastr'
import Captcha from './Captcha.vue'
import TinyPagination from './Pagination.vue'
import { VueEditor, Quill } from 'vue2-editor'
Vue.use(toastr)

toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  props: [],
  components: {
    'captcha': Captcha,
    VueEditor,
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    agencyList: [],
    lvdsList: [],
    dialog_addQuestion: false,
    agencyCodeSiteExits: '',
    agencySelected: '',
    agencyFilterSelected: '',
    lvdsFilterSelected: '',
    keyword: '',
    answerList: [],
    content: '',
    contentAnswer: '',
    loadingAnswer: false,
    config: {},
    captchaActive: false,
    valid: false,
    validAnswer: false,
    telNo: '',
    address: '',
    contactEmail: '',
    fullName: '',
    titleQuestion: '',
    answers: [
    ],
    questionSelected: '',
    openQuestion: '',
    publishAnswer: false,
    rules: {
      required: (value) => !!value || 'Trường dữ liệu bắt buộc',
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Địa chỉ Email không hợp lệ'
      }
    },
    customToolbar: [
      [{ header: [false, 1, 2, 3, 4, 5, 6] }],
      ["bold", "italic", "underline", "strike"], // toggled buttons
      [
        { align: "" },
        { align: "center" },
        { align: "right" },
        { align: "justify" }
      ],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      // ["link", "image", "video"],
      ["clean"] // remove formatting button
    ]
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    originality () {
      var vm = this
      return vm.getOriginality()
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
    questionPage () {
      return this.$store.getters.getQuestionPage
    },
    totalQuestion () {
      return this.$store.getters.getTotalQuestion
    },
    answerDefault () {
      return this.$store.getters.getAnswerDefault
    },
    keywordFilter () {
      return this.$store.getters.getKeywordFilter
    },
    agencyFilter () {
      return this.$store.getters.getAgencyFilter
    },
    lvdsFilter (val) {
      let vm = this
      vm.lvdsFilterSelected = val
    },
    activeCounter () {
      return this.$store.getters.getCounter
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      var vm = this
      console.log('run1 run1 run1')
      let current = vm.$router.history.current
      let newQuery = current.query
      vm.$store.dispatch('getGovAgency').then(function(result) {
        vm.agencyList = result
      })
      vm.$store.dispatch('getLvdsList').then(function(result) {
        vm.lvdsList = result
      })
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  mounted () {
    let vm = this
    // agencyCodeSite = "govAgencyCode" cấu hình trên fragment 
    try {
      vm.agencyCodeSiteExits = agencyCodeSite ? agencyCodeSite : ''
    } catch (error) {
    }
    
    $('.v-expansion-panel__header').css('background', '#f1f1f1')
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
    },
    keywordFilter (val) {
      let vm = this
      vm.keyword = val
    },
    agencyFilter (val) {
      let vm = this
      vm.agencyFilterSelected = val
    },
    activeAddQuestion (val) {
      let vm = this
      vm.dialog_addQuestion = val
    }
  },
  methods: {
    getAnswers (item, index) {
      let vm = this
      if (vm.openQuestion === index) {
        vm.openQuestion = ''
      } else {
        vm.openQuestion = index
      }
      item['loading'] = true
      let filter = {
        questionId: item.questionId
      }
      vm.$store.dispatch('getAnswers', filter).then(function (result) {
        item['loading'] = false
        let answers = []
        if (Array.isArray(result)) {
          answers = result
        } else {
          answers = [result]
        }
        if (result) {
          vm.questionList[index]['answers'] = answers
        } else {
          vm.questionList[index]['answers'] = vm.answers[index] ? vm.answers[index] : []
        }
      }).catch(function (reject) {
        item['loading'] = false
        vm.questionList[index]['answers'] = vm.answers[index] ? vm.answers[index] : []
      })
    },
    paggingData (config) {
      let vm = this
      vm.$store.commit('setQuestionPage', config.page)
      vm.$store.commit('setActiveGetQuestion', !vm.activeGetQuestion)
    },
    viewDetail (item) {
      let vm = this
      vm.$store.commit('setQuestionDetail', item)
      vm.$router.push({
        path: '/' + item.questionId
      })
    },
    submitAddQuestion () {
      let vm = this
      if (!vm.$refs.captcha) {
        vm.captchaActive = true
        toastr.error('Mã captcha không chính xác')
        return
      } else if (vm.content) {
        if (vm.$refs.form.validate()) {
          let filter = {
            content: vm.content,
            fullname: vm.fullName,
            email: vm.contactEmail,
            publish: 0,
            j_captcha_response: vm.$refs.captcha.j_captcha_response,
            agencyCode: vm.agencySelected ? vm.agencySelected['itemCode'] : '',
            questionType: ''
          }
          vm.$store.dispatch('addQuestion', filter).then(function (result) {
            toastr.success('Hệ thống đã tiếp nhận câu hỏi của bạn')
            setTimeout(function() {
              vm.$refs.captcha.makeImageCap()
              vm.$refs.form.reset()
              vm.$refs.form.resetValidation()
            }, 200)
            vm.$store.commit('setActiveGetQuestion', !vm.activeGetQuestion)
            vm.$store.commit('setActiveAddQuestion', false)
          }).catch(function (reject) {
            console.log(reject)
          })
        }
      }
    },
    changeAdministration () {
      let vm = this
      setTimeout (function () {
        vm.$store.commit('setAgencyFilter', vm.agencyFilterSelected)
        vm.$store.commit('setQuestionPage', 1)
        vm.$store.commit('setActiveGetQuestion', !vm.activeGetQuestion)
      }, 200)
    },
    changeLvds () {
      let vm = this
      setTimeout (function () {
        vm.$store.commit('setLvdsFilter', vm.lvdsFilterSelected)
        vm.$store.commit('setQuestionPage', 1)
        vm.$store.commit('setActiveGetQuestion', !vm.activeGetQuestion)
      }, 200)
    },
    filterKeyword () {
      let vm = this
      setTimeout (function () {
        vm.$store.commit('setKeywordFilter', vm.keyword)
        vm.$store.commit('setActiveGetQuestion', !vm.activeGetQuestion)
      }, 200)
    },
    addAnswer (item, index) {
      let vm = this
      vm.$store.commit('setQuestionDetail', item)
      vm.$store.commit('setIndexQuestion', index)
      vm.$router.push({
        path: '/' + item.questionId
      })
    },
    cancelAddQuestion () {
      let vm = this
      vm.$store.commit('setActiveAddQuestion', false)
    },
    submitAddAnswer (item, index) {
      let vm = this
      if (vm.contentAnswer) {
        let filter = {
          questionId: item['questionId'],
          content: vm.contentAnswer,
          publish: vm.publishAnswer ? 1 : 0
        }
        vm.$store.dispatch('addAnswer', filter).then(function (result) {
          toastr.success('Thêm câu trả lời thành công')
          vm.getAnswers(item, index)
          vm.questionSelected = ''
        }).catch(function (reject) {
          console.log(reject)
        })
      }
    },
    deleteQuestion (item) {
      let vm = this
      let x = confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')
      if (x) {
        let filter = {
          questionId: item['questionId']
        }
        vm.$store.dispatch('deleteQuestion', filter).then(function (result) {
          toastr.success('Xóa câu hỏi thành công')
          vm.$store.commit('setCounter', !vm.activeCounter)
          vm.$store.commit('setActiveGetQuestion', !vm.activeGetQuestion)
        }).catch(function (reject) {
          console.log(reject)
        })
      }
    },
    changePublic (item, index) {
      let vm = this
      let list = vm.questionList
      vm.$store.commit('setQuestionList', list)
      let filter = {
        questionId: item['questionId'],
        publish: vm.questionList[index]['publish'] === 1 ? 0 : 1,
        content: item['content'],
        email: item['email'],
        fullname: item['fullname'],
        govAgencyCode: item['govAgencyCode']
      }
      vm.$store.dispatch('putQuestion', filter).then(function (result) {
        toastr.success('Cập nhật thành công')
        vm.$store.commit('setCounter', !vm.activeCounter)
        if (vm.questionList[index]['publish'] === 1) {
          vm.questionList[index]['publish'] = 0
        } else {
          vm.questionList[index]['publish'] = 1
        }
      }).catch(function (reject) {
        console.log(reject)
      })
    },
    changePublicAnswer (item, index) {
      let vm = this
      console.log(item, index)
      let filter = {
        questionId: item['questionId'],
        answerId: item['answerId'],
        publish: vm.answerList[index]['publish'] === 1 ? 0 : 1,
        content: item['content'],
      }
      vm.$store.dispatch('putAnswer', filter).then(function (result) {
        toastr.success('Cập nhật thành công')
        if (vm.answerList[index]['publish'] === 1) {
          vm.answerList[index]['publish'] = 0
        } else {
          vm.answerList[index]['publish'] = 1
        }
      }).catch(function (reject) {
        console.log(reject)
      })
    },
    editAnswer (itemAnswer, indexAnswer, itemQuestion, indexQuestion) {
      let vm = this
      vm.$store.commit('setQuestionDetail', itemQuestion)
      vm.$store.commit('setIndexQuestion', indexQuestion)
      vm.$router.push({
        path: '/' + itemQuestion.questionId + '?editAnswer=' + indexAnswer
      })
    },
    deleteAnswer (itemAnswer, itemQuestion, indexQuestion) {
      let vm = this
      let x = confirm('Bạn có chắc chắn xóa câu trả lời này?')
      if (x) {
        let filter = {
          questionId: itemAnswer['questionId'],
          answerId: itemAnswer['answerId']
        }
        vm.$store.dispatch('deleteAnswer', filter).then(function (result) {
          toastr.success('Xóa câu trả lời thành công')
          vm.getAnswers(itemQuestion, indexQuestion)
        }).catch(function (reject) {
          console.log(reject)
        })
      }
    },
    getPublic (val) {
      if (val === 1) {
        return true
      } else {
        return false
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
    splitDate (createDate) {
      if (createDate) {
        return createDate.split(' ')[0]
      } else {
        return ''
      }
    }
  },
  filters: {
    getPublic (val) {
      if (val === 1) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  $font-size: 14px;
  $line-height: 1.5;
  $lines-to-show: 7;
  .content-question {
    text-align: justify;
    display: block;
    display: -webkit-box;
    height: $font-size*$line-height*$lines-to-show;
    margin: 0 auto;
    font-size: $font-size;
    line-height: $line-height;
    -webkit-line-clamp: $lines-to-show;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
