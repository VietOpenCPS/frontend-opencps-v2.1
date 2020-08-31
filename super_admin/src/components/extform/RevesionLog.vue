<template>
  <div>
    <v-breadcrumbs>
      <v-icon slot="divider">chevron_right</v-icon>

      <v-breadcrumbs-item
      >
        
      </v-breadcrumbs-item>
      <a href="javascript:;" style="
        text-decoration: none;
        font-weight: bold;
      "></a>
    </v-breadcrumbs>
    <v-card class="px-2 mx-1">
      <v-toolbar color="blue darken-3" dark height="48">
        <v-btn dark icon>
          <v-icon>edit</v-icon>
        </v-btn>
        <v-toolbar-title class="ml-0">
          Nhật ký phiên bản
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn dark icon v-on:click.native="backToList">
          <v-icon>reply</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="grid-list mt-3">
          <v-layout wrap>
              <v-flex xs12 md3>
                <v-menu
                    ref="menu1"
                    :close-on-content-click="false"
                    v-model="menu1"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                >
                  <v-text-field
                    slot="activator"
                    v-model="createDateStartFomarted"
                    label="Từ ngày"
                    persistent-hint
                    append-icon="event"
                    box
                    @blur="date = parseDate(createDateStartFomarted)"
                  ></v-text-field>
                  <v-date-picker
                    v-model="createDateStart"
                    no-title
                    @input="menu1 = false"
                    locale="vi"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 md3>
                <v-menu
                    ref="menu2"
                    :close-on-content-click="false"
                    v-model="menu2"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                >
                  <v-text-field
                    slot="activator"
                    v-model="createDateEndFomarted"
                    label="Đến ngày"
                    persistent-hint
                    append-icon="event"
                    box
                    @blur="date = parseDate(createDateEndFomarted)"
                  ></v-text-field>
                  <v-date-picker
                    v-model="createDateEnd"
                    no-title
                    @input="menu2 = false"
                    locale="vi"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 md3>
                  <v-text-field
                   
                    v-model="actionUser"
                    label="Người thao tác"
            
                    box
          
                  ></v-text-field>
              </v-flex>
              <v-flex xs12  md3 class="text-xs-right">
                <v-btn  color="blue darken-3" class="white--text" @click="search()">Tìm kiếm</v-btn>
                <v-btn  color="blue darken-3" class="white--text" @click="downLoadExcelRevesionLog()">Xuất Excel</v-btn>
              </v-flex>
          </v-layout>
          <v-layout wrap>
              <v-flex xs12>
                <v-data-table
                    :headers="haeders"
                    :items="revesionLogs"
                    class="table-landing table-bordered"
                    hide-actions
                >
                <template slot="items" slot-scope="props">
                    <td>
                       {{(parseInt(page)*10)-10 + props.index +1}} 
                    </td>
                    <td>
                        {{props.item.actionUser}}
                    </td>
                    <td>
                        {{props.item.actionName}}
                    </td>
                    <td>
                        {{props.item.createDate.substr(0,10)}}
                    </td>
                    <td>
                        {{props.item.actionNote}}
                    </td>
                </template>
                <template slot="no-data">
                    <div class="text-xs-center mt-2">
                        Không có dữ liệu
                    </div>
                </template>
                </v-data-table>
              </v-flex>
                <v-flex xs12>
                  <div class="text-xs-right layout wrap" style="position: relative;">
                    <div class="flex pagging-table"> 
                      <tiny-pagination :total="total" :page="page" custom-class="custom-tiny-class" 
                        @tiny:change-page="paggingData" ></tiny-pagination> 
                    </div>
                  </div>
                </v-flex>
          </v-layout>
      </div>
    </v-card>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import TinyPagination from './Pagination.vue'

Vue.use(toastr)
export default {
  props: ['index'],
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    menu1: false,
    menu2: false,
    snackbarerror: false,
    snackbarsuccess: false,
    createDateStartFomarted: '',
    createDateEndFomarted: '',
    createDateStart: '',
    createDateEnd: '',
    haeders: [   
        {
            text: 'STT',
            align: 'center',
            sortable: false            
        }, 
        {
            text: 'Người thao tác',
            align: 'center',
            sortable: false
        }, 
        {
            text: 'Thao tác',
            align: 'center',
            sortable: false
        }, 
        {
            text: 'Ngày tạo',
            align: 'center',
            sortable: false
        }, 
        {
            text: 'Ghi chú',
            align: 'center',
            sortable: false
        }
    ],
    revesionLogs: [],
    page: 1,
    total: 0,
    actionUser: ''
  }),
  computed: {

  },
  watch: {
    createDateStart (val) {
      this.createDateStartFomarted = this.formatDate(this.createDateStart)
    },
    createDateEnd (val) {
      this.createDateEndFomarted = this.formatDate(this.createDateEnd)
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
        
        vm.getRevesionLog()
    })
  },

  methods: {
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    parseDate(date) {
        if (!date) return null;

        const [month, day, year] = date.split("/");
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    search(){
      let vm = this
      vm.page = 1
      vm.getRevesionLog()
    },
    getRevesionLog () {
        let vm = this
        let filter = {
            start: vm.page*10 -10,
            end: vm.page*10,
            order: true,
            createDateStart: vm.createDateStartFomarted,
            createDateEnd: vm.createDateEndFomarted,
            actionUser: vm.actionUser,
        }
        vm.revesionLogs = []
        vm.$store.dispatch('getRevesionLog',filter).then(function (result) {
          console.log(result)
          vm.revesionLogs=result.data
          vm.total = result.total
        }).catch(function (){})
    },
    paggingData (config) {
        let vm = this
        vm.page = config.page
        vm.getRevesionLog()
      
    },
    downLoadExcelRevesionLog () {
      let vm = this
      let filter = {
          order: true,
          createDateStart: vm.createDateStartFomarted,
          createDateEnd: vm.createDateEndFomarted,
          actionUser: vm.actionUser,
          export: true
      }
      vm.$store.dispatch('downLoadExcelRevesionLog', filter).then(()=>{

      })
    }
  }
}
</script>
