<template>
  <div class="form-chitiet">
    <div class="row-header">
      <div class="background-triangle-big"> <span>BÁO CÁO</span> </div>
      <div class="layout row wrap header_tools row-blue">
        <div class="flex xs8 sm10 pl-3 text-ellipsis text-bold">
          {{loadingMenuConfigToDo[index]['title']}}
        </div>
      </div> 
    </div>
    <v-card class="report__filter">
      <v-container fill-height fluid>
        <v-layout wrap>
          <v-flex xs12 sm2>
            <v-subheader class="pl-0 text-header">Đơn vị: </v-subheader>
          </v-flex>
          <v-flex xs12 sm4>
            1312312
          </v-flex>
          <v-flex xs12 sm2>
            <v-subheader class="pl-0 text-header">Tháng/Năm: </v-subheader>
          </v-flex>
          <v-flex xs12 sm4>
            <v-menu
              ref="menu"
              :close-on-content-click="false"
              v-model="menu"
              :nudge-right="40"
              :return-value.sync="date"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="date"
                append-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker
                v-model="date"
                type="month"
                no-title
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
              </v-date-picker>
            </v-menu>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    <vue-friendly-iframe src="https://www.pexels.com/search/tiger"></vue-friendly-iframe>
  </div>
</template>

<script>
import router from '@/router'
import VueFriendlyIframe from 'vue-friendly-iframe'

export default {
  props: ['index', 'id'],
  components: {
    'vue-friendly-iframe': VueFriendlyIframe
  },
  data: () => ({
    danhSachBaoCaos: [],
    date: null,
    menu: false,
    modal: false
  }),
  computed: {
    loadingMenuConfigToDo () {
      return this.$store.getters.loadingMenuConfigToDo
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
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
      let currentQuery = newRoute.query
    }
  },
  methods: {
  }
}
</script>
