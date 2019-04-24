<template>
  <div>
    <v-layout row wrap class="px-3 py-3" id="contentFaq">
      <v-flex xs12 sm7 class="pr-3">
        <content-placeholders v-if="loading" class="mt-3">
          <content-placeholders-text :lines="10" />
        </content-placeholders>
        <div v-else>
          <div v-if="questionList.length > 0">
            <v-expansion-panel v-for="(itemQuestion, indexQuestion) in questionList"
              :key="indexQuestion" class="mb-2" style="border: 1px solid #ddd;border-radius:5px;position:relative;">
              <v-menu offset-y v-if="getUser('Administrator')" style="display:inline-block;position:absolute;right:25px;top:5px;z-index:1">
                <v-btn class="mx-0 my-0" slot="activator" flat icon color="primary">
                  <v-icon>settings</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile @click.stop="addAnswer(itemQuestion, indexQuestion)">
                    <v-list-tile-title><v-icon color="primary" size="16px">notes</v-icon>&nbsp; Chi tiết</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-title @click.stop="addAnswer(itemQuestion, indexQuestion)">
                      <v-icon color="blue" size="16px">message</v-icon>&nbsp; Trả lời
                    </v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-title @click.stop="changePublic(itemQuestion, indexQuestion)">
                      <v-icon color="primary" size="16px">{{ itemQuestion.publish === 1 ? 'visibility_off' : 'visibility' }}</v-icon>&nbsp;
                      {{ itemQuestion.publish === 1 ? 'Bỏ công khai' : 'Công khai' }}
                    </v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile @click.stop="deleteQuestion(itemQuestion)">
                    <v-list-tile-title><v-icon color="red" size="16px">delete</v-icon>&nbsp; Xóa</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
              <v-expansion-panel-content style="border-radius:5px">
                <v-icon slot="actions" color="primary" style="position:absolute;right:5px;top:10px">$vuetify.icons.expand</v-icon>
                <div class="ml-3" slot="header" @click="getAnswers(itemQuestion, indexQuestion)">
                  <span class="text-bold primary--text">Câu hỏi {{questionPage * 10 - 10 + indexQuestion + 1}}: </span>
                  <div class="ml-2 primary--text" v-html="itemQuestion.content"></div>
                </div>
                <div v-if="loadingAnswer">
                  <content-placeholders v-if="loading" class="mt-3">
                    <content-placeholders-text :lines="10" />
                  </content-placeholders>
                </div>
                <div v-else>
                  <v-card flat v-if="itemQuestion['answers'].length > 0">
                    <div class="ml-3 py-1">
                      <span class="primary--text text-bold">Trả lời: </span>
                    </div>
                    <v-card-text class="my-0 py-0">
                      <div
                        class="mb-2"
                        v-for="(itemAnswer, indexAnswer) in itemQuestion['answers']"
                        :key="indexAnswer"
                      >
                        <div>
                          <div style="position:relative">
                            <div class="ml-3" v-html="itemAnswer.content"></div>
                            <v-menu offset-y v-if="getUser('Administrator')" style="display:inline-block;position:absolute;right:10px;top:0">
                              <v-btn class="mx-0 my-0" slot="activator" flat icon color="primary">
                                <v-icon>settings</v-icon>
                              </v-btn>
                              <v-list>
                                <v-list-tile>
                                  <v-list-tile-title @click.stop="changePublicAnswer(itemAnswer, indexAnswer)">
                                    <v-icon color="primary" size="16px">{{ itemAnswer.publish === 1 ? 'visibility_off' : 'visibility' }}</v-icon>&nbsp;
                                    {{ itemAnswer.publish === 1 ? 'Bỏ công khai' : 'Công khai' }}
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
          <div class="px-3 py-2" v-else>
            <v-alert outline color="warning" icon="priority_high" :value="true">
              Không có câu hỏi nào
            </v-alert>
          </div>
        </div>
        <!-- <div v-if="totalQuestion > 0" class="text-xs-right layout wrap mt-2" style="position: relative;">
          <div class="flex pagging-table px-2"> 
            <tiny-pagination :total="totalQuestion" :page="questionPage" custom-class="custom-tiny-class" 
              @tiny:change-page="paggingData" ></tiny-pagination> 
          </div>
        </div> -->
      </v-flex>
      <v-flex xs12 sm5>
        <v-card flat style="border: 1px solid #ddd;border-top: 0">
          <v-flex xs12 style="border-top: 1.5px solid #0053a4;">
            <div v-if="getUser('Administrator')" class="head-title">
              TẠO CÂU HỎI
            </div>
            <div v-if="!getUser('Administrator')" class="head-title">
              GỬI CÂU HỎI
            </div>
          </v-flex>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-layout wrap class="px-2 mt-2 pb-3">
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
              <v-flex xs12 v-if="captchaActive" style="margin:0 auto">
                <captcha ref="captcha"></captcha>
              </v-flex>
              <v-flex xs12>
                <v-btn color="primary"
                  :loading="loading"
                  :disabled="loading"
                  @click="submitAddQuestion"
                >
                  Gửi ý kiến
                </v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12 class="mx-3 mt-4" v-if="activeAddQuestion">
        <div id="contentQuestion">
          <span><v-icon class="blue--text">contact_support</v-icon> </span>
          <span class="text-bold primary--text">Tạo câu hỏi:</span>
        </div>
        <div class="mx-1 my-2">
          <vue-editor v-model="content" :editorToolbar="customToolbar"></vue-editor>
        </div>
        <div class="mx-2">
          <v-form ref="form" v-model="valid" lazy-validation class="px-3 pt-3">
            <v-flex xs12 sm6 class="text-xs-center" style="margin:0 auto">
              <v-text-field
                box
                label="Họ tên"
                v-model="fullName"
                :rules="[rules.required]"
                name="input-10-2"
                min="6"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 class="text-xs-center" style="margin:0 auto">
              <v-text-field
                box
                label="Thư điện tử"
                v-model="contactEmail"
                :rules="[rules.required, rules.email]"
                name="input-10-2"
                min="6"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 v-if="captchaActive" style="margin:0 auto">
              <captcha ref="captcha"></captcha>
            </v-flex>
          </v-form>
        </div>
      </v-flex>
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
      [{
        createDate: "30/01/2019 17:27:20",
        modifiedDate: "30/01/2019 17:27:20",
        publish: 1,
        questionId: 101,
        userName: "",
        answerId: 101,
        content: `<p>Nộp hồ sơ của công dân có 2 hình thức:</p>
          <ol>
          <li>Nộp hồ sơ trực tiếp tại Trung tâm Hành Chính Công của Bộ GTVT</li>
          <li>Đăng ký tài khoản và nộp hồ sơ trên trang web</li>
        </ol>`
      }],
      [{
        createDate: "30/01/2019 17:27:20",
        modifiedDate: "30/01/2019 17:27:20",
        publish: 1,
        questionId: 102,
        userName: "",
        answerId: 102,
        content: `<p>Có 4 hình thức tra cứu hồ sơ cụ thể như sau:</p>
          <ol>
          <li>Trên trang web nhập mã hồ sơ</li>
          <li>Đối với hồ sơ dịch vụ công trực tuyến tra cứu bằng cách đăng nhập tài khoản của cá nhân/ đơn vị đã nộp hồ sơ để tra cứu</li>
          <li>Gọi tới số điện thoại 1900 0318</li>
          <li>ABC &lt;khoảng cách&gt; &lt;Mã số hồ sơ&gt; gửi về tổng đài 9001</li>
        </ol>`
      }]
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
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      var vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      if (newQuery.hasOwnProperty('crtQ')) {
        vm.$store.commit('setActiveAddQuestion', true)
        setTimeout (function () {
          let elmnt = document.getElementById("contentQuestion")
          elmnt.scrollIntoView()
        }, 300)
      }
      vm.$store.commit('setActiveGetQuestion', !vm.activeGetQuestion)
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
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
      vm.loadingAnswer = true
      let filter = {
        questionId: item.questionId
      }
      vm.$store.dispatch('getAnswers', filter).then(function (result) {
        vm.loadingAnswer = false
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
        vm.loadingAnswer = false
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
        return
      } else if (vm.content) {
        console.log('content', vm.content)
        if (vm.$refs.form.validate()) {
          let filter = {
            content: vm.content,
            fullname: vm.fullName,
            email: vm.contactEmail,
            publish: 0,
            j_captcha_response: vm.$refs.captcha.j_captcha_response
          }
          vm.$store.dispatch('addQuestion', filter).then(function (result) {
            toastr.success('Hệ thống đã tiếp nhận ý kiến của bạn')
            vm.$refs.captcha.makeImageCap()
            vm.$store.commit('setActiveGetQuestion', !vm.activeGetQuestion)
            vm.$store.commit('setActiveAddQuestion', false)
          }).catch(function (reject) {
            console.log(reject)
          })
        }
      }
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
        fullname: item['fullname']
      }
      vm.$store.dispatch('putQuestion', filter).then(function (result) {
        toastr.success('Cập nhật thành công')
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
    editAnswer (item) {
      console.log(item)
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
