<template>
    <my-dynamic-view v-if="(template_default !== null && template_default !== undefined && template_default !== 'undefined')"></my-dynamic-view>
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
    },
    template_default: {
      type: Object
    }
  },
  created () {
    let vm = this
    let template = ''
    let data = '{}'
    let created = '{}'
    let updated = '{}'
    let methods = '{}'
    if (vm.layout_view !== null && vm.layout_view !== undefined && vm.layout_view !== 'undefined') {
      Vue.component('my-dynamic-view', {
        template: vm.layout_view['template'],
        data: eval(' ( ' + vm.layout_view['data'] + ' ) '),
        created: eval(' ( ' + vm.layout_view['created'] + ' ) '),
        updated: eval(' ( ' + vm.layout_view['updated'] + ' ) '),
        methods: vm.layout_view['methods']
      })
    } else if (vm.template_default !== null && vm.template_default !== undefined && vm.template_default !== 'undefined') {
      Vue.component('my-dynamic-view', {
        template: vm.template_default['template'],
        data: eval(' ( ' + vm.template_default['data'] + ' ) '),
        created: eval(' ( ' + vm.template_default['created'] + ' ) '),
        updated: eval(' ( ' + vm.template_default['updated'] + ' ) '),
        methods: vm.template_default['methods']
      })
    }
  }
}
</script>
