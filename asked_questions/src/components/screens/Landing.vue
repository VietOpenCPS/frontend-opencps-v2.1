<template>
  <div>
    <v-layout row wrap class="mb-3">
      <v-flex xs12 sm12 class="text-xs-center" style="margin-bottom: 20px;">
        <h3 v-if="getUser('Administrator')" class="text-xs-center mt-2" style="color:#065694">QUẢN LÝ CÂU HỎI</h3>
        <h3 v-else class="text-xs-center mt-2" style="color:#065694">HỎI ĐÁP THÔNG TIN</h3>
      </v-flex>
      <v-flex xs12 sm12>
        <content-placeholders v-if="loading" class="mt-3">
          <content-placeholders-text :lines="10" />
        </content-placeholders>
        <v-card v-else>
          <div v-if="questionList.length > 0">
            <v-expansion-panel >
              <v-expansion-panel-content v-for="(itemQuestion, indexQuestion) in questionList"
              :key="indexQuestion">
                <v-icon slot="actions" color="primary" style="position:absolute;right:5px;top:10px">$vuetify.icons.expand</v-icon>
                <div class="ml-3" slot="header" @click="getAnswers(itemQuestion, indexQuestion)" >
                  <span class="text-bold primary--text">Câu hỏi {{indexQuestion+1}}. </span>
                  <!-- <span class="text-bold">{{itemQuestion.content}}</span> -->
                  <div class="ml-2 mt-2" v-html="itemQuestion.content"></div>
                  <div v-if="getUser('Administrator')" style="display:inline-block;position:absolute;right:50px;top:0">
                    <v-tooltip top class="mr-1">
                      <v-btn title="Thêm câu trả lời" class="my-0" icon slot="activator" style="margin-top:-8px!important"
                       @click="addAnswer($event, itemQuestion, indexQuestion)">
                        <v-icon color="blue" size="24px">add</v-icon>
                      </v-btn>
                      <span>Thêm câu trả lời</span>
                    </v-tooltip>
                    <!-- <v-tooltip top class="ml-2">
                      <v-btn icon slot="activator" @click.native="deleteQuestion(itemQuestion)">
                        <v-icon color="orange">bookmark</v-icon>
                      </v-btn>
                      <span>Xóa câu hỏi</span>
                    </v-tooltip> -->
                    <v-checkbox class="mt-1" style="display: inline-block" @click.stop="changePublic(itemQuestion, indexQuestion)"
                      label="Công khai"
                      v-model="itemQuestion['publish']"
                    ></v-checkbox>
                  </div>
                </div>
                <div v-if="loadingAnswer">
                  <content-placeholders v-if="loading" class="mt-3">
                    <content-placeholders-text :lines="10" />
                  </content-placeholders>
                </div>
                <div v-else>
                  <v-card flat v-if="answerList.length > 0">
                    <div class="ml-3 my-1">
                      <i class="green--text text-bold">Trả lời: </i>
                    </div>
                    <v-card-text class="my-0 py-0">
                      <div>
                        <div
                          class="mb-2 px-2"
                          style="border:1px solid #dedede;border-radius:3px"
                          v-for="(itemAnswer, indexAnswer) in answerList"
                          :key="indexAnswer"
                        >
                          <div>
                            <div style="position:relative">
                              <span class="text-bold">Câu trả lời {{indexAnswer + 1}}. </span>
                              <!-- <span>{{ itemAnswer.content }}</span> -->
                              <div class="ml-2 mt-2" v-html="itemAnswer.content"></div>
                              <div v-if="getUser('Administrator')" style="display:inline-block;position:absolute;right:10px;top:0">
                                <v-tooltip top class="mr-2">
                                  <v-btn slot="activator" icon ripple @click="deleteAnswer(itemAnswer)" style="margin-top:-3px!important">
                                    <v-icon color="red lighten-1">delete</v-icon>
                                  </v-btn>
                                  <span>Xóa</span>
                                </v-tooltip>
                                <v-checkbox class="mt-1" style="display: inline-block" @click.stop="changePublicAnswer(itemAnswer, indexAnswer)"
                                  label="Công khai"
                                  v-model="itemAnswer['publish']"
                                ></v-checkbox>
                              </div>
                            </div>
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
                
                <div class="mx-2" v-if="questionSelected === indexQuestion">
                  <div class="mx-3">
                    <span><v-icon class="blue--text">contact_support</v-icon> </span>
                    <span class="text-bold primary--text">Thêm câu trả lời:</span>
                  </div>
                  <div class="px-3 pt-3">
                    <v-flex xs12 sm12 style="margin:0 auto">
                      <!-- <v-textarea v-model="contentAnswer" box 
                      label="Nội dung câu trả lời" rows="4"
                      :rules="[rules.required]"
                      required
                      ></v-textarea> -->
                      <vue-editor v-model="contentAnswer" :editorToolbar="customToolbar"></vue-editor>
                    </v-flex>
                    <div>
                      <v-checkbox class="mt-0"
                        label="Công khai"
                        v-model="publishAnswer"
                      ></v-checkbox>
                    </div>
                    <div class="text-xs-center my-2">
                      <v-btn color="primary"
                        :loading="loading"
                        :disabled="loading"
                        @click="submitAddAnswer(itemQuestion, indexQuestion)"
                      >
                        <v-icon>how_to_reg</v-icon>&nbsp;
                        Gửi câu trả lời
                      </v-btn>
                      <v-btn color="primary"
                        @click="questionSelected = ''"
                      >
                        <v-icon>clear</v-icon>&nbsp;
                        Hủy
                      </v-btn>
                    </div>
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
        </v-card>
      </v-flex>
      <v-flex xs12 sm12 class="mx-3 mt-4" v-if="activeAddQuestion">
        <div id="contentQuestion">
          <span><v-icon class="blue--text">contact_support</v-icon> </span>
          <span class="text-bold primary--text">Tạo câu hỏi:</span>
        </div>
        <div class="mx-1 my-2">
          <vue-editor v-model="content" :editorToolbar="customToolbar"></vue-editor>
          <!-- <v-textarea v-model="content" box 
          label="Nội dung câu hỏi" rows="4"
          :rules="[rules.required]"
          required
          ></v-textarea> -->
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
            <div class="text-xs-center my-2">
              <v-btn color="primary"
                :loading="loading"
                :disabled="loading"
                @click="submitAddQuestion"
              >
                <v-icon>how_to_reg</v-icon>&nbsp;
                Gửi câu hỏi
              </v-btn>
              <v-btn color="primary"
                @click="cancelAddQuestion"
              >
                <v-icon>clear</v-icon>&nbsp;
                Hủy
              </v-btn>
            </div>
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
    VueEditor
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
    contactEmail: '',
    fullName: '',
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
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      var vm = this
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
      vm.answerList = []
      let filter = {
        questionId: item.questionId
      }
      vm.$store.dispatch('getAnswers', filter).then(function (result) {
        vm.loadingAnswer = false
        console.log(result)
        if (Array.isArray(result)) {
          vm.answerList = result
        } else {
          vm.answerList = [result]
        }
      }).catch(function (reject) {
        vm.loadingAnswer = false
        console.log(reject)
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
            publish: 1,
            j_captcha_response: vm.$refs.captcha.j_captcha_response
          }
          vm.$store.dispatch('addQuestion', filter).then(function (result) {
            toastr.success('Thêm câu hỏi thành công')
            vm.$store.commit('setActiveGetQuestion', !vm.activeGetQuestion)
            vm.$store.commit('setActiveAddQuestion', false)
          }).catch(function (reject) {
            console.log(reject)
          })
        }
      }
    },
    addAnswer (event, item, index) {
      let vm = this
      console.log(item)
      if (vm.openQuestion === index) {
        event.stopPropagation()
        vm.questionSelected = index
      } else {
        vm.questionSelected = index
      }
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
      console.log(item)
    },
    changePublic (item, index) {
      let vm = this
      console.log(item, index)
      if (vm.questionList[index]['publish'] === 1) {
        vm.questionList[index]['publish'] = 0
      } else {
        vm.questionList[index]['publish'] = 1
      }
      let list = vm.questionList
      vm.$store.commit('setQuestionList', list)
      let filter = {
        questionId: item['questionId'],
        publish: vm.questionList[index]['publish'],
        content: vm.questionList[index]['content']
      }
      vm.$store.dispatch('putQuestion', filter).then(function (result) {
        toastr.success('Cập nhật thành công')
      }).catch(function (reject) {
        console.log(reject)
      })
    },
    changePublicAnswer (item, index) {
      let vm = this
      console.log(item, index)
      if (vm.answerList[index]['publish'] === 1) {
        vm.answerList[index]['publish'] = 0
      } else {
        vm.answerList[index]['publish'] = 1
      }

      let filter = {
        questionId: item['questionId'],
        answerId: item['answerId'],
        publish: vm.answerList[index]['publish'],
        content: vm.answerList[index]['content']
      }
      vm.$store.dispatch('putAnswer', filter).then(function (result) {
        toastr.success('Cập nhật thành công')
      }).catch(function (reject) {
        console.log(reject)
      })
    },
    editAnswer (item) {
      console.log(item)
    },
    getAnswerList (item) {
      let vm = this
      vm.loadingAnswer = true
      vm.answerList = []
      let filter = {
        questionId: item.questionId
      }
      vm.$store.dispatch('getAnswers', filter).then(function (result) {
        vm.loadingAnswer = false
        console.log(result)
        if (Array.isArray(result)) {
          vm.answerList = result
        } else {
          vm.answerList = [result]
        }
      }).catch(function (reject) {
        vm.loadingAnswer = false
        console.log(reject)
      })
    },
    deleteAnswer (item) {
      let vm = this
      let filter = {
        questionId: item['questionId'],
        answerId: item['answerId']
      }
      vm.$store.dispatch('deleteAnswer', filter).then(function (result) {
        toastr.success('Xóa câu trả lời thành công')
        vm.getAnswerList(item)
      }).catch(function (reject) {
        console.log(reject)
      })
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
<style>
  .bg-gif-register {
    background: url('https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend-cli/register/app/img/bg-gif-register.gif') no-repeat center center;
    padding-top: 77.961783%;
    background-size: contain;
  }
</style>
