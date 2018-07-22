<template>
    <my-dynamic-view></my-dynamic-view>
</template>

<script>
import Vue from 'vue/dist/vue.js'
export default {
  props: {
    item: {
      type: Object,
      default () {
        return {
          dossierId: 0
        }
      }
    },
    layout_view: {
      type: Object
    }
  },
  created () {
    let vm = this
    Vue.component('my-dynamic-view', {
      template: vm.layout_view['template'],
      data: eval(' ( ' + vm.layout_view['data'] + ' ) '),
      created: eval(' ( ' + vm.layout_view['created'] + ' ) '),
      methods: eval(' ( ' + vm.layout_view['methods'] + ' ) ')
    })
  }
}
</script>
