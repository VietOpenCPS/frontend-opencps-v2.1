<template>
    <my-dynamic-view v-if="(layout_view !== null && layout_view !== undefined && layout_view !== 'undefined')"></my-dynamic-view>
</template>

<script>
import Vue from 'vue'
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
    if (vm.layout_view !== null && vm.layout_view !== undefined && vm.layout_view !== 'undefined') {
      Vue.component('my-dynamic-view', {
        template: vm.layout_view['template'],
        data: eval(' ( ' + vm.layout_view['data'] + ' ) '),
        beforeCreate: eval(' ( ' + vm.layout_view['beforeCreate'] + ' ) '),
        created: eval(' ( ' + vm.layout_view['created'] + ' ) '),
        updated: eval(' ( ' + vm.layout_view['updated'] + ' ) '),
        methods: vm.layout_view['methods']
      })
    }
  }
}
</script>
