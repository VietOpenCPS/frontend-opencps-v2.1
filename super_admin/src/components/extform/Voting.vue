<template>
  <div>
    <v-breadcrumbs>
      <v-icon slot="divider">chevron_right</v-icon>

      <v-breadcrumbs-item
        v-for="item in breadCrumbsitems"
        :disabled="item.disabled"
        :key="item.text"
      >
        {{ item.text }}
      </v-breadcrumbs-item>
      <a href="javascript:;" style="
        text-decoration: none;
        font-weight: bold;
      ">opencps_voting</a>
    </v-breadcrumbs>

    <v-card class="px-2 mx-1">
      <v-toolbar color="blue darken-3" dark height="48">
        <v-btn dark icon>
          <v-icon>edit</v-icon>
        </v-btn>
        <v-toolbar-title class="ml-0">
          Quản lý câu hỏi khảo sát
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn dark icon v-on:click.native="backToList">
          <v-icon>reply</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="grid-list mt-3">
        <v-card class="py-2">
          <v-flex xs12 class="pl-0">
            <v-autocomplete
              box
              label="Đối tượng khảo sát"
              :items="classNameItems"
              v-model="className"
              item-text="text"
              item-value="value"
              @change="changeClassName"
            >
              <template
                slot="item"
                slot-scope="data"
              >
                <v-flex xs12>{{data.item.text}} - {{data.item.value}}</v-flex>
              </template>
            </v-autocomplete>
          </v-flex>
        </v-card>
        <v-card>
          <v-btn color="blue darken-3" dark v-if="className"
            class="mb-3 mx-2"
            @click="createQuestion"
          >
            <v-icon>add_circle_outline</v-icon>&nbsp;
            Thêm câu hỏi
          </v-btn>
          <div class="px-2 py-2">
            <div class="mb-2" v-if="Array.isArray(votingItems) && votingItems.length > 0" v-for="(item, index) in votingItems" :key="index" style="position:relative">
              <!-- <div class="text-bold" v-else>
                {{index + 1}}.&nbsp; {{ item.subject }}
              </div> -->
              <v-layout wrap class="text-bold">
                <div class="flex px-3 py-1" style="height:26px;max-width:80px;background-color: #034687;transform: skew(-25deg)">
                  <span class="d-block white--text" style="transform: skew(25deg)">Câu {{index + 1}} : </span>
                </div>
                <!-- <div v-html="item.subject" class="flex pl-3 pr-2" style="max-width:calc(100% - 100px);color:#034687" v-if="String(item.subject).indexOf('/>') > 0 || String(item.subject).indexOf('<br') > 0">
                </div> -->
                <div v-html="lastestVersion !== 2 ? item.subject : item.title" class="flex pl-3 pr-2 pt-0" style="max-width:calc(100% - 100px);color:#034687">
                </div>
              </v-layout>
              <div v-if="lastestVersion !== 2" style="position:absolute;right:0px;top:-5px" :style="Array.isArray(item.choices) && item.choices.length > 1  ? 'width:50px' : 'width:85px'">
                <v-tooltip top>
                  <v-btn slot="activator" class="mx-0 my-1" icon ripple @click="editVotings(item)">
                    <v-icon color="blue lighten-1">edit</v-icon>
                  </v-btn>
                  <span>Sửa</span>
                </v-tooltip>
                <v-tooltip top>
                  <v-btn slot="activator" class="mx-0 my-1" icon ripple @click="deleteVotings(item)">
                    <v-icon color="red lighten-1">delete</v-icon>
                  </v-btn>
                  <span>Xóa</span>
                </v-tooltip>
              </div>
              <div v-if="lastestVersion === 2" style="position:absolute;right:0px;top:-5px" :style="Array.isArray(item.lstChoiceDetailModels) && item.lstChoiceDetailModels.length > 1  ? 'width:50px' : 'width:85px'">
                <v-tooltip top>
                  <v-btn slot="activator" class="mx-0 my-1" icon ripple @click="editVotings(item)">
                    <v-icon color="blue lighten-1">edit</v-icon>
                  </v-btn>
                  <span>Sửa</span>
                </v-tooltip>
                <v-tooltip top>
                  <v-btn slot="activator" class="mx-0 my-1" icon ripple @click="deleteVotings(item)">
                    <v-icon color="red lighten-1">delete</v-icon>
                  </v-btn>
                  <span>Xóa</span>
                </v-tooltip>
              </div>
              <v-radio-group v-if="lastestVersion !== 2" class="ml-3 mt-2" column :style="Array.isArray(item.choices) && item.choices.length > 1 ? 'width:calc(100% - 50px)' : 'width:calc(100% - 85px)'">
                <v-radio v-for="(item1, index1) in item.choices" v-bind:key="index1" :label="item1" :value="index1 + 1" readonly></v-radio>
              </v-radio-group>
              <v-radio-group v-if="lastestVersion === 2" class="ml-3 mt-2" column :style="Array.isArray(item.lstChoiceDetailModels) && item.lstChoiceDetailModels.length > 1 ? 'width:calc(100% - 50px)' : 'width:calc(100% - 85px)'">
                <v-radio v-for="(item1, index1) in item.lstChoiceDetailModels" v-bind:key="index1" :label="item1['subject']" :value="index1 + 1" readonly></v-radio>
              </v-radio-group>
              <v-divider
                v-if="Array.isArray(votingItems) && index + 1 < votingItems.length"
              ></v-divider>
            </div>
            <div v-if="Array.isArray(votingItems) && votingItems.length === 0" class="">
              <v-alert outline color="warning" icon="priority_high" :value="true">
                Không có câu hỏi
              </v-alert>
            </div>
          </div>
        </v-card>
        <v-dialog v-model="dialog_addQuestion" scrollable persistent max-width="1000px">
          <v-card>
            <v-card-title class="headline pb-2">
              <span v-if="type === 'add'">Thêm câu hỏi</span>
              <span v-else>Sửa câu hỏi</span>
            </v-card-title>
            <v-card-text class="pt-0">
              <v-form ref="formAddQuestion" v-model="validForm" lazy-validation>
                <!-- model ver_1 -->
                <v-layout v-if="lastestVersion !== 2" wrap class="py-1 align-center row-list-style">
                  <p class="my-2">Mã câu hỏi:</p>
                  <v-flex xs12>
                    <v-text-field
                      box
                      v-model="votingCode"
                      :rules="type === 'add' ? [rules.required, rules.varchar75, rules.syntaxError] : []"
                      :required="type === 'add'"
                      :disabled="type !== 'add'"
                      :maxlength="75"
                      :counter="75"
                    ></v-text-field>
                  </v-flex>
                  <p class="my-2">Nội dung câu hỏi:</p>
                  <v-flex xs12 class="" style="position: relative">
                    <v-btn @click="editorVisible = !editorVisible" flat icon color="primary" style="position: absolute; top: 0; right: 0; z-index: 5">
                      <v-icon v-if="!editorVisible">code</v-icon>
                      <v-icon v-else>edit</v-icon>
                    </v-btn>
                    <v-textarea
                      v-if="!editorVisible"
                      box
                      rows="3"
                      v-model="subject"
                      :rules="[rules.required, rules.varchar2000, rules.syntaxError]"
                      required
                      :maxlength="2000"
                      :counter="2000"
                    ></v-textarea>
                  </v-flex>
                  <p class="my-2">Câu trả lời: </p>
                  <v-flex xs12 class="">
                    <!-- <div class="my-2 text-bold">:</div> -->
                    <v-layout wrap>
                      <v-flex xs12 sm10 class="pr-2">
                        <v-textarea
                          box
                          v-model="answer"
                          clearable
                          @keyup.enter="addChoices"
                          rows="3"
                          :maxlength="5000"
                          :counter="5000"
                        ></v-textarea>
                      </v-flex>
                      <v-flex xs12 sm2 class="text-xs-right">
                        <v-btn color="blue darken-3" dark
                          class="mt-0 mr-0"
                          :disabled="answer && String(answer).length <= 5000 ? false : true"
                          @click="addChoices"
                          :title="answer && String(answer).length > 5000 ? 'Câu trả lời tối đa 5000 ký tự' : ''"
                        >
                          <v-icon size="24">add</v-icon>&nbsp;
                          Thêm
                        </v-btn>
                      </v-flex>
                    </v-layout>
                    <!--  -->
                    <v-list-tile
                      v-for="(item, index) in choicesCurrent"
                      :key="index"
                      class="mt-2"
                      style="border: 1px solid #8fbc8f;"
                    >
                      <v-list-tile-content>
                        <v-list-tile-title style="font-size:13px">{{item}}</v-list-tile-title>
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <v-btn class="mx-0 my-0" icon ripple @click="deleteChoice(index, item)">
                          <v-icon color="red lighten-1">clear</v-icon>
                        </v-btn>
                      </v-list-tile-action>
                    </v-list-tile>
                  </v-flex>
                </v-layout>
                <!-- model ver_2 -->
                <v-layout v-else wrap class="py-1 align-center row-list-style">
                  <p class="my-2">Mã câu hỏi <span style="color: red">(*)</span>:</p>
                  <v-flex xs12>
                    <v-text-field
                      box
                      v-model="votingCode"
                      :rules="type === 'add' ? [rules.required, rules.varchar75, rules.syntaxError] : []"
                      :maxlength="75"
                      :counter="75"
                    ></v-text-field>
                  </v-flex>
                  <p class="my-2">Nội dung câu hỏi <span style="color: red">(*)</span>:</p>
                  <v-flex xs12 class="" style="position: relative">
                    <v-textarea
                      box
                      rows="5"
                      v-model="subject"
                      :rules="[rules.required, rules.varchar5000, rules.syntaxError]"
                      required
                      :maxlength="5000"
                      :counter="5000"
                    ></v-textarea>
                  </v-flex>
                  <v-layout wrap style="width: 100%">
                    <v-flex :class="className === 'survey' ? 'xs12 md6' : 'xs12'">
                      <p class="my-2">Trạng thái <span style="color: red">(*)</span>:</p>
                      <v-flex xs12 class="">
                        <v-autocomplete
                          box
                          :items="statusItems"
                          v-model="status"
                          item-text="text"
                          item-value="value"
                          :rules="[rules.required]"
                          required
                        >
                        </v-autocomplete>
                      </v-flex>
                    </v-flex>
                    <v-flex class="pl-3" xs12 md6 v-if="className === 'survey'">
                      <p class="my-2">ProcessTime :</p>
                      <v-flex xs12 class="">
                        <v-switch
                          v-model="processTime"
                        ></v-switch>
                      </v-flex>
                    </v-flex>
                  </v-layout>
                  <p class="my-2">Câu trả lời: </p>
                  <v-flex xs12 class="">
                    <!-- <div class="my-2 text-bold">:</div> -->
                    <v-layout wrap>
                      <v-flex xs12 sm10 class="pr-2">
                        <v-textarea
                          box
                          v-model="answer"
                          clearable
                          rows="6"
                          :maxlength="5000"
                          :counter="5000"
                        ></v-textarea>
                      </v-flex>
                      <v-flex xs12 sm2 class="text-xs-right">
                        <v-layout wrap class="">
                          <v-autocomplete
                            label="Trạng thái"
                            box
                            :items="statusItems"
                            v-model="statusChoice"
                            item-text="text"
                            item-value="value"
                          >
                          </v-autocomplete>
                          <v-text-field
                            label="Thứ tự"
                            box
                            v-model="sibling"
                            :rules="type === 'add' ? [rules.varchar75, rules.syntaxError] : []"
                            :maxlength="75"
                          ></v-text-field>
                          <v-text-field
                            label="Số điểm"
                            box
                            v-model="votePoint"
                            :rules="[rules.varchar75, rules.syntaxError]"
                            :maxlength="75"
                          ></v-text-field>
                        </v-layout>
                      </v-flex>
                      <v-flex xs12>
                        <v-btn color="blue darken-3" dark v-if="!updateChoice"
                          class="mt-0 mr-0"
                          :disabled="answer && String(answer).length <= 5000 ? false : true"
                          @click.stop="addChoices"
                          :title="answer && String(answer).length > 5000 ? 'Câu trả lời tối đa 5000 ký tự' : ''"
                        >
                          <v-icon size="24">add</v-icon>
                          <span>Thêm trả lời</span>
                        </v-btn>
                        <v-btn color="blue darken-3" dark v-if="updateChoice"
                          class="mt-0 mr-0"
                          :disabled="answer && String(answer).length <= 5000 ? false : true"
                          @click="updateChoiceAction"
                          :title="answer && String(answer).length > 5000 ? 'Câu trả lời tối đa 5000 ký tự' : ''"
                        >
                          <v-icon size="24">save</v-icon>&nbsp;
                          <span >Cập nhật trả lời</span>
                        </v-btn>
                        <v-btn v-if="updateChoice" color="blue darken-3" dark
                          class="mt-0 mr-0"
                          @click="cancelUpdateChoices"
                        >
                          <v-icon size="20">clear</v-icon>&nbsp;
                          <span>Hủy</span>
                        </v-btn>
                      </v-flex>
                    </v-layout>
                    <!--  -->
                    <div
                      v-for="(item, index) in choicesCurrent"
                      :key="index"
                      class="mt-2 px-2 py-2"
                      style="border: 1px solid #8fbc8f;"
                    >
                      <v-layout wrap>
                        <v-flex style="width: calc(100% - 100px);">
                          <div class="mb-2" style="font-weight: 500;">
                            <span>STT: {{item.sibling}}</span> - <span> Trạng thái: {{item.status === 1 ? 'Công khai' : 'Không công khai'}}</span> - 
                            <span> Số điểm: {{item.votePoint}}</span>
                          </div>
                          <div>{{item.subject}}</div>
                        </v-flex>
                        <v-flex class="text-xs-right" style="width: 100px;max-width: 100px;">
                          <v-btn class="mx-0 my-0" icon ripple @click="editChoice(item, index)">
                            <v-icon color="blue lighten-1">edit</v-icon>
                          </v-btn>
                          <v-btn class="mx-0 my-0" icon ripple @click="deleteChoice(index, item)">
                            <v-icon color="red lighten-1">clear</v-icon>
                          </v-btn>
                        </v-flex>
                      </v-layout>
                    </div>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions class="px-3">
              <v-spacer></v-spacer>
              <v-btn color="blue darken-3" dark
                :loading="loading"
                :disabled="loading"
                @click="lastestVersion !== 2 ? updateQuestion('add') : createQuestionVer2('add')"
                v-if="type === 'add'"
              >
                <v-icon>add_circle_outline</v-icon>&nbsp;
                Thêm mới
              </v-btn>
              <v-btn color="blue darken-3" dark
                v-else
                :loading="loading"
                :disabled="loading"
                @click="lastestVersion !== 2 ? updateQuestion('update') : createQuestionVer2('update')"
              >
                <v-icon>save</v-icon>&nbsp;
                Cập nhật
              </v-btn>
              <v-btn color="red darken-3" class="mr-0" dark v-on:click="cancelDialog">
                <v-icon>clear</v-icon>&nbsp;
                Hủy
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-card>
  </div>
</template>

<script>
  import TinyPagination from '../ext/TinyPagination.vue'
  import { VueEditor, Quill } from 'vue2-editor'
  import toastr from 'toastr'
  export default {
    components: {
      'tiny-pagination': TinyPagination,
      VueEditor
    },
    data () {
      return {
        breadCrumbsitems: [
          {
            text: 'Bảng dữ liệu',
            disabled: false
          },
          {
            text: '',
            disabled: false
          }
        ],
        classNameItems: [
          {
            text: 'Đơn vị',
            value: 'govagency'
          },
          {
            text: 'Cán bộ',
            value: 'employee'
          },
          {
            text: 'Hồ sơ',
            value: 'dossier'
          },
          {
            text: 'Khảo sát',
            value: 'survey',
            lastestVersion: 2
          }
        ],
        lastestVersion: 1,
        votingItems: [],
        className: '',
        validForm: false,
        currentQuestion: {
        },
        currentChoice: '',
        indexChoiceUpdate: '',
        updateChoice: false,
        votePoint: '',
        statusItems: [
          {
            text: 'Công khai',
            value: 1
          },
          {
            text: 'Không công khai',
            value: 0
          }
        ],
        processTime: false,
        status: 1,
        statusChoice: 1,
        sibling: '',
        subject: '',
        votingCode: '',
        answer: '',
        choicesCurrent: [],
        votingIdCurrent: '',
        type: '',
        editorVisible: false,
        loading: false,
        dialog_addQuestion: false,
        rules: {
          required: (value) => {
            return value || value === 0 ? true : 'Bắt buộc phải nhập.'
          },
          number: value => {
            const pattern = /^\d+$/
            return pattern.test(value) || 'Bắt buộc phải nhập kiểu số.'
          },
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Sai định dạng thư điện tử.'
          },
          passWord: (value) => {
            const pattern = /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&])([0-9a-zA-Z@$!%*#?&]{8,}))$/
            return pattern.test(value) || 'Ít nhất 8 ký tự và có chữ hoa, chữ thường, ký tự đặc biệt @$!%*#?&'
          },
          telNo: (value) => {
            const pattern = /^0([1-9]{1}\d{8})$/
            if (value) {
              return pattern.test(value) || 'Số điện thoại gồm 10 ký tự 0-9, eg: 0989123456, ...'
            } else {
              return []
            }
          },
          syntaxError: (value) => {
            if (value) {
              value = String(value).trim()
              return value.indexOf('</') < 0 ? true : 'Không được có ký tự </'   
            } else {
              return true
            }  
          },
          varchar50: (val) => {
            if(val){
              val = String(val).trim()
              return val.length <= 50 ? true : 'Không được nhập quá 50 ký tự'   
            } else {
              return true
            }  
          },
          varchar75: (val) => {
            if(val){
              val = String(val).trim()
              return val.length <= 75 ? true : 'Không được nhập quá 75 ký tự'   
            } else {
              return true
            }
          },
          varchar255: (val) => {
            if(val){
              val = String(val).trim()
              return val.length <= 255 ? true : 'Không được nhập quá 255 ký tự'   
            } else {
              return true
            }  
          },
          varchar500: (val) => {
            if(val){
              val = String(val).trim()
              return val.length <= 500 ? true : 'Không được nhập quá 500 ký tự'   
            } else {
              return true
            }  
          },
          varchar2000: (val) => {
            if(val){
              val = String(val).trim()
              return val.length <= 5000 ? true : 'Không được nhập quá 5000 ký tự'   
            } else {
              return true
            }
          },
          varchar5000: (val) => {
            if(val){
              val = String(val).trim()
              return val.length <= 5000 ? true : 'Không được nhập quá 5000 ký tự'   
            } else {
              return true
            }
          },
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
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        let currentQuery = vm.$router.history.current.query
        let serverconfig = 'CLASSNAME_VOTING'
        vm.$store.dispatch('getServerconfigs', serverconfig).then(function (result) {
          try {
            let configs = JSON.parse(result.configs)
            vm.classNameItems = configs.classNames
          } catch (error) {
          }
          vm.className = vm.classNameItems[0]['value']
          if (vm.classNameItems[0] && vm.classNameItems[0].hasOwnProperty('lastestVersion') && vm.classNameItems[0]['lastestVersion']) {
            vm.lastestVersion = vm.classNameItems[0]['lastestVersion']
          }
          if (vm.className) {
            vm.getVotingList()
          }
        }).catch(function (){
          vm.className = vm.classNameItems[0]['value']
          if (vm.classNameItems[0] && vm.classNameItems[0].hasOwnProperty('lastestVersion') && vm.classNameItems[0]['lastestVersion']) {
            vm.lastestVersion = vm.classNameItems[0]['lastestVersion']
          }
          if (vm.className) {
            vm.getVotingList()
          }
        })
        
      })
    },
    computed: {
    },
    watch: {
      '$route': function (newRoute) {
        let vm = this
        let currentQuery = newRoute.query
      }
    },
    methods: {
      getVotingList () {
        let vm = this
        let filter = {
          className: vm.className
        }
        vm.votingItems = []
        vm.loading = true
        if (vm.lastestVersion !== 2) {
          vm.$store.dispatch('getVotingList', filter).then(function (result) {
            vm.loading = false
            vm.votingItems = Array.isArray(result.data) ? result.data : [result.data]
          }).catch(reject => {
            vm.loading = false
            console.log(reject)
          })
        } else {
          vm.$store.dispatch('getVotingListVer2', filter).then(function (result) {
            vm.loading = false
            let items = Array.isArray(result.data) ? result.data : [result.data]
            let lengthQuestion = items.length
            for (let index = 0; index < lengthQuestion; index++) {
              if (items[index]['lstChoiceDetailModels']) {
                let listChoice = Array.isArray(items[index]['lstChoiceDetailModels']) ? items[index]['lstChoiceDetailModels'] : [items[index]['lstChoiceDetailModels']]
                items[index] = Object.assign(items[index]['voteModel'], {lstChoiceDetailModels: listChoice})
              } else {
                items[index] = Object.assign(items[index]['voteModel'], {lstChoiceDetailModels: []})
              }
            }
            vm.votingItems = items
          }).catch(reject => {
            vm.loading = false
            console.log(reject)
          })
        }
      },
      changeClassName () {
        let vm = this
        setTimeout(function () {
          if (vm.className) {
            let filter = vm.classNameItems.filter(function (item) {
              return item.value == vm.className
            })[0]
            if (filter && filter.hasOwnProperty('lastestVersion') && filter['lastestVersion']) {
              vm.lastestVersion = filter['lastestVersion']
            } else {
              vm.lastestVersion = ''
            }
            vm.getVotingList()
          }
        }, 300)
      },
      createQuestion () {
        let vm = this
        vm.type = 'add'
        // vm.votingCode = ''
        vm.answer = ''
        vm.choicesCurrent = []
        vm.$refs.formAddQuestion.reset()
        vm.status = 1
        vm.statusChoice = 1
        vm.dialog_addQuestion = true
      },
      addChoices () {
        let vm = this
        if (vm.lastestVersion !== 2) {
          if (vm.answer) {
            vm.choicesCurrent.push(vm.answer)
          }
        } else {
          if (vm.answer && vm.statusChoice) {
            if (vm.type === 'add') {
              let choice = {
                subject: vm.answer,
                sibling: vm.sibling,
                status: vm.statusChoice,
                votePoint: vm.votePoint
              }
              vm.choicesCurrent.push(choice)
              vm.answer = ''
              vm.sibling = ''
              vm.statusChoice = 1
              vm.votePoint = ''
            } else {
              let dataChoice = {
                className: vm.className,
                subject: vm.answer,
                sibling: vm.sibling,
                status: vm.statusChoice,
                votePoint: vm.votePoint,
                voteId: vm.votingIdCurrent
              }
              vm.$store.dispatch('createChoices', dataChoice).then(function (response) {
                vm.choicesCurrent.push(response)
                vm.answer = ''
                vm.sibling = ''
                vm.statusChoice = 1
                vm.votePoint = ''
              }).catch(function () {
                toastr.error('Thêm câu trả lời thất bại')
              })
            }
          }
        }
      },
      deleteChoice (index, item) {
        let vm = this
        vm.updateChoice = false
        vm.currentChoice = ''
        vm.answer = ''
        vm.statusChoice = 1
        vm.sibling = ''
        if (vm.lastestVersion !== 2) {
          vm.choicesCurrent.splice(index, 1)
        } else {
          let x = confirm('Bạn có chắc chắn xóa trả lời này?')
          if (x) {
            let filter = {
              voteChoiceId: item.voteChoiceId,
              className: vm.className
            }
            vm.$store.dispatch('deleteChoiceNew', filter).then(function () {
              toastr.success('Xóa trả lời thành công')
              setTimeout (function () {
                vm.choicesCurrent.splice(index, 1)
              }, 300)
            }).catch(reject => {
              toastr.error('Xóa trả lời thất bại')
            })
          }
        }
      },
      updateQuestion (type) {
        let vm = this
        let choicesItems = ''
        if (vm.choicesCurrent && vm.choicesCurrent.length > 0) {
          for(let key in vm.choicesCurrent){
            choicesItems += vm.choicesCurrent[key] + '\r\n'
          }
        }
        let filter = {
          className: vm.className,
          classPK: '0',
          subject: vm.subject,
          choices: choicesItems,
          commentable: '',
          type: vm.type,
          votingCode: vm.votingCode ? vm.votingCode : '',
          votingId: vm.votingIdCurrent
        }
        console.log('filter data', filter)
        if (vm.$refs.formAddQuestion.validate()) {
          vm.loading = true
          vm.$store.dispatch('updateVotings', filter).then(function (result) {
            vm.loading = false
            setTimeout (function () {
              vm.getVotingList()
            }, 300)
            vm.dialog_addQuestion = false
          }).catch(reject => {
            vm.loading = false
            console.log(reject)
          })
        }
      },
      createQuestionVer2 (type) {
        let vm = this
        let filter = {
          className: vm.className,
          title: vm.subject,
          description: '',
          voteCode: vm.votingCode ? vm.votingCode : '',
          type: vm.type,
          status: vm.status,
          choiceItems: vm.choicesCurrent
        }
        if (vm.className === 'survey') {
          filter.processTime = vm.processTime ? 1 : 0
        }
        if (vm.type === 'update') {
          filter['votingId'] = vm.votingIdCurrent
        }
        if (vm.$refs.formAddQuestion.validate()) {
          vm.loading = true
          vm.$store.dispatch('updateVotingsNew', filter).then(function (result) {
            vm.loading = false
            toastr.success('Yêu cầu thực hiện thành công')
            setTimeout (function () {
              vm.getVotingList()
            }, 300)
            vm.dialog_addQuestion = false
          }).catch(reject => {
            vm.loading = false
            console.log(reject)
          })
        }
      },
      cancelDialog () {
        let vm = this
        vm.getVotingList()
        vm.dialog_addQuestion = false
      },
      editVotings (item) {
        let vm = this
        vm.answer = ''
        vm.type = 'update'
        if (vm.lastestVersion !== 2) {
          vm.votingCode = item['votingCode']
          vm.subject = item['subject']
          vm.choicesCurrent = item['choices']
          vm.votingIdCurrent = item['votingId']
        } else {
          vm.votingCode = item['voteCode']
          vm.subject = item['title']
          vm.status = item['status']
          vm.choicesCurrent = item['lstChoiceDetailModels']
          vm.votingIdCurrent = item['voteId']
          if (vm.className === 'survey') {
            vm.processTime = item['processTime'] === 1 ? true : false
          }
        }
        console.log('choicesCurrent', vm.choicesCurrent)
        vm.dialog_addQuestion = true
      },
      editChoice (item, index) {
        let vm = this
        vm.updateChoice = true
        vm.currentChoice = item
        vm.indexChoiceUpdate = index
        vm.answer = item.subject
        vm.statusChoice = item.status
        vm.sibling = item.sibling
        vm.votePoint = item.votePoint
      },
      updateChoiceAction () {
        let vm = this
        if (vm.type === 'add') {
          let update = {
            answer: vm.answer,
            status: vm.statusChoice,
            sibling: vm.sibling
          }
          vm.choicesCurrent[vm.indexChoiceUpdate] = Object.assign(vm.choicesCurrent[vm.indexChoiceUpdate], update)
        } else {
          vm.updateChoiceDetail()
        }
      },
      cancelUpdateChoices () {
        let vm = this
        vm.updateChoice = false
        vm.currentChoice = ''
        vm.answer = ''
        vm.statusChoice = 1
        vm.sibling = ''
        vm.votePoint = ''
      },
      updateChoiceDetail () {
        let vm = this
        let filter = {
          className: vm.className,
          subject: vm.answer,
          voteId: vm.votingIdCurrent,
          status: vm.statusChoice,
          votePoint: vm.votePoint,
          sibling: vm.sibling,
          voteChoiceId: vm.currentChoice['voteChoiceId']
        }
        if (vm.answer && vm.statusChoice !== '') {
          vm.$store.dispatch('updateChoices', filter).then(function (result) {
            toastr.success('Cập nhật trả lời thành công')
            let update = {
              subject: vm.answer,
              status: vm.statusChoice,
              sibling: vm.sibling,
              votePoint: vm.votePoint,
              voteId: vm.votingIdCurrent,
              voteChoiceId: vm.currentChoice['voteChoiceId']
            }
            vm.choicesCurrent[vm.indexChoiceUpdate] = Object.assign(vm.choicesCurrent[vm.indexChoiceUpdate], update)
            vm.cancelUpdateChoices()
          }).catch(reject => {
            toastr.error('Cập nhật trả lời thất bại')
          })
        }
      },
      deleteVotings (item) {
        let vm = this
        let x = confirm('Bạn có chắc chắn xóa câu hỏi này?')
        if (x) {
          if (vm.lastestVersion !== 2) {
            let filter = {
              votingId: item.votingId
            }
            vm.$store.dispatch('deleteVotings', filter).then(function () {
              setTimeout (function () {
                vm.getVotingList()
              }, 300)
            }).catch(reject => {
              console.log(reject)
            })
          } else {
            let filter = {
              votingId: item.voteId,
              className: vm.className
            }
            vm.$store.dispatch('deleteVotingsNew', filter).then(function () {
              toastr.success('Xóa câu hỏi thành công')
              setTimeout (function () {
                vm.getVotingList()
              }, 300)
            }).catch(reject => {
              toastr.error('Xóa câu hỏi thất bại')
            })
          }
        }
      },
      backToList () {
        window.history.back()
      }
    },
    filters: {
    }
  }
</script>
