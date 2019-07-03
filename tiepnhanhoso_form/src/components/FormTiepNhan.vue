<template>
  <my-dynamic-view
    v-if="(vuejx_form !== null && vuejx_form !== undefined && vuejx_form !== 'undefined') && render"
  ></my-dynamic-view>
</template>

<script>
import Vue from 'vue'
export default {
  props: {
    vuejx_form: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      render: false
    };
  },
  mounted() {
    let vm = this
    vm.render = false
    if (
      vm.vuejx_form !== null &&
      vm.vuejx_form !== undefined &&
      vm.vuejx_form !== "undefined"
    ) {
      vm.vuejx_form = eval("( " + vm.vuejx_form + " ) ");
      Vue.component("my-dynamic-view", {
        template: vm.vuejx_form["template"],
        data: eval(" ( " + vm.vuejx_form["data"] + " ) "),
        beforeCreate: eval(" ( " + vm.vuejx_form["beforeCreate"] + " ) "),
        created: eval(" ( " + vm.vuejx_form["created"] + " ) "),
        beforeMount: eval(" ( " + vm.vuejx_form["beforeMount"] + " ) "),
        mounted: eval(" ( " + vm.vuejx_form["mounted"] + " ) "),
        beforeUpdate: eval(" ( " + vm.vuejx_form["beforeMount"] + " ) "),
        updated: eval(" ( " + vm.vuejx_form["updated"] + " ) "),
        beforeDestroy: eval(" ( " + vm.vuejx_form["beforeDestroy"] + " ) "),
        destroyed: eval(" ( " + vm.vuejx_form["destroyed"] + " ) "),
        methods: vm.vuejx_form["methods"]
      });
      vm.render = true
    }
  }
};
</script>