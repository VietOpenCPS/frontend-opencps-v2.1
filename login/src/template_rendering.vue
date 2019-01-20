<template>
    <my-dynamic-view></my-dynamic-view>
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
      template = vm.layout_view['template']
      data = vm.layout_view['data']
      created = vm.layout_view['created']
      updated = vm.layout_view['updated']
      methods = vm.layout_view['methods']
    } else if (vm.template_default !== null && vm.template_default !== undefined && vm.template_default !== 'undefined') {
      template = vm.template_default['template']
      data = vm.template_default['data']
      created = vm.template_default['created']
      updated = vm.template_default['updated']
      methods = vm.template_default['methods']
    }

    console.log('vm.template', template)
    console.log('data', data)
    Vue.component('my-dynamic-view', {
      template: template,
      data: eval(' ( ' + data + ' ) '),
      created: eval(' ( ' + created + ' ) '),
      updated: eval(' ( ' + updated + ' ) '),
      methods: methods
    })
  }
}
</script>
