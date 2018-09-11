<template>
  <div> 
    <v-flex xs12 sm12 class="text-xs-center">
      <span>Kéo thả các ô vuông để cho đúng thứ tự của từ</span> <br>
      <v-chip label style="background-color: #81D4FA;" text-color="white">
        {{captcha}}
      </v-chip>
    </v-flex>
    <div v-drag-and-drop:options="options" class="drag-wrapper" class="text-xs-center mt-3">
      <ul id="captcha">
        <li class="item-captcha" v-for="(item, index) in arrCaptcha" style="padding: 10px 15px; background-color: #81D4FA; margin-right: 2px; color: #fff; font-weight: bold;">{{item}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import $ from 'jquery'
export default {
  props: ['index'],
  components: {
  },
  data: () => ({
    options: {},
    arrCaptcha: [],
    captcha: '',
    currentlyDragging: null,
    loggedEvent: '',
    images: [{name: 'Image 1', src: 'http://placehold.it/100/000000/ffffff'},
    {name: 'Image 2', src: 'http://placehold.it/100/C93742/ffffff'},
    {name: 'Image 3', src: 'http://placehold.it/100/6894D1/ffffff'}
    ]
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  created () {
    var vm = this
    vm.makeRandomString()
    vm.shuffleArrCaptcha(vm.arrCaptcha)
  },
  watch: {
  },
  methods: {
    makeRandomString () {
      var vm = this
      var text = ''
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      for (var i = 0; i < 4; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
      }
      if (text) {
        vm.arrCaptcha = vm.shuffleArrCaptcha(text.split(''))
      }
      vm.captcha = text
    },
    shuffleArrCaptcha (arra1) {
      var ctr = arra1.length
      var temp = null
      var index = 0
      while (ctr > 0) {
        index = Math.floor(Math.random() * ctr)
        ctr--
        temp = arra1[ctr]
        arra1[ctr] = arra1[index]
        arra1[index] = temp
      }
      return arra1
    },
    checkValidCatcha () {
      var vm = this
      var str = ''
      let items = $('#captcha').children()
      console.log(items)
      for (var i = 0; i < items.length; i++) {
        str += items[i].innerHTML
      }
      if (vm.captcha === str) {
        return true
      } else {
        return false
      }
    }
  },
  filters: {
    dateTimeView (arg) {
      if (arg) {
        let value = new Date(arg)
        return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()}`
      } else {
        return ''
      }
    }
  }
}
</script>
