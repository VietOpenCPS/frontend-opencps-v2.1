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
              <div class="text-bold">
                {{index + 1}}.&nbsp; {{ item.subject }}
              </div>
              <div style="position:absolute;right:0px;top:-5px" :style="Array.isArray(item.choices) && item.choices.length > 1  ? 'width:50px' : 'width:85px'">
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
              <v-radio-group class="ml-3 mt-2" column :style="Array.isArray(item.choices) && item.choices.length > 1 ? 'width:calc(100% - 50px)' : 'width:calc(100% - 85px)'">
                <v-radio v-for="(item1, index1) in item.choices" v-bind:key="index1" :label="item1" :value="index1 + 1" readonly></v-radio>
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
        <v-dialog v-model="dialog_addQuestion" scrollable persistent max-width="700px">
          <v-card>
            <v-card-title class="headline pb-2">
              <span v-if="type === 'add'">Thêm câu hỏi</span>
              <span v-else>Sửa câu hỏi</span>
            </v-card-title>
            <v-card-text class="pt-0">
              <v-form ref="formAddQuestion" v-model="validForm" lazy-validation>
                <v-layout wrap class="py-1 align-center row-list-style">
                  <v-flex xs12 class="">
                    <!-- <div class="my-2 text-bold">:</div> -->
                    <v-textarea
                      label="Nội dung câu hỏi"
                      box
                      rows="2"
                      v-model="subject"
                      :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                      required
                    ></v-textarea>
                  </v-flex>
                  <v-flex xs12 class="">
                    <!-- <div class="my-2 text-bold">:</div> -->
                    <v-layout wrap>
                      <v-flex xs12 sm10 class="pr-2">
                        <v-text-field
                          label="Câu trả lời"
                          box
                          v-model="answer"
                          clearable
                          @keyup.enter="addChoices"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm2 class="text-xs-right">
                        <v-btn color="blue darken-3" dark
                          class="mt-0 mr-0"
                          :disabled="answer?false:true"
                          @click="addChoices"
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
                        <v-btn class="mx-0 my-0" icon ripple @click="deleteChoice(index)">
                          <v-icon color="red lighten-1">clear</v-icon>
                        </v-btn>
                      </v-list-tile-action>
                    </v-list-tile>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions class="px-3">
              <v-spacer></v-spacer>
              <v-btn color="blue darken-3" dark
                :loading="loading"
                :disabled="loading"
                @click="updateQuestion('add')"
                v-if="type === 'add'"
              >
                <v-icon>add_circle_outline</v-icon>&nbsp;
                Thêm mới
              </v-btn>
              <v-btn color="blue darken-3" dark
                v-else
                :loading="loading"
                :disabled="loading"
                @click="updateQuestion('update')"
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
  export default {
    components: {
      'tiny-pagination': TinyPagination
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
            value: 'survey'
          }
        ],
        votingItems: [],
        className: '',
        validForm: false,
        currentQuestion: {
        },
        subject: '',
        answer: '',
        choicesCurrent: [],
        votingIdCurrent: '',
        type: '',
        loading: false,
        dialog_addQuestion: false,
        rules: {
          required: (value) => (!!value || value === 0) || 'Trường dữ liệu bắt buộc'
        }
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        let currentQuery = vm.$router.history.current.query
        vm.className = vm.classNameItems[0]['value']
        if (vm.className) {
          vm.getVotingList()
        }
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
        let currentQuery = vm.$router.history.current.query
        let filter = {
          className: vm.className
        }
        vm.loading = true
        vm.$store.dispatch('getVotingList', filter).then(function (result) {
          vm.loading = false
          vm.votingItems = result.data
        }).catch(reject => {
          vm.loading = false
          console.log(reject)
        })
      },
      changeClassName () {
        let vm = this
        setTimeout(function () {
          if (vm.className) {
            vm.getVotingList()
          }
        }, 300)
      },
      createQuestion () {
        let vm = this
        vm.type = 'add'
        vm.answer = ''
        vm.choicesCurrent = []
        vm.dialog_addQuestion = true
      },
      addChoices () {
        let vm = this
        if (vm.answer) {
          vm.choicesCurrent.push(vm.answer)
        }
      },
      deleteChoice (index) {
        let vm = this
        console.log(index)
        vm.choicesCurrent.splice(index, 1)
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
      cancelDialog () {
        let vm = this
        vm.getVotingList()
        vm.dialog_addQuestion = false
      },
      editVotings (item) {
        let vm = this
        vm.answer = ''
        vm.type = 'update'
        vm.subject = item['subject']
        vm.choicesCurrent = item['choices']
        vm.votingIdCurrent = item['votingId']
        vm.dialog_addQuestion = true
      },
      deleteVotings (item) {
        let x = confirm('Xác nhận xóa dữ liệu')
        if (x) {
          var vm = this
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
