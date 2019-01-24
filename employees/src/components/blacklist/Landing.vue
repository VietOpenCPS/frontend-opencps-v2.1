<template>
  <v-layout justify-center>
    <v-flex xs12>
      <v-card>
        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <v-flex
              v-for="card in cards"
              xs3
              :key="card.title"
            >
              <v-card>
                <v-img :src="card.src" height="200px">
                  <v-container fill-height fluid pa-2>
                    <v-layout fill-height>
                      <v-flex xs12 align-end flexbox>
                        <span class="headline white--text" v-text="card.title"></span>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-img>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn icon>
                    <v-icon>favorite</v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon>bookmark</v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon>share</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import support from '../../store/support.json'
import toastr from 'toastr'
import Captcha from './Captcha.vue'
// import Suggestions from 'v-suggestions'
Vue.use(toastr)
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  props: [],
  components: {
    'captcha': Captcha
  },
  data: () => ({
    loading: false,
    cards: [
      { title: 'Pre-fab homes', src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg'},
      { title: 'Favorite road trips', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg'},
      { title: 'Best airlines', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg'}
    ]
  }),
  computed: {
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      var vm = this
      let current = vm.$router.history.current
      let currentQuery = current.query
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
  }
}
</script>
