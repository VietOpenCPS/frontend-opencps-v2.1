<template>
    <my-dynamic-view v-if="(layout_view !== null && layout_view !== undefined && layout_view !== 'undefined')"></my-dynamic-view>
</template>

<script>
import Vue from 'vue/dist/vue.min.js'
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
    console.log('vm.layout_view', vm.layout_view)
    console.log((vm.layout_view !== null && vm.layout_view !== undefined && vm.layout_view !== 'undefined'))
    if (vm.layout_view !== null && vm.layout_view !== undefined && vm.layout_view !== 'undefined') {
      console.log('1AAAAAAAA')
      Vue.component('my-dynamic-view', {
        template: vm.layout_view['template'],
        data: eval(' ( ' + vm.layout_view['data'] + ' ) '),
        created: eval(' ( ' + vm.layout_view['created'] + ' ) '),
        updated: eval(' ( ' + vm.layout_view['updated'] + ' ) '),
        methods: vm.layout_view['methods']
      })
    }
  }
}
</script>
