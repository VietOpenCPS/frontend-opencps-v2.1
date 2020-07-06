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
          Số thứ tự, số theo dõi
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn dark icon v-on:click.native="backToList">
          <v-icon>reply</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="grid-list mt-3">
          <v-layout wrap>
              <v-flex xs12 md4>
                <v-autocomplete
                    class="select-border"
                    :items="govAgencys"
                    v-model="govAgencyCodeSelected"
                    label="Cơ quan"
                    item-text="itemName"
                    item-value="itemCode"
                    :hide-selected="true"
                    @change="changeGovAgencyCode()"
                    box
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12 md4>
                <v-autocomplete
                    class="select-border"
                    :items="registerBooks"
                    v-model="registerBookCodeSelectd"
                    label="Sổ theo dõi"
                    item-text="itemName"
                    item-value="itemCode"
                    :hide-selected="true"
                    @change="changeRegisterBookCode()"
                    box
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12 md4>
                <v-text-field
                    class="select-border"
                    v-model="counter"
                    box
                ></v-text-field>
              </v-flex>
              <v-flex xs12 class="text-xs-right">
                  <v-btn small color="blue darken-3" class="white--text" @click="postCounters()">Gửi đi</v-btn>
              </v-flex>
          </v-layout>
      </div>
    </v-card>
    <v-snackbar
      v-model="snackbarsuccess"
      :bottom="false"
      :left="false"
      :multi-line="false"
      :right="true"
      :timeout="2000"
      :top="true"
      :vertical="false"
      color="success"
    >
      Yêu cầu thực hiện thành công
      <v-btn
        icon
        @click="snackbarsuccess = false"
      >
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="snackbarerror"
      :bottom="false"
      :left="false"
      :multi-line="false"
      :right="true"
      :timeout="2000"
      :top="true"
      :vertical="false"
      color="#EF5350"
    >
      Yêu cầu thực hiện thất bại
      <v-btn
        icon
        @click="snackbarerror = false"
      >
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'

Vue.use(toastr)
export default {
  props: ['index'],
  components: {
  },
  data: () => ({
    snackbarerror: false,
    snackbarsuccess: false,
    govAgencys: [],
    registerBooks: [],
    govAgencyCodeSelected: '',
    registerBookCodeSelectd: '',
    counter: ''
  }),
  computed: {

  },
  created () {
    let vm = this
    // 
    vm.$nextTick(function () {
        vm.$store.dispatch('REGISTER_GOVAGENCY').then(function (result) {
          if(result && result.length > 0){
            vm.govAgencys = result
          } else {
            vm.$store.dispatch('getRegisterBookList').then(function (result2) {
              vm.govAgencys = result2
            }).catch(function (){})
          }
          
        }).catch(function (){})
        vm.$store.dispatch('getRegisterBookList').then(function (result) {
          vm.registerBooks = result
        }).catch(function (){})
    })
  },
  watch: {

  },
  methods: {
      changeGovAgencyCode(){
          setTimeout(()=>{
              this.getCounters()
          }, 100)
          
      },
      changeRegisterBookCode(){
          setTimeout(()=>{
              this.getCounters()
          }, 100)
      },
      getCounters(){
          let vm = this
          if(vm.govAgencyCodeSelected && vm.registerBookCodeSelectd){
              let filter = {
                  registerBookCode: vm.registerBookCodeSelectd,
                  govAgencyCode: vm.govAgencyCodeSelected 
              }
              vm.$store.dispatch('getCounters', filter).then(function (result) {
                  console.log(result)
                  vm.counter = result
              }).catch(function (){})   
          }
      },
      postCounters (){
          let vm = this
          if(vm.govAgencyCodeSelected && vm.registerBookCodeSelectd){
              let filter = {
                  registerBookCode: vm.registerBookCodeSelectd,
                  govAgencyCode: vm.govAgencyCodeSelected,
                  countNum: vm.counter
              }
              vm.$store.dispatch('postCounters', filter).then(function (result) {
                  vm.snackbarsuccess = true
              }).catch(function (){})   
          }  
      }

  }
}
</script>
